import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Drawer, Heading, Text, Button, Input, toast, Label } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { useParams, useSearchParams, useNavigate } from "react-router-dom"
import { medusaClient } from "../../../../lib/config"
import { Attribute } from "../../../../types/attribute/http/attribute"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const formSchema = z.object({
  value: z.string().min(1, "Value is required"),
  rank: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, "Rank must be non-negative").optional()
  ),
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
    },
  })

  useEffect(() => {
    if (possibleValue) {
      form.reset({
        value: possibleValue.value,
        rank: possibleValue.rank,
      })
    }
  }, [possibleValue, form])

  const handleSave = form.handleSubmit((data) => {
    // TODO: Implement update logic here using data.value and data.rank
    console.log(data)
    toast.success("Possible value updated!")
    navigate(-1) // Go back to the previous page (attribute details)
  })

  const handleClose = () => {
    navigate(-1) // Go back to the previous page (attribute details)
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