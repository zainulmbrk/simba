import type { Item } from '@/types'
import type { ItemFormValues } from '@/types'

export const defaultFormValues: ItemFormValues = {
    name: '',
    code: '',
    nup: '',
    category: '',
    status: '',
    condition: '',
    location: '',
    user_id: '', // ⬅️ Sesuaikan
    responsible: '',
    attributes: {},
};

export const mapItemToForm = (item: Item): ItemFormValues => ({
    name: item.name || '',
    code: item.code || '',
    nup: item.nup || '',
    // Gunakan ?.toString() dan berikan default value '' jika null
    category: item.category_id?.toString() || '', 
    status: item.status_id?.toString() || '',
    condition: item.condition_id?.toString() || '',
    location: item.location || '',
    user_id: item.user_id?.toString() || '', // Proteksi jika user_id null
    responsible: item.responsible || '',
    attributes: item.attributes || {},
});

export type Option = {
  value: string
  label: string
}

export function getLabel(
  value: string,
  options: Option[],
) {
  const found = options.find((opt) => opt.value === value)
  return found ? found.label : value
}