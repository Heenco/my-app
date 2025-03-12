<template>
  <Card class="mt-6 relative max-w-2xl mx-auto">
    <CardHeader>
      <CardTitle>Structural Details</CardTitle>
      <CardDescription>Assess the structural elements of the property</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Roof Section -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-medium text-lg">Roof</h3>
            <Button variant="ghost" size="icon" @click="() => handleAddImage('roof')" type="button">
              <PlusCircle class="h-5 w-5" />
            </Button>
          </div>
          <FormField name="roofType">
            <Label>Roof Type</Label>
            <Select v-model="structuralDetails.roofType">
              <SelectTrigger>
                <SelectValue placeholder="Select roof type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gable">Gable</SelectItem>
                <SelectItem value="hip">Hip</SelectItem>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="skillion">Skillion</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField name="roofCovering">
            <Label>Roof Covering</Label>
            <Select v-model="structuralDetails.roofCovering">
              <SelectTrigger>
                <SelectValue placeholder="Select roof covering" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tile">Tile</SelectItem>
                <SelectItem value="metal">Metal</SelectItem>
                <SelectItem value="slate">Slate</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <!-- Roof Images -->
          <div v-if="structuralDetails.images.roof.length > 0" class="grid grid-cols-3 gap-4">
            <div v-for="(image, index) in structuralDetails.images.roof" :key="index" class="relative">
              <img :src="image" alt="Roof image" class="w-full h-32 object-cover rounded-md" />
              <Button 
                variant="destructive" 
                size="icon" 
                class="absolute top-1 right-1 h-6 w-6"
                @click="() => removeImage('roof', index)"
              >
                <X class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <!-- Walls Section -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-medium text-lg">Walls</h3>
            <Button variant="ghost" size="icon" @click="() => handleAddImage('walls')" type="button">
              <PlusCircle class="h-5 w-5" />
            </Button>
          </div>
          <FormField name="externalWalls">
            <Label>External Walls</Label>
            <Select v-model="structuralDetails.externalWalls">
              <SelectTrigger>
                <SelectValue placeholder="Select wall type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brick-veneer">Brick Veneer</SelectItem>
                <SelectItem value="double-brick">Double Brick</SelectItem>
                <SelectItem value="weatherboard">Weatherboard</SelectItem>
                <SelectItem value="rendered">Rendered</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <!-- Walls Images -->
          <div v-if="structuralDetails.images.walls.length > 0" class="grid grid-cols-3 gap-4">
            <div v-for="(image, index) in structuralDetails.images.walls" :key="index" class="relative">
              <img :src="image" alt="Wall image" class="w-full h-32 object-cover rounded-md" />
              <Button 
                variant="destructive" 
                size="icon" 
                class="absolute top-1 right-1 h-6 w-6"
                @click="() => removeImage('walls', index)"
              >
                <X class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <!-- Structural Elements & Defects -->
        <div class="space-y-4">
          <h3 class="font-medium text-lg">Structural Elements & Defects</h3>
          
          <FormField name="structuralDamage">
            <Label>Structural Damage Observed?</Label>
            <Select v-model="structuralDetails.structuralDamage">
              <SelectTrigger>
                <SelectValue placeholder="Select yes/no" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <div class="grid grid-cols-2 gap-4">
            <FormField name="cracking">
              <Label>Cracking</Label>
              <Select v-model="structuralDetails.cracking">
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="minor">Minor</SelectItem>
                  <SelectItem value="major">Major</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField name="deformation">
              <Label>Deformation</Label>
              <Select v-model="structuralDetails.deformation">
                <SelectTrigger>
                  <SelectValue placeholder="Select yes/no" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField name="dampness">
              <Label>Dampness</Label>
              <Select v-model="structuralDetails.dampness">
                <SelectTrigger>
                  <SelectValue placeholder="Select yes/no" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField name="timberDamage">
              <Label>Timber Damage</Label>
              <Select v-model="structuralDetails.timberDamage">
                <SelectTrigger>
                  <SelectValue placeholder="Select yes/no" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </div>

        <!-- Primary Building Components -->
        <div class="space-y-4">
          <h3 class="font-medium text-lg">Primary Building Components</h3>
          
          <FormField name="floors">
            <Label>Floors</Label>
            <Select v-model="structuralDetails.floors">
              <SelectTrigger>
                <SelectValue placeholder="Select floor type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slab">Slab on Ground</SelectItem>
                <SelectItem value="timber">Timber</SelectItem>
                <SelectItem value="concrete">Concrete</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField name="walls">
            <Label>Walls</Label>
            <Select v-model="structuralDetails.walls">
              <SelectTrigger>
                <SelectValue placeholder="Select wall type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brick-veneer">Brick Veneer</SelectItem>
                <SelectItem value="timber-frame">Timber Frame</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField name="roofStructure">
            <Label>Roof</Label>
            <Select v-model="structuralDetails.roofStructure">
              <SelectTrigger>
                <SelectValue placeholder="Select roof type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concrete-tile">Concrete Tile</SelectItem>
                <SelectItem value="metal">Metal</SelectItem>
                <SelectItem value="timber-frame">Timber Frame</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField name="doorsAndWindows">
            <Label>Doors & Windows</Label>
            <Select v-model="structuralDetails.doorsAndWindows">
              <SelectTrigger>
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timber">Timber</SelectItem>
                <SelectItem value="aluminium">Aluminium</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField name="otherElements">
            <Label>Other Elements</Label>
            <Textarea 
              v-model="structuralDetails.otherElements" 
              placeholder="Describe condition of architraves, skirting, mouldings, cabinets, etc."
            />
          </FormField>
        </div>

        <div class="flex gap-4">
          <Button type="button" variant="outline" @click="saveAsDraft">
            Save as Draft
          </Button>
          <Button type="submit">
            Save and Continue
          </Button>
        </div>
      </form>

      <!-- Hidden file input -->
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        accept="image/*"
        @change="onFileSelected"
      />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormField } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle, X } from 'lucide-vue-next'

