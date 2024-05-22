import * as esbuild from "esbuild";
import { copy } from "esbuild-plugin-copy";

await esbuild.build({
  entryPoints: ["./src/app.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  allowOverwrite: true,
  outfile: "../../build/server.js",
  plugins: [
    copy({
      resolveFrom: "cwd",
      assets: [
        {
          from: [
            "./node_modules/better-sqlite3/build/Release/better_sqlite3.node",
          ],
          to: ["../../build"],
        },
        {
          from: [
            "./node_modules/sqlite3/build/Release/node_sqlite3.node",
          ],
          to: ["../../build"],
        },
        {
          from: ["./src/index.html"],
          to: ["../../build"],
        },
      ],
    }),
  ],
});
