---
sidebar_position: 8
title: Outages
---

# Outages Upload Endpoint

This endpoint allows you to upload outages data files to the Ravenwits system. The endpoint accepts CSV files containing outages information and processes them for analysis.

**POST** `https://api.ravenwits.com/api/v0/outages`

---

## Parameters

`multipart/form-data`:

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `token` | string | Yes | Your API authentication token. This token identifies your account and authorizes the upload request. |
| `file` | file | Yes | The CSV file containing outages data. Must be a valid CSV format with appropriate headers. |

---

## Request Format

The request must be sent as `multipart/form-data` with the following fields:

```http
Content-Type: multipart/form-data

token: your_api_token_here
file: [CSV file data]
```

---

## Example (curl)

```bash
curl -X POST \
  -F "token=your_api_token_here" \
  -F "file=@outages_data.csv" \
  https://api.ravenwits.com/api/v0/outages
```

---

## File Format Requirements

The uploaded CSV file should contain the following information:

- **Format:** CSV (Comma-Separated Values)
- **Encoding:** UTF-8 recommended
- **Headers:** First row should contain column headers
- **Data:** Each subsequent row represents an outage record

---

## Responses

| Status | Body |
| ------ | ---- |
| **200** | `{ "message": "File successfully uploaded" }` |
| **400** | `{ "error": "Invalid file format or missing required fields" }` |
| **401** | `{ "error": "Invalid or missing token" }` |

---
