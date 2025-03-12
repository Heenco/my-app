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

          <div class="space-y-4">
            <div class="space-y-2">
              <h3 class="text-sm font-medium">Property Type</h3>
              <Input 
                v-model="editableFields.propertyType" 
                placeholder="Enter property type"
                :class="{ 'border-red-500': errors.propertyType }"
              />
              <span v-if="errors.propertyType" class="text-xs text-red-500">
                {{ errors.propertyType }}
              </span>
            </div>
            <div class="space-y-2">
              <h3 class="text-sm font-medium">Inspection Date</h3>
              <Input 
                type="date" 
                v-model="editableFields.inspectionDate"
                :class="{ 'border-red-500': errors.inspectionDate }"
              />
              <span v-if="errors.inspectionDate" class="text-xs text-red-500">
                {{ errors.inspectionDate }}
              </span>
            </div>
            <div class="space-y-2">
              <h3 class="text-sm font-medium">Inspector Name</h3>
              <Input 
                v-model="editableFields.inspectorName" 
                placeholder="Enter inspector name"
                :class="{ 'border-red-500': errors.inspectorName }"
              />
              <span v-if="errors.inspectorName" class="text-xs text-red-500">
                {{ errors.inspectorName }}
              </span>
            </div>
          </div>
        </div>
      </ScrollArea>

      <!-- Sidebar Toggle Button -->
      <Button 
        variant="ghost" 
        size="icon" 
        class="absolute -right-3 top-6 h-8 w-8 rounded-full border shadow-md bg-background"
        @click="toggleSidebar"
      >
        <ChevronLeft v-if="!isCollapsed" class="h-4 w-4" />
        <ChevronRight v-else class="h-4 w-4" />
      </Button>
    </aside>

    <!-- Main Content -->
    <main :class="[
      'min-h-screen p-8 transition-all duration-300 ease-in-out',
      isCollapsed ? 'ml-16 w-[calc(100%-4rem)]' : 'ml-[25%] w-3/4'
    ]">
      <div class="container mx-auto p-6">
        <h1 class="text-3xl font-bold mb-6">Property Inspection</h1>

        <!-- Property Report Summary -->
        <Card class="mb-6">
          <CardHeader>
            <CardTitle>Property Report - Summary</CardTitle>
            <CardDescription>Overall inspection findings and risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <Table>
                <TableBody class="divide-y">
                  <TableRow class="hover:bg-orange-50/50 transition-colors">
                    <TableCell className="font-medium w-2/3 py-4">Evidence of Serious Safety Hazards</TableCell>
                    <TableCell @dblclick="startEditing('safetyHazards')" 
                              class="relative py-4 px-4 rounded-md transition-all"
                              :class="{ 'border-red-500': errors.safetyHazards }">
                      <template v-if="editingField === 'safetyHazards'">
                        <Input
                          v-model="editableFields.safetyHazards"
                          class="w-full p-0 h-6"
                          :class="{ 'border-red-500': errors.safetyHazards }"
                          @blur="saveEdit('safetyHazards')"
                          @keyup.enter="saveEdit('safetyHazards')"
                          autofocus
                        />
                        <span v-if="errors.safetyHazards" class="text-xs text-red-500 absolute -bottom-5 left-0">
                          {{ errors.safetyHazards }}
                        </span>
                      </template>
                      <span v-else class="block p-1">{{ editableFields.safetyHazards }}</span>
                    </TableCell>
                  </TableRow>

                  <TableRow class="hover:bg-orange-50/50 transition-colors">
                    <TableCell className="font-medium w-2/3 py-4">Evidence of Major Defects</TableCell>
                    <TableCell @dblclick="startEditing('majorDefects')" 
                              class="relative py-4 px-4 rounded-md transition-all"
                              :class="{ 'border-red-500': errors.majorDefects }">
                      <template v-if="editingField === 'majorDefects'">
                        <Input
                          v-model="editableFields.majorDefects"
                          class="w-full p-0 h-6"
                          :class="{ 'border-red-500': errors.majorDefects }"
                          @blur="saveEdit('majorDefects')"
                          @keyup.enter="saveEdit('majorDefects')"
                          autofocus
                        />
                        <span v-if="errors.majorDefects" class="text-xs text-red-500 absolute -bottom-5 left-0">
                          {{ errors.majorDefects }}
                        </span>
                      </template>
                      <span v-else class="block p-1">{{ editableFields.majorDefects }}</span>
                    </TableCell>
                  </TableRow>

                  <TableRow class="hover:bg-orange-50/50 transition-colors">
                    <TableCell className="font-medium w-2/3 py-4">Evidence of Minor Defects</TableCell>
                    <TableCell @dblclick="startEditing('minorDefects')" 
                              class="relative py-4 px-4 rounded-md transition-all"
                              :class="{ 'border-red-500': errors.minorDefects }">
                      <template v-if="editingField === 'minorDefects'">
                        <Input
                          v-model="editableFields.minorDefects"
                          class="w-full p-0 h-6"
                          :class="{ 'border-red-500': errors.minorDefects }"
                          @blur="saveEdit('minorDefects')"
                          @keyup.enter="saveEdit('minorDefects')"
                          autofocus
                        />
                        <span v-if="errors.minorDefects" class="text-xs text-red-500 absolute -bottom-5 left-0">
                          {{ errors.minorDefects }}
                        </span>
                      </template>
                      <span v-else class="block p-1">{{ editableFields.minorDefects }}</span>
                    </TableCell>
                  </TableRow>

                  <TableRow class="hover:bg-orange-50/50 transition-colors">
                    <TableCell className="font-medium w-2/3 py-4">
                      Due to the level of accessibility for inspection including the presence of obstructions, 
                      the overall degree of risk of undetected defects including structural damage and 
                      conditions conducive to structural damage was considered:
                    </TableCell>
                    <TableCell @dblclick="startEditing('riskLevel')" 
                              class="relative py-4 px-4 rounded-md transition-all"
                              :class="{ 'border-red-500': errors.riskLevel }">
                      <template v-if="editingField === 'riskLevel'">
                        <Input
                          v-model="editableFields.riskLevel"
                          class="w-full p-0 h-6 text-orange-600 font-medium"
                          :class="{ 'border-red-500': errors.riskLevel }"
                          @blur="saveEdit('riskLevel')"
                          @keyup.enter="saveEdit('riskLevel')"
                          autofocus
                        />
                        <span v-if="errors.riskLevel" class="text-xs text-red-500 absolute -bottom-5 left-0">
                          {{ errors.riskLevel }}
                        </span>
                      </template>
                      <span v-else class="block p-1 text-orange-600 font-medium">
                        {{ editableFields.riskLevel }}
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <!-- Timber Pest Report Summary -->
        <Card class="mb-6">
          <CardHeader>
            <CardTitle>Timber Pest Report - Summary</CardTitle>
            <CardDescription>Termite and pest inspection findings</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <Table>
                <TableBody class="divide-y">
                  <TableRow v-for="(field, key) in pestReportFields" :key="key" 
                           class="hover:bg-orange-50/50 transition-colors">
                    <TableCell className="font-medium w-2/3 py-4">{{ field.label }}</TableCell>
                    <TableCell @dblclick="startEditing(key)" 
                              class="relative py-4 px-4 rounded-md transition-all"
                              :class="{ 'border-red-500': errors[key] }">
                      <template v-if="editingField === key">
                        <Input
                          v-model="editableFields[key]"
                          class="w-full p-0 h-6"
                          :class="{ 'border-red-500': errors[key] }"
                          @blur="saveEdit(key)"
                          @keyup.enter="saveEdit(key)"
                          autofocus
                        />
                        <span v-if="errors[key]" class="text-xs text-red-500 absolute -bottom-5 left-0">
                          {{ errors[key] }}
                        </span>
                      </template>
                      <span v-else class="block p-1">
                        {{ editableFields[key] }}
                      </span>
                    </TableCell>
                  </TableRow>
                  <!-- Risk Level Row -->
                  <TableRow class="hover:bg-orange-50/50 transition-colors">
                    <TableCell className="font-medium w-2/3 py-4">
                      Due to the level of accessibility for inspection including the presence of obstructions, 
                      the overall degree of risk of undetected timber pest attack and conditions conducive to 
                      timber pest attack was considered:
                    </TableCell>
                    <TableCell @dblclick="startEditing('accessibilityRisk')" 
                              class="relative py-4 px-4 rounded-md transition-all"
                              :class="{ 'border-red-500': errors.accessibilityRisk }">
                      <template v-if="editingField === 'accessibilityRisk'">
                        <Input
                          v-model="editableFields.accessibilityRisk"
                          class="w-full p-0 h-6 text-orange-600 font-medium"
                          :class="{ 'border-red-500': errors.accessibilityRisk }"
                          @blur="saveEdit('accessibilityRisk')"
                          @keyup.enter="saveEdit('accessibilityRisk')"
                          autofocus
                        />
                        <span v-if="errors.accessibilityRisk" class="text-xs text-red-500 absolute -bottom-5 left-0">
                          {{ errors.accessibilityRisk }}
                        </span>
                      </template>
                      <span v-else class="block p-1 text-orange-600 font-medium">
                        {{ editableFields.accessibilityRisk }}
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>


        
        <!-- Home Details Section -->
        <Card class="mb-6">
          <CardHeader>
            <CardTitle>Home Details</CardTitle>
            <CardDescription>Property specifications and construction details</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-8">
              <!-- General Description -->
              <div>
                <h3 class="text-lg font-semibold mb-4 pb-2 border-b border-orange-200 text-orange-700">
                  General Description of the Property
                </h3>
                <Table>
                  <TableBody class="divide-y">
                    <TableRow v-for="(value, key) in propertyDetails.general" :key="key" 
                             class="hover:bg-orange-50/50 transition-colors">
                      <TableCell className="font-medium w-2/3 py-4">{{ value.label }}</TableCell>
                      <TableCell @dblclick="startEditing(key)" 
                                class="relative py-4 px-4 rounded-md transition-all"
                                :class="{ 'border-red-500': errors[key] }">
                        <template v-if="editingField === key">
                          <Input
                            v-model="editableFields[key]"
                            class="w-full p-0 h-6"
                            :class="{ 'border-red-500': errors[key] }"
                            @blur="saveEdit(key)"
                            @keyup.enter="saveEdit(key)"
                            autofocus
                          />
                          <span v-if="errors[key]" class="text-xs text-red-500 absolute -bottom-5 left-0">
                            {{ errors[key] }}
                          </span>
                        </template>
                        <span v-else class="block p-1">{{ editableFields[key] }}</span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <!-- Construction -->
              <div>
                <h3 class="text-lg font-semibold mb-4 pb-2 border-b border-orange-200 text-orange-700">
                  Primary Method of Construction
                </h3>
                <Table>
                  <TableBody class="divide-y">
                    <TableRow v-for="(value, key) in propertyDetails.construction" :key="key"
                             class="hover:bg-orange-50/50 transition-colors">
                      <TableCell className="font-medium w-2/3 py-4">{{ value.label }}</TableCell>
                      <TableCell @dblclick="startEditing(key)" 
                                class="relative py-4 px-4 rounded-md transition-all"
                                :class="{ 'border-red-500': errors[key] }">
                        <template v-if="editingField === key">
                          <Input
                            v-model="editableFields[key]"
                            class="w-full p-0 h-6"
                            :class="{ 'border-red-500': errors[key] }"
                            @blur="saveEdit(key)"
                            @keyup.enter="saveEdit(key)"
                            autofocus
                          />
                          <span v-if="errors[key]" class="text-xs text-red-500 absolute -bottom-5 left-0">
                            {{ errors[key] }}
                          </span>
                        </template>
                        <span v-else class="block p-1">{{ editableFields[key] }}</span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <!-- Accommodation -->
              <div>
                <h3 class="text-lg font-semibold mb-4 pb-2 border-b border-orange-200 text-orange-700">
                  Accomodation and Significant Ancillaries
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TableRow v-for="(value, key) in propertyDetails.accommodation" :key="key"
                           class="flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-orange-50/50 transition-colors">
                    <TableCell className="font-medium flex-1">{{ value.label }}</TableCell>
                    <TableCell @dblclick="startEditing(key)" 
                              class="relative w-24 text-center"
                              :class="{ 'border-red-500': errors[key] }">
                      <template v-if="editingField === key">
                        <Input
                          v-model="editableFields[key]"
                          class="w-full p-0 h-6 text-center"
                          :class="{ 'border-red-500': errors[key] }"
                          @blur="saveEdit(key)"
                          @keyup.enter="saveEdit(key)"
                          autofocus
                        />
                        <span v-if="errors[key]" class="text-xs text-red-500 absolute -bottom-5 left-0">
                          {{ errors[key] }}
                        </span>
                      </template>
                      <span v-else class="block p-1">{{ editableFields[key] }}</span>
                    </TableCell>
                  </TableRow>
                </div>
              </div>

              <!-- Parking -->
              <div>
                <h3 class="text-lg font-semibold mb-4 pb-2 border-b border-orange-200 text-orange-700">
                  Parking
                </h3>
                <div class="bg-orange-50/30 p-6 rounded-lg">
                  <TableRow v-for="(value, key) in propertyDetails.parking" :key="key"
                           class="flex items-center mb-4 last:mb-0">
                    <TableCell className="font-medium flex-1">{{ value.label }}</TableCell>
                    <TableCell @dblclick="startEditing(key)" 
                              class="relative w-40 bg-white rounded-md shadow-sm"
                              :class="{ 'border-red-500': errors[key] }">
                      <template v-if="editingField === key">
                        <Input
                          v-model="editableFields[key]"
                          class="w-full p-0 h-6"
                          :class="{ 'border-red-500': errors[key] }"
                          @blur="saveEdit(key)"
                          @keyup.enter="saveEdit(key)"
                          autofocus
                        />
                        <span v-if="errors[key]" class="text-xs text-red-500 absolute -bottom-5 left-0">
                          {{ errors[key] }}
                        </span>
                      </template>
                      <span v-else class="block p-2 text-center">{{ editableFields[key] }}</span>
                    </TableCell>
                  </TableRow>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Images Section -->
        <Card class="mb-6">
          <CardHeader>
            <CardTitle>Home Inspection Photos</CardTitle>
            <CardDescription>Upload and manage inspection photos - General</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon class="w-8 h-8 mb-4 text-gray-500" />
                    <p class="mb-2 text-sm text-gray-500">
                      <span class="font-semibold">Click to upload</span> or drag and drop
                    </p>
                  </div>
                  <input type="file" class="hidden" multiple @change="handleImageUpload" accept="image/*" />
                </label>
              </div>

              <!-- Image Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div v-for="(image, index) in images" :key="index" class="relative group">
                  <img :src="image.url" alt="Inspection photo" class="w-full h-48 object-cover rounded-lg" />
                  <button @click="removeImage(index)" class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <XIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Cubi Case Floor Plan -->
        <Card class="mb-6">
          <CardHeader>
            <CardTitle>Cubi Case Floor Plan</CardTitle>
            <CardDescription>Upload floor plan images for Cubi Case processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-center justify-center w-full">
                <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-orange-200">
                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadIcon class="w-8 h-8 mb-4 text-orange-500" />
                    <p class="mb-2 text-sm text-gray-500">
                      <span class="font-semibold">Upload floor plan</span> or drag and drop
                    </p>
                    <p class="text-xs text-gray-500">PNG, JPG or PDF (max. 10MB)</p>
                  </div>
                  <input type="file" class="hidden" @change="handleFloorPlanUpload" accept="image/*,.pdf" />
                </label>
              </div>

              <!-- Floor Plan Preview -->
              <div v-if="floorPlan" class="relative group">
                <div class="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img v-if="floorPlan.type.includes('image')" 
                       :src="floorPlan.url" 
                       alt="Floor plan" 
                       class="w-full h-full object-contain" />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <p class="text-sm text-gray-500">{{ floorPlan.file.name }}</p>
                  </div>
                </div>
                <button @click="removeFloorPlan" 
                        class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <XIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div class="mt-8 flex justify-end">
          <Button 
            @click="onSubmit"
            class="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Save Inspection Report
          </Button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronLeft, ChevronRight, Upload as UploadIcon, X as XIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table'
