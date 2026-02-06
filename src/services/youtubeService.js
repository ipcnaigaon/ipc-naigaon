// services/youtubeService.js
export const getYouTubeVideos = async (channelId, apiKey) => {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=5`;
  
  const response = await fetch(url);
  const data = await response.json();
  return data.items.map(item => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.medium.url,
    publishedAt: item.snippet.publishedAt
  }));
};

// Check if channel has an active live stream
export const getLiveStream = async (channelId, apiKey) => {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&eventType=live&type=video&maxResults=1`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const liveVideo = data.items[0];
      return {
        id: liveVideo.id.videoId,
        title: liveVideo.snippet.title,
        thumbnail: liveVideo.snippet.thumbnails.high.url,
        description: liveVideo.snippet.description,
        isLive: true
      };
    }
    return null;
  } catch (error) {
    console.error('Error checking live stream:', error);
    return null;
  }
};
