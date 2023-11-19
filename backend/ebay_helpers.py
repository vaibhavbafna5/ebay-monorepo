import requests
import base64
import json
import requests
import gspread
import pandas as pd
from tqdm import tqdm

from typing import Optional
from typing import Dict
from typing import Any
from typing import List

from collections import defaultdict

from ebaysdk.finding import Connection as Finding
from ebaysdk.exception import ConnectionError

# eBay API credentials
CLIENT_ID = "VAIBHAVB-test-PRD-fae485a12-fc42ba4e"
CLIENT_SECRET = "PRD-ae485a12e6c9-752d-452d-906c-fec5"
API = Finding(appid="RohanBaf-Comp-PRD-8755572ba-b44693c9", config_file=None)

# Google credentials
GOOGLE_CREDENTIALS_V2 = {
    "type": "service_account",
    "project_id": "gobstopper",
    "private_key_id": "effa2ecd9bb975211c543ada23612ab47175c29e",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCX41bhnUkBCQLZ\nPnn/dxTF8IWzasV5J/kCt+wsX7KrkbqQ86wLsVaY5XY6CsveBm9Qj7nH7rqBwzoQ\niDwAjFSIxmoQI7ZUhqQakGi1exodqTDUX6+vfn8mSw2anJp6/tYbrC69y1zZ4518\n3eBnZRyw+TUpdb2PO3RGnH18YxU0+e4cio3aidt4LcqIgZ2tl1Wv6qAHgvPCbQf9\nJp4w+apbEevt8K9a+pBMxvpHllLE24wO0LLTARaEP4s5ndjTWhm6xtuVBIqhFKx0\nOZ3PcM8Vhat3ha9ZY14coP8xkE5/wQ2USXW0LaM1eNkRX/w9lFWCBb2LdMidlgUT\nCl7peZf3AgMBAAECggEABmTYAjt8ZCDmwWNxUZQZaxZ3SyFLwJA+K1fPB0AWy6IV\nRHXZ6TUCKUd7lmWmOdgtxnBIpeNlb18VO59iuz7+hUnXh9DbOtqwsTBPt2O0fCZY\nxxuSFc30YX6GVtrtd4Pw5hkM+zfCs6a4irjlTw2vv6aNSTpiI4JPzv+FAy6HV7Iw\njPs7MryrqqXCmVhAznUfbmiVSKv+yJiJUqQpCwosqbl0UvylApbFSkzYuspzeijv\nmRyHuBYWj0k3DppodU77/6LOlv4o90w04Yo2x6s7TKH9T1bOrrAdM8dA1cOMlZiK\n9EhnDu3xvTu0CibqbfC0LrZO9Ho4MXeAuMklbJ1n4QKBgQDV+aWC1JXVoMOxhm1N\nYuICnGfxWjkYhippWVW8M4WYvZ2J73/svb4S+le/+HLHZVhotlSU3SAVtSazmADZ\nTM99r9Lw4aapmNNrtU/x6vdPgjrSMzn30CpobHpZ44B87Gv+9Vgh0VXiFZiEuKEy\nUpazjUXkNZjitx2t1nrDqe7QFwKBgQC1uAtHGKRQrZbImkryEDJsJNtj7SIF90yC\ncs1mDEnQFo3OtY4uAexQ4pDBsCceCpcqZLecwQBRy08rbB0UM8bF/p7/8GRh63gd\nQEf0y6j/gGDTGFxQ9ZWTfqrieFOZrRMMRmt/py1qRZJtL6WXqMI+L/SmHPLgsfCt\nsRgtMJODIQKBgBWZADrHaGRKuNX3Ypr4CyYGUXuMBs1R5YACs2Ous6JqKTeeBASK\nVmAmAqtu0W8M7LKNDNaFx1JJmaFxC0zjsuHV2G3V6POfaF+rymj5tYLB+1vyLby0\nt0MZB/SAwRxa5L+0VfP75DZQxbdHx4WDzpBLBy30tvzTTNyaFIQhZ+h7AoGAFxsA\nrBiRBAUecAFWWDMBBkklcC49rj6Ehu2r+jbDx+amP0tMecMa1ioIt+f7AVHdaLGH\nuzG7JatRNLc5d1EiDBjVBLv/N4gmLKn4vEKNCXe8V/r3+f9P9oIbnlIoZxjfnCb0\nEjYiiymvdZyiVIdLs3aLh/eUVkepz5v98/kCOKECgYAyWak36mgn3wawL01IhcFl\n7/s3HE4p8vKx4DzzbOxB9+4/wPTV+KSpcx6CjD8ETW0Gbutz+19QgeMvRPQrG+uq\ny4PYpZ9oPjgarCEGvB6OGgcaXydmAKnPbRMbDCqK71jhDQFayVkA1LP9yV5iQ3Q+\nWU5MLVEi68M32l4ht/P10A==\n-----END PRIVATE KEY-----\n",
    "client_email": "gobstopper@gobstopper.iam.gserviceaccount.com",
    "client_id": "118428723876350460394",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/gobstopper%40gobstopper.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}


