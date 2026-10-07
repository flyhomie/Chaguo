import React, { useState, useRef } from 'react';
import { ArrowLeft, X, Heart, ShieldCheck, Copy, CheckCircle2, Smartphone, DollarSign, Sparkles, Coins, QrCode, Wallet, ExternalLink, RefreshCw } from 'lucide-react';

interface CryptoWallet {
  id: string;
  name: string;
  symbol: string;
  network: string;
  address: string;
  badgeColor: string;
  qrBg: string;
  usdRate: number; // approximate rate in USD
}

const CRYPTO_WALLETS: CryptoWallet[] = [
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    network: 'Solana Mainnet-Beta',
    address: '7xKXtg2CW87d97TXJSDpbD5jBk4nKzT1pQ2m5v6Wz4xX',
    badgeColor: 'bg-cyan-500 text-neutral-950 font-black',
    qrBg: '#06b6d4',
    usdRate: 180,
  },
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin Native (SegWit)',
    address: 'bc1qx92kmnp4r8f3d0z2k8wls4g9w7y7a1v5chaguo2027',
    badgeColor: 'bg-amber-500 text-white font-black',
    qrBg: '#f59e0b',
    usdRate: 65000,
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'ERC-20 Mainnet / Arbitrum',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    badgeColor: 'bg-purple-600 text-white font-black',
    qrBg: '#9333ea',
    usdRate: 3500,
  },
  {
    id: 'usdt',
    name: 'Tether USD',
    symbol: 'USDT / USDC',
    network: 'TRC-20 / ERC-20 / Solana',
    address: 'TYu89zKxLm2Vp4QW9tR5vS3xY7zA1bC2d3E4f5g',
    badgeColor: 'bg-emerald-600 text-white font-black',
    qrBg: '#059669',
    usdRate: 1,
  },
  {
    id: 'bnb',
    name: 'BNB Chain',
    symbol: 'BNB',
    network: 'BEP-20 (Binance Smart Chain)',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    badgeColor: 'bg-yellow-500 text-neutral-950 font-black',
    qrBg: '#eab308',
    usdRate: 580,
  },
];

