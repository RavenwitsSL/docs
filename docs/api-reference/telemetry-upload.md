---
sidebar_position: 7
title: Telemetry upload
---

# Telemetry upload (CSV)

Upload **generation telemetry** as a single **CSV** file per request. The server writes to S3:

`s3://{AWS_TELEMETRY_BUCKET_NAME}/{customer_name}/telemetry/{plant_id}_onlineHist.csv`

- **`AWS_TELEMETRY_BUCKET_NAME`** — environment variable on the API (required for uploads).
- **`customer_name`** — the authenticated customer’s name (same as elsewhere in S3).
- **`plant_id`** — form field; must match an existing **plant name** for that customer.

Each upload **overwrites** the object for that customer + plant (`…_onlineHist.csv`).

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

## Configuration

Set on the API host:

```env
AWS_TELEMETRY_BUCKET_NAME=your-telemetry-bucket
```

IAM (or equivalent) must allow `s3:PutObject` on  
`arn:aws:s3:::your-telemetry-bucket/*` (or prefix per customer if you restrict further).
