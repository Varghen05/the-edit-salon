import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Logo artwork as inline SVG markup, so individual layers (monogram, ribbon, letters)
 * can be animated. Read once at build time. Pass a file under /public, e.g.
 * "logo.svg" (master) or "brand/logo-monogram.svg".
 */
export async function getLogoSvg(file = "logo.svg") {
  "use cache";
  const raw = await readFile(path.join(process.cwd(), "public", file), "utf8");
  // Drop the XML prolog, fixed sizing and title so it scales with its container
  return raw
    .replace(/<\?xml[^>]*>\s*/, "")
    .replace(/<svg([^>]*?)\s(width|height)="[^"]*"/g, "<svg$1")
    .replace(/<svg([^>]*?)\s(width|height)="[^"]*"/g, "<svg$1")
    .replace(/<svg /, '<svg width="100%" height="100%" role="img" aria-label="THE EDIT Unisex Salon" ')
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/<desc>[\s\S]*?<\/desc>/, "");
}
