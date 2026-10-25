import { AssetManager, DEFAULT_PROFILES_PATH } from '@iwsdk/core';

/**
 * Serves the hand and controller models from this site instead of the public
 * CDN the input layer points at, so playing sends no request to a third party.
 *
 * public/input-profiles holds the Quest-family profiles (MIT, copied from
 * @webxr-input-profiles/assets 1.0.20). Any other profile resolves to a local
 * file that does not exist; that input is then tracked without a visual, and
 * still nothing leaves the site.
 */
export function serveInputProfilesLocally(): void {
  const local = `${import.meta.env.BASE_URL}input-profiles`;
  AssetManager.loadingManager.setURLModifier((url) => {
    if (!url.startsWith(DEFAULT_PROFILES_PATH)) {
      return url;
    }
    const rewritten = local + url.slice(DEFAULT_PROFILES_PATH.length);
    if (import.meta.env.DEV) {
      console.info(`[case] input model served locally: ${rewritten}`);
    }
    return rewritten;
  });
}
