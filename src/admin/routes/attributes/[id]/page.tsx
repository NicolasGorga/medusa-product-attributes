import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Container,
  Heading,
  Text,
  toast,
  DropdownMenu,
  Button,
  Badge,
} from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { medusaClient } from "../../../lib/config";
import { Attribute } from "../../../../types/attribute/http/attribute";
import { EllipsisHorizontal } from "@medusajs/icons";
import { SectionRow } from "../../../components/section-row";
import { PossibleValuesTable } from "../components/possible-values-table";
import { SingleColumnLayout } from "../../../layouts/single-column";

const AttributeDetailPage = () => {
  const { id } = useParams();

  const { data: attribute, isLoading } = useQuery<Attribute>({
    queryKey: ["attribute", id],
    queryFn: async () => {
      const response = await medusaClient.client.fetch<{
        attribute: Attribute;
      }>(`/admin/plugin/attributes/${id}`);
      return response.attribute;
    },
  });

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-[200px]">
          <Text>Loading...</Text>
        </div>
      </Container>
    );
  }

  if (!attribute) {
    return (
      <Container>
        <div className="flex items-center justify-center h-[200px]">
          <Text>Attribute not found</Text>
        </div>
      </Container>
    );
  }

  return (
    <SingleColumnLayout>
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading level="h2">{attribute.name}</Heading>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="transparent" size="small">
                  <EllipsisHorizontal />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Item
                  onClick={() => toast.success("Edit clicked!")}
                >
                  Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => toast.error("Delete clicked!")}
                >
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </div>
        </div>

        <SectionRow title="Description" value={attribute.description} />
        <SectionRow title="Handle" value={attribute.handle} />
        <SectionRow
          title="Global"
          value={!attribute.product_categories?.length ? "True" : "False"}
        />

        {attribute.product_categories &&
          attribute.product_categories.length > 0 && (
            <SectionRow
              title="Product Categories"
              value={
                <>
                  {attribute.product_categories.map((category) => (
                    <Badge size="xsmall" key={category.id}>
                      {category.name}
                    </Badge>
                  ))}
                </>
              }
            />
          )}
      </Container>

      <PossibleValuesTable attribute={attribute} isLoading={isLoading} />
    </SingleColumnLayout>
  );
};

export const config = defineRouteConfig({
  label: "Attribute Details",
});

export default AttributeDetailPage;
