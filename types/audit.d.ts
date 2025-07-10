export type AuditLog = {
  id: string | number
  created_at: string
  admin_email: string
  listing_title?: string
  listing_id?: string | number
  action: string
  notes?: string
}