module.exports = {
  purge: ["./views/*.ejs", "./public/js/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      borderColor: ["hover"],
    },
  },
  plugins: [],
};
