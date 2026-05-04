import { Pattern, type ListId } from "@/lib/patterns";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type ProblemSeed = {
  lcNumber: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  leetcodeUrl: string;
  patterns: Pattern[];
  lists: ListId[];
  premium?: boolean;
};

const url = (slug: string) => `https://leetcode.com/problems/${slug}/`;

export const BLIND_75: ProblemSeed[] = [
  // Arrays & Hashing
  { lcNumber: 1, slug: "two-sum", title: "Two Sum", difficulty: "Easy", leetcodeUrl: url("two-sum"), patterns: [Pattern.ArraysHashing], lists: ["blind75"] },
  { lcNumber: 217, slug: "contains-duplicate", title: "Contains Duplicate", difficulty: "Easy", leetcodeUrl: url("contains-duplicate"), patterns: [Pattern.ArraysHashing], lists: ["blind75"] },
  { lcNumber: 242, slug: "valid-anagram", title: "Valid Anagram", difficulty: "Easy", leetcodeUrl: url("valid-anagram"), patterns: [Pattern.ArraysHashing], lists: ["blind75"] },
  { lcNumber: 49, slug: "group-anagrams", title: "Group Anagrams", difficulty: "Medium", leetcodeUrl: url("group-anagrams"), patterns: [Pattern.ArraysHashing], lists: ["blind75"] },
  { lcNumber: 347, slug: "top-k-frequent-elements", title: "Top K Frequent Elements", difficulty: "Medium", leetcodeUrl: url("top-k-frequent-elements"), patterns: [Pattern.ArraysHashing, Pattern.Heap], lists: ["blind75"] },
  { lcNumber: 238, slug: "product-of-array-except-self", title: "Product of Array Except Self", difficulty: "Medium", leetcodeUrl: url("product-of-array-except-self"), patterns: [Pattern.ArraysHashing], lists: ["blind75"] },
  { lcNumber: 271, slug: "encode-and-decode-strings", title: "Encode and Decode Strings", difficulty: "Medium", leetcodeUrl: url("encode-and-decode-strings"), patterns: [Pattern.ArraysHashing], lists: ["blind75"], premium: true },
  { lcNumber: 128, slug: "longest-consecutive-sequence", title: "Longest Consecutive Sequence", difficulty: "Medium", leetcodeUrl: url("longest-consecutive-sequence"), patterns: [Pattern.ArraysHashing], lists: ["blind75"] },

  // Two Pointers
  { lcNumber: 125, slug: "valid-palindrome", title: "Valid Palindrome", difficulty: "Easy", leetcodeUrl: url("valid-palindrome"), patterns: [Pattern.TwoPointers], lists: ["blind75"] },
  { lcNumber: 15, slug: "3sum", title: "3Sum", difficulty: "Medium", leetcodeUrl: url("3sum"), patterns: [Pattern.TwoPointers], lists: ["blind75"] },
  { lcNumber: 11, slug: "container-with-most-water", title: "Container With Most Water", difficulty: "Medium", leetcodeUrl: url("container-with-most-water"), patterns: [Pattern.TwoPointers], lists: ["blind75"] },

  // Sliding Window
  { lcNumber: 121, slug: "best-time-to-buy-and-sell-stock", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", leetcodeUrl: url("best-time-to-buy-and-sell-stock"), patterns: [Pattern.SlidingWindow, Pattern.Greedy], lists: ["blind75"] },
  { lcNumber: 3, slug: "longest-substring-without-repeating-characters", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", leetcodeUrl: url("longest-substring-without-repeating-characters"), patterns: [Pattern.SlidingWindow], lists: ["blind75"] },
  { lcNumber: 424, slug: "longest-repeating-character-replacement", title: "Longest Repeating Character Replacement", difficulty: "Medium", leetcodeUrl: url("longest-repeating-character-replacement"), patterns: [Pattern.SlidingWindow], lists: ["blind75"] },
  { lcNumber: 76, slug: "minimum-window-substring", title: "Minimum Window Substring", difficulty: "Hard", leetcodeUrl: url("minimum-window-substring"), patterns: [Pattern.SlidingWindow], lists: ["blind75"] },

  // Stack
  { lcNumber: 20, slug: "valid-parentheses", title: "Valid Parentheses", difficulty: "Easy", leetcodeUrl: url("valid-parentheses"), patterns: [Pattern.Stack], lists: ["blind75"] },

  // Binary Search
  { lcNumber: 153, slug: "find-minimum-in-rotated-sorted-array", title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", leetcodeUrl: url("find-minimum-in-rotated-sorted-array"), patterns: [Pattern.BinarySearch], lists: ["blind75"] },
  { lcNumber: 33, slug: "search-in-rotated-sorted-array", title: "Search in Rotated Sorted Array", difficulty: "Medium", leetcodeUrl: url("search-in-rotated-sorted-array"), patterns: [Pattern.BinarySearch], lists: ["blind75"] },

  // Linked List
  { lcNumber: 206, slug: "reverse-linked-list", title: "Reverse Linked List", difficulty: "Easy", leetcodeUrl: url("reverse-linked-list"), patterns: [Pattern.LinkedList], lists: ["blind75"] },
  { lcNumber: 21, slug: "merge-two-sorted-lists", title: "Merge Two Sorted Lists", difficulty: "Easy", leetcodeUrl: url("merge-two-sorted-lists"), patterns: [Pattern.LinkedList], lists: ["blind75"] },
  { lcNumber: 143, slug: "reorder-list", title: "Reorder List", difficulty: "Medium", leetcodeUrl: url("reorder-list"), patterns: [Pattern.LinkedList], lists: ["blind75"] },
  { lcNumber: 19, slug: "remove-nth-node-from-end-of-list", title: "Remove Nth Node From End of List", difficulty: "Medium", leetcodeUrl: url("remove-nth-node-from-end-of-list"), patterns: [Pattern.LinkedList], lists: ["blind75"] },
  { lcNumber: 141, slug: "linked-list-cycle", title: "Linked List Cycle", difficulty: "Easy", leetcodeUrl: url("linked-list-cycle"), patterns: [Pattern.LinkedList], lists: ["blind75"] },
  { lcNumber: 23, slug: "merge-k-sorted-lists", title: "Merge K Sorted Lists", difficulty: "Hard", leetcodeUrl: url("merge-k-sorted-lists"), patterns: [Pattern.LinkedList, Pattern.Heap], lists: ["blind75"] },

  // Trees
  { lcNumber: 226, slug: "invert-binary-tree", title: "Invert Binary Tree", difficulty: "Easy", leetcodeUrl: url("invert-binary-tree"), patterns: [Pattern.Trees], lists: ["blind75"] },
  { lcNumber: 104, slug: "maximum-depth-of-binary-tree", title: "Maximum Depth of Binary Tree", difficulty: "Easy", leetcodeUrl: url("maximum-depth-of-binary-tree"), patterns: [Pattern.Trees], lists: ["blind75"] },
  { lcNumber: 100, slug: "same-tree", title: "Same Tree", difficulty: "Easy", leetcodeUrl: url("same-tree"), patterns: [Pattern.Trees], lists: ["blind75"] },
  { lcNumber: 572, slug: "subtree-of-another-tree", title: "Subtree of Another Tree", difficulty: "Easy", leetcodeUrl: url("subtree-of-another-tree"), patterns: [Pattern.Trees], lists: ["blind75"] },
  { lcNumber: 235, slug: "lowest-common-ancestor-of-a-binary-search-tree", title: "Lowest Common Ancestor of a Binary Search Tree", difficulty: "Medium", leetcodeUrl: url("lowest-common-ancestor-of-a-binary-search-tree"), patterns: [Pattern.Trees, Pattern.BinarySearch], lists: ["blind75"] },
  { lcNumber: 102, slug: "binary-tree-level-order-traversal", title: "Binary Tree Level Order Traversal", difficulty: "Medium", leetcodeUrl: url("binary-tree-level-order-traversal"), patterns: [Pattern.Trees], lists: ["blind75"] },
  { lcNumber: 98, slug: "validate-binary-search-tree", title: "Validate Binary Search Tree", difficulty: "Medium", leetcodeUrl: url("validate-binary-search-tree"), patterns: [Pattern.Trees], lists: ["blind75"] },
  { lcNumber: 230, slug: "kth-smallest-element-in-a-bst", title: "Kth Smallest Element in a BST", difficulty: "Medium", leetcodeUrl: url("kth-smallest-element-in-a-bst"), patterns: [Pattern.Trees], lists: ["blind75"] },
  { lcNumber: 105, slug: "construct-binary-tree-from-preorder-and-inorder-traversal", title: "Construct Binary Tree from Preorder and Inorder Traversal", difficulty: "Medium", leetcodeUrl: url("construct-binary-tree-from-preorder-and-inorder-traversal"), patterns: [Pattern.Trees], lists: ["blind75"] },
  { lcNumber: 124, slug: "binary-tree-maximum-path-sum", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", leetcodeUrl: url("binary-tree-maximum-path-sum"), patterns: [Pattern.Trees], lists: ["blind75"] },
  { lcNumber: 297, slug: "serialize-and-deserialize-binary-tree", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", leetcodeUrl: url("serialize-and-deserialize-binary-tree"), patterns: [Pattern.Trees], lists: ["blind75"] },

  // Tries
  { lcNumber: 208, slug: "implement-trie-prefix-tree", title: "Implement Trie (Prefix Tree)", difficulty: "Medium", leetcodeUrl: url("implement-trie-prefix-tree"), patterns: [Pattern.Tries], lists: ["blind75"] },
  { lcNumber: 211, slug: "design-add-and-search-words-data-structure", title: "Design Add and Search Words Data Structure", difficulty: "Medium", leetcodeUrl: url("design-add-and-search-words-data-structure"), patterns: [Pattern.Tries, Pattern.Backtracking], lists: ["blind75"] },
  { lcNumber: 212, slug: "word-search-ii", title: "Word Search II", difficulty: "Hard", leetcodeUrl: url("word-search-ii"), patterns: [Pattern.Tries, Pattern.Backtracking, Pattern.Graphs], lists: ["blind75"] },

  // Heap
  { lcNumber: 295, slug: "find-median-from-data-stream", title: "Find Median from Data Stream", difficulty: "Hard", leetcodeUrl: url("find-median-from-data-stream"), patterns: [Pattern.Heap], lists: ["blind75"] },

  // Backtracking
  { lcNumber: 39, slug: "combination-sum", title: "Combination Sum", difficulty: "Medium", leetcodeUrl: url("combination-sum"), patterns: [Pattern.Backtracking], lists: ["blind75"] },
  { lcNumber: 79, slug: "word-search", title: "Word Search", difficulty: "Medium", leetcodeUrl: url("word-search"), patterns: [Pattern.Backtracking, Pattern.Graphs], lists: ["blind75"] },

  // Graphs
  { lcNumber: 200, slug: "number-of-islands", title: "Number of Islands", difficulty: "Medium", leetcodeUrl: url("number-of-islands"), patterns: [Pattern.Graphs], lists: ["blind75"] },
  { lcNumber: 133, slug: "clone-graph", title: "Clone Graph", difficulty: "Medium", leetcodeUrl: url("clone-graph"), patterns: [Pattern.Graphs], lists: ["blind75"] },
  { lcNumber: 417, slug: "pacific-atlantic-water-flow", title: "Pacific Atlantic Water Flow", difficulty: "Medium", leetcodeUrl: url("pacific-atlantic-water-flow"), patterns: [Pattern.Graphs], lists: ["blind75"] },
  { lcNumber: 207, slug: "course-schedule", title: "Course Schedule", difficulty: "Medium", leetcodeUrl: url("course-schedule"), patterns: [Pattern.Graphs, Pattern.AdvancedGraphs], lists: ["blind75"] },
  { lcNumber: 261, slug: "graph-valid-tree", title: "Graph Valid Tree", difficulty: "Medium", leetcodeUrl: url("graph-valid-tree"), patterns: [Pattern.Graphs, Pattern.AdvancedGraphs], lists: ["blind75"], premium: true },
  { lcNumber: 323, slug: "number-of-connected-components-in-an-undirected-graph", title: "Number of Connected Components in an Undirected Graph", difficulty: "Medium", leetcodeUrl: url("number-of-connected-components-in-an-undirected-graph"), patterns: [Pattern.Graphs, Pattern.AdvancedGraphs], lists: ["blind75"], premium: true },
  { lcNumber: 269, slug: "alien-dictionary", title: "Alien Dictionary", difficulty: "Hard", leetcodeUrl: url("alien-dictionary"), patterns: [Pattern.AdvancedGraphs], lists: ["blind75"], premium: true },

  // 1-D DP
  { lcNumber: 70, slug: "climbing-stairs", title: "Climbing Stairs", difficulty: "Easy", leetcodeUrl: url("climbing-stairs"), patterns: [Pattern.OneDDP], lists: ["blind75"] },
  { lcNumber: 198, slug: "house-robber", title: "House Robber", difficulty: "Medium", leetcodeUrl: url("house-robber"), patterns: [Pattern.OneDDP], lists: ["blind75"] },
  { lcNumber: 213, slug: "house-robber-ii", title: "House Robber II", difficulty: "Medium", leetcodeUrl: url("house-robber-ii"), patterns: [Pattern.OneDDP], lists: ["blind75"] },
  { lcNumber: 5, slug: "longest-palindromic-substring", title: "Longest Palindromic Substring", difficulty: "Medium", leetcodeUrl: url("longest-palindromic-substring"), patterns: [Pattern.OneDDP, Pattern.TwoPointers], lists: ["blind75"] },
  { lcNumber: 647, slug: "palindromic-substrings", title: "Palindromic Substrings", difficulty: "Medium", leetcodeUrl: url("palindromic-substrings"), patterns: [Pattern.OneDDP, Pattern.TwoPointers], lists: ["blind75"] },
  { lcNumber: 91, slug: "decode-ways", title: "Decode Ways", difficulty: "Medium", leetcodeUrl: url("decode-ways"), patterns: [Pattern.OneDDP], lists: ["blind75"] },
  { lcNumber: 322, slug: "coin-change", title: "Coin Change", difficulty: "Medium", leetcodeUrl: url("coin-change"), patterns: [Pattern.OneDDP], lists: ["blind75"] },
  { lcNumber: 152, slug: "maximum-product-subarray", title: "Maximum Product Subarray", difficulty: "Medium", leetcodeUrl: url("maximum-product-subarray"), patterns: [Pattern.OneDDP], lists: ["blind75"] },
  { lcNumber: 139, slug: "word-break", title: "Word Break", difficulty: "Medium", leetcodeUrl: url("word-break"), patterns: [Pattern.OneDDP], lists: ["blind75"] },
  { lcNumber: 300, slug: "longest-increasing-subsequence", title: "Longest Increasing Subsequence", difficulty: "Medium", leetcodeUrl: url("longest-increasing-subsequence"), patterns: [Pattern.OneDDP], lists: ["blind75"] },
  { lcNumber: 377, slug: "combination-sum-iv", title: "Combination Sum IV", difficulty: "Medium", leetcodeUrl: url("combination-sum-iv"), patterns: [Pattern.OneDDP], lists: ["blind75"] },

  // 2-D DP
  { lcNumber: 62, slug: "unique-paths", title: "Unique Paths", difficulty: "Medium", leetcodeUrl: url("unique-paths"), patterns: [Pattern.TwoDDP], lists: ["blind75"] },
  { lcNumber: 1143, slug: "longest-common-subsequence", title: "Longest Common Subsequence", difficulty: "Medium", leetcodeUrl: url("longest-common-subsequence"), patterns: [Pattern.TwoDDP], lists: ["blind75"] },

  // Greedy
  { lcNumber: 53, slug: "maximum-subarray", title: "Maximum Subarray", difficulty: "Medium", leetcodeUrl: url("maximum-subarray"), patterns: [Pattern.Greedy, Pattern.OneDDP], lists: ["blind75"] },
  { lcNumber: 55, slug: "jump-game", title: "Jump Game", difficulty: "Medium", leetcodeUrl: url("jump-game"), patterns: [Pattern.Greedy], lists: ["blind75"] },

  // Intervals
  { lcNumber: 57, slug: "insert-interval", title: "Insert Interval", difficulty: "Medium", leetcodeUrl: url("insert-interval"), patterns: [Pattern.Intervals], lists: ["blind75"] },
  { lcNumber: 56, slug: "merge-intervals", title: "Merge Intervals", difficulty: "Medium", leetcodeUrl: url("merge-intervals"), patterns: [Pattern.Intervals], lists: ["blind75"] },
  { lcNumber: 435, slug: "non-overlapping-intervals", title: "Non-overlapping Intervals", difficulty: "Medium", leetcodeUrl: url("non-overlapping-intervals"), patterns: [Pattern.Intervals, Pattern.Greedy], lists: ["blind75"] },
  { lcNumber: 252, slug: "meeting-rooms", title: "Meeting Rooms", difficulty: "Easy", leetcodeUrl: url("meeting-rooms"), patterns: [Pattern.Intervals], lists: ["blind75"], premium: true },
  { lcNumber: 253, slug: "meeting-rooms-ii", title: "Meeting Rooms II", difficulty: "Medium", leetcodeUrl: url("meeting-rooms-ii"), patterns: [Pattern.Intervals, Pattern.Heap], lists: ["blind75"], premium: true },

  // Math & Geometry
  { lcNumber: 48, slug: "rotate-image", title: "Rotate Image", difficulty: "Medium", leetcodeUrl: url("rotate-image"), patterns: [Pattern.MathGeometry], lists: ["blind75"] },
  { lcNumber: 54, slug: "spiral-matrix", title: "Spiral Matrix", difficulty: "Medium", leetcodeUrl: url("spiral-matrix"), patterns: [Pattern.MathGeometry], lists: ["blind75"] },
  { lcNumber: 73, slug: "set-matrix-zeroes", title: "Set Matrix Zeroes", difficulty: "Medium", leetcodeUrl: url("set-matrix-zeroes"), patterns: [Pattern.MathGeometry, Pattern.ArraysHashing], lists: ["blind75"] },

  // Bit Manipulation
  { lcNumber: 191, slug: "number-of-1-bits", title: "Number of 1 Bits", difficulty: "Easy", leetcodeUrl: url("number-of-1-bits"), patterns: [Pattern.BitManipulation], lists: ["blind75"] },
  { lcNumber: 338, slug: "counting-bits", title: "Counting Bits", difficulty: "Easy", leetcodeUrl: url("counting-bits"), patterns: [Pattern.BitManipulation, Pattern.OneDDP], lists: ["blind75"] },
  { lcNumber: 190, slug: "reverse-bits", title: "Reverse Bits", difficulty: "Easy", leetcodeUrl: url("reverse-bits"), patterns: [Pattern.BitManipulation], lists: ["blind75"] },
  { lcNumber: 268, slug: "missing-number", title: "Missing Number", difficulty: "Easy", leetcodeUrl: url("missing-number"), patterns: [Pattern.BitManipulation, Pattern.ArraysHashing], lists: ["blind75"] },
  { lcNumber: 371, slug: "sum-of-two-integers", title: "Sum of Two Integers", difficulty: "Medium", leetcodeUrl: url("sum-of-two-integers"), patterns: [Pattern.BitManipulation], lists: ["blind75"] },
];