sheets_client = gspread.service_account_from_dict(GOOGLE_CREDENTIALS_V2)


def get_products_to_keywords() -> Dict[str, list]:
    sh = sheets_client.open("ebay input spreadsheet")

    product_to_keywords = {}
    for sheet in sh.worksheets():
        product_to_keywords[sheet.title] = sheet.col_values(1)

    return product_to_keywords


def get_access_token() -> str:
    token_url = "https://api.ebay.com/identity/v1/oauth2/token"

    # eBay API scope (for client credentials grant flow)
    scope = "https://api.ebay.com/oauth/api_scope"

    # Fetch the access token
    token_payload = {
        "grant_type": "client_credentials",
        "scope": scope,
    }
    client_credentials = f"{CLIENT_ID}:{CLIENT_SECRET}"
    token_headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic "
        + base64.b64encode(client_credentials.encode("utf-8")).decode("utf-8"),
    }
    try:
        token_response = requests.post(
            token_url, data=token_payload, headers=token_headers
        )
        return token_response.json()["access_token"]
    except Exception:
        return None


def get_single_item(item_id: str, access_token: str) -> Optional[str]:
    # eBay API endpoint for GetSingleItem
    url = "https://open.api.ebay.com/shopping"

    # eBay API call parameters
    params = {
        "callname": "GetSingleItem",
        "responseencoding": "JSON",
        "appid": CLIENT_ID,
        "version": "967",
        "siteid": "0",
        "ItemID": item_id,
        "IncludeSelector": "Variations,Details,ItemSpecifics",
    }

    # Add the access token to the headers
    headers = {
        "X-EBAY-API-CALL-NAME": "GetSingleItem",
        "X-EBAY-API-APP-ID": CLIENT_ID,
        "X-EBAY-API-VERSION": "967",
        "X-EBAY-API-SITE-ID": "0",
        "X-EBAY-API-REQUEST-ENCODING": "JSON",
        "X-EBAY-API-IAF-TOKEN": access_token,
    }

    # Make the API call
    try:
        response = requests.get(url, headers=headers, params=params)
        return response.json()
    except:
        return None


def write_product_to_spreadsheet(product_name: str, df: pd.DataFrame):
    sh = sheets_client.open("ebay output spreadsheet")

    worksheets = sh.worksheets()
    product_to_sheet = {}

    for worksheet in worksheets:
        product_to_sheet[worksheet.title] = worksheet

    worksheet = product_to_sheet.get(product_name, None)
    if not worksheet:
        # create new worksheet that corresponds to product name
        worksheet = sh.add_worksheet(title=product_name, rows="100", cols="20")

    worksheet.clear()
    worksheet.update([df.columns.values.tolist()] + df.values.tolist())


def write_all_products_to_spreadsheet():
    headers = ["ItemID", "UserID", "Title", "Price", "ShippingPrice", "Link"]

    products_to_keywords = get_products_to_keywords()
    keywords_list = get_items_by_keywords_list(products_to_keywords)

    for keyword in tqdm(keywords_list):
        df = pd.DataFrame(keywords_list[keyword], columns=headers)
        write_product_to_spreadsheet(keyword, df)


def write_all_products_to_json_raw():
    products_to_keywords = get_products_to_keywords()
    raw_products = generate_dict_of_products_to_sellers_to_items(products_to_keywords)
    file_path = "raw_products.json"

    # Open the file in write mode
    with open(file_path, "w") as json_file:
        # Write the dictionary to the JSON file
        json.dump(raw_products, json_file)

    print("done")


