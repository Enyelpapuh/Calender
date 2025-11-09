import { Calendar, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Reminder, ReminderStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RemindersViewProps {
  reminders: Record<string, Reminder[]>
  onDeleteReminder: (date: Date, index: number) => void
  onUpdateReminderStatus: (date: Date, index: number, status: ReminderStatus) => void
  onDateClick: (date: Date) => void
}

export function RemindersView({
  reminders,
  onDeleteReminder,
  onUpdateReminderStatus,
  onDateClick,
}: RemindersViewProps) {
  const sortedDates = Object.keys(reminders)
    .filter((dateKey) => reminders[dateKey].length > 0)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  const formatDate = (dateKey: string) => {
    const [year, month, day] = dateKey.split("-").map(Number)
    const date = new Date(year, month - 1, day)

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

    return {
      full: `${dayNames[date.getDay()]}, ${day} de ${monthNames[month - 1]} de ${year}`,
      short: `${day} ${monthNames[month - 1]} ${year}`,
      date: date,
    }
  }

  const isToday = (dateKey: string) => {
    const [year, month, day] = dateKey.split("-").map(Number)
    const today = new Date()
    return day === today.getDate() && month - 1 === today.getMonth() && year === today.getFullYear()
  }

  const isPast = (dateKey: string) => {
    const [year, month, day] = dateKey.split("-").map(Number)
    const date = new Date(year, month - 1, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const getStatusBadge = (status: ReminderStatus) => {
    switch (status) {
      case "PENDIENTE":
        return "bg-yellow-500"
      case "ENVIADO":
        return "bg-green-500"
      case "FALLIDO":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const totalReminders = sortedDates.reduce((acc, dateKey) => acc + reminders[dateKey].length, 0)

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Todos los Recordatorios</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {totalReminders} {totalReminders === 1 ? "recordatorio" : "recordatorios"} en {sortedDates.length}{" "}
          {sortedDates.length === 1 ? "día" : "días"}
        </p>
      </div>

      {sortedDates.length === 0 ? (
        <div className="text-center py-12 border border-border rounded-lg">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No hay recordatorios programados</p>
          <p className="text-sm text-muted-foreground mt-2">Selecciona un día para agregar recordatorios</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDates.map((dateKey) => {
            const dateInfo = formatDate(dateKey)
            const dayReminders = reminders[dateKey]

            return (
              <div key={dateKey} className="border border-border rounded-lg p-4">
                <button
                  onClick={() => onDateClick(dateInfo.date)}
                  className="flex items-center gap-2 mb-3 hover:text-primary transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  <h3 className="font-semibold text-foreground">{dateInfo.short}</h3>
                  {isToday(dateKey) && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Hoy</span>
                  )}
                  {isPast(dateKey) && !isToday(dateKey) && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Pasado</span>
                  )}
                </button>

                <ul className="space-y-2">
                  {dayReminders.map((reminder, index) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg group">
                      <div className="flex items-center gap-3">
                        <span className={cn("w-3 h-3 rounded-full", getStatusBadge(reminder.status))} />
                        <span className="text-sm text-foreground">{reminder.text}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={reminder.status}
                          onChange={(e) =>
                            onUpdateReminderStatus(dateInfo.date, index, e.target.value as ReminderStatus)
                          }
                          className="bg-background border border-border rounded-md px-2 py-1 text-xs"
                        >
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="ENVIADO">Enviado</option>
                          <option value="FALLIDO">Fallido</option>
                        </select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteReminder(dateInfo.date, index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
