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
