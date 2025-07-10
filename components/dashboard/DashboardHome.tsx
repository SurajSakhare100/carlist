"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, LogOut, Edit, Check, X, ChevronLeft, ChevronRight, Filter, Activity } from "lucide-react"
import Image from "next/image"
import AuditLogsDialog from "@/components/AuditLogsDialog"
import EditListingDialog from "@/components/EditListingDialog"
import { DashboardClientProps } from "@/types/dashboard.s"
import { Listing } from "@/types/car"



export default function DashboardHome({
    initialListings,
    initialTotal,
    initialTotalPages,
    currentPage,
    currentStatus,
}: DashboardClientProps) {
    const [listings, setListings] = useState<Listing[] | null>(initialListings)
    const [total, setTotal] = useState(initialTotal)
    const [totalPages, setTotalPages] = useState(initialTotalPages)
    const [page, setPage] = useState(currentPage)
    const [status, setStatus] = useState(currentStatus)
    const [loading, setLoading] = useState(false)
    const [editingListing, setEditingListing] = useState<Listing | null>(null)
    const [showAuditLogs, setShowAuditLogs] = useState(false)
    const [auditLogs, setAuditLogs] = useState<any[]>([])


   const fetchListings = async (page: number, status: string) => {}
   const fetchAuditLogs = async () => {}
   const handleStatusChange = async (listingId: number, newStatus: string) => {}
   const handleEditListing = async (data: Partial<Listing>) => {}

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return <Badge className="bg-green-100 text-green-800">Approved</Badge>
            case "rejected":
                return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 text-black">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Car className="h-8 w-8 text-blue-600 mr-3" />
                            <h1 className="text-xl font-semibold text-gray-900">Car Rental Admin Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setShowAuditLogs(true)
                                    fetchAuditLogs()
                                }}
                            >
                                <Activity className="h-4 w-4 mr-2" />
                                Audit Logs
                            </Button>
                            <span className="text-sm text-gray-600">Welcome, admin</span>
                            <Button variant="outline" size="sm" >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {(listings ?? []).filter((l) => l.status === "pending").length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {(listings ?? []).filter((l) => l.status === "approved").length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {(listings ?? []).filter((l) => l.status === "rejected").length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Filter className="h-5 w-5 mr-2" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="status-filter">Status:</Label>
                                <Select value={status} onValueChange={(value: string) => fetchListings(1, value)}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Car Rental Listings</CardTitle>
                        <CardDescription>Manage and review car rental listings submitted by users</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Car</TableHead>
                                            {/* <TableHead>Title</TableHead> */}
                                            <TableHead>Location</TableHead>
                                            <TableHead>Price/Day</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Submitted By</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(listings ?? []).map((listing) => (
                                            <TableRow key={listing.id}>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <Image
                                                            src={listing.image_url || "/placeholder.svg?height=40&width=60"}
                                                            alt={listing.title}
                                                            width={60}
                                                            height={40}
                                                            className="rounded object-cover"
                                                        />
                                                        <div>
                                                            <div className="font-medium">
                                                                {listing.car_year} {listing.car_make} {listing.car_model}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                {/* <TableCell>
                                                    <div className="max-w-xs">
                                                        <div className="font-medium truncate">{listing.title}</div>
                                                        <div className="text-sm text-gray-500 truncate">{listing.description}</div>
                                                    </div>
                                                </TableCell> */}
                                                <TableCell>{listing.location}</TableCell>
                                                <TableCell>${listing.price_per_day}</TableCell>
                                                <TableCell>{getStatusBadge(listing.status)}</TableCell>
                                                <TableCell>{listing.submitted_by}</TableCell>
                                                <TableCell>{formatDate(listing.created_at)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Button size="sm" variant="outline" onClick={() => setEditingListing(listing)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        {listing.status !== "approved" && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-green-600 hover:text-green-700 bg-transparent"
                                                                onClick={() => handleStatusChange(listing.id, "approved")}
                                                            >
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        {listing.status !== "rejected" && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-red-600 hover:text-red-700 bg-transparent"
                                                                onClick={() => handleStatusChange(listing.id, "rejected")}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                        )}
                    </CardContent>
                </Card>
                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-700">
                        Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} results
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => fetchListings(page - 1)} disabled={page <= 1}>
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <span className="text-sm">
                            Page {page} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchListings(page + 1)}
                            disabled={page >= totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <EditListingDialog listing={editingListing} onClose={() => setEditingListing(null)} onSave={handleEditListing} />

            <AuditLogsDialog open={showAuditLogs} onClose={() => setShowAuditLogs(false)} logs={auditLogs} />
        </div>
    )
}




