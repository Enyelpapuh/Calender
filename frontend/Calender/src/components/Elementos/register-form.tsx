"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react"

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setLoading(true)

    try {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("Por favor completa todos los campos")
        return
      }

      if (formData.name.length < 2) {
        setError("El nombre debe tener al menos 2 caracteres")
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError("Por favor ingresa un correo válido")
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden")
        return
      }

      if (formData.password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres")
        return
      }

      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Error al registrarse. Intenta de nuevo.");
        return;
      }

      setSuccess(true)
      setTimeout(() => {
        setFormData({ name: "", email: "", password: "", confirmPassword: "" })
      }, 1500)
    } catch (err) {
      setError("Error al registrarse. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-200">
          Nombre Completo
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Juan Pérez"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            className="pl-10 bg-input text-foreground placeholder-muted-foreground border-border dark:bg-input dark:text-foreground dark:border-border"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-200">
          Correo Electrónico
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            className="pl-10 bg-input text-foreground placeholder-muted-foreground border-border dark:bg-input dark:text-foreground dark:border-border"
            required
          />
        </div>
        <p className="text-xs text-slate-400">Mínimo 8 caracteres</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-slate-200">
          Confirmar Contraseña
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
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
          ¡Cuenta creada correctamente!
        </div>
      )}

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium" disabled={loading}>
        {loading ? "Cargando..." : "Crear Cuenta"}
      </Button>

      <p className="text-xs text-slate-400 text-center">
        Al registrarte, aceptas nuestros{" "}
        <a href="#" className="text-blue-400 hover:underline">
          términos y condiciones
        </a>
      </p>
    </form>
  )
}
