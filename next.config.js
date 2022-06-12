/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig

module.exports = {
    exportPathMap: async function (defaultPathMap) {
        // 🚩the only difference is here, we spread the default pathMap
        const pathMap = { ...defaultPathMap };

        for (const [path, config] of Object.entries(defaultPathMap)) {
            if (path === '/') {
                pathMap[path] = config;
            } else {
                pathMap[`${path}/index`] = config;
            }
        }

        return pathMap;
    },
    images: {
        loader: 'imgix',
        path: '/',
    },
};
