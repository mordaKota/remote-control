import robot from 'robotjs';
import Jimp from 'jimp';
import { WebSocket } from 'ws';
import { IMouseCoordinates } from './mouse-control';

export const getSnippet = (mouseCoord: IMouseCoordinates, ws: WebSocket): void => {
	const img: robot.Bitmap = robot.screen.capture(mouseCoord.x, mouseCoord.y, 200, 200); //raw buffer with pixels;
	const data: Array<number> = [];
	for (let i = 0; i < img.image.length; i += 4) {
		data.push(img.image[i + 2], img.image[i + 1], img.image[i], img.image[i + 3]);
	}

	new Jimp(
		{
			data: new Uint8Array(data),
			width: img.width,
			height: img.height,
		},
		async (err: Error | null, image: Jimp): Promise<void> => {
			if (err) {
				console.log(err);
			} else {
				const base64Img: string = await image.getBase64Async(Jimp.MIME_PNG);
				ws.send(`prnt_scrn ${base64Img.substring(22)}`);
			}
		},
	);
};
