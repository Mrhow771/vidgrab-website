const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Add local bin/ directory to PATH on Render/Linux
if (process.env.RENDER || process.platform !== 'win32') {
    const binPath = path.join(__dirname, 'bin');
    process.env.PATH = `${binPath}:${process.env.PATH}`;
    console.log(`Updated environment PATH with local bin directory: ${process.env.PATH}`);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ensure downloads directory exists
const DOWNLOADS_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR);
}
app.use('/downloads', express.static(DOWNLOADS_DIR));

// Database Setup
const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            wallet_address TEXT,
            plan_type TEXT,
            amount TEXT,
            status TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        db.run(`CREATE TABLE IF NOT EXISTS keys (
            key TEXT PRIMARY KEY,
            order_id TEXT,
            plan_type TEXT,
            status TEXT,
            device_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

const ytdlpPath = fs.existsSync(path.join(__dirname, 'bin', 'yt-dlp')) 
    ? path.join(__dirname, 'bin', 'yt-dlp') 
    : 'yt-dlp';

// Helper to identify video platform
function getUrlPlatform(url) {
    const lower = url.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
    if (lower.includes('instagram.com')) return 'instagram';
    if (lower.includes('tiktok.com')) return 'tiktok';
    if (lower.includes('xiaohongshu.com') || lower.includes('xhslink.com')) return 'rednote';
    return 'default';
}

// Helper to scan for all cookie files for rotation
function getCookieFiles(platform) {
    const files = [];
    if (platform === 'default') return files;
    
    try {
        const dirFiles = fs.readdirSync(__dirname);
        dirFiles.forEach(f => {
            if (f.startsWith(`${platform}_cookies_`) && f.endsWith('.txt')) {
                files.push(path.join(__dirname, f));
            }
        });
    } catch (e) {
        console.error('Error scanning cookies directory:', e);
    }
    
    files.sort();
    
    // Fallback to default single cookie file
    const defaultFile = path.join(__dirname, `${platform}_cookies.txt`);
    if (files.length === 0 && fs.existsSync(defaultFile)) {
        files.push(defaultFile);
    }
    
    return files;
}

// Check if failure is due to cookie block/expiry/rate-limit
function shouldRotateCookie(stderr) {
    const lower = stderr.toLowerCase();
    return lower.includes("sign in") || 
           lower.includes("confirm you are not a bot") || 
           lower.includes("rate limit") || 
           lower.includes("too many requests") || 
           lower.includes("429") || 
           lower.includes("login") || 
           lower.includes("cookie") || 
           lower.includes("403");
}

// ==========================================
// FEATURE 1: VIDEO DOWNLOADER
// ==========================================
app.post('/api/info', (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Fetching info for: ${url}`);
    
    const runInfoQuery = (cookieIndex) => {
        const platform = getUrlPlatform(url);
        const cookieFiles = getCookieFiles(platform);
        
        const ytdlpArgs = ['-J'];
        
        let activeCookieFile = '';
        if (cookieFiles.length > 0 && cookieIndex < cookieFiles.length) {
            activeCookieFile = cookieFiles[cookieIndex];
            ytdlpArgs.push('--cookies', activeCookieFile);
            console.log(`Trying info query with cookie [${cookieIndex + 1}/${cookieFiles.length}]: ${path.basename(activeCookieFile)}`);
        } else {
            console.log(`No active cookies configured/left for ${platform}.`);
        }
        
        ytdlpArgs.push('--no-warnings', '--no-playlist', '--no-check-certificates', '--socket-timeout', '15', url);
        
        const ytdlp = spawn(ytdlpPath, ytdlpArgs);
        
        let stdout = '';
        let stderr = '';
        
        ytdlp.stdout.on('data', (data) => { stdout += data.toString(); });
        ytdlp.stderr.on('data', (data) => { stderr += data.toString(); });
        
        ytdlp.on('close', (code) => {
            if (code !== 0) {
                console.error(`yt-dlp info err (cookieIndex=${cookieIndex}): ${stderr}`);
                
                // Rotate cookie if failed and next is available
                if (activeCookieFile && shouldRotateCookie(stderr) && (cookieIndex + 1) < cookieFiles.length) {
                    console.log(`Cookie failed or rate-limited. Rotating to next cookie account...`);
                    return runInfoQuery(cookieIndex + 1);
                }
                
                // Return clean, informative message
                const isBotBlock = stderr.includes("confirm you are not a bot") || stderr.includes("Sign in") || stderr.includes("403") || stderr.includes("429");
                const friendlyErr = isBotBlock 
                    ? `Failed to fetch video information: Rate-limit or bot detection occurred. Please manually refresh/replace the cookie files (${platform}_cookies.txt or ${platform}_cookies_1.txt) on the server.`
                    : `Failed to fetch video information: ${stderr.trim() || 'It might be private, restricted, or cookies expired.'}`;
                return res.status(500).json({ error: friendlyErr });
            }

            try {
                const info = JSON.parse(stdout);
                const qualitiesMap = new Map();
                
                if (info.formats) {
                    info.formats.forEach(f => {
                        if (f.vcodec !== 'none' && f.height) {
                            const h = f.height;
                            const fps = f.fps ? Math.round(f.fps) : 0;
                            
                            if ([480, 720, 1080, 1440, 2160].includes(h)) {
                                let label = `${h}p`;
                                if (h === 1440) label = '2K';
                                if (h === 2160) label = '4K';
                                if (fps && fps >= 50) label += ` ${fps}fps`;
                                
                                const key = `${h}_${fps >= 50 ? fps : 30}`;
                                qualitiesMap.set(key, { height: h, label: label, fps: fps, order: h + (fps || 0) });
                            }
                        }
                    });
                }
                
                let qualities = Array.from(qualitiesMap.values()).sort((a, b) => b.order - a.order);
                if (qualities.length === 0) {
                    qualities = [{ height: 'best', label: 'Best Quality', fps: '', order: 0 }];
                }

                res.json({
                    title: info.title || 'Video',
                    thumbnail: info.thumbnail || '',
                    duration: info.duration || 0,
                    qualities: qualities
                });
                
            } catch (e) {
                console.error("JSON parse error", e);
                res.status(500).json({ error: 'Failed to parse video data.' });
            }
        });
    };
    
    runInfoQuery(0);
});

