---
sidebar_position: 5
title: Health check
---

# Health check

Simple endpoint to verify the API is running. No authentication required.

**GET** `https://api.ravenwits.com/health/`

---

## Request

```bash
curl --request GET \
  --url 'https://api.ravenwits.com/health/' \
  --header 'Accept: application/json'
```

---

## Response — 200 OK

```json
{
  "status": "healthy"
}
```

Use this endpoint for monitoring, load balancer health checks, or to confirm the API is reachable before calling other endpoints.