def generate_dict_of_products_to_sellers_to_items(products_to_keywords):
    """
    Returns a dictionary that maps from product keyword :

    {
        '30333': {
            "seller_username_to_listings": {
                'gbafna': {
                    'raw_ebay_responses': [],
                    'parsed_responses': [],
                },
                'houselabels': {
                    'raw_ebay_responses': [],
                    'parsed_responses': [],
                }
            },
            "keywords": [keywords],
        },
        '30257': {
            "seller_username_to_listings": {
                'gbafna': {
                    'raw_ebay_responses': [],
                    'parsed_responses': [],
                },
                'houselabels': {
                    'raw_ebay_responses': [],
                    'parsed_responses': [],
                }
            },
            "keywords": [keywords],
        },
    }
    """

    def preset_dict():
        return {
            "raw_ebay_responses": [],
            "parsed_responses": [],
            "raw_ebay_responses_v2": {},
        }

    def process_variations(variations_container):
        variations_wrapper = {}
        variations_map = {}
        
        for variation in variations_container['Variation']:
            key = variation['VariationSpecifics']['NameValueList'][0]['Value'][0]
            metadata = {
                'currency': variation['StartPrice']['CurrencyID'],
                'price': variation['StartPrice']['Value'],
                'quantity_sold': variation['SellingStatus']['QuantitySold'],
                'flavor': key,
            }
            variations_map[key] = metadata
            variations_wrapper['category'] = variation['VariationSpecifics']['NameValueList'][0]['Name']

        variations_wrapper['variations'] = variations_map
        variations_wrapper['variations_values'] = variations_container["VariationSpecificsSet"]["NameValueList"][0]["Value"]
        return variations_wrapper
            

    product_to_meta = {}

    for label_name in products_to_keywords:
        keywords = products_to_keywords[label_name]
        list_of_rows = []
        seller_username_to_listings = defaultdict(preset_dict)
        for search_query in keywords:
            payload = {
                "keywords": search_query,
                "outputSelector": ["SellerInfo", "AspectHistogram", "StoreInfo"],
                "sortOrder": "BestMatch",
                "paginationInput": {"entriesPerPage": 100},
            }
            response = API.execute(
                "findItemsByKeywords",
                payload,
            )
            try:
                num_pages = int(response.dict().get('paginationOutput').get('totalPages'))
                num_pages = min(num_pages, 3)
            except Exception:
                print("Error getting number of pages in output")
                print(payload)
                print(response.dict())
                return


            for i in range(1, num_pages + 1):
                payload['paginationInput'] = {'entriesPerPage': 100, 'pageNumber': i}
                response = API.execute(
                    "findItemsByKeywords",
                    payload
                )
                resp = response.dict()
                items = resp["searchResult"]
                if items["_count"] != "0":
                    for item in items["item"]:
                        shipping = helper_get_shipping_cost(item)
                        item_resp = get_single_item(item["itemId"], get_access_token())
                        if "Variations" in item_resp["Item"]:
                            list_of_rows = helper_create_variation_rows(
                                list_of_rows, item_resp, shipping
                            )
                        else:
                            list_of_rows = helper_create_row(
                                list_of_rows, item_resp, shipping
                            )

                        seller_username = item["sellerInfo"]["sellerUserName"]
                        seller_username_to_listings[seller_username][
                            "raw_ebay_responses"
                        ].append(item)
                        seller_username_to_listings[seller_username][
                            "parsed_responses"
                        ].append(list_of_rows[-1])
                        if "Variations" in item_resp["Item"]:
                            item["variations"] = process_variations(item_resp["Item"]["Variations"])
                        else:
                            item["variations"] = {}
                            
                        # item["variations"] = item_resp["Item"].get("Variations", {})
                        seller_username_to_listings[seller_username]["raw_ebay_responses_v2"][item["itemId"]] = item

        product_to_meta[label_name] = {
            "seller_username_to_listings": seller_username_to_listings,
            "keywords": keywords,
        }

    return product_to_meta


def get_items_by_keywords_list(product_to_keywords):
    product_to_meta = {}
    for label_name in product_to_keywords:
        keywords = product_to_keywords[label_name]
        list_of_rows = []
        for search_query in keywords:
            response = API.execute(
                "findItemsByKeywords",
                {
                    "keywords": search_query,
                    "outputSelector": ["SellerInfo", "AspectHistogram", "StoreInfo"],
                    "sortOrder": "BestMatch",
                    "paginationInput": {"entriesPerPage": 25},
                },
            )
            resp = response.dict()
            items = resp["searchResult"]
            if items["_count"] != "0":
                for item in items["item"]:
                    shipping = helper_get_shipping_cost(item)
                    item_resp = get_single_item(item["itemId"], get_access_token())
                    if "Variations" in item_resp["Item"]:
                        list_of_rows = helper_create_variation_rows(
                            list_of_rows, item_resp, shipping
                        )
                    else:
                        list_of_rows = helper_create_row(
                            list_of_rows, item_resp, shipping
                        )

        product_to_meta[label_name] = list_of_rows
    return product_to_meta


def is_seller_item(item):
    return item["sellerInfo"]["sellerUserName"] in ["gbafna", "labels1235", "labelsfast", "labelsforme"]


def helper_get_shipping_cost(item):
    try:
        if item["shippingInfo"]["shippingServiceCost"]["value"] != "0.0":
            shipping = item["shippingInfo"]["shippingServiceCost"]["value"]
            return shipping
        else:
            return "free"
    except:
        return "free"


def helper_create_variation_rows(list_of_rows, item_resp, shipping):
    for variation in item_resp["Item"]["Variations"]["Variation"]:
        row = []
        row.append(item_resp["Item"]["ItemID"])
        row.append(item_resp["Item"]["Seller"]["UserID"])
        row.append(variation["VariationSpecifics"]["NameValueList"][0]["Value"][0])
        row.append(variation["StartPrice"]["Value"])
        row.append(shipping)
        row.append(item_resp["Item"]["ViewItemURLForNaturalSearch"])
        list_of_rows.append(row)
    return list_of_rows


def helper_create_row(list_of_rows, item_resp, shipping):
    row = []
    row.append(item_resp["Item"]["ItemID"])
    row.append(item_resp["Item"]["Seller"]["UserID"])
    row.append(item_resp["Item"]["Title"])
    row.append(item_resp["Item"]["CurrentPrice"]["Value"])
    row.append(shipping)
    row.append(item_resp["Item"]["ViewItemURLForNaturalSearch"])
    list_of_rows.append(row)
    return list_of_rows
