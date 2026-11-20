// views.js — template tampilan: daftar, detail, dan form.
// Semua teks dari pengguna di-escape dulu agar aman disisipkan ke HTML.

function escapeHtml(teks) {
  return String(teks ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// Bagian daftar catatan saja (dipakai ulang saat pencarian berubah)
function viewDaftarList(catatan, q) {
  if (!catatan.length) {
    return `<p class="kosong">Belum ada catatan. Buat yang pertama, yuk!</p>`;
  }
  const hasil = catatan.filter((c) =>
    (c.judul + " " + c.isi).toLowerCase().includes(q.toLowerCase())
  );
  if (!hasil.length) {
    return `<p class="kosong">Tidak ada catatan yang cocok dengan pencarian "${escapeHtml(q)}".</p>`;
  }
  return `<div class="daftar">${hasil
    .map(
      (c) => `
      <article class="kartu">
        <h3><a href="#/catatan/${c.id}">${escapeHtml(c.judul)}</a></h3>
        <p>${escapeHtml(c.isi)}</p>
        <div class="aksi">
          <a class="btn btn-kecil" href="#/edit/${c.id}">Edit</a>
          <button class="btn btn-kecil btn-bahaya" data-hapus="${c.id}">Hapus</button>
        </div>
      </article>`
    )
    .join("")}</div>`;
}

function viewDaftar(catatan, q, pesan) {
  return `
    ${pesan ? `<p class="sukses" role="status">${escapeHtml(pesan)}</p>` : ""}
    <div class="toolbar">
      <input id="cari" type="search" placeholder="Cari catatan..." aria-label="Cari catatan" value="${escapeHtml(q)}">
      <a class="btn" href="#/baru">+ Catatan Baru</a>
    </div>
    <section id="daftar-list">${viewDaftarList(catatan, q)}</section>`;
}

function viewDetail(c) {
  if (!c) {
    return `
      <p class="kosong">Catatan tidak ditemukan.</p>
      <p><a class="btn" href="#/">Kembali ke daftar</a></p>`;
  }
  return `
    <article class="detail">
      <h2>${escapeHtml(c.judul)}</h2>
      <p>${escapeHtml(c.isi)}</p>
      <div class="aksi">
        <a class="btn" href="#/edit/${c.id}">Edit</a>
        <button class="btn btn-bahaya" data-hapus="${c.id}">Hapus</button>
        <a class="btn" href="#/">Kembali</a>
      </div>
    </article>`;
}

// nilai: { judul, isi } yang ditampilkan di form (untuk tambah: kosong;
// untuk edit: data catatan; untuk error validasi: ketikan terakhir pengguna)
function viewForm(nilai, error, sedangEdit) {
  return `
    <h2>${sedangEdit ? "Edit Catatan" : "Catatan Baru"}</h2>
    ${error ? `<p class="error" role="alert">${escapeHtml(error)}</p>` : ""}
    <form id="form-catatan">
      <label>Judul
        <input name="judul" id="input-judul" type="text" placeholder="Judul catatan" value="${escapeHtml(nilai.judul)}">
      </label>
      <label>Isi
        <textarea name="isi" id="input-isi" rows="5" placeholder="Tulis isi catatan...">${escapeHtml(nilai.isi)}</textarea>
      </label>
      <div class="aksi">
        <button class="btn" type="submit">${sedangEdit ? "Simpan Perubahan" : "Simpan Catatan"}</button>
        <a class="btn" href="#/">Batal</a>
      </div>
    </form>`;
}
