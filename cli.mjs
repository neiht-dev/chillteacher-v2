#!/usr/bin/env node

import readline from 'readline';
import { execSync } from 'child_process';
import fs from 'fs';

const colors = {
	blue: '\x1b[34m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	red: '\x1b[31m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	bold: '\x1b[1m',
	reset: '\x1b[0m',
};

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const FRONTEND_DIR = './frontend';
const BACKEND_DIR = './backend';
const DATABASE_DIR = './backend/database';

// === Action functions ===
function waitKeyPressToContinue(menuToShow) {
	rl.question(`${colors.blue}Press any key to continue...${colors.reset}`, (key) => {
		menuToShow();
	});
}

function frontendDev() {
	console.log(`${colors.blue}Running frontend dev server...${colors.reset}`);
	execSync(`cd ${FRONTEND_DIR} && npm run dev`, { stdio: 'inherit' });
}

function frontendBuild() {
	console.log(`${colors.blue}Building frontend...${colors.reset}`);
	execSync(`cd ${FRONTEND_DIR} && npm run build`, { stdio: 'inherit' });
}

function frontendLint() {
	console.log(`${colors.blue}Running Biome Lint...${colors.reset}`);
	execSync(`cd ${FRONTEND_DIR} && npm run check`, { stdio: 'inherit' });
}

function frontendPreview() {
	console.log(`${colors.blue}Starting preview server...${colors.reset}`);
	execSync(`cd ${FRONTEND_DIR} && npm run preview`, { stdio: 'inherit' });
}

function frontendFormat() {
	console.log(`${colors.blue}Formatting code with Biome...${colors.reset}`);
	execSync(`cd ${FRONTEND_DIR} && npm run format`, { stdio: 'inherit' });
}

function frontendFormatCheck() {
	console.log(`${colors.blue}Checking code formatting...${colors.reset}`);
	execSync(`cd ${FRONTEND_DIR} && npm run format`, { stdio: 'inherit' });
}

// === Menu handlers ===
function showMainMenu() {
	console.clear();
	console.log(`${colors.bold}${colors.blue}=== PROJECT CLI ===${colors.reset}`);
	console.log('1. Frontend');
	console.log('2. Backend');
	console.log('3. Database');
	console.log('4. ❌ Exit\n');
	rl.question('Choose number: ', input => {
		switch (input.trim()) {
			case '1':
				showFrontendMenu();
				break;
			case '2':
				showBackendMenu();
				break;
			case '3':
				showDatabaseMenu();
				break;
			case '4':
				console.log(`${colors.magenta}Goodbye 👋${colors.reset}`);
				rl.close();
				break;
			default:
				console.log(`${colors.red}Invalid choice.${colors.reset}`);
				showMainMenu();
		}
	});
}

function showFrontendMenu() {
	console.clear();
	console.log(`${colors.cyan}=== Frontend ===${colors.reset}`);
	console.log('1. 🔧 Run dev server');
	console.log('2. 📦 Build project');
	console.log('3. 🔍 Lint code');
	console.log('4. 👀 Preview build');
	console.log('5. ✨ Format code');
	console.log('6. ✅ Check formatting');
	console.log('7. 🔙 Back to main menu\n');
	rl.question('Choose number: ', input => {
		switch (input.trim()) {
			case '1':
				frontendDev();
				waitKeyPressToContinue(showFrontendMenu);
				break;
			case '2':
				frontendBuild();
				waitKeyPressToContinue(showFrontendMenu);
				break;
			case '3':
				frontendLint();
				waitKeyPressToContinue(showFrontendMenu);
				break;
			case '5':
				frontendPreview();
				waitKeyPressToContinue(showFrontendMenu);
				break;
			case '5':
				frontendFormat();
				waitKeyPressToContinue(showFrontendMenu);
				break;
			case '6':
				frontendFormatCheck();
				waitKeyPressToContinue(showFrontendMenu);
				break;
			case '7':
				showMainMenu();
				break;
			default:
				console.log(`${colors.red}Invalid${colors.reset}`);
				waitKeyPressToContinue(showFrontendMenu);
		}
	});
}

function showBackendMenu() {
	console.clear();
	console.log(`${colors.cyan}=== Backend ===${colors.reset}`);
	console.log('1. 🔧 Run backend server');
	console.log('2. 🔙 Back to main menu\n');
	rl.question('Choose number: ', input => {
		switch (input.trim()) {
			case '1':
				// TODO: Implement backend server for the CLI tool
				console.log(`${colors.red}Not implemented${colors.reset}`);
				waitKeyPressToContinue(showBackendMenu);
				break;
			case '2':
				showMainMenu();
				break;
			default:
				console.log(`${colors.red}Invalid${colors.reset}`);
				waitKeyPressToContinue(showBackendMenu);
		}
	});
}

function showDatabaseMenu() {
	console.clear();
	console.log(`${colors.cyan}=== Database ===${colors.reset}`);
	console.log('1. 📦 Migration');
	console.log('2. 🔙 Back to main menu\n');
	rl.question('Choose number: ', input => {
		switch (input.trim()) {
			case '1':
				// TODO: Implement database migration for the CLI tool
				console.log(`${colors.red}Not implemented${colors.reset}`);
				waitKeyPressToContinue(showDatabaseMenu);
				break;
			case '2':
				showMainMenu();
				break;
			default:
				console.log(`${colors.red}Invalid${colors.reset}`);
				waitKeyPressToContinue(showDatabaseMenu);
		}
	});
}

// === Start CLI ===
showMainMenu();
