// Converte para WebP (ate 1280 px de largura) as imagens de public/modelos que ainda nao estao leves.
// Imagens que ja sao WebP e leves ficam como estao. Os originais vao para a pasta "originais" (fora do GitHub).
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("public", "modelos");
const backup = path.resolve("originais");
const IMG = /\.(png|jpe?g|webp|avif)$/i;
const GENERIC = /(image|imagem|chatgpt|gemini|dola|captura|screenshot|^\d+$|^modelo)/;
const slug = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

if (!fs.existsSync(root)) { console.log("Pasta public/modelos nao encontrada. Rode dentro da pasta do projeto."); process.exit(1); }

let feitos = 0, pulados = 0, antes = 0, depois = 0;
for (const d of fs.readdirSync(root, { withFileTypes: true })) {
  if (!d.isDirectory()) continue;
  const dir = path.join(root, d.name);
  const files = fs.readdirSync(dir).filter((f) => IMG.test(f)).sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));
  const taken = new Set(files.map((f) => f.toLowerCase()));
  let i = 0;
  for (const f of files) {
    i++;
    const input = path.join(dir, f);
    const size = fs.statSync(input).size;
    const meta = await sharp(input).metadata();
    if (/\.webp$/i.test(f) && (meta.width ?? 0) <= 1280 && size <= 400 * 1024) {
      pulados++;
      console.log(`${d.name}/${f}  (ja esta leve, mantido)`);
      continue;
    }
    const base = slug(path.parse(f).name);
    const stem = GENERIC.test(base) || base.length > 30 || base.length === 0 ? `modelo-${i}` : base;
    let out = `${stem}.webp`;
    let n = 2;
    while (taken.has(out.toLowerCase()) && out.toLowerCase() !== f.toLowerCase()) out = `${stem}-${n++}.webp`;
    taken.add(out.toLowerCase());
    const output = path.join(dir, out);
    const buf = await sharp(input).rotate().resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    const bdir = path.join(backup, d.name);
    fs.mkdirSync(bdir, { recursive: true });
    fs.copyFileSync(input, path.join(bdir, f));
    if (path.resolve(input) !== path.resolve(output)) fs.unlinkSync(input);
    fs.writeFileSync(output, buf);
    feitos++; antes += size; depois += buf.length;
    console.log(`${d.name}/${f}  ->  ${out}  (${Math.round(size / 1024)} KB -> ${Math.round(buf.length / 1024)} KB)`);
  }
}
console.log(`\nConvertidas: ${feitos}. Mantidas: ${pulados}. Peso das convertidas: ${Math.round(antes / 1024)} KB -> ${Math.round(depois / 1024)} KB.`);
