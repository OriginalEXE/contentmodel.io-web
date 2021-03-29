// eslint-disable-next-line @typescript-eslint/no-var-requires
const withImages = require('next-images');

module.exports = withImages({
  inlineImageLimit: 1024,
  onDemandEntries: {
    websocketPort: 3001,
  },
  reactStrictMode: true,
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/contentmodelio/image/upload/',
  },
  future: {
    webpack5: true,
  },
});
