# CLAUDE.md

Read **[AGENTS.md](AGENTS.md)** — it is the single source of truth for this repo
(commands, architecture, URL scheme, branding, deploy, gotchas). Nothing is
duplicated here so the two files cannot drift apart.

Four things worth knowing before your first tool call:

1. **This directory is the canonical repo.** Do not clone it elsewhere. Production
   once ran from a second clone's uncommitted changes; that copy is gone.
2. **Remix 3 has no React and no hooks.** Read `.agents/skills/remix/SKILL.md`
   before writing any component.
3. **`node`/`npm` need absolute paths** (`$HOME/.nvm/versions/node/v22.22.2/bin/…`);
   nvm's lazy-load shim breaks non-interactive shells.
4. **`git diff` output is filtered by RTK.** Use `rtk proxy git …` when piping to a
   file or another tool, or `git apply` will reject the result.

Deploy is `npm run deploy` and it publishes to the live site at https://laravolt.dev —
confirm with the user before running it.
