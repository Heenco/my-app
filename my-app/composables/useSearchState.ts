import { ref } from 'vue'

export const useSearchState = () => {
  const searchQuery = ref('')
  const searchCoordinates = ref(null)

  const setSearch = (query: string, coordinates: any) => {
    searchQuery.value = query
    searchCoordinates.value = coordinates
  }

  return {
    searchQuery,
    searchCoordinates,
    setSearch
  }
}
