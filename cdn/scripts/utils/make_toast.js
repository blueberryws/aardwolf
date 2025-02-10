import { LOG } from './logger.js';
export function MakeToast(message) {
    try {
        if (typeof message !== 'string') {
            LOG.warn('MakeToast called with a non-string message');
            throw new Error('Message must be a string');
        }
        alert(message);
    } catch (error) {
        LOG.error(`Failed to make toast: ${error.message}`);
    }
}