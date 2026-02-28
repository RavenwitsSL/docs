---
sidebar_position: 5
title: Purchases
---

# Purchases

Endpoints to submit, update, and retrieve purchases.

---

## Submit purchase

Create a new purchase for a user and retailer.

**POST** `https://api.ravenwits.com/api/v0/user/<user>/submit-purchase`

Requires **Bearer token**.

### URL parameters

| Name   | Type   | Required | Description     |
| ------ | ------ | -------- | --------------- |
| `user` | string | Yes      | User identifier |

### Query parameters

| Name          | Type   | Required | Description        |
| ------------- | ------ | -------- | ------------------ |
| `retailer_id` | string | Yes      | Retailer identifier|

### Request body

| Field       | Type  | Required | Description |
| ----------- | ----- | -------- | ----------- |
| `purchase`  | array | Yes      | List of purchase items (see below). |

Each item in `purchase` must be an object with:

| Field      | Type   | Required | Description |
| ---------- | ------ | -------- | ----------- |
| `datetime` | string | Yes      | Date and time in format `YYYY-MM-DD HH:MM` (e.g. `2024-01-15 14:30`) |
| `purchase` | number | Yes      | Purchase value (e.g. in MW) |

### Request

```bash
curl --request POST \
  --url 'https://api.ravenwits.com/api/v0/user/{user}/submit-purchase?retailer_id={retailer_id}' \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {your-token}' \
  --data '{
    "purchase": [
      {"datetime": "2024-01-15 14:30", "purchase": 12.0},
      {"datetime": "2024-01-15 15:00", "purchase": 13.0}
    ]
  }'
```

### Response — 201 Created

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "created_at": "2024-01-15T14:35:00Z",
  "rows_uploaded": 2,
  "error": null,
  "message": "Purchase created successfully with ID: ..."
}
```

---

## Update purchase

Update an existing purchase (e.g. status and strategy outputs). The purchase must belong to the authenticated customer.

**PUT** `https://api.ravenwits.com/api/v0/user/<user>/purchase/<purchase_id>/update`

Requires **Bearer token**.

### URL parameters

| Name          | Type   | Required | Description    |
| ------------- | ------ | -------- | -------------- |
| `user`        | string | Yes      | User identifier|
| `purchase_id` | UUID   | Yes      | Purchase ID    |

### Request body

| Field    | Type   | Required | Description |
| -------- | ------ | -------- | ----------- |
| `outputs`| object | Yes      | Strategy output data to store |
| `status` | string | Yes      | One of: `failed`, `pending`, `in_progress`, `completed` |
| `error`  | string | No       | Error message (e.g. when status is `failed`) |

### Request

```bash
curl --request PUT \
  --url 'https://api.ravenwits.com/api/v0/user/{user}/purchase/{purchase_id}/update' \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {your-token}' \
  --data '{"outputs": {...}, "status": "completed", "error": ""}'
```

### Response — 200 OK

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "error": "",
  "updated_at": "2024-01-15T14:35:00Z",
  "message": "CustomerPurchase ... updated successfully"
}
```

### 404 Not Found

Purchase not found or not owned by the authenticated customer.

```json
{"error": "Purchase not found."}
```

---

## Get purchase

Retrieve one purchase by ID. The purchase must belong to the authenticated customer.

**GET** `https://api.ravenwits.com/api/v0/user/<user>/purchase/<purchase_id>/get`

Requires **Bearer token**.

### URL parameters

| Name          | Type   | Required | Description    |
| ------------- | ------ | -------- | -------------- |
| `user`        | string | Yes      | User identifier|
| `purchase_id` | UUID   | Yes      | Purchase ID    |

### Query parameters

| Name      | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| `idmodel` | string | No       | If present, filter `strategy_output` to the object with this `idmodel` |

### Request

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/user/{user}/purchase/{purchase_id}/get' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {your-token}'
```

Optional: append `?idmodel=123` to filter by model.

### Response — 200 OK

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "error": "",
  "created_at": "2024-01-15T14:35:00Z",
  "strategy_output": { ... }
}
```

### 404 Not Found

```json
{"error": "Purchase not found."}
```
