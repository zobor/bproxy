const { build } = require("esbuild");
const {walk} = require('./scripts/files.cjs');

(async() => {
  const src = await walk('./src');
  const options = {
    entryPoints: src,
    minify: process.env.NODE_ENV === "production",
    bundle: true,
    outdir: 'dist',
    platform: 'node',
    target: 'node10.4'
  };

  build(options).catch(err => {
    process.stderr.write(err.stderr);
    process.exit(1);
  });

})();
