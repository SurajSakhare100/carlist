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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromSession()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const listing = listingQueries.getById(Number.parseInt(id))

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 })
  }

  return NextResponse.json(listing)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromSession()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const data = await request.json()

  try {
    const updatedListing = listingQueries.update(Number.parseInt(id), data, admin.email)

    if (!updatedListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json(updatedListing)
  } catch (error) {
    console.error("Error updating listing:", error)
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 })
  }
}
