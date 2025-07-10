import { type NextRequest, NextResponse } from "next/server"
import { auditQueries } from "@/lib/db"
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
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  try {
    const result = auditQueries.getAll(page, limit)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
}
