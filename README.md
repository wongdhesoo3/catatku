# CatatKu

Aplikasi catatan sederhana berbasis web statis murni (HTML/CSS/JavaScript vanilla, tanpa build step).
Data tersimpan di `localStorage` browser, routing memakai hash (`#/`, `#/baru`, `#/catatan/:id`, `#/edit/:id`)
sehingga tetap bekerja saat dibuka sebagai file statis maupun setelah deploy.

## Scope v1

- [x] CRUD catatan (tambah, lihat, edit, hapus dengan konfirmasi)
- [x] Halaman detail catatan
- [x] Pencarian catatan
- [x] Empty state ("Belum ada catatan. Buat yang pertama, yuk!")

Ditunda untuk versi berikutnya (butuh backend): login, database online, berbagi catatan.

## Fitur

- Tambah catatan dengan validasi: judul kosong ditolak dengan pesan yang jelas.
- Edit catatan; hasil edit tetap ada setelah halaman di-refresh.
- Hapus catatan dengan dialog konfirmasi.
- Halaman detail per catatan lewat URL `#/catatan/:id`.
- Pencarian langsung berdasarkan judul dan isi catatan.
- Data persisten di `localStorage`; data rusak/korup ditangani aman (dianggap kosong, aplikasi tidak mogok).
- Umpan balik setelah simpan/hapus (pesan status di halaman daftar).
- Responsif: nyaman di HP selebar 360px, semua tombol berukuran sentuh minimal 44px.
- Fallback SPA untuk deploy: `_redirects` (Netlify) dan `vercel.json` (Vercel) mengarahkan semua route ke `index.html`.

## Struktur

```
catatku/
├── index.html          # satu pintu masuk aplikasi
├── css/
│   └── style.css
├── js/
│   ├── app.js          # routing + state
│   ├── storage.js      # baca/tulis localStorage
│   └── views.js        # render daftar, detail, form
├── _redirects          # fallback SPA (Netlify)
├── vercel.json         # fallback SPA (Vercel)
└── README.md
```

## Cara Menjalankan (Lokal)

Paling sederhana: buka file `index.html` langsung di browser.

Atau pakai server statis lokal dari folder ini, misalnya:

```bash
npx serve .
# atau
python3 -m http.server 8000
```

lalu buka `http://localhost:8000` (sesuaikan port) di browser.

## URL Publik

https://wongdhesoo3.github.io/catatku/

Terbit lewat GitHub Pages (branch `gh-pages`).
