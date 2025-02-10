import { LOG } from '../utils/logger.js';

export const breakpoints = {
    "desktop": "1400px",
    "laptop": "1200px",
    "notebook": "992px",
    "tablet": "768px",
    "phone": "576px",
    "x-small": "1px",
};

try {
    if (Object.keys(breakpoints).length === 0) {
        LOG.warn("Breakpoints object is empty.");
    }
} catch (error) {
    LOG.error("An error occurred while checking breakpoints: " + error.message);
}