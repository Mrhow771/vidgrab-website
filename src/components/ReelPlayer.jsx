import React, { useRef, useEffect, useState } from 'react';
import SidebarActions from './SidebarActions';

export default function ReelPlayer({ reel, isActive }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Auto-play when active
      if (videoRef.current) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    } else {
      // Pause when inactive
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowPlayIcon(true);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setShowPlayIcon(false);
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-black group" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={reel.url}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={false}
      />

      {/* Play Icon Overlay (shows briefly on pause) */}
      {showPlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 rounded-full p-4 animate-pulse-slow">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Overlays (Gradient for readability) */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

      {/* Video Info (User & Caption) */}
      <div className="absolute bottom-16 left-4 right-16 z-10">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-zinc-900 border-2 border-black overflow-hidden flex items-center justify-center">
               <span className="text-xs font-bold">{reel.user.charAt(1).toUpperCase()}</span>
            </div>
          </div>
          <span className="font-semibold text-sm hover:underline cursor-pointer">{reel.user}</span>
          <button className="border border-white/40 px-2 py-0.5 rounded-md text-xs font-semibold ml-2 hover:bg-white/20 transition-colors">Follow</button>
        </div>
        <p className="text-sm line-clamp-2">{reel.caption}</p>
        
        {/* Audio track info */}
        <div className="flex items-center space-x-2 mt-2 text-xs">
           <svg className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
           <span className="truncate max-w-[200px] hover:underline cursor-pointer">Original Audio - {reel.user}</span>
        </div>
      </div>

      {/* Sidebar Actions */}
      <SidebarActions reel={reel} />
    </div>
  );
}
