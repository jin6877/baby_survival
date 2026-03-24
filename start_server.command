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
const DATA_FILE = path.join(__dirname, '..', 'data', 'save.json');

// data 폴더 생성
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// JSON 읽기
function readData() {
    try {
        if (!fs.existsSync(DATA_FILE)) return { babies: [], activeId: null, nextId: 1 };
        const d = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        if (!d.nextId) d.nextId = (d.babies.length > 0 ? Math.max(...d.babies.map(b => b.id || 0)) + 1 : 1);
        return d;
    } catch (e) {
        return { babies: [], activeId: null };
    }
}

// JSON 쓰기
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

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

const ROUTES = {
    '/': 'index.html',
    '/register': 'register.html',
    '/select': 'select.html',
    '/game': 'game.html',
};

// POST body 읽기
function readBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try { resolve(JSON.parse(body)); }
            catch (e) { resolve({}); }
        });
    });
}

function jsonRes(res, data, status) {
    res.writeHead(status || 200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
    const url = req.url.split('?')[0];

    // === API 라우트 ===
    if (url.startsWith('/api/')) {

        // GET /api/babies — 전체 목록 (del_yn 필터)
        if (url === '/api/babies' && req.method === 'GET') {
            const data = readData();
            const filtered = { ...data, babies: data.babies.filter(b => b.del_yn !== 'Y') };
            return jsonRes(res, filtered);
        }

        // POST /api/babies — 아기 등록
        if (url === '/api/babies' && req.method === 'POST') {
            const body = await readBody(req);
            const data = readData();
            const baby = {
                id: data.nextId,
                name: body.name || '아기',
                babyType: body.babyType || 0,
                maxStage: 1,
                del_yn: 'N',
                createdAt: Date.now(),
            };
            data.nextId++;
            data.babies.push(baby);
            writeData(data);
            return jsonRes(res, baby, 201);
        }

        // DELETE /api/babies/:id — 아기 소프트 삭제 (del_yn)
        const deleteMatch = url.match(/^\/api\/babies\/(.+)$/);
        if (deleteMatch && req.method === 'DELETE') {
            const id = parseInt(deleteMatch[1]);
            const data = readData();
            const baby = data.babies.find(b => b.id === id);
            if (baby) {
                baby.del_yn = 'Y';
                if (data.activeId === id) data.activeId = null;
                writeData(data);
            }
            return jsonRes(res, { ok: true });
        }

        // PUT /api/active/:id — 활성 아기 설정
        const activeMatch = url.match(/^\/api\/active\/(.+)$/);
        if (activeMatch && req.method === 'PUT') {
            const id = parseInt(activeMatch[1]);
            const data = readData();
            data.activeId = id;
            writeData(data);
            return jsonRes(res, { ok: true });
        }

        // PUT /api/stage/:stageNumber — 스테이지 진행 저장
        const stageMatch = url.match(/^\/api\/stage\/(\d+)$/);
        if (stageMatch && req.method === 'PUT') {
            const stageNumber = parseInt(stageMatch[1]);
            const data = readData();
            if (data.activeId) {
                const baby = data.babies.find(b => b.id === data.activeId && b.del_yn !== 'Y');
                if (baby && stageNumber > (baby.maxStage || 1)) {
                    baby.maxStage = stageNumber;
                    writeData(data);
                }
            }
            return jsonRes(res, { ok: true });
        }

        // PUT /api/stats — 영구 스탯 저장 (성장, 드롭스탯, 킬수)
        if (url === '/api/stats' && req.method === 'PUT') {
            const body = await readBody(req);
            const data = readData();
            if (data.activeId) {
                const baby = data.babies.find(b => b.id === data.activeId && b.del_yn !== 'Y');
                if (baby) {
                    baby.stats = body;
                    writeData(data);
                }
            }
            return jsonRes(res, { ok: true });
        }

        // GET /api/active — 현재 활성 아기
        if (url === '/api/active' && req.method === 'GET') {
            const data = readData();
            if (!data.activeId) return jsonRes(res, null);
            const baby = data.babies.find(b => b.id === data.activeId && b.del_yn !== 'Y');
            return jsonRes(res, baby || null);
        }

        return jsonRes(res, { error: 'Not Found' }, 404);
    }

    // === 정적 파일 / 페이지 라우트 ===
    let filePath;
    if (ROUTES[url]) {
        filePath = './' + ROUTES[url];
    } else {
        filePath = '.' + url;
    }

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
    console.log('Data file: ' + DATA_FILE);
    console.log('Press Ctrl+C to stop');
});
"
