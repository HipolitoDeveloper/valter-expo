const apiDomain = process.env.EXPO_PUBLIC_API_URL || '';
const apiRoot = process.env.EXPO_PUBLIC_API_ROOT || '/';

let apiBaseUrl = `${apiDomain}${apiRoot}`;
const apiBaseUrlLastChar = apiBaseUrl.slice(-1);

if (apiBaseUrlLastChar === '/') {
    apiBaseUrl = apiBaseUrl.slice(0, -1);
}

const config = {
    API_BASE_URL: apiBaseUrl,
};

export default config;
