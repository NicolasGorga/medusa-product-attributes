import { defineRouteConfig } from "@medusajs/admin-sdk"
import { FocusModal, Heading, Text, Button, Input, toast, Label, Switch, Select, Textarea } from "@medusajs/ui"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { medusaClient } from "../../../lib/config"
import { AttributeUIComponent } from "../../../../modules/attribute/types"
import { CreateAttribute } from "../../../../api/admin/plugin/attributes/validators"

type FormValues = z.infer<typeof CreateAttribute> & { is_global: boolean }

const CreateAttributePage = () => {
  const navigate = useNavigate()

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateAttribute.merge(z.object({ is_gloabl: z.boolean() }))),
    defaultValues: {
      name: "",
      description: "",
      ui_component: AttributeUIComponent.SELECT,
      is_variant_defining: true,
      is_filterable: true,
      is_global: true,
      possible_values: [],
      product_category_ids: [],
    },
  })

  const handleSave = form.handleSubmit(async (data) => {
    try {
      await medusaClient.client.fetch("/admin/plugin/attributes", {
        method: "POST",
        body: data,
      })
      
      toast.success("Attribute created!")
      navigate(-1)
    } catch (error) {
      toast.error("Failed to create attribute")
      console.error(error)
    }
  })

  const handleClose = () => {
    navigate(-1)
  }

  return (
    <FocusModal open={true} onOpenChange={(open) => { if (!open) handleClose() }}>
      <FocusModal.Content>
        <FocusModal.Header>
          <Heading>Create Attribute</Heading>
        </FocusModal.Header>
        <FocusModal.Body className="flex flex-col items-center py-16">
          <div>
            <form id="create-attribute-form" onSubmit={handleSave}>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <Text className="text-red-500 text-sm mt-1">
                        {form.formState.errors.name.message}
                      </Text>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="handle">Handle</Label>
                    <Input
                      id="handle"
                      {...form.register("handle")}
                    />
                    {form.formState.errors.handle && (
                      <Text className="text-red-500 text-sm mt-1">
                        {form.formState.errors.handle.message}
                      </Text>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="ui_component">UI Component</Label>
                    <Select
                      value={form.watch("ui_component")}
                      onValueChange={(value) => form.setValue("ui_component", value as AttributeUIComponent)}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Select UI Component" />
                      </Select.Trigger>
                      <Select.Content>
                        {Object.values(AttributeUIComponent).map((component) => (
                          <Select.Item key={component} value={component}>
                            {component}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                    {form.formState.errors.ui_component && (
                      <Text className="text-red-500 text-sm mt-1">
                        {form.formState.errors.ui_component.message}
                      </Text>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                  />
                  {form.formState.errors.description && (
                    <Text className="text-red-500 text-sm mt-1">
                      {form.formState.errors.description.message}
                    </Text>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_variant_defining"
                      checked={form.watch("is_variant_defining")}
                      onCheckedChange={(checked) => form.setValue("is_variant_defining", checked)}
                    />
                    <Label htmlFor="is_variant_defining">Variant Defining</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_filterable"
                      checked={form.watch("is_filterable")}
                      onCheckedChange={(checked) => form.setValue("is_filterable", checked)}
                    />
                    <Label htmlFor="is_filterable">Filterable</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is_global"
                      checked={form.watch("is_global")}
                      onCheckedChange={(checked) => form.setValue("is_global", checked)}
                    />
                    <Label htmlFor="is_global">Global</Label>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </FocusModal.Body>
        <FocusModal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="create-attribute-form">Create</Button>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  )
}

export const config = defineRouteConfig({})

export default CreateAttributePage 