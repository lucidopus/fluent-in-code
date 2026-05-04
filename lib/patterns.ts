export const Pattern = {
  ArraysHashing: "ArraysHashing",
  TwoPointers: "TwoPointers",
  SlidingWindow: "SlidingWindow",
  Stack: "Stack",
  BinarySearch: "BinarySearch",
  LinkedList: "LinkedList",
  Trees: "Trees",
  Tries: "Tries",
  Heap: "Heap",
  Backtracking: "Backtracking",
  Graphs: "Graphs",
  AdvancedGraphs: "AdvancedGraphs",
  OneDDP: "OneDDP",
  TwoDDP: "TwoDDP",
  Greedy: "Greedy",
  Intervals: "Intervals",
  MathGeometry: "MathGeometry",
  BitManipulation: "BitManipulation",
} as const;

export type Pattern = (typeof Pattern)[keyof typeof Pattern];

export const PATTERN_ORDER: Pattern[] = [
  Pattern.ArraysHashing,
  Pattern.TwoPointers,
  Pattern.SlidingWindow,
  Pattern.Stack,
  Pattern.BinarySearch,
  Pattern.LinkedList,
  Pattern.Trees,
  Pattern.Tries,
  Pattern.Heap,
  Pattern.Backtracking,
  Pattern.Graphs,
  Pattern.AdvancedGraphs,
  Pattern.OneDDP,
  Pattern.TwoDDP,
  Pattern.Greedy,
  Pattern.Intervals,
  Pattern.MathGeometry,
  Pattern.BitManipulation,
];

export type PatternMeta = {
  pattern: Pattern;
  name: string;
  slug: string;
  description: string;
  signal: string;
};

export const PATTERN_META: Record<Pattern, PatternMeta> = {
  [Pattern.ArraysHashing]: {
    pattern: Pattern.ArraysHashing,
    name: "Arrays & Hashing",
    slug: "arrays-hashing",
    description: "HashMap O(1) lookup, frequency counters, complement, key design.",
    signal: "Have I seen this before? — reach for a hash structure.",
  },
  [Pattern.TwoPointers]: {
    pattern: Pattern.TwoPointers,
    name: "Two Pointers",
    slug: "two-pointers",
    description: "Opposite-end converging or fast-slow on the same array.",
    signal: "Sorted array + pair / triplet — two pointers from both ends.",
  },
  [Pattern.SlidingWindow]: {
    pattern: Pattern.SlidingWindow,
    name: "Sliding Window",
    slug: "sliding-window",
    description: "Fixed or variable window, validity invariant, shrink-when-invalid.",
    signal: "Contiguous subarray / substring satisfying X — variable window.",
  },
  [Pattern.Stack]: {
    pattern: Pattern.Stack,
    name: "Stack",
    slug: "stack",
    description: "LIFO, monotonic stack for next-greater / next-smaller, parens matching.",
    signal: "Match opens with closes / find next greater — stack stores indices.",
  },
  [Pattern.BinarySearch]: {
    pattern: Pattern.BinarySearch,
    name: "Binary Search",
    slug: "binary-search",
    description: "Sorted array, rotated, or monotonic answer space.",
    signal: "Sorted, OR feasibility is monotonic — search the answer.",
  },
  [Pattern.LinkedList]: {
    pattern: Pattern.LinkedList,
    name: "Linked List",
    slug: "linked-list",
    description: "Dummy head, prev/curr/next dance, fast & slow pointers.",
    signal: "List manipulation — dummy node eliminates edge cases.",
  },
  [Pattern.Trees]: {
    pattern: Pattern.Trees,
    name: "Trees",
    slug: "trees",
    description: "Recursive DFS (pre/in/post), iterative BFS level-by-level, BST bounds.",
    signal: "Recurse on children. What to return up, what to pass down.",
  },
  [Pattern.Tries]: {
    pattern: Pattern.Tries,
    name: "Tries",
    slug: "tries",
    description: "Prefix tree for word search, autocomplete, longest-prefix.",
    signal: "Many words sharing prefixes — trie nodes per character.",
  },
  [Pattern.Heap]: {
    pattern: Pattern.Heap,
    name: "Heap / Priority Queue",
    slug: "heap",
    description: "Min/max-heap of size k, top-k, median maintenance.",
    signal: "Top K, kth smallest in stream, median — heap of size k.",
  },
  [Pattern.Backtracking]: {
    pattern: Pattern.Backtracking,
    name: "Backtracking",
    slug: "backtracking",
    description: "Choose → recurse → un-choose. Subsets, permutations, combinations.",
    signal: "All combinations / permutations — backtracking template.",
  },
  [Pattern.Graphs]: {
    pattern: Pattern.Graphs,
    name: "Graphs",
    slug: "graphs",
    description: "BFS/DFS with visited set, grid-as-graph, connected components.",
    signal: "Cells connected to neighbors — DFS or BFS with visited.",
  },
  [Pattern.AdvancedGraphs]: {
    pattern: Pattern.AdvancedGraphs,
    name: "Advanced Graphs",
    slug: "advanced-graphs",
    description: "Topological sort, Dijkstra, union-find, MST.",
    signal: "Weighted shortest path / cycle detection / dependencies.",
  },
  [Pattern.OneDDP]: {
    pattern: Pattern.OneDDP,
    name: "1-D Dynamic Programming",
    slug: "one-d-dp",
    description: "State as array, decision per index, often O(n) space → O(1).",
    signal: "Optimal substructure + overlapping subproblems on a sequence.",
  },
  [Pattern.TwoDDP]: {
    pattern: Pattern.TwoDDP,
    name: "2-D Dynamic Programming",
    slug: "two-d-dp",
    description: "Grid DP, two-string DP (LCS, edit distance).",
    signal: "Two indices / dimensions in the state.",
  },
  [Pattern.Greedy]: {
    pattern: Pattern.Greedy,
    name: "Greedy",
    slug: "greedy",
    description: "Local choice is globally safe. Prove or pattern-match.",
    signal: "Pick the best each step, can prove no future regret.",
  },
  [Pattern.Intervals]: {
    pattern: Pattern.Intervals,
    name: "Intervals",
    slug: "intervals",
    description: "Sort by start, sweep, merge / count overlaps.",
    signal: "Ranges that may overlap — sort then sweep.",
  },
  [Pattern.MathGeometry]: {
    pattern: Pattern.MathGeometry,
    name: "Math & Geometry",
    slug: "math-geometry",
    description: "Matrix rotation, spiral order, modular arithmetic.",
    signal: "In-place matrix transform, layered iteration.",
  },
  [Pattern.BitManipulation]: {
    pattern: Pattern.BitManipulation,
    name: "Bit Manipulation",
    slug: "bit-manipulation",
    description: "AND / OR / XOR / shifts. Hamming weight, bit DP.",
    signal: "Subset enumeration, parity, count bits.",
  },
};

export function patternBySlug(slug: string): Pattern | undefined {
  for (const meta of Object.values(PATTERN_META)) {
    if (meta.slug === slug) return meta.pattern;
  }
  return undefined;
}

export type ListId = "blind75" | "neetcode150";

export const LIST_META: Record<ListId, { name: string; slug: string; total: number }> = {
  blind75: { name: "Blind 75", slug: "blind-75", total: 75 },
  neetcode150: { name: "NeetCode 150", slug: "neetcode-150", total: 150 },
};
