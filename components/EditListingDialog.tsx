import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Listing } from "@/types/car"
import { useEffect, useState } from "react"

import { Label } from "@/components/ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

export default function EditListingDialog({
    listing,
    onClose,
    onSave,
}: {
    listing: Listing | null
    onClose: () => void
    onSave: (data: Partial<Listing>) => void
}) {
    const [formData, setFormData] = useState<Partial<Listing>>({})

    useEffect(() => {
        if (listing) {
            setFormData(listing)
        }
    }, [listing])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    if (!listing) return null

    return (
        <Dialog open={!!listing} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Listing</DialogTitle>
                    <DialogDescription>Make changes to the listing details below.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title || ""}
                                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price per Day</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={formData.price_per_day || ""}
                                onChange={(e) => setFormData((prev) => ({ ...prev, price_per_day: Number.parseFloat(e.target.value) }))}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description || ""}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={formData.location || ""}
                                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="car_year">Year</Label>
                            <Input
                                id="car_year"
                                type="number"
                                value={formData.car_year || ""}
                                onChange={(e) => setFormData((prev) => ({ ...prev, car_year: Number.parseInt(e.target.value) }))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="car_make">Make</Label>
                            <Input
                                id="car_make"
                                value={formData.car_make || ""}
                                onChange={(e) => setFormData((prev) => ({ ...prev, car_make: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="car_model">Model</Label>
                            <Input
                                id="car_model"
                                value={formData.car_model || ""}
                                onChange={(e) => setFormData((prev) => ({ ...prev, car_model: e.target.value }))}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}