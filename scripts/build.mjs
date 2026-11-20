// build.mjs — siapkan folder dist/ berisi salinan file statis CatatKu
// yang siap dideploy (dipakai lokal maupun oleh GitHub Actions).
import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

// Hapus dist/ lama agar tidak ada sisa file usang, lalu buat ulang.
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const berkas of ["index.html", "_redirects", "vercel.json"]) {
  await cp(path.join(root, berkas), path.join(dist, berkas));
}
for (const folder of ["css", "js"]) {
  await cp(path.join(root, folder), path.join(dist, folder), { recursive: true });
}

console.log("Build selesai: dist/ berisi index.html, css/, js/, _redirects, vercel.json");
