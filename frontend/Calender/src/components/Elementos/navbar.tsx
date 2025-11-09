"use client"

import { ThemeToggle } from "./theme-toggle"
import { Menu, LogOut, LogIn, UserPlus } from "lucide-react" // Importamos nuevos iconos
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useAuth } from "@/lib/auth"

// La interfaz de props ya no necesita onLogout, lo manejamos con el contexto
interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  // Obtenemos todo lo que necesitamos del contexto de autenticación
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-card border-b border-border">
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-accent rounded-md transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/" className="text-xl font-semibold text-foreground">
          Calendario
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        {/* --- RENDERIZADO CONDICIONAL --- */}
        {isAuthenticated && user ? (
          // Si el usuario está autenticado
          <>
            <span className="text-sm font-medium text-foreground hidden sm:inline">
              Hola, {user.username}
            </span>
            <Button variant="ghost" size="icon" onClick={logout} aria-label="Cerrar sesión">
              <LogOut className="h-5 w-5" />
            </Button>
          </>
        ) : (
          // Si es un invitado
          <>
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">
                <UserPlus className="h-4 w-4 mr-2" />
                Registrarse
              </Link>
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
