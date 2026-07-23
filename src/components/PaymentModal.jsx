import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, Copy, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function PaymentModal({ isOpen, onClose, plan }) {
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [licenseKey, setLicenseKey] = useState(null);
  const [copyStatus, setCopyStatus] = useState("Copy Key");
  
  const pollIntervalRef = useRef(null);

  if (!isOpen) return null;

  const WALLET_ADDRESS = "0x6da9826EBcCd77CBB4eB55cf968F018c54a621b";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    alert("Wallet address copied!");
  };

  const copyKeyToClipboard = () => {
    if (licenseKey) {
      navigator.clipboard.writeText(licenseKey);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy Key"), 2000);
    }
  };

  const handleIvePaid = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: WALLET_ADDRESS,
          plan_type: plan.name,
          amount: plan.price
        })
      });
      const data = await res.json();
      if (data.success) {
        setOrderId(data.order_id);
        setStep(2);
      } else {
        alert("Error creating order: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Status Polling Effect
  useEffect(() => {
    if (step === 2 && orderId) {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE}/api/orders/${orderId}`);
          const data = await res.json();
          if (res.ok && data.status === 'approved') {
            setLicenseKey(data.key);
            setStep(3);
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
            }
          }
        } catch (err) {
          console.error("Error polling order status:", err);
        }
      }, 3000);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [step, orderId]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800">Crypto Payment</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6 text-center">
              <div className="bg-indigo-50 text-indigo-700 py-2 px-4 rounded-xl text-sm font-bold inline-block">
                Amount: {plan.price}
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3 text-left">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
                <p className="text-sm font-medium">
                  Only send <strong className="font-bold">USDT (BEP20)</strong> to this address. Sending other networks or assets will result in permanent loss.
                </p>
              </div>

              <div className="flex justify-center">
                <div className="p-4 bg-white border border-slate-200 shadow-sm rounded-2xl">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${WALLET_ADDRESS}`} 
                    alt="USDT QR Code" 
                    className="w-40 h-40"
                  />
                </div>
              </div>

              <div className="text-left space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">USDT (BEP20) Address</label>
                <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1">
                  <input 
                    type="text" 
                    readOnly 
                    value={WALLET_ADDRESS} 
                    className="flex-1 bg-transparent px-3 text-sm text-slate-700 font-medium outline-none"
                  />
                  <button onClick={copyToClipboard} className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
                    <Copy className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>

              <button 
                onClick={handleIvePaid}
                disabled={isVerifying}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-70"
              >
                {isVerifying ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</> : "I've Paid"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-500 mb-6">
                <Loader2 className="w-10 h-10 animate-spin" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Payment Verification</h3>
              <p className="text-slate-600 font-medium">We are checking the block confirmation for your payment. Please do not close this window.</p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-6">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Order ID</p>
                <p className="text-sm font-mono text-slate-800">{orderId}</p>
              </div>
              <button onClick={onClose} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold mt-6">Close</button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Payment Approved!</h3>
              <p className="text-slate-600 font-medium">Your license key has been generated. Use this key in the VidGrab app to activate your Pro plan.</p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-6 text-left space-y-2">
                <p className="text-xs text-slate-400 font-bold uppercase">License Key</p>
                <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                  <input 
                    type="text" 
                    readOnly 
                    value={licenseKey} 
                    className="flex-1 bg-transparent px-3 text-sm text-slate-800 font-mono font-bold outline-none"
                  />
                  <button onClick={copyKeyToClipboard} className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md text-xs font-bold hover:bg-indigo-100 transition-colors">
                    {copyStatus}
                  </button>
                </div>
              </div>
              
              <button onClick={onClose} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold mt-6 hover:bg-indigo-700 transition-colors">Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
