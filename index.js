import { readdir } from 'fs/promises';
import path from 'path';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

/* ------------------ SAFETY ------------------ */

const FORBIDDEN_DIRS = [
  '/',
//   'C:\\',
  'C:\\Windows',
  'C:\\Program Files',
  'C:\\Program Files (x86)',
  '/etc',
  '/bin',
  '/usr',
  '/var'
];

const isForbiddenDir = (dir) =>
  FORBIDDEN_DIRS.some(forbidden =>
    dir.toLowerCase().startsWith(forbidden.toLowerCase())
  );

/* ------------------ TREE BUILD ------------------ */

const readDir = async (dirPath) => {
  const node = {
    name: path.basename(dirPath),
    path: dirPath,
    type: 'directory',
    files: {},
    directories: {}
  };

  let entries;
  try {
    entries = await readdir(dirPath, { withFileTypes: true });
  } catch {
    return node;
  }

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      node.directories[entry.name] = await readDir(fullPath);
    } else {
      node.files[entry.name] = {
        name: entry.name,
        path: fullPath,
        type: 'file'
      };
    }
  }

  return node;
};

/* ------------------ SEARCH IMPLEMENTATIONS ------------------ */

// Recursive – first match
const searchSingleRecursive = (tree, fileName) => {
  if (tree.files[fileName]) return tree.files[fileName];

  for (const dir of Object.values(tree.directories)) {
    const found = searchSingleRecursive(dir, fileName);
    if (found) return found;
  }

  return null;
};

// Iterative DFS – first match
const searchSingleIterative = (tree, fileName) => {
  const stack = [tree];

  while (stack.length) {
    const node = stack.pop();

    if (node.files[fileName]) {
      return node.files[fileName];
    }

    for (const dir of Object.values(node.directories)) {
      stack.push(dir);
    }
  }

  return null;
};

// Recursive – all matches
const searchAllRecursive = (tree, fileName, result = []) => {
  if (tree.files[fileName]) result.push(tree.files[fileName]);

  for (const dir of Object.values(tree.directories)) {
    searchAllRecursive(dir, fileName, result);
  }

  return result;
};

// Iterative DFS – all matches
const searchAllIterative = (tree, fileName) => {
  const stack = [tree];
  const results = [];

  while (stack.length) {
    const node = stack.pop();

    if (node.files[fileName]) {
      results.push(node.files[fileName]);
    }

    for (const dir of Object.values(node.directories)) {
      stack.push(dir);
    }
  }

  return results;
};

/* ------------------ CLI ------------------ */

const rl = readline.createInterface({ input, output });

const main = async () => {
  const dirPath = await rl.question('Enter directory to search in: ');

  if (isForbiddenDir(dirPath)) {
    console.log('This directory is not allowed for safety reasons.');
    rl.close();
    return;
  }

  const fileName = await rl.question('Enter file name to search for: ');

  const matchType = await rl.question(
    'Search type (1 = first match, 2 = all matches): '
  );

  const dfsType = await rl.question(
    'Traversal (1 = recursive DFS, 2 = iterative DFS): '
  );

  console.log('\nReading directory tree...\n');
  const tree = await readDir(dirPath);

  let result;

  if (matchType === '1' && dfsType === '1') {
    result = searchSingleRecursive(tree, fileName);
  } else if (matchType === '1' && dfsType === '2') {
    result = searchSingleIterative(tree, fileName);
  } else if (matchType === '2' && dfsType === '1') {
    result = searchAllRecursive(tree, fileName);
  } else if (matchType === '2' && dfsType === '2') {
    result = searchAllIterative(tree, fileName);
  } else {
    console.log('Invalid selection.');
    rl.close();
    return;
  }

  console.log('\nResult:\n');
  console.log(JSON.stringify(result, null, 2));

  rl.close();
};

main();
