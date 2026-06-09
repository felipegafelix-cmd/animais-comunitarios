"use client";

import { PawPrint, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { login, signup } from "@/app/actions/auth";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setErrorMessage("");
    startTransition(async () => {
      const result = isLogin ? await login(formData) : await signup(formData);
      if (result && result.error) {
        setErrorMessage(result.error);
      }
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-sm">
            <PawPrint className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isLogin
              ? "Acesse para gerenciar os animais do seu bairro"
              : "Junte-se à comunidade de cuidado animal"}
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="seu@email.com"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {errorMessage && (
            <p className="text-sm font-medium text-red-600" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 flex w-full items-center justify-center rounded-xl bg-teal-600 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isLogin ? (
              "Entrar"
            ) : (
              "Cadastrar"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage("");
            }}
            className="font-semibold text-teal-600 hover:text-teal-700 hover:underline focus:outline-none"
          >
            {isLogin ? "Cadastre-se" : "Faça login"}
          </button>
        </div>
      </div>
    </main>
  );
}
