---
sidebar_position: 9
title: Prices
---

Retrieve the latest price prediction for a region and market.
This endpoint always returns the latest prediction available
and the values of the response will change depending on the time of the day on which the request is made.
The data can be returned as **JSON** (default) or as a **CSV** file.

**Base path:** `/api/v0/prices/`

Requires **Bearer API key** and the correct permissions.

## Request

The endpoint only accepts the method **GET** and the URL path must include the region and market identifiers.

**GET** `https://api.ravenwits.com/api/v0/prices/<region>/<market>`

### URL parameters

| Name     | Type   | Required | Description                              |
| -------- | ------ | -------- | ---------------------------------------- |
| `region` | string | Yes      | Region identifier (e.g. `spain`)         |
| `market` | string | Yes      | Market identifier (e.g. `md_pdbc_spain`) |

### Supported region/market combinations

| `region` | `market`           |
| -------- | ------------------ |
| `spain`  | `md_pdbc_spain`    |
| `spain`  | `mid_pibc01_spain` |
| `spain`  | `mid_pibc02_spain` |
| `spain`  | `mid_pibc03_spain` |

### Query parameters

The supported parameters are specified on the table below.
Any other parameter specified in the request that do not appear in the documentation will make the request fail with a 400 error.

| Name     | Type   | Required | Description                                              |
| -------- | ------ | -------- | -------------------------------------------------------- |
| `format` | string | No       | Response format: `json` (default) or `csv`               |

### Content negotiation

The response format can be selected either via the `format` query parameter or the `Accept` header:

| `Accept` header / `format` param | Format returned         |
| --------------------------------- | ----------------------- |
| `application/json` / `json` (default) | JSON array of objects |
| `text/csv` / `csv`               | CSV file download       |

### Request (JSON)

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/prices/spain/md_pdbc_spain' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {your-api-key}'
```

### Request (CSV download)

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/prices/spain/md_pdbc_spain?format=csv' \
  --header 'Authorization: Bearer {your-api-key}' \
  --output spain_md_pdbc_spain.csv
```

## Response

Every response includes the `Last-Modified` header, which indicates when was the latest prediction generated.
This header follows [RFC 9110](https://datatracker.ietf.org/doc/html/rfc9110#section-8.8.2) format eg. `Last-Modified: Fri, 07 Aug 2026 13:10:00 GMT`.
The value of the header `Last-Modified` will change depending on the region and market requested because the predictions for all combinations are not generated at the same time.

The response has two fields, `datetime` and `price`.
`datetime` has the format `YYYY-MM-DD HH:MM` and is in the timezone of the market requested.
For example, for the Spanish market, the timezone is `Europe/Madrid` (UTC+2 in summer and UTC+1 in winter).
`price` is a decimal number with three digits after the decimal point and the unit is EUR/MWh.

### 200 OK — JSON

Returns an array of objects with two fields per row: `datetime` and `price`.

```json
[
  {"datetime": "2026-08-07 00:15", "price": "165.824"},
  {"datetime": "2026-08-07 00:30", "price": "164.077"},
  {"datetime": "2026-08-07 00:45", "price": "162.312"}
]
```

### 200 OK — CSV

Returns a semicolon-delimited CSV file.

```csv
datetime;price
2026-08-07 00:15;165.824
2026-08-07 00:30;164.077
2026-08-07 00:45;162.312
```

### Errors

#### 400 Bad Request

Bad request due to missing or invalid parameters.

```json
{"detail": "Unknown query parameters: ..."}
```

#### 401 Unauthorized

Missing or invalid Bearer API key.

```json
{"detail": "Authentication credentials were not provided."}
```

#### 403 Forbidden

Valid API key but the account does not have the required permissions.

```json
{"detail": "You do not have permission to perform this action."}
```

#### 406 Not Acceptable

The `Accept` header does not match any of the supported formats.

```json
{"detail": "Could not satisfy the request Accept header."}
```
