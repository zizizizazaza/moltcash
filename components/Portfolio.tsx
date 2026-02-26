
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Icons } from '../constants';

const chartData = [
  { date: 'Jan 20', total: 12050 },
  { date: 'Jan 21', total: 12110 },
  { date: 'Jan 22', total: 12185 },
  { date: 'Jan 23', total: 12290 },
  { date: 'Jan 24', total: 12450.88 },
];

const Portfolio: React.FC = () => {
  const [balance] = useState(12450.88);
  const [yieldAccumulated, setYieldAccumulated] = useState(0.00012);
  const [isHidden, setIsHidden] = useState(false);
  const [greeting, setGreeting] = useState('Good Morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const interval = setInterval(() => {
      setYieldAccumulated(prev => prev + 0.00000042);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn pb-24 px-4 space-y-10">

      {/* 1. Global Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white border-2 border-white shadow-md overflow-hidden transition-transform group-hover:scale-105">
            <Icons.User />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{greeting},</p>
            <h2 className="text-xl font-bold text-black">Alex</h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="p-3 bg-white glass rounded-full hover:bg-gray-50 transition-colors shadow-sm">
              <Icons.Bell />
            </button>
            <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </div>
        </div>
      </header>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* LEFT PANEL: Growth & Allocation (7/12) */}
        <div className="lg:col-span-7 space-y-12">

          {/* Growth Chart Section */}
          <section className="glass rounded-[40px] p-8 bg-white relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Return</h3>
              <div className="flex bg-gray-50 p-1 rounded-full border border-gray-100">
                {['1D', '1W', '1M', 'ALL'].map(t => (
                  <button key={t} className={`px-4 py-1.5 text-[10px] font-bold rounded-full transition-all ${t === '1M' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.08} />
                      <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="1 6" vertical={false} stroke="#00000010" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-black text-white p-4 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md">
                            <p className="text-[9px] uppercase opacity-50 mb-1 font-bold tracking-widest">{payload[0].payload.date}</p>
                            <p className="text-sm font-bold">${payload[0].value?.toLocaleString()}</p>
                            <p className="text-[9px] text-green-400 font-bold mt-1 tracking-tight">Daily Return: +$5.10</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#000000"
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                    strokeWidth={3}
                    animationDuration={2500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Allocation Cards */}
          <section className="space-y-6">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Your Allocation</h4>
            <div className="grid grid-cols-1 gap-4">
              <AllocationCard
                title="AIUSD"
                desc="Treasury Backed Stablecoin"
                apy="5.24% APY · 100% Verified"
                amount="$10,340.00"
                earnings="+$340.00"
                icon={<div className="w-6 h-6 bg-black rounded flex items-center justify-center font-black text-white text-[10px]">A</div>}
              />
            </div>
          </section>

          {/* Recent Activity */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recent Activity</h4>
              <button className="text-[10px] font-bold text-gray-500  hover:text-black">View All</button>
            </div>
            <div className="glass rounded-[32px] overflow-hidden bg-white shadow-sm border border-gray-100">
              <ActivityItem
                title="Daily Interest Payout"
                time="Today, 08:00 AM"
                amount="+$5.24"
                type="INTEREST"
              />
              <ActivityItem
                title="USDC Deposit"
                time="Yesterday, 04:15 PM"
                amount="+$1,000.00"
                type="DEPOSIT"
              />
              <ActivityItem
                title="Daily Interest Payout"
                time="Jan 22, 08:00 AM"
                amount="+$5.10"
                type="INTEREST"
              />
            </div>
          </section>
        </div>

        {/* RIGHT PANEL: Balance & Actions (5/12) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="sticky top-32 space-y-8">

            {/* Net Worth Summary Card */}
            <div className="glass rounded-[40px] p-10 bg-white border border-gray-100 shadow-xl text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Net Worth Balance</p>
              <h1
                onClick={() => setIsHidden(!isHidden)}
                className="text-5xl md:text-6xl font-bold tracking-tight text-black cursor-pointer select-none transition-all hover:scale-[1.02]"
              >
                {isHidden ? '••••••••' : `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              </h1>

              <div className="flex flex-col items-center mt-6 p-4 bg-gray-50 rounded-[32px] border border-gray-100">
                <div className="flex items-center gap-1 font-mono text-green-500 font-bold text-xl">
                  <span>+</span>
                  <span>$</span>
                  <span className="tabular-nums">{yieldAccumulated.toFixed(8)}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-[11px] font-bold text-green-700 tracking-tight">Today's Return: +$5.24 (APY 5.2%)</p>
                </div>
              </div>
            </div>

            {/* Action Buttons Stack */}
            <div className="grid grid-cols-2 gap-4">
              <ActionButton
                onClick={() => {
                  sessionStorage.setItem('pending_chat_action', 'withdraw');
                  window.dispatchEvent(new CustomEvent('loka-nav-chat'));
                }}
                label="Withdraw"
                sub="Send Assets"
                icon={<Icons.Swap />}
              />
              <ActionButton
                onClick={() => {
                  sessionStorage.setItem('pending_chat_action', 'deposit');
                  window.dispatchEvent(new CustomEvent('loka-nav-chat'));
                }}
                label="Deposit"
                sub="Earn 8%+"
                icon={<Icons.Flash />}
                highlight
              />
            </div>

            {/* Trust & Policy Badge */}
            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-start gap-4">
              <div className="text-blue-600 mt-1">
                <Icons.Shield />
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                Your Loka Cash balance is instantly redeemable (T+0). Assets are 1:1 backed by institutional-grade T-Bills.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const ActionButton: React.FC<{ label: string; sub: string; icon: React.ReactNode; primary?: boolean; highlight?: boolean; onClick?: () => void }> = ({ label, sub, icon, primary, highlight, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center p-6 rounded-[32px] transition-all group w-full ${primary ? 'bg-black text-white shadow-xl hover:bg-gray-800' :
      highlight ? 'bg-white border-2 border-green-500/20 text-black shadow-lg shadow-green-500/5 hover:bg-green-50' :
        'bg-white glass text-black hover:bg-gray-50 shadow-md border-gray-100'
    }`}>
    <div className={`mb-3 transition-transform group-hover:-translate-y-1 ${primary ? 'text-white' : highlight ? 'text-green-500' : 'text-gray-400'}`}>
      {icon}
    </div>
    <span className="text-xs font-bold tracking-tight">{label}</span>
    <span className={`text-[9px] font-medium opacity-50 uppercase tracking-widest mt-1 ${primary ? 'text-gray-400' : 'text-gray-500'}`}>{sub}</span>
  </button>
);

const AllocationCard: React.FC<{
  title: string;
  desc: string;
  apy: string;
  amount: string;
  earnings: string;
  icon: React.ReactNode;
  progress?: string
}> = ({ title, desc, apy, amount, earnings, icon, progress }) => (
  <div className="glass p-6 rounded-[32px] bg-white flex items-center justify-between hover:border-black/20 transition-all cursor-pointer group shadow-sm border-gray-100">
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h5 className="text-sm font-bold text-black">{title}</h5>
          <span className="text-[9px] font-bold text-gray-400 tracking-tighter uppercase">({desc})</span>
        </div>
        <p className="text-[11px] text-gray-500 font-medium mt-0.5">{apy}</p>
        {progress && <p className="text-[10px] text-orange-500 font-bold mt-1 tracking-tight">{progress}</p>}
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-black">{amount}</p>
      <p className="text-[11px] font-bold text-green-600 mt-0.5">{earnings}</p>
    </div>
  </div>
);

const ActivityItem: React.FC<{ title: string; time: string; amount: string; type: 'INTEREST' | 'DEPOSIT' }> = ({ title, time, amount, type }) => (
  <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type === 'INTEREST' ? 'bg-green-50 text-green-500' : 'bg-gray-100 text-black'}`}>
        {type === 'INTEREST' ? '💰' : '⬇️'}
      </div>
      <div>
        <p className="text-xs font-bold text-black">{title}</p>
        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{time}</p>
      </div>
    </div>
    <span className={`text-sm font-bold ${type === 'INTEREST' ? 'text-green-600' : 'text-black'}`}>{amount}</span>
  </div>
);

export default Portfolio;
