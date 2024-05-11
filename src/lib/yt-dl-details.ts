import ytdl from 'ytdl-core';

export default async (url: string): Promise<any> => {
  try {
    const id = await ytdl.getURLVideoID(url);
    const info = await ytdl.getInfo(id);
    
    // Extract desired information from the video info object
    const videoInfo = {
      title: info.videoDetails.title,
      author: info.videoDetails.author.name,
      duration: info.videoDetails.lengthSeconds,
      viewCount: info.videoDetails.viewCount,
      availableQualities: info.formats.map(format => format.qualityLabel).filter(el=>el!=null),
      thumbnail: info.videoDetails.thumbnails,
      description: info.videoDetails.description,
    };

    return videoInfo;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};
