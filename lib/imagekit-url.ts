const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.replace(/\/$/, "");

export function imageKitUrl(path: string) {
  if (!endpoint) {
    throw new Error("Missing NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT environment variable.");
  }

  return `${endpoint}/${path.replace(/^\//, "")}`;
}
