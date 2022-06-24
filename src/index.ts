import { httpServer } from './http_server';
import { WebSocketServer } from 'ws';
import { cmdSwitch } from './cmds';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const socket = new WebSocketServer({ port: 8080 });

socket.on('connection', (ws: any) => {
	console.log('CONNECTED');
	let inProgress = false;

	ws.on('message', (rawData: any) => {
		const data = rawData.toString();

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
});

socket.on('close', (event: any) => {
	console.log(event.code);
});

process.on('SIGINT', () => {
	socket.close();
	process.exit();
});
