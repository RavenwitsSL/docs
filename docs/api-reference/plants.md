---
sidebar_position: 5
title: Plants
---

# Plants (customer)

Manage generation plants for the **authenticated customer**. Each plant belongs to the customer tied to the Bearer token. Other customers’ plants are never returned.

**Base path:** `/api/v0/plants/`

Requires **Bearer token** (same as login).

---

## Data model (JSON)

| Field | Type | Required (create) | Description |
| ----- | ---- | ----------------- | ----------- |
| `id` | UUID | — | Set by server. |
| `name` | string | Yes | Plant name or external ID (unique per customer; often matches forecast plant codes). |
| `lat` | number | Yes | Latitude, decimal degrees (e.g. `42.94972`). |
| `lon` | number | Yes | Longitude, decimal degrees (e.g. `-3.67893`). |
| `installed_capacity_mw` | number | Yes | Installed capacity (MW). |
| `nominal_capacity_mw` | number | Yes | Nominal capacity (MW). |
| `area` | string | Yes | Region/map code (e.g. `ESP`). |
| `technology_type` | string | Yes | `"eolica"` or `"solar"`. |
| `last_training_cnn_at` | string | No | Last CNN training time, e.g. `YYYY-MM-DD HH:MM`, or empty. |
| `last_training_trees_at` | string | No | Last tree-model training time, or empty. |
| `agrupation` | string | No | Optional cluster for aggregated forecasts. |
| `customer_display_name` | string | No | Optional label on this record. |
| `timezone` | string | No | IANA timezone (e.g. `Europe/Madrid`). |
| `created_at` | ISO datetime | — | Server timestamps. |
| `updated_at` | ISO datetime | — | |

---

## List plants

**GET** `https://api.ravenwits.com/api/v0/plants/`

Returns a JSON **array** of plant objects for the logged-in customer.

### Request

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/plants/' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {your-token}'
```

### Response

`200 OK` — array of plants, e.g.:

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "NORTH_PLANT",
    "lat": "42.9497200",
    "lon": "-3.6789300",
    "installed_capacity_mw": "18.000",
    "nominal_capacity_mw": "18.000",
    "area": "ESP",
    "technology_type": "eolica",
    "last_training_cnn_at": "2025-01-15 08:30",
    "last_training_trees_at": "",
    "agrupation": "",
    "customer_display_name": "",
    "timezone": "Europe/Madrid",
    "created_at": "2025-03-01T12:00:00Z",
    "updated_at": "2025-03-01T12:00:00Z"
  }
]
```

---

## Create plant

**POST** `https://api.ravenwits.com/api/v0/plants/`

Body: JSON object with required fields (see table). Optional fields may be omitted or `""`.

### Request

```bash
curl --request POST \
  --url 'https://api.ravenwits.com/api/v0/plants/' \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {your-token}' \
  --data '{
    "name": "NORTH_PLANT",
    "lat": 42.94972,
    "lon": -3.67893,
    "installed_capacity_mw": 18.0,
    "nominal_capacity_mw": 18.0,
    "area": "ESP",
    "technology_type": "eolica",
    "last_training_cnn_at": "",
    "last_training_trees_at": "",
    "agrupation": "",
    "customer_display_name": "",
    "timezone": "Europe/Madrid"
  }'
```

### Response

`201 Created` — full plant object including `id`, `created_at`, `updated_at`.

`400 Bad Request` — validation errors (e.g. duplicate `name` for that customer).

---

## Get one plant

**GET** `https://api.ravenwits.com/api/v0/plants/{plant_id}/`

`plant_id` is the plant UUID. Only plants owned by the customer are visible.

---

## Update plant

**PATCH** `https://api.ravenwits.com/api/v0/plants/{plant_id}/`

Send only fields to change (partial update). To rename a plant, include the new `name` in the body.

**PUT** `https://api.ravenwits.com/api/v0/plants/{plant_id}/`

Full replacement: send all writable fields (same as create).

### Request (PATCH example)

```bash
curl --request PATCH \
  --url 'https://api.ravenwits.com/api/v0/plants/{plant_id}/' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer {your-token}' \
  --data '{"nominal_capacity_mw": 20.0, "last_training_cnn_at": "2025-03-14 10:00"}'
```

### Response

`200 OK` — updated plant object.

`404 Not Found` — wrong UUID or plant belongs to another customer.

---

## Errors

| Status | Meaning |
| ------ | ------- |
| 401 | Missing or invalid Bearer token. |
| 404 | Plant not found or not owned by customer. |
| 400 | Validation error (e.g. duplicate name, invalid `technology_type`). |

---

## Notes

- **Training timestamps** are stored as free-form strings (e.g. `YYYY-MM-DD HH:MM`) so you can align with existing pipelines; they are not validated as datetimes by the API.
- **Junior spec correction:** Use **`HH:MM`** (hours:minutes), not `HH:SS`, for clock time unless you intentionally store seconds.
- Run migrations after deploy so the `customers_customerplant` table exists (`python manage.py migrate`).
