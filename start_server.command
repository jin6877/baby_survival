#!/bin/bash
cd "$(dirname "$0")/src"

# 이전 서버 종료 (4000 포트)
lsof -ti:4000 | xargs kill -9 2>/dev/null

echo "=============================="
echo "  Baby Survival Server"
echo "  http://localhost:4000"
echo "=============================="
echo ""

# Node.js 서버 실행
node -e "
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4000;
const MIME = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
    let filePath = '.' + (req.url === '/' ? '/index.html' : req.url);
    filePath = decodeURIComponent(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('Not Found');
            } else {
                res.writeHead(500);
                res.end('Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log('Server running at http://localhost:' + PORT);
    console.log('Press Ctrl+C to stop');
});
"
