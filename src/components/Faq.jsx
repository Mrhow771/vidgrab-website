import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Faq() {
  const faqs = [
    {
      q: "Is Instagram cookie scraping safe for my account?",
      a: "Yes, VidGrab uses a secure, local-only dual-view browser module to capture session cookies directly from your browser. Your login credentials are never stored, transmitted, or shared with external servers. All authentication happens entirely on your machine."
    },
    {
      q: "How does the AI Video Enhancer remove watermarks?",
      a: "VidGrab integrates FFmpeg filter modules (delogo and crop). It allows you to select coordinates or choose preset areas where platform watermarks (like the bouncing TikTok logo) are placed, automatically stripping or cropping them out during the download stream processing."
    },
    {
      q: "Can I run the desktop application on macOS or Linux?",
      a: "Currently, VidGrab is optimized as a native Windows application built on PyQt6 and package-wrapped for Windows 10/11. Support for macOS and Linux builds is currently in our development roadmap."
    },
    {
      q: "Is there a download speed limit on the Free plan?",
      a: "The Free plan downloads media using single-threaded connections, which yields standard download speeds. The Pro and Premium plans unlock 3x and 10x multi-threaded downloads respectively, saturating your bandwidth for ultra-fast saves."
    },
    {
      q: "Can I download entire profiles or playlists in bulk?",
      a: "Yes, bulk/queue scraping is available in our Pro and Premium tiers. Simply paste a user profile link, select the videos or carousels you wish to grab, and add them to the queue for automated background scraping."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <section id="faq" className="py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">
            Have questions about VidGrab? We have answers.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-bold text-slate-800 text-base sm:text-lg">{faq.q}</span>
                  <span className="text-slate-400 shrink-0 ms-4">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-[500px] border-t border-slate-100' : 'max-h-0'
                  }`}
                >
                  <p className="p-6 text-sm sm:text-base text-slate-600 leading-relaxed bg-slate-50/50">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
