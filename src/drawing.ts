import robot from 'robotjs';
import { WebSocket } from 'ws';
import { IMouseCoordinates } from './mouse-control';

export const drawCircle = (ws: WebSocket, radius: number): void => {
	const mouseCoord: IMouseCoordinates = robot.getMousePos();
	console.log(`Received from front: cmd - draw_circle, params - ${radius}, coords - ${mouseCoord.x}, ${mouseCoord.y}`);
	const startMouseCoords: IMouseCoordinates = {
		x: mouseCoord.x - radius,
		y: mouseCoord.y,
	};
	robot.mouseToggle('down');
	for (let i = 0; i <= Math.PI * 2; i += 0.02) {
		const x: number = startMouseCoords.x + radius * Math.cos(i);
		const y: number = startMouseCoords.y + radius * Math.sin(i);
		robot.dragMouse(x, y);
	}
	robot.mouseToggle('up');
	ws.send(`draw_circle`);
};

export const drawQuadri = (ws: WebSocket, cmd: string, params: number[]) => {
	let mouseCoord: IMouseCoordinates = robot.getMousePos();
	console.log(`Received from front: cmd - ${cmd}, params - ${params}, coords - ${mouseCoord.x}, ${mouseCoord.y}`);
	if (params.length < 2) {
		params[1] = params[0];
	}
	robot.mouseToggle('down');
	robot.moveMouseSmooth(mouseCoord.x, mouseCoord.y - params[0]); //up
	mouseCoord = robot.getMousePos();
	robot.moveMouseSmooth(mouseCoord.x + params[1], mouseCoord.y); //right
	mouseCoord = robot.getMousePos();
	robot.moveMouseSmooth(mouseCoord.x, mouseCoord.y + params[0]); //down
	mouseCoord = robot.getMousePos();
	robot.moveMouseSmooth(mouseCoord.x - params[1], mouseCoord.y); //left
	robot.mouseToggle('up');
	params.length < 2 ? ws.send(`draw_square`) : ws.send(`draw_rectangle`);
};
