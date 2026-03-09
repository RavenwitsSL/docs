---
sidebar_position: 5
title: Normalized forecast
---

# Normalized forecast

Standard forecast endpoint consumed by the [portal](https://portal.ravenwits.com). Returns the latest normalized forecast file for each plant.

The API returns the most recently modified file per plant (or per selected plants) as a single JSON array. Datetime columns represent the end of each period and are stored in UTC; you can convert them to a requested timezone with the `timezone` query parameter. Prediction values represent energy in kWh for the period ending at the datetime.

**GET** `https://api.ravenwits.com/api/v0/forecasts/normalized/`

Requires **Bearer token**.

---

## Query parameters

| Name       | Type   | Required | Default | Description |
| ---------- | ------ | -------- | ------- | ----------- |
| `plant`    | string | No       | (all)   | Filter by plant. Repeat for multiple plants (e.g. `?plant=A&plant=B`). Omit to return all plants. |
| `timezone` | string | No       | UTC     | Convert datetime columns from UTC to this timezone. Use IANA name (e.g. `Europe/Madrid`) or alias (e.g. `EUR-MAD` for Europe/Madrid). |
| `format`   | string | No       | `json`  | `json` — response as JSON array of objects (each row includes a `plant` field). `csv` — download as CSV file. |

---

## Request

**All plants, JSON (default):**

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/forecasts/normalized/' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {your-token}'
```

**Specific plant(s):**

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/forecasts/normalized/?plant=PlantA&plant=PlantB' \
  --header 'Authorization: Bearer {your-token}'
```

**With timezone (e.g. Europe/Madrid):**

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/forecasts/normalized/?timezone=EUR-MAD' \
  --header 'Authorization: Bearer {your-token}'
```

**CSV download:**

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/forecasts/normalized/?format=csv' \
  --header 'Authorization: Bearer {your-token}' \
  --output normalized_forecast.csv
```

---

## File format (per plant)

Each plant’s file in S3 is a semicolon-delimited CSV with:

- **Header:** `;pred` (first column is datetime, second is the prediction value).
- **Rows:** `YYYY-MM-DD HH:MM;value` (e.g. `2026-02-27 07:00;277.836`).

Datetimes in the file are in UTC; the API converts them to the requested timezone when `timezone` is set.

---

## Responses

### 200 OK — Success (format=json)

Response body is a JSON array of objects. Each object has a `plant` field plus the columns from the normalized file. The API normalizes the first column to `datetime` and the second to `pred`. Datetime values represent the end of the period and are converted when `timezone` is provided. Prediction values represent energy in kWh for the period ending at the datetime.

**Example response body** (one plant, excerpt):

```json
[
  {"plant": "PLANT1", "datetime": "2026-02-27 07:00", "pred": "277.836"},
  {"plant": "PLANT2", "datetime": "2026-02-27 08:00", "pred": "256.01"},
  {"plant": "PLANT3", "datetime": "2026-02-27 09:00", "pred": "133.355"},
  {"plant": "PLANT4", "datetime": "2026-02-28 12:00", "pred": "5366.6"}
]
```

### 200 OK — Success (format=csv)

Response is a CSV file with `Content-Disposition: attachment; filename="normalized_forecast.csv"`. Columns are `plant`, `datetime`, `pred` (comma-delimited).

### 400 Bad Request

Customer name not available.

```json
{"error": "Customer name not available."}
```

### 401 Unauthorized

Missing or invalid Bearer token.

### 404 Not Found

No normalized forecast found for the customer (or for the selected plants).

```json
{"error": "No normalized forecast found for customer: ..."}
```

### 500 Internal Server Error

Error retrieving or parsing the forecast.

```json
{"error": "Failed to retrieve normalized forecast."}
```

```json
{"error": "Invalid forecast file format."}
```

---

## Relation to Custom forecast

- **Normalized forecast** (`/api/v0/forecasts/normalized/`) — Standard format and path for all customers.
- **Custom forecast** (`/api/v0/forecasts/custom/`) — Customer-specific format and file types (e.g. `Forecast_*`, `DailyHourly_*`). Content and structure may differ per customer.
