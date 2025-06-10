import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Badge, Button, DataTable, createDataTableColumnHelper, useDataTable, DataTablePaginationState } from "@medusajs/ui"
import { ListBullet } from "@medusajs/icons"
import { useQuery } from "@tanstack/react-query"
import { medusaClient } from "../../lib/config"
import { Attribute, AttributesResponse } from "../../../types/attribute/http/attribute"
import { useState } from "react"

const AttributesPage = () => {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data, isLoading } = useQuery<AttributesResponse>({
    queryKey: ["attributes", page],
    queryFn: async () => {
      const response = await medusaClient.client.fetch<AttributesResponse>("/admin/plugin/attributes", {
        query: {
          limit: pageSize,
          offset: (page - 1) * pageSize
        }
      })
      return response
    },
  })

  const columnHelper = createDataTableColumnHelper<Attribute>()

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("handle", {
      header: "Handle",
    }),
    columnHelper.accessor("product_categories", {
      header: "Global",
      cell: (info) => {
        const isGlobal = !info.getValue()?.length
        return (
          <Badge size="xsmall" color={isGlobal ? "green" : "grey"}>
            {isGlobal ? "Yes" : "No"}
          </Badge>
        )
      },
    }),
    columnHelper.accessor("possible_values", {
      header: "Possible Values",
      cell: (info) => {
        const values = info.getValue()
        return (
          <div className="flex flex-wrap gap-2">
            {values?.map((value) => (
              <Badge size="xsmall" key={value.id}>
                {value.value}
              </Badge>
            )) || "-"}
          </div>
        )
      },
    }),
  ]

  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageIndex: page - 1,
    pageSize,
  })

  const [search, setSearch] = useState("")

  const table = useDataTable({
    columns,
    data: data?.attributes || [],
    getRowId: (attribute: Attribute) => attribute.id,
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: (newPagination) => {
        setPagination(newPagination)
        setPage(newPagination.pageIndex + 1)
      },
    },
    search: {
      state: search,
      onSearchChange: setSearch,
    },
  })

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Product Attributes</Heading>
        <Button variant="secondary" size="small">
          Create
        </Button>
      </div>

      <div>
        <DataTable instance={table}>
          <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
            <DataTable.Search placeholder="Search attributes..." />
          </DataTable.Toolbar>
          <DataTable.Table />
          <DataTable.Pagination />
        </DataTable>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Attributes",
  icon: ListBullet,
})

export default AttributesPage 