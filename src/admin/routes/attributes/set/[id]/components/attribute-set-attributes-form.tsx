import { useMemo, useState } from "react";
import { Attribute, AttributeSet } from "../../../../../../types/attribute";
import {
  Button,
  createDataTableColumnHelper,
  DataTable,
  DataTableRowSelectionState,
  FocusModal,
  toast,
  useDataTable,
} from "@medusajs/ui";
import { useAttributeTableColumns } from "../../../../../hooks/table/columns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAttributes } from "../../../../../hooks/api/attributes";
import { useNavigate } from "react-router-dom";
import { useBatchAttributesToSets } from "../../../../../hooks/api/attribute-set";

type Props = {
  attributeSetId: string;
  attributes: Attribute[];
};

const FormSchema = z.object({
  attribute_ids: z.array(z.string()),
});
type FormValues = z.infer<typeof FormSchema>;

export const AttributeSetAttributesForm = ({
  attributeSetId,
  attributes = [],
}: Props) => {
  const [selection, setSelection] = useState<DataTableRowSelectionState>(
    attributes.reduce((acc, attr) => {
      acc[attr.id] = true;
      return acc;
    }, {} as DataTableRowSelectionState)
  );
  console.log('selection -> ', selection)
  const navigate = useNavigate();

  const columns = useColumns();
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      attribute_ids: [],
    },
  });

  const { mutateAsync, isPending } = useBatchAttributesToSets(attributeSetId);

  const handleSelectionChange = (selection: DataTableRowSelectionState) => {
    form.setValue("attribute_ids", Object.keys(selection), {
      shouldDirty: true,
      shouldTouch: true,
    });

    setSelection(selection);
  };

  const handleSubmit = form.handleSubmit(async (data: FormValues) => {
    await mutateAsync(
      {
        add: data.attribute_ids,
      },
      {
        onSuccess: () => {
          toast.success("Linked attributes to set");
          navigate(-1);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  });

  const handleClose = () => {
    navigate(-1);
  };

  const { attributes: data, count, isLoading } = useAttributes();

  const table = useDataTable({
    data: data || [],
    columns,
    getRowId: (attribute) => attribute.id,
    rowCount: count,
    isLoading,
    rowSelection: {
      state: selection,
      onRowSelectionChange: handleSelectionChange,
    },
  });

  return (
    <FocusModal
      open={true}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <FocusModal.Content>
        <FocusModal.Header>
          <div>
            <Button
              className="mr-2"
              type="button"
              size="small"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="attribute-set-attributes-form"
              variant="secondary"
              disabled={isPending}
            >
              Save
            </Button>
          </div>
        </FocusModal.Header>
        <FocusModal.Body>
          <form id='attribute-set-attributes-form' onSubmit={handleSubmit}>
            <DataTable instance={table}>
              <DataTable.Table />
            </DataTable>
          </form>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

const columnHelper = createDataTableColumnHelper<Attribute>();

const useColumns = () => {
  const base = useAttributeTableColumns();

  return useMemo(() => [columnHelper.select(), ...base], [base]);
};
