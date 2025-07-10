"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <Card className="w-full max-w-md shadow-xl border-2 border-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">CarList Admin Dashboard</CardTitle>
          <CardDescription className="text-center mt-2">
            <span className="font-semibold text-gray-700">Note:</span> This project is intended for <span className="font-bold text-primary">local use only</span>.<br/>
            It uses <span className="font-bold text-primary">SQLite</span> for all data storage and is not designed for production or cloud deployment.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button asChild className="w-full mt-2">
            <Link href="https://github.com/SurajSakhare100/carlist" target="_blank">
              View on GitHub
            </Link>
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            For setup instructions, see the README in the repository.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
