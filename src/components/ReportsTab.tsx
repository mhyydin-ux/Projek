import React, { useState } from 'react';
import { 
  FileText, TrendingUp, TrendingDown, BookOpen, AlertCircle, CheckCircle2,
  Settings, UserCheck, MessageSquare, FileSpreadsheet, Phone, 
  Mail, Save, ShieldCheck, ChevronRight, Store, QrCode,
  Users, Lock, Trash2, Key, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Transaction } from '../types';

interface ReportsTabProps {
  products: Product[];
  transactions: Transaction[];
  businessSettings: {
    shopName: string;
    address: string;
    whatsapp: string;
    email: string;
    loyaltyRate: number;
    sendReceipt: boolean;
    sendBalance: boolean;
  };
  onSaveSettings: (settings: any) => void;
  accounts: any[];
  onAddAccount: (acc: any) => void;
  onChangePassword: (accId: string, newPass: string) => void;
  onDeleteAccount: (accId: string) => void;
  onResetApplicationData: () => void;
  currentUser?: any;
}

export default function ReportsTab({
  products,
  transactions,
  businessSettings,
  onSaveSettings,
  accounts,
  onAddAccount,
  onChangePassword,
  onDeleteAccount,
  onResetApplicationData,
  currentUser
}: ReportsTabProps) {
  const [timeframe, setTimeframe] = useState<'Today' | 'Weekly' | 'Monthly' | 'Custom'>('Today');
  
  // Custom Date range states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Custom alert / toast / modaler states
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [deleteAccountTarget, setDeleteAccountTarget] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Local form states for creating/updating staff accounts
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffUsername, setNewStaffUsername] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'Admin' | 'Staff'>('Staff');

  // Local state for password change target
  const [passwordChangeTarget, setPasswordChangeTarget] = useState('');
  const [newSecurityPassword, setNewSecurityPassword] = useState('');

  // Business Profile Settings Form fields
  const [shopName, setShopName] = useState(businessSettings.shopName);
  const [address, setAddress] = useState(businessSettings.address);
  const [whatsapp, setWhatsapp] = useState(businessSettings.whatsapp);
  const [email, setEmail] = useState(businessSettings.email);
  const [loyaltyRate, setLoyaltyRate] = useState(businessSettings.loyaltyRate);
  const [sendReceipt, setSendReceipt] = useState(businessSettings.sendReceipt);
  const [sendBalance, setSendBalance] = useState(businessSettings.sendBalance);

  // Helper to parse dates in Indonesian format e.g. "24 Okt 2023" to JS Date object
  const parseTxDate = (txDateStr: string): Date => {
    const monthMap: Record<string, number> = {
      'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'mei': 4, 'jun': 5,
      'jul': 6, 'agu': 7, 'sep': 8, 'okt': 9, 'nov': 10, 'des': 11
    };
    
    const clean = txDateStr.toLowerCase();
    const parts = clean.split(' ');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const monthStr = parts[1].substring(0, 3);
      const year = parseInt(parts[2], 10);
      const month = monthMap[monthStr] !== undefined ? monthMap[monthStr] : 5;
      return new Date(year, month, day);
    }
    return new Date();
  };

  // Filter transactions based on selected timeframe
  const filteredTxs = transactions.filter(tx => {
    const txDate = parseTxDate(tx.date);
    txDate.setHours(0,0,0,0);
    const now = new Date();
    
    if (timeframe === 'Today') {
      const today = new Date();
      today.setHours(0,0,0,0);
      return txDate.getTime() === today.getTime();
    } else if (timeframe === 'Weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      weekAgo.setHours(0,0,0,0);
      return txDate >= weekAgo;
    } else if (timeframe === 'Monthly') {
      const monthAgo = new Date();
      monthAgo.setDate(now.getDate() - 30);
      monthAgo.setHours(0,0,0,0);
      return txDate >= monthAgo;
    } else if (timeframe === 'Custom') {
      if (startDate) {
        const s = new Date(startDate);
        s.setHours(0,0,0,0);
        if (txDate < s) return false;
      }
      if (endDate) {
        const e = new Date(endDate);
        e.setHours(23,59,59,999);
        if (txDate > e) return false;
      }
      return true;
    }
    return true;
  });

  // Calculate dynamic stats from filtered transactions
  const totalSales = filteredTxs.reduce((sum, tx) => sum + tx.total, 0);
  const totalProfit = filteredTxs.reduce((sum, tx) => sum + (tx.total * 0.35), 0);
  const averageTx = filteredTxs.length > 0 ? totalSales / filteredTxs.length : 0;

  const handleSaveAll = () => {
    onSaveSettings({
      shopName,
      address,
      whatsapp,
      email,
      loyaltyRate,
      sendReceipt,
      sendBalance
    });
    showToast('Informasi profil toko, loyalti poin, dan konfigurasi WhatsApp berhasil diperbarui!', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Sales Reports Section */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#c5c5d3]">
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#0b1c30]">Sales Reports</h2>
            <p className="text-xs text-[#757682] mt-1">Overview of your business performance.</p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto w-full md:w-auto">
            <button 
              onClick={() => showToast('Mengekspor laporan penjualan ke berkas PDF...', 'info')}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-[#00236f] text-[#00236f] rounded-xl text-xs font-bold hover:bg-[#f8f9ff] transition-colors shadow-sm cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Export to PDF</span>
            </button>
            <button 
              onClick={() => showToast('Mengunduh tabulasi laporan excel...', 'info')}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#00236f] text-white rounded-xl text-xs font-bold hover:bg-[#1e3a8a] transition-colors shadow-sm cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export to Excel</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 border-b border-gray-100 mb-6">
          {(['Today', 'Weekly', 'Monthly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                timeframe === t
                  ? 'bg-[#00236f] text-white shadow-sm'
                  : 'bg-gray-100 text-[#444651] hover:bg-gray-200'
              }`}
            >
              {t === 'Today' ? 'Today' : t === 'Weekly' ? 'Weekly' : 'Monthly'}
            </button>
          ))}
          <button 
            onClick={() => setTimeframe('Custom')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              timeframe === 'Custom'
                ? 'bg-[#00236f] text-white shadow-sm'
                : 'bg-gray-100 text-[#444651] hover:bg-gray-200'
            }`}
          >
            <span>Custom</span>
            <span>📅</span>
          </button>
        </div>

        {/* Custom Date Range Selectors */}
        {timeframe === 'Custom' && (
          <div className="flex flex-col sm:flex-row gap-4 items-end mb-6 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Mulai Tanggal</label>
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs outline-none focus:border-[#00236f]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Sampai Tanggal</label>
              <input 
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs outline-none focus:border-[#00236f]"
              />
            </div>
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold transition-all text-gray-600 active:scale-95 cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Metrics Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Card 1 */}
          <div className="p-5 bg-[#f8f9ff] border border-[#c5c5d3] rounded-2xl flex flex-col justify-between min-h-[120px]">
            <div className="flex justify-between items-start text-xs text-[#444651] font-semibold">
              <p>Total Sales</p>
              <span className="p-1 px-2 rounded-md bg-[#e5eeff] text-[#00236f] font-mono font-bold">POS</span>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-[#00236f]">Rp {totalSales.toLocaleString('id-ID')}</h3>
              <div className="flex items-center text-[#006c49] text-[10px] font-bold mt-1.5">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                <span>+15% vs yesterday</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-5 bg-[#f8f9ff] border border-[#c5c5d3] rounded-2xl flex flex-col justify-between min-h-[120px]">
            <div className="flex justify-between items-start text-xs text-[#444651] font-semibold">
              <p>Total Profit</p>
              <span className="p-1 px-2 rounded-md bg-green-100 text-green-700 font-mono font-bold">Laba</span>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-gray-800 font-mono">Rp {totalProfit.toLocaleString('id-ID')}</h3>
              <div className="flex items-center text-[#006c49] text-[10px] font-bold mt-1.5">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                <span>+8% vs yesterday</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-5 bg-[#f8f9ff] border border-[#c5c5d3] rounded-2xl flex flex-col justify-between min-h-[120px]">
            <div className="flex justify-between items-start text-xs text-[#444651] font-semibold">
              <p>Average Transaction</p>
              <span className="p-1 px-2 rounded-md bg-gray-200 text-gray-700 font-mono font-bold">Rata2</span>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-gray-800 font-mono">Rp {averageTx.toLocaleString('id-ID')}</h3>
              <div className="flex items-center text-red-600 text-[10px] font-bold mt-1.5">
                <TrendingDown className="w-3.5 h-3.5 mr-1" />
                <span>-2% vs yesterday</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Charts Lists Sub-section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Products list */}
          <div className="p-5 bg-white border border-gray-100 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#0b1c30]">Top Selling Products</h3>
              <span className="text-[#00236f] text-xs font-bold">Live</span>
            </div>
            <div className="space-y-3.5">
              {/* Item 1 */}
              <div className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-150">
                    <img 
                      alt="" 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1cUKRAz91tRZXCV-a5jE0qa4WFtjh9LEVtfnKmahFLzIjRSOinI0BbJXidX0TxGk7jBSC4R1zia3EGMedgUlEYL50B4bW7XBZ69pnlnOivITA2gC_SgKm-PHfB2X7BNhTes_yYKjo5vKYOZofLxyBSwN-hpZxPkYPNznVW8KxZddoiD7bgSS8QmCFudP4xFV1kCbgX4LV-sq5AAmFHPVGYm9ywQeGciHWRrlAEZQfkaXAKsoudfs3pAji6796_AdtBPhkVjwczwk" 
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0b1c30]">Arabica House Blend 250g</h4>
                    <p className="text-[10px] text-[#757682] mt-0.5">Beverages • SKU: AB-250</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#00236f]">42</span>
                  <span className="block text-[9px] text-[#757682] uppercase tracking-wider">Sold</span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-150">
                    <img 
                      alt="" 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuThmvBoEUHVZt2_h5rjvkr6t3DZifbcZWOprKumkmJlIgcV7vyvR9xCcpBTKC2fc_KY46cIiCM1xmBznMt4KG5ueSohM3f0J68XoxTUbJ_XYbjgKQhijqdCBiqL5NVHNhcpRb4s5UVRZsX8Fgy_9ms8ZlUEpjT-bwTpg9XXJvqhRG89kWSCTDqyVOGkIwaej_ohLQ57ijwzcJ-zu2FOMcEj7WD6BDUP8oQETPoFh71dTSj0ZYHtcxuHAMMhhYg3KXPyxeWlZcSShk" 
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0b1c30]">Ceramic Mug Minimalist</h4>
                    <p className="text-[10px] text-[#757682] mt-0.5">Merchandise • SKU: MG-WHT</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#00236f]">28</span>
                  <span className="block text-[9px] text-[#757682] uppercase tracking-wider">Sold</span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2.5 font-sans">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#e5eeff] flex items-center justify-center text-xs font-bold font-mono">
                    ☕
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0b1c30]">Caramel Macchiato (Iced)</h4>
                    <p className="text-[10px] text-[#757682] mt-0.5">Ready to Drink • SKU: CM-ICE</p>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <span className="text-sm font-bold text-[#00236f]">15</span>
                  <span className="block text-[9px] text-[#757682] uppercase tracking-wider">Sold</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods breakdown */}
          <div className="p-5 bg-white border border-gray-100 rounded-2xl flex flex-col justify-between">
            <h3 className="text-sm font-bold text-[#0b1c30] mb-4">Payment Methods</h3>
            <div className="space-y-4">
              {/* QRIS */}
              <div>
                <div className="flex justify-between items-end mb-1 text-xs">
                  <span className="text-[#0b1c30] font-bold">QRIS (65%)</span>
                  <span className="text-[#757682]">Rp {(totalSales * 0.65).toLocaleString('id-ID')}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00236f] rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>

              {/* Transfer */}
              <div>
                <div className="flex justify-between items-end mb-1 text-xs">
                  <span className="text-[#0b1c30] font-bold">E-Wallet / Transfer (25%)</span>
                  <span className="text-[#757682]">Rp {(totalSales * 0.25).toLocaleString('id-ID')}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>

              {/* Cash */}
              <div>
                <div className="flex justify-between items-end mb-1 text-xs">
                  <span className="text-[#0b1c30] font-bold">Tunai (10%)</span>
                  <span className="text-[#757682]">Rp {(totalSales * 0.1).toLocaleString('id-ID')}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-400 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
            <div className="h-4"></div>
          </div>
        </div>
      </section>

      {/* Business Configurations Section (Settings) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
        {/* Left Column Settings: Shop Info */}
        <section className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-[#c5c5d3] relative overflow-hidden flex flex-col justify-between gap-5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00236f]/5 rounded-bl-full pointer-events-none"></div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e5eeff] text-[#00236f] flex items-center justify-center shrink-0">
              <Store className="w-5 h-5 text-[#00236f]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0b1c30]">Business Profile</h3>
              <p className="text-[10px] text-[#757682] mt-0.5">Kelola identitas publik dan kontak pelanggan Anda.</p>
            </div>
          </div>

          {/* Form input fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#444651] mb-1">Nama Toko (Shop Name)</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#c5c5d3] rounded-lg text-xs font-bold text-[#0b1c30] focus:ring-1 focus:ring-[#00236f] focus:border-[#00236f] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#444651] mb-1">Alamat Bisnis</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#c5c5d3] rounded-lg text-xs font-medium text-[#0b1c30] focus:ring-1 focus:ring-[#00236f] focus:border-[#00236f] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#444651] mb-1">WhatsApp (CS Contact Office)</label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757682]" />
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#c5c5d3] rounded-lg text-xs font-mono text-[#0b1c30] focus:ring-1 focus:ring-[#00236f] focus:border-[#00236f] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444651] mb-1">Email Dukungan (Support Email)</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757682]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#c5c5d3] rounded-lg text-xs text-[#0b1c30] focus:ring-1 focus:ring-[#00236f] focus:border-[#00236f] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column Settings: Loyalty point rates & configs */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Loyalty settings card */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#c5c5d3] space-y-4">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-10 h-10 rounded-full bg-[#eff4ff] text-[#006c49] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#006c49]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0b1c30]">Aturan Loyalitas Program</h3>
                <p className="text-[10px] text-[#757682]">Kelola skema insentif member points.</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#444651] mb-1.5">Skema Poin Per Transaksi</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#757682] whitespace-nowrap">Rasio Pembelian</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#757682]">Rp</span>
                    <input
                      type="number"
                      value={loyaltyRate}
                      onChange={(e) => setLoyaltyRate(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2 bg-white border border-[#c5c5d3] rounded-lg text-xs text-[#0b1c30]"
                    />
                  </div>
                  <span className="text-xs text-[#757682]">＝</span>
                  <div className="w-20 bg-gray-50 border border-[#c5c5d3] p-2 text-center rounded-lg text-xs font-bold text-[#00236f] select-none">
                    1 Pt
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications and QRIS configs */}
          <div className="space-y-4 bg-white rounded-2xl p-6 shadow-sm border border-[#c5c5d3]">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <div className="w-8 h-8 bg-[#f8f9ff] text-[#00236f] rounded-full flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#0b1c30]">Resi Notifikasi & Pembayaran</h3>
            </div>

            {/* Configs */}
            <div className="space-y-4 text-xs font-semibold text-[#444651]">
              <div className="flex justify-between items-center">
                <span>Kirim Resi Otomatis via WhatsApp</span>
                <input
                  type="checkbox"
                  checked={sendReceipt}
                  onChange={(e) => setSendReceipt(e.target.checked)}
                  className="rounded text-[#00236f]"
                />
              </div>

              <div className="flex justify-between items-center">
                <span>Kirim Update Saldo Poin ke Pelanggan</span>
                <input
                  type="checkbox"
                  checked={sendBalance}
                  onChange={(e) => setSendBalance(e.target.checked)}
                  className="rounded text-[#00236f]"
                />
              </div>

              {/* QRIS bank */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#eff4ff] border border-[#dce9ff] rounded-lg text-xs flex items-center justify-center">
                    📲
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0b1c30]">Dynamic QRIS</h4>
                    <p className="text-[10px] text-[#757682] font-normal">Konektivitas Bank BCA</p>
                  </div>
                </div>
                <span className="bg-[#6cf8bb] text-[#00714d] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-[#6cf8bb]">Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Staff Accounts Management & Security Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-8">
        
        {/* User accounts block - 8 Cols */}
        <section className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-[#c5c5d3] space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <div className="w-10 h-10 rounded-full bg-[#eff4ff] text-[#00236f] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-[#00236f]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0b1c30]">Manajemen Keamanan Akun Kasir & Staff</h3>
              <p className="text-[10px] text-[#757682]">Buat akun kasir baru dan kelola konfigurasi kata sandi keamanan.</p>
            </div>
          </div>

          {currentUser?.role !== 'Admin' ? (
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3 text-amber-850">
              <Lock className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold">Akses Terbatas: Mode Staff</h4>
                <p className="text-[10px] text-amber-700 leading-relaxed mt-0.5">Hanya pengguna bersatus Administrator (Owner) yang memiliki otorisasi penuh untuk menambah kasir baru, mengganti kata sandi, atau menghapus personil staff.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* List of current accounts */}
              <div>
                <h4 className="text-xs font-bold text-[#00236f] mb-3">Daftar Karyawan Aktif</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4 border-b border-gray-100">
                  {accounts.map((acc: any) => {
                    const isSelf = acc.username === currentUser?.username;
                    return (
                      <div key={acc.id} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                            {acc.name}
                            {isSelf && <span className="text-[9px] bg-[#6cf8bb] text-[#00714d] font-bold px-1.5 py-0.2 rounded">Anda</span>}
                          </p>
                          <p className="text-[10px] text-[#757682] font-mono mt-0.5">Username: {acc.username} • Role: {acc.role}</p>
                        </div>
                        
                        {!isSelf && (
                          <button
                            onClick={() => setDeleteAccountTarget(acc)}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 cursor-pointer active:scale-95 transition-all"
                            title="Hapus Staff"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form grid: Create Staff & Change Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
                {/* Create Account Column */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                    <UserCheck className="w-4.5 h-4.5 text-green-600" />
                    Registrasi Akun Baru
                  </h4>
                  
                  <div className="space-y-2.5 text-xs font-semibold">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-650 mb-1">Nama Lengkap</label>
                      <input 
                        type="text"
                        placeholder="Nama Staff (contoh: Ahmad Roni)"
                        value={newStaffName}
                        onChange={(e) => setNewStaffName(e.target.value)}
                        className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-650 mb-1">Username Login</label>
                      <input 
                        type="text"
                        placeholder="username (contoh: roni1)"
                        value={newStaffUsername}
                        onChange={(e) => setNewStaffUsername(e.target.value)}
                        className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-normal font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-650 mb-1">Peran / Role</label>
                        <select 
                          value={newStaffRole}
                          onChange={(e: any) => setNewStaffRole(e.target.value)}
                          className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-normal"
                        >
                          <option value="Staff">Staff / Kasir</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-650 mb-1">Kata Sandi</label>
                        <input 
                          type="password"
                          placeholder="Password"
                          value={newStaffPassword}
                          onChange={(e) => setNewStaffPassword(e.target.value)}
                          className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-normal font-mono"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!newStaffName.trim() || !newStaffUsername.trim() || !newStaffPassword.trim()) {
                          showToast('Mohon lengkapi seluruh kolom isian untuk mendaftarkan akun staff!', 'error');
                          return;
                        }
                        if (accounts.some((a: any) => a.username.toLowerCase() === newStaffUsername.trim().toLowerCase())) {
                          showToast('Username sudah terpakai oleh staff lainnya. Mohon pilih username unik!', 'error');
                          return;
                        }
                        onAddAccount({
                          id: `acc-${Date.now()}`,
                          name: newStaffName,
                          username: newStaffUsername.trim().toLowerCase(),
                          role: newStaffRole,
                          passwordHash: newStaffPassword
                        });
                        showToast(`Berhasil mendaftarkan akun ${newStaffRole} baru dengan nama "${newStaffName}"!`, 'success');
                        setNewStaffName('');
                        setNewStaffUsername('');
                        setNewStaffPassword('');
                        setNewStaffRole('Staff');
                      }}
                      className="w-full mt-2 py-2.5 bg-[#00236f] text-white font-bold text-xs rounded-xl hover:bg-opacity-95 text-center cursor-pointer active:scale-95 transition-all shadow-sm"
                    >
                      Daftarkan Akun Baru
                    </button>
                  </div>
                </div>

                {/* Change Password Column */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#0b1c30] flex items-center gap-1.5">
                    <Key className="w-4.5 h-4.5 text-amber-500" />
                    Ubah Kata Sandi Akun
                  </h4>
                  
                  <div className="space-y-2.5 text-xs font-semibold">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-650 mb-1">Pilih Personil Staff</label>
                      <select
                        value={passwordChangeTarget}
                        onChange={(e) => setPasswordChangeTarget(e.target.value)}
                        className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-normal"
                      >
                        <option value="">-- Pilih Akun Staff --</option>
                        {accounts.map((acc: any) => (
                          <option key={acc.id} value={acc.id}>{acc.name} ({acc.role})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-650 mb-1">Kata Sandi Baru</label>
                      <input 
                        type="password"
                        placeholder="Ketik password baru disini"
                        value={newSecurityPassword}
                        onChange={(e) => setNewSecurityPassword(e.target.value)}
                        className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs font-normal"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!passwordChangeTarget) {
                          showToast('Mohon pilih akun personil staff terlebih dahulu!', 'error');
                          return;
                        }
                        if (!newSecurityPassword.trim()) {
                          showToast('Mohon ketik kata sandi keamanan baru!', 'error');
                          return;
                        }
                        onChangePassword(passwordChangeTarget, newSecurityPassword.trim());
                        showToast('Berhasil memperbarui kata sandi akun staff.', 'success');
                        setPasswordChangeTarget('');
                        setNewSecurityPassword('');
                      }}
                      className="w-full mt-2 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-opacity-95 text-center cursor-pointer active:scale-95 transition-all shadow-sm"
                    >
                      Ubah Password Akun
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Danger zone Reset module - 4 Cols */}
        <section className="lg:col-span-4 bg-red-50/40 rounded-2xl p-6 shadow-sm border border-red-100 flex flex-col justify-between min-h-[340px]">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
              <span>Area Bahaya (Danger Zone)</span>
            </div>
            
            <p className="text-[11px] text-[#444651] leading-relaxed">
              Fasilitas ini disediakan untuk melakukan **Pembersihan Bersih (Clean Reset)**. Tindakan ini berguna bagi admin yang ingin mengulang kembali penggunaan sistem kasir digital dari awal.
            </p>

            <div className="p-3 bg-red-50 rounded-xl border border-red-150 text-[10px] text-red-800 leading-relaxed space-y-1 font-mono">
              <p className="font-bold">🚨 DAMPAK RESET SISTEM:</p>
              <p>• Loyalty member & poin ➔ CLEAR (NOL)</p>
              <p>• Stok produk / inventori ➔ RE-INITIALIZED</p>
              <p>• Histori transaksi & sales ➔ DUMPED (NOL)</p>
              <p>• Aktivitas log audit ➔ DI-WIPED OUT</p>
            </div>
          </div>

          <div className="pt-4 border-t border-red-100 mt-4">
            <button
              onClick={() => setResetConfirmOpen(true)}
              className="w-full py-3 bg-red-650 hover:bg-red-750 text-white font-black text-xs rounded-xl shadow-md text-center cursor-pointer transition-all active:scale-95 duration-200 uppercase space-y-1 shrink-0"
            >
              Reset Data Aplikasi
            </button>
          </div>
        </section>
      </div>

      {/* Primary Actions save footer */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button 
          onClick={handleSaveAll}
          className="px-6 py-2.5 bg-[#00236f] hover:bg-[#1e3a8a] text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md active:scale-95 flex items-center gap-1.5"
        >
          <Save className="w-4.5 h-4.5" />
          <span>Simpan Perubahan</span>
        </button>
      </div>

      {/* Custom Confirmation Modal for resetting application data */}
      <AnimatePresence>
        {resetConfirmOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl p-6 border border-red-200 max-w-md w-full shadow-2xl relative space-y-4 text-left"
            >
              <div className="flex items-center gap-3 text-red-650">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-650 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">🚨 PERINGATAN KERAS!</h3>
                  <p className="text-[10px] text-gray-500 font-bold">AKSI DESTRUKTIF REVERSIBEL MAKSIMAL</p>
                </div>
              </div>
              
              <div className="text-xs text-gray-650 space-y-2.5 leading-relaxed">
                <p>
                  Apakah Anda benar-benar yakin ingin menghapus <strong className="text-red-700">SELURUH DATA</strong> pada aplikasi kasir digital ini?
                </p>
                <p className="bg-red-50 p-3 rounded-xl border border-red-150 text-[10px] text-red-800 leading-relaxed font-semibold">
                  Tindakan ini akan mengosongkan seluruh riwayat penjualan, menghapus seluruh loyalty member, mengosongkan inventori produk, serta menghapus seluruh log log aktivitas audit. Aplikasi akan kembali seperti baru di-initialisasi.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setResetConfirmOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-750 font-bold text-xs rounded-xl cursor-pointer transition-all active:scale-95 text-center"
                >
                  Batal (Amankan Data)
                </button>
                <button
                  onClick={() => {
                    onResetApplicationData();
                    setResetConfirmOpen(false);
                    showToast('Seluruh database berhasil dibersihkan dan di-reset!', 'success');
                  }}
                  className="flex-1 py-2.5 bg-red-650 hover:bg-red-700 text-white rounded-xl font-bold text-xs cursor-pointer transition-all active:scale-95 text-center font-black"
                >
                  Ya, Reset Total
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Modal for Deleting Staff Account */}
      <AnimatePresence>
        {deleteAccountTarget && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl p-6 border border-red-200 max-w-sm w-full shadow-2xl relative space-y-4 text-left"
            >
              <div className="flex items-center gap-3 text-red-600">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Konfirmasi Hapus Akun Staff</h3>
                  <p className="text-[10px] text-gray-500">Cabut Hak Akses Karyawan</p>
                </div>
              </div>
              
              <p className="text-xs text-gray-650 leading-relaxed">
                Apakah Anda yakin ingin menghapus akun staff bernama <strong className="text-gray-900">"{deleteAccountTarget.name}"</strong>? Hak akses login milik kasir bersangkutan akan diblokir seketika secara permanen.
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setDeleteAccountTarget(null)}
                  className="flex-1 py-12 p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-750 font-bold text-xs rounded-xl cursor-pointer transition-all active:scale-95 text-center"
                  style={{ paddingTop: '10px', paddingBottom: '10px' }}
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    const name = deleteAccountTarget.name;
                    onDeleteAccount(deleteAccountTarget.id);
                    setDeleteAccountTarget(null);
                    showToast(`Akun staff "${name}" berhasil dihapus dari sistem.`, 'success');
                  }}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs cursor-pointer transition-all active:scale-95 text-center"
                >
                  Hapus Staff
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toast Notification Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3.5 rounded-xl border text-xs font-bold bg-white text-gray-900 max-w-sm shadow-xl"
            style={{
              borderColor: toastType === 'success' ? '#10b981' : toastType === 'error' ? '#ef4444' : '#3b82f6',
            }}
          >
            {toastType === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
            {toastType === 'error' && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
            {toastType === 'info' && <Store className="w-4 h-4 text-blue-500 shrink-0" />}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
