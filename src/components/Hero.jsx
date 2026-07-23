import { useState } from 'react';
import { Download, Shield, Sparkles, Zap, Flame, RefreshCw, Plus, Trash2, Folder, Monitor, Lock, Video, Loader2, AlertCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function Hero() {
  const [videoUrl, setVideoUrl] = useState('');
  const [step, setStep] = useState('input'); // input, fetching, quality, downloading
  const [videoInfo, setVideoInfo] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFetchInfo = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!videoUrl || !videoUrl.startsWith('http')) {
      setErrorMsg("Please enter a valid video link.");
      return;
    }

    setStep('fetching');
    try {
      const response = await fetch(`${API_BASE}/api/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: videoUrl }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch video info');
      }

      setVideoInfo(data);
      if (data.qualities && data.qualities.length > 0) {
        setSelectedQuality(data.qualities[0]);
      }
      setStep('quality');
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "Failed to process video. It might be private or invalid.");
      setStep('input');
    }
  };

  const handleDownloadFinal = async () => {
    setStep('downloading');
    setErrorMsg('');
    try {
      const response = await fetch(`${API_BASE}/api/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: videoUrl, 
          height: selectedQuality?.height || 'best',
          fps: selectedQuality?.fps || 0
        }),
      });

      // Check content type to determine response format
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Download failed');
        }
        if (data.directUrl) {
          // Direct URL - open in new tab for instant download
          window.open(data.directUrl, '_blank');
        }
      } else {
        // Binary file response (merged video from server)
        if (!response.ok) throw new Error('Download failed');
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `VidGrab_Video_${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
      }
      
      setStep('input');
      setVideoUrl('');
      setVideoInfo(null);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "Failed to download video. Please try again.");
      setStep('quality');
    }
  };

  return (
    <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 px-6 sm:px-8 bg-slate-50/50 bg-grid-pattern overflow-hidden">
      
      {/* Background Glowing mesh gradients */}
      <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-indigo-200/40 rounded-full blur-[100px] animate-pulse-glow -z-10" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[120px] animate-float -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Side Content */}
        <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 backdrop-blur-md">
            <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">New</span>
            <span className="text-xs font-semibold text-indigo-900 flex items-center gap-1">
              AI Enhancer v2.0 is Live! <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Grab Any Video.<br />
            Anywhere. <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">Instantly.</span>
          </h1>

          {/* Paragraph */}
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Download videos from Instagram, TikTok, YouTube, Rednote and 1000+ websites in HD quality. Enhance, upscale and make them look amazing with AI.
          </p>

          {/* Download Box Input or Quality Selector */}
          <div className="max-w-lg mx-auto lg:mx-0">
            {(step === 'input' || step === 'fetching') && (
              <form onSubmit={handleFetchInfo} className="flex p-2 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100/50 focus-within:border-indigo-400 transition-all">
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Paste video link here..."
                  className="w-full pl-4 pr-2 py-3 bg-transparent text-slate-800 placeholder-slate-400 font-medium text-sm focus:outline-none"
                  disabled={step === 'fetching'}
                />
                <button
                  type="submit"
                  disabled={step === 'fetching'}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {step === 'fetching' ? (
                    <>Processing <Loader2 className="w-4 h-4 animate-spin" /></>
                  ) : (
                    <>Download <Download className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            )}

            {(step === 'quality' || step === 'downloading') && videoInfo && (
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100/50">
                <div className="flex gap-4 items-center">
                  {videoInfo.thumbnail && (
                    <img src={videoInfo.thumbnail} alt="Thumbnail" className="w-24 h-24 object-cover rounded-xl shadow-sm" />
                  )}
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="font-bold text-sm text-slate-800 truncate mb-2">{videoInfo.title}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {videoInfo.qualities.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedQuality(q)}
                          disabled={step === 'downloading'}
                          className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${selectedQuality?.label === q.label ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => { setStep('input'); setVideoUrl(''); setVideoInfo(null); setErrorMsg(''); }}
                    disabled={step === 'downloading'}
                    className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all disabled:opacity-70"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDownloadFinal}
                    disabled={step === 'downloading'}
                    className="flex-[2] inline-flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {step === 'downloading' ? (
                      <>Downloading <Loader2 className="w-4 h-4 animate-spin" /></>
                    ) : (
                      <>Download Now <Download className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mt-3 text-sm text-red-500 font-medium text-left px-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                {errorMsg}
              </div>
            )}
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 pt-3">
            <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs bg-white py-2 px-4 rounded-xl border border-slate-100 shadow-sm">
              <Shield className="w-4 h-4 text-emerald-500" />
              No Watermark
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs bg-white py-2 px-4 rounded-xl border border-slate-100 shadow-sm">
              <Zap className="w-4 h-4 text-amber-500" />
              Ultra Fast
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs bg-white py-2 px-4 rounded-xl border border-slate-100 shadow-sm">
              <Monitor className="w-4 h-4 text-indigo-500" />
              HD Quality
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs bg-white py-2 px-4 rounded-xl border border-slate-100 shadow-sm">
              <Lock className="w-4 h-4 text-cyan-500" />
              100% Safe
            </div>
          </div>
        </div>

        {/* Right Side Mockup (VidGrab Dashboard) */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end animate-float">
          <div className="w-full max-w-xl bg-white border border-slate-200/80 rounded-3xl shadow-2xl overflow-hidden flex h-[420px]">
            
            {/* Mockup Sidebar */}
            <div className="w-44 border-r border-slate-100 bg-slate-50/50 p-4 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Windows style close icons */}
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
                </div>
                
                {/* Navigation items */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">
                    <Download className="w-3.5 h-3.5" />
                    <span>Downloader</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-lg text-xs font-semibold cursor-pointer">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Enhancer</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-lg text-xs font-semibold cursor-pointer">
                    <Folder className="w-3.5 h-3.5" />
                    <span>History</span>
                  </div>
                </div>
              </div>

              {/* Sidebar Upgrade Card */}
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5 text-purple-700 text-[10px] font-black uppercase">
                  <Flame className="w-3.5 h-3.5 fill-purple-700" />
                  <span>Premium Plan</span>
                </div>
                <p className="text-[9px] text-purple-900 leading-normal">
                  Unlock 4K downloads, batch download & more.
                </p>
                <button className="w-full py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-[9px] font-bold shadow-md shadow-indigo-600/10">
                  Upgrade Now
                </button>
              </div>
            </div>

            {/* Mockup Main Content Area */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Download Manager</h3>
                  <span className="text-[10px] text-slate-400 font-semibold">3 Active Downloads</span>
                </div>
                <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold transition-colors">
                  Clear All
                </button>
              </div>

              {/* Task Items */}
              <div className="space-y-3.5 my-4">
                
                {/* Task Item 1: Active Progress */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Video className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-800">
                      <span className="truncate max-w-[160px]">Best Places to Visit in Switzerland 4K</span>
                      <span className="text-indigo-600">72%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: '72%' }} />
                    </div>
                  </div>
                </div>

                {/* Task Item 2: TikTok Done */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 font-black text-xs">
                    T
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-800">
                      <span className="truncate max-w-[160px]">Cute Cat Video Compilation</span>
                      <span className="text-emerald-600 flex items-center gap-1 font-bold">
                        Completed <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Task Item 3: Instagram Done */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-pink-600 font-black text-xs">
                    I
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-800">
                      <span className="truncate max-w-[160px]">Travel Reels - Mountains</span>
                      <span className="text-emerald-600 flex items-center gap-1 font-bold">
                        Completed <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Progress */}
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 mb-1">
                    <span>Overall Progress</span>
                    <span>2.3 GB / 5.0 GB</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full" style={{ width: '46%' }} />
                  </div>
                </div>
                <span className="text-xs font-black text-slate-800">46%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
