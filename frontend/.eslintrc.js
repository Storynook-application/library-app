module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'react-app',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Add this line
  ],
  plugins: ['@typescript-eslint', 'prettier'], // Ensure 'prettier' is included
  rules: {
    'prettier/prettier': 'error', // Show Prettier errors as ESLint errors
    // Add or override any other rules as needed
  },
};
