#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const CAVOS_ASCII = `
███████╗██╗ ██╗██╗██╗      ███████╗
██╔════╝██║ ██╔╝██║██║      ██╔════╝
███████╗█████╔╝ ██║██║      ███████╗
╚════██║██╔═██╗ ██║██║      ╚════██║
███████║██║  ██╗██║███████╗███████║
╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝
`;

async function run() {
  console.log(CAVOS_ASCII);
  console.log('✦ Welcome to create-cavos-app\n');

  const projectName = process.argv[2] || await ask('Project name? (my-cavos-app): ') || 'my-cavos-app';
  const appId = await ask('Your Cavos App ID (get it at cavos.xyz): ');

  const targetDir = path.join(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.error(`Error: Directory ${projectName} already exists.`);
    process.exit(1);
  }

  console.log(`\n✓ Scaffolding ${projectName}...`);
  fs.mkdirSync(targetDir, { recursive: true });

  // Create package.json
  const pkg = {
    name: projectName,
    version: '0.1.0',
    private: true,
    scripts: {
      "dev": "next dev",
      "build": "next build",
      "start": "next start"
    }
  };
  fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkg, null, 2));

  // Create .env.local
  fs.writeFileSync(path.join(targetDir, '.env.local'), `NEXT_PUBLIC_CAVOS_APP_ID=${appId}\n`);

  // Copy template files
  const templateDir = path.join(__dirname, 'templates', 'nextjs');
  copyDir(templateDir, targetDir);

  console.log('✓ Installing dependencies (Next.js, @cavos/react, Starknet)...');
  try {
    execSync('npm install next react react-dom @cavos/react starknet lucide-react tailwindcss @tailwindcss/postcss postcss @types/react @types/react-dom @types/node typescript', { 
      cwd: targetDir, 
      stdio: 'inherit' 
    });
  } catch (e) {
    console.error('Warning: npm install failed. You may need to run it manually.');
  }

  console.log('✓ Initializing git repository...');
  try {
    execSync('git init && git add . && git commit -m "Initial commit from create-cavos-app"', { 
      cwd: targetDir, 
      stdio: 'ignore' 
    });
  } catch (e) {
    // Silent fail if git is not installed or configured
  }

  console.log('✓ Adding Cavos Agent Skills...');
  try {
    execSync('npx skills add cavos-labs/cavos-skills', { 
      cwd: targetDir, 
      stdio: 'inherit' 
    });
  } catch (e) {
    console.error('Warning: Failed to add Cavos skills. You can add them later with: npx skills add cavos-labs/cavos-skills');
  }

  console.log(`\nDone! 🚀\n\nRun:\n  cd ${projectName}\n  npm run dev\n`);
  process.exit(0);
}

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    // Handle npm's .gitignore renaming behavior
    if (entry.name === 'gitignore') {
      destPath = path.join(dest, '.gitignore');
    }

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

run();
