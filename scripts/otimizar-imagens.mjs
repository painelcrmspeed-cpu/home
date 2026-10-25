// Deixa as imagens de public/modelos leves (WebP, ate 1280 px de largura).
// Os originais ficam guardados na pasta "originais" (que nao vai para o GitHub).
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("public", "modelos");
const backup = path.resolve("originais");
const IMG = /\.(png|jpe?g|webp|avif)$/i;
const slug = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

if (!fs.existsSync(root)) { console.log("Pasta public/modelos nao encontrada. Rode dentro da pasta do projeto."); process.exit(1); }

let total = 0, antes = 0, depois = 0;
for (const d of fs.readdirSync(root, { withFileTypes: true })) {
  if (!d.isDirectory()) continue;
  const dir = path.join(root, d.name);
  const files = fs.readdirSync(dir).filter((f) => IMG.test(f)).sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));
  let i = 0;
  for (const f of files) {
    i++;
    const input = path.join(dir, f);
    const base = slug(path.parse(f).name);
    const generic = /(image|imagem|chatgpt|gemini|dola|captura|screenshot|^\d+$|^modelo)/.test(base) || base.length > 30 || base.length === 0;
    const outName = (generic ? `modelo-${i}` : base) + ".webp";
    const output = path.join(dir, outName);
    const buf = await sharp(input).rotate().resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    const size = fs.statSync(input).size;
    if (path.resolve(input) !== path.resolve(output)) {
      const bdir = path.join(backup, d.name);
      fs.mkdirSync(bdir, { recursive: true });
      fs.copyFileSync(input, path.join(bdir, f));
      fs.unlinkSync(input);
    }
    fs.writeFileSync(output, buf);
    total++; antes += size; depois += buf.length;
    console.log(`${d.name}/${f}  ->  ${outName}  (${Math.round(size / 1024)} KB -> ${Math.round(buf.length / 1024)} KB)`);
  }
}
console.log(`\nPronto: ${total} imagens. ${Math.round(antes / 1024)} KB -> ${Math.round(depois / 1024)} KB.`);
