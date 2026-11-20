# CatatKu — Catatan Sederhana

## Masalah

Catatan harian — ide, daftar tugas kecil, hal yang harus diingat — sering ditulis sembarangan: di kertas yang hilang, di chat ke diri sendiri yang tenggelam, atau di aplikasi berat yang harus daftar dan login dulu. Akibatnya catatan berantakan dan susah dicari lagi saat dibutuhkan.

## Solusi

CatatKu adalah aplikasi catatan berbasis web yang ringan dan langsung bisa dipakai tanpa akun: buka halaman, tulis catatan, selesai. Tidak ada server, tidak ada pendaftaran — data disimpan di browser kamu sendiri.

**Demo live:** https://wongdhesoo3.github.io/catatku/

## Fitur Utama

- **CRUD catatan lengkap** — tambah, lihat detail, edit, dan hapus (dengan dialog konfirmasi).
- **Validasi judul** — judul kosong atau terlalu pendek ditolak dengan pesan yang jelas.
- **Pencarian langsung** — berdasarkan judul dan isi catatan, hasil menyaring saat mengetik.
- **Persistensi localStorage** — catatan tetap ada setelah halaman di-refresh; data yang korup ditangani aman (dianggap kosong, aplikasi tidak mogok).
- **Halaman detail per catatan** — lewat routing hash (`#/catatan/:id`), tetap bekerja sebagai situs statis.
- **Umpan balik status** — pesan konfirmasi muncul setelah simpan/hapus.
- **Responsif** — nyaman di layar HP selebar 360px, semua tombol berukuran sentuh minimal 44px.

## Menjalankan Lokal

Aplikasi ini statis murni — tidak ada build step dan tidak ada dependensi runtime.

Cara paling sederhana: buka file `index.html` langsung di browser.

Atau jalankan server statis dari folder proyek:

```bash
npx serve .
# atau
python3 -m http.server 8000
```

lalu buka `http://localhost:8000` di browser.

Menjalankan test dan pemeriksaan kode (memakai Node.js, sesuai pipeline CI):

```bash
npm ci      # memasang jsdom untuk test
npm run lint
npm test    # test perilaku aplikasi dengan jsdom (node test/app.test.mjs)
npm run build
```

## Keputusan Teknis

- **Vanilla JavaScript tanpa framework.** Aplikasi sekecil ini tidak butuh React/Vue; tanpa framework berarti tanpa build step, muat instan, dan kode mudah diaudit. Trade-off: routing dan rendering ditulis manual (hash routing + render fungsi), yang masih terkendali di skala ini tapi akan terasa berat bila fitur tumbuh besar.
- **localStorage untuk persistensi.** Data langsung tersimpan di browser tanpa backend, sehingga aplikasi bekerja offline dan gratis di-hosting statis. Trade-off: data terikat pada satu browser/perangkat — belum ada sinkronisasi antarperangkat dan tidak ada akun pengguna.
- **GitHub Actions untuk CI + deploy.** Setiap push/PR ke `main` menjalankan lint, test, dan build; push ke `main` otomatis men-deploy ke GitHub Pages. Trade-off: pipeline bergantung pada ekosistem GitHub, tapi sebagai gantinya tidak ada server deploy yang perlu dirawat.

## Keterbatasan

- Data hanya tersimpan di browser lokal (localStorage) — ganti browser atau bersihkan data situs berarti catatan hilang.
- Belum ada akun pengguna, sinkronisasi cloud, maupun berbagi catatan; fitur-fitur itu membutuhkan backend dan direncanakan untuk versi berikutnya.
- Satu perangkat, satu daftar catatan: belum ada kategori/label dan belum ada ekspor/impor.

## Lisensi

Proyek pribadi untuk portofolio dan pembelajaran.
