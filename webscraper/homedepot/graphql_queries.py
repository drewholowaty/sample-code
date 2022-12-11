import json
import os

from pathlib import Path

_product_detail_query_path = Path(__file__).parent / os.getenv(
    "PRODUCT_DETAIL_QUERY", "../config/queries/product_detail_query.txt"
)
_product_list_query_path = Path(__file__).parent / os.getenv(
    "PRODUCT_LIST_QUERY", "../config/queries/product_list_query.txt"
)

with open(_product_detail_query_path, "r", encoding="utf8") as f:
    _product_detail_query = f.read()

with open(_product_list_query_path, "r", encoding="utf8") as f:
    _product_list_query = f.read()


class ProductDetailsGraphQLQuery:
    query = _product_detail_query

    @staticmethod
    def get_variables(item_id, store_id):
        return {"itemId": item_id, "storeId": store_id}

    @classmethod
    def get_payload(cls, item_id, store_id):
        variables = cls.get_variables(item_id, store_id)

        payload = {"query": cls.query, "variables": variables}

        json_payload = json.dumps(payload)

        return json_payload


class ProductListGraphQLQuery:
    query = _product_list_query

    @staticmethod
    def get_variables(department_id, start_index):
        variables = {
            "storefilter": "ALL",
            "additionalSearchParams": {
                "plp": "true",
            },
            "orderBy": {"field": "TOP_SELLERS", "order": "ASC"},
            "pageSize": 48,
            "navParam": department_id,
            "startIndex": start_index,
        }

        return variables

    @classmethod
    def get_payload(cls, department_id, start_index):
        variables = cls.get_variables(department_id, start_index)

        payload = {"query": cls.query, "variables": variables}

        json_payload = json.dumps(payload)

        return json_payload
