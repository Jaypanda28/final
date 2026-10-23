'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (identifier) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center p-2 text-white shadow-xl group-hover:scale-105 transition-transform">
            <img
              src="/brand/logo-mark.png"
              alt="Shri PinnakEdge"
              className="w-full h-full object-contain"
            />
          </div>
        </Link>
        <h2 className="mt-4 text-2xl font-black text-white">
          Reset Portal Password
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Shri PinnakEdge Institutional Account Recovery
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Recovery Instructions Sent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an account exists for <span className="font-semibold text-slate-900">{identifier}</span>, a secure password reset link has been dispatched to the registered mobile / email.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your registered student ID (e.g. <span className="font-mono font-semibold">SPE-STU-2026-001</span>) or official institute email.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institute ID or Email
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="student.aarav@pinnakeedge.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
                Send Password Reset Link
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
