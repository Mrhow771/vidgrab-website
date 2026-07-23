import { useState, useEffect } from 'react';
import { Shield, Check, X, Key, Clock } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const approveOrder = async (id) => {
    if (!window.confirm("Are you sure you want to approve this payment and generate a key?")) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/orders/approve/${id}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert("License Key Generated: " + data.key);
        fetchOrders();
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 max-w-sm w-full text-center">
          <Key className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Admin Access</h2>
          <p className="text-sm text-slate-500 mb-6">Enter master password to continue</p>
          <input 
            type="password" 
            placeholder="Password..." 
            className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-4 focus:outline-none focus:border-indigo-500 bg-slate-50 text-slate-800 font-medium"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (password === 'mrhow786') setIsAuthenticated(true);
                else alert('Incorrect Password!');
              }
            }}
          />
          <button 
            onClick={() => {
              if (password === 'mrhow786') setIsAuthenticated(true);
              else alert('Incorrect Password!');
            }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="p-10 text-center text-slate-500 font-medium flex items-center justify-center min-h-screen"><Clock className="w-5 h-5 animate-spin mr-2" /> Loading orders...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-700">Pending & Completed Orders</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Wallet Address</th>
                  <th className="px-6 py-4">Plan & Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400">No orders found.</td>
                  </tr>
                )}
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                    <td className="px-6 py-4 font-mono text-xs">{order.wallet_address}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800">{order.plan_type}</span>
                      <br/>
                      <span className="text-xs text-slate-500">{order.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      {order.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          <Check className="w-3.5 h-3.5" /> Approved
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {order.status === 'pending' ? (
                        <button 
                          onClick={() => approveOrder(order.id)}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs transition-colors"
                        >
                          Approve
                        </button>
                      ) : (
                        <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 rounded-lg font-bold text-xs cursor-not-allowed">
                          Done
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
