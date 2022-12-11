import asyncio
from decimal import Decimal
import sys
import json
import logging
import httpx

from aiolimiter import AsyncLimiter
from backoff import on_exception, expo
from common.classes import Product
from common.exceptions import WebscraperResponseError

STORE = "LOWES"
DEFAULT_STORE = 4
MAX_OFFSET = 576
PRODUCT_URL_TEMPLATE = "https://www.lowes.com/pd/{}/productdetail/{}/Guest/0"
DEPARTMENT_URL_TEMPLATE = "https://www.lowes.com/pl/category/{}"
RATE_LIMIT = AsyncLimiter(15, 5)


async def get_products(store_ids, department_urls, date):
    logging.info("Started Lowes webscraper for %s", date)
    product_ids_by_department = await get_product_ids(department_urls)

    products = []

    tasks = (
        get_product(product_id, deparment_id, store_ids, date)
        for deparment_id, product_ids in product_ids_by_department.items()
        for product_id in product_ids
    )
    products = await asyncio.gather(*tasks)

    return list(filter(None, products))


async def get_product(product_id, deparment_id, store_ids, date):
    product_url = PRODUCT_URL_TEMPLATE.format(product_id, DEFAULT_STORE)

    json_data = None

    async with httpx.AsyncClient() as client:
        try:
            json_data = await get_json(client, product_url)
        except WebscraperResponseError:
            logging.warning("Could not get product data for %s", product_id)
            return None

        get_prices_task = (
            get_price_by_store(client, product_id, store_id) for store_id in store_ids
        )
        prices = await asyncio.gather(*get_prices_task, return_exceptions=True)

    product_details = json_data["productDetails"]

    product_specs = get_product_specs(product_details, product_id)

    name = product_details[product_id]["product"]["description"]

    upc = product_details[product_id]["product"]["barcode"]

    product = Product(
        int(product_id),
        int(upc),
        name,
        deparment_id,
        date.isoformat(),
        STORE,
        dict(prices),
        product_specs,
    )

    return product


def get_product_specs(product_details, product_id):
    specs_data = None

    product_specs = {}

    try:
        specs_data = product_details[product_id]["product"]["specs"]
    except KeyError:
        logging.warning("Product specs not found for: %s", product_id)

    if specs_data:
        for spec in specs_data:
            product_specs[spec["key"]] = spec["value"]

    return product_specs


async def get_price_by_store(client, product_id, store_id):
    price_url = PRODUCT_URL_TEMPLATE.format(product_id, store_id)

    price_data = None

    price = None

    try:
        price_data = await get_json(client, price_url, store_id)
    except WebscraperResponseError:
        logging.warning("Could not get price data for %s at %s", product_id, store_id)

    try:
        if price_data:
            price = price_data["productDetails"][product_id]["price"]["analyticsData"][
                "sellingPrice"
            ]
    except TypeError:
        logging.warning("Price not found for: %s", product_id)

    return (store_id, Decimal(str(price)))


async def get_product_ids_by_department(client, department_id):
    url_template = (
        DEPARTMENT_URL_TEMPLATE.format(department_id)
        + "/products?maxResults=24&offset={}"
    )

    offset = 0
    max_items = None
    product_ids = set()

    while offset <= (max_items or sys.maxsize) and offset <= MAX_OFFSET:
        url = url_template.format(offset)

        data = await get_json(client, url)

        if max_items is None:
            max_items = data["itemCount"]

        items = data["itemList"]

        current_product_ids = {item["product"]["omniItemId"] for item in items}

        product_ids.update(current_product_ids)

        offset = offset + 24

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
async def get_json(client, url, store_id=DEFAULT_STORE):
    headers = {
        "host": "www.lowes.com",
        "connection": "keep-alive",
        "Cookie": "sn=" + str(store_id),
    }

    async with RATE_LIMIT:
        req = httpx.Request("GET", url, headers=headers)
        response = await client.send(req)

    if response.status_code != 200:
        raise WebscraperResponseError(req, response)

    return json.loads(response.text)
