import { ctx } from "./esbuild-ctx.mjs";

await ctx.rebuild();
await ctx.dispose();
