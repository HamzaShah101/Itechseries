'use es6';

import emptyFunction from 'react-utils/emptyFunction';
import {
    notification
} from './audio';

const setupNotifier = () => {
    if (typeof window.Audio !== 'function') {
        return emptyFunction;
    }

    let canPlay = true;
    let focusEvent = null;
    let playPromise = null;

    const playSafely = () => {
        const notificationSound = new window.Audio(notification);

        if (canPlay) {
            canPlay = false;
            playPromise = notificationSound.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    canPlay = true;
                }).catch(() => {
                    // notification prevented
                    canPlay = true;
                });
            } else {
                canPlay = true;
            }
        }
    };

    return isAdmin => {
        playSafely();

        if (isAdmin) {
            window.removeEventListener('focus', focusEvent);
            playSafely(); // clear the interval if a user focus into the app

            focusEvent = window.addEventListener('focus', () => {
                window.removeEventListener('focus', focusEvent);
            });
        }
    };
};

export const notifyBySound = setupNotifier();