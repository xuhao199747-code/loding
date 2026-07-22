import type { ReactNode } from "react"
import { EmptyState } from "@/components/common/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

type DataTableProps = {
  children: ReactNode
  empty?: boolean
  emptyTitle?: string
  isLoading?: boolean
}

export function DataTable({ children, empty = false, emptyTitle = "No data yet", isLoading = false }: DataTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (empty) {
    return <EmptyState title={emptyTitle} />
  }

  return <div className="overflow-hidden rounded-lg border border-border bg-card">{children}</div>
}
