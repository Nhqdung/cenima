import React, { useState, useEffect } from 'react';
import { X, Film, Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle, KeyRound, ShieldCheck, RefreshCw } from 'lucide-react';
import { authStorage, type UserProfile } from '../../lib/auth';
import { SITE_CONFIG } from '../../config/site';
import { useLanguage } from '../../context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultMode = 'login'
}) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [sentOtpInfo, setSentOtpInfo] = useState<string | null>(null);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1); // 1: Nhập email gửi mã OTP, 2: Nhập OTP + mật khẩu mới
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Khi modal mở lên, đồng bộ lại mode theo defaultMode truyền vào
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setError(null);
      setSuccessMsg(null);
      setPassword('');
      setConfirmPassword('');
      setOtpCode('');
      setSentOtpInfo(null);
      setForgotStep(1);
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  // Xử lý gửi mã xác nhận OTP (Bước 1 của Quên mật khẩu)
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setError('Vui lòng nhập email tài khoản của bạn!');
      return;
    }

    const res = authStorage.sendResetCode(email.trim());
    if (res.success && res.mockOtp) {
      setSentOtpInfo(res.mockOtp);
      setForgotStep(2);
      setSuccessMsg(`Mã xác thực 6 số bảo mật đã được gửi tới email ${email}!`);
    } else {
      setError(res.message);
    }
  };

  // Xử lý xác nhận OTP và đổi mật khẩu mới (Bước 2 của Quên mật khẩu)
  const handleVerifyOtpAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!otpCode.trim()) {
      setError('Vui lòng nhập mã bảo mật 6 số!');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu mới cần tối thiểu 6 ký tự!');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp!');
      return;
    }

    const res = authStorage.verifyAndResetPassword(email.trim(), otpCode.trim(), password);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setMode('login');
        setForgotStep(1);
        setSentOtpInfo(null);
        setPassword('');
        setConfirmPassword('');
        setOtpCode('');
      }, 1500);
    } else {
      setError(res.message);
    }
  };

  // Xử lý Đăng ký hoặc Đăng nhập
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // 1. ĐĂNG KÝ
    if (mode === 'register') {
      if (!name.trim()) {
        setError('Vui lòng nhập họ và tên của bạn!');
        return;
      }
      if (!email.trim()) {
        setError('Vui lòng nhập email hợp lệ!');
        return;
      }
      if (password.length < 6) {
        setError('Mật khẩu cần tối thiểu 6 ký tự!');
        return;
      }
      if (confirmPassword && password !== confirmPassword) {
        setError('Xác nhận mật khẩu không trùng khớp!');
        return;
      }

      const res = authStorage.register(name.trim(), email.trim(), password);
      if (res.success && res.user) {
        setSuccessMsg('Đăng ký tài khoản thành công! Đang đăng nhập...');
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 1000);
      } else {
        setError(res.message);
      }
      return;
    }

    // 2. ĐĂNG NHẬP
    if (mode === 'login') {
      if (!email.trim() || !password) {
        setError('Vui lòng nhập đầy đủ email và mật khẩu!');
        return;
      }
      const res = authStorage.login(email.trim(), password);
      if (res.success && res.user) {
        setSuccessMsg('Đăng nhập thành công! Chúc bạn xem phim vui vẻ.');
        setTimeout(() => {
          onSuccess(res.user!);
          onClose();
        }, 1000);
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-midnight-950 border border-white/10 rounded-3xl shadow-2xl shadow-black/90 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-midnight-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {mode === 'login' && t.authLoginTitle}
                {mode === 'register' && t.authRegisterTitle}
                {mode === 'forgot' && t.authForgotTitle}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {SITE_CONFIG.name} Security
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher nếu là login hoặc register */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-2 mx-6 mt-4 bg-midnight-900 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode('login');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition ${
                mode === 'login' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.login}
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode('register');
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition ${
                mode === 'register' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.register}
            </button>
          </div>
        )}

        {/* Form content */}
        <div className="p-6 pt-4 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* QUY TRÌNH QUÊN MẬT KHẨU AN TOÀN */}
          {mode === 'forgot' ? (
            forgotStep === 1 ? (
              // BƯỚC 1: NHẬP EMAIL ĐỂ GỬI MÃ XÁC THỰC
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 leading-relaxed">
                  Để đảm bảo an toàn và chống xâm nhập tài khoản, hệ thống sẽ cấp một <strong>mã bảo mật OTP 6 chữ số</strong> xác minh danh tính chủ tài khoản.
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium block">Nhập Email tài khoản cần khôi phục</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-midnight-800/90 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-95 shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Gửi Mã Xác Thực OTP</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setMode('login');
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ← Quay lại Đăng nhập
                  </button>
                </div>
              </form>
            ) : (
              // BƯỚC 2: NHẬP MÃ OTP VÀ MẬT KHẨU MỚI
              <form onSubmit={handleVerifyOtpAndReset} className="space-y-4">
                {sentOtpInfo && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5 text-amber-200">
                      <ShieldCheck className="w-4 h-4" />
                      Mã xác thực OTP gửi về email:
                    </div>
                    <div className="font-mono text-base font-bold tracking-widest text-white bg-black/40 px-3 py-1.5 rounded-lg inline-block border border-amber-500/30">
                      {sentOtpInfo}
                    </div>
                    <p className="text-[11px] text-amber-300/80">
                      (Mã có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này cho người khác.)
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium block">Nhập mã xác thực OTP (6 số)</label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="VD: 123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-midnight-800/90 border border-white/10 rounded-xl text-sm font-mono tracking-wider text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium block">Mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Tối thiểu 6 ký tự"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-midnight-800/90 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium block">Xác nhận lại mật khẩu mới</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Nhập lại mật khẩu mới"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-midnight-800/90 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-95 shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Xác Nhận & Đổi Mật Khẩu</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ← Nhập lại email khác
                  </button>
                </div>
              </form>
            )
          ) : (
            // FORM ĐĂNG NHẬP HOẶC ĐĂNG KÝ
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Họ tên (Chỉ hiển thị khi Đăng ký) */}
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium block">{t.fullName}</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-midnight-800/90 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium block">{t.email}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-midnight-800/90 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Mật khẩu */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-300 font-medium">{t.password}</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setSuccessMsg(null);
                        setForgotStep(1);
                        setMode('forgot');
                      }}
                      className="text-[11px] text-red-400 hover:underline cursor-pointer"
                    >
                      {t.forgotPassword}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-midnight-800/90 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Xác nhận lại mật khẩu khi Đăng ký */}
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium block">{t.confirmPassword}</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-midnight-800/90 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-95 shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 mt-2"
              >
                <span>{mode === 'login' ? t.login : t.register}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-xs text-slate-400">
                {mode === 'login' ? (
                  <span>
                    {t.noAccount}
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setMode('register');
                      }}
                      className="text-red-400 font-semibold hover:underline"
                    >
                      {t.register}
                    </button>
                  </span>
                ) : (
                  <span>
                    {t.hasAccount}
                    <button
                      type="button"
                      onClick={() => {
                        setError(null);
                        setMode('login');
                      }}
                      className="text-red-400 font-semibold hover:underline"
                    >
                      {t.login}
                    </button>
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