interface StructuralDetailsForm {
  roofType: string
  roofCovering: string
  externalWalls: string
  // Structural Elements & Defects
  structuralDamage: string
  cracking: string
  deformation: string
  dampness: string
  timberDamage: string
  
  // Primary Building Components
  floors: string
  walls: string
  roofStructure: string
  doorsAndWindows: string
  otherElements: string

  images: {
    roof: string[]
    walls: string[]
    floors: string[]
    other: string[]
  }
}

const structuralDetails = ref<StructuralDetailsForm>({
  roofType: '',
  roofCovering: '',
  externalWalls: '',
  structuralDamage: '',
  cracking: '',
  deformation: '',
  dampness: '',
  timberDamage: '',
  floors: '',
  walls: '',
  roofStructure: '',
  doorsAndWindows: '',
  otherElements: '',
  images: {
    roof: [],
    walls: [],
    floors: [],
    other: []
  }
})

const DRAFT_KEY = 'structural-details-draft'
const error = ref<string | null>(null)
const isLoading = ref(false)

const emit = defineEmits<{
  (e: 'submit', data: StructuralDetailsForm): void
  (e: 'draftSaved'): void
}>()

const saveAsDraft = () => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(structuralDetails.value))
    emit('draftSaved')
  } catch (e) {
    error.value = 'Failed to save draft'
    console.error('Failed to save draft:', e)
  }
}

const handleSubmit = async () => {
  try {
    // Implement submit logic
    emit('submit', structuralDetails.value)
  } catch (e) {
    error.value = 'Failed to submit'
  }
}

const fileInput = ref<HTMLInputElement | null>(null)
const currentSection = ref<keyof StructuralDetailsForm['images']>('roof')

const handleAddImage = (section: keyof StructuralDetailsForm['images']) => {
  currentSection.value = section
  fileInput.value?.click()
}

const onFileSelected = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return

  const file = target.files[0]
  const reader = new FileReader()

  reader.onload = (e) => {
    if (e.target?.result) {
      structuralDetails.value.images[currentSection.value].push(e.target.result as string)
    }
  }

  reader.readAsDataURL(file)
  target.value = '' // Reset file input
}

const removeImage = (section: keyof StructuralDetailsForm['images'], index: number) => {
  structuralDetails.value.images[section].splice(index, 1)
}
</script>
