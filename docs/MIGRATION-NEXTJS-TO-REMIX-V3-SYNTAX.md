# Log Migrasi: Next.js (Syntax/Markdoc) → Remix v3.0.0-beta.5

Lanjutan dari playbook Spotlight (`MIGRATION-NEXTJS-TO-REMIX-V3.md`). Sumber: Laravolt docs — Tailwind Plus "Syntax" template (Next.js 15 App Router + Markdoc) → Remix v3 full TypeScript di `/Users/rama/orca/projects/laravolt-docs-remix/laravolt-docs`. Repo sumber `/Users/rama/OpenSource/laravolt-docs` tidak disentuh (read-only).

## 1. Perbedaan utama vs migrasi Spotlight

| Spotlight | Syntax (Laravolt docs) |
|---|---|
| Konten MDX dikonversi manual ke JSX per halaman | **Tidak ada konversi manual.** Semua `page.md` (71 halaman) disalin apa adanya ke `content/` dan dirender via pipeline Markdoc server-side saat request |
| Route sedikit, ditulis tangan | Route diturunkan dari pohon `content/**/page.md` (home + v6 + v7, termasuk nested `/v7/forms/*`, `/v7/reference/*`, dst.) |
| Tidak ada syntax highlighting server | Fence Markdoc → node `fence` dengan kelas `language-*`; highlight ringan di client |
| Search (Algolia/FlexSearch) | **Dihilangkan** — lihat §4 |
| TOC dari rehype plugin | **Disederhanakan** — lihat §4 |

## 2. Pipeline Markdoc server-side

- `app/lib/markdoc.ts`: baca `content/<route>/page.md` → `Markdoc.parse` → validasi → `Markdoc.transform` dengan config tags (callout, quick-links, quick-link, figure) dan nodes (fence, heading dengan id slug) → `RenderableTreeNode`.
- Frontmatter dibaca dengan `js-yaml` (`title`, dsb.) untuk `<title>` dan heading halaman.
- `app/ui/markdoc.tsx`: walker rekursif RenderableTree → elemen Remix. `Tag.isTag()` untuk membedakan tag vs teks.
- Hasil: menambah/mengubah halaman = edit markdown saja, tanpa menyentuh kode.

## 3. Gotcha baru (di luar playbook lama)

1. **`@markdoc/markdoc` adalah CJS.** Di Node ESM, named import runtime (`import { Tag } from '@markdoc/markdoc'`) gagal: `SyntaxError: does not provide an export named 'Tag'`. Solusi: import default lalu destructure — `import Markdoc from '@markdoc/markdoc'; const { Tag } = Markdoc`. Named import **type-only** tetap aman karena terhapus saat compile.
2. **nvm di shell non-interaktif** (playbook §8 masih berlaku): selalu pakai path absolut `$HOME/.nvm/versions/node/v22.22.2/bin/{node,npm,npx}`; dev server via `nohup ... > /tmp/laravolt-docs-server.log 2>&1 &`; kill via `lsof -tnP -iTCP:44120 -sTCP:LISTEN | xargs kill`.
3. Jumlah konten sumber bertambah sejak brief awal: 71 `page.md` (bukan 32). Karena route diturunkan dari pohon konten, tidak ada kode yang perlu diubah.

## 4. Penyederhanaan yang diambil

- **Search dihilangkan**: template Syntax memakai FlexSearch/Algolia yang bergantung pada build-time indexing Next; di-skip untuk sesi ini. UI search bar tidak dirender.
- **TOC disederhanakan**: daftar heading h2/h3 diambil langsung dari RenderableTree saat render (tanpa rehype/plugin), tanpa scroll-spy interaktif.
- Syntax highlighting: kelas `language-*` dirender server-side; tanpa Prism React wrapper.

## 5. Hasil verifikasi (playbook §9)

- `tsc --noEmit`: **0 error**.
- Server di port 44120: **71/71 route HTTP 200** (home + seluruh v6 + v7).
- Grep konten nyata di 5 halaman berbeda (Installation, Table Component, Introduction, Form validation, Artisan commands): **semua ditemukan**.
- Code block: kelas `language-` hadir di HTML rendered (mis. 4 di `/v6/installation`).
- Nav sidebar: 40 link unik `/v6/*` + `/v7/*` di halaman home.
- `/styles.css` → 200; client entry `/assets/app/assets/entry.ts` → 200.

## 6. Menjalankan

```sh
NB=$HOME/.nvm/versions/node/v22.22.2/bin
cd /Users/rama/orca/projects/laravolt-docs-remix/laravolt-docs
$NB/npm run css
nohup $NB/node --import remix/node-tsx server.ts > /tmp/laravolt-docs-server.log 2>&1 &
# stop:
lsof -tnP -iTCP:44120 -sTCP:LISTEN | xargs kill
```
