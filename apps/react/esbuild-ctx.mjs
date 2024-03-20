import * as esbuild from "esbuild";
import { copy } from "esbuild-plugin-copy";

export const ctx = await esbuild.context({
  entryPoints: ["src/App.tsx"],
  bundle: true,
  outfile: "build/app.js",
  plugins: [
    copy({
      resolveFrom: "cwd",
      assets: {
        from: ["src/index.html"],
        to: ["build"],
      },
      watch: true,
    }),
  ],
});
