from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public" / "prototype-assets" / "real product"
OUTPUT_DIR = ROOT / "public" / "product-images" / "real-products"
CONTACT_SHEET = ROOT / "generated" / "real-products-processed-contact-sheet.jpg"
MANIFEST = OUTPUT_DIR / "manifest.json"

CANVAS_SIZE = 1600
THUMB_SIZE = 220
LABEL_HEIGHT = 30
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def trim_border(image: Image.Image) -> Image.Image:
    """Remove thin black/white phone screenshot borders without changing the watch crop."""
    rgb = image.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()

    def row_is_border(y: int) -> bool:
        sample = [pixels[x, y] for x in range(0, width, max(1, width // 80))]
        avg = tuple(sum(pixel[i] for pixel in sample) / len(sample) for i in range(3))
        return max(avg) < 18 or min(avg) > 245

    def col_is_border(x: int) -> bool:
        sample = [pixels[x, y] for y in range(0, height, max(1, height // 80))]
        avg = tuple(sum(pixel[i] for pixel in sample) / len(sample) for i in range(3))
        return max(avg) < 18 or min(avg) > 245

    top = 0
    while top < height // 5 and row_is_border(top):
        top += 1

    bottom = height - 1
    while bottom > height * 4 // 5 and row_is_border(bottom):
        bottom -= 1

    left = 0
    while left < width // 5 and col_is_border(left):
        left += 1

    right = width - 1
    while right > width * 4 // 5 and col_is_border(right):
        right -= 1

    if right - left < width * 0.65 or bottom - top < height * 0.65:
        return image

    return image.crop((left, top, right + 1, bottom + 1))


def make_square_product_image(source: Path) -> Image.Image:
    image = ImageOps.exif_transpose(Image.open(source)).convert("RGB")
    image = trim_border(image)

    image = ImageOps.autocontrast(image, cutoff=0.5)
    image = ImageEnhance.Color(image).enhance(1.06)
    image = ImageEnhance.Contrast(image).enhance(1.08)
    image = ImageEnhance.Sharpness(image).enhance(1.18)

    max_subject_size = int(CANVAS_SIZE * 0.88)
    image.thumbnail((max_subject_size, max_subject_size), Image.Resampling.LANCZOS)

    canvas = Image.new("RGB", (CANVAS_SIZE, CANVAS_SIZE), (248, 246, 241))
    x = (CANVAS_SIZE - image.width) // 2
    y = (CANVAS_SIZE - image.height) // 2
    canvas.paste(image, (x, y))
    return canvas


def make_contact_sheet(files: list[Path]) -> None:
    cols = 5
    rows = math.ceil(len(files) / cols)
    sheet = Image.new("RGB", (cols * THUMB_SIZE, rows * (THUMB_SIZE + LABEL_HEIGHT)), "white")
    draw = ImageDraw.Draw(sheet)

    for index, file in enumerate(files):
        image = Image.open(file).convert("RGB")
        image.thumbnail((THUMB_SIZE, THUMB_SIZE), Image.Resampling.LANCZOS)
        cell_x = (index % cols) * THUMB_SIZE
        cell_y = (index // cols) * (THUMB_SIZE + LABEL_HEIGHT)
        x = cell_x + (THUMB_SIZE - image.width) // 2
        y = cell_y + (THUMB_SIZE - image.height) // 2
        sheet.paste(image, (x, y))
        draw.text((cell_x + 8, cell_y + THUMB_SIZE + 6), file.stem, fill=(25, 25, 25))

    CONTACT_SHEET.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(CONTACT_SHEET, quality=90)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    sources = sorted(path for path in SOURCE_DIR.iterdir() if path.suffix.lower() in SUPPORTED_EXTENSIONS)
    processed_files: list[Path] = []
    manifest = []

    for index, source in enumerate(sources, start=1):
        output_name = f"real-product-{index:03d}-{source.stem.lower()}.webp"
        output = OUTPUT_DIR / output_name
        if not output.exists() or output.stat().st_mtime < source.stat().st_mtime:
            product_image = make_square_product_image(source)
            product_image.save(output, "WEBP", quality=88, method=3)
        processed_files.append(output)
        manifest.append(
            {
                "source": str(source.relative_to(ROOT)).replace("\\", "/"),
                "processed": str(output.relative_to(ROOT)).replace("\\", "/"),
                "imageKitPath": f"/ovalen/product-images/real-products/{output_name}",
            }
        )

    MANIFEST.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    make_contact_sheet(processed_files)

    print(f"Processed {len(processed_files)} images")
    print(f"Output: {OUTPUT_DIR}")
    print(f"Manifest: {MANIFEST}")
    print(f"Contact sheet: {CONTACT_SHEET}")


if __name__ == "__main__":
    main()
