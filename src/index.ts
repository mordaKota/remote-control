import { httpServer } from './http_server';
import { WebSocket, WebSocketServer} from 'ws';
import { cmdSwitch } from './cmds';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const socket = new WebSocketServer({ port: 8080 });

socket.on('connection', (ws: WebSocket) => {
	console.log('CONNECTED');
	let inProgress = false;

	ws.on('message', (rawData: any) => {
		const data: string = rawData.toString();

		if (inProgress) {
			console.log('wait');
			return;
		}
		inProgress = true;

		try {
			cmdSwitch(data, ws);
		} catch (e) {
			console.log(e);
		} finally {
			inProgress = false;
		}
	});

	ws.on('close', () => {
		console.log('DISCONNECTED');
	});
});

process.on('SIGINT', () => {
	console.log('GRACEFULLY STOP');

	socket.clients.forEach((ws) => {
		ws.close();
	});

	setTimeout(() => {
		process.exit();
	}, 1000)

});
