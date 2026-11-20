import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { app } from "./utils/app.js";
import { hocuspocus } from "./utils/hocuspocus.js"
import { io } from "./utils/socket.js";

const PORT = Number(process.env.PORT) || 8282;

// Render exposes a single port, so Express, Socket.io and Hocuspocus share one HTTP server
const httpServer = createServer(app);

io.attach(httpServer);

const wss = new WebSocketServer({ noServer: true });

httpServer.on('upgrade', (request, socket, head) => {
    const { pathname } = new URL(request.url ?? '/', 'http://localhost');

    if (pathname === '/collab') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            // An unhandled ws error would crash the process
            ws.on('error', (error) => console.error('Collab websocket error:', error));
            hocuspocus.handleConnection(ws, request);
        });
    }
    // Socket.io handles its own upgrades on /socket.io/
    else if (!pathname.startsWith('/socket.io/')) {
        socket.destroy();
    }
})

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend is online on port ${PORT}`)
})

// Render sends SIGTERM on every deploy: flush pending document saves before exiting
let shuttingDown = false;

async function shutdown() {
    if (shuttingDown) return;
    shuttingDown = true;

    console.log('Shutting down')

    // Also closes httpServer, so no new connections come in
    io.close();

    // Closing the last connection to a document stores it immediately
    hocuspocus.closeConnections();

    const deadline = Date.now() + 10000;
    while (hocuspocus.getDocumentsCount() > 0 && Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, 100));
    }

    process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
