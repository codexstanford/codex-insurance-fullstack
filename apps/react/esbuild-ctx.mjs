import * as esbuild from "esbuild";

export const ctx = await esbuild.context({
  entryPoints: ["src/App.tsx"],
  bundle: true,
  outfile: "build/app.js",
});
