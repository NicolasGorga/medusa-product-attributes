import {
  createDataTableColumnHelper,
  Badge,
  DataTablePaginationState,
  useDataTable,
  Container,
  Heading,
  Button,
  DataTable,
} from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AttributeSet } from "../../../../types/attribute/http/attribute-set";
import { medusaClient } from "../../../lib/config";
import { PaginatedResponse } from "@medusajs/types";

export const AttributeSetTable = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<
    PaginatedResponse<{ attributeSets: AttributeSet[] }>
  >({
    queryKey: ["attribute-set", page],
    queryFn: async () => {
      const response = await medusaClient.client.fetch<
        PaginatedResponse<{ attributeSets: AttributeSet[] }>
      >("/admin/plugin/attributes", {
        query: {
          limit: pageSize,
          offset: (page - 1) * pageSize,
        },
      });
      return response;
    },
  });

  const columnHelper = createDataTableColumnHelper<AttributeSet>();

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("description", {
      header: "Description",
    }),
    columnHelper.accessor("handle", {
      header: "Handle",
    }),
    columnHelper.accessor("attributes", {
      header: "Attributes",
      cell: (info) => {
        const attributes = info.getValue();
        return (
          <div className="flex flex-wrap gap-2">
            {attributes?.map((attribute) => (
              <Badge size="xsmall" key={attribute.id}>
                {attribute.name}
              </Badge>
            )) || "-"}
          </div>
        );
      },
    }),
  ];

  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageIndex: page - 1,
    pageSize,
  });

  const [search, setSearch] = useState("");

  const table = useDataTable({
    columns,
    data: data?.attributeSets || [],
    getRowId: (attributeSet: AttributeSet) => attributeSet.id,
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: (newPagination) => {
        setPagination(newPagination);
        setPage(newPagination.pageIndex + 1);
      },
    },
    search: {
      state: search,
      onSearchChange: setSearch,
    },
    onRowClick: (_event, row: AttributeSet) => {
      navigate(`/attribute-sets/${row.id}`);
    },
  });

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Attribute Sets</Heading>
        <Button
          variant="secondary"
          size="small"
          onClick={() => navigate("/attribute-sets/create")}
        >
          Create
        </Button>
      </div>

      <div>
        <DataTable instance={table}>
          <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
            <DataTable.Search placeholder="Search attribute sets..." />
          </DataTable.Toolbar>
          <DataTable.Table />
          <DataTable.Pagination />
        </DataTable>
      </div>
    </Container>
  );
};
