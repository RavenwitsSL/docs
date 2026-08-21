---
sidebar_position: 4
title: Change Password
---

Change the password for the currently authenticated user. All existing Bearer tokens are invalidated on success — you must log in again to obtain a new token.

**POST** `https://api.ravenwits.com/api/v0/auth/password/`

Requires **Bearer API key**.

---

## Request body

| Field                       | Type   | Required | Description                       |
| --------------------------- | ------ | -------- | --------------------------------- |
| `old_password`              | string | Yes      | Your current password             |
| `new_password`              | string | Yes      | The new password you want to set  |
| `new_password_confirmation` | string | Yes      | Must match `new_password`         |

---

## Request

```bash
curl --request POST \
  --url https://api.ravenwits.com/api/v0/auth/password/ \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --header 'Authorization: Bearer {your-api-key}' \
  --data '{
    "old_password": "your-current-password",
    "new_password": "your-new-password",
    "new_password_confirmation": "your-new-password"
  }'
```

Replace `{your-api-key}` with your Bearer API key and the body fields with your actual passwords.

---

## Responses

### 204 No Content — Success

Password changed. No response body is returned. All existing Bearer tokens for your account are invalidated — you must log in again using [`POST /api/v0/auth/login/`](/api-reference/auth-login) to get a new token.

### 400 Bad Request

A required field is missing, a validation rule failed, or the passwords don't match.

Missing field:

```json
{"old_password": ["This field is required."]}
```

```json
{"new_password": ["This field is required."]}
```

```json
{"new_password_confirmation": ["This field is required."]}
```

Incorrect current password:

```json
{"old_password": ["Old password is incorrect."]}
```

Confirmation does not match:

```json
{"new_password_confirmation": ["Password confirmation does not match new password."]}
```

New password fails validation (e.g. too short, too common, too similar to email):

```json
{"new_password": ["This password is too short. It must contain at least 8 characters."]}
```

### 401 Unauthorized

Missing or expired Bearer API key.

### 429 Too Many Requests

Rate limit exceeded. Wait before retrying.
