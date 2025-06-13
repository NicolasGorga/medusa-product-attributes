import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons";
import { Container, Heading, DropdownMenu, IconButton } from "@medusajs/ui";
import { AttributeSet } from "../../../../../../types/attribute";
import { SectionRow } from "../../../../../components/section-row";

type Props = {
  attributeSet: AttributeSet;
};

export const AttributeSetGeneralSection = ({ attributeSet }: Props) => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h1">{attributeSet.name}</Heading>
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <IconButton variant="transparent">
              <EllipsisHorizontal />
            </IconButton>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content>
            <DropdownMenu.Item>
              <PencilSquare />
              Edit
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Trash />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
      <SectionRow title="Name" value={attributeSet.name} />
      <SectionRow title="Handle" value={attributeSet.handle} />
      <SectionRow title="Description" value={attributeSet.description} />
    </Container>
  );
};
