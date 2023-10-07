import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/gameyngine.ts',
  output: [
    {
      file: 'dist/gameyngine.esm.js',
      format: 'es'
    },
    {
      file: 'dist/gameyngine.umd.js',
      format: 'umd',
      name: 'gameyngine'      
    },
  ],
  external:[],
  plugins: [typescript()],
};
