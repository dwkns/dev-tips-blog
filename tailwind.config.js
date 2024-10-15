/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{md,html,webc,njk}"],
  safelist: [],
  theme: {
    extend: {},
  },
  plugins: [ require('@tailwindcss/typography')],
}