import { useForm } from 'vee-validate'
import { inspectionSchema } from '@/utils/validationSchema'

const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const images = ref([])

const handleImageUpload = (event) => {
  const files = event.target.files
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const reader = new FileReader()
    reader.onload = (e) => {
      images.value.push({
        url: e.target.result,
        file: file
      })
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = (index) => {
  images.value.splice(index, 1)
}

const floorPlan = ref(null)

const handleFloorPlanUpload = (event) => {
  const file = event.target.files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    floorPlan.value = {
      url: e.target.result,
      file: file,
      type: file.type
    }
  }
  reader.readAsDataURL(file)
}

const removeFloorPlan = () => {
  floorPlan.value = null
}

// Initialize form with validation
const { handleSubmit, errors, values } = useForm({
  validationSchema: inspectionSchema,
  initialValues: {
    propertyType: '',
    inspectionDate: '',
    inspectorName: '',
    safetyHazards: 'Was not observed',
    riskLevel: 'Moderate-High',
    buildingType: 'Detached house',
    buildingAge: 24,
    bedrooms: 4
  }
})

// Handle form submission
const onSubmit = handleSubmit((values) => {
  console.log('Form submitted:', values)
  // Add your submission logic here
})

// Modify your existing editableFields to use the validated values
const editableFields = ref({
  ...values,
  // Keep your other existing fields
  majorDefects: 'Was observed - see Section D, Item D2 - D21',
  minorDefects: 'Was observed - see Section D, item D22',
  activeTermites: 'Was not observed',
  termiteActivity: 'Was not observed',
  previousManagement: 'was not observed',
  nextInspection: 'within 12 months',
  chemicalDamage: 'was not observed',
  fungalDecay: 'was not observed',
  woodBorer: 'was not observed',
  conduciveConditions: 'were not observed',
  safetyHazardsPest: 'was not observed',
  accessibilityRisk: 'was considered to be high due to the presence of obstructions and/or limited access',
  storeys: 'Single storey',
  extension: 'Not applicable',
  smokeDetectors: 'From 1 January 2022, All homes or units being sold or leased, or existing leases renewed, will require hardwired photoelectric, interconnected smoke alarms. Non-removable 10-year battery smoke alarms can be installed in place. (Vendor should provide a certificate of compliance prior settlement)',
  siting: 'Towards the front of a small block',
  gradient: 'The land is sloping',
  drainage: 'The site appears to be adequately drained',
  access: 'Reasonable pedestrian and vehicular access',
  utilities: 'The following services were connected:, Electricity, Water, Sewer, NBN/Telstra',
  occupancy: 'Unoccupied and unfurnished',
  orientation: 'The facade of the building faces west\nNote. For the purpose of this report the façade of the building contains the main entrance door',
  weather: 'Dry',
  floorConstruction: 'Slab on Ground',
  wallConstruction: 'Brick Veneer, Timber Frame',
  roofConstruction: 'Concrete Tile, Timber Frame Structure',
  otherElements: 'Doors, Reveals, Architraves, Skirtings, Mouldings, Cabinets, Fencing',
  constructionStandard: 'Reasonable',
  workmanship: 'Reasonable',
  maintenance: 'Reasonably maintained',
  incomplete: 'No evidence found',
  livingRooms: '1',
  bathrooms: '2',
  toilets: '1',
  kitchens: '2',
  diningRooms: '1',
  kitchen: '1',
  laundry: '1',
  type: 'Attached Garage',
  quantity: '2'
})

const editingField = ref(null)

// Add these new methods
const startEditing = (field) => {
  editingField.value = field
}

// Update the saveEdit method to include validation
const saveEdit = async (field) => {
  try {
    // Only validate fields that are in the schema
    if (field in inspectionSchema.fields) {
      await inspectionSchema.validateAt(field, { [field]: editableFields.value[field] })
    }
    editingField.value = null
  } catch (error) {
    // Show error message
    alert(error.message)
  }
}

// Add these new refs for pest report fields
const pestReportFields = ref({
  termiteActivity: { label: 'Evidence of Termite Activity' },
  borerActivity: { label: 'Evidence of Borer Activity' },
  fungalDecay: { label: 'Evidence of Fungal Decay' },
  pestRiskLevel: { label: 'Overall Pest Risk Level' },
  activeTermites: {
    label: 'Evidence of active (live) termites'
  },
  termiteActivity: {
    label: 'Evidence of termite activity \n (including workings) and/or damage'
  },
  previousManagement: {
    label: 'Evidence of a possible previous termite management program'
  },
  nextInspection: {
    label: 'The next inspection to help detect any future termite attack is recommended in'
  },
  chemicalDamage: {
    label: 'Evidence of chemical delignification damage'
  },
  fungalDecay: {
    label: 'Evidence of fungal decay activity and/or damage'
  },
  woodBorer: {
    label: 'Evidence of wood borer activity and/or damage'
  },
  conduciveConditions: {
    label: 'Evidence of conditions conducive to timber pest attack'
  },
  safetyHazardsPest: {
    label: 'Evidence of major safety hazards'
  },
  accessibilityRisk: {
    label: 'Due to the level of accessibility for inspection including the presence of obstructions, the overall degree of risk of undetected timber pest attack and conditions conducive to timber pest attack was considered'
  }
})

// Add these new refs for property details fields
const propertyDetails = ref({
  general: {
    //propertyType: { label: 'Property Type' },
    //yearBuilt: { label: 'Year Built' },
    //lotSize: { label: 'Lot Size' },
    //buildingSize: { label: 'Building Size' },
    //zoning: { label: 'Zoning' },
    buildingType: { label: 'Residential building type' },
    storeys: { label: 'Number of storeys' },
    buildingAge: { label: 'Approximate building age' },
    extension: { label: 'Approximate year when the property was extended' },
    smokeDetectors: { label: 'Smoke detectors' },
    siting: { label: 'Siting of the building' },
    gradient: { label: 'Gradient' },
    drainage: { label: 'Site drainage' },
    access: { label: 'Access' },
    utilities: { label: 'Main utility services' },
    occupancy: { label: 'Occupancy status' },
    orientation: { label: 'Orientation (to establish the way the property was viewed)' },
    weather: { label: 'Prevailing weather conditions at the time of inspection' }
  },
  construction: {
    //foundation: { label: 'Foundation' },
    //framing: { label: 'Framing' },
    //exteriorWalls: { label: 'Exterior Walls' },
    //roof: { label: 'Roof' },
    //windows: { label: 'Windows' },
    floorConstruction: { label: 'Main building - floor construction' },
    wallConstruction: { label: 'Main building - wall construction' },
    roofConstruction: { label: 'Main building - roof construction' },
    otherElements: { label: 'Other building elements' },
    constructionStandard: { label: 'Overall standard of construction' },
    workmanship: { label: 'Overall quality of workmanship and materials' },
    maintenance: { label: 'Level of maintenance' },
    incomplete: { label: 'Was evidence of the original construction and any alterations or additions to the building not complete in the work synonymous with construction noted (but does not include building services)?' }
  },
  accommodation: {
    bedrooms: { label: 'Bedrooms' },
    bathrooms: { label: 'Bathrooms' },
    livingRooms: { label: 'Living Rooms' },
    //kitchens: { label: 'Kitchens' },
    //diningRooms: { label: 'Dining Rooms' },
    livingRooms: { label: 'Living rooms' },
    bedrooms: { label: 'Bedrooms' },
    bathrooms: { label: 'Bathroom/Ensuite' },
    toilets: { label: 'Separate toilet' },
    kitchen: { label: 'Kitchen' },
    laundry: { label: ': Laundry' }
  },
  parking: {
    //garage: { label: 'Garage' },
    //carport: { label: 'Carport' },
    //driveway: { label: 'Driveway' },
    type: { label: 'Type' },
    quantity: { label: 'Quantity' }
  }
})
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

.sidebar-transition {
  transition: all 0.3s ease-in-out;
}

aside:not(.w-14) :deep(.scroll-area) {
  overflow: hidden;
}

.text-picky-gray-600 {
  color: #4a5568;
}

.group:hover img {
  filter: brightness(0.9);
}

.relative:hover {
  background-color: rgba(0, 0, 0, 0.02);
  cursor: pointer;
}

.relative Input {
  background: transparent;
  border: none;
  border-bottom: 1px dashed #e2e8f0;
}

.relative Input:focus {
  outline: none;
  border-color: #ed8936;
  box-shadow: none;
}

.divide-y > * + * {
  border-top: 1px solid #e2e8f0;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

TableCell:hover .relative {
  background-color: rgba(237, 137, 54, 0.1);
}

.text-orange-700 {
  color: #c05621;
}

.border-orange-200 {
  border-color: #fbd38d;
}
</style>