const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, Eye, EyeOff, UserPlus } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import BrandLogo from "@/components/BrandLogo";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await db.auth.register({ email, password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await db.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        db.auth.setToken(result.access_token);
      }
      const rt = safeReturnTo();
      window.location.href = rt === "/" ? "/dashboard" : rt;
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await db.auth.resendOtp(email);
      toast({ title: "Code sent", description: "Check your email for the new code." });
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  const handleGoogle = () => {
    const rt = safeReturnTo();
    db.auth.loginWithProvider("google", rt === "/" ? "/dashboard" : rt);
  };

  // ---- OTP Verification Step ----
  if (showOtp) {
    return (
      <div className="min-h-screen bg-[#f5f7f9] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px]">
          <div className="flex flex-col items-center mb-7">
            <BrandLogo size={56} />
            <h1 className="mt-4 text-2xl font-bold text-[#2E7D32]">Charing's</h1>
            <p className="text-[11px] tracking-[0.2em] font-semibold text-[#37474F] mt-0.5">GROCERY STORE</p>
          </div>
          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#E0E0E0] p-7">
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Verify your email</h2>
              <p className="text-sm text-muted-foreground mt-1">We sent a code to {email}</p>
            </div>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
            )}
            <div className="flex justify-center mb-6">
              <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button className="w-full h-11 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold text-sm rounded-lg" onClick={handleVerify} disabled={loading || otpCode.length < 6}>
              {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Verifying...</>) : "Verify"}
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Didn't receive the code?{" "}
              <button onClick={handleResend} className="text-[#2E7D32] font-semibold hover:underline">Resend</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---- Register Form ----
  return (
    <div className="min-h-screen bg-[#f5f7f9] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px]">
        <div className="flex flex-col items-center mb-7">
          <BrandLogo size={56} />
          <h1 className="mt-4 text-2xl font-bold text-[#2E7D32]">Charing's</h1>
          <p className="text-[11px] tracking-[0.2em] font-semibold text-[#37474F] mt-0.5">GROCERY STORE</p>
          <p className="text-xs text-muted-foreground mt-1">Web POS &amp; Inventory Suite</p>
        </div>

        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#E0E0E0] p-7">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Create your account</h2>
              <p className="text-xs text-muted-foreground">Sign up to start managing your store</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[13px] font-medium text-[#37474F]">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" autoComplete="email" autoFocus placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 text-sm border-[#E0E0E0] focus:border-primary" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[13px] font-medium text-[#37474F]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-11 text-sm border-[#E0E0E0] focus:border-primary" required />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Toggle password">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm" className="text-[13px] font-medium text-[#37474F]">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="confirm" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 h-11 text-sm border-[#E0E0E0] focus:border-primary" required />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-semibold text-sm rounded-lg" disabled={loading}>
              {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</>) : "Create Account"}
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E0E0E0]" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-muted-foreground font-medium">OR</span></div>
          </div>

          <Button type="button" variant="outline" onClick={handleGoogle} className="w-full h-11 bg-white border-[#E0E0E0] text-[#37474F] font-medium text-sm rounded-lg hover:bg-gray-50">
            <GoogleIcon className="w-5 h-5 mr-2.5" />Continue with Google
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-5">
          Already have an account?{" "}
          <Link to={"/login" + (safeReturnTo() !== "/" ? "?returnTo=" + encodeURIComponent(safeReturnTo()) : "")} className="text-[#2E7D32] font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}