import React, { useState } from 'react';
import { Store, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginScreenProps {
  onLogin: (role: 'Admin' | 'Staff', username: string) => void;
  accounts: any[];
}

export default function LoginScreen({ onLogin, accounts }: LoginScreenProps) {
  const [role, setRole] = useState<'Admin' | 'Staff'>('Admin');
  const [username, setUsername] = useState('budi');
  const [password, setPassword] = useState('budi123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username dan kata sandi wajib diisi.');
      return;
    }
    
    // Exact match lookup in our dynamic accounts list
    const matched = accounts.find(
      (a) => a.username.toLowerCase() === username.trim().toLowerCase() && a.passwordHash === password
    );

    if (matched) {
      if (matched.role !== role) {
        setError(`Akun terdaftar sebagai role "${matched.role}". Harap ganti pilihan tipe akses menu di atas.`);
        return;
      }
      setError('');
      onLogin(matched.role, matched.username);
    } else {
      setError('Kombinasi nama pengguna atau kata sandi tidak cocok. Silakan periksa kembali!');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center p-5 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-[#E2E8F0] p-6 sm:p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1e3a8a] text-white mb-4">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#00236f]">UMKM Manager</h1>
          <p className="text-sm text-[#444651] mt-1">Akses Sistem Manajemen (Admin/Staff)</p>
        </div>

        {/* Role Selection */}
        <div className="flex bg-[#e5eeff] rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setRole('Admin')}
            className={`flex-1 py-2 text-center rounded-lg text-sm font-semibold transition-all ${
              role === 'Admin'
                ? 'bg-white text-[#00236f] shadow-sm'
                : 'text-[#444651] hover:text-[#00236f]'
            }`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => setRole('Staff')}
            className={`flex-1 py-2 text-center rounded-lg text-sm font-semibold transition-all ${
              role === 'Staff'
                ? 'bg-white text-[#00236f] shadow-sm'
                : 'text-[#444651] hover:text-[#00236f]'
            }`}
          >
            Kasir / Staff
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#0b1c30] mb-2" htmlFor="username">
              Username atau Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#757682]">
                <User className="w-5 h-5" />
              </span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#c5c5d3] bg-[#f8f9ff] text-sm text-[#0b1c30] placeholder-[#757682] focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none transition-all"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0b1c30] mb-2" htmlFor="password">
              Kata Sandi
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#757682]">
                <Lock className="w-5 h-5" />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#c5c5d3] bg-[#f8f9ff] text-sm text-[#0b1c30] placeholder-[#757682] focus:border-[#00236f] focus:ring-1 focus:ring-[#00236f] outline-none transition-all"
                placeholder="Masukkan kata sandi"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-[#757682] hover:text-[#00236f] transition-colors"
                title={showPassword ? "Sembunyikan" : "Tampilkan"}
              >
                {showPassword ? "Sembunyikan" : "Tampilkan"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#c5c5d3] text-[#00236f] focus:ring-[#00236f] transition-all"
              />
              <span className="text-[#444651] group-hover:text-[#0b1c30] transition-colors select-none">
                Ingat Saya
              </span>
            </label>
            <a href="#" className="font-medium text-[#00236f] hover:underline" onClick={(e) => e.preventDefault()}>
              Lupa Kata Sandi?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#00236f] text-white rounded-xl py-3.5 font-semibold text-sm hover:bg-[#1e3a8a] shadow-[0_4px_15px_rgba(0,35,111,0.15)] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Masuk</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Hints */}
        <div className="mt-6 p-4 bg-blue-50/70 rounded-xl border border-blue-100 flex items-start space-x-2">
          <ShieldCheck className="w-5 h-5 text-[#00236f] shrink-0 mt-0.5" />
          <div className="text-xs text-[#444651] space-y-1">
            <p className="font-bold text-[#00236f]">Sandi & Akses Sistem:</p>
            <p>• <strong>Admin:</strong> budi / budi123</p>
            <p>• <strong>Staff/Kasir:</strong> staf1 / staf123</p>
            <p className="mt-1 text-[10px] text-gray-500 font-medium">Anda juga bisa mendaftarkan akun kasir baru atau mengubah kata sandi di menu <strong>Laporan & Pengaturan</strong> setelah masuk!</p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-[#757682]">
          <p>© 2026 UMKM Manager. Sistem Terenkripsi.</p>
        </div>
      </motion.div>
    </div>
  );
}
