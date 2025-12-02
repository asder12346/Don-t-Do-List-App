
export const triggerHaptic = (pattern: number | number[] = 10) => {
    // Check if navigator and vibrate are available (mostly Android/Mobile Web)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
    }
};
