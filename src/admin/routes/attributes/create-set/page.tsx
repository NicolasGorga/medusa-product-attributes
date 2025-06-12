import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  FocusModal,
  Heading,
  Button,
  toast,
  Text,
  Label,
  Input,
  Textarea,
} from "@medusajs/ui";
import { useNavigate } from "react-router-dom";
import { medusaClient } from "../../../lib/config";
import { z } from "zod";
import { AdminCreateAttributeSet } from "../../../../api/admin/plugin/attribute-set/validators";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type CreateAttributeSetFormValues = z.infer<typeof AdminCreateAttributeSet>;

const CreateAttributeSetPage = () => {
  const navigate = useNavigate();
  const form = useForm<CreateAttributeSetFormValues>({
    resolver: zodResolver(AdminCreateAttributeSet),
    defaultValues: {
      name: "",
      handle: "",
      description: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
        await medusaClient.client.fetch('/admin/plugin/attribute-set', {
            method: 'POST',
            body: data
        })
        toast.success('Attribute set created!')
        navigate(-1)
    } catch (error) {
        toast.error((error as Error).message);
        console.error(error);
    }
  });
  
  const handleClose = () => {
    navigate(-1);
  };

  return (
    <FocusModal
      open={true}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <FocusModal.Content>
        <FocusModal.Header>
          <Heading>Create Attribute Set</Heading>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col items-center py-16">
          <div className="flex w-full max-w-lg flex-col gap-y-8">
            <div className="flex flex-col gap-y-1">
              <Heading>Create attribute set</Heading>
              <Text className="text-ui-fg-subtle">
                Create attribute sets to group together related attributes.
              </Text>
            </div>
            <form id="attribute-set-form" onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label size="xsmall" htmlFor="name">
                      Name
                    </Label>
                    <Input aria-invalid={!!form.formState.errors.name} {...form.register("name")} />
                  </div>
                  <div>
                    <Label size="xsmall" htmlFor="handle">
                      Handle
                    </Label>
                    <Input {...form.register("handle")} />
                  </div>
                </div>
                <div>
                  <Label size="xsmall" htmlFor="description">
                    Description
                  </Label>
                  <Textarea {...form.register("description")} />
                </div>
              </div>
            </form>
          </div>
        </FocusModal.Body>
        <FocusModal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form="attribute-set-form">
            Create
          </Button>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  );
};

export const config = defineRouteConfig({});

export default CreateAttributeSetPage;
