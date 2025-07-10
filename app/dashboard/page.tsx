import {  initializeDatabase, listingQueries } from "@/lib/db"
import { useEffect } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import DashboardHome from "@/components/dashboard/DashboardHome"

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
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const admin = await getAdminFromSession()

  if (!admin) {
    redirect("/login")
  }


  const params = await searchParams
  const page = Number.parseInt((params.page as string) || "1")
  const status = (params.status as string) || "all"
  const limit = 10

  const { listings, total, totalPages } = listingQueries.getAll(page, limit, status === "all" ? undefined : status)

  return (
    <DashboardHome
      initialListings={listings}
      initialTotal={total}
      initialTotalPages={totalPages}
      currentPage={page}
      currentStatus={status}
      admin={admin}
    />
  )
}
