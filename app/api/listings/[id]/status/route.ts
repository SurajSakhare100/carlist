import { type NextRequest, NextResponse } from "next/server"
import { listingQueries } from "@/lib/db"
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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromSession()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { status } = await request.json()

  if (!["pending", "approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  try {
    const updatedListing = listingQueries.updateStatus(Number.parseInt(id), status, admin.email)

    if (!updatedListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json(updatedListing)
  } catch (error) {
    console.error("Error updating listing status:", error)
    return NextResponse.json({ error: "Failed to update listing status" }, { status: 500 })
  }
}
