import type { Meta, StoryObj } from "@storybook/react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./data-table"

// --- Sample data types and data ---

type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

const payments: Payment[] = [
  { id: "728ed52f", amount: 100, status: "pending", email: "m@example.com" },
  { id: "489e1d42", amount: 125, status: "processing", email: "example@gmail.com" },
  { id: "a1b2c3d4", amount: 250, status: "success", email: "john@example.com" },
  { id: "e5f6g7h8", amount: 75, status: "failed", email: "jane@example.com" },
  { id: "i9j0k1l2", amount: 300, status: "success", email: "bob@example.com" },
  { id: "m3n4o5p6", amount: 50, status: "pending", email: "alice@example.com" },
  { id: "q7r8s9t0", amount: 175, status: "processing", email: "dave@example.com" },
  { id: "u1v2w3x4", amount: 420, status: "success", email: "eve@example.com" },
  { id: "y5z6a7b8", amount: 90, status: "failed", email: "frank@example.com" },
  { id: "c9d0e1f2", amount: 200, status: "success", email: "grace@example.com" },
  { id: "g3h4i5j6", amount: 350, status: "pending", email: "heidi@example.com" },
  { id: "k7l8m9n0", amount: 150, status: "processing", email: "ivan@example.com" },
]

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const colors: Record<string, string> = {
        pending: "text-yellow-600",
        processing: "text-blue-600",
        success: "text-green-600",
        failed: "text-red-600",
      }
      return (
        <span className={`font-medium capitalize ${colors[status] ?? ""}`}>
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
]

// --- Story setup ---

const meta = {
  title: "UI/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DataTable>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    columns: columns as ColumnDef<unknown, unknown>[],
    data: payments,
  },
}

export const Empty: Story = {
  args: {
    columns: columns as ColumnDef<unknown, unknown>[],
    data: [],
  },
}

export const FewRows: Story = {
  args: {
    columns: columns as ColumnDef<unknown, unknown>[],
    data: payments.slice(0, 3),
  },
}
