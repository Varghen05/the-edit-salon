import { access } from "node:fs/promises";
import path from "node:path";

const exists = async (publicPath: string) => {
  try {
    await access(path.join(process.cwd(), "public", publicPath));
    return true;
  } catch {
    return false;
  }
};

/**
 * Optional Google Flow footage (see FLOW_PROMPTS.md). Any file dropped into
 * public/video with these names is picked up at build time; missing files fall
 * back to the still photography.
 */
export async function getMedia() {
  "use cache";
  const v = async (name: string) => ((await exists(`video/${name}`)) ? `/video/${name}` : null);
  return {
    hero: await v("hero.mp4"),
    heroMobile: await v("hero-mobile.mp4"),
    chairWaiting: await v("chair-waiting.mp4"),
    ritual: {
      consult: await v("ritual-consult.mp4"),
      cleanse: await v("ritual-cleanse.mp4"),
      craft: await v("ritual-craft.mp4"),
      finish: await v("ritual-finish.mp4"),
    },
  };
}

export type Media = Awaited<ReturnType<typeof getMedia>>;
