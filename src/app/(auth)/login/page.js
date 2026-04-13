"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("E-mail ou senha inválidos.");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `
          radial-gradient(ellipse at 15% 50%, hsla(320, 45%, 72%, 0.9) 0%, transparent 55%),
          radial-gradient(ellipse at 78% 8%,  hsla(198, 38%, 74%, 0.75) 0%, transparent 48%),
          radial-gradient(ellipse at 72% 88%, hsla(38,  58%, 74%, 0.85) 0%, transparent 50%),
          radial-gradient(ellipse at 42% 62%, hsla(12,  50%, 72%, 0.65) 0%, transparent 52%),
          hsla(35, 50%, 88%, 1)
        `.replace(/\n\s+/g, " "),
      }}
    >
      {/* Card branco central */}
      <div className="w-full max-w-[380px] bg-white rounded-2xl shadow-xl px-8 py-10">

        {/* Logo + título */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
            <Image src="/logo.png" alt="Logo" width={64} height={64} className="object-contain w-full h-full" />
          </div>
          <h1 className="text-[18px] font-bold text-slate-800 font-heading tracking-tight text-center">
            Escola Castelo do Saber
          </h1>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-4">

          <div className="space-y-1">
            <label className="text-sm text-slate-600 font-medium">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 rounded-lg px-4 text-sm text-slate-800 placeholder-slate-400
                         border border-slate-300 bg-white
                         focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100
                         transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-600 font-medium">Senha</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-11 rounded-lg px-4 pr-10 text-sm text-slate-800 placeholder-slate-400
                           border border-slate-300 bg-white
                           focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100
                           transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-full text-sm font-bold mt-1
                       bg-amber-400 hover:bg-amber-500 active:bg-amber-600
                       text-white transition-colors
                       flex items-center justify-center
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          A tecnologia que transforma o futuro da sua escola.
        </p>
      </div>
    </div>
  );
}
