import React, { useState } from 'react';
import { CreditCard, Receipt, UserPlus, TrendingUp, Minus, Plus, Bell, Activity as ActivityIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, Customer, Activity, Transaction } from '../types';

interface DashboardTabProps {
  activities: Activity[];
  products: Product[];
  customers: Customer[];
  transactions: Transaction[];
  onNavigateToTab: (tab: string) => void;
  onQuickAddSale: () => void;
  currentUser?: any;
}

export default function DashboardTab({
  activities,
  products,
  customers,
  transactions,
  onNavigateToTab,
  onQuickAddSale,
  currentUser
}: DashboardTabProps) {
  const [chartRange, setChartRange] = useState<'Minggu Ini' | 'Bulan Ini'>('Minggu Ini');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Dynamic stats calculated from global transactions state
  const totalSalesFromTxs = transactions.reduce((sum, tx) => sum + tx.total, 0);
  const totalProfitFromTxs = transactions.reduce((sum, tx) => sum + (tx.total * 0.35), 0);
  const txCount = transactions.length;
  const membersCount = customers.length;

  // Let's check if the business has reset
  const isReset = products.length === 0 && customers.length === 0 && transactions.length === 0;

  // Stats values linked to timeframe and actual transactions
  const salesValue = isReset 
    ? 'Rp 0' 
    : (totalSalesFromTxs > 222200 ? `Rp ${totalSalesFromTxs.toLocaleString('id-ID')}` : (chartRange === 'Minggu Ini' ? 'Rp 4.520.000' : 'Rp 18.240.000'));

  const transactionValue = isReset
    ? '0'
    : (txCount > 1 ? `${txCount}` : (chartRange === 'Minggu Ini' ? '142' : '590'));

  const memberValue = isReset
    ? '0'
    : `${membersCount}`;

  const profitValue = isReset
    ? 'Rp 0'
    : (totalProfitFromTxs > 100000 ? `Rp ${Math.round(totalProfitFromTxs).toLocaleString('id-ID')}` : (chartRange === 'Minggu Ini' ? 'Rp 1.250.000' : 'Rp 5.120.000'));

  // Faux bar chart configuration adjusted dynamically
  const weekData = [
    { day: 'Sen', amount: isReset ? 'Rp 0' : 'Rp 1.0M', heightClass: isReset ? 'h-[0%]' : 'h-[40%]' },
    { day: 'Sel', amount: isReset ? 'Rp 0' : 'Rp 1.5M', heightClass: isReset ? 'h-[0%]' : 'h-[60%]' },
    { day: 'Rab', amount: isReset ? 'Rp 0' : 'Rp 1.2M', heightClass: isReset ? 'h-[0%]' : 'h-[45%]' },
    { day: 'Kam', amount: isReset ? 'Rp 0' : 'Rp 2.0M', heightClass: isReset ? 'h-[0%]' : 'h-[80%]' },
    { day: 'Jum', amount: isReset ? 'Rp 0' : 'Rp 1.4M', heightClass: isReset ? 'h-[0%]' : 'h-[55%]' },
    { day: 'Sab', amount: isReset ? 'Rp 0' : 'Rp 2.5M', heightClass: isReset ? 'h-[0%]' : 'h-[90%]', featured: !isReset },
    { day: 'Min', amount: isReset ? 'Rp 0' : 'Rp 0.6M', heightClass: isReset ? 'h-[0%]' : 'h-[25%]' }
  ];

  const monthData = [
    { day: 'M-1', amount: isReset ? 'Rp 0' : 'Rp 3.8M', heightClass: isReset ? 'h-[0%]' : 'h-[50%]' },
    { day: 'M-2', amount: isReset ? 'Rp 0' : 'Rp 4.2M', heightClass: isReset ? 'h-[0%]' : 'h-[65%]' },
    { day: 'M-3', amount: isReset ? 'Rp 0' : 'Rp 5.1M', heightClass: isReset ? 'h-[0%]' : 'h-[85%]', featured: !isReset },
    { day: 'M-4', amount: isReset ? 'Rp 0' : 'Rp 5.14M', heightClass: isReset ? 'h-[0%]' : 'h-[90%]' }
  ];

  const chartData = chartRange === 'Minggu Ini' ? weekData : monthData;

  // Render activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <Receipt className="w-4.5 h-4.5 text-[#00714d]" />;
      case 'customer':
        return <UserPlus className="w-4.5 h-4.5 text-[#00236f]" />;
      case 'stock':
        return <CreditCard className="w-4.5 h-4.5 text-red-600" />;
      default:
        return <ActivityIcon className="w-4.5 h-4.5" />;
    }
  };

  const getActivityBg = (type: string) => {
    switch (type) {
      case 'sale':
        return 'bg-[#6cf8bb] text-[#00714d]';
      case 'customer':
        return 'bg-[#dce1ff] text-[#00236f]';
      case 'stock':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0b1c30]">Selamat Datang, {currentUser?.name ? currentUser.name.split(' ')[0] : 'Budi'}!</h2>
          <p className="text-sm text-[#444651]">Berikut ringkasan bisnis UMKM Pro Anda hari ini.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs bg-white border border-[#c5c5d3] px-3 py-1.5 rounded-xl shadow-sm text-[#0b1c30] self-start sm:self-auto font-mono">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>Sistem Aktif (UTC)</span>
        </div>
      </div>

      {/* Statistics Bento Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <motion.div 
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-[#c5c5d3] relative overflow-hidden group cursor-pointer"
          onClick={() => onNavigateToTab('Reports')}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all rounded-bl-full bg-[#00236f]">
            <CreditCard className="w-12 h-12 text-[#00236f]" />
          </div>
          <h3 className="text-xs font-semibold text-[#444651] uppercase tracking-wider mb-2">Penjualan Hari Ini</h3>
          <p className="text-lg sm:text-xl font-bold text-[#00236f] mb-1">{salesValue}</p>
          <div className="flex items-center text-[#006c49] text-xs font-semibold">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+12.5%</span>
          </div>
        </motion.div>

        {/* Total Transactions */}
        <motion.div 
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-[#c5c5d3] relative overflow-hidden group cursor-pointer"
          onClick={() => onNavigateToTab('Reports')}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all rounded-bl-full bg-[#00236f]">
            <Receipt className="w-12 h-12 text-[#00236f]" />
          </div>
          <h3 className="text-xs font-semibold text-[#444651] uppercase tracking-wider mb-2">Transaksi</h3>
          <p className="text-lg sm:text-xl font-bold text-[#00236f] mb-1">{transactionValue}</p>
          <div className="flex items-center text-[#006c49] text-xs font-semibold">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+5</span>
          </div>
        </motion.div>

        {/* New Members */}
        <motion.div 
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-[#c5c5d3] relative overflow-hidden group cursor-pointer"
          onClick={() => onNavigateToTab('Customers')}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all rounded-bl-full bg-[#00236f]">
            <UserPlus className="w-12 h-12 text-[#00236f]" />
          </div>
          <h3 className="text-xs font-semibold text-[#444651] uppercase tracking-wider mb-2">Member Baru</h3>
          <p className="text-lg sm:text-xl font-bold text-[#00236f] mb-1">{memberValue}</p>
          <div className="flex items-center text-[#444651] text-xs font-semibold">
            <Minus className="w-4 h-4 mr-1" />
            <span>Sama</span>
          </div>
        </motion.div>

        {/* Net Profit */}
        <motion.div 
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-[#c5c5d3] relative overflow-hidden group cursor-pointer"
          onClick={() => onNavigateToTab('Reports')}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all rounded-bl-full bg-[#006c49]">
            <TrendingUp className="w-12 h-12 text-[#006c49]" />
          </div>
          <h3 className="text-xs font-semibold text-[#444651] uppercase tracking-wider mb-2">Laba Bersih</h3>
          <p className="text-lg sm:text-xl font-bold text-[#006c49] mb-1">{profitValue}</p>
          <div className="flex items-center text-[#006c49] text-xs font-semibold">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+8.2%</span>
          </div>
        </motion.div>
      </section>

      {/* Chart & Activities Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <section className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[#c5c5d3] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-[#0b1c30]">Grafik Penjualan Harian</h3>
            <select 
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value as any)}
              className="bg-[#e5eeff] py-1.5 px-3 rounded-xl text-xs text-[#0b1c30] border-none font-semibold focus:ring-2 focus:ring-[#00236f] cursor-pointer"
            >
              <option value="Minggu Ini">Minggu Ini</option>
              <option value="Bulan Ini">Bulan Ini</option>
            </select>
          </div>

          {/* Graphical Frame */}
          <div className="w-full h-64 bg-[#f8f9ff] rounded-xl relative overflow-hidden flex items-end justify-between px-6 pb-4 pt-12">
            {chartData.map((item, index) => (
              <div 
                key={index}
                className={`w-[11%] rounded-t-lg transition-all duration-300 cursor-pointer relative ${
                  item.featured ? 'bg-[#006c49] shadow-[0_0_15px_rgba(0,108,73,0.3)]' : 'bg-[#00236f]'
                } hover:opacity-85 ${item.heightClass}`}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Tooltip on Hover */}
                {hoveredBar === index && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#213145] text-[#eaf1ff] text-[10px] px-2 py-1 rounded-md font-mono whitespace-nowrap z-20 pointer-events-none shadow-md"
                  >
                    {item.day}: {item.amount}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* X Axis Labels */}
          <div className="flex justify-between mt-3 text-xs text-[#444651] px-6 font-semibold">
            {chartData.map((item, index) => (
              <span 
                key={index} 
                className={`${item.featured ? 'text-[#0b1c30] font-bold underline decoration-2' : ''}`}
              >
                {item.day}
              </span>
            ))}
          </div>
        </section>

        {/* Recent Activities */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#c5c5d3] flex flex-col h-full justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-[#0b1c30]">Aktivitas Terkini</h3>
              <button 
                onClick={() => onNavigateToTab('Reports')}
                className="text-[#00236f] text-xs font-semibold hover:underline"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
              {activities.length === 0 ? (
                <p className="text-xs text-center text-[#757682] py-8">Tidak ada aktivitas transaksi.</p>
              ) : (
                activities.slice(0, 5).map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-start gap-3 p-2 hover:bg-[#f8f9ff] rounded-xl transition-all cursor-pointer border border-transparent hover:border-gray-100"
                  >
                    <div className={`w-9 h-9 rounded-full ${getActivityBg(activity.type)} flex items-center justify-center shrink-0`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#0b1c30] truncate">{activity.title}</p>
                      <p className="text-[11px] text-[#444651] truncate mt-0.5">{activity.description}</p>
                    </div>
                    <span className="text-[10px] text-[#757682] shrink-0 font-medium">{activity.timeAgo}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <button 
              onClick={onQuickAddSale}
              className="w-full py-2.5 bg-[#e5eeff] text-[#00236f] font-semibold text-xs rounded-xl hover:bg-[#dce9ff] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan Transaksi Baru</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
