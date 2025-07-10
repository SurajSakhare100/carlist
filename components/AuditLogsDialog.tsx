import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AuditLog } from "@/types/audit"
import { Activity } from "lucide-react"

interface AuditLogsDialogProps {
  open: boolean
  onClose: () => void
  logs: AuditLog[]
}

export default function AuditLogsDialog({
  open,
  onClose,
  logs,
}: AuditLogsDialogProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "-"
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-white overflow-y-auto shadow-black border border-black">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" />
            <span>Audit Logs</span>
          </DialogTitle>
          <DialogDescription>
            Track all admin actions performed on listings.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-96">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Listing</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs && logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{formatDate(log.created_at)}</TableCell>
                    <TableCell>{log.admin_email}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {log.listing_title || `Listing #${log.listing_id}`}
                      </div>
                    </TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{log.notes || "-"}</div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}