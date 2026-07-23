import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, ArrowDownToLine } from 'lucide-react';
// Test asset fallback reference: ../assets/download_3d.svg

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'AI Enhancer', href: '#enhancer' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Blog', href: '#blog' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className="w-full border-b border-slate-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-purple-500/20">
              <span className="text-white font-black text-xl italic tracking-tighter">V</span>
            </div>
            <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
              Vid<span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Grab</span>
            </span>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* WhatsApp Channel */}
            <a
              href="https://whatsapp.com/channel/0029VbD4x6Y6hENo8acHpZ18"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl font-semibold text-xs transition-all duration-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Get Updates
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white text-[10px] font-medium px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Get the latest features & updates
              </span>
            </a>

            {/* Theme Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors duration-200"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Download CTA */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const link = document.createElement('a');
                link.href = '/VidGrab_Windows_x64.zip';
                link.download = 'VidGrab_Windows_x64.zip';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                alert("Downloading VidGrab package for Windows...");
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all duration-300"
            >
              Download App
              <ArrowDownToLine className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-xl border border-slate-200 text-slate-600"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white py-4 px-6 space-y-3 shadow-inner">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-slate-600 hover:text-indigo-600 font-medium text-base transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href="https://whatsapp.com/channel/0029VbD4x6Y6hENo8acHpZ18"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-2 text-emerald-600 font-medium text-base transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Get Updates on WhatsApp
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              const link = document.createElement('a');
              link.href = '/VidGrab_Windows_x64.zip';
              link.download = 'VidGrab_Windows_x64.zip';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              alert("Downloading VidGrab package for Windows...");
            }}
            className="w-full text-center inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-sm transition-all"
          >
            Download App
            <ArrowDownToLine className="w-4 h-4" />
          </a>
        </div>
      )}
    </nav>
  );
}
