export type ReminderStatus = "PENDIENTE" | "ENVIADO" | "FALLIDO"

export type Reminder = {
  text: string
  status: ReminderStatus
}
