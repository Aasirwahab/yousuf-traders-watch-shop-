import { createReadStream } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { loadEnvFile } from "node:process";

import ImageKit from "@imagekit/nodejs";

loadEnvFile(path.resolve(".env"));

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  throw new Error("Missing IMAGEKIT_PRIVATE_KEY in .env");
}

const client = new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY });
const publicDirectory = path.resolve("public");
const supportedExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"]);

async function collectImages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(directory, entry.name);
      return entry.isDirectory() ? collectImages(absolutePath) : [absolutePath];
    }),
  );

  return files.flat().filter((file) => supportedExtensions.has(path.extname(file).toLowerCase()));
}

const files = await collectImages(publicDirectory);

for (const absolutePath of files) {
  const relativePath = path.relative(publicDirectory, absolutePath);
  const directory = path.dirname(relativePath).split(path.sep).join("/");
  const folder = directory === "." ? "/ovalen" : `/ovalen/${directory}`;

  const result = await client.files.upload({
    file: createReadStream(absolutePath),
    fileName: path.basename(relativePath),
    folder,
    overwriteFile: true,
    useUniqueFileName: false,
  });

  console.log(`Uploaded ${relativePath} -> ${result.url}`);
}

console.log(`Synced ${files.length} images to ImageKit.`);
