---
sidebar_position: 7
title: Telemetry upload
---

# Telemetry upload (CSV)

Upload **generation telemetry** as a single **CSV** file per request:

- **`plant_id`** — form field; must match an existing **plant identifier** for that customer.

**POST** `https://api.ravenwits.com/api/v0/telemetry/upload/`

Requires **Bearer** token.

---

## Request

`multipart/form-data`:

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `plant_id` | string | Yes | Plant name (must exist under [Plants](/api-reference/plants)). |
| `file` | file | Yes | CSV only (`.csv` extension). |

---

## Example (curl)

```bash
curl --request POST \
  --url 'https://api.ravenwits.com/api/v0/telemetry/upload/' \
  --header 'Authorization: Bearer {your-token}' \
  --form 'plant_id=MY_PLANT_NAME' \
  --form 'file=@./onlineHist.csv;type=text/csv'
```

---

## Responses

| Status | Body |
| ------ | ---- |
| **201** | `{ "ok": true, "bucket": "…", "key": "{customer}/telemetry/{plant}_onlineHist.csv", "message": "…" }` |
| **400** | Missing `plant_id` / `file`, not `.csv`, unknown plant, etc. |
| **401** | Invalid or missing token. |
| **503** | `AWS_TELEMETRY_BUCKET_NAME` not set. |
| **502** | S3 upload failure (permissions, network). |

---
