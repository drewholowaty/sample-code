from decimal import Decimal
import logging
import sys
import json
import asyncio
import httpx

from aiolimiter import AsyncLimiter
from backoff import on_exception, expo
from common.classes import Product
from common.exceptions import WebscraperResponseError
from .graphql_queries import ProductListGraphQLQuery
from .graphql_queries import ProductDetailsGraphQLQuery

STORE = "HOMEDEPOT"
DEFAULT_STORE = 100
MAX_OFFSET = 720
URL = "https://www.homedepot.com/federation-gateway/graphql"
RATE_LIMIT = AsyncLimiter(10, 1)


async def get_products(store_ids, department_urls, date):
    logging.info("Started HomeDepot webscraper for %s", date)
    product_ids_by_department = await get_product_ids(department_urls)

    products = []

    tasks = (
        get_product(product_id, deparment_id, store_ids, date)
        for deparment_id, product_ids in product_ids_by_department.items()
        for product_id in product_ids
    )
    products = await asyncio.gather(*tasks)

    return products


async def get_product(product_id, department_id, store_ids, date):
    payload = ProductDetailsGraphQLQuery.get_payload(product_id, DEFAULT_STORE)

    async with httpx.AsyncClient() as client:
        get_prices_task = (
            get_price_by_store(client, product_id, store_id) for store_id in store_ids
        )
        json_data, *prices = await asyncio.gather(
            get_json(client, payload), *get_prices_task
        )

    product_data = json_data["data"]

    product_specs = get_product_specs(product_data)

    name = product_data["product"]["identifiers"]["productLabel"]

    upc = product_data["product"]["identifiers"]["upc"]

    product = Product(
        int(product_id),
        int(upc),
        name,
        department_id,
        date.isoformat(),
        STORE,
        dict(prices),
        product_specs,
    )

    return product


def get_product_specs(product_data):
    raw_specs_data = None

    product_specs = {}

    raw_specs_data = product_data["product"]["specificationGroup"]

    if raw_specs_data:
        for spec_group in raw_specs_data:
            spec_group_specs = spec_group["specifications"]
            for spec in spec_group_specs:
                product_specs[spec["specName"]] = spec["specValue"]

    return product_specs


async def get_price_by_store(client, product_id, store_id):
    payload = ProductDetailsGraphQLQuery.get_payload(product_id, store_id)

    price_data = await get_json(client, payload)

    price = None

    try:
        price = price_data["data"]["product"]["pricing"]["value"]
    except TypeError:
        logging.warning("Price not found for: %s", product_id)

    return (store_id, Decimal(str(price)))


async def get_product_ids_by_department(client, department_id):

    offset = 0
    max_items = None
    product_ids = set()

    while offset <= (max_items or sys.maxsize) and offset < MAX_OFFSET:
        payload = ProductListGraphQLQuery.get_payload(department_id, offset)

        raw_json_data = await get_json(client, payload)

        search_data = raw_json_data["data"]["searchModel"]

        if max_items is None:
            max_items = search_data["searchReport"]["totalProducts"]

        items = search_data["products"]

        current_product_ids = {item["itemId"] for item in items}

        product_ids.update(current_product_ids)

        offset = offset + 48

    return {department_id: product_ids}


async def get_product_ids(department_urls):
    product_ids = dict()

    async with httpx.AsyncClient() as client:
        tasks = (
            get_product_ids_by_department(client, department_url)
            for department_url in department_urls
        )
        product_ids.update(*await asyncio.gather(*tasks))

    return product_ids


@on_exception(expo, WebscraperResponseError, max_tries=8)
async def get_json(client, payload):
    headers = {
        "x-experience-name": "hd-home",
        "content-type": "application/json",
        "host": "www.homedepot.com",
    }

    async with RATE_LIMIT:
        req = httpx.Request("POST", URL, data=payload, headers=headers)
        response = await client.send(req)

    if response.status_code != 200:
        raise WebscraperResponseError(req, response)

    return json.loads(response.text)
