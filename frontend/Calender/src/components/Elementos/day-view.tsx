import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { Reminder, ReminderStatus } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth"; // Importamos useAuth

interface DayViewProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  reminders: Record<string, Reminder[]>
  onAddReminder: (date: Date, reminder: string) => void
  onDeleteReminder: (date: Date, index: number) => void
  onUpdateReminderStatus: (date: Date, index: number, status: ReminderStatus) => void
}

interface ReminderFormValues {
  title: string
  description: string
}

export function DayView({
  selectedDate,
  onDateChange,
  reminders,
  onAddReminder,
  onDeleteReminder,
  onUpdateReminderStatus,
}: DayViewProps) {
  const { isAuthenticated } = useAuth(); // Obtenemos el estado de autenticación
  const form = useForm<ReminderFormValues>({
    defaultValues: { title: "", description: "" },
  })
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const onSubmit: SubmitHandler<ReminderFormValues> = async (data) => {
    setError(null);
    if (!data.title.trim()) {
      form.setError("title", {
        type: "manual",
        message: "El título es obligatorio.",
      })
      return
    }

    // --- LÓGICA CONDICIONAL ---
    if (isAuthenticated) {
      // Si está autenticado, envía al backend
      const token = localStorage.getItem('accessToken');
      if (!token) {
          setError("Error de autenticación. Por favor, inicia sesión de nuevo.");
          return;
      }

      const payload = {
        Titulo: data.title,
        Descripcion: data.description,
        FechaInicio: selectedDate.toISOString(),
      };

      // Muestra en la consola del navegador lo que se va a enviar
      console.log("Enviando al backend:", JSON.stringify(payload, null, 2)); 

      try {
          const response = await fetch("http://localhost:8000/api/events/create/", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify(payload), // Usamos el payload
          });

          if (!response.ok) {
              const errorData = await response.json();
              setError(errorData.detail || "Error al crear el evento.");
              return;
          }

          const newEvent = await response.json();
          // Usamos onAddReminder para mantener la UI sincronizada
          onAddReminder(selectedDate, `${newEvent.Titulo}: ${newEvent.Descripcion}`);
          form.reset();

      } catch (err) {
          setError("Ocurrió un error de red. Inténtalo de nuevo.");
      }
    } else {
      // Si es un invitado, solo añade el recordatorio al estado local
      const newReminderText = data.description 
        ? `${data.title}: ${data.description}` 
        : data.title;
      onAddReminder(selectedDate, newReminderText);
      form.reset();
    }
  }

  const isToday = () => {
    const today = new Date()
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "El título es obligatorio" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Reunión de equipo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ej: Discutir el próximo sprint" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Agregar Recordatorio
              </Button>
            </form>
          </Form>
        </div>

        <div className="border border-border rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-4 text-foreground">Recordatorios ({dayReminders.length})</h3>
          {dayReminders.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No hay recordatorios para este día</p>
          ) : (
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
                        onUpdateReminderStatus(selectedDate, index, e.target.value as ReminderStatus)
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
                      onClick={() => onDeleteReminder(selectedDate, index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
