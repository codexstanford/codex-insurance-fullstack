import * as esbuild from "esbuild";
import { copy } from "esbuild-plugin-copy";

export const ctx = await esbuild.context({
  entryPoints: ["src/App.tsx"],
  bundle: true,
  sourcemap: true,
  outfile: "build/app.js",
  plugins: [
    copy({
      resolveFrom: "cwd",
      assets: {
        from: ["src/epilog/plain-js/epilog.js"],
        to: ["build"],
      },
      watch: true,
    }),
  ],
});
