---
sidebar_position: 2
title: List strategies
---

# List strategies

Returns the list of strategies for a given user and retailer. Used to discover available strategies before submitting purchases.

**GET** `https://api.ravenwits.com/api/v0/strategies/<user>`

Requires **Bearer token**.

---

## URL parameters

| Name   | Type   | Required | Description      |
| ------ | ------ | -------- | ---------------- |
| `user` | string | Yes      | User identifier  |

---

## Query parameters

| Name         | Type   | Required | Description        |
| ------------ | ------ | -------- | ------------------ |
| `idretailer` | string | Yes      | Retailer identifier|

---

## Request

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/api/v0/strategies/{user}?idretailer={retailer_id}' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {your-token}'
```

Replace `{user}`, `{retailer_id}`, and `{your-token}` with your values.

---

## Responses

### 200 OK — Success

Returns the strategy data from the backend (structure depends on your configuration). Typically a JSON object or array of strategy definitions.

### 400 Bad Request

Missing path or query parameter.

```json
{"error": "Missing 'user' parameter in URL path."}
```

```json
{"error": "Missing 'retailer_id' parameter in query string."}
```

### 401 Unauthorized

Missing or invalid Bearer token.

### 500 Internal Server Error

Error while retrieving strategies.

```json
{"error": "Internal server error while retrieving strategies."}
```
