<template>
  <div class="flex h-screen bg-background">
    <!-- Sidebar -->
    <aside :class="[
      'fixed left-0 top-0 h-full border-r bg-background transition-all duration-300 ease-in-out',
      isCollapsed ? 'w-16' : 'w-1/4'
    ]">
      <ScrollArea class="h-full">
        <div class="p-6">
          <div class="logo-group flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <span :class="[
              'text-3xl font-black bg-gradient-to-r from-gray-400 via-orange-600 to-orange-400 bg-clip-text text-transparent tracking-tight transition-all duration-300',
              isCollapsed ? 'scale-0 w-0 opacity-0' : ''
            ]">
              Picky
            </span>
          </div>
          <Separator class="my-4" />

          <nav class="space-y-2">
            <Button variant="ghost" class="w-full flex items-center p-2 rounded-lg transition-colors">
              <span v-show="!isCollapsed" class="ml-3 transition-opacity duration-200">
                General Info
              </span>
            </Button>
            <Button 
              variant="ghost" 
              class="w-full flex items-center p-2 rounded-lg transition-colors"
              :disabled="!showPropertyDetails"
            >
              <span v-show="!isCollapsed" class="ml-3 transition-opacity duration-200">
                Property Details
              </span>
            </Button>
            <Button 
              variant="ghost" 
              class="w-full flex items-center p-2 rounded-lg transition-colors"
              :disabled="!showStructuralDetails"
            >
              <span v-show="!isCollapsed" class="ml-3 transition-opacity duration-200">
                Structural Details
              </span>
            </Button>
          </nav>
        </div>
      </ScrollArea>

      <!-- Sidebar Toggle Button -->
      <button 
        class="absolute -right-px top-6 h-12 w-1 bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
        @click="toggleSidebar"
      >
      </button>
    </aside>

    <!-- Main Content -->
    <main :class="[
      'min-h-screen p-8 transition-all duration-300 ease-in-out',
      isCollapsed ? 'ml-16 w-[calc(100%-4rem)]' : 'ml-[25%] w-3/4'
    ]">
      <div class="container mx-auto py-10">
        <Card class="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Property Inspection Report</CardTitle>
            <CardDescription>Fill in the general information for the inspection report.</CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {{ error }}
            </div>
            <form @submit.prevent="handleSubmit" class="space-y-6" :class="{ 'opacity-50 pointer-events-none': isLoading }">
              <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-white/50">
                <div class="text-center">Loading...</div>
              </div>
              <div class="space-y-1.3">
                <FormField name="reportNumber">
                  <Label for="reportNumber">Report Number</Label>
                  <Input id="reportNumber" v-model="formData.reportNumber" placeholder="Enter report number" />
                </FormField>

                <FormField name="inspectionDate">
                  <Label for="inspectionDate">Inspection Date</Label>
                  <Input 
                    id="inspectionDate" 
                    type="date" 
                    :value="formatDate(formData.inspectionDate)"
                    @input="updateDate"
                  />
                </FormField>

                <FormField name="propertyAddress">
                  <Label for="propertyAddress">Property Address</Label>
                  <Input id="propertyAddress" v-model="formData.propertyAddress" placeholder="Enter property address" />
                </FormField>

                <FormField name="clientName">
                  <Label for="clientName">Client Name</Label>
                  <Input id="clientName" v-model="formData.clientName" placeholder="Enter client name" />
                </FormField>

                <FormField name="inspectorName">
                  <Label for="inspectorName">Inspector Name</Label>
                  <Input id="inspectorName" v-model="formData.inspectorName" placeholder="Enter inspector name" />
                </FormField>

                <FormField name="inspectionType">
                  <Label for="inspectionType">Inspection Type</Label>
                  <Select v-model="formData.inspectionType" @update:modelValue="handleInspectionTypeChange">
                    <SelectTrigger>
                      <SelectValue placeholder="Select inspection type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="property-and-pest">
                        Property & Timber Pest Inspection
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div class="flex gap-4">
                <Button type="button" variant="outline" @click="saveAsDraft">
                  Save as Draft
                </Button>
                <Button type="submit">
                  Submit Report
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <GeneralPropertyDetails 
          v-if="showPropertyDetails" 
          @draft-saved="handlePropertyDetailsDraftSaved"
        />
        <StructuralDetails 
          v-if="showStructuralDetails"
          @draft-saved="handleStructuralDetailsDraftSaved"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// Add this import at the top with other imports
import { useInspectionForm } from '@/composables/useInspectionForm'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormField } from '@/components/ui/form'
import GeneralPropertyDetails from '@/components/GeneralPropertyDetails.vue'
import StructuralDetails from '@/components/StructuralDetails.vue'

interface InspectionFormData {
  reportNumber: string
  inspectionDate: Date
  propertyAddress: string
  clientName: string
  inspectorName: string
  inspectionType: string
}

const initialFormData: InspectionFormData = {
  reportNumber: '',
  inspectionDate: new Date(),
  propertyAddress: '',
  clientName: '',
  inspectorName: '',
  inspectionType: ''
}

const { formData, saveAsDraft, loadDraft } = useInspectionForm<InspectionFormData>()

// Initialize formData immediately after destructuring
formData.value = { ...initialFormData }

const error = ref<string | null>(null)
const isLoading = ref(false)
const showPropertyDetails = ref(false)
const showStructuralDetails = ref(false)
const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

onMounted(async () => {
  isLoading.value = true
  error.value = null
  
  try {
    await loadDraft()
  } catch (e) {
    error.value = 'Failed to load draft'
  } finally {
    isLoading.value = false
  }
})

const formatDate = (date: Date) => {
  if (!date) return ''
  return date.toISOString().split('T')[0]
}

const updateDate = (e: Event) => {
  const target = e.target as HTMLInputElement
  formData.value.inspectionDate = new Date(target.value)
}

const validateForm = (): boolean => {
  if (!formData.value.reportNumber || 
      !formData.value.inspectionDate ||
      !formData.value.propertyAddress ||
      !formData.value.clientName ||
      !formData.value.inspectorName ||
      !formData.value.inspectionType) {
    error.value = 'Please fill in all required fields'
    return false
  }
  return true
}

const handleSubmit = async () => {
  error.value = null
  if (!validateForm()) return

  isLoading.value = true
  try {
    // Replace with your actual submission logic
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
    console.log('Form submitted:', formData.value)
    // await submitInspectionForm(formData.value)
  } catch (e) {
    error.value = 'Failed to submit form'
  } finally {
    isLoading.value = false
  }
}

const handleInspectionTypeChange = (value: string) => {
  showPropertyDetails.value = value === 'property-and-pest'
}

const handlePropertyDetailsDraftSaved = () => {
  showStructuralDetails.value = true
}

const handleStructuralDetailsDraftSaved = () => {
  // Handle next section if needed
  console.log('Structural details draft saved')
}
</script>

<style scoped>
.logo-group {
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1;
}

.logo-group:hover span {
  animation: none;
  background-position: 0% center;
}

.logo-group span {
  letter-spacing: -0.03em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  background-size: 200% auto;
  animation: shine 3s ease infinite;
}

@keyframes shine {
  to {
    background-position: 200% center;
  }
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .flex {
    flex-direction: column;
  }
  
  aside {
    position: static;
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid;
  }

  main {
    width: 100%;
    margin-left: 0;
  }
}

/* Add these new transition styles */
.sidebar-transition {
  transition: all 0.3s ease-in-out;
}

/* Override scroll area styles when sidebar is collapsed */
aside:not(.w-14) :deep(.scroll-area) {
  overflow: hidden;
}

.container {
  max-width: 1200px;
}
</style>
