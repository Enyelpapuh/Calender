// Página de inicio de sesión
"use client"
import { RegisterForm } from "@/components/Elementos/register-form"
import { Link } from "react-router-dom"
import { Lock } from "lucide-react"

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <Lock className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Ingresar</h1>
          <p className="text-muted-foreground">Accede a tu cuenta para continuar</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 space-y-6 shadow-md">
          <RegisterForm />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-card text-muted-foreground">¿Ya tienes cuenta?</span>
            </div>
          </div>

          <Link to="/login" className="block text-center group">
            <span className="text-sm text-muted-foreground group-hover:text-primary transition">
              Inicia sesion aquí
            </span>
          </Link>
        </div>
      </div>
    </main>
  )
}
