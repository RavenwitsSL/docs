---
sidebar_position: 3
title: Authentication
---

# API Usage: Authentication

All API calls (except login and health check) require **authentication**. You sign in once to get a **Bearer token**, then send that token with every request.

## How it works

1. **Sign in**: Send your email and password to the login endpoint. The API returns a **token** and an expiration time.
2. **Use the token**: For every other request, add the header `Authorization: Bearer <your-token>`.
3. **When it expires**: Tokens expire after a set period. When you get a 401 response, sign in again to get a new token.

## Login endpoint

**POST** `/api/v0/auth/login/`

Send a JSON body with your credentials:

| Field     | Type   | Required | Description        |
| --------- | ------ | -------- | ------------------ |
| `email`   | string | Yes      | Your account email |
| `password`| string | Yes      | Your password      |

**Example request body:**

```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Example success response (200):**

```json
{
  "token": "your-bearer-token-here",
  "expires_at": "2025-03-15T12:00:00Z",
  "customer_name": "Your Name",
  "customer_email": "your-email@example.com"
}
```

- **`token`**: Use this value in the `Authorization: Bearer <token>` header for all other API calls.
- **`expires_at`**: When the token stops working; after that, call login again.
- **`customer_name`**, **`customer_email`**: Your account details (for display only).

**Example error responses:**

- **400** — Missing email or password: `{"error": "Both 'email' and 'password' are required."}`
- **401** — Invalid credentials: `{"error": "Invalid credentials; email not found."}` or `{"error": "Invalid credentials; incorrect password."}`

## Sending the token

For every **authenticated** endpoint (strategies, purchases, forecasts), add this header:

```http
Authorization: Bearer <your-token>
```

Replace `<your-token>` with the `token` value you received from the login response.

**Example (curl):**

```bash
curl -X GET "https://api.ravenwits.com/api/v0/strategies/your-user?idretailer=123" \
  -H "Authorization: Bearer your-bearer-token-here" \
  -H "Accept: application/json"
```

## Endpoints that do not require authentication

- **POST** `/api/v0/auth/login/` — Login (you send email and password instead of a token).
- **GET** `/health/` — Health check; returns `{"status": "healthy"}`.

All other endpoints listed in the [API Reference](/api-reference/overview) require the `Authorization: Bearer <token>` header. If the token is missing, invalid, or expired, the API returns **401 Unauthorized**.
