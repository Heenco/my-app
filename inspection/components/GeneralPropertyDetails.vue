<template>
  <Card class="mt-6 relative max-w-2xl mx-auto">
    <CardHeader>
      <CardTitle>General Property Details</CardTitle>
      <CardDescription>Enter the general details about the property</CardDescription>
    </CardHeader>
    <CardContent>
      <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded">
        {{ error }}
      </div>
      <form @submit.prevent="handleSubmit" class="space-y-6" :class="{ 'opacity-50 pointer-events-none': isLoading }">
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-white/50">
          <div class="text-center">Loading...</div>
        </div>
        <!-- Basic Property Info -->
        <div class="space-y-1.1">
          <FormField name="propertyType">
            <Label>Property Type</Label>
            <Select v-model="propertyDetails.propertyType">
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="detached">Detached House</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="unit">Unit</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField name="storeys">
            <Label>Number of Storeys</Label>
            <Select v-model="propertyDetails.storeys">
              <SelectTrigger>
                <SelectValue placeholder="Select number of storeys" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="double">Double</SelectItem>
                <SelectItem value="multi">Multi-storey</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField name="buildingAge">
            <Label>Approximate Building Age</Label>
            <Input type="number" v-model="propertyDetails.buildingAge" placeholder="Enter age in years" />
          </FormField>

          <div class="space-y-1.1">
            <FormField name="hasExtensions">
              <Label>Extensions or Renovations</Label>
              <Select v-model="propertyDetails.hasExtensions">
                <SelectTrigger>
                  <SelectValue placeholder="Select yes/no" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            
            <FormField v-if="propertyDetails.hasExtensions === 'yes'" name="extensionYear">
              <Label>Year of Extension/Renovation</Label>
              <Input type="number" v-model="propertyDetails.extensionYear" placeholder="Enter year" />
            </FormField>
          </div>
        </div>

        <!-- Site Conditions -->
        <div class="space-y-4">
          <h3 class="font-medium text-lg">Site Conditions</h3>
          
          <FormField name="gradient">
            <Label>Gradient</Label>
            <Select v-model="propertyDetails.gradient">
              <SelectTrigger>
                <SelectValue placeholder="Select gradient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="sloping">Sloping</SelectItem>
                <SelectItem value="steep">Steep</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField name="siteDrainage">
            <Label>Site Drainage</Label>
            <Select v-model="propertyDetails.siteDrainage">
              <SelectTrigger>
                <SelectValue placeholder="Select drainage condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adequate">Adequate</SelectItem>
                <SelectItem value="inadequate">Inadequate</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField name="access">
            <Label>Pedestrian & Vehicular Access</Label>
            <Textarea v-model="propertyDetails.access" placeholder="Describe access conditions" />
          </FormField>
        </div>

        <!-- Utility Services -->
        <div class="space-y-4">
          <h3 class="font-medium text-lg">Main Utility Services</h3>
          
          <div class="grid grid-cols-2 gap-4">
            <FormField v-for="utility in utilities" :key="utility.name" :name="utility.name">
              <Label>{{ utility.label }}</Label>
              <Select v-model="propertyDetails.utilities[utility.name]">
                <SelectTrigger>
                  <SelectValue :placeholder="`Select ${utility.label} status`" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="connected">Connected</SelectItem>
                  <SelectItem value="not-connected">Not Connected</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </div>

        <!-- Occupancy Status -->
        <FormField name="occupancyStatus">
          <Label>Occupancy Status</Label>
          <Select v-model="propertyDetails.occupancyStatus">
            <SelectTrigger>
              <SelectValue placeholder="Select occupancy status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="occupied-furnished">Occupied & Furnished</SelectItem>
              <SelectItem value="occupied-unfurnished">Occupied & Unfurnished</SelectItem>
              <SelectItem value="unoccupied-furnished">Unoccupied & Furnished</SelectItem>
              <SelectItem value="unoccupied-unfurnished">Unoccupied & Unfurnished</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <div class="flex gap-4">
          <Button type="button" variant="outline" @click="saveAsDraft">
            Save as Draft
          </Button>
          <Button type="submit">
            Save and Continue
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormField } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface PropertyUtilities {
  electricity: string
  water: string
  sewer: string
  nbn: string
}

interface PropertyDetailsForm {
  propertyType: string
  storeys: string
  buildingAge: string | number // Changed from number | null
  hasExtensions: 'yes' | 'no'
  extensionYear: string | number // Changed from number | null
  gradient: string
  siteDrainage: string
  access: string
  utilities: PropertyUtilities
  occupancyStatus: string
}

const utilities = [
  { name: 'electricity', label: 'Electricity' },
  { name: 'water', label: 'Water' },
  { name: 'sewer', label: 'Sewer' },
  { name: 'nbn', label: 'NBN/Telstra' }
]

const DRAFT_KEY = 'property-details-draft'
const error = ref<string | null>(null)
const isLoading = ref(false)

const propertyDetails = ref<PropertyDetailsForm>({
  propertyType: '',
  storeys: '',
  buildingAge: '', // Changed from null
  hasExtensions: 'no',
  extensionYear: '', // Changed from null
  gradient: '',
  siteDrainage: '',
  access: '',
  utilities: {
    electricity: '',
    water: '',
    sewer: '',
    nbn: ''
  },
  occupancyStatus: ''
})

const emit = defineEmits<{
  (e: 'submit', data: PropertyDetailsForm): void
  (e: 'draftSaved'): void
}>()

const saveAsDraft = () => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(propertyDetails.value))
    emit('draftSaved')
  } catch (e) {
    error.value = 'Failed to save draft'
    console.error('Failed to save draft:', e)
  }
}

const loadDraft = () => {
  try {
    const draft = localStorage.getItem(DRAFT_KEY)
    if (draft) {
      propertyDetails.value = JSON.parse(draft)
    }
  } catch (e) {
    error.value = 'Failed to load draft'
    console.error('Failed to load draft:', e)
  }
}

const validateForm = (): boolean => {
  if (!propertyDetails.value.propertyType || 
      !propertyDetails.value.storeys ||
      !propertyDetails.value.gradient ||
      !propertyDetails.value.siteDrainage ||
      !propertyDetails.value.occupancyStatus) {
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
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Property details submitted:', propertyDetails.value)
    // Emit event to parent
    emit('submit', propertyDetails.value)
  } catch (e) {
    error.value = 'Failed to submit form'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDraft()
})
</script>
