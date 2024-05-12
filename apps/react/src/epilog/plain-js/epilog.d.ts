declare const read: (input: string) => string[];
declare const readdata: (input: string) => string[][];
declare const grind: Function;
declare const grindem: Function;
declare const definemorefacts: (
  target: string[][],
  facts: string[][],
) => string[][];

declare const compfinds: (
  aspect: ReturnType<typeof read> | string,
  query: ReturnType<typeof read>,
  dataset: ReturnType<typeof readdata>,
  ruleset: ReturnType<typeof readdata>,
) => string[] | string[][];

declare const debugfinds: (
  aspect: ReturnType<typeof read> | string,
  query: ReturnType<typeof read>,
  dataset: ReturnType<typeof readdata>,
  ruleset: ReturnType<typeof readdata>,
) => string[] | string[][];

declare const definemorerules: Function;

declare const zniquify: (
  dataset: ReturnType<typeof readdata>,
) => ReturnType<typeof readdata>;
