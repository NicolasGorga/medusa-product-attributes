import { defineRouteConfig } from "@medusajs/admin-sdk";
import { AttributeSet } from "../../../../../../types/attribute";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAttributeSet,
  useUpdateAttributeSet,
} from "../../../../../hooks/api/attribute-set";
import { AdminUpdateAttributeSet } from "../../../../../../api/admin/plugin/attribute-set/validators";
import { z } from "zod";
import { Button, Drawer, Input, Label, Textarea, toast } from "@medusajs/ui";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

type Props = {
  attributeSet: AttributeSet;
};

const FormSchema = AdminUpdateAttributeSet;
type FormValues = z.infer<typeof FormSchema>;

const AttributeSetEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { attributeSet, isLoading } = useAttributeSet(
    id!,
    {
      fields: "name, handle, description",
    },
    { enabled: !!id }
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: attributeSet?.name ?? "",
      description: attributeSet?.description ?? "",
      handle: attributeSet?.handle ?? "",
    },
  });

  useEffect(() => {
    if (attributeSet) {
        form.reset({
            name: attributeSet?.name ?? "",
            description: attributeSet?.description ?? "",
            handle: attributeSet?.handle ?? "",
        })
    }
  }, [attributeSet, form])

  const { mutateAsync, isPending } = useUpdateAttributeSet(attributeSet?.id ?? "");

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(data, {
      onSuccess: () => {
        toast.success("Attribute set edited");
        navigate(-1);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  });

  const handleClose = () => {
    navigate(-1);
  };

  if (!attributeSet) {
    return <p>Not found...</p>;
  }

  return (
    <Drawer
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <Drawer.Content>
        <Drawer.Header>Edit Attribute Set</Drawer.Header>
        <Drawer.Body>
          <form id='attribute-set-edit-form' onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input aria-invalid={!!form.formState.errors.name} size="small" {...form.register("name")} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="handle">Handle</Label>
                  <Input size="small" {...form.register("handle")} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea {...form.register("description")} />
              </div>
            </div>
          </form>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close onClick={handleClose} asChild>
            <Button disabled={isPending} variant="secondary">Cancel</Button>
          </Drawer.Close>
          <Button disabled={isPending} type="submit" form="attribute-set-edit-form" >Save</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};

export const config = defineRouteConfig({});

export default AttributeSetEditPage;
