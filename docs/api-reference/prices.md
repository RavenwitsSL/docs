---
sidebar_position: 9
title: Prices
---

# Prices

Retrieve energy price predictions for a given region and market.

**Base path:** `/api/v0/prices/`

Requires **Bearer token**.

---

## Get prices prediction

Retrieve the latest price prediction for a region and market. The data can be returned as **JSON** (default) or as a **CSV** file.

**GET** `https://api.ravenwits.com/api/v0/prices/<region>/<market>`

Requires **Bearer token** and the correct permissions.

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

| Name     | Type   | Required | Description                                              |
| -------- | ------ | -------- | -------------------------------------------------------- |
| `format` | string | No       | Response format: `json` (default) or `csv`               |

### Content negotiation

The response format can be selected either via the `format` query parameter or the `Accept` header:

| `Accept` header / `format` param | Format returned         |
| --------------------------------- | ----------------------- |
| `application/json` / `json` (default) | JSON array of objects |
| `text/csv` / `csv`               | CSV file download       |

---

### Request (JSON)

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/prices/spain/md_pdbc_spain' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {your-token}'
```

### Response — 200 OK (JSON)

Returns an array of objects with two fields per row: `datetime` and `price`.

```json
[
  {"datetime": "2026-08-07 00:15", "price": "165.824"},
  {"datetime": "2026-08-07 00:30", "price": "164.077"},
  {"datetime": "2026-08-07 00:45", "price": "162.312"}
]
```

---

### Request (CSV download)

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/prices/spain/md_pdbc_spain?format=csv' \
  --header 'Authorization: Bearer {your-token}' \
  --output spain_md_pdbc_spain.csv
```

### Response — 200 OK (CSV)

Returns a semicolon-delimited CSV file.

```
datetime;price
2026-08-07 00:15;165.824
2026-08-07 00:30;164.077
2026-08-07 00:45;162.312
```

---

## Errors

### 401 Unauthorized

Missing or invalid Bearer token.

```json
{"detail": "Authentication credentials were not provided."}
```

### 403 Forbidden

Valid token but the account does not have the required permissions.

```json
{"detail": "You do not have permission to perform this action."}
```
