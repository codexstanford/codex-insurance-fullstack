declare const read: (input: string) => string[];
declare const readdata: (input: string) => string[][];
declare const grind: Function;
declare const grindem: Function;
declare const definemorefacts: Function;
declare const compfinds: (
  aspect: ReturnType<typeof read>,
  query: ReturnType<typeof read>,
  dataset: ReturnType<typeof readdata>,
  ruleset: ReturnType<typeof readdata>,
) => string[] | string[][];
declare const definemorerules: Function;
