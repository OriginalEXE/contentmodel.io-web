module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true,
  },
  purge: {
    content: [
      './src/**/*.tsx',
      './src/**/*.css',
      './css/**/*.css',
      './pages/**/*.tsx',
      './pages/**/*.css',
      './src/shared/components/Button/getButtonClassName.ts',
    ],
    options: {
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
      safelist: [
        /^fa-/,
        /^svg-inline--fa/,
        'svg:not(:root).svg-inline--fa',
        '__next',
      ],
    },
  },
  theme: {
    extend: {
      spacing: {
        72: '18rem',
        84: '21rem',
        96: '24rem',
      },
      fontFamily: {
        sans:
          "'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      },
      colors: {
        primary: {
          100: '#c2d6fe',
          200: '#86aefe',
          300: '#5d93fd',
          400: '#4985fd',
          500: '#246bfd',
          600: '#0d5dfd',
          700: '#023eb6',
          800: '#012265',
          900: '#01153d',
        },
        'magic-mint': '#A5F8D3',
        'oxford-blue': '#0B132B',
        'space-cadet': '#1C2541',
        'mimi-pink': '#EFCFE3',
      },
    },
  },
  variants: {
    borderColor: ['responsive', 'focus-within', 'hover', 'focus'],
    textDecoration: ['responsive', 'hover', 'focus', 'focus-visible'],
  },
  plugins: [],
};
