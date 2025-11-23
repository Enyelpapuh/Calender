"use client"

import { CalendarSidebar } from "@/components/Elementos/calendar-sidebar"
import { MonthView } from "@/components/Elementos/month-view"
import { YearView } from "@/components/Elementos/year-view"
import { DayView } from "@/components/Elementos/day-view"
import { RemindersView } from "@/components/Elementos/reminders-view"
import { Navbar } from "@/components/Elementos/navbar"
import { useState, useEffect, useCallback } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import RegisterPage from "@/components/Elementos/RegisterPage"
import LoginPage from "@/components/Elementos/LoginPage"
import type { Reminder, ReminderStatus } from "@/lib/types"
import { useAuth } from "@/lib/auth"

type ViewOption = "day" | "month" | "year" | "reminders"

export default function App() {
  const { isAuthenticated, token } = useAuth(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedView, setSelectedView] = useState<ViewOption>("month")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [reminders, setReminders] = useState<Record<string, Reminder[]>>({})
  const navigate = useNavigate()

  // --- LÓGICA DE CARGA DE DATOS MEJORADA ---
  // Usamos useCallback para memorizar la función y evitar que se recree innecesariamente.
  const fetchEvents = useCallback(async () => {
    if (isAuthenticated && token) {
      try {
        const response = await fetch("/api/events/", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("No se pudieron cargar los eventos.");
        
        const events = await response.json();
        
        const remindersFormatted: Record<string, Reminder[]> = {};
        for (const event of events) {
          const dateKey = event.FechaInicio.split('T')[0];
          if (!remindersFormatted[dateKey]) {
            remindersFormatted[dateKey] = [];
          }
          remindersFormatted[dateKey].push({
            text: event.Descripcion ? `${event.Titulo}: ${event.Descripcion}` : event.Titulo,
            status: "PENDIENTE"
          });
        }
        setReminders(remindersFormatted);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
        setReminders({}); // Limpiamos en caso de error para no mostrar datos viejos
      }
    } else {
      setReminders({});
    }
  }, [isAuthenticated, token]); // Depende del estado de autenticación y del token

  // useEffect ahora solo llama a fetchEvents cuando cambia la autenticación.
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);


  const handleViewChange = (view: ViewOption) => {
    navigate("/")
    setSelectedView(view)
  }

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
      <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

      <CalendarSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedView={selectedView}
        onViewChange={handleViewChange}
      />

      <main className="flex-1 p-8 pt-24 bg-background">
        <Routes>
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
                    onEventCreated={fetchEvents} 
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  )
}
