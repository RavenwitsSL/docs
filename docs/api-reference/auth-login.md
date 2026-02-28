---
sidebar_position: 3
title: Login
---

# Login

Sign in with your email and password to receive a Bearer token. Use this token in the `Authorization` header for all other API requests.

**POST** `https://api.ravenwits.com/api/v0/auth/login/`

No authentication required.

---

## Request body

| Field      | Type   | Required | Description          |
| ---------- | ------ | -------- | -------------------- |
| `email`    | string | Yes      | Your account email   |
| `password` | string | Yes      | Your account password|

---

## Request

```bash
curl --request POST \
  --url https://api.ravenwits.com/api/v0/auth/login/ \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --data '{"email": "your-email@example.com", "password": "your-password"}'
```

Replace the JSON body with your credentials.

---

## Responses

### 200 OK — Success

Returns your token and account info.

| Field            | Type   | Description                                |
| ---------------- | ------ | ------------------------------------------ |
| `token`          | string | Bearer token for authenticated requests    |
| `expires_at`     | string | ISO 8601 datetime when the token expires   |
| `customer_name`  | string | Your display name                          |
| `customer_email` | string | Your email                                 |

**Example response body:**

```json
{
  "token": "abc123...",
  "expires_at": "2025-03-15T12:00:00Z",
  "customer_name": "Your Name",
  "customer_email": "your-email@example.com"
}
```

### 400 Bad Request

Missing email or password.

```json
{"error": "Both 'email' and 'password' are required."}
```

### 401 Unauthorized

Invalid credentials or account not configured.

```json
{"error": "Invalid credentials; email not found."}
```

```json
{"error": "Invalid credentials; incorrect password."}
```

```json
{"error": "Account not configured. Please contact support."}
```
