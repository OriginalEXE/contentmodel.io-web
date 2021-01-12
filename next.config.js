const withImages = require('next-images');
const withTM = require('next-transpile-modules')([
  // '@codemirror/basic-setup',
  // '@codemirror/autocomplete',
  // '@codemirror/closebrackets',
  // '@codemirror/commands',
  // '@codemirror/comment',
  // '@codemirror/fold',
  // '@codemirror/gutter',
  // '@codemirror/highlight',
  // '@codemirror/history',
  // '@codemirror/language',
  // '@codemirror/lint',
  // '@codemirror/matchbrackets',
  // '@codemirror/panel',
  // '@codemirror/rangeset',
  // '@codemirror/rectangular-selection',
  // '@codemirror/search',
  // '@codemirror/state',
  // '@codemirror/text',
  // '@codemirror/tooltip',
  // '@codemirror/view',
  // '@codemirror/lang-json',
]);

module.exports = withImages(
  withTM({
    inlineImageLimit: 1024,
    onDemandEntries: {
      websocketPort: 3001,
    },
    reactStrictMode: true,
    async rewrites() {
      return [
        {
          source: '/share/:id',
          destination: '/api/share',
        },
      ];
    },
  }),
);
