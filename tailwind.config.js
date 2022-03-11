module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false,
  content: [],
  theme: {
    extend: {},
    minWidth: {
      '4': '1rem',
      '8': '2rem',
    },
    fontSize: {
      '1xs': '.7rem',
      'xxs': '.6rem',
      '3xs': '.5rem'
    },
    screens: {
      'xs': '280px' // iphone5
    }
  },
  plugins: [],
}
