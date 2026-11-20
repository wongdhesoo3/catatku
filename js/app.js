// app.js — routing berbasis hash + satu state bersama + wiring event.
// Semua halaman membaca/mengubah state `catatan` yang sama, lalu render ulang.

let catatan = muatCatatan();
let kataCari = "";
let pesanFlash = "";

const app = document.querySelector("#app");

function idBaru() {
  const terbesar = catatan.reduce((m, c) => Math.max(m, c.id), 0);
  return Math.max(Date.now(), terbesar + 1);
}

// Route: #/ daftar | #/baru tambah | #/catatan/:id detail | #/edit/:id edit
function parseRoute() {
  const bagian = (location.hash || "#/")
    .replace(/^#\/?/, "")
    .split("/")
    .filter(Boolean);
  if (bagian[0] === "baru") return { nama: "baru" };
  if (bagian[0] === "catatan" && bagian[1]) return { nama: "detail", id: Number(bagian[1]) };
  if (bagian[0] === "edit" && bagian[1]) return { nama: "edit", id: Number(bagian[1]) };
  return { nama: "daftar" };
}

function pergiKeDaftar() {
  // Jika hash berubah, hashchange yang memicu render; jika sudah di daftar, render langsung.
  if ((location.hash || "#/") === "#/") render();
  else location.hash = "#/";
}

function pasangTombolHapus() {
  document.querySelectorAll("[data-hapus]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.hapus);
      if (!confirm("Hapus catatan ini?")) return;
      catatan = catatan.filter((c) => c.id !== id);
      simpanCatatan(catatan);
      pesanFlash = "Catatan berhasil dihapus.";
      pergiKeDaftar();
    });
  });
}

function pasangForm(catatanEdit) {
  const form = document.querySelector("#form-catatan");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const judul = document.querySelector("#input-judul").value.trim();
    const isi = document.querySelector("#input-isi").value.trim();

    // Validasi: judul kosong ditolak dengan pesan jelas, bukan jadi catatan hantu
    if (!judul) {
      app.innerHTML = viewForm({ judul, isi }, "Judul tidak boleh kosong.", Boolean(catatanEdit));
      pasangForm(catatanEdit);
      return;
    }

    // Validasi tambahan: judul terlalu pendek sulit dicari lagi nanti
    if (judul.length < 3) {
      app.innerHTML = viewForm({ judul, isi }, "Judul minimal 3 karakter.", Boolean(catatanEdit));
      pasangForm(catatanEdit);
      return;
    }

    if (catatanEdit) {
      catatan = catatan.map((c) => (c.id === catatanEdit.id ? { ...c, judul, isi } : c));
      pesanFlash = "Perubahan berhasil disimpan.";
    } else {
      catatan = [...catatan, { id: idBaru(), judul, isi }];
      pesanFlash = "Catatan berhasil disimpan.";
    }
    simpanCatatan(catatan);
    pergiKeDaftar();
  });
}

function render() {
  const route = parseRoute();

  if (route.nama === "daftar") {
    app.innerHTML = viewDaftar(catatan, kataCari, pesanFlash);
    pesanFlash = "";
    const cari = document.querySelector("#cari");
    cari.addEventListener("input", () => {
      kataCari = cari.value;
      document.querySelector("#daftar-list").innerHTML = viewDaftarList(catatan, kataCari);
      pasangTombolHapus();
    });
  } else if (route.nama === "baru") {
    app.innerHTML = viewForm({ judul: "", isi: "" }, "", false);
    pasangForm(null);
  } else if (route.nama === "edit") {
    const c = catatan.find((x) => x.id === route.id);
    if (!c) {
      app.innerHTML = viewDetail(undefined);
    } else {
      app.innerHTML = viewForm({ judul: c.judul, isi: c.isi }, "", true);
      pasangForm(c);
    }
  } else {
    // detail
    app.innerHTML = viewDetail(catatan.find((x) => x.id === route.id));
  }

  pasangTombolHapus();
}

window.addEventListener("hashchange", render);
render();
