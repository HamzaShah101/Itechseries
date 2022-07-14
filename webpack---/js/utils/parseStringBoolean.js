'use es6';

export const parseStringBoolean = stringBoolean => {
    if (stringBoolean === 'true') {
        return true;
    }

    if (stringBoolean === 'false') {
        return false;
    }

    return undefined;
};