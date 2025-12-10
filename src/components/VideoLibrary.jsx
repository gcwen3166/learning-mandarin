import React from 'react';

function VideoLibrary() {
  const videos = [
    { id: 1, title: "Lesson 1", url: "https://www.youtube.com/embed/9DpI-vfirkY" },
    { id: 2, title: "Lesson 2", url: "https://www.youtube.com/embed/u7zTf50kVHk" },
    { id: 3, title: "Lesson 3", url: "https://www.youtube.com/embed/ApqFjTxdJ18" }
  ];

  return (
    <div className="app-container">
      <h1>Video Library</h1>
      <div className="video-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <h3>{video.title}</h3>
            <iframe 
              width="560" 
              height="315" 
              src={video.url} 
              title={video.title} 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoLibrary;