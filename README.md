# File

File content element with upload and download support.

**Type:** `FILE`

## Data

| Field | Type | Description |
|-------|------|-------------|
| `url` | `string \| null` | Public file URL |
| `name` | `string \| null` | Original filename |
| `label` | `string \| null` | Download button label |

## Edit

- Upload button in top toolbar (all extensions) with URL source support
- Label field in side toolbar
- Preview renders a download button

## Display

- Renders a download button
- Click to download the file using the stored filename
- Emits `interaction` event with `{ downloadedAt }` on download

## Development

```sh
pnpm dev     # Preview :8080 | Edit :8010 | Display :8020 | Server :8030
pnpm build
pnpm lint
pnpm test
```

## Run with Docker

```sh
docker compose up
```
