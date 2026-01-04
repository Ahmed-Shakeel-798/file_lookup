# Directory Search CLI (DFS)

A small Node.js command-line program that reads a directory, builds an in-memory tree, and searches for files using **Depth-First Search (DFS)**.

This project is mainly for learning tree data structures and DFS (recursive vs iterative).

---

## Features

- Interactive terminal input
- Safe directory selection (blocks important system directories)
- Exact file name search
- Return **first match** or **all matches**
- Choose between **recursive DFS** or **iterative DFS**

---

## How It Works

1. Prompts the user for:
   - Directory path
   - File name
   - Search mode (first match / all matches)
   - Traversal method (recursive / iterative)

2. Reads the directory structure and stores it as a **tree**.

3. Traverses the tree using DFS to find matching files.

---

## Input

- **Directory path**
- **File name** (exact match)
- **Search type**
  - `1` → First match
  - `2` → All matches
- **Traversal type**
  - `1` → Recursive DFS
  - `2` → Iterative DFS

---

## Data Structure

Each directory is represented as a node:

```js
{
  name,
  path,
  type: "directory",
  files: { "file.txt": { ... } },
  directories: { "subdir": { ... } }
}
