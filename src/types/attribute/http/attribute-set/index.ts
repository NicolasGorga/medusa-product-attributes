import { Attribute } from "../attribute"

export type AttributeSet = {
    id: string
    name: string
    description?: string
    handle: string
    metadata: Record<string, unknown> | null
    attributes: Attribute[]
}