import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const performanceLogPath = path.join(__dirname, '..', 'logs', 'performance', 'performance.log');

// Create a readable stream
const fileStream = fs.createReadStream(performanceLogPath);

const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
});

const stats = {
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    averageResponseTime: 0,
    responseTimeByEndpoint: {},
    cacheHitRateByEndpoint: {}
};

// Process each line
rl.on('line', (line) => {
    try {
        const log = JSON.parse(line);
        stats.totalRequests++;
        
        // Update cache stats
        if (log.cache === 'HIT') stats.cacheHits++;
        else stats.cacheMisses++;
        
        // Update response time stats
        const responseTime = parseFloat(log.responseTime);
        stats.averageResponseTime = 
            (stats.averageResponseTime * (stats.totalRequests - 1) + responseTime) / stats.totalRequests;
        
        // Update endpoint stats
        if (!stats.responseTimeByEndpoint[log.url]) {
            stats.responseTimeByEndpoint[log.url] = {
                count: 0,
                totalTime: 0,
                cacheHits: 0,
                total: 0
            };
        }
        
        const endpointStats = stats.responseTimeByEndpoint[log.url];
        endpointStats.count++;
        endpointStats.totalTime += responseTime;
        if (log.cache === 'HIT') endpointStats.cacheHits++;
        endpointStats.total++;
    } catch (error) {
        console.error('Error processing log line:', error);
    }
});

// Print results when finished
rl.on('close', () => {
    console.log('\n=== Performance Report ===\n');
    
    console.log('Overall Statistics:');
    console.log('-----------------');
    console.log(`Total Requests: ${stats.totalRequests}`);
    console.log(`Cache Hit Rate: ${((stats.cacheHits / stats.totalRequests) * 100).toFixed(2)}%`);
    console.log(`Average Response Time: ${stats.averageResponseTime.toFixed(2)}ms`);
    
    console.log('\nEndpoint Statistics:');
    console.log('------------------');
    Object.entries(stats.responseTimeByEndpoint).forEach(([endpoint, endpointStats]) => {
        console.log(`\nEndpoint: ${endpoint}`);
        console.log(`  Requests: ${endpointStats.count}`);
        console.log(`  Avg Response Time: ${(endpointStats.totalTime / endpointStats.count).toFixed(2)}ms`);
        console.log(`  Cache Hit Rate: ${((endpointStats.cacheHits / endpointStats.total) * 100).toFixed(2)}%`);
    });
});
