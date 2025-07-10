import { Admin, AuditLog, Listing } from "@/types/car"
import Database from "better-sqlite3"
import path from "path"

const dbPath = path.join(process.cwd(), "database.sqlite")
const db = new Database(dbPath)

db.pragma("foreign_keys = ON")

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price_per_day DECIMAL(10,2) NOT NULL,
      location TEXT NOT NULL,
      car_make TEXT NOT NULL,
      car_model TEXT NOT NULL,
      car_year INTEGER NOT NULL,
      image_url TEXT,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
      submitted_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id INTEGER NOT NULL,
      admin_email TEXT NOT NULL,
      action TEXT NOT NULL,
      old_status TEXT,
      new_status TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (listing_id) REFERENCES listings (id)
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  const insertAdmin = db.prepare(`
    INSERT OR IGNORE INTO admins (email, password, name) VALUES (?, ?, ?)
  `)
  insertAdmin.run("admin@carlist.com", "admin123", "Admin User")

  const insertListing = db.prepare(`
    INSERT OR IGNORE INTO listings (title, description, price_per_day, location, car_make, car_model, car_year, image_url, status, submitted_by) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const sampleListings = [
    [
      "Spacious Ford Explorer - Family Adventure Ready",
      "Large SUV perfect for family adventures. Plenty of space for luggage and passengers.",
      65.75,
      "Chicago, IL",
      "Ford",
      "Explorer",
      2022,
      "/car/car1.avif",
      "rejected",
      "sarah.wilson@email.com",
    ],
    [
      "Compact Nissan Versa - Budget-Friendly Option",
      "Affordable and efficient compact car. Great for short trips and budget-conscious travelers.",
      35.25,
      "Miami, FL",
      "Nissan",
      "Versa",
      2020,
      "/car/car2.avif",
      "approved",
      "david.brown@email.com",
    ],
    [
      "Premium Mercedes C-Class - Luxury Experience",
      "Experience luxury with this Mercedes C-Class. Premium interior and smooth performance.",
      95.0,
      "Seattle, WA",
      "Mercedes",
      "C-Class",
      2023,
      "/car/car3.avif",
      "pending",
      "lisa.garcia@email.com",
    ],
    [
      "Rugged Jeep Wrangler - Off-Road Adventure",
      "Built for adventure! This Jeep Wrangler can handle any terrain you throw at it.",
      70.0,
      "Denver, CO",
      "Jeep",
      "Wrangler",
      2021,
      "/car/car4.avif",
      "approved",
      "tom.anderson@email.com",
    ],
    [
      "Efficient Toyota Prius - Hybrid Technology",
      "Save on gas with this efficient Toyota Prius. Perfect for environmentally conscious drivers.",
      50.0,
      "Portland, OR",
      "Toyota",
      "Prius",
      2022,
      "/car/car5.avif",
      "pending",
      "emma.davis@email.com",
    ],
  ]

  sampleListings.forEach((listing) => {
    insertListing.run(...listing)
  })
}
export const listingQueries = {
  getAll: (page = 1, limit = 10, status?: string) => {
    const offset = (page - 1) * limit
    let query = "SELECT * FROM listings"
    let countQuery = "SELECT COUNT(*) as total FROM listings"
    const params: any[] = []

    if (status && status !== "all") {
      query += " WHERE status = ?"
      countQuery += " WHERE status = ?"
      params.push(status)
    }

    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    const listings = db.prepare(query).all(...params, limit, offset) as Listing[]
    const total = (db.prepare(countQuery).get(...params) as { total: number }).total

    return { listings, total, totalPages: Math.ceil(total / limit) }
  },

  getById: (id: number) => {
    return db.prepare("SELECT * FROM listings WHERE id = ?").get(id) as Listing | undefined
  },

  updateStatus: (id: number, status: string, adminEmail: string) => {
    const listing = listingQueries.getById(id)
    if (!listing) return null

    const oldStatus = listing.status
    db.prepare("UPDATE listings SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(status, id)

    // Log the action
    auditQueries.create({
      listing_id: id,
      admin_email: adminEmail,
      action: `Status changed from ${oldStatus} to ${status}`,
      old_status: oldStatus,
      new_status: status,
      notes: null,
    })

    return listingQueries.getById(id)
  },

  update: (id: number, data: Partial<Listing>, adminEmail: string) => {
    const listing = listingQueries.getById(id)
    if (!listing) return null

    const updateFields = []
    const values = []

    Object.entries(data).forEach(([key, value]) => {
      if (key !== "id" && key !== "created_at" && key !== "updated_at") {
        updateFields.push(`${key} = ?`)
        values.push(value)
      }
    })

    if (updateFields.length === 0) return listing

    updateFields.push("updated_at = CURRENT_TIMESTAMP")
    values.push(id)

    const query = `UPDATE listings SET ${updateFields.join(", ")} WHERE id = ?`
    db.prepare(query).run(...values)

    auditQueries.create({
      listing_id: id,
      admin_email: adminEmail,
      action: "Listing updated",
      old_status: null,
      new_status: null,
      notes: `Updated fields: ${Object.keys(data).join(", ")}`,
    })

    return listingQueries.getById(id)
  },
}

export const auditQueries = {
  create: (data: Omit<AuditLog, "id" | "created_at">) => {
    const stmt = db.prepare(`
      INSERT INTO audit_logs (listing_id, admin_email, action, old_status, new_status, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(data.listing_id, data.admin_email, data.action, data.old_status, data.new_status, data.notes)
  },

  getAll: (page = 1, limit = 20) => {
    const offset = (page - 1) * limit
    const logs = db
      .prepare(`
      SELECT al.*, l.title as listing_title 
      FROM audit_logs al 
      LEFT JOIN listings l ON al.listing_id = l.id 
      ORDER BY al.created_at DESC 
      LIMIT ? OFFSET ?
    `)
      .all(limit, offset)

    const total = (db.prepare("SELECT COUNT(*) as total FROM audit_logs").get() as { total: number }).total

    return { logs, total, totalPages: Math.ceil(total / limit) }
  },
}

export const adminQueries = {
  findByEmail: (email: string) => {
    return db.prepare("SELECT * FROM admins WHERE email = ?").get(email) as Admin | undefined
  },
}

initializeDatabase()
export default db
