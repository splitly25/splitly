import { WEBSITE_DOMAIN } from '~/utils/constants.js';

export const generateUrl = (path, payload) => {
    const url = new URL(WEBSITE_DOMAIN, path);
    Object.keys(payload).forEach((key) =>
        url.searchParams.append(key, payload[key])
    );
    return url.toString();
};

