import { BLIND_75 } from "@/lib/data/blind75";
import { Pattern } from "@/lib/patterns";
import type { ProblemSeed } from "@/lib/data/blind75";

const url = (slug: string) => `https://leetcode.com/problems/${slug}/`;

// Problems in NeetCode 150 that are NOT in Blind 75
const NC150_DELTA: ProblemSeed[] = [
  // Arrays & Hashing extras
  { lcNumber: 36, slug: "valid-sudoku", title: "Valid Sudoku", difficulty: "Medium", leetcodeUrl: url("valid-sudoku"), patterns: [Pattern.ArraysHashing], lists: ["neetcode150"] },

  // Two Pointers extras
  { lcNumber: 167, slug: "two-sum-ii-input-array-is-sorted", title: "Two Sum II - Input Array Is Sorted", difficulty: "Medium", leetcodeUrl: url("two-sum-ii-input-array-is-sorted"), patterns: [Pattern.TwoPointers], lists: ["neetcode150"] },
  { lcNumber: 42, slug: "trapping-rain-water", title: "Trapping Rain Water", difficulty: "Hard", leetcodeUrl: url("trapping-rain-water"), patterns: [Pattern.TwoPointers], lists: ["neetcode150"] },

  // Sliding Window extras
  { lcNumber: 567, slug: "permutation-in-string", title: "Permutation in String", difficulty: "Medium", leetcodeUrl: url("permutation-in-string"), patterns: [Pattern.SlidingWindow], lists: ["neetcode150"] },
  { lcNumber: 239, slug: "sliding-window-maximum", title: "Sliding Window Maximum", difficulty: "Hard", leetcodeUrl: url("sliding-window-maximum"), patterns: [Pattern.SlidingWindow], lists: ["neetcode150"] },

  // Stack extras
  { lcNumber: 155, slug: "min-stack", title: "Min Stack", difficulty: "Medium", leetcodeUrl: url("min-stack"), patterns: [Pattern.Stack], lists: ["neetcode150"] },
  { lcNumber: 150, slug: "evaluate-reverse-polish-notation", title: "Evaluate Reverse Polish Notation", difficulty: "Medium", leetcodeUrl: url("evaluate-reverse-polish-notation"), patterns: [Pattern.Stack], lists: ["neetcode150"] },
  { lcNumber: 22, slug: "generate-parentheses", title: "Generate Parentheses", difficulty: "Medium", leetcodeUrl: url("generate-parentheses"), patterns: [Pattern.Stack, Pattern.Backtracking], lists: ["neetcode150"] },
  { lcNumber: 739, slug: "daily-temperatures", title: "Daily Temperatures", difficulty: "Medium", leetcodeUrl: url("daily-temperatures"), patterns: [Pattern.Stack], lists: ["neetcode150"] },
  { lcNumber: 853, slug: "car-fleet", title: "Car Fleet", difficulty: "Medium", leetcodeUrl: url("car-fleet"), patterns: [Pattern.Stack], lists: ["neetcode150"] },
  { lcNumber: 84, slug: "largest-rectangle-in-histogram", title: "Largest Rectangle in Histogram", difficulty: "Hard", leetcodeUrl: url("largest-rectangle-in-histogram"), patterns: [Pattern.Stack], lists: ["neetcode150"] },

  // Binary Search extras
  { lcNumber: 704, slug: "binary-search", title: "Binary Search", difficulty: "Easy", leetcodeUrl: url("binary-search"), patterns: [Pattern.BinarySearch], lists: ["neetcode150"] },
  { lcNumber: 74, slug: "search-a-2d-matrix", title: "Search a 2D Matrix", difficulty: "Medium", leetcodeUrl: url("search-a-2d-matrix"), patterns: [Pattern.BinarySearch], lists: ["neetcode150"] },
  { lcNumber: 875, slug: "koko-eating-bananas", title: "Koko Eating Bananas", difficulty: "Medium", leetcodeUrl: url("koko-eating-bananas"), patterns: [Pattern.BinarySearch], lists: ["neetcode150"] },
  { lcNumber: 981, slug: "time-based-key-value-store", title: "Time Based Key-Value Store", difficulty: "Medium", leetcodeUrl: url("time-based-key-value-store"), patterns: [Pattern.BinarySearch], lists: ["neetcode150"] },
  { lcNumber: 4, slug: "median-of-two-sorted-arrays", title: "Median of Two Sorted Arrays", difficulty: "Hard", leetcodeUrl: url("median-of-two-sorted-arrays"), patterns: [Pattern.BinarySearch], lists: ["neetcode150"] },

  // Linked List extras
  { lcNumber: 138, slug: "copy-list-with-random-pointer", title: "Copy List with Random Pointer", difficulty: "Medium", leetcodeUrl: url("copy-list-with-random-pointer"), patterns: [Pattern.LinkedList], lists: ["neetcode150"] },
  { lcNumber: 2, slug: "add-two-numbers", title: "Add Two Numbers", difficulty: "Medium", leetcodeUrl: url("add-two-numbers"), patterns: [Pattern.LinkedList], lists: ["neetcode150"] },
  { lcNumber: 287, slug: "find-the-duplicate-number", title: "Find the Duplicate Number", difficulty: "Medium", leetcodeUrl: url("find-the-duplicate-number"), patterns: [Pattern.LinkedList, Pattern.TwoPointers], lists: ["neetcode150"] },
  { lcNumber: 146, slug: "lru-cache", title: "LRU Cache", difficulty: "Medium", leetcodeUrl: url("lru-cache"), patterns: [Pattern.LinkedList, Pattern.ArraysHashing], lists: ["neetcode150"] },
  { lcNumber: 25, slug: "reverse-nodes-in-k-group", title: "Reverse Nodes in K-Group", difficulty: "Hard", leetcodeUrl: url("reverse-nodes-in-k-group"), patterns: [Pattern.LinkedList], lists: ["neetcode150"] },

  // Trees extras
  { lcNumber: 543, slug: "diameter-of-binary-tree", title: "Diameter of Binary Tree", difficulty: "Easy", leetcodeUrl: url("diameter-of-binary-tree"), patterns: [Pattern.Trees], lists: ["neetcode150"] },
  { lcNumber: 110, slug: "balanced-binary-tree", title: "Balanced Binary Tree", difficulty: "Easy", leetcodeUrl: url("balanced-binary-tree"), patterns: [Pattern.Trees], lists: ["neetcode150"] },
  { lcNumber: 199, slug: "binary-tree-right-side-view", title: "Binary Tree Right Side View", difficulty: "Medium", leetcodeUrl: url("binary-tree-right-side-view"), patterns: [Pattern.Trees], lists: ["neetcode150"] },
  { lcNumber: 1448, slug: "count-good-nodes-in-binary-tree", title: "Count Good Nodes in Binary Tree", difficulty: "Medium", leetcodeUrl: url("count-good-nodes-in-binary-tree"), patterns: [Pattern.Trees], lists: ["neetcode150"] },

  // Heap extras
  { lcNumber: 703, slug: "kth-largest-element-in-a-stream", title: "Kth Largest Element in a Stream", difficulty: "Easy", leetcodeUrl: url("kth-largest-element-in-a-stream"), patterns: [Pattern.Heap], lists: ["neetcode150"] },
  { lcNumber: 1046, slug: "last-stone-weight", title: "Last Stone Weight", difficulty: "Easy", leetcodeUrl: url("last-stone-weight"), patterns: [Pattern.Heap], lists: ["neetcode150"] },
  { lcNumber: 973, slug: "k-closest-points-to-origin", title: "K Closest Points to Origin", difficulty: "Medium", leetcodeUrl: url("k-closest-points-to-origin"), patterns: [Pattern.Heap], lists: ["neetcode150"] },
  { lcNumber: 215, slug: "kth-largest-element-in-an-array", title: "Kth Largest Element in an Array", difficulty: "Medium", leetcodeUrl: url("kth-largest-element-in-an-array"), patterns: [Pattern.Heap], lists: ["neetcode150"] },
  { lcNumber: 621, slug: "task-scheduler", title: "Task Scheduler", difficulty: "Medium", leetcodeUrl: url("task-scheduler"), patterns: [Pattern.Heap], lists: ["neetcode150"] },
  { lcNumber: 355, slug: "design-twitter", title: "Design Twitter", difficulty: "Medium", leetcodeUrl: url("design-twitter"), patterns: [Pattern.Heap], lists: ["neetcode150"] },

  // Backtracking extras
  { lcNumber: 78, slug: "subsets", title: "Subsets", difficulty: "Medium", leetcodeUrl: url("subsets"), patterns: [Pattern.Backtracking], lists: ["neetcode150"] },
  { lcNumber: 46, slug: "permutations", title: "Permutations", difficulty: "Medium", leetcodeUrl: url("permutations"), patterns: [Pattern.Backtracking], lists: ["neetcode150"] },
  { lcNumber: 90, slug: "subsets-ii", title: "Subsets II", difficulty: "Medium", leetcodeUrl: url("subsets-ii"), patterns: [Pattern.Backtracking], lists: ["neetcode150"] },
  { lcNumber: 40, slug: "combination-sum-ii", title: "Combination Sum II", difficulty: "Medium", leetcodeUrl: url("combination-sum-ii"), patterns: [Pattern.Backtracking], lists: ["neetcode150"] },
  { lcNumber: 131, slug: "palindrome-partitioning", title: "Palindrome Partitioning", difficulty: "Medium", leetcodeUrl: url("palindrome-partitioning"), patterns: [Pattern.Backtracking], lists: ["neetcode150"] },
  { lcNumber: 17, slug: "letter-combinations-of-a-phone-number", title: "Letter Combinations of a Phone Number", difficulty: "Medium", leetcodeUrl: url("letter-combinations-of-a-phone-number"), patterns: [Pattern.Backtracking], lists: ["neetcode150"] },
  { lcNumber: 51, slug: "n-queens", title: "N-Queens", difficulty: "Hard", leetcodeUrl: url("n-queens"), patterns: [Pattern.Backtracking], lists: ["neetcode150"] },

  // Graphs extras
  { lcNumber: 695, slug: "max-area-of-island", title: "Max Area of Island", difficulty: "Medium", leetcodeUrl: url("max-area-of-island"), patterns: [Pattern.Graphs], lists: ["neetcode150"] },
  { lcNumber: 130, slug: "surrounded-regions", title: "Surrounded Regions", difficulty: "Medium", leetcodeUrl: url("surrounded-regions"), patterns: [Pattern.Graphs], lists: ["neetcode150"] },
  { lcNumber: 994, slug: "rotting-oranges", title: "Rotting Oranges", difficulty: "Medium", leetcodeUrl: url("rotting-oranges"), patterns: [Pattern.Graphs], lists: ["neetcode150"] },
  { lcNumber: 286, slug: "walls-and-gates", title: "Walls and Gates", difficulty: "Medium", leetcodeUrl: url("walls-and-gates"), patterns: [Pattern.Graphs], lists: ["neetcode150"], premium: true },

  // Advanced Graphs
  { lcNumber: 210, slug: "course-schedule-ii", title: "Course Schedule II", difficulty: "Medium", leetcodeUrl: url("course-schedule-ii"), patterns: [Pattern.AdvancedGraphs], lists: ["neetcode150"] },
  { lcNumber: 684, slug: "redundant-connection", title: "Redundant Connection", difficulty: "Medium", leetcodeUrl: url("redundant-connection"), patterns: [Pattern.AdvancedGraphs], lists: ["neetcode150"] },
  { lcNumber: 743, slug: "network-delay-time", title: "Network Delay Time", difficulty: "Medium", leetcodeUrl: url("network-delay-time"), patterns: [Pattern.AdvancedGraphs], lists: ["neetcode150"] },
  { lcNumber: 332, slug: "reconstruct-itinerary", title: "Reconstruct Itinerary", difficulty: "Hard", leetcodeUrl: url("reconstruct-itinerary"), patterns: [Pattern.AdvancedGraphs], lists: ["neetcode150"] },
  { lcNumber: 1584, slug: "min-cost-to-connect-all-points", title: "Min Cost to Connect All Points", difficulty: "Medium", leetcodeUrl: url("min-cost-to-connect-all-points"), patterns: [Pattern.AdvancedGraphs], lists: ["neetcode150"] },
  { lcNumber: 778, slug: "swim-in-rising-water", title: "Swim in Rising Water", difficulty: "Hard", leetcodeUrl: url("swim-in-rising-water"), patterns: [Pattern.AdvancedGraphs], lists: ["neetcode150"] },

  // 1-D DP extras
  { lcNumber: 746, slug: "min-cost-climbing-stairs", title: "Min Cost Climbing Stairs", difficulty: "Easy", leetcodeUrl: url("min-cost-climbing-stairs"), patterns: [Pattern.OneDDP], lists: ["neetcode150"] },

  // 2-D DP extras
  { lcNumber: 309, slug: "best-time-to-buy-and-sell-stock-with-cooldown", title: "Best Time to Buy and Sell Stock with Cooldown", difficulty: "Medium", leetcodeUrl: url("best-time-to-buy-and-sell-stock-with-cooldown"), patterns: [Pattern.TwoDDP], lists: ["neetcode150"] },
  { lcNumber: 518, slug: "coin-change-ii", title: "Coin Change II", difficulty: "Medium", leetcodeUrl: url("coin-change-ii"), patterns: [Pattern.TwoDDP], lists: ["neetcode150"] },
  { lcNumber: 494, slug: "target-sum", title: "Target Sum", difficulty: "Medium", leetcodeUrl: url("target-sum"), patterns: [Pattern.TwoDDP], lists: ["neetcode150"] },
  { lcNumber: 97, slug: "interleaving-string", title: "Interleaving String", difficulty: "Medium", leetcodeUrl: url("interleaving-string"), patterns: [Pattern.TwoDDP], lists: ["neetcode150"] },
  { lcNumber: 329, slug: "longest-increasing-path-in-a-matrix", title: "Longest Increasing Path in a Matrix", difficulty: "Hard", leetcodeUrl: url("longest-increasing-path-in-a-matrix"), patterns: [Pattern.TwoDDP, Pattern.Graphs], lists: ["neetcode150"] },
  { lcNumber: 115, slug: "distinct-subsequences", title: "Distinct Subsequences", difficulty: "Hard", leetcodeUrl: url("distinct-subsequences"), patterns: [Pattern.TwoDDP], lists: ["neetcode150"] },
  { lcNumber: 72, slug: "edit-distance", title: "Edit Distance", difficulty: "Medium", leetcodeUrl: url("edit-distance"), patterns: [Pattern.TwoDDP], lists: ["neetcode150"] },
  { lcNumber: 312, slug: "burst-balloons", title: "Burst Balloons", difficulty: "Hard", leetcodeUrl: url("burst-balloons"), patterns: [Pattern.TwoDDP], lists: ["neetcode150"] },
  { lcNumber: 10, slug: "regular-expression-matching", title: "Regular Expression Matching", difficulty: "Hard", leetcodeUrl: url("regular-expression-matching"), patterns: [Pattern.TwoDDP], lists: ["neetcode150"] },

  // Greedy extras
  { lcNumber: 45, slug: "jump-game-ii", title: "Jump Game II", difficulty: "Medium", leetcodeUrl: url("jump-game-ii"), patterns: [Pattern.Greedy], lists: ["neetcode150"] },
  { lcNumber: 134, slug: "gas-station", title: "Gas Station", difficulty: "Medium", leetcodeUrl: url("gas-station"), patterns: [Pattern.Greedy], lists: ["neetcode150"] },
  { lcNumber: 846, slug: "hand-of-straights", title: "Hand of Straights", difficulty: "Medium", leetcodeUrl: url("hand-of-straights"), patterns: [Pattern.Greedy, Pattern.Heap], lists: ["neetcode150"] },
  { lcNumber: 1899, slug: "merge-triplets-to-form-target-triplet", title: "Merge Triplets to Form Target Triplet", difficulty: "Medium", leetcodeUrl: url("merge-triplets-to-form-target-triplet"), patterns: [Pattern.Greedy], lists: ["neetcode150"] },
  { lcNumber: 763, slug: "partition-labels", title: "Partition Labels", difficulty: "Medium", leetcodeUrl: url("partition-labels"), patterns: [Pattern.Greedy], lists: ["neetcode150"] },
  { lcNumber: 678, slug: "valid-parenthesis-string", title: "Valid Parenthesis String", difficulty: "Medium", leetcodeUrl: url("valid-parenthesis-string"), patterns: [Pattern.Greedy], lists: ["neetcode150"] },

  // Math & Geometry extras
  { lcNumber: 202, slug: "happy-number", title: "Happy Number", difficulty: "Easy", leetcodeUrl: url("happy-number"), patterns: [Pattern.MathGeometry], lists: ["neetcode150"] },
  { lcNumber: 66, slug: "plus-one", title: "Plus One", difficulty: "Easy", leetcodeUrl: url("plus-one"), patterns: [Pattern.MathGeometry], lists: ["neetcode150"] },
  { lcNumber: 50, slug: "powx-n", title: "Pow(x, n)", difficulty: "Medium", leetcodeUrl: url("powx-n"), patterns: [Pattern.MathGeometry], lists: ["neetcode150"] },
  { lcNumber: 43, slug: "multiply-strings", title: "Multiply Strings", difficulty: "Medium", leetcodeUrl: url("multiply-strings"), patterns: [Pattern.MathGeometry], lists: ["neetcode150"] },
  { lcNumber: 2013, slug: "detect-squares", title: "Detect Squares", difficulty: "Medium", leetcodeUrl: url("detect-squares"), patterns: [Pattern.MathGeometry, Pattern.ArraysHashing], lists: ["neetcode150"] },
];

// Merge: every Blind 75 problem also belongs to neetcode150 (NC150 is a superset).
function mergeListMembership(): ProblemSeed[] {
  const blind75InBoth = BLIND_75.map((p) => ({
    ...p,
    lists: Array.from(new Set([...p.lists, "neetcode150" as const])),
  }));
  return [...blind75InBoth, ...NC150_DELTA];
}

export const NEETCODE_150 = mergeListMembership();
