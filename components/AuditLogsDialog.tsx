import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity } from "lucide-react"
export default  function AuditLogsDialog({
  open,
  onClose,
  logs,
}: {
  open: boolean
  onClose: () => void
  logs: any[]
}) {
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Audit Logs
          </DialogTitle>
          <DialogDescription>Track all admin actions performed on listings</DialogDescription>
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
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatDate(log.created_at)}</TableCell>
                  <TableCell>{log.admin_email}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{log.listing_title || `Listing #${log.listing_id}`}</div>
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{log.notes || "-"}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}