interface DonationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationsModal: React.FC<DonationsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'crypto' | 'mpesa'>('crypto');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [customAmountKsh, setCustomAmountKsh] = useState('1000');
  const [selectedWalletForQr, setSelectedWalletForQr] = useState<CryptoWallet | null>(CRYPTO_WALLETS[0]);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const [contributedTotal, setContributedTotal] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('chaguo_user_contributions');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [simulatedMsg, setSimulatedMsg] = useState('');

  if (!isOpen) return null;

  // iOS Edge Swipe Back Gesture Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = Math.abs(touchEndY - touchStartY.current);

    if (touchStartX.current < 100 && deltaX > 60 && deltaY < 80) {
      onClose();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleSimulateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(customAmountKsh, 10) || 1000;
    const newTotal = contributedTotal + amount;
    setContributedTotal(newTotal);
    try {
      localStorage.setItem('chaguo_user_contributions', newTotal.toString());
    } catch (err) {}

    setSimulatedMsg(`Pledge of KSH ${amount.toLocaleString()} recorded! Supporter badge updated.`);
    setTimeout(() => setSimulatedMsg(''), 4000);
  };

  const amountKshNum = parseFloat(customAmountKsh) || 1000;
  const amountUsdEst = (amountKshNum / 130).toFixed(2); // ~130 KSH per USD

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-900/85 backdrop-blur-sm overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="relative my-6 w-full max-w-xl bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 shadow-2xl text-neutral-900 dark:text-neutral-100 p-5 sm:p-6 space-y-5 rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Top-Left Back Button */}
        <div className="flex items-center justify-between border-b-2 border-neutral-900 dark:border-neutral-700 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-xl font-black text-xs uppercase transition-all shadow-xs border border-neutral-300 dark:border-neutral-700 shrink-0"
              title="Back (Swipe right from left edge on iOS)"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2 ml-1">
              <Coins className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />
              <h3 className="text-lg font-black uppercase tracking-tight">Decentralized Support</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-neutral-800 text-white hover:bg-red-600 transition-colors rounded-lg"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intro */}
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-600 text-emerald-900 dark:text-emerald-100 space-y-1 text-xs font-bold uppercase rounded-xl">
          <div className="flex items-center gap-2 text-xs font-black text-emerald-700 dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Support Uncensored Civic Transparency 2027</span>
          </div>
          <p className="normal-case text-[11px] leading-relaxed font-medium">
            100% borderless, transparent crypto donations powering voter rights education, parliamentary Hansard bill tracking, and legal defense for Kenyan youth advocates.
          </p>
        </div>

        {/* Tab Switcher: Crypto vs M-Pesa */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 rounded-xl font-black text-xs uppercase">
          <button
            onClick={() => setActiveTab('crypto')}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'crypto'
                ? 'bg-amber-500 text-neutral-950 shadow-md font-black'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Crypto Vault (SOL/BTC/ETH)</span>
          </button>

          <button
            onClick={() => setActiveTab('mpesa')}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'mpesa'
                ? 'bg-emerald-600 text-white shadow-md font-black'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>M-PESA Paybill</span>
          </button>
        </div>

        {/* CRYPTO TAB CONTENT */}
        {activeTab === 'crypto' && (
          <div className="space-y-4">
            {/* Crypto Wallet Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-black uppercase">
              {CRYPTO_WALLETS.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setSelectedWalletForQr(w)}
                  className={`px-3 py-1.5 rounded-xl border-2 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    selectedWalletForQr?.id === w.id
                      ? 'border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md'
                      : 'border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <span className={`px-1.5 py-0.2 rounded text-[9px] ${w.badgeColor}`}>{w.symbol}</span>
                  <span>{w.name}</span>
                </button>
              ))}
            </div>

            {/* Selected Wallet Detail & QR Code Card */}
            {selectedWalletForQr && (
              <div className="p-4 bg-neutral-950 text-white border-2 border-neutral-800 rounded-2xl space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] uppercase ${selectedWalletForQr.badgeColor}`}>
                      {selectedWalletForQr.symbol}
                    </span>
                    <span className="font-black text-sm uppercase text-white">{selectedWalletForQr.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">
                    {selectedWalletForQr.network}
                  </span>
                </div>

                {/* QR Code & Address Display */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  {/* QR Code Visual Box */}
                  <div className="sm:col-span-1 flex flex-col items-center justify-center p-3 bg-white text-neutral-900 rounded-xl border-2 border-neutral-700 shadow-md text-center space-y-1">
                    <QrCode className="w-20 h-20 text-neutral-900" />
                    <span className="text-[9px] font-black uppercase tracking-wider text-neutral-700">
                      Scan in Wallet App
                    </span>
                  </div>

                  {/* Address Copy & Calculation */}
                  <div className="sm:col-span-2 space-y-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-1">
                        Official {selectedWalletForQr.symbol} Receiving Address:
                      </label>
                      <div className="p-2.5 bg-neutral-900 border border-neutral-700 rounded-xl flex items-center justify-between gap-2">
                        <code className="text-xs font-mono font-black text-amber-400 truncate">
                          {selectedWalletForQr.address}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedWalletForQr.address, selectedWalletForQr.id)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-[10px] font-black uppercase rounded-lg flex items-center gap-1 shrink-0 transition-all shadow-sm"
                        >
                          {copiedField === selectedWalletForQr.id ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedField === selectedWalletForQr.id ? 'COPIED' : 'COPY'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Estimator */}
                    <div className="p-2 bg-neutral-900/90 border border-neutral-800 rounded-lg text-[10px] font-bold text-neutral-300 flex items-center justify-between">
                      <span>Approx. Donation Rate:</span>
                      <span className="font-mono text-amber-400 font-black">
                        ~{((parseFloat(amountUsdEst) || 10) / selectedWalletForQr.usdRate).toFixed(5)} {selectedWalletForQr.symbol} (~${amountUsdEst} USD)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* List of All Other Supported Crypto Addresses */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">
                All Supported Crypto Vaults
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                {CRYPTO_WALLETS.map((wallet) => (
                  <div
                    key={wallet.id}
                    onClick={() => setSelectedWalletForQr(wallet)}
                    className={`p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 rounded-xl flex items-center justify-between gap-2 cursor-pointer transition-all ${
                      selectedWalletForQr?.id === wallet.id
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.2 text-[8px] rounded ${wallet.badgeColor}`}>
                          {wallet.symbol}
                        </span>
                        <span className="font-black text-xs uppercase truncate">{wallet.name}</span>
                      </div>
                      <span className="text-[9px] font-mono text-neutral-500 truncate block">
                        {wallet.address}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(wallet.address, wallet.id);
                      }}
                      className="p-1.5 bg-neutral-900 text-white dark:bg-neutral-700 rounded-lg text-[9px] font-black uppercase hover:bg-amber-500 hover:text-neutral-950 transition-colors shrink-0"
                    >
                      {copiedField === wallet.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* M-PESA TAB CONTENT */}
        {activeTab === 'mpesa' && (
          <div className="p-4 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 font-black text-sm uppercase">
              <Smartphone className="w-5 h-5 text-emerald-600" />
              <span>M-PESA Mobile Money Instructions</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl">
                <div>
                  <span className="text-[10px] text-neutral-500 block uppercase font-bold">Buy Goods Till Number:</span>
                  <span className="font-black text-lg text-emerald-600 font-mono">522522</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('522522', 'till')}
                  className="px-3 py-1.5 bg-neutral-900 dark:bg-neutral-700 text-white text-[10px] font-black uppercase rounded-lg flex items-center gap-1 hover:bg-emerald-600 transition-colors"
                >
                  {copiedField === 'till' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'till' ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl">
                <div>
                  <span className="text-[10px] text-neutral-500 block uppercase font-bold">Account Reference:</span>
                  <span className="font-black text-base text-red-600 dark:text-red-400 font-mono">CHAGUO2027</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('CHAGUO2027', 'account')}
                  className="px-3 py-1.5 bg-neutral-900 dark:bg-neutral-700 text-white text-[10px] font-black uppercase rounded-lg flex items-center gap-1 hover:bg-emerald-600 transition-colors"
                >
                  {copiedField === 'account' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'account' ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Local Supporter Pledge Calculator Form */}
        <form onSubmit={handleSimulateDonation} className="p-4 bg-emerald-950/20 border-2 border-emerald-600 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-black text-xs text-emerald-700 dark:text-emerald-400 uppercase">
              Record Local Support Pledge:
            </label>
            {contributedTotal > 0 && (
              <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black uppercase rounded">
                RECORDED: KSH {contributedTotal.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-xs font-black text-neutral-500">KSH</span>
              <input
                type="number"
                value={customAmountKsh}
                onChange={(e) => setCustomAmountKsh(e.target.value)}
                placeholder="Amount in KSH"
                className="w-full pl-12 pr-3 py-2 bg-white dark:bg-neutral-900 border-2 border-neutral-700 font-black text-sm rounded-xl"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-xl shrink-0 transition-colors shadow-md"
            >
              RECORD PLEDGE
            </button>
          </div>

          {simulatedMsg && (
            <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 normal-case">
              ✓ {simulatedMsg}
            </p>
          )}
        </form>

        <p className="text-[10px] text-center text-neutral-500 font-bold uppercase">
          🔒 100% borderless, transparent & civic-funded.
        </p>
      </div>
    </div>
  );
};
