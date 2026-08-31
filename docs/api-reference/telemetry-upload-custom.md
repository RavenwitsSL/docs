---
sidebar_position: 8
title: Telemetry upload custom
---

Upload **telemetry** as a single **CSV** file per request.
The name and the format of the CSV must be agreed upon beforehand.

**POST** `https://api.ravenwits.com/api/v0/telemetry/upload-custom/`

Requires **Bearer** API key.

## Request

`multipart/form-data`:

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `file` | file | Yes | CSV only (`.csv` extension). |

## Example (curl)

```bash
curl --request POST \
  --url 'https://api.ravenwits.com/api/v0/telemetry/upload-custom/' \
  --header 'Authorization: Bearer {your-api-key}' \
  --form 'file=@./generation.csv;type=text/csv'
```

## Responses

| Status | Body |
| ------ | ---- |
| **201** | `{ "message": "…" }` |
| **400** | Missing `file`, not `.csv`, unknown plant, etc. |
| **401** | Invalid or missing API key. |
| **502** | S3 upload failure (permissions, network). |
| **503** | Telemetry endpoint not configured. |

---
