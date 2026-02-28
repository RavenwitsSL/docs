---
sidebar_position: 4
title: Latest forecast
---

# Latest forecast

Returns the latest forecast for the authenticated customer. The backend looks up the most recently available forecast file and returns it as JSON or CSV.

**GET** `https://api.ravenwits.com/api/v0/forecasts/latest/`

Requires **Bearer token**.

---

## Query parameters

| Name     | Type   | Required | Default | Description |
| -------- | ------ | -------- | ------- | ----------- |
| `format` | string | No       | `json`  | `json` — response as JSON array of objects; `csv` — download as CSV file |

---

## Request

**JSON response (default):**

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/forecasts/latest/' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {your-token}'
```

**CSV download:**

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/forecasts/latest/?format=csv' \
  --header 'Authorization: Bearer {your-token}' \
  --output forecast.csv
```

---

## Responses

### 200 OK — Success (format=json)

Response body is a JSON array of objects, one per row of the forecast (e.g. timestamp and value columns). Exact fields depend on the forecast file.

**Example response body:**

```json
[
  {"datetime": "2024-01-15 00:00", "value": 10.5},
  {"datetime": "2024-01-15 01:00", "value": 11.2}
]
```

### 200 OK — Success (format=csv)

Response is a CSV file with `Content-Disposition: attachment; filename="forecast.csv"`. Save with `--output forecast.csv` (or similar) when using curl.

### 400 Bad Request

Customer name not available.

```json
{"error": "Customer name not available."}
```

### 401 Unauthorized

Missing or invalid Bearer token.

### 404 Not Found

No forecast found for the customer.

```json
{"error": "No forecast found ..."}
```

### 500 Internal Server Error

Error retrieving or parsing the forecast.

```json
{"error": "Failed to retrieve forecast."}
```

```json
{"error": "Invalid forecast file format."}
```
