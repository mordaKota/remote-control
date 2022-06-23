import Jimp from 'jimp';
import { httpServer } from './http_server/index.js';
import robot from 'robotjs';
import { WebSocketServer } from 'ws';

const HTTP_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const socket = new WebSocketServer({ port: 8080 });

const getSnippet = (mouseCoord, ws) => {
	const img = robot.screen.capture(mouseCoord.x, mouseCoord.y, 200, 200); //raw buffer with pixels;
	let data = [];
	const bitmap = img.image;
	for (let i = 0; i < img.image.length; i += 4) {
		data.push(img.image[i + 2], img.image[i + 1], img.image[i], img.image[i + 3]);
	}
	new Jimp(
		{
			data: new Uint8Array(data),
			width: img.width,
			height: img.height,
		},
		async (err, image) => {
			//image.write('./ttt.png');

			if (err) {
				console.log(err);
			} else {
				const base64Img = await image.getBase64Async(Jimp.MIME_PNG);
				console.log(base64Img);
				ws.send(`prnt_scrn ${base64Img.substring(22)}`);

			}
		},
	);
};

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
		case 'draw_circle':
			// const begin = robot.getMousePos();
			const radius = params[0];
			const begin = {
				x: mouseCoord.x - radius,
				y: mouseCoord.y,
			};

			robot.mouseToggle('down');
			for (let i = 0; i <= Math.PI * 2; i += 0.02) {
				const x = begin.x + radius * Math.cos(i);
				const y = begin.y + radius * Math.sin(i);
				robot.dragMouse(x, y);
			}
			robot.mouseToggle('up');
			break;
		case 'draw_square':
			mouseCoord = robot.getMousePos();
			robot.mouseToggle('down');
			robot.moveMouseSmooth(mouseCoord.x, mouseCoord.y - params[0]); //up
			mouseCoord = robot.getMousePos();
			robot.moveMouseSmooth(mouseCoord.x + params[0], mouseCoord.y); //right
			mouseCoord = robot.getMousePos();
			robot.moveMouseSmooth(mouseCoord.x, mouseCoord.y + params[0]); //down
			mouseCoord = robot.getMousePos();
			robot.moveMouseSmooth(mouseCoord.x - params[0], mouseCoord.y); //left
			robot.mouseToggle('up');
			break;
		case 'draw_rectangle':
			mouseCoord = robot.getMousePos();
			robot.mouseToggle('down');
			robot.moveMouseSmooth(mouseCoord.x, mouseCoord.y - params[0]); //up
			mouseCoord = robot.getMousePos();
			robot.moveMouseSmooth(mouseCoord.x + params[1], mouseCoord.y); //right
			mouseCoord = robot.getMousePos();
			robot.moveMouseSmooth(mouseCoord.x, mouseCoord.y + params[0]); //down
			mouseCoord = robot.getMousePos();
			robot.moveMouseSmooth(mouseCoord.x - params[1], mouseCoord.y); //left
			robot.mouseToggle('up');
			break;
		case 'prnt_scrn':
			mouseCoord = robot.getMousePos();
			getSnippet(mouseCoord, ws);
			break;
	}
};

socket.on('connection', (ws) => {
	console.log('CONNECTED');
	let inProgress = false;

	ws.on('message', (rawData) => {
		const data = rawData.toString();
		console.log('received: ', data);

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

// socket.on('close', (event) => {
// 	console.log(event.code);
// });

process.on('SIGINT', () => {
	socket.close();
	process.exit();
});
