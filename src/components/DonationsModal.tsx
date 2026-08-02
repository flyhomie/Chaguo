import React, { useState } from 'react';
import { X, Heart, ShieldCheck, Copy, CheckCircle2, Smartphone, DollarSign, Sparkles, Coins, QrCode, Wallet } from 'lucide-react';

interface CryptoWallet {
  id: string;
  name: string;
  symbol: string;
  network: string;
  address: string;
  badgeColor: string;
}

const CRYPTO_WALLETS: CryptoWallet[] = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin Native (SegWit)',
    address: 'bc1qx92kmnp4r8f3d0z2k8wls4g9w7y7a1v5chaguo2027',
    badgeColor: 'bg-amber-500 text-white',
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'ERC-20 Mainnet',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    badgeColor: 'bg-purple-600 text-white',
  },
  {
    id: 'usdt',
    name: 'Tether USD',
    symbol: 'USDT / USDC',
    network: 'TRC-20 / ERC-20',
    address: 'TYu89zKxLm2Vp4QW9tR5vS3xY7zA1bC2d3E4f5g',
    badgeColor: 'bg-emerald-600 text-white',
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    network: 'Solana Mainnet-Beta',
    address: '7xKXtg2CW87d97TXJSDpbD5jBk4nKzT1pQ2m5v6Wz4xX',
    badgeColor: 'bg-cyan-600 text-white',
  },
];

