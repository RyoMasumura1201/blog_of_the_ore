const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins([[optimizedImages, {}]], {
  webpack: function (config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
  reactStrictMode: true,
  // TypeError: unsupported file typeを避けるため
  images: {
    disableStaticImages: true,
  },
});
