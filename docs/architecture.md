# Arsitektur CatatKu

Dokumen ringkas tentang struktur proyek dan aliran data CatatKu. Untuk cara menjalankan dan menguji, lihat [README](../README.md); untuk aturan berkontribusi, lihat [CONTRIBUTING](../CONTRIBUTING.md).

## Struktur Folder

```
catatku/
├── index.html              # satu-satunya halaman; memuat css dan 3 skrip secara berurutan
├── css/
│   └── style.css           # seluruh gaya, termasuk tata letak responsif 360px
├── js/
│   ├── storage.js          # baca/tulis localStorage (muatCatatan, simpanCatatan)
│   ├── views.js            # fungsi template HTML murni: daftar, detail, form
│   └── app.js              # routing hash + state bersama + wiring event + render
├── test/
│   └── app.test.mjs        # test perilaku dengan Node + jsdom (5 skenario)
├── scripts/
│   └── build.mjs           # menyalin file statis ke dist/ untuk deploy
├── .github/workflows/
│   └── ci.yml              # CI (lint, test, build) + deploy GitHub Pages
├── _redirects              # fallback SPA untuk Netlify
├── vercel.json             # fallback SPA untuk Vercel
└── package.json            # skrip lint/test/build; satu-satunya dependensi: jsdom (dev)
```

Urutan pemuatan skrip di `index.html` penting dan tidak bisa diacak: `storage.js` → `views.js` → `app.js`, karena `app.js` memanggil fungsi dari dua file sebelumnya saat pertama kali dirender.

## Aliran Data

```
localStorage (kunci "catatku", JSON array)
        │  muatCatatan() saat aplikasi mulai
        ▼
state bersama `catatan` di js/app.js  ──►  views.js merender HTML dari state
        ▲                                        │
        │                                        ▼
        └── simpanCatatan() sesudah      pengguna berinteraksi
            tambah/edit/hapus            (klik, submit form, ketik pencarian)
```

1. Saat halaman dibuka, `app.js` memuat state dengan `muatCatatan()` dari `js/storage.js`, lalu memanggil `render()`.
2. `render()` membaca route dari `location.hash`, memilih template dari `js/views.js` (daftar, detail, atau form), menulis hasilnya ke `<main id="app">`, lalu memasang event listener yang relevan.
3. Setiap aksi yang mengubah data (submit form, klik hapus yang terkonfirmasi) memperbarui state, memanggil `simpanCatatan()` untuk menulis ulang seluruh array ke `localStorage`, memasang pesan flash, dan kembali ke route daftar.
4. Perubahan hash memicu event `hashchange` yang memanggil `render()` lagi — tidak ada reload halaman.
5. Pencarian bersifat tampilan saja: kata kunci disimpan di variabel `kataCari`, daftar disaring saat render, data di `localStorage` tidak berubah.

Semua teks dari pengguna dilewatkan ke `escapeHtml()` di `views.js` sebelum disisipkan ke HTML, sehingga isi catatan tidak bisa menyuntikkan markup/skrip.

## Keputusan Teknis

### JavaScript vanilla, tanpa framework dan tanpa build step

Aplikasi sebesar ini tidak membutuhkan React/Vue: tiga skrip klasik sudah cukup, halaman bisa dibuka langsung sebagai file, dan tidak ada rantai build yang bisa rusak.

Konsekuensi:

- Fungsi antarfile dibagikan lewat cakupan global, jadi urutan `<script>` menentukan ketersediaan fungsi; nama fungsi harus unik secara global.
- Tidak ada modul ES dan tidak ada tree-shaking — dapat diterima pada ukuran kode saat ini, tetapi file akan perlu dipecah bila fitur tumbuh besar.
- Satu-satunya langkah "build" (`scripts/build.mjs`) hanya menyalin file statis ke `dist/`; tidak ada transpiler atau bundler.

### Routing berbasis hash

Route ditulis sebagai `#/`, `#/baru`, `#/catatan/:id`, dan `#/edit/:id`, diurai oleh `parseRoute()` di `app.js`.

Alasan: hosting statis (GitHub Pages, Netlify, Vercel, bahkan `file://`) tidak perlu konfigurasi rewrite apa pun agar semua "halaman" bisa dibuka dan di-refresh.

Konsekuensi:

- URL selalu mengandung `#`; tidak ada path asli per catatan, tidak ada status HTTP per halaman, dan SEO terbatas.
- File `_redirects` dan `vercel.json` tetap disediakan sebagai fallback bila suatu saat routing diganti ke path asli.

### Penyimpanan di localStorage

Seluruh daftar catatan disimpan sebagai satu JSON array pada kunci `catatku`. `muatCatatan()` membungkus `JSON.parse` dengan try/catch dan pemeriksaan `Array.isArray`: data yang rusak dianggap daftar kosong, bukan error fatal.

Konsekuensi:

- Data terikat pada satu browser dan satu origin; tidak ada sinkronisasi, akun, atau berbagi — keterbatasan ini diakui terbuka di README dan menjadi alasan roadmap backend.
- Kapasitas praktis sekitar 5 MB per origin; cukup untuk catatan teks, tidak untuk lampiran.
- Setiap penulisan menulis ulang seluruh array — sederhana dan konsisten pada skala ini.