interface DonationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationsModal: React.FC<DonationsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'mpesa' | 'crypto'>('crypto');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState('500');
  const [solAddress, setSolAddress] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('chaguo_custom_sol_address');
      return saved || '7xKXtg2CW87d97TXJSDpbD5jBk4nKzT1pQ2m5v6Wz4xX';
    } catch {
      return '7xKXtg2CW87d97TXJSDpbD5jBk4nKzT1pQ2m5v6Wz4xX';
    }
  });
  const [isEditingSol, setIsEditingSol] = useState(false);
  const [tempSolInput, setTempSolInput] = useState('');

  const [contributedTotal, setContributedTotal] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('chaguo_user_contributions');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [simulatedMsg, setSimulatedMsg] = useState('');

  const handleSaveSolAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempSolInput.trim()) {
      setSolAddress(tempSolInput.trim());
      try {
        localStorage.setItem('chaguo_custom_sol_address', tempSolInput.trim());
      } catch (err) {}
      setIsEditingSol(false);
    }
  };

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleSimulateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(customAmount, 10) || 500;
    const newTotal = contributedTotal + amount;
    setContributedTotal(newTotal);
    try {
      localStorage.setItem('chaguo_user_contributions', newTotal.toString());
    } catch (err) {}

    setSimulatedMsg(`Thank you! Support of ${amount} saved to your local profile.`);
    setTimeout(() => setSimulatedMsg(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative my-8 w-full max-w-lg bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 shadow-2xl text-neutral-900 dark:text-neutral-100 p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-neutral-900 dark:border-neutral-700 pb-4">
          <div className="flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-emerald-600 fill-emerald-600" />
            <h3 className="text-xl font-black uppercase tracking-tight">Support Civic Transparency</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-neutral-800 text-white hover:bg-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intro */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-600 text-emerald-900 dark:text-emerald-100 space-y-2 text-xs font-bold uppercase">
          <div className="flex items-center gap-2 text-sm font-black text-emerald-700 dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Powering Kenyan Voter Awareness for 2027</span>
          </div>
          <p className="normal-case leading-relaxed font-semibold">
            Chaguo 2027 is a community-driven initiative built to empower Kenyan voters with verified voting records, legal integrity tracking, and grassroots accountability.
          </p>
        </div>

        {/* Support Initiatives */}
        <div className="space-y-4 text-xs font-bold uppercase">
          <h4 className="font-black text-xs tracking-wider text-neutral-500 uppercase">
            Direct Impact Causes
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700">
              <span className="text-red-600 dark:text-red-400 font-black">🏥 Legal & Medical Defense</span>
              <p className="text-[10px] text-neutral-500 normal-case mt-1">
                Supporting emergency bail and medical care for peaceful youth advocates.
              </p>
            </div>
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700">
              <span className="text-emerald-600 dark:text-emerald-400 font-black">📜 Parliamentary Audits</span>
              <p className="text-[10px] text-neutral-500 normal-case mt-1">
                Fact-checking Finance Bills 2024/2025 and Hansard legislative voting records.
              </p>
            </div>
          </div>

          {/* Support Options Tab Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-black text-xs uppercase">
            <button
              onClick={() => setActiveTab('mpesa')}
              className={`py-2 flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'mpesa'
                  ? 'bg-neutral-900 text-white dark:bg-emerald-600 dark:text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>M-PESA MOBILE MONEY</span>
            </button>
            <button
              onClick={() => setActiveTab('crypto')}
              className={`py-2 flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'crypto'
                  ? 'bg-neutral-900 text-white dark:bg-emerald-600 dark:text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>CRYPTO DONATIONS</span>
            </button>
          </div>

          {/* M-Pesa Paybill / Till Details */}
          {activeTab === 'mpesa' ? (
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 space-y-3">
              <div className="flex items-center gap-2 font-black text-sm">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span>M-PESA / Mobile Money Support</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
                  <div>
                    <span className="text-[10px] text-neutral-500 block">Buy Goods Till Number:</span>
                    <span className="font-black text-sm">522522</span>
                  </div>
                  <button
                    onClick={() => handleCopy('522522', 'till')}
                    className="px-2.5 py-1 bg-neutral-900 dark:bg-neutral-700 text-white text-[10px] font-black uppercase flex items-center gap-1 hover:bg-emerald-600 transition-colors"
                  >
                    {copiedField === 'till' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'till' ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
                  <div>
                    <span className="text-[10px] text-neutral-500 block">Account Reference:</span>
                    <span className="font-black text-sm text-red-600 dark:text-red-400">CHAGUO2027</span>
                  </div>
                  <button
                    onClick={() => handleCopy('CHAGUO2027', 'account')}
                    className="px-2.5 py-1 bg-neutral-900 dark:bg-neutral-700 text-white text-[10px] font-black uppercase flex items-center gap-1 hover:bg-emerald-600 transition-colors"
                  >
                    {copiedField === 'account' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'account' ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Crypto Wallets Section */
            <div className="space-y-3">
              <div className="p-3 bg-neutral-900 text-white border-2 border-neutral-900 flex items-center justify-between text-xs font-black uppercase">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-cyan-400" />
                  <span>DECENTRALIZED CRYPTO VAULT</span>
                </div>
                <span className="text-[10px] text-cyan-400 font-mono">SOLANA FEATURED</span>
              </div>

              {/* Solana Featured Box */}
              <div className="p-4 bg-cyan-950/20 dark:bg-cyan-950/40 border-2 border-cyan-500 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-cyan-500 text-neutral-950">
                      SOL
                    </span>
                    <span className="font-black text-sm text-cyan-700 dark:text-cyan-300">Solana Network (SOL)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTempSolInput(solAddress);
                      setIsEditingSol(!isEditingSol);
                    }}
                    className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    {isEditingSol ? 'Cancel' : 'Set Custom Address'}
                  </button>
                </div>

                {isEditingSol ? (
                  <form onSubmit={handleSaveSolAddress} className="space-y-2 pt-1">
                    <input
                      type="text"
                      value={tempSolInput}
                      onChange={(e) => setTempSolInput(e.target.value)}
                      placeholder="Paste your Solana wallet address..."
                      className="w-full p-2 text-xs font-mono font-bold bg-white dark:bg-neutral-900 border border-cyan-500"
                    />
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] font-black uppercase tracking-wider"
                    >
                      SAVE SOLANA ADDRESS
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between gap-2 p-2.5 bg-white dark:bg-neutral-900 border border-cyan-400">
                    <code className="text-xs font-mono font-bold truncate text-cyan-900 dark:text-cyan-200">
                      {solAddress}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopy(solAddress, 'sol_main')}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] font-black uppercase flex items-center gap-1 shrink-0 transition-colors"
                    >
                      {copiedField === 'sol_main' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'sol_main' ? 'COPIED SOL' : 'COPY SOL'}</span>
                    </button>
                  </div>
                )}
                <p className="text-[9px] text-neutral-500 font-semibold uppercase">
                  ⚡ Fast & low-fee decentralized donations over Solana Mainnet-Beta.
                </p>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {CRYPTO_WALLETS.filter(w => w.id !== 'sol').map((wallet) => (
                  <div
                    key={wallet.id}
                    className="p-3 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${wallet.badgeColor}`}>
                          {wallet.symbol}
                        </span>
                        <span className="font-black text-xs">{wallet.name}</span>
                      </div>
                      <span className="text-[9px] font-bold text-neutral-500 uppercase">{wallet.network}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
                      <code className="text-[10px] font-mono font-bold truncate text-neutral-800 dark:text-neutral-200">
                        {wallet.address}
                      </code>
                      <button
                        onClick={() => handleCopy(wallet.address, wallet.id)}
                        className="px-2.5 py-1 bg-neutral-900 dark:bg-neutral-700 text-white text-[10px] font-black uppercase flex items-center gap-1 hover:bg-emerald-600 shrink-0 transition-colors"
                      >
                        {copiedField === wallet.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === wallet.id ? 'COPIED' : 'COPY'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Simulate / Record Local Support */}
          <form onSubmit={handleSimulateDonation} className="p-4 bg-emerald-950/20 border-2 border-emerald-600 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-black text-xs text-emerald-700 dark:text-emerald-400">
                Pledge Local Support Badge:
              </label>
              {contributedTotal > 0 && (
                <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black">
                  RECORDED: KSH {contributedTotal}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Amount in KSH"
                className="w-full p-2 bg-white dark:bg-neutral-900 border border-neutral-700 font-black text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase shrink-0 transition-colors"
              >
                PLEDGE
              </button>
            </div>

            {simulatedMsg && (
              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 normal-case">
                ✓ {simulatedMsg}
              </p>
            )}
          </form>

          <p className="text-[10px] text-center text-neutral-500 font-bold uppercase">
            🔒 All contributions directly fund voter rights education & transparent MP monitoring.
          </p>
        </div>
      </div>
    </div>
  );
};
