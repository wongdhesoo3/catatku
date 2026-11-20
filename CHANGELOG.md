# Changelog

Semua perubahan penting pada CatatKu dicatat di file ini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.0.0/) dan proyek ini memakai versi sesuai field `version` di `package.json`.

## [Unreleased]

### Changed

- README ditulis ulang mengikuti anatomi dokumentasi yang meyakinkan: nilai utama satu kalimat + demo live + stack di layar pertama, Quick Start 5 langkah dengan hasil yang diharapkan, contoh penggunaan input → output, bagian Menjalankan Test, Keterbatasan & Roadmap, dan Troubleshooting.
- Dokumentasi pendukung ditambahkan: `CONTRIBUTING.md` (setup dev, aturan branch, conventional commits, aturan PR), `docs/architecture.md` (struktur dan aliran data), dan `.env.example` (pernyataan bahwa aplikasi tidak membutuhkan secret).

## [1.0.0] - 2026-11-20

Rilis v1 CatatKu: aplikasi catatan statis yang berjalan penuh di browser dan terbit sebagai demo live di GitHub Pages.

### Added

- CRUD catatan: tambah, halaman daftar, halaman detail (`#/catatan/:id`), edit (`#/edit/:id`), dan hapus dengan dialog konfirmasi.
- Validasi form: judul kosong ditolak dengan pesan "Judul tidak boleh kosong." dan judul minimal 3 karakter.
- Pencarian langsung berdasarkan judul dan isi catatan.
- Persistensi di `localStorage` browser (kunci `catatku`), termasuk penanganan aman bila data tersimpan rusak/korup (dianggap kosong, aplikasi tidak mogok).
- Routing berbasis hash (`#/`, `#/baru`, `#/catatan/:id`, `#/edit/:id`) sehingga aplikasi tetap bekerja sebagai file statis tanpa konfigurasi server.
- Tampilan responsif (nyaman di lebar 360px, tombol sentuh minimal 44px), empty state "Belum ada catatan. Buat yang pertama, yuk!", dan pesan status setelah simpan/hapus.
- Fallback SPA `_redirects` (Netlify) dan `vercel.json` (Vercel).
- Test perilaku otomatis dengan Node + jsdom (`test/app.test.mjs`, 5 skenario / 10 pemeriksaan), lint sintaks (`node --check`), dan skrip build ke `dist/`.
- CI/CD GitHub Actions: lint + test + build pada push dan pull request ke `main`, lalu deploy otomatis ke GitHub Pages untuk push ke `main` yang lolos CI.
