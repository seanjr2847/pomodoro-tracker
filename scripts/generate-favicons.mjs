#!/usr/bin/env node

/**
 * SVG 로고 → 파비콘/앱 아이콘 일괄 생성
 *
 * Input:  SVG 파일 경로 (기본: public/logo.svg)
 * Output: public/ 하위에 아래 파일 생성
 *   - favicon.ico          (32x32)
 *   - favicon-16x16.png    (16x16)
 *   - favicon-32x32.png    (32x32)
 *   - apple-touch-icon.png (180x180)
 *   - icons/icon-192x192.png  (192x192)
 *   - icons/icon-512x512.png  (512x512)
 *
 * Usage:
 *   pnpm favicon:generate              # public/logo.svg 사용
 *   pnpm favicon:generate path/to.svg  # 지정 SVG 사용
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const svgPath = resolve(process.argv[2] || "public/logo.svg");
const publicDir = resolve("public");
const iconsDir = resolve("public/icons");

mkdirSync(iconsDir, { recursive: true });

const svgBuffer = readFileSync(svgPath);

const sizes = [
  { name: "favicon-16x16.png", size: 16, dir: publicDir },
  { name: "favicon-32x32.png", size: 32, dir: publicDir },
  { name: "apple-touch-icon.png", size: 180, dir: publicDir },
  { name: "icon-192x192.png", size: 192, dir: iconsDir },
  { name: "icon-512x512.png", size: 512, dir: iconsDir },
];

console.log(`📦 SVG: ${svgPath}`);

for (const { name, size, dir } of sizes) {
  const out = resolve(dir, name);
  await sharp(svgBuffer).resize(size, size).png().toFile(out);
  console.log(`  ✅ ${name} (${size}x${size})`);
}

// ICO 생성 (32x32 PNG → favicon.ico)
const png32 = readFileSync(resolve(publicDir, "favicon-32x32.png"));
const ico = await pngToIco([png32]);
writeFileSync(resolve(publicDir, "favicon.ico"), ico);
console.log("  ✅ favicon.ico");

console.log("🎉 완료");
