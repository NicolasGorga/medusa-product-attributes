import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons";
import { Container, Heading, DropdownMenu, IconButton } from "@medusajs/ui";
import { AttributeSet } from "../../../../../../types/attribute";
import { SectionRow } from "../../../../../components/section-row";
import { useNavigate } from "react-router-dom" 

type Props = {
  attributeSet: AttributeSet;
};

export const AttributeSetGeneralSection = ({ attributeSet }: Props) => {
  const navigate = useNavigate()

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
            <DropdownMenu.Item onClick={() => navigate(`/attributes/set/${attributeSet.id}/edit`)}>
              <PencilSquare className="mr-2" />
              Edit
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Trash className="mr-2" />
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
