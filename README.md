# nosskey
Nossky challenges better ways to handle Nostr keys

<image src="assets/nosskey-image.webp" width="500px" height="auto" />

## local

Start mysql DB and redis for local.

```bash
# Start docker.
$ npm run docker:up
```

Stop mysql DB.

```bash
$ npm run docker:down
```

Start all

```bash
$ npm run start-all
```

Stop

```bash
# stop serve client
# Ctrl+C

# stop server
$ npm run kill-all
```

```