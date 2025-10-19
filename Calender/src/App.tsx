"use client"

import { CalendarSidebar } from "@/components/Elementos/calendar-sidebar"
import { MonthView } from "@/components/Elementos/month-view"
import { YearView } from "@/components/Elementos/year-view"
import { DayView } from "@/components/Elementos/day-view"
import { RemindersView } from "@/components/Elementos/reminders-view"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"

type ViewOption = "day" | "month" | "year" | "reminders"

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedView, setSelectedView] = useState<ViewOption>("month")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [reminders, setReminders] = useState<Record<string, string[]>>({})

  useEffect(() => {
    const savedReminders = localStorage.getItem("calendar-reminders")
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("calendar-reminders", JSON.stringify(reminders))
  }, [reminders])

  const getDateKey = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const handleAddReminder = (date: Date, reminder: string) => {
    const dateKey = getDateKey(date)
    setReminders((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), reminder],
    }))
  }

  const handleDeleteReminder = (date: Date, index: number) => {
    const dateKey = getDateKey(date)
    setReminders((prev) => {
      const newReminders = { ...prev }
      newReminders[dateKey] = newReminders[dateKey].filter((_, i) => i !== index)
      if (newReminders[dateKey].length === 0) {
        delete newReminders[dateKey]
      }
      return newReminders
    })
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedView("day")
  }

  const handleMonthClick = (month: number) => {
    const newDate = new Date(selectedDate.getFullYear(), month, 1)
    setSelectedDate(newDate)
    setSelectedView("month")
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedView("day")
  }

  return (
    <div className="flex min-h-screen">
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 bg-sidebar border border-border rounded-md shadow-lg hover:bg-sidebar-accent transition-colors"
        aria-label="Abrir menú"
      >
        <Menu className="h-6 w-6 text-sidebar-foreground" />
      </button>

      <CalendarSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedView={selectedView}
        onViewChange={setSelectedView}
      />

      <main className="flex-1 p-8 pt-20 lg:pt-8 bg-background">
        {selectedView === "month" && (
          <MonthView
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onDayClick={handleDayClick}
            reminders={reminders}
          />
        )}

        {selectedView === "year" && (
          <YearView
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onMonthClick={handleMonthClick}
            reminders={reminders}
          />
        )}

        {selectedView === "day" && (
          <DayView
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            reminders={reminders}
            onAddReminder={handleAddReminder}
            onDeleteReminder={handleDeleteReminder}
          />
        )}

        {selectedView === "reminders" && (
          <RemindersView reminders={reminders} onDeleteReminder={handleDeleteReminder} onDateClick={handleDateClick} />
        )}
      </main>
    </div>
  )
}
