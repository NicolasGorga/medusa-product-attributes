import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Drawer, Heading, Text, Button, Input, toast, Label, DropdownMenu } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { useParams, useSearchParams, useNavigate } from "react-router-dom"
import { medusaClient } from "../../../../lib/config"
import { Attribute } from "../../../../../types/attribute/http/attribute"
import { useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { EllipsisHorizontal, Trash } from "@medusajs/icons"

const formSchema = z.object({
  value: z.string().min(1, "Value is required"),
  rank: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, "Rank must be non-negative").optional()
  ),
  metadata: z.array(z.object({
    key: z.string().min(1, "Key is required"),
    value: z.string().min(1, "Value is required"),
  })).default([]),
})

type FormValues = z.infer<typeof formSchema>

const EditPossibleValuePage = () => {
  const { id: attributeId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const possibleValueId = searchParams.get("possible_value_id")

  const { data: attribute, isLoading: isAttributeLoading } = useQuery<Attribute>({
    queryKey: ["attribute", attributeId],
    queryFn: async () => {
      const response = await medusaClient.client.fetch<{ attribute: Attribute }>(`/admin/plugin/attributes/${attributeId}`)
      return response.attribute
    },
    enabled: !!attributeId,
  })

  const possibleValue = attribute?.possible_values?.find((pv: { id: string }) => pv.id === possibleValueId)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
      rank: undefined,
      metadata: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "metadata",
  })

  useEffect(() => {
    if (possibleValue) {
        console.log('setting metadata ', )
      const metadataArray = Object.entries(possibleValue.metadata || {}).map(([key, value]) => ({ key, value: String(value) }))
      form.reset({
        value: possibleValue.value,
        rank: possibleValue.rank,
        metadata: metadataArray.length > 0 ? metadataArray : [{ key: "", value: "" }],
      })
    }
  }, [possibleValue, form])

  const handleSave = form.handleSubmit((data) => {
    const transformedMetadata = data.metadata.reduce((acc, item) => {
      // Only include valid key-value pairs
      if (item.key.trim() !== "") {
        acc[item.key] = item.value
      }
      return acc
    }, {} as Record<string, unknown>)

    console.log({ ...data, metadata: transformedMetadata })
    toast.success("Possible value updated!")
    navigate(-1)
  })

  const handleClose = () => {
    navigate(-1)
  }

  return (
    <Drawer open={true} onOpenChange={(open) => { if (!open) handleClose() }}>
      <Drawer.Trigger asChild>
        {/* This button serves as a trigger for the drawer when it's rendered as a standalone page */}
        <Button variant="secondary">Open Edit Drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        {isAttributeLoading ? (
          <>
            <Drawer.Header>
              <Heading>Loading...</Heading>
            </Drawer.Header>
            <Drawer.Body>
              <Text>Fetching possible value details...</Text>
            </Drawer.Body>
          </>
        ) : !possibleValue ? (
          <>
            <Drawer.Header>
              <Heading>Possible Value Not Found</Heading>
            </Drawer.Header>
            <Drawer.Body>
              <Text>The requested possible value could not be found.</Text>
              <Button onClick={handleClose}>Close</Button>
            </Drawer.Body>
          </>
        ) : (
          <>
            <Drawer.Header>
              <Drawer.Title>Edit Possible Value</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <form id="edit-possible-value-form" onSubmit={handleSave}>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      {...form.register("value")}
                    />
                    {form.formState.errors.value && (
                      <Text className="text-red-500 text-sm mt-1">
                        {form.formState.errors.value.message}
                      </Text>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="rank">Rank</Label>
                    <Input
                      id="rank"
                      type="number"
                      {...form.register("rank", { valueAsNumber: true })}
                    />
                    {form.formState.errors.rank && (
                      <Text className="text-red-500 text-sm mt-1">
                        {form.formState.errors.rank.message}
                      </Text>
                    )}
                  </div>

                  <div className="col-span-2 mt-4">
                    <Heading level="h3" className="inter-small-semibold mb-2">Metadata</Heading>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="grid grid-cols-[1fr_1fr_40px] bg-ui-bg-subtle border-b py-2 px-3 text-ui-fg-subtle text-sm font-semibold">
                        <span className="border-r pr-2">Key</span>
                        <span>Value</span>
                        <span></span>
                      </div>
                      {fields.map((field: { id: string, key: string, value: string }, index: number) => (
                        <div key={field.id} className="grid grid-cols-[1fr_1fr_40px] items-center border-b last:border-b-0">
                          <div className="py-2 pl-3 pr-2 border-r">
                            <Input
                              placeholder="Key"
                              className="!shadow-none !border-none focus-visible:!outline-none bg-transparent"
                              {...form.register(`metadata.${index}.key`)}
                            />
                            {form.formState.errors.metadata?.[index]?.key && (
                              <Text className="text-red-500 text-sm mt-1">
                                {form.formState.errors.metadata[index].key.message}
                              </Text>
                            )}
                          </div>
                          <div className="py-2 pl-3 pr-2">
                            <Input
                              placeholder="Value"
                              className="!shadow-none !border-none focus-visible:!outline-none bg-transparent"
                              {...form.register(`metadata.${index}.value`)}
                            />
                            {form.formState.errors.metadata?.[index]?.value && (
                              <Text className="text-red-500 text-sm mt-1">
                                {form.formState.errors.metadata[index].value.message}
                              </Text>
                            )}
                          </div>
                          <div className="flex justify-end pr-3">
                            <DropdownMenu>
                              <DropdownMenu.Trigger asChild>
                                <Button variant="transparent" size="small">
                                  <EllipsisHorizontal />
                                </Button>
                              </DropdownMenu.Trigger>
                              <DropdownMenu.Content align="end">
                                <DropdownMenu.Item onClick={() => remove(index)} className="gap-x-2">
                                  <Trash className="text-ui-fg-subtle" />
                                  Remove
                                </DropdownMenu.Item>
                              </DropdownMenu.Content>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                      <div className="p-3">
                        <Button type="button" variant="secondary" size="small" onClick={() => append({ key: "", value: "" })} className="w-full">
                          + Add Row
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="secondary" onClick={handleClose}>Cancel</Button>
              <Button type="submit" form="edit-possible-value-form">Save</Button>
            </Drawer.Footer>
          </>
        )}
      </Drawer.Content>
    </Drawer>
  )
}

export const config = defineRouteConfig({
  // This page is expected to be mounted as a modal route, so no modal: true needed here
})

export default EditPossibleValuePage 