import { type NextRequest, NextResponse } from "next/server"
import { listingQueries, initializeDatabase } from "@/lib/db"
import { cookies } from "next/headers"


async function getAdminFromSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("admin-session")

  if (!sessionCookie) {
    return null
  }

  try {
    return JSON.parse(sessionCookie.value)
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const admin = await getAdminFromSession()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const status = searchParams.get("status") || undefined

  try {
    const result = listingQueries.getAll(page, limit, status)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching listings:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}
