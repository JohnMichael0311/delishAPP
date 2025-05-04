import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create performance logs directory
const perfLogsDir = path.join(__dirname, '..', 'logs', 'performance');
if (!fs.existsSync(perfLogsDir)) {
    fs.mkdirSync(perfLogsDir, { recursive: true });
}

const logStream = fs.createWriteStream(
    path.join(perfLogsDir, 'performance.log'),
    { flags: 'a' }
);

export const performanceMiddleware = (req, res, next) => {
    const start = process.hrtime();
    
    // Store original end function
    const originalEnd = res.end;
    
    // Override end function
    res.end = function(...args) {
        const diff = process.hrtime(start);
        const time = diff[0] * 1e3 + diff[1] * 1e-6; // Convert to milliseconds
        
        const log = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            responseTime: time.toFixed(2)
        };
        
        logStream.write(JSON.stringify(log) + '\n');
        
        // Call original end
        originalEnd.apply(res, args);
    };
    
    next();
};
