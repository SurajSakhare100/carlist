import { type NextRequest, NextResponse } from "next/server"
import { adminQueries, initializeDatabase } from "@/lib/db"
import { cookies } from "next/headers"

// Initialize database on first API call
initializeDatabase()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find admin by email
    const admin = adminQueries.findByEmail(email)

    if (!admin || admin.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Set session cookie (in production, use proper JWT or session management)
    const cookieStore = await cookies()
    cookieStore.set(
      "admin-session",
      JSON.stringify({
        id: admin.id,
        email: admin.email,
        name: admin.name,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      },
    )

    return NextResponse.json({
      id: admin.id,
      email: admin.email,
      name: admin.name,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
