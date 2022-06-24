import robot from 'robotjs';
import { moveMouseDown, moveMouseLeft, moveMouseRight, moveMouseUp, setMousePosition } from './mouse-control';
import { drawCircle, drawQuadri } from './drawing';
import { getSnippet } from './screenshot';

export const cmdSwitch = (input: any, ws: any) => {
	let params = input.split(' ');
	const cmd = params.shift();
	params = params.map((x: string) => parseInt(x));
	let mouseCoord = robot.getMousePos();

	switch (cmd) {
		case 'mouse_position':
			setMousePosition(ws);
			break;
		case 'mouse_up':
			moveMouseUp(ws, params[0]);
			break;
		case 'mouse_down':
			moveMouseDown(ws, params[0]);
			break;
		case 'mouse_left':
			moveMouseLeft(ws, params[0]);
			break;
		case 'mouse_right':
			moveMouseRight(ws, params[0]);
			break;
		case 'draw_circle':
			drawCircle(ws, params[0]);
			break;
		case 'draw_square':
			drawQuadri(ws, cmd, params);
			break;
		case 'draw_rectangle':
			drawQuadri(ws, cmd, params);
			break;
		case 'prnt_scrn':
			mouseCoord = robot.getMousePos();
			getSnippet(mouseCoord, ws);
			break;
	}
};
