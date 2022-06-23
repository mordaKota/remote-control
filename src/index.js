import Jimp from 'jimp';
import { httpServer } from './http_server/index.js';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const socket = new WebSocketServer({ port: 8080 });

const cmdSwitch = (input, ws) => {
	let params = input.split(' ');
	const cmd = params.shift();
	params = params.map((x) => parseInt(x));
	console.log(cmd, params); //mouse_up [ '10' ]
	let mouseCoord = robot.getMousePos();
	switch (cmd) {
		case 'mouse_position':
			console.log(mouseCoord); //{ x: 842, y: 353 }
			ws.send(`mouse_position ${mouseCoord.x},${mouseCoord.y}`);
			break;
		case 'mouse_up':
			robot.moveMouse(mouseCoord.x, mouseCoord.y - params[0]);
			mouseCoord = robot.getMousePos();
			ws.send(`mouse_position ${mouseCoord.x},${mouseCoord.y}`);
			break;
		case 'mouse_down':
			robot.moveMouse(mouseCoord.x, mouseCoord.y + params[0]);
			mouseCoord = robot.getMousePos();
			ws.send(`mouse_position ${mouseCoord.x},${mouseCoord.y}`);
			break;
		case 'mouse_left':
			robot.moveMouse(mouseCoord.x - params[0], mouseCoord.y);
			mouseCoord = robot.getMousePos();
			ws.send(`mouse_position ${mouseCoord.x},${mouseCoord.y}`);
			break;
		case 'mouse_right':
			robot.moveMouse(mouseCoord.x + params[0], mouseCoord.y);
			mouseCoord = robot.getMousePos();
			ws.send(`mouse_position ${mouseCoord.x},${mouseCoord.y}`);
			break;
	}
};

socket.on('connection', (ws) => {
	console.log({ ws });
	ws.on('message', (rawData) => {
		const data = rawData.toString();
		console.log('received: ', data);
		cmdSwitch(data, ws);
	});
});

// socket.on('close', (event) => {
// 	console.log(event.code);
// });

process.on('SIGINT', () => {
	socket.close();
	process.exit();
});
