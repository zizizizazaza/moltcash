
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, CartesianGrid, YAxis, XAxis } from 'recharts';
import { Icons } from '../constants';

// Generate 90 days of dummy data
const generateChartData = () => {
  const data = [];
  let currentTotal = 11000;
  const now = new Date();
  for (let i = 90; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    currentTotal = currentTotal + (Math.random() * 200 - 90); // Random walk
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: d.getTime(),
      total: currentTotal
    });
  }
  return data;
};

const chartData = generateChartData();

const Portfolio: React.FC = () => {
  const [balance] = useState(12450.88);
  const [yieldAccumulated, setYieldAccumulated] = useState(0.00012);
  const [isHidden, setIsHidden] = useState(false);
  const [greeting, setGreeting] = useState('Good Morning');

  const walletAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'holdings' | 'activity'>('holdings');
  const [timeframe, setTimeframe] = useState('7D');

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const getFilteredData = () => {
    if (timeframe === '7D') return chartData.slice(-7);
    if (timeframe === '30D') return chartData; // Currently dataset is small, so returning full data for 30D
    if (timeframe === '3M') return chartData;
    return chartData; // Return full data by default
  };

  const filteredChartData = getFilteredData();

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn pb-24 px-4 space-y-10">

      {/* 1. Global Header */}
      <header className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">{greeting},</p>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-black border-r border-gray-100 pr-3">
              {walletAddress.slice(0, 4)}{walletAddress.slice(-3)}
            </h2>
            <div
              onClick={handleCopy}
              className="flex items-center gap-1.5 cursor-pointer group"
              title="Copy Address"
            >
              <span className="text-[10px] font-mono text-gray-400 font-medium group-hover:text-black transition-colors">
                {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
              </span>
              <div className="flex items-center justify-center p-1 rounded bg-gray-50 group-hover:bg-gray-100 transition-colors">
                {copied ? (
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-3 h-3 text-gray-400 group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* TOP SECTION: Net Worth Balance & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-6">

        {/* Left: Numbers */}
        <div className="flex flex-col">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Net Worth</p>
          <div className="flex flex-col gap-2">
            <h1
              onClick={() => setIsHidden(!isHidden)}
              className="text-4xl md:text-5xl font-bold tracking-tight text-black cursor-pointer select-none transition-all hover:opacity-80"
            >
              {isHidden ? '••••••••' : `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            </h1>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Yield</span>
                <div className="flex items-center gap-1 font-mono text-green-500 font-bold">
                  <span>+</span>
                  <span>$</span>
                  <span className="tabular-nums">340.00</span>
                </div>
              </div>
              <p className="text-[11px] font-bold text-gray-400 tracking-tight bg-gray-50 px-2 py-1 rounded-md mt-4">Today's Return: +$5.24</p>
            </div>
          </div>
        </div>

        {/* Right: Inline Chart & Timeframe Toggles */}
        <div className="flex flex-col items-end w-full">
          <div className="flex bg-gray-50/80 p-1 rounded-full border border-gray-100 mb-2 gap-1">
            {['7D', '30D', '3M', 'ALL'].map(t => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-1.5 text-[10px] font-bold rounded-full transition-all ${timeframe === t ? 'bg-white text-black shadow-sm border border-gray-200/50' : 'text-gray-400 hover:text-black'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredChartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="timestamp"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={20}
                  tickFormatter={(tick) => {
                    const date = new Date(tick);
                    if (timeframe === '7D') return date.toLocaleDateString('en-US', { weekday: 'short' });
                    if (timeframe === '30D') return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    return date.toLocaleDateString('en-US', { month: 'short' });
                  }}
                  tick={{ fontSize: 9, fill: '#9CA3AF', fontWeight: 'bold' }}
                  dy={5}
                />
                <YAxis domain={['dataMin - 500', 'dataMax + 100']} hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-black text-white p-2 rounded-xl border border-white/10 shadow-2xl backdrop-blur-md">
                          <p className="text-[11px] font-bold">${payload[0].value?.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  strokeWidth={2}
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Tabs for Holding / Activity */}
      <div className="space-y-6">

        {/* Tabs Control */}
        <div className="flex items-center gap-6 border-b border-gray-100 pb-px">
          <button
            onClick={() => setActiveTab('holdings')}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'holdings' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Holdings
            {activeTab === 'holdings' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'activity' ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Activity
            {activeTab === 'activity' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-t-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-2">
          {activeTab === 'holdings' ? (
            <section className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 gap-4">
                <AllocationCard
                  title="AIUSD"
                  desc="Treasury Backed Stablecoin"
                  apy="5.24% APY"
                  amount="$10,340.00"
                  earnings="+$340.00"
                  icon={<div className="w-6 h-6 bg-black rounded flex items-center justify-center font-black text-white text-[10px]">A</div>}
                  onClick={() => window.dispatchEvent(new CustomEvent('loka-nav-swap'))}
                  action={
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('loka-nav-swap')); }}
                        className="px-4 py-1.5 bg-gray-100/80 text-black text-[11px] font-bold rounded-full hover:bg-gray-200 transition-colors shadow-sm"
                      >
                        Add
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('loka-nav-swap')); }}
                        className="px-4 py-1.5 bg-black text-white text-[11px] font-bold rounded-full hover:bg-gray-800 transition-colors shadow-sm"
                      >
                        Sell
                      </button>
                    </div>
                  }
                />
                <AllocationCard
                  title="ComputeDAO - GPU Expansion"
                  desc="Active Yield Strategy"
                  apy="15.5% APY · 60d"
                  amount="$5,000.00"
                  earnings="+$387.50"
                  icon={<div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center font-black text-white text-[10px]">C</div>}
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('loka-nav-market'));
                    setTimeout(() => window.dispatchEvent(new CustomEvent('loka-open-asset', { detail: 'ComputeDAO' })), 100);
                  }}
                  action={
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.dispatchEvent(new CustomEvent('loka-nav-market'));
                          setTimeout(() => window.dispatchEvent(new CustomEvent('loka-open-asset', { detail: 'ComputeDAO' })), 100);
                        }}
                        className="px-4 py-1.5 bg-gray-100/80 text-black text-[11px] font-bold rounded-full hover:bg-gray-200 transition-colors shadow-sm"
                      >
                        Add
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.dispatchEvent(new CustomEvent('loka-nav-market'));
                          setTimeout(() => window.dispatchEvent(new CustomEvent('loka-open-asset', { detail: 'ComputeDAO' })), 100);
                        }}
                        className="px-4 py-1.5 bg-black text-white text-[11px] font-bold rounded-full hover:bg-gray-800 transition-colors shadow-sm"
                      >
                        Sell
                      </button>
                    </div>
                  }
                />
              </div>
            </section>
          ) : (
            <section className="space-y-4 animate-fadeIn">
              <div className="glass rounded-[32px] overflow-hidden bg-white shadow-sm border border-gray-100">
                <ActivityItem
                  title="Daily Interest Payout"
                  time="Today, 08:00 AM"
                  source="AIUSD"
                  amount="+$5.24"
                  type="INTEREST"
                  onSourceClick={() => window.dispatchEvent(new CustomEvent('loka-nav-swap'))}
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
                  source="ComputeDAO - GPU Expansion"
                  amount="+$5.10"
                  type="INTEREST"
                  onSourceClick={() => {
                    window.dispatchEvent(new CustomEvent('loka-nav-market'));
                    setTimeout(() => window.dispatchEvent(new CustomEvent('loka-open-asset', { detail: 'ComputeDAO' })), 100);
                  }}
                />
              </div>
            </section>
          )}
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
  progress?: string;
  action?: React.ReactNode;
  onClick?: () => void;
}> = ({ title, desc, apy, amount, earnings, icon, progress, action, onClick }) => (
  <div onClick={onClick} className="glass p-6 rounded-[32px] bg-white flex items-center justify-between hover:border-black/20 transition-all cursor-pointer group shadow-sm border-gray-100">
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
    <div className="flex items-center gap-6 text-right">
      <div>
        <p className="text-sm font-bold text-black">{amount}</p>
        <p className="text-[11px] font-bold text-green-600 mt-0.5">{earnings}</p>
      </div>
      {action && (
        <div onClick={(e) => e.stopPropagation()}>
          {action}
        </div>
      )}
    </div>
  </div>
);

const ActivityItem: React.FC<{ title: string; time: string; amount: string; type: 'INTEREST' | 'DEPOSIT'; source?: string; onSourceClick?: () => void }> = ({ title, time, amount, type, source, onSourceClick }) => (
  <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type === 'INTEREST' ? 'bg-green-50 text-green-500' : 'bg-gray-100 text-black'}`}>
        {type === 'INTEREST' ? '💰' : '⬇️'}
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-bold text-black">{title}</p>
          {source && (
            <>
              <span className="text-gray-300 text-[10px]">•</span>
              <span className="text-[11px] font-medium text-gray-400">
                From{' '}
                <span
                  onClick={onSourceClick}
                  className="font-bold text-black hover:text-blue-500 hover:underline cursor-pointer transition-colors"
                >
                  {source}
                </span>
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <p className="text-[10px] text-gray-400 font-medium">{time}</p>
        </div>
      </div>
    </div>
    <span className={`text-sm font-bold ${type === 'INTEREST' ? 'text-green-600' : 'text-black'}`}>{amount}</span>
  </div>
);

export default Portfolio;
