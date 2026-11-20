// app.test.mjs — 5 uji cepat CatatKu dengan Node + jsdom.
// Adaptasi dari pelajaran-34/test_app.mjs; bedanya root aplikasi adalah
// folder repo ini sendiri (satu level di atas folder test/).
// Memuat index.html dari server statis lokal (agar path relatif ./ dan
// localStorage berperilaku seperti di browser sungguhan), lalu menjalankan
// skenario pengguna: kosong -> tambah -> edit + refresh -> hapus -> cek CSS.
// Proses keluar dengan exit code 1 bila ada cek yang gagal, 0 bila semua lolos.
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json" };
const tidur = (ms) => new Promise((r) => setTimeout(r, ms));

const server = http.createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p === "/") p = "/index.html";
    const data = await readFile(path.join(root, p));
    res.writeHead(200, { "content-type": types[path.extname(p)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}/`;
const html = await (await fetch(base)).text();

// Muat aplikasi; storageSeed (string JSON) ditanam ke localStorage sebelum
// script jalan untuk mensimulasikan refresh dengan data yang sama.
async function muatApp(storageSeed) {
  const dom = new JSDOM(html, {
    url: base,
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    beforeParse(window) {
      window.confirm = () => true; // konfirmasi hapus di-stub: selalu "ya"
      if (storageSeed != null) window.localStorage.setItem("catatku", storageSeed);
    },
  });
  await new Promise((resolve) => {
    if (dom.window.document.readyState === "complete") resolve();
    else dom.window.addEventListener("load", resolve);
  });
  await tidur(60);
  return dom;
}

const hasil = [];
function cek(nama, kondisi, detail = "") {
  hasil.push({ nama, lolos: Boolean(kondisi), detail });
}

// ---------- Skenario 1: data kosong -> empty state ----------
let dom = await muatApp(null);
let doc = dom.window.document;
cek(
  "1. Data kosong -> empty state tampil",
  doc.body.textContent.includes("Belum ada catatan. Buat yang pertama, yuk!")
);

// ---------- Skenario 2: tambah catatan via form ----------
dom.window.location.hash = "#/baru";
await tidur(80);
doc = dom.window.document;
doc.querySelector("#input-judul").value = "Catatan Uji Satu";
doc.querySelector("#input-isi").value = "Isi catatan uji pertama.";
doc
  .querySelector("#form-catatan")
  .dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));
await tidur(80);
doc = dom.window.document;
const tersimpan = JSON.parse(dom.window.localStorage.getItem("catatku") || "[]");
cek("2a. Tambah -> catatan tampil di daftar", doc.body.textContent.includes("Catatan Uji Satu"));
cek(
  "2b. Tambah -> tersimpan di localStorage",
  tersimpan.length === 1 && tersimpan[0].judul === "Catatan Uji Satu",
  `localStorage: ${JSON.stringify(tersimpan.map((c) => c.judul))}`
);

// ---------- Skenario 3: edit + refresh ----------
const id = tersimpan[0].id;
dom.window.location.hash = `#/edit/${id}`;
await tidur(80);
doc = dom.window.document;
doc.querySelector("#input-judul").value = "Catatan Uji Diedit";
doc
  .querySelector("#form-catatan")
  .dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));
await tidur(80);
doc = dom.window.document;
cek("3a. Edit -> judul baru tampil di daftar", doc.body.textContent.includes("Catatan Uji Diedit"));
const seed = dom.window.localStorage.getItem("catatku");
dom.window.close();
dom = await muatApp(seed); // "refresh": instance baru, localStorage yang sama
doc = dom.window.document;
cek("3b. Refresh -> hasil edit tetap ada", doc.body.textContent.includes("Catatan Uji Diedit"));

// ---------- Skenario 4: hapus catatan (confirm di-stub true) ----------
doc.querySelector("[data-hapus]").click();
await tidur(80);
doc = dom.window.document;
const sisa = JSON.parse(dom.window.localStorage.getItem("catatku") || "[]");
cek("4a. Hapus -> hilang dari daftar", !doc.body.textContent.includes("Catatan Uji Diedit"));
cek("4b. Hapus -> hilang dari localStorage", sisa.length === 0, `sisa: ${sisa.length}`);
cek(
  "4c. Hapus -> empty state kembali tampil",
  doc.body.textContent.includes("Belum ada catatan. Buat yang pertama, yuk!")
);
dom.window.close();

// ---------- Skenario 5: cek statis CSS (lebar 360px & tombol) ----------
const css = await readFile(path.join(root, "css", "style.css"), "utf8");
const widths = [...css.matchAll(/(?<![-\w])width\s*:\s*(\d+)px/g)].map((m) => Number(m[1]));
cek(
  "5a. CSS: tidak ada width tetap > 360px",
  widths.every((w) => w <= 360),
  widths.length ? `width px ditemukan: ${widths.join(", ")}` : "tidak ada width tetap dalam px"
);
const btnRule = css.match(/\.btn[^{]*\{[^}]*?min-height\s*:\s*(\d+)px/);
cek(
  "5b. CSS: tombol min-height >= 44px",
  btnRule && Number(btnRule[1]) >= 44,
  btnRule ? `min-height tombol: ${btnRule[1]}px` : "aturan min-height tombol tidak ditemukan"
);

// ---------- Laporan ----------
let semuaLolos = true;
for (const h of hasil) {
  console.log(`${h.lolos ? "LOLOS" : "GAGAL"} — ${h.nama}${h.detail ? ` (${h.detail})` : ""}`);
  if (!h.lolos) semuaLolos = false;
}
console.log(semuaLolos ? "\nSEMUA UJI LULUS" : "\nADA UJI GAGAL");
server.close();
process.exit(semuaLolos ? 0 : 1);
