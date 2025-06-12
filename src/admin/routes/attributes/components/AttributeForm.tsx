import {
  Heading,
  Text,
  Button,
  Input,
  Label,
  Switch,
  Select,
  Textarea,
} from "@medusajs/ui";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AttributeUIComponent } from "../../../../modules/attribute/types";
import { CreateAttribute } from "../../../../api/admin/plugin/attributes/validators";
import { AdminProductCategory } from "@medusajs/types";
import MultiSelectCategory from "../create/components/MultiSelectCategory";
import PossibleValuesList from "../create/components/PossibleValuesList";
import { Attribute } from "../../../../types/attribute/http/attribute";

export const AttributeFormSchema = CreateAttribute.extend({
  is_global: z.boolean(),
});

type FormValues = z.infer<typeof AttributeFormSchema>;

interface AttributeFormProps {
  initialData?: Attribute;
  onSubmit: (data: FormValues) => Promise<void>;
  categories?: AdminProductCategory[]
}

export const AttributeForm = ({
  initialData,
  onSubmit,
  categories = [],
}: AttributeFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(AttributeFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      handle: initialData?.handle || "",
      ui_component: initialData?.ui_component || AttributeUIComponent.SELECT,
      is_variant_defining: initialData?.is_variant_defining ?? true,
      is_filterable: initialData?.is_filterable ?? true,
      is_global: !initialData?.product_categories?.length,
      possible_values: initialData?.possible_values || [],
      product_category_ids: initialData?.product_categories?.map(c => c.id) || [],
      metadata: initialData?.metadata || null,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider {...form}>
      <form id="attribute-form" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label size="small" htmlFor="name">Name</Label>
              <Input size="small" id="name" className="mt-1" {...form.register("name")} />
              {form.formState.errors.name && (
                <Text className="text-red-500 text-sm mt-1">
                  {form.formState.errors.name.message}
                </Text>
              )}
            </div>
            <div>
              <Label size="small" htmlFor="handle">Handle</Label>
              <Input size="small" id="handle" className="mt-1" {...form.register("handle")} />
              {form.formState.errors.handle && (
                <Text className="text-red-500 text-sm mt-1">
                  {form.formState.errors.handle.message}
                </Text>
              )}
            </div>
          </div>

          <div>
            <Label size="small" htmlFor="description">Description</Label>
            <Textarea className="mt-1"
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
                onCheckedChange={(checked) =>
                  form.setValue("is_variant_defining", checked)
                }
              />
              <Label size="small" htmlFor="is_variant_defining">
                Variant Defining
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_filterable"
                checked={form.watch("is_filterable")}
                onCheckedChange={(checked) =>
                  form.setValue("is_filterable", checked)
                }
              />
              <Label size="small" htmlFor="is_filterable">Filterable</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_global"
                checked={form.watch("is_global")}
                onCheckedChange={(checked) =>
                  form.setValue("is_global", checked)
                }
              />
              <Label size="small" htmlFor="is_global">Global</Label>
            </div>
          </div>

          {!form.watch("is_global") && (
            <div>
              <Label size="small" htmlFor="product_categories">
                Product Categories
              </Label>
              <MultiSelectCategory
                categories={categories} // This will be passed from the parent
                value={form.watch("product_category_ids") || []}
                onChange={(value) =>
                  form.setValue("product_category_ids", value)
                }
              />
              {form.formState.errors.product_category_ids && (
                <Text className="text-red-500 text-sm mt-1">
                  {form.formState.errors.product_category_ids.message}
                </Text>
              )}
            </div>
          )}

          <div>
            <Label size="small" htmlFor="ui_component">UI Component</Label>
            <Select
              value={form.watch("ui_component")}
              onValueChange={(value) =>
                form.setValue(
                  "ui_component",
                  value as AttributeUIComponent
                )
              }
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

          {form.watch("ui_component") === AttributeUIComponent.SELECT && (
            <div className="mt-4">
              <PossibleValuesList />
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
}; 