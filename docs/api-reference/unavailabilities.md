---
sidebar_position: 6
title: Unavailabilities
---

# Unavailabilities (customer)

Record **availability intervals** per plant (curtailment, unavailability, etc.). All times are stored in **UTC**. Each row belongs to the **authenticated customer**; `plant_id` must match an existing **plant name** for that account.

**Base path:** `/api/v0/unavailabilities/`

Requires **Bearer token**.

---

## JSON schema (English)

| Field | Type | Required (create) | Description |
| ----- | ---- | ----------------- | ----------- |
| `plant_id` | string | Yes | Unique plant identifier (same as the plant **name** in [Plants](/api-reference/plants)). |
| `start_time_utc` | string (date-time) | Yes | Interval start in UTC (ISO 8601). |
| `end_time_utc` | string (date-time) | Yes | Interval end in UTC; must be after `start_time_utc`. |
| `available_power_mw` | number (≥ 0) | Yes | Available power, **always in MW**. |
| `availability_type` | string | Yes | One of: `CURTAILMENT`, `UNAVAILABILITY`, `OTHER`. |
| `observations` | string | No | Free-text notes. |
| `source_unit` | string | No | Original unit from the client: `MW`, `kW`, or `%`. |
| `source_value` | number | No | Original numeric value from the client. |
| `timezone_source` | string | No | IANA timezone if the client entered local time (e.g. `Europe/Madrid`, `Atlantic/Canary`). |
| `id` | UUID | — | Set by the server. |
| `created_at` | date-time | — | Set by the server. |
| `updated_at` | date-time | — | Updated on each change. |

---

## List unavailabilities

**GET** `https://api.ravenwits.com/api/v0/unavailabilities/`

Optional query: **`plant_id`** — restrict to one plant.

### Request

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/unavailabilities/' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {your-token}'
```

Filter by plant:

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/unavailabilities/?plant_id=MY_PLANT_NAME' \
  --header 'Authorization: Bearer {your-token}'
```

### Response

`200 OK` — JSON array of objects matching the schema above.

---

## Create unavailability

**POST** `https://api.ravenwits.com/api/v0/unavailabilities/`

### Request

```bash
curl --request POST \
  --url 'https://api.ravenwits.com/api/v0/unavailabilities/' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer {your-token}' \
  --data '{
    "plant_id": "NORTH_PLANT",
    "start_time_utc": "2025-03-14T08:00:00Z",
    "end_time_utc": "2025-03-14T18:00:00Z",
    "available_power_mw": 12.5,
    "availability_type": "UNAVAILABILITY",
    "observations": "Scheduled work",
    "source_unit": "MW",
    "source_value": 12.5,
    "timezone_source": "Europe/Madrid"
  }'
```

### Response

`201 Created` — full object including `id`, `created_at`, `updated_at`.

`400 Bad Request` — validation error (unknown `plant_id`, bad enum, end before start, negative MW, etc.).

---

## Get one record

**GET** `https://api.ravenwits.com/api/v0/unavailabilities/{id}/`

`id` is the UUID. Only the owning customer can read it.

---

## Update unavailability

**PATCH** `https://api.ravenwits.com/api/v0/unavailabilities/{id}/` — partial update.

**PUT** `https://api.ravenwits.com/api/v0/unavailabilities/{id}/` — full replace (same required fields as create).

---

## Delete unavailability

**DELETE** `https://api.ravenwits.com/api/v0/unavailabilities/{id}/`

Delete one unavailability record owned by the authenticated customer.

### Request

```bash
curl --request DELETE \
  --url 'https://api.ravenwits.com/api/v0/unavailabilities/{id}/' \
  --header 'Authorization: Bearer {your-token}'
```

### Response

`204 No Content` — deleted successfully.

`404 Not Found` — unknown `id` or record is not owned by the authenticated customer.

---

## Errors

| Status | Meaning |
| ------ | ------- |
| 401 | Missing or invalid Bearer token. |
| 404 | Unknown `id` or not owned by the customer. |
| 400 | Validation error. |

---

## Notes

- **`plant_id`** is validated against your **Plants** list; create plants first via `/api/v0/plants/`.
- Run migrations after deploy: `python manage.py migrate`.
