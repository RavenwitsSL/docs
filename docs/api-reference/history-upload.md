---
sidebar_position: 9
title: History upload
---

Upload historical operational plant data as **CSV**, one file per request, in Ravenwits'
recommended format.

**POST** `https://api.ravenwits.com/api/v0/history/upload/`

Requires **Bearer** API key.

> It carries the exact same measurements and strict validation as [Telemetry upload strict](/api-reference/telemetry-upload-strict).
> For conceptual definitions and deciding the value of the `valid` flag, see
> **[Telemetry for forecasting: concepts and data quality](/telemetry-concepts)**.

## Request

`multipart/form-data`:

| Field | Type | Required | Description |
|---|---|---|---|
| `plant_id` | string | Yes | Plant identifier. Must exist under [Plants](/api-reference/plants). |
| `file` | file | Yes | A single CSV file (`.csv` extension). |

The **file name determines how the content is interpreted**. It must be exactly
one of:

| File name | Contents | Required |
|---|---|---|
| `generation.csv` | Measured active power, with validity flag | Yes |
| `availability.csv` | Active power the plant was capable of delivering | Recommended |
| `curtailment.csv` | Externally imposed active power ceiling | Recommended |
| `potential.csv` | Active power the plant would have delivered unconstrained | Recommended |

Each file goes in its **own request**. Sending all four for the same period
means four calls.

## Rules common to all files

- The **first line is the header**, with column names exactly as shown below
  (including the space before the unit, e.g. `generation kW`).
- The **column separator is a semicolon** `;`.
- The **decimal separator is a point** `.`. No thousands separator.
- Encoding: **UTF-8**.
- Timestamps are in **UTC**, format `YYYY-MM-DD HH:mm:ss`, e.g.
  `2024-01-15 10:00:00`.
- `period_start` is inclusive, `period_end` is exclusive. Consecutive periods
  therefore share a boundary timestamp and must not overlap.
- All values are **average active power in kW** over the period, not energy.
- Rows should be ordered by `period_start`.
- A period with no data should be **omitted**, not sent with a placeholder value.

> Keep the four files aligned.
> Use the same period boundaries across all four files. A record in
> `curtailment.csv` whose period does not match a record in `generation.csv`
> cannot be applied to it.

## File formats

### `generation.csv`

Four columns:

| Column | Description |
|---|---|
| `period_start` | Start of the measurement period, UTC |
| `period_end` | End of the measurement period, UTC |
| `generation kW` | Measured active power over the period, e.g. `123.45` |
| `valid` | `1` if the record may be used for training, `0` if it must be discarded |

#### The `valid` flag

`0` is a **final, irreversible discard of that measurement**: the measured value
is dropped on ingestion and plays no part in any later stage. It does not
necessarily lose the period — if `potential.csv` carries a value for the same
period and that signal validates well, we use it in place of the measurement.
`1` is **not** a commitment to use the record — it means the record is
interpretable, and our filters decide.

Set `1` when either:

- the value reflects real production, unaffected by limitations, outages or
  anything else; or
- the value **is** affected by a limitation or outage, **and you report the
  corresponding value** for that period in `curtailment.csv`,
  `availability.csv` or `potential.csv`.

Set `0` when:

- the value is affected by a limitation or outage you cannot quantify;
- the value is affected by anything else that makes it unrepresentative of
  weather-driven operation — economic shutdown, meter failure, communication
  loss, frozen values, tests, local manual operation;
- you are unsure about the value.

See [the concepts page](/telemetry-concepts#4-the-validity-flag) for the
reasoning and for worked cases.

### `availability.csv`

Three columns:

| Column | Description |
|---|---|
| `period_start` | Start of the measurement period, UTC |
| `period_end` | End of the measurement period, UTC |
| `availability kW` | Active power the plant was capable of delivering, e.g. `150.00` |

Equal to nominal capacity when the plant is fully operational, reduced for
partial outages, `0` for a full outage.

Records may be sent only for periods in which availability differed from
nominal. If you do so, tell us during onboarding, so that an absent record is
read as "fully available" rather than "unknown".

### `curtailment.csv`

Three columns:

| Column | Description |
|---|---|
| `period_start` | Start of the measurement period, UTC |
| `period_end` | End of the measurement period, UTC |
| `setpoint kW` | The active power **ceiling in force** during the period, e.g. `100.00` |

> `setpoint kW` is the **limit the plant was not allowed to exceed**, not the
> power that was curtailed away. A value of `100.00` on a 150 kW plant means a
> 100 kW setpoint was in force; a plant under no limitation carries its nominal
> capacity, not `0`.

As with availability, records may be sent only for periods in which a limitation
was in force, by prior agreement.

### `potential.csv`

Three columns:

| Column | Description |
|---|---|
| `period_start` | Start of the measurement period, UTC |
| `period_end` | End of the measurement period, UTC |
| `potential kW` | Active power the plant would have delivered unconstrained, e.g. `143.10` |

Potential is the most valuable optional file: it lets us keep curtailed and
unavailable periods in the training set instead of discarding them. See
[All four](/telemetry-concepts#all-four).

## Example (curl)

```bash
curl --request POST \
  --url 'https://api.ravenwits.com/api/v0/history/upload/' \
  --header 'Authorization: Bearer {your-api-key}' \
  --form 'plant_id=MY_PLANT_IDENTIFIER' \
  --form 'file=@./generation.csv;type=text/csv'
```

## Responses

| Status | Meaning | Body |
|---|---|---|
| **201** | File accepted for ingestion | `{ "message": "History CSV stored successfully." }` |
| **400** | Request or file rejected | `{ "error": "…" }` |
| **401** | Invalid or missing API key | — |
| **502** | Storage upload failure (permissions, network) | — |

Common causes of **400**:

- missing `plant_id` or `file`
- file extension is not `.csv`
- unknown `plant_id` for this API key
- file name is not one of the four accepted names
- header row missing, misspelled, or with the wrong number of columns
- wrong separator, or a comma used as the decimal separator
- unparseable timestamp, or `period_end` not after `period_start`
- non-numeric value in a power column, or a `valid` value other than `0` or `1`
