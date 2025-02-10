import { LOG } from '../utils/logger.js';

export const EditColorsEvent = "editColors";
export const SetDocumentEditable = "setDocumentEditable";
export const UnsetDocumentEditable = "unsetDocumentEditable";
export const SetLoading = "setLoading";
export const UnsetLoading = "unsetLoading";

export const ImageSetChanged = "imageSetChanged";

export function dispatch(eventName) {
    try {
        LOG.debug(`Dispatching event: ${eventName}`);
        if (!eventName) {
            LOG.error('Event name is required for dispatching events');
            throw new Error('Event name is required');
        }
        const newEvent = new CustomEvent(eventName);
        document.dispatchEvent(newEvent);
        LOG.info(`Successfully dispatched event: ${eventName}`);
    } catch (error) {
        LOG.fatal(`Failed to dispatch event: ${eventName}`, error);
    }
}