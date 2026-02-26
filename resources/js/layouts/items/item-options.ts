export type SelectOption = {
  value: string
  label: string
}

export function buildOptions<T extends { id: number; name: string }>(
  items: T[],
): SelectOption[] {
  return items.map((item) => ({
    value: item.id.toString(),
    label: item.name,
  }))
}