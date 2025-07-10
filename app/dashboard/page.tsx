import {  initializeDatabase, listingQueries } from "@/lib/db"
import DashboardClient from "@/components/dashboard/DashboardHome"
import { useEffect } from "react"
import DashboardHome from "@/components/dashboard/DashboardHome"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {


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
      admin={{
        id: 1, 
        email: "admin@carlist.com",
        name: "Admin User",
        created_at: new Date().toISOString(),
      }}
    />
  )
}