app.post('/api/download', (req, res) => {
    const { url, height, fps } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Getting direct URL for: ${url} (Quality: ${height || 'best'})`);
    
    let fmtString;
    if (height && height !== 'best') {
        fmtString = `bestvideo[height<=${height}][vcodec^=avc1]`;
        if (fps && fps >= 50) {
            fmtString += `[fps<=${fps}]`;
        }
        fmtString += `+bestaudio[acodec^=mp4a]/bestvideo[height<=${height}]+bestaudio/best`;
    } else {
        fmtString = `bestvideo[vcodec^=avc1]+bestaudio[acodec^=mp4a]/bestvideo+bestaudio/best`;
    }

    const runDownloadQuery = (cookieIndex) => {
        const platform = getUrlPlatform(url);
        const cookieFiles = getCookieFiles(platform);
        
        const ytdlpArgs = ['-f', fmtString, '-g'];
        
        let activeCookieFile = '';
        if (cookieFiles.length > 0 && cookieIndex < cookieFiles.length) {
            activeCookieFile = cookieFiles[cookieIndex];
            ytdlpArgs.push('--cookies', activeCookieFile);
            console.log(`Trying download query with cookie [${cookieIndex + 1}/${cookieFiles.length}]: ${path.basename(activeCookieFile)}`);
        }
        
        ytdlpArgs.push('--no-warnings', '--no-playlist', '--no-check-certificates', '--socket-timeout', '15', url);
        
        const ytdlp = spawn(ytdlpPath, ytdlpArgs);

        let stdout = '';
        let stderr = '';

        ytdlp.stdout.on('data', (data) => { stdout += data.toString(); });
        ytdlp.stderr.on('data', (data) => { stderr += data.toString(); });

        ytdlp.on('close', (code) => {
            if (code !== 0) {
                console.error(`yt-dlp direct URL err (cookieIndex=${cookieIndex}): ${stderr}`);
                
                // Try next cookie in pool if failed
                if (activeCookieFile && shouldRotateCookie(stderr) && (cookieIndex + 1) < cookieFiles.length) {
                    console.log(`Cookie failed. Rotating to next cookie account...`);
                    return runDownloadQuery(cookieIndex + 1);
                }
                
                // Fallback to simple 'best' format
                const fallbackArgs = ['-f', 'best', '-g'];
                if (activeCookieFile) fallbackArgs.push('--cookies', activeCookieFile);
                fallbackArgs.push('--no-warnings', '--no-playlist', '--no-check-certificates', url);
                
                const fallback = spawn(ytdlpPath, fallbackArgs);
                let fbOut = '';
                let fbErr = '';
                fallback.stdout.on('data', (d) => { fbOut += d.toString(); });
                fallback.stderr.on('data', (d) => { fbErr += d.toString(); });
                fallback.on('close', (fbCode) => {
                    if (fbCode === 0 && fbOut.trim()) {
                        const directUrl = fbOut.trim().split('\n')[0];
                        console.log(`Fallback direct URL obtained.`);
                        return res.json({ directUrl });
                    }
                    console.error(`Fallback also failed: ${fbErr}`);
                    return res.status(500).json({ error: 'Failed to get download link. The video cookies might be expired or restricted.' });
                });
                return;
            }

            const urls = stdout.trim().split('\n').filter(u => u.startsWith('http'));
            
            if (urls.length === 0) {
                return res.status(500).json({ error: 'Could not extract download link.' });
            }

            // Single stream format
            if (urls.length === 1) {
                console.log(`Direct URL obtained (single stream).`);
                return res.json({ directUrl: urls[0] });
            }

            // Multiple streams (video + audio separately) - merge needed
            console.log(`Got ${urls.length} streams, downloading and merging on server (cookieIndex=${cookieIndex})...`);
            const filename = `video_${Date.now()}.mp4`;
            const filepath = path.join(DOWNLOADS_DIR, filename);
            
            const mergeArgs = ['-f', fmtString, '--merge-output-format', 'mp4'];
            if (activeCookieFile) mergeArgs.push('--cookies', activeCookieFile);
            mergeArgs.push('--no-warnings', '--no-playlist', '--no-check-certificates', '-o', filepath, url);
            
            const mergeProc = spawn(ytdlpPath, mergeArgs);

            mergeProc.stderr.on('data', (data) => {
                console.error(`yt-dlp merge err: ${data}`);
            });

            mergeProc.on('close', (mergeCode) => {
                if (mergeCode === 0 && fs.existsSync(filepath)) {
                    console.log(`Merge download complete: ${filepath}`);
                    res.download(filepath, 'VidGrab_Video.mp4', (err) => {
                        if (err) console.error('Error sending file:', err);
                        try { fs.unlinkSync(filepath); } catch (e) {}
                    });
                } else {
                    const fb2Args = ['-f', 'best', '-g'];
                    if (activeCookieFile) fb2Args.push('--cookies', activeCookieFile);
                    fb2Args.push('--no-warnings', '--no-playlist', url);
                    
                    const fb2 = spawn(ytdlpPath, fb2Args);
                    let fb2Out = '';
                    fb2.stdout.on('data', (d) => { fb2Out += d.toString(); });
                    fb2.on('close', (fb2Code) => {
                        if (fb2Code === 0 && fb2Out.trim()) {
                            return res.json({ directUrl: fb2Out.trim().split('\n')[0] });
                        }
                        res.status(500).json({ error: 'Failed to download video.' });
                    });
                }
            });
        });
    };

    runDownloadQuery(0);
});

// ==========================================
// FEATURE 2: PAYMENT SYSTEM (ORDERS)
// ==========================================
app.post('/api/orders', (req, res) => {
    const { wallet_address, plan_type, amount } = req.body;
    const orderId = uuidv4();
    
    db.run(
        `INSERT INTO orders (id, wallet_address, plan_type, amount, status) VALUES (?, ?, ?, ?, 'pending')`,
        [orderId, wallet_address, plan_type, amount],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, order_id: orderId, message: "Order created successfully. Pending verification." });
        }
    );
});

app.get('/api/orders', (req, res) => {
    db.all(`SELECT * FROM orders ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;
    db.get(`SELECT * FROM orders WHERE id = ?`, [orderId], (err, order) => {
        if (err || !order) return res.status(404).json({ error: 'Order not found' });
        
        if (order.status === 'approved') {
            db.get(`SELECT key FROM keys WHERE order_id = ?`, [orderId], (err, keyRow) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ status: 'approved', key: keyRow ? keyRow.key : null });
            });
        } else {
            res.json({ status: order.status });
        }
    });
});

