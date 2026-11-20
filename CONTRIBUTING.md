# Berkontribusi ke CatatKu

Terima kasih sudah tertarik berkontribusi. Dokumen ini menjelaskan cara menyiapkan lingkungan pengembangan, aturan branch dan commit, serta aturan pull request di proyek CatatKu.

## Setup Lingkungan Dev

Prasyarat: [Node.js](https://nodejs.org) versi 20 atau lebih baru dan npm.

```bash
git clone https://github.com/wongdhesoo3/catatku.git
cd catatku
npm ci
```

Menjalankan aplikasi secara lokal (pilih salah satu):

```bash
npx serve .              # server statis, alamat ditampilkan di terminal
python3 -m http.server 8000
```

atau buka file `index.html` langsung di browser. Tidak ada build step dan tidak ada variabel lingkungan yang wajib diatur — lihat `.env.example` untuk catatan lengkapnya.

## Aturan Branch

- Jangan commit langsung ke `main`. Buat branch baru dari `main` untuk setiap perubahan.
- Penamaan branch memakai awalan jenis perubahan + nama singkat dengan tanda hubung:
  - `fitur/<nama-singkat>` — fitur baru, contoh: `fitur/ekspor-json`
  - `fix/<nama-singkat>` — perbaikan bug, contoh: `fix/pencarian-huruf-besar`
  - `docs/<nama-singkat>` — dokumentasi, contoh: `docs/readme-quick-start`
- Satu branch untuk satu topik. Perubahan yang tidak berhubungan dipisah ke branch dan PR masing-masing.

## Format Commit

Proyek ini memakai [Conventional Commits](https://www.conventionalcommits.org):

```
<jenis>(<cakupan>): <ringkasan singkat huruf kecil>
```

- Jenis yang dipakai: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`.
- Cakupan bersifat opsional, contoh: `feat(pencarian): saring judul dan isi sekaligus`.
- Ringkasan ditulis sebagai perintah singkat tentang apa yang dilakukan commit, bukan laporan panjang. Penjelasan "mengapa" yang penting ditulis di badan commit atau di deskripsi PR.
- Commit kecil dan atomik: satu commit menyelesaikan satu hal yang bisa dijelaskan dalam satu kalimat.

## Sebelum Push: Jalankan Pemeriksaan

Semua pemeriksaan berikut harus lolos di lokal sebelum push — pipeline CI di GitHub Actions menjalankan hal yang sama:

```bash
npm run lint   # node --check untuk semua file di js/
npm test       # 5 skenario perilaku dengan jsdom; harus berakhir "SEMUA UJI LULUS"
npm run build  # memastikan folder dist/ bisa dibuat tanpa error
```

## Aturan Pull Request

- PR dibuka ke branch `main` dan menjelaskan tiga hal di deskripsinya:
  - **Apa** — perubahan apa yang dibuat.
  - **Mengapa** — masalah atau kebutuhan di balik perubahan itu.
  - **Cara Menguji** — langkah konkret yang bisa diulang peninjau untuk membuktikan perubahan bekerja (perintah yang dijalankan dan hasil yang terlihat).
- CI harus hijau (lint, test, build lolos) sebelum PR digabungkan.
- PR ditinjau (review) sebelum merge — termasuk PR sendiri: baca ulang diff-nya, pastikan tidak ada file sisa (`node_modules/`, `dist/`, file sementara) yang ikut ter-commit, karena keduanya sudah tercantum di `.gitignore`.
- Fitur atau perubahan perilaku yang menyentuh `js/` wajib disertai penyesuaian/pengujian di `test/app.test.mjs` bila relevan, dan perubahan yang terlihat pengguna dicatat di `CHANGELOG.md` pada bagian `Unreleased`.
- Gabungkan (merge) dengan riwayat yang rapi; hapus branch setelah PR selesai.
