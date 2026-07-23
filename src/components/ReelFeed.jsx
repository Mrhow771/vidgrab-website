import React, { useState, useEffect, useRef } from 'react';
import ReelPlayer from './ReelPlayer';

// Mock data to simulate downloaded videos or Instagram reels
const MOCK_REELS = [
  { id: '1', url: 'https://www.w3schools.com/html/mov_bbb.mp4', user: '@canyon_csl', caption: 'Stunning canyon drive! 🚗💨 #csl #drive', likes: '58.5K', comments: '550', shares: '1,721' },
  { id: '2', url: 'https://www.w3schools.com/html/mov_bbb.mp4', user: '@vidgrab_official', caption: 'VidGrab makes downloading easy. ⚡️ #vidgrab #tech', likes: '10.2K', comments: '120', shares: '45' },
  { id: '3', url: 'https://www.w3schools.com/html/mov_bbb.mp4', user: '@nature_vibes', caption: 'Relaxing sounds... 🌲🌿', likes: '900K', comments: '12K', shares: '50K' },
];

export default function ReelFeed() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const containerRef = useRef(null);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Calculate which video is currently in the center of the view
    const scrollPosition = container.scrollTop;
    const clientHeight = container.clientHeight;
    
    const currentIndex = Math.round(scrollPosition / clientHeight);
    
    if (currentIndex !== activeVideoIndex) {
      setActiveVideoIndex(currentIndex);
    }
  };

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black"
    >
      {MOCK_REELS.map((reel, index) => (
        <div key={reel.id} className="w-full h-full snap-start snap-always">
          <ReelPlayer reel={reel} isActive={index === activeVideoIndex} />
        </div>
      ))}
    </div>
  );
}
