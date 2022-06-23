import robot from 'robotjs';

export const setMousePosition = (ws) => {
	const mouseCoord = robot.getMousePos();
	console.log(`Received from front: mouse_position ${mouseCoord.x}, ${mouseCoord.y}`); //{ x: 842, y: 353 }
	ws.send(`mouse_position ${mouseCoord.x},${mouseCoord.y}`);
};

export const moveMouseUp = (ws, offset) => {
	const mouseCoord = robot.getMousePos();
	console.log(`Received from front: cmd - mouse_up, params - ${offset}, coords - ${mouseCoord.x}, ${mouseCoord.y}`);
	robot.moveMouse(mouseCoord.x, mouseCoord.y - offset);
	ws.send(`mouse_up`);
};

export const moveMouseDown = (ws, offset) => {
	const mouseCoord = robot.getMousePos();
	console.log(`Received from front: cmd - mouse_down, params - ${offset}, coords - ${mouseCoord.x}, ${mouseCoord.y}`);
	robot.moveMouse(mouseCoord.x, mouseCoord.y + offset);
	ws.send(`mouse_down`);
};

export const moveMouseLeft = (ws, offset) => {
	const mouseCoord = robot.getMousePos();
	console.log(`Received from front: cmd - mouse_left, params - ${offset}, coords - ${mouseCoord.x}, ${mouseCoord.y}`);
	robot.moveMouse(mouseCoord.x - offset, mouseCoord.y);
	ws.send(`mouse_left`);
};

export const moveMouseRight = (ws, offset) => {
	const mouseCoord = robot.getMousePos();
	console.log(`Received from front: cmd - mouse_right, params - ${offset}, coords - ${mouseCoord.x}, ${mouseCoord.y}`);
	robot.moveMouse(mouseCoord.x + offset, mouseCoord.y);
	ws.send(`mouse_right`);
};
