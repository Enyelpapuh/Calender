"use client"

import { Calendar, CalendarDays, CalendarRange, Bell, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ViewOption = "day" | "month" | "year" | "reminders"

interface CalendarSidebarProps {
  isOpen?: boolean
  onClose?: () => void
  selectedView: ViewOption
  onViewChange: (view: ViewOption) => void
}

export function CalendarSidebar({ isOpen = true, onClose, selectedView, onViewChange }: CalendarSidebarProps) {
  const menuItems = [
    {
      id: "day" as ViewOption,
      label: "Día",
      icon: Calendar,
    },
    {
      id: "month" as ViewOption,
      label: "Mes",
      icon: CalendarDays,
    },
    {
      id: "year" as ViewOption,
      label: "Año",
      icon: CalendarRange,
    },
    {
      id: "reminders" as ViewOption,
      label: "Recordatorios",
      icon: Bell,
    },
  ]

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-border bg-sidebar h-screen p-4 transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
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
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
