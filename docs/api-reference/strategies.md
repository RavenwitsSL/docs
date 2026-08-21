---
sidebar_position: 6
title: List strategies
---

Returns the list of strategies for a given user and retailer. Used to discover available strategies before submitting purchases.

**GET** `https://api.ravenwits.com/api/v0/strategies/<user>`

Requires **Bearer API key**.

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
  --header 'Authorization: Bearer {your-api-key}'
```

Replace `{user}`, `{retailer_id}`, and `{your-api-key}` with your values.

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

Missing or invalid Bearer API key.

```json
{"detail": "Authentication credentials were not provided."}
```

### 500 Internal Server Error

Error while retrieving strategies.

```json
{"error": "Internal server error while retrieving strategies."}
```
