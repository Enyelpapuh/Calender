"use client"

import { CalendarSidebar } from "@/components/Elementos/calendar-sidebar"
import { MonthView } from "@/components/Elementos/month-view"
import { YearView } from "@/components/Elementos/year-view"
import { DayView } from "@/components/Elementos/day-view"
import { RemindersView } from "@/components/Elementos/reminders-view"
import { Navbar } from "@/components/Elementos/navbar"
import { useState, useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import RegisterPage from "@/components/Elementos/RegisterPage"
import LoginPage from "@/components/Elementos/LoginPage"
import type { Reminder, ReminderStatus } from "@/lib/types"
import { useAuth } from "@/lib/auth"

type ViewOption = "day" | "month" | "year" | "reminders"

export default function App() {
  // Obtenemos el estado de autenticación
  const { isAuthenticated } = useAuth(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedView, setSelectedView] = useState<ViewOption>("month")
  const [selectedDate, setSelectedDate] = useState(new Date())
  // El estado de los recordatorios ahora sirve para usuarios invitados y autenticados
  const [reminders, setReminders] = useState<Record<string, Reminder[]>>({})
  const navigate = useNavigate()

  const handleViewChange = (view: ViewOption) => {
    navigate("/")
    setSelectedView(view)
  }

  // --- EFECTOS CONDICIONALES ---
  // Cargar recordatorios desde localStorage SOLO si el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const savedReminders = localStorage.getItem("calendar-reminders")
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders))
      }
    }
    // Si no está autenticado, el estado 'reminders' empieza vacío.
  }, [isAuthenticated]) // Se ejecuta cuando cambia el estado de autenticación

  // Guardar recordatorios en localStorage SOLO si el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("calendar-reminders", JSON.stringify(reminders))
    }
  }, [reminders, isAuthenticated])

  const getDateKey = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const handleAddReminder = (date: Date, reminderText: string) => {
    const dateKey = getDateKey(date)
    const newReminder: Reminder = { text: reminderText, status: "PENDIENTE" }
    setReminders((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newReminder],
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

  const handleUpdateReminderStatus = (date: Date, index: number, status: ReminderStatus) => {
    const dateKey = getDateKey(date)
    setReminders((prev) => {
      const newReminders = { ...prev }
      const reminderToUpdate = newReminders[dateKey][index]
      if (reminderToUpdate) {
        newReminders[dateKey][index] = { ...reminderToUpdate, status }
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
      {/* La Navbar y Sidebar ahora se muestran siempre */}
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

      <CalendarSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedView={selectedView}
        onViewChange={handleViewChange}
      />

      <main className="flex-1 p-8 pt-24 bg-background">
        <Routes>
          {/* La ruta principal ya no está protegida, es para todos */}
          <Route
            path="/"
            element={
              <>
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
                    onUpdateReminderStatus={handleUpdateReminderStatus}
                  />
                )}

                {selectedView === "reminders" && (
                  <RemindersView
                    reminders={reminders}
                    onDeleteReminder={handleDeleteReminder}
                    onUpdateReminderStatus={handleUpdateReminderStatus}
                    onDateClick={handleDateClick}
                  />
                )}
              </>
            }
          />
          {/* Las rutas de login y registro siguen igual */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  )
}
