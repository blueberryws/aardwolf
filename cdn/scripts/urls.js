import { LOG } from './utils/logger.js';

export const BASE_URL = "";
export const IMAGE_SEARCH = `${BASE_URL}/image/search`;

if (!BASE_URL) {
    LOG.warn("BASE_URL is not defined, IMAGE_SEARCH may not function as expected.");
}