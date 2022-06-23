import robot from 'robotjs';
import Jimp from 'jimp';

export const getSnippet = (mouseCoord, ws) => {
	const img = robot.screen.capture(mouseCoord.x, mouseCoord.y, 200, 200); //raw buffer with pixels;
	let data = [];
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
			if (err) {
				console.log(err);
			} else {
				const base64Img = await image.getBase64Async(Jimp.MIME_PNG);
				ws.send(`prnt_scrn ${base64Img.substring(22)}`);
			}
		},
	);
};
