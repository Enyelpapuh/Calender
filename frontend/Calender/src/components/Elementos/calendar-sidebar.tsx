"use client"

import { useState } from "react"
import { Calendar, CalendarDays, CalendarRange, Bell, X, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

type ViewOption = "day" | "month" | "year" | "reminders"

interface CalendarSidebarProps {
  isOpen?: boolean
  onClose?: () => void
  selectedView: ViewOption
  onViewChange: (view: ViewOption) => void
}

interface Reminder {
  id: number
  title: string
  date: string
}

export function CalendarSidebar({
  isOpen = true,
  onClose,
  selectedView,
  onViewChange,
}: CalendarSidebarProps) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const menuItems = [
    { id: "day" as ViewOption, label: "Día", icon: Calendar },
    { id: "month" as ViewOption, label: "Mes", icon: CalendarDays },
    { id: "year" as ViewOption, label: "Año", icon: CalendarRange },
    { id: "reminders" as ViewOption, label: "Recordatorios", icon: Bell },
  ]

  // Función para obtener recordatorios manualmente desde el backend
  const fetchReminders = () => {
    setLoading(true)
    setError(null)

    fetch("http://localhost:8000/api/reminders/")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los recordatorios")
        return res.json()
      })
      .then((data) => {
        setReminders(data)
        console.log(data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  // Opcional: podrías llamar a fetchReminders() cuando se abra la vista por primera vez
  // useEffect(() => { if (selectedView === "reminders") fetchReminders() }, [selectedView])

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-border bg-sidebar h-screen p-4 transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Calendario</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-sidebar-accent rounded-md transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5 text-sidebar-foreground" />
          </button>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isSelected = selectedView === item.id

            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id)
                  if (onClose) onClose()
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isSelected
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* 🔹 Mostrar recordatorios si está seleccionada la vista */}
        {selectedView === "reminders" && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-sidebar-foreground">Tus Recordatorios</h3>
              <button
                onClick={fetchReminders}
                className="inline-flex items-center gap-2 px-2 py-1 text-xs rounded-md bg-sidebar-accent/20 hover:bg-sidebar-accent/40 transition-colors"
                aria-label="Actualizar recordatorios"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Actualizar</span>
              </button>
            </div>
            {loading && <p className="text-xs text-muted-foreground">Cargando...</p>}
            {error && <p className="text-xs text-red-500">{error}</p>}
            {!loading && !error && reminders.length === 0 && (
              <p className="text-xs text-muted-foreground">No hay recordatorios.</p>
            )}
            {!loading &&
              reminders.map((r) => (
                <div
                  key={r.id}
                  className="bg-sidebar-accent/30 p-2 rounded-md text-sm text-sidebar-foreground"
                >
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.date}</p>
                </div>
              ))}
          </div>
        )}
      </aside>
    </>
  )
}
