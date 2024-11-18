module.exports = {
  extends: [
    'mantine',
    'plugin:react-three/recommended',
  ],
  plugins: [
    'react-three',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/extensions': 'off',
    'arrow-body-style': 'off',
  },
};
