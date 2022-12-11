from dataclasses import asdict
from datetime import date
import itertools
import logging

import lowes
import homedepot
import asyncio
import boto3

dynamodb = boto3.resource("dynamodb")

table = dynamodb.Table("ps-webscraper-products")

lowes_stores = ["1175", "2572"]
lowes_departments = ["4294684461"]

homedepot_stores = ["4702"]
homedepot_departments = ["N-5yc1vZcfv3"]

logging.getLogger("backoff").addHandler(logging.StreamHandler())

date_today = date.today()

loop = asyncio.get_event_loop()

lowes_products, homedepot_products = loop.run_until_complete(
    asyncio.gather(
        lowes.product_webscraper.get_products(
            lowes_stores, lowes_departments, date_today
        ),
        homedepot.product_webscraper.get_products(
            homedepot_stores, homedepot_departments, date_today
        ),
    )
)

with table.batch_writer() as batch:
    for item in itertools.chain(lowes_products, homedepot_products):
        batch.put_item(Item=asdict(item))
