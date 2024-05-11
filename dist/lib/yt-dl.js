import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';
export default async (url, quality) => {
    try {
        const id = await ytdl.getURLVideoID(url);
        const info = await ytdl.getInfo(id);
        // Find the format with the desired quality
        const format = info.formats.find(format => format.qualityLabel === quality);
        if (!format) {
            return { statusCode: 404, message: `Desired quality ${quality} not found for the video` };
        }
        const fileName = path.basename(url).replace(/\s+/g, '_');
        const mimeType = format.mimeType;
        // Download the video with the selected format
        const stream = ytdl.downloadFromInfo(info, { format: format });
        // Create a writable stream to save the video
        const fileStream = fs.createWriteStream(`${fileName}.${format.container}`);
        // Pipe the video stream to the file stream
        stream.pipe(fileStream);
        // Wait for the download to complete
        await new Promise((resolve, reject) => {
            fileStream.on('finish', resolve);
            fileStream.on('error', reject);
        });
        console.log('done downloading');
        return { statusCode: 200, message: `Video saved as ${fileName}.${format.container}`, name: fileName + '.' + format.container, mimeType };
    }
    catch (error) {
        console.error('Error:', error);
        return { statusCode: 500, message: 'Error occurred while downloading the video' };
    }
};
//# sourceMappingURL=yt-dl.js.map