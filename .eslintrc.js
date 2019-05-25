module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "prettier/prettier": ["error", { semi: false, printWidth: 100 }],
    "comma-dangle": ["error", "never"],
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  plugins: ["html"],
  parserOptions: {
    parser: "babel-eslint"
  }
}
