import { useState, useRef } from 'react';
import { Check, ArrowRight, Play, Zap, Shield, Sparkles, Sliders, Smartphone, AlertCircle, Sparkle } from 'lucide-react';
import instaIcon from '../assets/insta_3d.svg';
import tiktokIcon from '../assets/tiktok_3d.svg';
import youtubeIcon from '../assets/youtube_3d.svg';
import rednoteIcon from '../assets/rednote_3d.svg';

export default function Features() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const platforms = [
    { name: 'Instagram', desc: 'Photos, Reels, Stories, IGTV', icon: instaIcon, color: 'bg-pink-50 text-pink-600' },
    { name: 'TikTok', desc: 'Videos without watermark', icon: tiktokIcon, color: 'bg-cyan-50 text-cyan-600' },
    { name: 'YouTube', desc: '720p, 1080p, 2K, 4K, 8K', icon: youtubeIcon, color: 'bg-red-50 text-red-600' },
    { name: 'Rednote', desc: 'Download videos from Rednote', icon: rednoteIcon, color: 'bg-rose-50 text-rose-600' },
    { name: 'Facebook', desc: 'Videos from Facebook Watch', icon: 'Facebook', color: 'bg-blue-50 text-blue-600', comingSoon: true },
    { name: 'Twitter / X', desc: 'Download tweets & videos', icon: 'Twitter', color: 'bg-slate-50 text-slate-800', comingSoon: true }
  ];

  const whyChooseUs = [
    { title: 'Ultra Fast Downloads', desc: 'Download any video in seconds', icon: Zap },
    { title: 'HD & 4K Quality', desc: 'High quality downloads up to 8K', icon: Sparkles },
    { title: 'No Watermark', desc: 'Clean videos without any watermark', icon: Shield },
    { title: 'AI Video Enhancer', desc: 'Enhance quality using powerful AI', icon: Sliders },
    { title: '100% Secure', desc: 'Your data and privacy are safe with us', icon: AlertCircle },
    { title: 'Cross Platform', desc: 'Works on Windows, Mac & Android', icon: Smartphone }
  ];

  return (
    <div id="features" className="py-24 bg-white space-y-32">
      
      {/* 1. Supported Platforms Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Supported Platforms</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Download from any website
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {platforms.map((plat) => (
            <div 
              key={plat.name}
              className={`relative p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col items-center text-center space-y-4 ${plat.comingSoon ? 'opacity-60 cursor-default' : 'hover:shadow-md hover:scale-[1.03] cursor-pointer'} transition-all duration-300`}
            >
              {plat.comingSoon && (
                <span className="absolute top-3 right-3 bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                  Coming Soon
                </span>
              )}
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                {plat.icon === 'Facebook' ? (
                  <span className="text-blue-600 font-bold text-xs">FB</span>
                ) : plat.icon === 'Twitter' ? (
                  <span className="text-slate-800 font-bold text-xs">X</span>
                ) : (
                  <img src={plat.icon} alt={plat.name} className="w-8 h-8" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{plat.name}</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-1">{plat.desc}</p>
              </div>
              {plat.comingSoon ? (
                <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                  Coming Soon
                </span>
              ) : (
                <span className="text-xs text-indigo-500 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 2. Why Choose VidGrab Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-12">
        <div className="space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Why Choose VidGrab?</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Advanced features for creators
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {whyChooseUs.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.title}
                className="p-6 bg-slate-50 border border-slate-100/50 rounded-3xl flex flex-col items-center text-center space-y-3 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-normal">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Instagram Pro Scraper Detail Row */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-pink-700 text-xs font-bold">
            <Sparkle className="w-4 h-4 fill-pink-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Pro Feature</span>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Instagram Pro Scraper
          </h3>
          <p className="text-slate-500 leading-relaxed font-medium">
            Scrape Instagram profiles, reels, stories, highlights and countless posts in bulk with just one click.
          </p>

          <div className="space-y-3">
            {[
              'Bulk profile & stories download',
              'Extract tags, links & stats',
              'High quality media downloads',
              'Save reels in original quality'
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                <Check className="w-5 h-5 text-indigo-600" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all duration-300">
            Try Instagram Scraper <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Form Card Mockup */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end">
          <div className="w-full max-w-lg p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-800">Instagram Downloader</h4>
              <button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold">Paste & Analyze</button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600">Target Link / URL</label>
                <input 
                  type="text" 
                  placeholder="https://instagram.com/p/abc123..." 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">Quality / Format</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none">
                    <option>1080p (Full HD)</option>
                    <option>720p (HD)</option>
                    <option>4K (Ultra HD)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">Format</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none">
                    <option>MP4</option>
                    <option>MP3 (Audio)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AI Video Enhancer Detail Row (Interactive Slider) */}
      <section id="enhancer" className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>AI Powered</span>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Video Enhancer & Customizer
          </h3>
          <p className="text-slate-500 leading-relaxed font-medium">
            Enhance video quality, remove blur, improve colors, stabilize footage and upscale resolution using advanced AI technology.
          </p>

          <div className="space-y-3">
            {[
              'Upscale to 4K/8K',
              'Remove Noise',
              'Improve Colors',
              'Stabilize Video'
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                <Check className="w-5 h-5 text-indigo-600" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all duration-300">
            Try AI Enhancer <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Split Image Slider */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end">
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={(e) => handleMouseMove(e.touches[0])}
            className="w-full max-w-lg h-[340px] rounded-3xl overflow-hidden relative select-none cursor-ew-resize border border-slate-200 shadow-xl"
          >
            {/* After Image (High Quality Enhanced) */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80')" }}>
              <span className="absolute bottom-4 right-4 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">After</span>
            </div>

            {/* Before Image (Low Quality Blurry/Pixelated) */}
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden" 
              style={{ width: `${sliderPosition}%` }}
            >
              <div 
                className="absolute inset-0 w-[512px] h-[340px] bg-cover bg-center filter blur-[6px] contrast-75 saturate-50"
                style={{ 
                  backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80')",
                  width: containerRef.current ? `${containerRef.current.getBoundingClientRect().width}px` : '500px'
                }}
              >
                <span className="absolute bottom-4 left-4 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">Before</span>
              </div>
            </div>

            {/* Split bar handle */}
            <div 
              className="absolute inset-y-0 w-1 bg-white shadow-lg cursor-ew-resize flex items-center justify-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-500 font-extrabold text-xs">
                ↔
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
