# Ils ne pensaient qu’à ça

Historical statistics on what artists kept coming back to, as recorded by French museums, from the [Joconde database](https://www.data.gouv.fr/datasets/collections-des-musees-de-france-base-joconde). The first chapter is a bestiary: an interactive timeline of the real and mythical animals in the collections.

## Development

```bash
bun install
bun run dev
```

`bun run build` writes a static site to `build/`.

## Data

The aggregates in `static/data/` are committed, so the raw export is only needed to refresh them:

```bash
bun run data:download   # 1.2 GB, into data/raw/ (not committed)
bun run data:parse      # about 25 seconds
```

Animal icons come from [game-icons.net](https://game-icons.net) (CC BY 3.0), with the credit shown on the site. `bun run icons:build` regenerates the sprite.

See "Comment lire ces chiffres" on the site for what is counted and how.
