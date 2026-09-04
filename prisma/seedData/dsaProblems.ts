export interface DsaProblemSeedData {
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string;
  companyRelevance: string;
  description: string;
  examplesJson: string;
  constraints: string;
  solutionCode: string;
  solutionExplanation: string;
  hints: string[];
}

export const DSA_PROBLEMS_50: DsaProblemSeedData[] = [
  // =========================================================================
  // 20 EASY PROBLEMS
  // =========================================================================
  {
    id: "dsa-1",
    title: "Two Sum",
    difficulty: "EASY",
    tags: "Array, Hash Table",
    companyRelevance: "Google, Amazon, Meta, Microsoft",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examplesJson: JSON.stringify([
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]." }
    ]),
    constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
    solutionCode: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    solutionExplanation: "Iterate through the array while storing value and index in a Hash Map. For each element, check if target - nums[i] exists in the map. Time O(N), Space O(N).",
    hints: [
      "A brute force approach checks every pair using nested loops in O(N^2) time. Can we look up values faster?",
      "Store visited numbers in a Hash Map with their indices. Look for (target - x) in O(1) time."
    ]
  },
  {
    id: "dsa-2",
    title: "Valid Parentheses",
    difficulty: "EASY",
    tags: "String, Stack",
    companyRelevance: "Amazon, Meta, Bloomberg",
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.",
    examplesJson: JSON.stringify([
      { input: "s = '()[]{}'", output: "true", explanation: "All brackets open and close properly." },
      { input: "s = '(]'", output: "false", explanation: "Bracket types mismatch." }
    ]),
    constraints: "1 <= s.length <= 10^4\ns consists of brackets only '()[]{}'.",
    solutionCode: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
    solutionExplanation: "Use a Stack (LIFO). Push opening brackets. When encountering a closing bracket, pop the stack and check for a match. Time O(N), Space O(N).",
    hints: [
      "Last-In-First-Out (LIFO) property applies here. The last opened bracket must be closed first.",
      "Push opening brackets onto a stack. For closing brackets, check if stack.pop() matches."
    ]
  },
  {
    id: "dsa-9",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "EASY",
    tags: "Array, Dynamic Programming",
    companyRelevance: "Amazon, Google, Microsoft, Apple",
    description: "Given an array `prices` where `prices[i]` is the stock price on day `i`, return the maximum profit achievable from a single transaction (buy one day, sell a future day). Return 0 if no profit is possible.",
    examplesJson: JSON.stringify([
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 5." },
      { input: "prices = [7,6,4,3,1]", output: "0", explanation: "Prices strictly decrease, profit = 0." }
    ]),
    constraints: "1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4",
    solutionCode: `function maxProfit(prices: number[]): number {
  let minPrice = Infinity;
  let maxProfit = 0;
  for (const price of prices) {
    if (price < minPrice) {
      minPrice = price;
    } else if (price - minPrice > maxProfit) {
      maxProfit = price - minPrice;
    }
  }
  return maxProfit;
}`,
    solutionExplanation: "Track minimum price seen so far and max profit at each step in one pass. Time O(N), Space O(1).",
    hints: [
      "Track `minPrice` as you iterate forward.",
      "At each element, compute `price - minPrice` and update `maxProfit`."
    ]
  },
  {
    id: "dsa-10",
    title: "Climbing Stairs",
    difficulty: "EASY",
    tags: "Dynamic Programming, Math",
    companyRelevance: "Google, Amazon, Adobe",
    description: "You are climbing a staircase with `n` steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examplesJson: JSON.stringify([
      { input: "n = 2", output: "2", explanation: "(1+1) or (2)." },
      { input: "n = 3", output: "3", explanation: "(1+1+1), (1+2), or (2+1)." }
    ]),
    constraints: "1 <= n <= 45",
    solutionCode: `function climbStairs(n: number): number {
  if (n <= 2) return n;
  let prev2 = 1, prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const cur = prev1 + prev2;
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
    solutionExplanation: "Fibonacci pattern: ways(n) = ways(n-1) + ways(n-2). Use two variables to store previous step counts. Time O(N), Space O(1).",
    hints: [
      "To reach step n, you came from n-1 (1 step) or n-2 (2 steps).",
      "Notice `f(n) = f(n-1) + f(n-2)`, which is the Fibonacci sequence."
    ]
  },
  {
    id: "dsa-11",
    title: "Reverse Linked List",
    difficulty: "EASY",
    tags: "Linked List, Recursion",
    companyRelevance: "Amazon, Apple, Microsoft, Bloomberg",
    description: "Given the `head` of a singly linked list, reverse the list and return the reversed head.",
    examplesJson: JSON.stringify([
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = [1,2]", output: "[2,1]" }
    ]),
    constraints: "Number of nodes is in range [0, 5000].\n-5000 <= Node.val <= 5000",
    solutionCode: `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr = head;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    solutionExplanation: "Iteratively redirect pointers. Maintain `prev` and `curr`. Redirect `curr.next = prev` and advance pointers. Time O(N), Space O(1).",
    hints: [
      "Redirect each node's `next` pointer to point to its predecessor.",
      "Use three pointers: `prev = null`, `curr = head`, and `next = curr.next`."
    ]
  },
  {
    id: "dsa-12",
    title: "Maximum Depth of Binary Tree",
    difficulty: "EASY",
    tags: "Tree, DFS, BFS, Recursion",
    companyRelevance: "Google, Amazon, Meta",
    description: "Given the `root` of a binary tree, return its maximum depth — the number of nodes along the longest path from root down to the farthest leaf node.",
    examplesJson: JSON.stringify([
      { input: "root = [3,9,20,null,null,15,7]", output: "3" },
      { input: "root = [1,null,2]", output: "2" }
    ]),
    constraints: "Tree node count is in [0, 10^4].\n-100 <= Node.val <= 100",
    solutionCode: `function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
    solutionExplanation: "Recursive DFS: depth = 1 + max(leftDepth, rightDepth). Base case: null node returns 0. Time O(N), Space O(H).",
    hints: [
      "Depth of any node = 1 + max depth of its children.",
      "Base case: if root is null, return 0."
    ]
  },
  {
    id: "dsa-21",
    title: "Contains Duplicate",
    difficulty: "EASY",
    tags: "Array, Hash Table, Sorting",
    companyRelevance: "Apple, Amazon, Microsoft",
    description: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    examplesJson: JSON.stringify([
      { input: "nums = [1,2,3,1]", output: "true" },
      { input: "nums = [1,2,3,4]", output: "false" }
    ]),
    constraints: "1 <= nums.length <= 10^5\n-10^9 <= nums[i] <= 10^9",
    solutionCode: `function containsDuplicate(nums: number[]): boolean {
  const set = new Set<number>();
  for (const num of nums) {
    if (set.has(num)) return true;
    set.add(num);
  }
  return false;
}`,
    solutionExplanation: "Use a Hash Set to track seen numbers. If an element is already in the set, a duplicate exists. Time O(N), Space O(N).",
    hints: [
      "A Hash Set gives O(1) average lookup and insertion time.",
      "Alternatively, sorting takes O(N log N) time and O(1) space."
    ]
  },
  {
    id: "dsa-22",
    title: "Valid Anagram",
    difficulty: "EASY",
    tags: "String, Hash Table, Sorting",
    companyRelevance: "Uber, Meta, Google",
    description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise (an anagram uses all original letters exactly once).",
    examplesJson: JSON.stringify([
      { input: "s = 'anagram', t = 'nagaram'", output: "true" },
      { input: "s = 'rat', t = 'car'", output: "false" }
    ]),
    constraints: "1 <= s.length, t.length <= 5 * 10^4\ns and t consist of lowercase English letters.",
    solutionCode: `function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const count: Record<string, number> = {};
  for (const ch of s) count[ch] = (count[ch] || 0) + 1;
  for (const ch of t) {
    if (!count[ch]) return false;
    count[ch]--;
  }
  return true;
}`,
    solutionExplanation: "Compare character frequencies using a frequency counter map or array of size 26. Time O(N), Space O(1).",
    hints: [
      "Check lengths first: if `s.length !== t.length`, return false.",
      "Count character frequencies of `s` and decrement for `t`."
    ]
  },
  {
    id: "dsa-23",
    title: "Binary Search Basics",
    difficulty: "EASY",
    tags: "Array, Binary Search",
    companyRelevance: "Google, Microsoft, Amazon",
    description: "Given a sorted array of integers `nums` and a `target`, search `target` in `nums`. Return its index if found, otherwise return -1. Time complexity must be O(log n).",
    examplesJson: JSON.stringify([
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" }
    ]),
    constraints: "1 <= nums.length <= 10^4\nnums is sorted in ascending order.",
    solutionCode: `function search(nums: number[], target: number): number {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    solutionExplanation: "Classic binary search algorithm. Compare target to mid element, halving the search space each step. Time O(log N), Space O(1).",
    hints: [
      "Maintain `left` and `right` pointers.",
      "Compute `mid = floor((left + right) / 2)` and eliminate half the array."
    ]
  },
  {
    id: "dsa-24",
    title: "Linked List Cycle",
    difficulty: "EASY",
    tags: "Linked List, Two Pointers, Hashing",
    companyRelevance: "Amazon, Microsoft, Meta",
    description: "Given `head`, the head of a linked list, determine if the linked list has a cycle in it (a node can be reached again by continuously following `next`).",
    examplesJson: JSON.stringify([
      { input: "head = [3,2,0,-4], pos = 1", output: "true", explanation: "There is a cycle in the linked list." },
      { input: "head = [1]", output: "false" }
    ]),
    constraints: "Number of nodes is in range [0, 10^4].\n-10^5 <= Node.val <= 10^5",
    solutionCode: `function hasCycle(head: ListNode | null): boolean {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    solutionExplanation: "Floyd's Tortoise and Hare algorithm. Move slow pointer 1 step, fast pointer 2 steps. If they meet, a cycle exists. Time O(N), Space O(1).",
    hints: [
      "Use two pointers moving at different speeds.",
      "If there is a cycle, fast will eventually catch up to slow."
    ]
  },
  {
    id: "dsa-25",
    title: "Invert Binary Tree",
    difficulty: "EASY",
    tags: "Tree, BFS, DFS, Recursion",
    companyRelevance: "Google, Apple, Max",
    description: "Given the `root` of a binary tree, invert the tree (mirror left and right subtrees) and return its root.",
    examplesJson: JSON.stringify([
      { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },
      { input: "root = [2,1,3]", output: "[2,3,1]" }
    ]),
    constraints: "Number of nodes is in [0, 100].\n-100 <= Node.val <= 100",
    solutionCode: `function invertTree(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}`,
    solutionExplanation: "Recursive traversal: swap `left` and `right` child pointers for every node. Time O(N), Space O(H).",
    hints: [
      "Swap node's left and right children recursively.",
      "Base case: if node is null, return null."
    ]
  },
  {
    id: "dsa-26",
    title: "Merge Two Sorted Lists",
    difficulty: "EASY",
    tags: "Linked List, Recursion",
    companyRelevance: "Amazon, Meta, Microsoft",
    description: "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one sorted list by splicing together the nodes.",
    examplesJson: JSON.stringify([
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "list1 = [], list2 = [0]", output: "[0]" }
    ]),
    constraints: "Number of nodes in both lists is in [0, 50].\n-100 <= Node.val <= 100",
    solutionCode: `function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0);
  let curr = dummy;
  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
    else { curr.next = l2; l2 = l2.next; }
    curr = curr.next;
  }
  curr.next = l1 !== null ? l1 : l2;
  return dummy.next;
}`,
    solutionExplanation: "Use a dummy head node and compare current elements of `l1` and `l2` sequentially. Time O(N+M), Space O(1).",
    hints: [
      "Use a dummy head node to simplify edge cases.",
      "Compare `l1.val` and `l2.val`, attach the smaller node to `curr.next`."
    ]
  },
  {
    id: "dsa-27",
    title: "Single Number",
    difficulty: "EASY",
    tags: "Bit Manipulation, Array",
    companyRelevance: "Google, Amazon, Meta",
    description: "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one. You must implement a solution with linear runtime and O(1) space.",
    examplesJson: JSON.stringify([
      { input: "nums = [2,2,1]", output: "1" },
      { input: "nums = [4,1,2,1,2]", output: "4" }
    ]),
    constraints: "1 <= nums.length <= 3 * 10^4\nEvery element appears twice except one.",
    solutionCode: `function singleNumber(nums: number[]): number {
  let result = 0;
  for (const num of nums) {
    result ^= num;
  }
  return result;
}`,
    solutionExplanation: "XOR property: `x ^ x = 0` and `x ^ 0 = x`. XORing all numbers cancels duplicate pairs, leaving the single element. Time O(N), Space O(1).",
    hints: [
      "Think about XOR bitwise operation properties.",
      "XORing a number with itself returns 0 (`a ^ a = 0`)."
    ]
  },
  {
    id: "dsa-28",
    title: "Valid Palindrome",
    difficulty: "EASY",
    tags: "String, Two Pointers",
    companyRelevance: "Meta, Microsoft, Amazon",
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    examplesJson: JSON.stringify([
      { input: "s = 'A man, a plan, a canal: Panama'", output: "true", explanation: "'amanaplanacanalpanama' is a palindrome." },
      { input: "s = 'race a car'", output: "false" }
    ]),
    constraints: "1 <= s.length <= 2 * 10^5\ns consists of printable ASCII characters.",
    solutionCode: `function isPalindrome(s: string): boolean {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++; right--;
  }
  return true;
}`,
    solutionExplanation: "Filter out non-alphanumeric characters, convert to lowercase, then check equality with two pointers from ends. Time O(N), Space O(N).",
    hints: [
      "Sanitize the string first by removing non-alphanumeric characters.",
      "Use two pointers `left` (0) and `right` (n-1) moving inwards."
    ]
  },
  {
    id: "dsa-29",
    title: "Missing Number",
    difficulty: "EASY",
    tags: "Array, Math, Bit Manipulation",
    companyRelevance: "Amazon, Apple, Microsoft",
    description: "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
    examplesJson: JSON.stringify([
      { input: "nums = [3,0,1]", output: "2", explanation: "n = 3 since 3 numbers. 2 is missing." },
      { input: "nums = [0,1]", output: "2" }
    ]),
    constraints: "n == nums.length\n1 <= n <= 10^4\n0 <= nums[i] <= n\nAll numbers are unique.",
    solutionCode: `function missingNumber(nums: number[]): number {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((acc, curr) => acc + curr, 0);
  return expectedSum - actualSum;
}`,
    solutionExplanation: "Gauss Sum formula: sum of [0..n] is `n*(n+1)/2`. The missing number is `expectedSum - actualSum`. Time O(N), Space O(1).",
    hints: [
      "Use mathematical formula: Sum of first n numbers is `n*(n+1)/2`.",
      "Subtract actual array sum from expected sum."
    ]
  },
  {
    id: "dsa-30",
    title: "Symmetric Tree",
    difficulty: "EASY",
    tags: "Tree, DFS, BFS, Recursion",
    companyRelevance: "Google, Microsoft, Amazon",
    description: "Given the `root` of a binary tree, check whether it is a mirror of itself (i.e. symmetric around its center).",
    examplesJson: JSON.stringify([
      { input: "root = [1,2,2,3,4,4,3]", output: "true" },
      { input: "root = [1,2,2,null,3,null,3]", output: "false" }
    ]),
    constraints: "Number of nodes is in [1, 1000].\n-100 <= Node.val <= 100",
    solutionCode: `function isSymmetric(root: TreeNode | null): boolean {
  if (!root) return true;
  function isMirror(t1: TreeNode | null, t2: TreeNode | null): boolean {
    if (!t1 && !t2) return true;
    if (!t1 || !t2) return false;
    return (t1.val === t2.val) &&
      isMirror(t1.left, t2.right) &&
      isMirror(t1.right, t2.left);
  }
  return isMirror(root.left, root.right);
}`,
    solutionExplanation: "Check if left subtree is a mirror of right subtree. Recursively verify `left.val === right.val`, `isMirror(left.left, right.right)`, and `isMirror(left.right, right.left)`. Time O(N), Space O(H).",
    hints: [
      "A tree is symmetric if left subtree is mirror of right subtree.",
      "Check `t1.left` against `t2.right` and `t1.right` against `t2.left`."
    ]
  },
  {
    id: "dsa-31",
    title: "Intersection of Two Linked Lists",
    difficulty: "EASY",
    tags: "Linked List, Two Pointers",
    companyRelevance: "Meta, Amazon, Microsoft",
    description: "Given the heads of two singly linked-lists `headA` and `headB`, return the node at which the two lists intersect. If the two linked lists have no intersection, return `null`.",
    examplesJson: JSON.stringify([
      { input: "intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5]", output: "Reference to node with value 8" }
    ]),
    constraints: "Nodes count in range [1, 3 * 10^4].\n-10^5 <= Node.val <= 10^5",
    solutionCode: `function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
  if (!headA || !headB) return null;
  let pA = headA, pB = headB;
  while (pA !== pB) {
    pA = pA === null ? headB : pA.next;
    pB = pB === null ? headA : pB.next;
  }
  return pA;
}`,
    solutionExplanation: "Two pointer technique: when pointer `pA` reaches end of list A, redirect to head B; when `pB` reaches end of B, redirect to head A. They meet at intersection after length A+B steps. Time O(A+B), Space O(1).",
    hints: [
      "If lists have lengths L1 and L2, traversing A then B takes L1+L2 steps.",
      "Redirect pointer A to head B when it hits null, and pointer B to head A."
    ]
  },
  {
    id: "dsa-32",
    title: "Fibonacci Number",
    difficulty: "EASY",
    tags: "Math, Dynamic Programming, Recursion",
    companyRelevance: "Apple, Google, Microsoft",
    description: "The Fibonacci numbers form a sequence where each number is the sum of the two preceding ones, starting from 0 and 1. Given `n`, calculate `F(n)`.",
    examplesJson: JSON.stringify([
      { input: "n = 2", output: "1", explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1." },
      { input: "n = 4", output: "3", explanation: "F(4) = F(3) + F(2) = 2 + 1 = 3." }
    ]),
    constraints: "0 <= n <= 30",
    solutionCode: `function fib(n: number): number {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const c = a + b;
    a = b; b = c;
  }
  return b;
}`,
    solutionExplanation: "Iterative bottom-up DP using two variables. Time O(N), Space O(1).",
    hints: [
      "F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2).",
      "Compute iteratively from 2 to n."
    ]
  },
  {
    id: "dsa-33",
    title: "Subtree of Another Tree",
    difficulty: "EASY",
    tags: "Tree, DFS, String Matching",
    companyRelevance: "Amazon, Meta, Google",
    description: "Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a subtree of `root` with the exact same structure and node values as `subRoot`.",
    examplesJson: JSON.stringify([
      { input: "root = [3,4,5,1,2], subRoot = [4,1,2]", output: "true" },
      { input: "root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]", output: "false" }
    ]),
    constraints: "Nodes in root range [1, 2000]. Nodes in subRoot range [1, 1000].",
    solutionCode: `function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (!root) return false;
  function isSame(s: TreeNode | null, t: TreeNode | null): boolean {
    if (!s && !t) return true;
    if (!s || !t || s.val !== t.val) return false;
    return isSame(s.left, t.left) && isSame(s.right, t.right);
  }
  if (isSame(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}`,
    solutionExplanation: "DFS traversal: check if `isSameTree(node, subRoot)` for each node in `root`. Time O(N*M), Space O(H).",
    hints: [
      "Helper function `isSameTree` checks if two trees are identical.",
      "Recursively check `isSameTree(root, subRoot)` or `isSubtree(root.left, subRoot)` or `isSubtree(root.right, subRoot)`."
    ]
  },
  {
    id: "dsa-34",
    title: "Majority Element",
    difficulty: "EASY",
    tags: "Array, Hash Table, Boyer-Moore Voting",
    companyRelevance: "Google, Amazon, Microsoft",
    description: "Given an array `nums` of size `n`, return the majority element — the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.",
    examplesJson: JSON.stringify([
      { input: "nums = [3,2,3]", output: "3" },
      { input: "nums = [2,2,1,1,1,2,2]", output: "2" }
    ]),
    constraints: "n == nums.length\n1 <= n <= 5 * 10^4\n-10^9 <= nums[i] <= 10^9",
    solutionCode: `function majorityElement(nums: number[]): number {
  let candidate = nums[0], count = 0;
  for (const num of nums) {
    if (count === 0) candidate = num;
    count += (num === candidate) ? 1 : -1;
  }
  return candidate;
}`,
    solutionExplanation: "Boyer-Moore Voting Algorithm. Maintain `candidate` and `count`. Count increments when matching candidate, decrements when different. Time O(N), Space O(1).",
    hints: [
      "A Hash Map gives O(N) time and O(N) space.",
      "Boyer-Moore Voting Algorithm achieves O(N) time and O(1) space."
    ]
  },

  // =========================================================================
  // 20 MEDIUM PROBLEMS
  // =========================================================================
  {
    id: "dsa-3",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "MEDIUM",
    tags: "Hash Table, String, Sliding Window",
    companyRelevance: "Google, Meta, Amazon, Apple",
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    examplesJson: JSON.stringify([
      { input: "s = 'abcabcbb'", output: "3", explanation: "The answer is 'abc', length 3." },
      { input: "s = 'bbbbb'", output: "1", explanation: "The answer is 'b', length 1." }
    ]),
    constraints: "0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.",
    solutionCode: `function lengthOfLongestSubstring(s: string): number {
  const charMap = new Map<string, number>();
  let left = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (charMap.has(char) && charMap.get(char)! >= left) {
      left = charMap.get(char)! + 1;
    }
    charMap.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    solutionExplanation: "Sliding window `[left, right]`. Store character last seen index in map. When repeat encountered, jump `left = lastSeen + 1`. Track max window length. Time O(N), Space O(K).",
    hints: [
      "Use Sliding Window technique with two pointers `left` and `right`.",
      "Store character indices in a map to jump `left` pointer forward when duplicate occurs."
    ]
  },
  {
    id: "dsa-4",
    title: "Container With Most Water",
    difficulty: "MEDIUM",
    tags: "Array, Two Pointers, Greedy",
    companyRelevance: "Google, Meta, Adobe",
    description: "Given integer array `height` of length `n`, find two lines that together with x-axis form a container holding the most water. Return max water area.",
    examplesJson: JSON.stringify([
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "Heights [8,7] at distance 7 give min(8,7)*7 = 49." }
    ]),
    constraints: "n == height.length\n2 <= n <= 10^5\n0 <= height[i] <= 10^4",
    solutionCode: `function maxArea(height: number[]): number {
  let left = 0, right = height.length - 1;
  let maxWater = 0;
  while (left < right) {
    const current = Math.min(height[left], height[right]) * (right - left);
    maxWater = Math.max(maxWater, current);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxWater;
}`,
    solutionExplanation: "Two pointers starting at extreme ends. Move the pointer with smaller height inwards to attempt finding a taller boundary. Time O(N), Space O(1).",
    hints: [
      "Start with pointers at ends (0 and n-1).",
      "Area is bottlenecked by shorter line. Always move pointer with smaller height."
    ]
  },
  {
    id: "dsa-13",
    title: "3Sum",
    difficulty: "MEDIUM",
    tags: "Array, Two Pointers, Sorting",
    companyRelevance: "Google, Amazon, Meta, Microsoft",
    description: "Given integer array `nums`, return all unique triplets `[nums[i], nums[j], nums[k]]` that sum to 0.",
    examplesJson: JSON.stringify([
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "nums = [0,1,1]", output: "[]" }
    ]),
    constraints: "3 <= nums.length <= 3000\n-10^5 <= nums[i] <= 10^5",
    solutionCode: `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const res: number[][] = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++; r--;
      } else if (sum < 0) l++;
      else r--;
    }
  }
  return res;
}`,
    solutionExplanation: "Sort array. Fix `nums[i]` and use two pointers for pair search. Skip duplicate elements. Time O(N^2), Space O(1).",
    hints: [
      "Sort array first. Fix element `nums[i]`, use two pointers for the rest.",
      "Skip duplicate values of fixed element and two-pointer endpoints."
    ]
  },
  {
    id: "dsa-14",
    title: "Search in Rotated Sorted Array",
    difficulty: "MEDIUM",
    tags: "Array, Binary Search",
    companyRelevance: "Amazon, Google, Microsoft",
    description: "Given a rotated sorted array `nums` of unique elements and a `target`, return the index of `target` or -1 if not present. Time complexity must be O(log n).",
    examplesJson: JSON.stringify([
      { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
      { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" }
    ]),
    constraints: "1 <= nums.length <= 5000\nAll elements are unique.",
    solutionCode: `function search(nums: number[], target: number): number {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    if (nums[mid] === target) return mid;
    if (nums[l] <= nums[mid]) {
      if (nums[l] <= target && target < nums[mid]) r = mid - 1;
      else l = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[r]) l = mid + 1;
      else r = mid - 1;
    }
  }
  return -1;
}`,
    solutionExplanation: "One half of array is always sorted. Determine which half is sorted, then check if target falls within sorted half bounds. Time O(log N), Space O(1).",
    hints: [
      "In a rotated sorted array, at least one half (left or right of `mid`) is always sorted.",
      "Check if target lies within the sorted half to adjust search range."
    ]
  },
  {
    id: "dsa-15",
    title: "Number of Islands",
    difficulty: "MEDIUM",
    tags: "Array, DFS, BFS, Matrix",
    companyRelevance: "Amazon, Google, Meta, Microsoft",
    description: "Given an `m x n` binary grid of '1's (land) and '0's (water), return the number of islands (connected horizontally or vertically).",
    examplesJson: JSON.stringify([
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: "3" }
    ]),
    constraints: "1 <= m, n <= 300\ngrid[i][j] is '0' or '1'",
    solutionCode: `function numIslands(grid: string[][]): number {
  const rows = grid.length, cols = grid[0].length;
  let count = 0;
  function dfs(r: number, c: number) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') return;
    grid[r][c] = '0';
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') { count++; dfs(r, c); }
    }
  }
  return count;
}`,
      solutionExplanation: "Iterate over grid. For each unvisited '1', increment island count and run DFS to sink connected land cells. Time O(M*N), Space O(M*N).",
      hints: [
        "Finding an unvisited '1' indicates a new island.",
        "DFS to mark all connected land cells as '0' to avoid double-counting."
      ]
  },
  {
    id: "dsa-16",
    title: "Course Schedule",
    difficulty: "MEDIUM",
    tags: "DFS, BFS, Topological Sort, Graph",
    companyRelevance: "Google, Amazon, Meta, TikTok",
    description: "There are `numCourses` courses labeled 0 to `numCourses - 1`. Given `prerequisites[i] = [a, b]` (take b before a), return `true` if you can finish all courses.",
    examplesJson: JSON.stringify([
      { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" },
      { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false" }
    ]),
    constraints: "1 <= numCourses <= 2000\n0 <= prerequisites.length <= 5000",
    solutionCode: `function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const graph: number[][] = Array.from({ length: numCourses }, () => []);
  const state = new Array(numCourses).fill(0); // 0=unvisited, 1=visiting, 2=done
  for (const [a, b] of prerequisites) graph[b].push(a);
  function dfs(v: number): boolean {
    if (state[v] === 1) return false;
    if (state[v] === 2) return true;
    state[v] = 1;
    for (const u of graph[v]) { if (!dfs(u)) return false; }
    state[v] = 2;
    return true;
  }
  for (let i = 0; i < numCourses; i++) { if (!dfs(i)) return false; }
  return true;
}`,
    solutionExplanation: "Detect cycle in directed graph using 3-state DFS. If a node currently in state 1 (visiting) is reached again, a cycle exists. Time O(V+E), Space O(V+E).",
    hints: [
      "Model courses as a directed graph. Cycle = impossible to complete.",
      "Use DFS with 3 states: 0=unvisited, 1=visiting, 2=visited."
    ]
  },
  {
    id: "dsa-35",
    title: "Product of Array Except Self",
    difficulty: "MEDIUM",
    tags: "Array, Prefix Sum",
    companyRelevance: "Amazon, Apple, Meta, Microsoft",
    description: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all elements of `nums` except `nums[i]`. Write an O(n) algorithm without using division.",
    examplesJson: JSON.stringify([
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" }
    ]),
    constraints: "2 <= nums.length <= 10^5\n-30 <= nums[i] <= 30",
    solutionCode: `function productExceptSelf(nums: number[]): number[] {
  const n = nums.length;
  const res = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    res[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    res[i] *= suffix;
    suffix *= nums[i];
  }
  return res;
}`,
    solutionExplanation: "Compute prefix products in first pass into output array, then multiply by suffix products in second pass from right to left. Time O(N), Space O(1) extra space.",
    hints: [
      "`res[i]` = product of elements to left of `i` * product of elements to right of `i`.",
      "Compute left prefix products in first pass, right suffix products in reverse pass."
    ]
  },
  {
    id: "dsa-36",
    title: "Group Anagrams",
    difficulty: "MEDIUM",
    tags: "String, Hash Table, Sorting",
    companyRelevance: "Meta, Google, Amazon, Uber",
    description: "Given an array of strings `strs`, group the anagrams together in any order.",
    examplesJson: JSON.stringify([
      { input: "strs = ['eat','tea','tan','ate','nat','bat']", output: "[['bat'],['nat','tan'],['ate','eat','tea']]" },
      { input: "strs = ['']", output: "[['']]" }
    ]),
    constraints: "1 <= strs.length <= 10^4\n0 <= strs[i].length <= 100",
    solutionCode: `function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }
  return Array.from(map.values());
}`,
    solutionExplanation: "Sort each string alphabetically to form a canonical key. Group original strings by this sorted key in a Hash Map. Time O(N * K log K), Space O(N * K).",
    hints: [
      "Anagrams share the same sorted character sequence.",
      "Use sorted string as key in a Hash Map."
    ]
  },
  {
    id: "dsa-37",
    title: "Top K Frequent Elements",
    difficulty: "MEDIUM",
    tags: "Array, Hash Table, Heap, Bucket Sort",
    companyRelevance: "Amazon, Meta, Google",
    description: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements in any order. Algorithm must be better than O(n log n).",
    examplesJson: JSON.stringify([
      { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
      { input: "nums = [1], k = 1", output: "[1]" }
    ]),
    constraints: "1 <= nums.length <= 10^5\nk is in range [1, number of unique elements].",
    solutionCode: `function topKFrequent(nums: number[], k: number): number[] {
  const countMap = new Map<number, number>();
  for (const n of nums) countMap.set(n, (countMap.get(n) || 0) + 1);
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, freq] of countMap.entries()) {
    buckets[freq].push(num);
  }
  const result: number[] = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    for (const num of buckets[i]) {
      result.push(num);
      if (result.length === k) break;
    }
  }
  return result;
}`,
    solutionExplanation: "Bucket Sort approach: count frequencies in Hash Map, then place numbers into buckets indexed by frequency. Iterate buckets backwards. Time O(N), Space O(N).",
    hints: [
      "Count frequency of each number using a Hash Map.",
      "Use Bucket Sort where index represents frequency."
    ]
  },
  {
    id: "dsa-38",
    title: "Coin Change",
    difficulty: "MEDIUM",
    tags: "Dynamic Programming, BFS",
    companyRelevance: "Amazon, Google, Meta",
    description: "You are given an integer array `coins` representing coins of different denominations and an integer `amount`. Return fewest coins needed to make up amount, or -1 if impossible.",
    examplesJson: JSON.stringify([
      { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1" },
      { input: "coins = [2], amount = 3", output: "-1" }
    ]),
    constraints: "1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4",
    solutionCode: `function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    solutionExplanation: "Bottom-up Dynamic Programming. `dp[i]` stores minimum coins for amount `i`. `dp[i] = min(dp[i], 1 + dp[i - coin])`. Time O(amount * coins.length), Space O(amount).",
    hints: [
      "Define `dp[i]` as minimum coins for amount `i`.",
      "`dp[i] = min(1 + dp[i - coin])` for all valid coins."
    ]
  },
  {
    id: "dsa-39",
    title: "Validate Binary Search Tree",
    difficulty: "MEDIUM",
    tags: "Tree, DFS, Binary Search Tree",
    companyRelevance: "Meta, Amazon, Google",
    description: "Given the `root` of a binary tree, determine if it is a valid binary search tree (BST). Left subtree contains nodes < root.val, right subtree contains nodes > root.val.",
    examplesJson: JSON.stringify([
      { input: "root = [2,1,3]", output: "true" },
      { input: "root = [5,1,4,null,null,3,6]", output: "false" }
    ]),
    constraints: "Nodes in range [1, 10^4].\n-2^31 <= Node.val <= 2^31 - 1",
    solutionCode: `function isValidBST(root: TreeNode | null): boolean {
  function validate(node: TreeNode | null, min: number, max: number): boolean {
    if (!node) return true;
    if (node.val <= min || node.val >= max) return false;
    return validate(node.left, min, node.val) && validate(node.right, node.val, max);
  }
  return validate(root, -Infinity, Infinity);
}`,
    solutionExplanation: "DFS with valid range bounds `(min, max)`. Each node value must fall strictly between min and max bounds inherited from parent nodes. Time O(N), Space O(H).",
    hints: [
      "A node must be greater than ALL nodes in left subtree and smaller than ALL nodes in right subtree.",
      "Pass min and max valid bounds down the recursive calls."
    ]
  },
  {
    id: "dsa-40",
    title: "Kth Largest Element in an Array",
    difficulty: "MEDIUM",
    tags: "Array, Heap, Quickselect, Sorting",
    companyRelevance: "Meta, Amazon, Google",
    description: "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array. Note that it is the `k`th largest in sorted order, not `k`th distinct element.",
    examplesJson: JSON.stringify([
      { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" },
      { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4" }
    ]),
    constraints: "1 <= k <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
    solutionCode: `function findKthLargest(nums: number[], k: number): number {
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}`,
    solutionExplanation: "Sort array descending and return index `k-1` (or Quickselect for O(N) average time complexity). Time O(N log N), Space O(1).",
    hints: [
      "Sorting takes O(N log N) time.",
      "Quickselect algorithm achieves average O(N) time."
    ]
  },
  {
    id: "dsa-41",
    title: "House Robber",
    difficulty: "MEDIUM",
    tags: "Array, Dynamic Programming",
    companyRelevance: "Google, Amazon, Meta",
    description: "You are a robber planning to rob houses along a street. Adjacent houses have security systems connected. Given an integer array `nums` representing money in each house, return max money you can rob without alerting police.",
    examplesJson: JSON.stringify([
      { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 (1) + house 3 (3) = 4." },
      { input: "nums = [2,7,9,3,1]", output: "12", explanation: "Rob 1 (2) + 3 (9) + 5 (1) = 12." }
    ]),
    constraints: "1 <= nums.length <= 100\n0 <= nums[i] <= 400",
    solutionCode: `function rob(nums: number[]): number {
  let prev1 = 0, prev2 = 0;
  for (const num of nums) {
    const temp = Math.max(prev1, prev2 + num);
    prev2 = prev1;
    prev1 = temp;
  }
  return prev1;
}`,
    solutionExplanation: "DP state: `rob(i) = max(rob(i-1), rob(i-2) + nums[i])`. Track previous two house max values with variables. Time O(N), Space O(1).",
    hints: [
      "At house `i`, you either skip it (`rob(i-1)`) or rob it (`rob(i-2) + nums[i]`).",
      "Use two variables to track max money up to 1 and 2 houses back."
    ]
  },
  {
    id: "dsa-42",
    title: "Word Break",
    difficulty: "MEDIUM",
    tags: "Hash Table, String, Dynamic Programming, Trie",
    companyRelevance: "Meta, Amazon, Google",
    description: "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.",
    examplesJson: JSON.stringify([
      { input: "s = 'leetcode', wordDict = ['leet','code']", output: "true" },
      { input: "s = 'catsandog', wordDict = ['cats','dog','sand','and','cat']", output: "false" }
    ]),
    constraints: "1 <= s.length <= 300\n1 <= wordDict.length <= 1000",
    solutionCode: `function wordBreak(s: string, wordDict: string[]): boolean {
  const dict = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && dict.has(s.substring(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
    solutionExplanation: "Dynamic Programming: `dp[i]` is true if substring `s[0..i]` can be segmented. `dp[i] = dp[j] && dict.has(s[j..i])`. Time O(N^2), Space O(N).",
    hints: [
      "`dp[i]` represents if prefix `s[0..i]` can be segmented into dictionary words.",
      "Check all split points `j < i`: if `dp[j]` is true and `s[j..i]` is in wordDict, `dp[i] = true`."
    ]
  },
  {
    id: "dsa-43",
    title: "Binary Tree Level Order Traversal",
    difficulty: "MEDIUM",
    tags: "Tree, BFS, Queue",
    companyRelevance: "Amazon, Meta, Google",
    description: "Given the `root` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    examplesJson: JSON.stringify([
      { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" },
      { input: "root = [1]", output: "[[1]]" }
    ]),
    constraints: "Nodes in range [0, 2000].\n-1000 <= Node.val <= 1000",
    solutionCode: `function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}`,
    solutionExplanation: "Breadth-First Search (BFS) using a Queue. Process queue level by level by recording `queue.length` at start of loop. Time O(N), Space O(W).",
    hints: [
      "Use BFS with a Queue data structure.",
      "Process nodes level by level using the queue length at the start of each level loop."
    ]
  },
  {
    id: "dsa-44",
    title: "Clone Graph",
    difficulty: "MEDIUM",
    tags: "Hash Table, DFS, BFS, Graph",
    companyRelevance: "Google, Meta, Amazon",
    description: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node contains a val (int) and a list of its neighbors.",
    examplesJson: JSON.stringify([
      { input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]" }
    ]),
    constraints: "Node count in [0, 100]. Node.val is unique [1, 100].",
    solutionCode: `function cloneGraph(node: Node | null): Node | null {
  if (!node) return null;
  const visited = new Map<Node, Node>();
  function dfs(curr: Node): Node {
    if (visited.has(curr)) return visited.get(curr)!;
    const copy = new Node(curr.val);
    visited.set(curr, copy);
    for (const neighbor of curr.neighbors) {
      copy.neighbors.push(dfs(neighbor));
    }
    return copy;
  }
  return dfs(node);
}`,
    solutionExplanation: "DFS with a Hash Map mapping `originalNode -> clonedNode`. Avoid infinite loops in graph cycles by checking visited map first. Time O(V+E), Space O(V).",
    hints: [
      "Use a Hash Map to store `originalNode -> copiedNode`.",
      "Run DFS/BFS to traverse all vertices and clone edges."
    ]
  },
  {
    id: "dsa-45",
    title: "Combination Sum",
    difficulty: "MEDIUM",
    tags: "Array, Backtracking",
    companyRelevance: "Amazon, Meta, Google",
    description: "Given an array of distinct integers `candidates` and a `target`, return a list of all unique combinations where candidate numbers sum to target. The same number may be chosen unlimited times.",
    examplesJson: JSON.stringify([
      { input: "candidates = [2,3,6,7], target = 7", output: "[[2,2,3],[7]]" },
      { input: "candidates = [2,3,5], target = 8", output: "[[2,2,2,2],[2,3,3],[3,5]]" }
    ]),
    constraints: "1 <= candidates.length <= 30\n2 <= candidates[i] <= 40\n1 <= target <= 40",
    solutionCode: `function combinationSum(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  function backtrack(index: number, current: number[], sum: number) {
    if (sum === target) { result.push([...current]); return; }
    if (sum > target || index >= candidates.length) return;
    current.push(candidates[index]);
    backtrack(index, current, sum + candidates[index]); // reusable
    current.pop();
    backtrack(index + 1, current, sum);
  }
  backtrack(0, [], 0);
  return result;
}`,
    solutionExplanation: "Backtracking decision tree: at each candidate, choose to include candidate again (reuse) or skip to next candidate index. Time O(2^T), Space O(T).",
    hints: [
      "Backtracking decision tree: include candidate again or advance to next candidate.",
      "Base cases: `sum === target` (success), `sum > target` (prune branch)."
    ]
  },
  {
    id: "dsa-46",
    title: "Pacific Atlantic Water Flow",
    difficulty: "MEDIUM",
    tags: "Array, DFS, BFS, Matrix",
    companyRelevance: "Google, Amazon, Uber",
    description: "Given an `m x n` matrix `heights`, water flows to Pacific (top/left) and Atlantic (bottom/right). Return list of grid coordinates where water can flow to BOTH oceans.",
    examplesJson: JSON.stringify([
      { input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]", output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]" }
    ]),
    constraints: "1 <= m, n <= 200\n0 <= heights[i][j] <= 10^5",
    solutionCode: `function pacificAtlantic(heights: number[][]): number[][] {
  const R = heights.length, C = heights[0].length;
  const pac = Array.from({ length: R }, () => new Array(C).fill(false));
  const atl = Array.from({ length: R }, () => new Array(C).fill(false));
  function dfs(r: number, c: number, visited: boolean[][], prevH: number) {
    if (r < 0 || r >= R || c < 0 || c >= C || visited[r][c] || heights[r][c] < prevH) return;
    visited[r][c] = true;
    dfs(r+1, c, visited, heights[r][c]); dfs(r-1, c, visited, heights[r][c]);
    dfs(r, c+1, visited, heights[r][c]); dfs(r, c-1, visited, heights[r][c]);
  }
  for (let c = 0; c < C; c++) { dfs(0, c, pac, heights[0][c]); dfs(R-1, c, atl, heights[R-1][c]); }
  for (let r = 0; r < R; r++) { dfs(r, 0, pac, heights[r][0]); dfs(r, C-1, atl, heights[r][C-1]); }
  const res: number[][] = [];
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (pac[r][c] && atl[r][c]) res.push([r, c]);
    }
  }
  return res;
}`,
    solutionExplanation: "Reverse thinking: run DFS from ocean boundaries inward (water flows uphill to higher cells). Intersect cells reachable from both Pacific and Atlantic. Time O(M*N), Space O(M*N).",
    hints: [
      "Instead of checking if water flows downhill from each cell, run DFS inward from ocean edges.",
      "Collect cells visited by both Pacific DFS and Atlantic DFS."
    ]
  },
  {
    id: "dsa-47",
    title: "Longest Palindromic Substring",
    difficulty: "MEDIUM",
    tags: "String, Dynamic Programming, Two Pointers",
    companyRelevance: "Amazon, Google, Meta",
    description: "Given a string `s`, return the longest palindromic substring in `s`.",
    examplesJson: JSON.stringify([
      { input: "s = 'babad'", output: "'bab'", explanation: "'aba' is also a valid answer." },
      { input: "s = 'cbbd'", output: "'bb'" }
    ]),
    constraints: "1 <= s.length <= 1000\ns consists of digits and English letters.",
    solutionCode: `function longestPalindrome(s: string): string {
  let start = 0, maxLen = 0;
  function expand(l: number, r: number) {
    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
    if (r - l - 1 > maxLen) {
      start = l + 1;
      maxLen = r - l - 1;
    }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i);     // odd length
    expand(i, i + 1); // even length
  }
  return s.substring(start, start + maxLen);
}`,
    solutionExplanation: "Expand Around Center approach. For each index, expand outwards for odd-length and even-length centers. Time O(N^2), Space O(1).",
    hints: [
      "Consider every index (and gap between indices) as a palindrome center.",
      "Expand left and right pointers outward as long as characters match."
    ]
  },
  {
    id: "dsa-48",
    title: "Decode Ways",
    difficulty: "MEDIUM",
    tags: "String, Dynamic Programming",
    companyRelevance: "Meta, Google, Amazon",
    description: "A message containing letters A-Z is encoded to numbers using 'A' -> '1', 'B' -> '2', ..., 'Z' -> '26'. Given a string `s` of digits, return number of ways to decode it.",
    examplesJson: JSON.stringify([
      { input: "s = '12'", output: "2", explanation: "'AB' (1 2) or 'L' (12)." },
      { input: "s = '226'", output: "3", explanation: "'BZ' (2 26), 'VF' (22 6), or 'BBF' (2 2 6)." }
    ]),
    constraints: "1 <= s.length <= 100\ns consists of digits and may contain leading zeros.",
    solutionCode: `function numDecodings(s: string): number {
  if (!s || s[0] === '0') return 0;
  const n = s.length;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1; dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    const oneDigit = Number(s.substring(i - 1, i));
    const twoDigits = Number(s.substring(i - 2, i));
    if (oneDigit >= 1 && oneDigit <= 9) dp[i] += dp[i - 1];
    if (twoDigits >= 10 && twoDigits <= 26) dp[i] += dp[i - 2];
  }
  return dp[n];
}`,
    solutionExplanation: "Dynamic Programming: `dp[i]` is ways to decode `s[0..i]`. `dp[i]` accumulates `dp[i-1]` (if single digit valid) and `dp[i-2]` (if 2-digit valid 10..26). Time O(N), Space O(N).",
    hints: [
      "Like Climbing Stairs, but with valid digit range conditions.",
      "Check 1-digit `s[i-1]` in 1..9 and 2-digit `s[i-2..i]` in 10..26."
    ]
  },

  // =========================================================================
  // 10 HARD PROBLEMS
  // =========================================================================
  {
    id: "dsa-5",
    title: "Trapping Rain Water",
    difficulty: "HARD",
    tags: "Array, Two Pointers, Stack, Dynamic Programming",
    companyRelevance: "Google, Amazon, Meta, Goldman Sachs",
    description: "Given `n` non-negative integers representing an elevation map where bar width is 1, compute how much water it can trap after raining.",
    examplesJson: JSON.stringify([
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "6 units of rain water trapped." }
    ]),
    constraints: "1 <= height.length <= 2 * 10^4\n0 <= height[i] <= 10^5",
    solutionCode: `function trap(height: number[]): number {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else water += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else water += rightMax - height[right];
      right--;
    }
  }
  return water;
}`,
    solutionExplanation: "Two pointers from ends. Water trapped at `i` is `min(maxLeft, maxRight) - height[i]`. Updating `leftMax` and `rightMax` gives O(N) time and O(1) space.",
    hints: [
      "Water level above bar i depends on `min(maxLeft, maxRight)`.",
      "Use two pointers moving inwards while updating `leftMax` and `rightMax`."
    ]
  },
  {
    id: "dsa-6",
    title: "Merge k Sorted Lists",
    difficulty: "HARD",
    tags: "Linked List, Heap, Divide and Conquer",
    companyRelevance: "Meta, Amazon, Microsoft, Uber",
    description: "You are given an array of `k` linked-lists `lists`, each sorted in ascending order. Merge all into one sorted linked-list.",
    examplesJson: JSON.stringify([
      { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" }
    ]),
    constraints: "k in [0, 10^4]. total nodes <= 10^4.",
    solutionCode: `function mergeKLists(lists: (ListNode | null)[]): ListNode | null {
  if (lists.length === 0) return null;
  while (lists.length > 1) {
    const merged: (ListNode | null)[] = [];
    for (let i = 0; i < lists.length; i += 2) {
      const l1 = lists[i];
      const l2 = i + 1 < lists.length ? lists[i + 1] : null;
      merged.push(merge2Lists(l1, l2));
    }
    lists = merged;
  }
  return lists[0];
}
function merge2Lists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const dummy = new ListNode(0); let curr = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
    else { curr.next = l2; l2 = l2.next; }
    curr = curr.next;
  }
  curr.next = l1 || l2;
  return dummy.next;
}`,
    solutionExplanation: "Divide & Conquer: merge pairs of lists iteratively like Merge Sort. Time O(N log k), Space O(1).",
    hints: [
      "Pairwise merging reduces number of lists by half each round.",
      "Or use a Min-Heap containing current heads of all lists."
    ]
  },
  {
    id: "dsa-7",
    title: "N-Queens II",
    difficulty: "HARD",
    tags: "Backtracking",
    companyRelevance: "Google, Meta, Apple",
    description: "The `n`-queens puzzle placing `n` queens on `n x n` chessboard so no two queens attack each other. Return number of distinct solutions.",
    examplesJson: JSON.stringify([
      { input: "n = 4", output: "2" }
    ]),
    constraints: "1 <= n <= 9",
    solutionCode: `function totalNQueens(n: number): number {
  let count = 0;
  const cols = new Set<number>();
  const posDiag = new Set<number>();
  const negDiag = new Set<number>();
  function backtrack(r: number) {
    if (r === n) { count++; return; }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || posDiag.has(r + c) || negDiag.has(r - c)) continue;
      cols.add(c); posDiag.add(r + c); negDiag.add(r - c);
      backtrack(r + 1);
      cols.delete(c); posDiag.delete(r + c); negDiag.delete(r - c);
    }
  }
  backtrack(0);
  return count;
}`,
    solutionExplanation: "Backtracking row by row. Use Sets to track attacked columns `c`, positive diagonals `r+c`, and negative diagonals `r-c`. Time O(N!), Space O(N).",
    hints: [
      "Place queens row by row.",
      "Track attacked diagonals using `row + col` and `row - col` sets."
    ]
  },
  {
    id: "dsa-8",
    title: "Median of Two Sorted Arrays",
    difficulty: "HARD",
    tags: "Array, Binary Search, Divide and Conquer",
    companyRelevance: "Google, Meta, Amazon, Apple",
    description: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n`, return the median of the two sorted arrays. Time complexity must be O(log (m+n)).",
    examplesJson: JSON.stringify([
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" },
      { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.50000" }
    ]),
    constraints: "0 <= m, n <= 1000\n1 <= m + n <= 2000",
    solutionCode: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
  const m = nums1.length, n = nums2.length;
  let low = 0, high = m;
  while (low <= high) {
    const i = Math.floor((low + high) / 2);
    const j = Math.floor((m + n + 1) / 2) - i;
    const maxLeft1 = i === 0 ? -Infinity : nums1[i - 1];
    const minRight1 = i === m ? Infinity : nums1[i];
    const maxLeft2 = j === 0 ? -Infinity : nums2[j - 1];
    const minRight2 = j === n ? Infinity : nums2[j];
    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
      if ((m + n) % 2 === 0) return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;
      else return Math.max(maxLeft1, maxLeft2);
    } else if (maxLeft1 > minRight2) high = i - 1;
    else low = i + 1;
  }
  return 0;
}`,
    solutionExplanation: "Binary search partition on smaller array `nums1` such that `maxLeft1 <= minRight2` and `maxLeft2 <= minRight1`. Time O(log(min(m,n))), Space O(1).",
    hints: [
      "Binary search partition point on smaller array.",
      "Partition divides merged elements equally into left and right halves."
    ]
  },
  {
    id: "dsa-17",
    title: "Word Search II",
    difficulty: "HARD",
    tags: "Array, String, DFS, Trie, Matrix, Backtracking",
    companyRelevance: "Google, Amazon, Microsoft, Airbnb",
    description: "Given an `m x n` board of characters and list of `words`, return all words on board. Each word must be constructed from sequentially adjacent cells.",
    examplesJson: JSON.stringify([
      { input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', output: '["eat","oath"]' }
    ]),
    constraints: "1 <= m, n <= 12\n1 <= words.length <= 3 * 10^4",
    solutionCode: `function findWords(board: string[][], words: string[]): string[] {
  const trie: Record<string, any> = {};
  for (const w of words) {
    let node = trie;
    for (const ch of w) { if (!node[ch]) node[ch] = {}; node = node[ch]; }
    node['$'] = w;
  }
  const result: string[] = [];
  const R = board.length, C = board[0].length;
  function dfs(r: number, c: number, node: Record<string, any>) {
    if (r < 0 || r >= R || c < 0 || c >= C) return;
    const ch = board[r][c];
    if (ch === '#' || !node[ch]) return;
    const next = node[ch];
    if (next['$']) { result.push(next['$']); delete next['$']; }
    board[r][c] = '#';
    dfs(r+1,c,next); dfs(r-1,c,next); dfs(r,c+1,next); dfs(r,c-1,next);
    board[r][c] = ch;
  }
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) dfs(r, c, trie);
  return result;
}`,
    solutionExplanation: "Build Trie from words. Run DFS on board while traversing Trie simultaneously. Backtrack and prune invalid branches. Time O(M*N*4^L).",
    hints: [
      "Trie prunes DFS branches when no word prefix matches.",
      "Traverse Trie and board simultaneously, marking visited cells with '#'."
    ]
  },
  {
    id: "dsa-18",
    title: "Minimum Window Substring",
    difficulty: "HARD",
    tags: "Hash Table, String, Sliding Window",
    companyRelevance: "Meta, Amazon, Google, LinkedIn",
    description: "Given two strings `s` and `t`, return minimum window substring of `s` containing all characters in `t` (including duplicates).",
    examplesJson: JSON.stringify([
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' }
    ]),
    constraints: "1 <= s.length, t.length <= 10^5",
    solutionCode: `function minWindow(s: string, t: string): string {
  if (!t.length) return "";
  const need = new Map<string, number>();
  for (const ch of t) need.set(ch, (need.get(ch) ?? 0) + 1);
  let have = 0, required = need.size;
  let left = 0, minLen = Infinity, minStart = 0;
  const win = new Map<string, number>();
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    win.set(ch, (win.get(ch) ?? 0) + 1);
    if (need.has(ch) && win.get(ch) === need.get(ch)) have++;
    while (have === required) {
      if (right - left + 1 < minLen) { minLen = right - left + 1; minStart = left; }
      const lch = s[left++];
      win.set(lch, win.get(lch)! - 1);
      if (need.has(lch) && win.get(lch)! < need.get(lch)!) have--;
    }
  }
  return minLen === Infinity ? "" : s.slice(minStart, minStart + minLen);
}`,
    solutionExplanation: "Sliding window with two frequency maps (`need` and `window`). Expand right until all chars satisfied, shrink left to minimize. Time O(M+N), Space O(M+N).",
    hints: [
      "Expand right until window contains all chars of `t`.",
      "Shrink left to find minimal valid window size."
    ]
  },
  {
    id: "dsa-19",
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "HARD",
    tags: "Tree, DFS, BFS, Design, String",
    companyRelevance: "Google, Meta, Amazon, Uber",
    description: "Design an algorithm to serialize a binary tree to a string and deserialize the string back to the original binary tree structure.",
    examplesJson: JSON.stringify([
      { input: "root = [1,2,3,null,null,4,5]", output: "[1,2,3,null,null,4,5]" }
    ]),
    constraints: "Nodes count in [0, 10^4].",
    solutionCode: `class Codec {
  serialize(root: TreeNode | null): string {
    const res: string[] = [];
    const dfs = (node: TreeNode | null) => {
      if (!node) { res.push('N'); return; }
      res.push(String(node.val)); dfs(node.left); dfs(node.right);
    };
    dfs(root); return res.join(',');
  }
  deserialize(data: string): TreeNode | null {
    const vals = data.split(','); let i = 0;
    const dfs = (): TreeNode | null => {
      if (vals[i] === 'N') { i++; return null; }
      const node = new TreeNode(Number(vals[i++]));
      node.left = dfs(); node.right = dfs(); return node;
    };
    return dfs();
  }
}`,
    solutionExplanation: "Pre-order DFS serialization writing 'N' for null nodes. Deserialization consumes tokens in same pre-order sequence. Time O(N), Space O(N).",
    hints: [
      "Pre-order traversal (root, left, right) puts root node first.",
      "Use 'N' token for null pointers."
    ]
  },
  {
    id: "dsa-20",
    title: "Longest Increasing Path in a Matrix",
    difficulty: "HARD",
    tags: "Array, DFS, Memoization, Matrix, DP",
    companyRelevance: "Google, Amazon, Meta, Palantir",
    description: "Given an `m x n` integers matrix, return length of longest strictly increasing path. Move in 4 directions.",
    examplesJson: JSON.stringify([
      { input: "matrix = [[9,9,4],[6,6,8],[2,1,1]]", output: "4", explanation: "[1, 2, 6, 9]" }
    ]),
    constraints: "1 <= m, n <= 200",
    solutionCode: `function longestIncreasingPath(matrix: number[][]): number {
  const R = matrix.length, C = matrix[0].length;
  const memo = Array.from({ length: R }, () => new Array(C).fill(0));
  function dfs(r: number, c: number): number {
    if (memo[r][c]) return memo[r][c];
    let best = 1;
    for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C && matrix[nr][nc] > matrix[r][c])
        best = Math.max(best, 1 + dfs(nr, nc));
    }
    return memo[r][c] = best;
  }
  let res = 0;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) res = Math.max(res, dfs(r, c));
  return res;
}`,
    solutionExplanation: "DFS with memoization. Strictly increasing condition guarantees no cycles. Cache longest path starting at `(r,c)`. Time O(M*N), Space O(M*N).",
    hints: [
      "No cycles because path must strictly increase.",
      "Memoize result for each grid cell `(r,c)`."
    ]
  },
  {
    id: "dsa-49",
    title: "Edit Distance",
    difficulty: "HARD",
    tags: "String, Dynamic Programming",
    companyRelevance: "Google, Meta, Amazon, Microsoft",
    description: "Given two strings `word1` and `word2`, return minimum operations (insert, delete, replace character) required to convert `word1` to `word2`.",
    examplesJson: JSON.stringify([
      { input: "word1 = 'horse', word2 = 'ros'", output: "3", explanation: "horse -> rorse -> rose -> ros" },
      { input: "word1 = 'intention', word2 = 'execution'", output: "5" }
    ]),
    constraints: "0 <= word1.length, word2.length <= 500",
    solutionCode: `function minDistance(word1: string, word2: string): number {
  const m = word1.length, n = word2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}`,
    solutionExplanation: "2D Dynamic Programming (Levenshtein Distance): `dp[i][j]` is edit distance between `word1[0..i]` and `word2[0..j]`. If match, `dp[i-1][j-1]`; else `1 + min(delete, insert, replace)`. Time O(M*N), Space O(M*N).",
    hints: [
      "Define `dp[i][j]` as min distance between prefixes `word1[0..i]` and `word2[0..j]`.",
      "If characters match, `dp[i][j] = dp[i-1][j-1]`. Otherwise `1 + min(insert, delete, replace)`."
    ]
  },
  {
    id: "dsa-50",
    title: "Binary Tree Maximum Path Sum",
    difficulty: "HARD",
    tags: "Tree, DFS, Dynamic Programming",
    companyRelevance: "Meta, Amazon, Google",
    description: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. Path sum is sum of node values. Return maximum path sum of ANY non-empty path.",
    examplesJson: JSON.stringify([
      { input: "root = [1,2,3]", output: "6" },
      { input: "root = [-10,9,20,null,null,15,7]", output: "42", explanation: "Path 15 -> 20 -> 7 gives sum 42." }
    ]),
    constraints: "Nodes in range [1, 3 * 10^4].\n-1000 <= Node.val <= 1000",
    solutionCode: `function maxPathSum(root: TreeNode | null): number {
  let maxSum = -Infinity;
  function maxGain(node: TreeNode | null): number {
    if (!node) return 0;
    const leftGain = Math.max(maxGain(node.left), 0);
    const rightGain = Math.max(maxGain(node.right), 0);
    const currentPathSum = node.val + leftGain + rightGain;
    maxSum = Math.max(maxSum, currentPathSum);
    return node.val + Math.max(leftGain, rightGain);
  }
  maxGain(root);
  return maxSum;
}`,
    solutionExplanation: "Post-order DFS traversal. Compute max gain from left and right subtrees (ignore negative gains). Update global max path sum `node.val + leftGain + rightGain`. Return max branch gain `node.val + max(leftGain, rightGain)`. Time O(N), Space O(H).",
    hints: [
      "At each node, compute max gain from left and right subtrees.",
      "Global max path can split at node: `node.val + leftGain + rightGain`. Recursive gain return can only choose ONE branch."
    ]
  }
];
