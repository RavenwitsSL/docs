---
sidebar_position: 5
title: Purchases
---

# Purchases

Endpoints to submit, update, and retrieve energy purchase strategies.

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
  "id": "00000000-0000-0000-0000-000000000000",
  "status": "pending",
  "created_at": "2024-01-15T14:35:00Z",
  "rows_uploaded": 2,
  "error": "",
  "message": "CustomerPurchase created successfully with ID: XX for user: XX and retailer: XX"
}
```

### 403 Forbidden

```json
{"detail": "Authentication credentials were not provided."}
```

### 400 Bad Request

Various validation errors:

```json
{"error": "Missing required URL parameter \"user\"."}
```

```json
{"error": "Missing required field \"purchase\"."}
```

```json
{"error": "Field \"purchase\" must be an array of objects."}
```

```json
{"error": "Purchase item at index 0 is missing required field \"datetime\"."}
```

```json
{"error": "Purchase item at index 0: invalid datetime format. Expected \"YYYY-MM-DD HH:MM\" (e.g., \"2024-01-15 14:30\")."}
```

```json
{"error": "Purchase item at index 0: field \"purchase\" must be a number (in MW unit)."}
```

### 500 Internal Server Error

```json
{"error": "Internal server error while creating purchase."}
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
| `status` | string | No       | One of: `failed`, `pending`, `in_progress`, `completed` |
| `error`  | string | No       | Error message (e.g. when status is `failed`) |

### Request

```bash
curl --request PUT \
  --url 'https://api.ravenwits.com/api/v0/user/{user}/purchase/{purchase_id}/update' \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {your-token}' \
  --data '{
    "status": "completed",
    "error": "",
    "outputs": [
      {
        "idmodel": 1,
        "value": {
          "MD": [
            {"datetime": "YYYY-MM-DD HH:MM", "purchase_percentage": 1.0, "sale_percentage": 0.0},
            ...
          ],
          "MID1": [...],
          "MID2": [...],
          "MID3": [...]
        }
      },
      {
        "idmodel": 2,
        "value": {
          "MD": [...],
          "MID1": [...]
        }
      }
    ]
  }'
```

### Response — 200 OK

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "status": "pending",
  "error": "",
  "updated_at": "2024-01-15T14:35:00Z",
  "message": "CustomerPurchase ... updated successfully"
}
```

### 401 Unauthorized

```json
{"detail": "Authentication credentials were not provided."}
```

### 400 Bad Request

```json
{"error": "Missing required field \"outputs\"."}
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

### Response — 200 OK (with `idmodel`)

If the `idmodel` query parameter is provided, `strategy_output` contains only the matching model object:

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "status": "pending",
  "error": "",
  "created_at": "2024-01-15T14:35:00Z",
  "strategy_output": {
    "idmodel": 1,
    "value": {
      "MD": [...],
      "MID1": [...],
      ...
    }
  }
}
```

`idmodel` not found in strategy output:

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "status": "pending",
  "error": "",
  "created_at": "2025-01-15T14:30:00Z",
  "strategy_output": {"error": "idmodel XX not found in strategy_output"}
}
```

### Response — 200 OK (without `idmodel`)

If no `idmodel` is provided, `strategy_output` contains all model objects:

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "status": "pending",
  "error": "",
  "created_at": "2025-01-15T14:30:00Z",
  "strategy_output": [
    {
      "idmodel": 1,
      "value": {
        "MD": [...],
        "MID1": [...],
        ...
      }
    },
    {
      "idmodel": 2,
      "value": {
        "MD": [...],
        "MID1": [...],
        ...
      }
    },
    ...
  ]
}
```

### 403 Forbidden

```json
{"detail": "Authentication credentials were not provided."}
```

### 404 Not Found

Purchase not found:

```json
{"error": "Purchase not found."}
```
