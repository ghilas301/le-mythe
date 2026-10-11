# Security Specification: The Eternal Push (Leaderboard & Ghost Replays)

## Collections

### 1. `/leaderboard/{runId}`
- **Description**: Anonymous global runs submitted by devices around the world.
- **Read**: Public read (`allow read: if true;`) to render global Top 1000, trending stats, and community percentiles.
- **Create**: Allowed with strict data type validation:
  - `id`: string <= 64 chars
  - `deviceId`: string <= 64 chars
  - `distance`: number (0 to 100000m)
  - `time`: number >= 0
  - `pushes`: number >= 0
  - `timestamp`: number
- **Update**: Forbidden (`false`), immutable historical runs.
- **Delete**: Forbidden (`false`).

### 2. `/ghosts/{ghostId}`
- **Description**: Ghost runs used for background ghost racing challenge replays.
- **Read**: Public read (`allow read: if true;`).
- **Create**: Validated entry creation with `id`, `playerName`, `distance`, `timestamp`.
- **Update / Delete**: Forbidden (`false`).
