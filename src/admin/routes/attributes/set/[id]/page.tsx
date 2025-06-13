import { useAttributeSet } from "../../../../hooks/api/attribute-set";
import { useParams } from "react-router-dom";
import {
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  Text,
} from "@medusajs/ui";
import { SingleColumnLayout } from "../../../../layouts/single-column";
import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons";
import { SectionRow } from "../../../../components/section-row";
import { AttributeSetGeneralSection, AttributeSetAttributesSection } from "./components";

export default function AttributeSetDetail() {
  const { id } = useParams();
  const { attributeSet, isLoading } = useAttributeSet(id || "");

  if (!id) {
    return <div>Invalid attribute set ID</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!attributeSet) {
    return <div>Attribute set not found</div>;
  }

  return (
    <SingleColumnLayout>
      <AttributeSetGeneralSection attributeSet={attributeSet} />

      <AttributeSetAttributesSection attributeSet={attributeSet} />

      {/* Metadata Section */}
      <Container>
        <div className="flex flex-col gap-y-4 p-4">
          <Heading level="h2">Metadata</Heading>
        </div>
      </Container>
    </SingleColumnLayout>
  );
}
