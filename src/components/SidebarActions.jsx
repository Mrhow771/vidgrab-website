import React, { useState } from 'react';

export default function SidebarActions({ reel }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="absolute bottom-16 right-2 flex flex-col items-center space-y-4 z-10 pb-4">
      
      {/* Like Button */}
      <button 
        className="flex flex-col items-center group transition-transform active:scale-90"
        onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
      >
        <div className="p-2 bg-black/20 rounded-full group-hover:bg-black/40 transition-colors">
          <svg className={`w-7 h-7 ${isLiked ? 'text-red-500 fill-current' : 'text-white'}`} fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isLiked ? 0 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <span className="text-xs mt-1 font-semibold drop-shadow-md">{reel.likes}</span>
      </button>

      {/* Comment Button */}
      <button className="flex flex-col items-center group transition-transform active:scale-90" onClick={(e) => e.stopPropagation()}>
        <div className="p-2 bg-black/20 rounded-full group-hover:bg-black/40 transition-colors">
          <svg className="w-7 h-7 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <span className="text-xs mt-1 font-semibold drop-shadow-md">{reel.comments}</span>
      </button>

      {/* Share Button */}
      <button className="flex flex-col items-center group transition-transform active:scale-90" onClick={(e) => e.stopPropagation()}>
        <div className="p-2 bg-black/20 rounded-full group-hover:bg-black/40 transition-colors">
          <svg className="w-7 h-7 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </div>
        <span className="text-xs mt-1 font-semibold drop-shadow-md">{reel.shares}</span>
      </button>

      {/* More Options */}
      <button className="flex flex-col items-center group transition-transform active:scale-90" onClick={(e) => e.stopPropagation()}>
        <div className="p-2 bg-black/20 rounded-full group-hover:bg-black/40 transition-colors">
          <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </div>
      </button>

      {/* Spinning Audio Record */}
      <div className="mt-4 pt-2">
        <div className="w-10 h-10 rounded-lg bg-zinc-800 border-2 border-zinc-700 animate-spin flex items-center justify-center overflow-hidden" style={{ animationDuration: '3s' }}>
          <div className="w-3 h-3 rounded-full bg-zinc-900 border border-zinc-600" />
        </div>
      </div>
    </div>
  );
}
