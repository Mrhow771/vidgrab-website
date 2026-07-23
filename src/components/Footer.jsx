import logo from '../assets/download_3d.svg';

export default function Footer() {
  return (
    <footer className="bg-slate-950/80 border-t border-white/10 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
        {/* Brand info */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logo} alt="VidGrab Logo" className="w-8 h-8" />
            <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-wider">
              VidGrab
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm">
            VidGrab is a universal media downloader and AI processing suite built with PyQt6 and FFmpeg. Clean watermark-free media scraping at your fingertips.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest">Navigation</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#features" className="text-slate-400 hover:text-white transition-colors duration-200">
                Platform Features
              </a>
            </li>
            <li>
              <a href="#enhancer" className="text-slate-400 hover:text-white transition-colors duration-200">
                AI Enhancer
              </a>
            </li>
            <li>
              <a href="#pricing" className="text-slate-400 hover:text-white transition-colors duration-200">
                Pricing Tiers
              </a>
            </li>
            <li>
              <a href="#faq" className="text-slate-400 hover:text-white transition-colors duration-200">
                Frequently Asked
              </a>
            </li>
          </ul>
        </div>

        {/* Disclaimer / System Requirements */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest">Specifications</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Operating System: Windows 10/11</li>
            <li>Engine: Python 3.10+ & PyQt6</li>
            <li>Processing Core: FFmpeg static</li>
            <li>Network: Secure Direct Scrapes</li>
          </ul>
        </div>

        {/* Stay Connected */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest">Stay Connected</h4>
          <p className="text-sm text-slate-400">Get the latest features, updates & announcements directly on WhatsApp.</p>
          <a
            href="https://whatsapp.com/channel/0029VbD4x6Y6hENo8acHpZ18"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-900/20 transition-all duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Join WhatsApp Channel
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
        <p className="text-xs text-slate-500">
          &copy; {new Date().getFullYear()} VidGrab Downloader. All rights reserved.
        </p>
        <p className="text-[10px] text-slate-600 max-w-md">
          Disclaimer: VidGrab is designed for personal archiving and backup of media. Please respect content creators' copyrights and the terms of service of each platform.
        </p>
      </div>
    </footer>
  );
}
