'use strict';

import 'dotenv/config';
import './initLogger.js'
import readline from "readline";
import os from "os";
import { execSync } from "child_process";
import fs from "fs";

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

function getDiskSpace() {
    try {
        const output = execSync('df -h / | tail -1').toString().trim().split(/\s+/);
        return { size: output[1], used: output[2], avail: output[3], percent: output[4] };
    } catch (e) {
        return { size: "N/A", used: "N/A", avail: "N/A", percent: "N/A" };
    }
}

function printBanner() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const processMem = process.memoryUsage().rss;
    
    const stats = {
        os: `${os.type()} ${os.release()} (${os.arch()})`,
        node: process.version,
        processMemory: `${(processMem / 1024 / 1024).toFixed(2)} MB`,
        systemMemory: `${(usedMem / 1024**3).toFixed(2)} GB used / ${(totalMem / 1024**3).toFixed(2)} GB total`,
        disk: getDiskSpace().avail + " free",
        uptime: `${(os.uptime() / 3600).toFixed(1)} hours`
    };

    const env = process.env.ENVIRONMENT || "NOT SET";
    const port = process.env.DEFAULT_PORT || "N/A";
    const host = env === "DEVELOPMENT" ? process.env.ENDPOINT_DEV : (process.env.ENDPOINT || "localhost");
    const url = `http://${host}:${port}`;

    const color = env === "PRODUCTION" ? "\x1b[35m" : "\x1b[36m"; 
    const reset = "\x1b[0m";
    const bold = "\x1b[1m";

    const width = 65;
    const cleanLength = (str) => str.replace(/\x1b\[[0-9;]*m/g, "").length;

    const drawLine = () => console.log(`${color}├${"─".repeat(width - 2)}┤${reset}`);
    const drawTop = () => console.log(`${color}┌${"─".repeat(width - 2)}┐${reset}`);
    const drawBottom = () => console.log(`${color}└${"─".repeat(width - 2)}┘${reset}`);
    
    const drawRow = (label, value = "") => {
        const fullText = `  ${label}${value}`;
        const padding = width - 2 - cleanLength(fullText);
        console.log(`${color}│${reset}${fullText}${" ".repeat(Math.max(0, padding))}${color}│${reset}`);
    };

    drawTop();
    drawRow(`${bold}${pkg.name.toUpperCase()}${reset} - v${pkg.version}`);
    drawLine();
    drawRow(`${bold}STATUS:${reset}    `, env === "PRODUCTION" ? "\x1b[41m\x1b[37m PRODUCTION \x1b[0m" : "\x1b[46m\x1b[30m DEVELOPMENT \x1b[0m");
    drawRow(`${bold}URL:${reset}       `, url);
    drawLine();
    drawRow(`${bold}RESOURCE USAGE:${reset}`);
    drawRow(` - Process RAM: `, stats.processMemory);
    drawRow(` - System RAM:  `, stats.systemMemory);
    drawRow(` - Disk Free:   `, stats.disk);
    drawLine();
    drawRow(`${bold}SYSTEM INFO:${reset}`);
    drawRow(` - Node:        `, stats.node);
    drawRow(` - OS:          `, stats.os);
    drawRow(` - Uptime:      `, stats.uptime);
    drawBottom();
    console.log("");
}

printBanner();

if (!process.env.ENVIRONMENT || !["DEVELOPMENT", "PRODUCTION"].includes(process.env.ENVIRONMENT)) {
    console.error("\x1b[31m❌ [ERROR] Missing or invalid environment. Must be DEVELOPMENT or PRODUCTION.\x1b[0m");
    process.exit(1);
}

if (!process.env.DEFAULT_PORT) {
    console.error("\x1b[31m❌ [ERROR] Missing Port number for http\x1b[0m");
    process.exit(1);
}

const DB_ENGINE = (process.env.DB_ENGINE || "mongo").toLowerCase();

const requiredParamsByEngine = {
    mongo: ["MONGO_USER", "MONGO_PASSWORD", "MONGO_SERVER", "MONGO_DB"],
    postgres: ["SQL_HOST", "SQL_USER", "SQL_DATABASE"],
    mysql: ["SQL_HOST", "SQL_USER", "SQL_DATABASE"],
};

if (!requiredParamsByEngine[DB_ENGINE]) {
    console.error(`\x1b[31m❌ [ERROR] Invalid DB_ENGINE "${DB_ENGINE}". Must be mongo, postgres or mysql.\x1b[0m`);
    process.exit(1);
}

const missingParams = requiredParamsByEngine[DB_ENGINE].filter(param => !process.env[param]);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

if (missingParams.length === 0) {
    import("./db/index.js").then(async ({ connect }) => {
        await connect();
        startServer();
    }).catch(err => {
        console.error(`\x1b[31m❌ [DB] Error connecting (${DB_ENGINE}):\x1b[0m`, err.message);
        process.exit(1);
    });
} else {
    if (process.env.ENVIRONMENT === "DEVELOPMENT") {
        console.warn(`\x1b[33m⚠️  [CONFIG] Missing ${DB_ENGINE} config: ${missingParams.join(', ')} — starting without database.\x1b[0m`);
        rl.close();
        startServer();
    } else {
        console.warn(`\x1b[33m⚠️  [CONFIG] Missing ${DB_ENGINE} config: ${missingParams.join(', ')}\x1b[0m`);
        console.warn(`\x1b[31m⛔ [SYSTEM] Mode: PRODUCTION - Missing critical database configuration.\x1b[0m`);
        rl.question("Do you want to continue? (yes/no) [no]: ", answer => {
            if (answer.toLowerCase() === "yes") {
                console.log(`\x1b[33m⚡ [SYSTEM] Continuing without database connection...\x1b[0m`);
                rl.close();
                startServer();
            } else {
                console.log(`\x1b[37m👋 [SYSTEM] Exiting due to missing configuration...\x1b[0m`);
                rl.close();
                process.exit(0);
            }
        });
    }
}

function startServer() {
    const PORT = process.env.DEFAULT_PORT;
    const HOST = process.env.ENVIRONMENT === "DEVELOPMENT" ? process.env.ENDPOINT_DEV : process.env.ENDPOINT;

    (async () => {
        try {
            const http = await import("http");
            const { default: app } = await import("./app.js");

            const server = http.createServer(app);
            server.maxHeadersCount = 10000;

            server.listen(PORT, HOST, () => {
                console.log(`\x1b[32m\x1b[1m✅ [READY] Server listening: http://${HOST}:${PORT}\x1b[0m`);
            });

            process.on("SIGINT", async () => {
                console.log(`\n\x1b[33m🔌 [SYSTEM] Closing server...\x1b[0m`);
                try {
                    const { disconnect } = await import("./db/index.js");
                    await disconnect();
                } catch (e) {
                    console.error(`\x1b[31m❌ [DB] Error during disconnect:\x1b[0m`, e.message);
                }
                process.exit(0);
            });


        } catch (err) {
            console.error(`\x1b[31m❌ [SYSTEM] Error loading modules:\x1b[0m`, err);
        }
    })();
}
