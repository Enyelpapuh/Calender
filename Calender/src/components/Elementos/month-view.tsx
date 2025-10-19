"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MonthViewProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  onDayClick: (date: Date) => void
  reminders: Record<string, string[]>
}

export function MonthView({ selectedDate, onDateChange, onDayClick, reminders }: MonthViewProps) {
  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

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

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const previousMonth = () => {
    onDateChange(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    onDateChange(new Date(year, month + 1, 1))
  }

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  const getDateKey = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const hasReminders = (day: number) => {
    const dateKey = getDateKey(day)
    return reminders[dateKey] && reminders[dateKey].length > 0
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((dayName) => (
          <div key={dayName} className="text-center text-sm font-semibold text-muted-foreground py-2">
            {dayName}
          </div>
        ))}

        {days.map((day, index) => (
          <div key={index} className={cn("aspect-square p-2 text-center relative", day && "cursor-pointer")}>
            {day && (
              <button
                onClick={() => onDayClick(new Date(year, month, day))}
                className={cn(
                  "w-full h-full rounded-lg flex flex-col items-center justify-center transition-colors hover:bg-accent",
                  isToday(day) && "bg-primary text-primary-foreground hover:bg-primary/90",
                  !isToday(day) && "text-foreground",
                )}
              >
                <span className="text-sm font-medium">{day}</span>
                {hasReminders(day) && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
