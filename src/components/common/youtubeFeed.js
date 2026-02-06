// components/YouTubeFeed.js
import React, { useEffect, useState } from 'react';
import './YouTubeFeed.css';
import { getYouTubeVideos, getLiveStream } from '../../services/youtubeService';

const YouTubeFeed = ({ channelId, apiKey }) => {
  const [videos, setVideos] = useState([]);
  const [liveStream, setLiveStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both live stream and regular videos
        const [liveData, videosData] = await Promise.all([
          getLiveStream(channelId, apiKey),
          getYouTubeVideos(channelId, apiKey)
        ]);
        
        setLiveStream(liveData);
        setVideos(videosData);
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        setError('Unable to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
    
    // Check for live stream every 2 minutes
    const interval = setInterval(async () => {
      try {
        const liveData = await getLiveStream(channelId, apiKey);
        setLiveStream(liveData);
      } catch (error) {
        console.error('Error checking live stream:', error);
      }
    }, 120000); // 2 minutes
    
    return () => clearInterval(interval);
  }, [channelId, apiKey]);

  const formatPublishedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="youtube-feed">
        <div className="youtube-header">
          <h2>🎥 Latest Videos</h2>
          <p className="section-subtitle">Watch our recent sermons and worship sessions</p>
        </div>
        <div className="video-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="video-card skeleton">
              <div className="skeleton-thumbnail"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-description"></div>
                <div className="skeleton-meta"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="youtube-feed">
        <div className="youtube-header">
          <h2>🎥 Latest Videos</h2>
          <p className="section-subtitle">Watch our recent sermons and worship sessions</p>
        </div>
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="youtube-feed">
        <div className="youtube-header">
          <h2>🎥 Latest Videos</h2>
          <p className="section-subtitle">Watch our recent sermons and worship sessions</p>
        </div>
        <div className="no-videos">
          <div className="no-videos-icon">📹</div>
          <p>No videos available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="youtube-feed">
      <div className="youtube-header">
        <h2>🎥 Latest Videos</h2>
        <p className="section-subtitle">Watch our recent sermons and worship sessions</p>
      </div>

      {/* Live Stream Section */}
      {liveStream ? (
        <div className="live-stream-section">
          <div className="live-stream-card">
            <div className="live-badge">
              <span className="live-dot"></span>
              LIVE NOW
            </div>
            <div className="live-content">
              <div className="live-icon">📡</div>
              <h3>{liveStream.title}</h3>
              <p>Experience worship with us in real-time</p>
              <a 
                href={`https://www.youtube.com/watch?v=${liveStream.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="watch-live-btn"
              >
                <span className="play-icon">▶</span>
                Watch Live Stream
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-live-stream">
          <div className="no-live-icon">📡</div>
          <p>No live stream at the moment</p>
          <span className="check-back-text">Check back during service times</span>
        </div>
      )}

      <div className="video-grid">
        {videos.map((video, index) => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="video-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="video-thumbnail-wrapper">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="video-thumbnail"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('thumbnail-error');
                }}
              />
              <div className="play-overlay">
                <div className="play-button">
                  <svg viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="video-duration">{video.duration || 'HD'}</div>
            </div>
            <div className="video-content">
              <h4 className="video-title">{video.title}</h4>
              {video.description && (
                <p className="video-description">{video.description}</p>
              )}
              <div className="video-meta">
                <span className="video-date">
                  {video.publishedAt ? formatPublishedDate(video.publishedAt) : 'Recent'}
                </span>
                <span className="view-count">
                  {video.viewCount ? `${video.viewCount} views` : 'Watch now'}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
      <div className="channel-link-wrapper">
        <a 
          href={`https://www.youtube.com/channel/${channelId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="channel-link"
        >
          <span className="channel-icon">▶️</span>
          Visit Our YouTube Channel
          <span className="arrow">→</span>
        </a>
      </div>
    </div>
  );
};

export default YouTubeFeed;
