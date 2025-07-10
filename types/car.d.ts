export interface Listing {
  id: number
  title: string
  description: string
  price_per_day: number
  location: string
  car_make: string
  car_model: string
  car_year: number
  image_url: string | null
  status: "pending" | "approved" | "rejected"
  submitted_by: string
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: number
  listing_id: number
  admin_email: string
  action: string
  old_status: string | null
  new_status: string | null
  notes: string | null
  created_at: string
}

export interface Admin {
  id: number
  email: string
  password: string
  name: string
  created_at: string
}