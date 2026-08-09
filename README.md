# Laravolt Docs

Dokumentasi [Laravolt](https://laravolt.dev) — dibangun dengan **Remix v3 (beta)** + **Markdoc** + **Tailwind CSS**.

Migrasi dari Next.js 15 (Syntax template) ke Remix v3.0.0-beta.5.

## Development

```bash
npm install
npm run dev
```

Server berjalan di `http://localhost:44120`.

## Struktur

- `app/` — kode aplikasi Remix (routes, layout, komponen UI, pipeline Markdoc)
- `content/` — konten dokumentasi dalam Markdown/Markdoc, dikelompokkan per versi (mis. `content/v7/`)
- `public/` — aset statis (gambar, CSS hasil build)
- `docs/` — catatan internal proses migrasi

## Fitur

- Rendering Markdoc server-side dengan syntax highlighting
- `llms.txt`, `llms-full.txt`, dan mirror `.md` per halaman untuk konsumsi AI/LLM
- Tombol **Copy Markdown** (copy, view raw, open in ChatGPT/Claude) di tiap halaman
- Navigasi multi-versi, pencarian, dark mode

## Scripts

| Perintah | Keterangan |
| --- | --- |
| `npm run dev` | Jalankan dev server |
| `npm run build` | Build untuk produksi |
| `npm start` | Jalankan hasil build |