app.post('/api/orders/approve/:id', (req, res) => {
    const orderId = req.params.id;
    
    db.get(`SELECT * FROM orders WHERE id = ?`, [orderId], (err, order) => {
        if (err || !order) return res.status(404).json({ error: 'Order not found' });
        
        if (order.status === 'approved') {
            return res.status(400).json({ error: 'Order already approved' });
        }

        // Generate a License Key
        const licenseKey = 'VG-' + uuidv4().split('-')[0].toUpperCase() + '-' + uuidv4().split('-')[1].toUpperCase();

        db.serialize(() => {
            db.run(`UPDATE orders SET status = 'approved' WHERE id = ?`, [orderId]);
            db.run(
                `INSERT INTO keys (key, order_id, plan_type, status) VALUES (?, ?, ?, 'active')`,
                [licenseKey, orderId, order.plan_type],
                (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ success: true, key: licenseKey, message: 'Order approved and key generated.' });
                }
            );
        });
    });
});

// ==========================================
// FEATURE 3: LICENSE KEY VERIFICATION
// ==========================================
app.post('/api/verify-key', (req, res) => {
    const { key, device_id } = req.body;
    if (!key) return res.status(400).json({ error: 'Key is required' });

    db.get(`SELECT * FROM keys WHERE key = ?`, [key], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (!row) {
            return res.json({ valid: false, message: 'Invalid License Key' });
        }

        if (row.status !== 'active') {
            return res.json({ valid: false, message: 'License Key is not active' });
        }

        // Device lock logic
        if (!row.device_id && device_id) {
            db.run(`UPDATE keys SET device_id = ? WHERE key = ?`, [device_id, key]);
            return res.json({ valid: true, plan: row.plan_type, message: 'Key bound to device and activated.' });
        } else if (row.device_id && row.device_id !== device_id) {
            return res.json({ 
                valid: false, 
                reason: "already_activated_elsewhere", 
                message: "This license key is already activated on another device. Please contact support if you believe this is an error." 
            });
        }

        res.json({ valid: true, plan: row.plan_type, message: 'Premium Activated' });
    });
});

app.get('/api/keys', (req, res) => {
    db.all(`SELECT * FROM keys ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/keys/reset/:key', (req, res) => {
    const key = req.params.key;
    db.run(`UPDATE keys SET device_id = NULL WHERE key = ?`, [key], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: `Device binding for key ${key} has been reset.` });
    });
});

app.get('/api/latest-version', (req, res) => {
    const versionPath = path.join(__dirname, 'version.json');
    if (fs.existsSync(versionPath)) {
        try {
            const data = fs.readFileSync(versionPath, 'utf8');
            res.json(JSON.parse(data));
        } catch (err) {
            res.status(500).json({ error: 'Failed to parse version info' });
        }
    } else {
        res.status(404).json({ error: 'Version info not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
