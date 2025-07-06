// precompile.js
import http from 'http';
import fs from 'fs';
import path from 'path';

// Function to recursively find all page.tsx files and convert them to routes
const findRoutes = (dir, basePath = '') => {
	const routes = [];

	try {
		const items = fs.readdirSync(dir);

		for (const item of items) {
			const fullPath = path.join(dir, item);
			const stat = fs.statSync(fullPath);

			if (stat.isDirectory()) {
				// Check if this directory contains a page.tsx file
				const pagePath = path.join(fullPath, 'page.tsx');
				if (fs.existsSync(pagePath)) {
					// Convert directory path to route
					const routePath = path.join(basePath, item).replace(/\\/g, '/');
					// Remove route groups (parentheses) from the path
					const cleanRoute = routePath.replace(/\([^)]+\)\//g, '');
					routes.push('/' + cleanRoute);
				}

				// Recursively search subdirectories
				const subRoutes = findRoutes(fullPath, path.join(basePath, item));
				routes.push(...subRoutes);
			}
		}
	} catch (error) {
		console.error(`Error reading directory ${dir}:`, error.message);
	}

	return routes;
};

// Get routes dynamically
const getRoutes = () => {
	const appDir = path.join(process.cwd(), 'src', 'app');
	const routes = findRoutes(appDir);

	// Remove duplicates and sort
	const uniqueRoutes = [...new Set(routes)].sort();

	console.log('🔍 Discovered routes:');
	uniqueRoutes.forEach((route) => console.log(`  ${route}`));
	console.log('');

	return uniqueRoutes;
};

const checkServer = (url) => {
	return new Promise((resolve, reject) => {
		const req = http.get(url, (res) => {
			if (res.statusCode === 200) {
				resolve(true);
			} else {
				reject(false);
			}
		});

		req.on('error', () => resolve(false));
		req.end();
	});
};

const waitForServer = async (url, maxAttempts = 60, interval = 1000) => {
	console.log(`🔍 Waiting for server at ${url}...`);

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		const isRunning = await checkServer(url);

		if (isRunning) {
			console.log(`✅ Server is running! (attempt ${attempt})`);
			return true;
		}

		if (attempt < maxAttempts) {
			console.log(`⏳ Server not ready yet... (attempt ${attempt}/${maxAttempts})`);
			await new Promise((resolve) => setTimeout(resolve, interval));
		}
	}

	console.error(`❌ Server failed to start after ${maxAttempts} attempts`);
	return false;
};

const httpRoute = (url) => {
	return new Promise((resolve, reject) => {
		const req = http.get(url, (res) => {
			// Drain the response to free up memory
			res.on('data', () => {});
			res.on('end', () => {
				if (res.statusCode >= 200 && res.statusCode < 400) {
					console.log(`✅ ${url} - Status: ${res.statusCode}`);
					resolve();
				} else {
					console.log(`⚠️  ${url} - Status: ${res.statusCode}`);
					resolve();
				}
			});
		});

		req.on('error', (error) => {
			console.error(`❌ ${url} - Error: ${error.message}`);
			reject(error);
		});

		req.setTimeout(100000, () => {
			req.destroy();
			console.error(`❌ ${url} - Timeout`);
			reject(new Error('Request timeout'));
		});

		req.end();
	});
};

(async () => {
	const serverUrl = 'http://localhost:3000';

	// Wait for server to be available
	const serverReady = await waitForServer(serverUrl);
	if (!serverReady) {
		console.error('Server is not running. Please start the server and try again.');
		process.exit(1);
	}

	console.log('🚀 Starting concurrent route compilation...');

	const startTime = Date.now();

	// Run all routes concurrently
	const routes = getRoutes(); // Use the new function to get routes
	const promises = routes.map((route) => {
		const url = `${serverUrl}${route}`;
		return httpRoute(url);
	});

	try {
		await Promise.all(promises);
		const endTime = Date.now();
		console.log(`\n✨ All routes compiled successfully in ${endTime - startTime}ms`);
	} catch (error) {
		console.error('\n❌ Some routes failed to compile:', error.message);
		process.exit(1);
	}
})();
