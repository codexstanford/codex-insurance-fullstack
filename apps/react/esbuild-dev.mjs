import { ctx } from "./esbuild-ctx.mjs";

await ctx.watch();

let { port } = await ctx.serve({
  servedir: "build",
});

console.log(`Serving React app on http://localhost:${port}`);
