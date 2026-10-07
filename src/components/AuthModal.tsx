import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, LogIn, UserPlus, LogOut, ShieldCheck, CheckCircle2, Smartphone, Monitor, KeyRound, Sparkles } from 'lucide-react';
import { DemonicAvatar } from './DemonicAvatar';

export interface LocalUser {
  id: string;
  username: string;
  email: string;
  role: 'citizen' | 'verified_reporter' | 'civic_advocate';
  createdAt: string;
  authMethod?: 'pin' | 'email';
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
  const [authMethod, setAuthMethod] = useState<'pin' | 'email'>('pin');

  // Shared / PIN Auth State
  const [username, setUsername] = useState('');
  const [pinCode, setPinCode] = useState('');

  // Email Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'citizen' | 'verified_reporter' | 'civic_advocate'>('citizen');

  // Feedback messages
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

  // Countdown timer effect for OTP
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

    setSuccessMsg(`Verification code dispatched to ${email.trim()}! (Code: ${newCode} - stored in local storage)`);
  };

  if (!isOpen) return null;

  // HANDLE SIGN IN (PIN OR EMAIL)
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const usersStr = localStorage.getItem('chaguo_registered_users');
      const users: Array<LocalUser & { password?: string; pinCode?: string }> = usersStr ? JSON.parse(usersStr) : [];

      if (authMethod === 'pin') {
        if (!username.trim() || !pinCode.trim() || pinCode.length !== 4) {
          setErrorMsg('Please enter your username and 4-digit PIN code.');
          return;
        }

        const foundPin = users.find(
          (u) =>
            u.username.toLowerCase() === username.trim().toLowerCase() &&
            (u.pinCode === pinCode.trim() || u.password === pinCode.trim())
        );

        if (foundPin) {
          const loggedInUser: LocalUser = {
            id: foundPin.id,
            username: foundPin.username,
            email: foundPin.email || `${foundPin.username}@citizen.ke`,
            role: foundPin.role,
            createdAt: foundPin.createdAt,
            authMethod: 'pin'
          };
          onLogin(loggedInUser);
          setSuccessMsg(`Welcome back, ${foundPin.username}! Signed in with 4-digit PIN.`);
          setTimeout(() => onClose(), 800);
          return;
        } else {
          // Demo fallback for initial launch if user enters PIN
          if (users.length === 0 || username.trim()) {
            const demoUser: LocalUser = {
              id: `usr-${Date.now()}`,
              username: username.trim(),
              email: `${username.trim()}@citizen.ke`,
              role: 'citizen',
              createdAt: new Date().toISOString().split('T')[0],
              authMethod: 'pin'
            };
            users.push({ ...demoUser, pinCode: pinCode.trim() });
            localStorage.setItem('chaguo_registered_users', JSON.stringify(users));
            onLogin(demoUser);
            setSuccessMsg(`Account created & signed in via PIN for ${demoUser.username}!`);
            setTimeout(() => onClose(), 800);
            return;
          }
          setErrorMsg('Invalid Username or 4-digit PIN. Please verify credentials or Register.');
          return;
        }
      } else {
        // EMAIL SIGN IN
        if (!username.trim() || !password.trim()) {
          setErrorMsg('Please provide your Email/Username and Password.');
          return;
        }

        const foundEmail = users.find(
          (u) =>
            (u.username.toLowerCase() === username.trim().toLowerCase() ||
              u.email.toLowerCase() === username.trim().toLowerCase()) &&
            u.password === password
        );

        if (foundEmail) {
          const loggedInUser: LocalUser = {
            id: foundEmail.id,
            username: foundEmail.username,
            email: foundEmail.email,
            role: foundEmail.role,
            createdAt: foundEmail.createdAt,
            authMethod: 'email'
          };
          onLogin(loggedInUser);
          setSuccessMsg(`Welcome back, ${foundEmail.username}! Signed in.`);
          setTimeout(() => onClose(), 800);
        } else {
          setErrorMsg('Invalid credentials. Please check your password or Sign Up.');
        }
      }
    } catch (e) {
      setErrorMsg('Local authentication storage error. Please try again.');
    }
  };

  // HANDLE SIGN UP (PIN OR EMAIL)
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (authMethod === 'pin') {
      if (!username.trim() || !pinCode.trim() || pinCode.length !== 4) {
        setErrorMsg('Please provide a Username and a 4-digit PIN code.');
        return;
      }

      try {
        const usersStr = localStorage.getItem('chaguo_registered_users');
        const users: Array<LocalUser & { pinCode?: string }> = usersStr ? JSON.parse(usersStr) : [];

        const exists = users.some((u) => u.username.toLowerCase() === username.trim().toLowerCase());
        if (exists) {
          setErrorMsg('Username already exists in local storage. Please Sign In or pick another username.');
          return;
        }

        const newUser: LocalUser & { pinCode?: string } = {
          id: `usr-${Date.now()}`,
          username: username.trim(),
          email: `${username.trim()}@citizen.ke`,
          role: role,
          pinCode: pinCode.trim(),
          createdAt: new Date().toISOString().split('T')[0],
          authMethod: 'pin'
        };

        users.push(newUser);
        localStorage.setItem('chaguo_registered_users', JSON.stringify(users));

        const sessionUser: LocalUser = {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
          authMethod: 'pin'
        };

        onLogin(sessionUser);
        setSuccessMsg(`Account created with 4-digit PIN! Welcome ${newUser.username}.`);
        setTimeout(() => onClose(), 800);
      } catch (e) {
        setErrorMsg('Failed to save account to device storage.');
      }
    } else {
      // EMAIL SIGN UP WITH REQUIRED CODE VALIDATION
      if (!username.trim() || !email.trim() || !password.trim()) {
        setErrorMsg('Username, Email, and Password are required.');
        return;
      }

      if (!isCodeSent) {
        setErrorMsg('Please click "Send Code" to receive your 6-digit email validation code.');
        return;
      }

      let savedCodeObj: any = null;
      try {
        const stored = localStorage.getItem('chaguo_pending_email_code');
        if (stored) savedCodeObj = JSON.parse(stored);
      } catch (e) {}

      const targetCode = generatedCode || savedCodeObj?.code;
      if (inputCode.trim() !== targetCode) {
        setErrorMsg(`Invalid verification code. Please enter code ${targetCode} sent to ${email}.`);
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
          setErrorMsg('Username or Email already registered locally. Please Sign In.');
          return;
        }

        const newUser: LocalUser & { password?: string } = {
          id: `usr-${Date.now()}`,
          username: username.trim(),
          email: email.trim(),
          role: role,
          password: password,
          createdAt: new Date().toISOString().split('T')[0],
          authMethod: 'email'
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
          authMethod: 'email'
        };

        onLogin(sessionUser);
        setSuccessMsg(`Email Verified! Account created successfully for ${newUser.username}.`);
        setTimeout(() => onClose(), 800);
      } catch (e) {
        setErrorMsg('Failed to save account to device storage.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 border-4 border-neutral-900 dark:border-neutral-700 shadow-2xl text-neutral-900 dark:text-neutral-100 p-6 space-y-5 rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-neutral-900 dark:border-neutral-700 pb-3.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-black uppercase tracking-tight">
              {currentUser ? 'Citizen Dossier Profile' : mode === 'signin' ? 'Sign In to Chaguo' : 'Register Citizen Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-neutral-800 text-white hover:bg-red-600 transition-colors rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOGGED IN DOSSIER */}
        {currentUser ? (
          <div className="space-y-4 text-center">
            <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 rounded-xl">
              <DemonicAvatar seed={currentUser.id} name={currentUser.username} size="xl" />
              <div>
                <h4 className="text-2xl font-black uppercase tracking-tight">{currentUser.username}</h4>
                <p className="text-xs font-bold text-neutral-500 uppercase">{currentUser.email}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="px-2.5 py-0.5 bg-red-600 text-white font-black text-[10px] uppercase tracking-widest rounded">
                    ROLE: {currentUser.role.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-600 text-white font-black text-[10px] uppercase rounded">
                    AUTHENTICATED
                  </span>
                </div>
              </div>
            </div>

            {/* Layout toggle */}
            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 rounded-xl space-y-2 text-left">
              <div className="flex items-center justify-between">
                <h5 className="font-black text-xs uppercase flex items-center gap-1.5 text-neutral-900 dark:text-neutral-100">
                  <Smartphone className="w-4 h-4 text-red-600" />
                  <span>VIEWPORT LAYOUT MODE</span>
                </h5>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded">
                  {viewportMode.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                {(['auto', 'desktop', 'mobile'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onToggleViewportMode?.(m)}
                    className={`py-2 px-1 text-[10px] font-black uppercase flex flex-col items-center justify-center gap-1 border rounded-lg transition-colors ${
                      viewportMode === m
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>{m.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-3 bg-red-600 hover:bg-neutral-900 text-white font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded-xl shadow"
            >
              <LogOut className="w-4 h-4" />
              <span>SIGN OUT NOW</span>
            </button>
          </div>
        ) : (
          /* SIGN IN / SIGN UP FORM */
          <div className="space-y-4">
            {/* MODE TOGGLE: SIGN IN vs SIGN UP */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 text-xs font-black uppercase rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2.5 text-center transition-all rounded-lg ${
                  mode === 'signin'
                    ? 'bg-red-600 text-white shadow-md'
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
                className={`py-2.5 text-center transition-all rounded-lg ${
                  mode === 'signup'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                SIGN UP
              </button>
            </div>

            {/* METHOD SELECTION TABS: 4-DIGIT PIN vs EMAIL & PASSWORD */}
            <div className="flex items-center justify-center gap-2 p-1 bg-neutral-200 dark:bg-neutral-950 rounded-xl text-[11px] font-black uppercase">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('pin');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-lg transition-all ${
                  authMethod === 'pin'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                <span>4-Digit PIN</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMethod('email');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-lg transition-all ${
                  authMethod === 'email'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-red-500" />
                <span>Email & Password</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-100 dark:bg-red-950 border-2 border-red-600 text-red-800 dark:text-red-200 text-xs font-bold uppercase rounded-xl">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-green-100 dark:bg-green-950 border-2 border-green-600 text-green-800 dark:text-green-200 text-xs font-bold uppercase flex items-center gap-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-3 text-xs font-bold uppercase">
              {/* METHOD 1: 4-DIGIT PIN */}
              {authMethod === 'pin' ? (
                <>
                  <div>
                    <label className="block mb-1 text-neutral-500">Username *</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. WanjikuKenyan"
                        className="w-full pl-9 pr-3 py-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-neutral-500">4-Digit Security PIN Code *</label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                      <input
                        type="password"
                        maxLength={4}
                        required
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 1234"
                        className="w-full pl-9 pr-3 py-2.5 tracking-[0.4em] font-mono text-center text-lg bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-black rounded-xl"
                      />
                    </div>
                    <p className="text-[10px] text-neutral-500 font-normal normal-case mt-1">
                      💡 Fast, persistent 4-digit code saved locally to your device.
                    </p>
                  </div>
                </>
              ) : (
                /* METHOD 2: EMAIL & PASSWORD */
                <>
                  <div>
                    <label className="block mb-1 text-neutral-500">Username *</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. WanjikuKenyan"
                        className="w-full pl-9 pr-3 py-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold rounded-xl"
                      />
                    </div>
                  </div>

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
                          className="w-full pl-9 pr-3 py-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold rounded-xl"
                        />
                      </div>

                      {mode === 'signup' && (
                        <button
                          type="button"
                          onClick={handleSendVerificationCode}
                          className="px-3 py-2 bg-neutral-900 dark:bg-neutral-800 hover:bg-red-600 text-white font-black text-[10px] uppercase tracking-wider shrink-0 transition-colors border-2 border-neutral-900 dark:border-neutral-700 rounded-xl"
                        >
                          {isCodeSent ? (countdown > 0 ? `RESEND (${countdown}s)` : 'RESEND CODE') : 'SEND CODE'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* EMAIL VERIFICATION CODE INPUT FOR NEW USERS */}
                  {mode === 'signup' && isCodeSent && (
                    <div className="p-3 bg-red-950/10 dark:bg-red-950/30 border-2 border-red-600 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-black text-red-600 dark:text-red-400">
                        <span>ENTER 6-DIGIT EMAIL VERIFICATION CODE:</span>
                        <span className="font-mono bg-red-600 text-white px-1.5 py-0.5 text-[10px] rounded">
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
                        className="w-full text-center tracking-[0.3em] font-mono text-lg font-black py-2 bg-white dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-700 rounded-xl"
                      />
                      <p className="text-[9px] text-neutral-500 normal-case font-bold">
                        ✓ Simulated verification code sent to {email} & saved locally.
                      </p>
                    </div>
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
                        className="w-full pl-9 pr-3 py-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold rounded-xl"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ROLE SELECTION FOR SIGN UP */}
              {mode === 'signup' && (
                <div>
                  <label className="block mb-1 text-neutral-500">Voter Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-700 font-bold rounded-xl text-xs uppercase text-neutral-900 dark:text-white"
                  >
                    <option value="citizen">Kenyan Citizen (Standard Voter)</option>
                    <option value="verified_reporter">Verified Evidence Reporter</option>
                    <option value="civic_advocate">Civic Rights Advocate</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-red-600 hover:bg-neutral-900 text-white font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 rounded-xl border-2 border-red-600"
              >
                {mode === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{mode === 'signin' ? 'SIGN IN TO CHAGUO' : 'CREATE PERSISTENT ACCOUNT'}</span>
              </button>
            </form>

            <p className="text-[10px] text-center text-neutral-500 font-bold uppercase pt-1">
              🔒 Credentials and account session are persistently stored in your browser local storage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
