import { Text, Badge } from "@medusajs/ui"
import { AdminProductCategory } from "@medusajs/types"
import React, { useState, useRef, useEffect } from "react"
import { TrianglesMini, XMarkMini } from "@medusajs/icons"

type MultiSelectCategoryProps = {
  categories: AdminProductCategory[]
  value: string[]
  onChange: (value: string[]) => void
  getCategoryPath: (category: AdminProductCategory) => string
}

const MultiSelectCategory: React.FC<MultiSelectCategoryProps> = ({
  categories,
  value,
  onChange,
  getCategoryPath,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  const handleItemClick = (categoryId: string) => {
    const isSelected = value.includes(categoryId)
    if (isSelected) {
      onChange(value.filter((id) => id !== categoryId))
    } else {
      onChange([...value, categoryId])
    }
  }

  return (
    <div className="relative">
      <div
        ref={triggerRef}
        className="relative flex h-10 w-full cursor-pointer items-center justify-between overflow-hidden rounded-md border border-ui-border-base bg-ui-bg-field text-ui-fg-base shadow-sm transition-colors duration-150 ease-in-out hover:bg-ui-bg-field-hover focus-within:border-ui-border-interactive focus-within:ring-1 focus-within:ring-ui-ring-interactive"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2 px-3 py-2">
          {value.length > 0 ? (
            <>
              <button type="button" onClick={() => onChange([])}>
                <Badge size="small" className="w-fit">
                  {value.length}
                  <XMarkMini></XMarkMini>
                </Badge>
              </button>
              <Text>Selected</Text>
            </>
          ) : (
            <Text className="text-ui-fg-subtle">Select categories</Text>
          )}
        </div>
        <span className="flex h-full w-10 items-center justify-center border-l border-ui-border-base">
          {/* <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15L7 10H17L12 15Z" fill="currentColor" />
          </svg> */}
          <TrianglesMini></TrianglesMini>
        </span>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-md border border-ui-border-base bg-ui-bg-base shadow-lg"
        >
          {categories.length === 0 ? (
            <div className="p-3 text-ui-fg-subtle">No categories found.</div>
          ) : (
            categories.map((category) => {
              const isSelected = value.includes(category.id);
              return (
                <div
                  key={category.id}
                  className="flex cursor-pointer items-center justify-between px-3 py-2 text-ui-fg-base hover:bg-ui-bg-base-hover"
                  onClick={() => handleItemClick(category.id)}
                >
                  {getCategoryPath(category)}
                  {isSelected && (
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default MultiSelectCategory 