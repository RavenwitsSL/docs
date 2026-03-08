---
sidebar_position: 4
title: Custom forecast
---

# Custom forecast

Returns the latest forecast file(s) for the authenticated customer. Forecasts can have different types (e.g. `Forecast`, `DailyHourly`). You can request a single type or all types, and get the response as JSON or CSV (or a ZIP when requesting all types as CSV).

**Note:** The customer UI or [portal](https://portal.ravenwits.com) uses the [Normalized forecast](/api-reference/forecasts-normalized) endpoint (`/api/v0/forecasts/normalized/`), which has a standard format and path for all customers. The custom forecast endpoint is for customer-specific formats and file types.

**GET** `https://api.ravenwits.com/api/v0/forecasts/custom/`

Requires **Bearer token**.

---

## Query parameters

| Name     | Type   | Required | Default   | Description |
| -------- | ------ | -------- | --------- | ----------- |
| `type`   | string | No       | `Forecast` | Forecast type prefix. Use e.g. `DailyHourly` for the latest file for daily hourly forecasts; use `all` to get the latest file for every discovered prefix. |
| `format` | string | No       | `json`    | `json` — response as JSON (single type: array of objects; `type=all`: object keyed by prefix). `csv` — raw CSV (single type) or ZIP of CSVs (when `type=all`). |

---

## Request

**Default (latest Forecast as JSON):**

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/forecasts/custom/' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {your-token}'
```

**Latest DailyHourly as JSON:**

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/forecasts/custom/?type=DailyHourly' \
  --header 'Authorization: Bearer {your-token}'
```

**Single type as CSV download:**

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/forecasts/custom/?type=Forecast&format=csv' \
  --header 'Authorization: Bearer {your-token}' \
  --output forecast.csv
```

**All types as JSON (object with one key per prefix):**

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/forecasts/custom/?type=all' \
  --header 'Authorization: Bearer {your-token}'
```

**All types as ZIP of CSVs:**

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/forecasts/custom/?type=all&format=csv' \
  --header 'Authorization: Bearer {your-token}' \
  --output forecasts.zip
```

---

## Responses

### 200 OK — Success (format=json, single type)

Response body is a JSON array of objects, one per row of the forecast. Exact fields depend on the forecast file.

**Example response body:**

```json
[
  {"datetime": "2024-01-15 00:00", "value": 10.5},
  {"datetime": "2024-01-15 01:00", "value": 11.2}
]
```

### 200 OK — Success (format=json, type=all)

Response body is an object with one key per forecast prefix; each value is an array of row objects.

**Example response body:**

```json
{
  "Forecast": [{"datetime": "2024-01-15 00:00", "value": 10.5}, ...],
  "DailyHourly": [{"datetime": "2024-01-15 00:00", "value": 8.1}, ...]
}
```

### 200 OK — Success (format=csv, single type)

Response is a CSV file with `Content-Disposition: attachment; filename="forecast.csv"`. Save with `--output forecast.csv` (or similar) when using curl.

### 200 OK — Success (format=csv, type=all)

Response is a ZIP file containing one CSV per prefix (e.g. `Forecast_latest.csv`, `DailyHourly_latest.csv`) with `Content-Disposition: attachment; filename="forecasts.zip"`.

### 400 Bad Request

Customer name not available.

```json
{"error": "Customer name not available."}
```

### 401 Unauthorized

Missing or invalid Bearer token.

### 404 Not Found

No forecast found for the customer (or for the requested type).

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
