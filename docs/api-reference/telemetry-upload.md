---
sidebar_position: 7
title: Telemetry upload
---

Upload **telemetry** as a single **CSV** file per request.
The name and the format of the CSV must be agreed upon beforehand.

**POST** `https://api.ravenwits.com/api/v0/telemetry/upload/`

Requires **Bearer** API key.

## Request

`multipart/form-data`:

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `plant_id` | string | Yes | Plant identifier (must exist under [Plants](/api-reference/plants)). |
| `file` | file | Yes | CSV only (`.csv` extension). |

## Example (curl)

```bash
curl --request POST \
  --url 'https://api.ravenwits.com/api/v0/telemetry/upload/' \
  --header 'Authorization: Bearer {your-api-key}' \
  --form 'plant_id=MY_PLANT_IDENTIFIER' \
  --form 'file=@./generation.csv;type=text/csv'
```

## Responses

| Status | Body |
| ------ | ---- |
| **201** | `{ "message": "…" }` |
| **400** | Missing `plant_id` / `file`, not `.csv`, unknown plant, etc. |
| **401** | Invalid or missing API key. |
| **502** | S3 upload failure (permissions, network). |

---
