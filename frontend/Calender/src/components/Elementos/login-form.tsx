"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/auth"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setLoading(true)

    try {
      if (!email || !password) {
        setError("Por favor completa todos los campos")
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError("Por favor ingresa un correo válido")
        return
      }

      const response = await fetch("/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Error al iniciar sesión. Intenta de nuevo.");
        return;
      }

      const data = await response.json();

      // Guardar el token en el almacenamiento local
      login(data.access, data.refresh);
      setSuccess(true);

    } catch (err) {
      setError("Error al iniciar sesión. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-200">
          Correo Electrónico
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="pl-10 bg-input text-foreground placeholder-muted-foreground border-border dark:bg-input dark:text-foreground dark:border-border"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-slate-200">
          Contraseña
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="pl-10 bg-input text-foreground placeholder-muted-foreground border-border dark:bg-input dark:text-foreground dark:border-border"
            required
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ¡Sesión iniciada correctamente!
        </div>
      )}

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium" disabled={loading}>
        {loading ? "Cargando..." : "Ingresar"}
      </Button>

      <div className="text-center">
        <a href="#" className="text-sm text-slate-400 hover:text-blue-400 transition">
          ¿Olvidaste tu contraseña?
        </a>
      </div>
    </form>
  )
}
