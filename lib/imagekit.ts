import "server-only";

import ImageKit from "@imagekit/nodejs";

let client: ImageKit | undefined;

export function getImageKitClient() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("Missing IMAGEKIT_PRIVATE_KEY environment variable.");
  }

  client ??= new ImageKit({ privateKey });
  return client;
}

export async function uploadToImageKit(
  file: ImageKit.FileUploadParams["file"],
  fileName: string,
  folder = "/ovalen",
) {
  return getImageKitClient().files.upload({
    file,
    fileName,
    folder,
    overwriteFile: true,
    useUniqueFileName: false,
  });
}
