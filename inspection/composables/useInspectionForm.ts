import { ref } from 'vue'

export function useInspectionForm<T extends Record<string, any>>() {
  const formData = ref<T>({} as T)

  const saveAsDraft = async () => {
    try {
      // Save to localStorage for now, replace with your actual storage logic
      localStorage.setItem('inspectionFormDraft', JSON.stringify(formData.value))
    } catch (e) {
      console.error('Failed to save draft:', e)
    }
  }

  const loadDraft = async () => {
    try {
      const draft = localStorage.getItem('inspectionFormDraft')
      if (draft) {
        formData.value = JSON.parse(draft)
      }
    } catch (e) {
      console.error('Failed to load draft:', e)
    }
  }

  return {
    formData,
    saveAsDraft,
    loadDraft
  }
}
