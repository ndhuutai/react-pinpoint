// import path from "path";
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';

const extensions = ['.ts', '.js'];

export default {
  input: './src/index.ts',
  output: {
    file: 'lib/bundle.es5.js',
    format: 'esm',
  },
  plugins: [
    resolve({
      jsnext: true,
      extensions,
    }),
    babel({
      extensions,
      presets: ['@babel/preset-env', '@babel/preset-typescript'],
    }),
  ],
};
