"use client"

import type React from "react"

import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface DayViewProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  reminders: Record<string, string[]>
  onAddReminder: (date: Date, reminder: string) => void
  onDeleteReminder: (date: Date, index: number) => void
}

export function DayView({ selectedDate, onDateChange, reminders, onAddReminder, onDeleteReminder }: DayViewProps) {
  const [newReminder, setNewReminder] = useState("")

  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth()
  const day = selectedDate.getDate()

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

  const previousDay = () => {
    const newDate = new Date(year, month, day - 1)
    onDateChange(newDate)
  }

  const nextDay = () => {
    const newDate = new Date(year, month, day + 1)
    onDateChange(newDate)
  }

  const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  const dayReminders = reminders[dateKey] || []

  const handleAddReminder = () => {
    if (newReminder.trim()) {
      onAddReminder(selectedDate, newReminder.trim())
      setNewReminder("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddReminder()
    }
  }

  const isToday = () => {
    const today = new Date()
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {dayNames[selectedDate.getDay()]}, {day} de {monthNames[month]}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {year} {isToday() && "• Hoy"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={previousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="border border-border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-4 text-foreground">Agregar Recordatorio</h3>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Escribe un recordatorio..."
              value={newReminder}
              onChange={(e) => setNewReminder(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleAddReminder} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="border border-border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-4 text-foreground">Recordatorios ({dayReminders.length})</h3>
          {dayReminders.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No hay recordatorios para este día</p>
          ) : (
            <ul className="space-y-2">
              {dayReminders.map((reminder, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg group">
                  <span className="text-sm text-foreground">{reminder}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteReminder(selectedDate, index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
