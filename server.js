// Servidor proxy intermediário para Sublimax
// Deploy: Railway, Render, ou Heroku (GRÁTIS)

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET_API = 'https://sublimax01.lovable.app';

// Configurar CORS para aceitar requisições de qualquer origem
app.use(cors({
    origin: '*',
    credentials: true
}));

// Middleware para logs
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Middleware para converter "password" → "senha" no body
app.use(express.json());
app.use((req, res, next) => {
    if (req.body && req.body.password) {
        console.log('  ✓ Convertendo "password" → "senha"');
        req.body.senha = req.body.password;
        delete req.body.password;
    }
    next();
});

// Proxy para a API do Lovable
app.use('/api/public', createProxyMiddleware({
    target: TARGET_API,
    changeOrigin: true,
    pathRewrite: {
        '^/api/public': '/api/public'
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`  → ${TARGET_API}${req.url}`);
        
        // Re-serializar o body modificado
        if (req.body) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`  ← ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
        console.error('  ✗ ERRO:', err.message);
        res.status(502).json({ error: 'Bad Gateway', message: err.message });
    }
}));

// Rota raiz para redirecionamentos automáticos
app.use('/', (req, res, next) => {
    const path = req.path;
    
    // Redirecionar automaticamente para /api/public
    if (!path.startsWith('/api/public')) {
        let newPath = '/api/public';
        
        if (path.includes('/login') || path.includes('/auth')) {
            newPath += '/auth/login';
        } else if (path.includes('/register')) {
            newPath += '/auth/register';
        } else if (path.includes('/validate')) {
            newPath += '/auth/validate';
        } else if (path.includes('/usage')) {
            newPath += path.substring(path.indexOf('/usage'));
        } else {
            newPath += path;
        }
        
        req.url = newPath;
        return app.handle(req, res);
    }
    
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║   SUBLIMAX PROXY CLOUD                        ║');
    console.log('╚════════════════════════════════════════════════╝\n');
    console.log(`✓ Servidor rodando na porta: ${PORT}`);
    console.log(`✓ Redirecionando para: ${TARGET_API}`);
    console.log(`✓ Health check: http://localhost:${PORT}/health\n`);
    console.log('Aguardando requisições...\n');
});
