let onUnauthorizedHandler = null;

export function setOnUnauthorized(handler) {
    onUnauthorizedHandler = handler;
}

export function triggerOnUnauthorized() {
    if (typeof onUnauthorizedHandler === 'function') {
        onUnauthorizedHandler();
    }
}