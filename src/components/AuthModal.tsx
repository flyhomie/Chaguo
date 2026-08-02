import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, LogIn, UserPlus, LogOut, ShieldCheck, CheckCircle2, Smartphone, Monitor } from 'lucide-react';
import { DemonicAvatar } from './DemonicAvatar';

export interface LocalUser {
  id: string;
  username: string;
  email: string;
  role: 'citizen' | 'verified_reporter' | 'civic_advocate';
  createdAt: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: LocalUser | null;
  onLogin: (user: LocalUser) => void;
  onLogout: () => void;
  initialMode?: 'signin' | 'signup';
  viewportMode?: 'auto' | 'desktop' | 'mobile';
  onToggleViewportMode?: (mode: 'auto' | 'desktop' | 'mobile') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  initialMode = 'signin',
  viewportMode = 'auto',
  onToggleViewportMode,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'citizen' | 'verified_reporter' | 'civic_advocate'>('citizen');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Email OTP Verification State
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [countdown, setCountdown] = useState(60);

  // Synchronize mode state when initialMode or isOpen changes
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen, initialMode]);

  // Countdown timer effect
  React.useEffect(() => {
    let timer: any;
    if (isCodeSent && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isCodeSent, countdown]);

  const handleSendVerificationCode = () => {
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address first.');
      return;
    }

    // Generate 6-digit verification code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    setIsCodeSent(true);
    setCountdown(60);
    setErrorMsg('');

    try {
      localStorage.setItem('chaguo_pending_email_code', JSON.stringify({
        email: email.trim(),
        code: newCode,
        timestamp: Date.now()
      }));
    } catch (e) {}

    setSuccessMsg(`Verification code sent to ${email.trim()}! (Simulated Code: ${newCode} - stored in local storage)`);
  };

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please provide both username/email and password.');
      return;
    }

    try {
      const usersStr = localStorage.getItem('chaguo_registered_users');
      const users: Array<LocalUser & { password?: string }> = usersStr ? JSON.parse(usersStr) : [];

      const found = users.find(
        (u) =>
          (u.username.toLowerCase() === username.trim().toLowerCase() ||
            u.email.toLowerCase() === username.trim().toLowerCase()) &&
          u.password === password
      );

      if (found) {
        const loggedInUser: LocalUser = {
          id: found.id,
          username: found.username,
          email: found.email,
          role: found.role,
          createdAt: found.createdAt,
        };
        onLogin(loggedInUser);
        setSuccessMsg(`Welcome back, ${found.username}! You are signed in.`);
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        // Fallback for easy demo sign-in if no users created yet
        if (users.length === 0) {
          const demoUser: LocalUser = {
            id: `usr-${Date.now()}`,
            username: username.trim(),
            email: `${username.trim()}@citizen.ke`,
            role: 'verified_reporter',
            createdAt: new Date().toISOString().split('T')[0],
          };
          users.push({ ...demoUser, password });
          localStorage.setItem('chaguo_registered_users', JSON.stringify(users));
          onLogin(demoUser);
          setSuccessMsg(`Account created & signed in as ${demoUser.username}!`);
          setTimeout(() => {
            onClose();
          }, 800);
          return;
        }
        setErrorMsg('Invalid username/email or password. Please check your credentials or Sign Up.');
      }
    } catch (e) {
      setErrorMsg('Local authentication storage error. Please try again.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('All fields are required for local citizen registration.');
      return;
    }

    if (!isCodeSent) {
      setErrorMsg('Please click "Send Verification Code" to receive your 6-digit email security code.');
      return;
    }

    // Validate 6-digit verification code
    let savedCodeObj: any = null;
    try {
      const stored = localStorage.getItem('chaguo_pending_email_code');
      if (stored) savedCodeObj = JSON.parse(stored);
    } catch (e) {}

    const targetCode = generatedCode || savedCodeObj?.code;
    if (inputCode.trim() !== targetCode) {
      setErrorMsg(`Invalid 6-digit verification code. Please enter code ${targetCode} sent to ${email}.`);
      return;
    }

    try {
      const usersStr = localStorage.getItem('chaguo_registered_users');
      const users: Array<LocalUser & { password?: string }> = usersStr ? JSON.parse(usersStr) : [];

      const exists = users.some(
        (u) =>
          u.username.toLowerCase() === username.trim().toLowerCase() ||
          u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (exists) {
        setErrorMsg('Username or Email already registered locally. Please sign in instead.');
        return;
      }

      const newUser: LocalUser & { password?: string } = {
        id: `usr-${Date.now()}`,
        username: username.trim(),
        email: email.trim(),
        role: role,
        password: password,
        createdAt: new Date().toISOString().split('T')[0],
      };

      users.push(newUser);
      localStorage.setItem('chaguo_registered_users', JSON.stringify(users));
      localStorage.removeItem('chaguo_pending_email_code');

      const sessionUser: LocalUser = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      };

      onLogin(sessionUser);
      setSuccessMsg(`Email Verified! Account created successfully! Welcome to Chaguo 2027, ${newUser.username}.`);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (e) {
      setErrorMsg('Failed to save user account to local device storage.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 shadow-2xl text-neutral-900 dark:text-neutral-100 p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-neutral-900 dark:border-neutral-700 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-black uppercase tracking-tight">
              {currentUser ? 'Citizen Account Dossier' : mode === 'signin' ? 'Sign In to Portal' : 'Register Citizen Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-neutral-800 text-white hover:bg-red-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Already Logged In */}
        {currentUser ? (
          <div className="space-y-5 text-center">
            <div className="flex flex-col items-center justify-center space-y-3 p-4 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700">
              <DemonicAvatar seed={currentUser.id} name={currentUser.username} size="xl" />
              <div>
                <h4 className="text-2xl font-black uppercase tracking-tight">{currentUser.username}</h4>
                <p className="text-xs font-bold text-neutral-500 uppercase">{currentUser.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest">
                  ROLE: {currentUser.role.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Desktop & Mobile View Toggle in Citizen Profile */}
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 space-y-2.5 text-left">
              <div className="flex items-center justify-between">
                <h5 className="font-black text-xs uppercase flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                  <Smartphone className="w-4 h-4 text-red-600" />
                  <span>PROFILE VIEW LAYOUT MODE</span>
                </h5>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                  {viewportMode.toUpperCase()}
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 font-semibold normal-case">
                Toggle between Smartphone layout mode and Desktop widescreen mode across the application.
              </p>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => onToggleViewportMode?.('auto')}
                  className={`py-2 px-1 text-[10px] font-black uppercase flex flex-col items-center justify-center gap-1 border transition-colors ${
                    viewportMode === 'auto'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>AUTO</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleViewportMode?.('desktop')}
                  className={`py-2 px-1 text-[10px] font-black uppercase flex flex-col items-center justify-center gap-1 border transition-colors ${
                    viewportMode === 'desktop'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>DESKTOP</span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleViewportMode?.('mobile')}
                  className={`py-2 px-1 text-[10px] font-black uppercase flex flex-col items-center justify-center gap-1 border transition-colors ${
                    viewportMode === 'mobile'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>MOBILE</span>
                </button>
              </div>
            </div>

            <p className="text-xs font-bold uppercase text-neutral-600 dark:text-neutral-300">
              Your session, preferences, and evidence reports are saved locally on this device.
            </p>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-3 bg-red-600 hover:bg-neutral-900 text-white font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>SIGN OUT</span>
            </button>
          </div>
        ) : (
          /* Sign In / Sign Up Form */
          <div className="space-y-5">
            {/* Mode Toggle Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 text-xs font-black uppercase">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 text-center transition-colors ${
                  mode === 'signin'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                SIGN IN
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 text-center transition-colors ${
                  mode === 'signup'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                SIGN UP
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-100 dark:bg-red-950 border-2 border-red-600 text-red-800 dark:text-red-200 text-xs font-bold uppercase">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-green-100 dark:bg-green-950 border-2 border-green-600 text-green-800 dark:text-green-200 text-xs font-bold uppercase flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4 text-xs font-bold uppercase">
              <div>
                <label className="block mb-1 text-neutral-500">Username or Email *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. WanjikuKenyan"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block mb-1 text-neutral-500">Email Address *</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="wanjiku@citizen.ke"
                          className="w-full pl-9 pr-3 py-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendVerificationCode}
                        className="px-3 py-2 bg-neutral-900 dark:bg-neutral-800 hover:bg-red-600 dark:hover:bg-red-600 text-white font-black text-[10px] uppercase tracking-wider shrink-0 transition-colors border-2 border-neutral-900 dark:border-neutral-700"
                      >
                        {isCodeSent ? (countdown > 0 ? `RESEND (${countdown}s)` : 'RESEND CODE') : 'SEND CODE'}
                      </button>
                    </div>
                  </div>

                  {isCodeSent && (
                    <div className="p-3 bg-red-950/10 dark:bg-red-950/30 border-2 border-red-600 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-black text-red-600 dark:text-red-400">
                        <span>ENTER 6-DIGIT EMAIL SECURITY CODE:</span>
                        <span className="font-mono bg-red-600 text-white px-1.5 py-0.5 text-[10px]">
                          CODE: {generatedCode}
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="e.g. 684291"
                        className="w-full text-center tracking-[0.3em] font-mono text-lg font-black py-2 bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700"
                      />
                      <p className="text-[9px] text-neutral-500 normal-case font-bold">
                        ✓ Verification code dispatched to {email} & saved to local storage (`chaguo_pending_email_code`).
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block mb-1 text-neutral-500">Voter Account Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
                    >
                      <option value="citizen">Kenyan Citizen (Standard)</option>
                      <option value="verified_reporter">Verified Evidence Reporter</option>
                      <option value="civic_advocate">Civic Rights Advocate</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block mb-1 text-neutral-500">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-neutral-900 text-white font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                {mode === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{mode === 'signin' ? 'SIGN IN NOW' : 'CREATE LOCAL ACCOUNT'}</span>
              </button>
            </form>

            <p className="text-[10px] text-center text-neutral-500 font-bold uppercase">
              🔒 100% Local Authentication stored directly in your browser local storage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
