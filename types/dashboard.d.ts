import {  Listing } from "./car"

interface dashAdmin {
    id: number
    email: string
    name: string
    created_at: string
    }
export interface DashboardClientProps {
    initialListings: Listing[]
    initialTotal: number
    initialTotalPages: number
    currentPage: number
    currentStatus: string
    admin: dashAdmin
}
