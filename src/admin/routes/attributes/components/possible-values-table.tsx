import { Container, Heading, Text, DataTable, createDataTableColumnHelper, DataTablePaginationState, Badge } from "@medusajs/ui"
import { useState } from "react"
import { useDataTable } from "@medusajs/ui"
import { format } from "date-fns"
import { Attribute } from "../../../../types/attribute/http/attribute"

type PossibleValue = { id: string; value: string; rank: number; created_at: string }

type PossibleValuesTableProps = {
  attribute: Attribute
  isLoading: boolean
}

export const PossibleValuesTable = ({ attribute, isLoading }: PossibleValuesTableProps) => {
  const [possibleValuesPage, setPossibleValuesPage] = useState(1)
  const possibleValuesPageSize = 10
  const [possibleValuesPagination, setPossibleValuesPagination] = useState<DataTablePaginationState>({
    pageIndex: possibleValuesPage - 1,
    pageSize: possibleValuesPageSize,
  })
  const [possibleValuesSearch, setPossibleValuesSearch] = useState("")

  const possibleValuesColumnHelper = createDataTableColumnHelper<PossibleValue>()

  const possibleValuesColumns = [
    possibleValuesColumnHelper.accessor("value", {
      header: "Value",
      cell: (info) => info.getValue(),
    }),
    possibleValuesColumnHelper.accessor("rank", {
      header: "Rank",
      cell: (info) => info.getValue(),
    }),
    possibleValuesColumnHelper.accessor("created_at", {
      header: "Created At",
      cell: (info) => format(new Date(info.getValue()), "MMM dd, yyyy p"),
    }),
  ]

  const possibleValuesTable = useDataTable({
    columns: possibleValuesColumns,
    data: attribute?.possible_values?.filter((value) =>
      value.value.toLowerCase().includes(possibleValuesSearch.toLowerCase())
    ).slice(
      possibleValuesPagination.pageIndex * possibleValuesPagination.pageSize,
      (possibleValuesPagination.pageIndex + 1) * possibleValuesPagination.pageSize
    ) || [],
    getRowId: (value) => value.id,
    rowCount: attribute?.possible_values?.length || 0,
    pagination: {
      state: possibleValuesPagination,
      onPaginationChange: (newPagination) => {
        setPossibleValuesPagination(newPagination)
        setPossibleValuesPage(newPagination.pageIndex + 1)
      },
    },
    search: {
      state: possibleValuesSearch,
      onSearchChange: setPossibleValuesSearch,
    },
  })

  if (!attribute.possible_values || attribute.possible_values.length === 0) {
    return null
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Possible Values</Heading>
      </div>
      <div>
        <DataTable instance={possibleValuesTable}>
          <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
            <DataTable.Search placeholder="Search possible values..." />
          </DataTable.Toolbar>
          <DataTable.Table />
          <DataTable.Pagination />
        </DataTable>
      </div>
    </Container>
  )
} 