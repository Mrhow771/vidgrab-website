import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import PaymentModal from './PaymentModal';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      name: "Free",
      tagline: "Basic downloading for casual users.",
      priceMonthly: 0,
      priceAnnual: 0,
      features: [
        "Up to 5 video downloads per day",
        "Max resolution up to 720p SD",
        "Instagram & YouTube url scraper",
        "Standard download speeds",
        "Ad-supported interface",
        "Basic email support"
      ],
      notIncluded: [
        "Watermark removal features",
        "TikTok & Rednote scrapers",
        "Lanczos upscaling filter",
        "Multi-threaded speed boost"
      ],
      cta: "Get Started",
      featured: false
    },
    {
      name: "Pro",
      tagline: "Ideal for power users and creators.",
      priceMonthly: 9.99,
      priceAnnual: 7.99,
      features: [
        "Up to 100 video downloads per day",
        "Max resolution up to 4K UHD",
        "Unlock TikTok & Rednote scrapers",
        "Watermark-free TikTok downloads",
        "3x faster multithreading",
        "Basic Video Enhancer (Flip, Speed)",
        "Ad-free interface"
      ],
      notIncluded: [
        "Lanczos 4K/8K upscaling",
        "Automatic logo watermarks cropper",
        "Unlimited simultaneous streams",
        "Priority 24/7 VIP support"
      ],
      cta: "Upgrade to Pro",
      featured: false
    },
    {
      name: "Premium",
      tagline: "Ultimate toolkit for professional editors.",
      priceMonthly: 19.99,
      priceAnnual: 15.99,
      features: [
        "Unlimited downloads daily",
        "Max resolution up to 8K / HDR",
        "All scrapers included & prioritized",
        "Advanced Video Enhancer (Lanczos 4K)",
        "Auto-delogo watermark cropper",
        "10x multi-threaded download speed",
        "Unlimited simultaneous streams",
        "Priority 24/7 VIP support & updates"
      ],
      notIncluded: [],
      cta: "Go Premium",
      featured: true
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-50 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[30%] right-[10%] w-[350px] h-[350px] bg-purple-200/40 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Pricing Plans</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Flexible plans for everyone
          </h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto">
            Choose the plan that matches your downloading and editing needs. Save up to 20% with annual billing.
          </p>

          {/* Toggle Switch */}
          <div className="pt-8 flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${!isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>Monthly Billing</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 hover:bg-slate-300 transition-colors duration-200 focus:outline-none"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isAnnual ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-bold flex items-center gap-1.5 ${isAnnual ? 'text-slate-900' : 'text-slate-400'}`}>
              Annual Billing
              <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-8 bg-white border rounded-3xl flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 relative ${
                plan.featured 
                  ? 'border-indigo-500/80 shadow-2xl shadow-indigo-500/5 ring-1 ring-indigo-500/20' 
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow-md shadow-indigo-500/10">
                  <Sparkles className="w-3 h-3 fill-white" /> Popular Choice
                </span>
              )}

              <div>
                {/* Plan Name & Tagline */}
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-400 font-semibold">{plan.tagline}</p>
                </div>

                {/* Pricing Display */}
                <div className="pt-6 pb-8 flex items-baseline gap-1 border-b border-slate-100">
                  <span className="text-4xl font-black text-slate-900">
                    ${isAnnual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  <span className="text-xs font-bold text-slate-400">/ month</span>
                </div>

                {/* Features List */}
                <div className="pt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-600 font-semibold leading-normal">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 opacity-40">
                      <Check className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-500 font-medium leading-normal line-through">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button
                  onClick={() => {
                    if (plan.name === "Free") {
                      alert("You are already on the Free plan!");
                    } else {
                      setSelectedPlan(plan);
                      setPaymentModalOpen(true);
                    }
                  }}
                  className={`w-full py-4 rounded-2xl font-bold text-xs shadow-md transition-all duration-300 ${
                    plan.featured
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/15'
                      : 'bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PaymentModal 
        isOpen={paymentModalOpen} 
        onClose={() => setPaymentModalOpen(false)} 
        plan={selectedPlan} 
      />
    </section>
  );
}
