---
sidebar_position: 3
title: Authentication
---

All API calls require **authentication**. You need to sign in on the portal to generate an API key on the [Settings page](https://portal.ravenwits.com/settings) and use that key with every request.

## How it works

1. **Generate API key**: Sign in on the [portal](https://portal.ravenwits.com) with your email and password. Go to the [Settings page](https://portal.ravenwits.com/settings) and generate an API key. Save that API key securely because it will only be shown once when it is created.
2. **Use the API key**: For every other request, add the header `Authorization: Bearer <your-api-key>`.
3. **When it expires**: API keys expire after the set period. When your key expires you can go to the [Settings page](https://portal.ravenwits.com/settings) to generate a new API key.

## Sending the API key

For every **authenticated** endpoint (strategies, purchases, forecasts), add this header:

```http
Authorization: Bearer <your-api-key>
```

Replace `<your-api-key>` with the key generated on the portal.

**Example (curl):**

```bash
curl -X GET "https://api.ravenwits.com/api/v0/forecasts/normalized/" \
  -H "Authorization: Bearer your-api-key-here" \
  -H "Accept: application/json"
```
