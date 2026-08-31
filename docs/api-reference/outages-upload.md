---
sidebar_position: 9
title: Outages upload
---

Upload plant outage records as a single CSV file per plant per request.

**POST** `https://api.ravenwits.com/api/v0/outages/upload/`

Requires **Bearer** API key.

---

## Request

`multipart/form-data`:

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `plant_id` | string | Yes | Plant identifier (must exist under [Plants](/api-reference/plants) for your account). |
| `file` | file | Yes | CSV only (`.csv` extension, `text/csv` or `application/csv` content type). |

---

## Example (curl)

```bash
curl --request POST \
  --url 'https://api.ravenwits.com/api/v0/outages/upload/' \
  --header 'Authorization: Bearer {your-api-key}' \
  --form 'plant_id=MY_PLANT_ID' \
  --form 'file=@./outages.csv;type=text/csv'
```

---

## Responses

| Status | Body |
| ------ | ---- |
| **201** | `{ "message": "Outages CSV stored successfully." }` |
| **400** | Missing `plant_id` / `file`, not `.csv`, wrong content type, or file is not valid CSV, e.g. `{ "plant_id": ["This field is required."] }` or `{ "file": ["Only CSV files are allowed (.csv extension)."] }` |
| **401** | Invalid or missing API key. |
| **404** | `{ "detail": "Plant with this ID does not exist." }` |
| **502** | `{ "detail": "File upload failed." }` |
| **503** | `{ "detail": "Outages uploads are not configured." }` |

---
