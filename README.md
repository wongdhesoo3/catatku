# CatatKu — Catatan Sederhana

CatatKu adalah aplikasi catatan berbasis web yang ringan: tulis, cari, dan kelola catatan harian langsung dari browser, tanpa akun dan tanpa server.

**Demo live:** https://wongdhesoo3.github.io/catatku/
**Stack:** HTML · CSS · JavaScript vanilla (tanpa framework, tanpa build step) · localStorage · GitHub Actions untuk CI/CD

[![CI CatatKu](https://github.com/wongdhesoo3/catatku/actions/workflows/ci.yml/badge.svg)](https://github.com/wongdhesoo3/catatku/actions/workflows/ci.yml)

## Fitur Utama

- **Catatan lengkap dalam hitungan detik** — tambah, lihat detail, edit, dan hapus (dengan konfirmasi) lewat halaman daftar, detail (`#/catatan/:id`), dan form (`#/baru`, `#/edit/:id`).
- **Judul tidak pernah kosong atau terlalu pendek** — form menolak judul kosong dan judul di bawah 3 karakter dengan pesan error yang jelas, bukan catatan hantu.
- **Temukan catatan cukup dengan mengetik** — pencarian langsung menyaring daftar berdasarkan judul dan isi saat kamu mengetik.
- **Catatan tetap ada setelah browser ditutup** — semua data tersimpan otomatis di `localStorage`; data yang rusak/korup ditangani aman (dianggap kosong, aplikasi tidak mogok).
- **Nyaman dibuka dari HP** — tampilan responsif yang tetap rapi di layar 360px dengan tombol sentuh minimal 44px, plus pesan status setelah simpan/hapus.

## Quick Start

Prasyarat: [Node.js](https://nodejs.org) versi 20 atau lebih baru dan npm (hanya untuk lint, test, dan build — aplikasinya sendiri murni statis).

1. Ambil kode sumber:

   ```bash
   git clone https://github.com/wongdhesoo3/catatku.git
   cd catatku
   ```

2. Pasang dependensi pengembangan (jsdom untuk test):

   ```bash
   npm ci
   ```

   Hasil yang diharapkan: instalasi selesai tanpa error dan folder `node_modules/` terbentuk.

3. Periksa sintaks semua file JavaScript:

   ```bash
   npm run lint
   ```

   Hasil yang diharapkan: perintah selesai tanpa output error (ketiga file `js/` lolos `node --check`).

4. Jalankan test perilaku aplikasi:

   ```bash
   npm test
   ```

   Hasil yang diharapkan: 10 pemeriksaan berstatus `LOLOS` dan baris terakhir berbunyi `SEMUA UJI LULUS`.

5. Jalankan aplikasinya — buka `index.html` langsung di browser, atau pakai server statis lokal:

   ```bash
   npx serve .
   ```

   lalu buka alamat yang ditampilkan (biasanya `http://localhost:3000`). Hasil yang diharapkan: halaman CatatKu terbuka dengan pesan "Belum ada catatan. Buat yang pertama, yuk!".

## Contoh Penggunaan

- **Input:** klik **+ Catatan Baru**, isi judul `Belanja Mingguan` dan isi `Susu, telur, kopi`, lalu klik **Simpan Catatan**.
  **Output:** muncul pesan "Catatan berhasil disimpan.", catatan tampil sebagai kartu di daftar, dan tetap ada setelah halaman di-refresh.
- **Input:** ketik `belanja` di kolom pencarian.
  **Output:** daftar langsung menyaring dan hanya menampilkan catatan yang judul/isinya mengandung kata itu.
- **Input:** buka `https://wongdhesoo3.github.io/catatku/#/catatan/1` (atau klik judul catatan).
  **Output:** halaman detail catatan tersebut terbuka, lengkap dengan tombol Edit dan Hapus.

## Arsitektur Singkat

Satu halaman `index.html` memuat tiga skrip klasik berurutan: `js/storage.js` (baca/tulis `localStorage`), `js/views.js` (fungsi template HTML), dan `js/app.js` (routing hash + satu state bersama + wiring event). Setiap perubahan state disimpan ke `localStorage` lalu halaman di-render ulang dari state tersebut. Penjelasan lengkap ada di [docs/architecture.md](docs/architecture.md).

## Menjalankan Test

```bash
npm ci
npm run lint   # node --check untuk js/app.js, js/storage.js, js/views.js
npm test       # 5 skenario jsdom: kosong -> tambah -> edit + refresh -> hapus -> cek CSS
npm run build  # menyalin file statis ke dist/ (dipakai untuk deploy)
```

Output `npm test` yang diharapkan: 10 baris pemeriksaan `LOLOS` (skenario 1, 2a, 2b, 3a, 3b, 4a, 4b, 4c, 5a, 5b) dan ditutup `SEMUA UJI LULUS`. Pipeline yang sama berjalan otomatis di GitHub Actions pada setiap push dan pull request ke `main`; push ke `main` yang lolos CI otomatis men-deploy `dist/` ke GitHub Pages.

## Keterbatasan & Roadmap

Keterbatasan saat ini (jujur, apa adanya):

- Data hanya tersimpan di `localStorage` satu browser (kunci `catatku`, batas wajar sekitar 5 MB): ganti browser/perangkat atau membersihkan data situs akan menghapus catatan.
- Belum ada akun pengguna, sinkronisasi antarperangkat, maupun berbagi catatan — ketiganya membutuhkan backend.
- Routing memakai hash (`#/...`), jadi tidak ada URL path asli per catatan dan tidak ada rendering di sisi server.

Roadmap:

- [ ] Ekspor/impor catatan sebagai file JSON.
- [ ] Backend + akun pengguna untuk sinkronisasi antarperangkat.
- [ ] Berbagi catatan lewat tautan.

## Berkontribusi & Riwayat Rilis

- Cara setup lingkungan dev, aturan branch, format commit, dan aturan pull request: [CONTRIBUTING.md](CONTRIBUTING.md)
- Riwayat perubahan per versi: [CHANGELOG.md](CHANGELOG.md)

## Troubleshooting

- **`npm ci` gagal atau `jsdom` tidak ditemukan saat `npm test`** — pastikan Node.js versi 20+ (`node --version`), lalu hapus folder `node_modules` dan jalankan `npm ci` ulang dari folder proyek.
- **Port sudah dipakai saat menjalankan server statis** (mis. `EADDRINUSE` atau halaman yang terbuka bukan CatatKu) — ganti port, contoh: `npx serve -l 3001 .` atau `python3 -m http.server 8001`, lalu buka alamat dengan port baru itu.
- **Catatan "hilang" padahal tidak dihapus** — data terikat pada origin (protokol + host + port) yang sama: catatan yang dibuat saat membuka `index.html` sebagai file (`file://`) tidak terbaca saat membuka lewat `http://localhost:3000`, dan sebaliknya. Buka aplikasi lewat alamat yang sama seperti saat membuat catatan.

## Lisensi

Proyek pribadi untuk portofolio dan pembelajaran.
