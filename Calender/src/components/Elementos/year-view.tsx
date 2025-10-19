"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface YearViewProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  onMonthClick: (month: number) => void
  reminders: Record<string, string[]>
}

export function YearView({ selectedDate, onDateChange, onMonthClick, reminders }: YearViewProps) {
  const year = selectedDate.getFullYear()

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

  const previousYear = () => {
    onDateChange(new Date(year - 1, 0, 1))
  }

  const nextYear = () => {
    onDateChange(new Date(year + 1, 0, 1))
  }

  const getDaysInMonth = (month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const hasRemindersInMonth = (month: number) => {
    const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`
    return Object.keys(reminders).some((key) => key.startsWith(monthKey) && reminders[key].length > 0)
  }

  const renderMiniCalendar = (month: number) => {
    const daysInMonth = getDaysInMonth(month)
    const firstDay = getFirstDayOfMonth(month)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return (
      <div className="grid grid-cols-7 gap-0.5 mt-2">
        {days.map((day, index) => (
          <div
            key={index}
            className={cn(
              "aspect-square flex items-center justify-center text-[10px]",
              day && "text-foreground",
              !day && "text-transparent",
            )}
          >
            {day || "0"}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">{year}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={previousYear}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextYear}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {monthNames.map((monthName, index) => (
          <button
            key={index}
            onClick={() => onMonthClick(index)}
            className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left relative"
          >
            <h3 className="font-semibold text-sm mb-1 text-foreground">{monthName}</h3>
            {hasRemindersInMonth(index) && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />}
            {renderMiniCalendar(index)}
          </button>
        ))}
      </div>
    </div>
  )
}
