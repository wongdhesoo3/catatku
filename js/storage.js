// storage.js — baca/tulis localStorage dengan aman.
// Data rusak (JSON tidak valid / bukan array) dianggap data kosong,
// supaya aplikasi tidak mogok hanya karena data lama yang korup.
const KUNCI_CATATKU = "catatku";

function muatCatatan() {
  try {
    const data = JSON.parse(localStorage.getItem(KUNCI_CATATKU));
    return Array.isArray(data) ? data : [];
  } catch {
    return []; // data rusak? mulai dari kosong
  }
}

function simpanCatatan(catatan) {
  localStorage.setItem(KUNCI_CATATKU, JSON.stringify(catatan));
}
