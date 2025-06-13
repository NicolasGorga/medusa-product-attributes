import { useMemo, useState } from "react";
import { Attribute, AttributeSet } from "../../../../../../types/attribute";
import { useAttributes } from "../../../../../hooks/api/attributes";
import {
    Container,
  createDataTableColumnHelper,
  createDataTableCommandHelper,
  DataTable,
  DataTableRowSelectionState,
  DropdownMenu,
  Heading,
  IconButton,
  toast,
  useDataTable,
} from "@medusajs/ui";
import { useAttributeTableColumns } from "../../../../../hooks/table/columns";
import { EllipsisHorizontal, Plus } from "@medusajs/icons";
import { useNavigate } from 'react-router-dom' 
import { useBatchAttributesToSets } from "../../../../../hooks/api/attribute-set";

type Props = {
  attributeSet: AttributeSet;
};

export const AttributeSetAttributesSection = ({ attributeSet }: Props) => {
  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>(
    {}
  );
  const navigate = useNavigate()

  const { attributes, count, isLoading } = useAttributes({
    sets: {
      id: attributeSet.id,
    },
    fields: 'id, name, handle, product_categories.id, possible_values.value',
  });

  console.log('Received attrs in attribute set detail -> ', attributes)
  
  const { mutateAsync } = useBatchAttributesToSets(attributeSet.id)
  const columns = useColumns();
  const commands = useCommands((selection: DataTableRowSelectionState) => 
    mutateAsync({
      remove: Object.keys(selection)
    }, {
      onSuccess: () => {
        toast.success('Removed attributes from set')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  );

  const table = useDataTable({
    data: attributes || [],
    columns,
    getRowId: (product) => product.id,
    rowCount: count,
    isLoading,
    commands,
    rowSelection: {
      state: rowSelection,
      onRowSelectionChange: setRowSelection,
    },
  });

  return (
    <Container className="divide-y p-0">
        <DataTable instance={table}>
        <DataTable.Toolbar className="flex justify-between items-center">
            <Heading>Attributes</Heading>
            <DropdownMenu>
                <DropdownMenu.Trigger>
                    <IconButton variant="transparent">
                        <EllipsisHorizontal />
                    </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Item onClick={() => navigate(`/attributes/set/${attributeSet.id}/attributes`)}>
                        <Plus className="mr-2" />
                        Add
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.CommandBar selectedLabel={(count) => `${count} selected`} />
        </DataTable>
    </Container>
  );
};

const columnHelper = createDataTableColumnHelper<Attribute>();

const useColumns = () => {
  const base = useAttributeTableColumns();

  return useMemo(() => [columnHelper.select(), ...base], [base]);
};

const commandHelper = createDataTableCommandHelper();

const useCommands = (onDelete: (selection: DataTableRowSelectionState) => Promise<unknown>) => {
  return [
    commandHelper.command({
      label: "Eliminar",
      shortcut: "D",
      action: async (selection) => {
        await onDelete(selection)
      },
    }),
  ];
};
