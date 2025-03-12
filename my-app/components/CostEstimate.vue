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
            <button 
              v-for="category in categories" 
              :key="category"
              @click="selectCategory(category.toLowerCase())"
              class="w-full flex items-center p-2 rounded-lg transition-colors"
              :class="{
                'bg-primary text-white': selectedCategory === category.toLowerCase(),
                'hover:bg-gray-100': selectedCategory !== category.toLowerCase()
              }"
            >
              <Icon 
                :name="getCategoryIcon(category)"
                class="w-5 h-5"
              />
              <span 
                v-show="!isCollapsed"
                class="ml-3 transition-opacity duration-200"
              >
                {{ category }}
              </span>
            </button>
          </nav>
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
        <h1 class="text-3xl font-bold mb-6">Cost Estimation Dashboard</h1>
        <br/>
        <br/>
        
        <Tabs v-model="selectedCategory" class="w-full">
          <TabsList class="grid w-full grid-cols-4">
            <TabsTrigger 
              v-for="category in categories" 
              :key="category"
              :value="category.toLowerCase()"
            >
              {{ category }}
            </TabsTrigger>
          </TabsList>

          <TabsContent 
            v-for="category in categories" 
            :key="category" 
            :value="category.toLowerCase()"
          >
            <Card class="mt-6">
              <CardHeader>
                <CardTitle>{{ category }} Cost Estimates</CardTitle>
                <CardDescription>Detailed breakdown of costs for {{ category }} work</CardDescription>
              </CardHeader>
              <CardContent>
                <div class="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead class="w-[200px]">Main Section</TableHead>
                        <TableHead class="w-[200px]">Subsection</TableHead>
                        <TableHead class="text-right">Labor Cost</TableHead>
                        <TableHead class="text-right">Material Cost</TableHead>
                        <TableHead class="text-right">Total Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <template v-for="categoryData in categoriesData" :key="categoryData.name">
                        <template v-if="categoryData.name.toLowerCase() === category.toLowerCase()">
                          <template v-for="mainSection in categoryData.mainSections" :key="mainSection.name">
                            <TableRow 
                              v-for="subsection in mainSection.subsections" 
                              :key="`${mainSection.name}-${subsection}`"
                            >
                              <TableCell class="font-medium">{{ mainSection.name }}</TableCell>
                              <TableCell>{{ subsection }}</TableCell>
                              <TableCell class="text-right">
                                <template v-if="editingCell && 
                                                editingCell.categoryName === category &&
                                                editingCell.mainSection === mainSection.name &&
                                                editingCell.subsection === subsection &&
                                                editingCell.field === 'labor'">
                                  <input
                                    type="number"
                                    :value="editingCell.value"
                                    @blur="saveEdit"
                                    @keyup.enter="saveEdit"
                                    @keyup.esc="cancelEdit"
                                    class="w-24 text-right px-2 py-1 border rounded"
                                    ref="inputRef"
                                    v-focus
                                  />
                                </template>
                                <span v-else @dblclick="startEditing(category, mainSection.name, subsection, 'labor')">
                                  {{ formatCurrency(getCostValue(mainSection.name, subsection).labor) }}
                                </span>
                              </TableCell>
                              <TableCell class="text-right">
                                <template v-if="editingCell && 
                                                editingCell.categoryName === category &&
                                                editingCell.mainSection === mainSection.name &&
                                                editingCell.subsection === subsection &&
                                                editingCell.field === 'material'">
                                  <input
                                    type="number"
                                    :value="editingCell.value"
                                    @blur="saveEdit"
                                    @keyup.enter="saveEdit"
                                    @keyup.esc="cancelEdit"
                                    class="w-24 text-right px-2 py-1 border rounded"
                                    ref="inputRef"
                                    v-focus
                                  />
                                </template>
                                <span v-else @dblclick="startEditing(category, mainSection.name, subsection, 'material')">
                                  {{ formatCurrency(getCostValue(mainSection.name, subsection).material) }}
                                </span>
                              </TableCell>
                              <TableCell class="text-right font-bold">
                                {{ formatCurrency(getCostValue(mainSection.name, subsection).total) }}
                              </TableCell>
                            </TableRow>
                          </template>
                        </template>
                      </template>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { CostEstimateData } from '@/types/cost-estimate'

import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const costData = ref<CostEstimateData[]>([])
const categories = computed(() => categoriesData.map(category => category.name))
const isCollapsed = ref(false)
const selectedCategory = ref('exterior')

// Group data by category and main section
const groupedData = computed(() => {
  return costData.value.reduce((acc, curr) => {
    const category = curr.Category.toLowerCase()
    if (!acc[category]) {
      acc[category] = {}
    }
    if (!acc[category][curr['Main Section']]) {
      acc[category][curr['Main Section']] = []
    }
    acc[category][curr['Main Section']].push(curr)
    return acc
  }, {} as Record<string, Record<string, CostEstimateData[]>>)
})

onMounted(async () => {
  try {
    const response = await fetch('/CostEstimate.csv')
    const csvText = await response.text()
    
    // Parse CSV (using simple string splitting for this example)
    const rows = csvText.split('\n')
    const headers = rows[0].split(',')
    
    costData.value = rows.slice(1).map(row => {
      const values = row.split(',')
      return {
        Category: values[0],
        'Main Section': values[1],
        Subsection: values[2],
      }
    }).filter(item => item.Category) // Remove empty rows
  } catch (error) {
    console.error('Error loading CSV:', error)
  }
})

interface CostBreakdown {
  labor: number;
  material: number;
  total: number;
}

// Replace the existing calculateCosts function with this simpler version
const calculateCosts = (mainSection: string, subsection: string): CostBreakdown => {
  return {
    labor: 0,
    material: 0,
    total: 0
  };
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const selectCategory = (category: string) => {
  selectedCategory.value = category.toLowerCase()
}

interface MainSection {
  name: string;
  subsections: string[];
}

interface CategoryData {
  name: string;
  icon: string;
  mainSections: MainSection[];
}

const categoriesData: CategoryData[] = [
  {
    name: 'Exterior',
    icon: 'mdi:home-outline',
    mainSections: [
      { name: 'Roofing', subsections: ['Repairs', 'Replacement'] },
      { name: 'Siding', subsections: ['Repairs', 'Replacement'] },
      { name: 'Masonry', subsections: ['Repairs', 'Re pointing'] },
      { name: 'Landscaping', subsections: ['Installation', 'Maintenance'] },
      { name: 'Gutters and Downspouts', subsections: ['Repairs', 'Replacement'] },
      { name: 'Windows', subsections: ['Repairs', 'Replacement'] },
      { name: 'Exterior Doors', subsections: ['Repairs', 'Replacement'] },
      { name: 'Porches and Decks', subsections: ['Repairs', 'Rebuilding'] },
      { name: 'Fences', subsections: ['Repairs', 'Replacement'] },
      { name: 'Driveways and Walkways', subsections: ['Repairs', 'Resurfacing'] },
      { name: 'Exterior Painting', subsections: ['Execution'] },
      { name: 'Foundation Repairs', subsections: ['Repairs'] },
      { name: 'Garage Repairs', subsections: ['Repairs'] },
      { name: 'Chimney Repairs', subsections: ['Repairs'] }
    ]
  },
  {
    name: 'Interior',
    icon: 'mdi:sofa-outline',
    mainSections: [
      { name: 'Walls', subsections: ['Repairs', 'Painting'] },
      { name: 'Floors', subsections: ['Repairs', 'Refinishing'] },
      { name: 'Ceilings', subsections: ['Repairs', 'Painting'] },
      { name: 'Interior Doors', subsections: ['Repairs', 'Replacement'] },
      { name: 'Kitchen Cabinets', subsections: ['Repairs', 'Replacement'] },
      { name: 'Kitchen Countertops', subsections: ['Repairs', 'Replacement'] },
      { name: 'Kitchen Appliances', subsections: ['Repairs', 'Replacement'] },
      { name: 'Bathroom Cabinets', subsections: ['Repairs', 'Replacement'] },
      { name: 'Bathroom Countertops', subsections: ['Repairs', 'Replacement'] },
      { name: 'Bathroom Tiles', subsections: ['Repairs', 'Replacement'] },
      { name: 'Built-in Furniture', subsections: ['Repairs', 'Replacement'] },
      { name: 'Stairs', subsections: ['Repairs', 'Refinishing'] },
      { name: 'Insulation', subsections: ['Installation', 'Replacement'] },
      { name: 'Trim and Molding', subsections: ['Repairs', 'Replacement'] },
      { name: 'Hardware', subsections: ['Repairs', 'Replacement'] },
      { name: 'Closets', subsections: ['Repairs', 'Reorganization'] },
      { name: 'Fireplace', subsections: ['Repairs', 'Refacing'] }
    ]
  },
  {
    name: 'MEP',
    icon: 'mdi:tools',
    mainSections: [
      { name: 'Mechanical - Furnace/Boiler', subsections: ['Repairs', 'Replacement'] },
      { name: 'Mechanical - Air Conditioning Unit', subsections: ['Repairs', 'Replacement'] },
      { name: 'Mechanical - Ductwork', subsections: ['Repairs', 'Replacement'] },
      { name: 'Mechanical - Ventilation Fans', subsections: ['Repairs', 'Replacement'] },
      { name: 'Mechanical - Thermostats', subsections: ['Repairs', 'Replacement'] },
      { name: 'Electrical - Wiring', subsections: ['Repairs', 'Upgrades'] },
      { name: 'Electrical - Electrical Panel', subsections: ['Repairs', 'Replacement'] },
      { name: 'Electrical - Outlets and Switches', subsections: ['Repairs', 'Replacement'] },
      { name: 'Electrical - Lighting Fixtures', subsections: ['Repairs', 'Replacement'] },
      { name: 'Electrical - Smoke Detectors', subsections: ['Repairs', 'Replacement'] },
      { name: 'Electrical - Security Systems', subsections: ['Repairs', 'Installation'] },
      { name: 'Plumbing - Plumbing Pipes', subsections: ['Repairs', 'Replacement'] },
      { name: 'Plumbing - Water Heater', subsections: ['Repairs', 'Replacement'] },
      { name: 'Plumbing - Sump Pump', subsections: ['Repairs', 'Replacement'] },
      { name: 'Plumbing - Septic System', subsections: ['Repairs', 'Maintenance'] },
      { name: 'Plumbing - Plumbing Fixtures', subsections: ['Repairs', 'Replacement'] },
      { name: 'Plumbing - Drainage Systems', subsections: ['Repairs', 'Replacement'] }
    ]
  },
  {
    name: 'Others',
    icon: 'mdi:more',
    mainSections: [
      { name: 'Demolition and Debris Removal', subsections: ['Execution'] },
      { name: 'Permits and Fees', subsections: ['Processing'] },
      { name: 'Inspections', subsections: ['Execution'] },
      { name: 'Pest Control', subsections: ['Execution'] },
      { name: 'Fire Safety Systems', subsections: ['Installation', 'Repairs'] },
      { name: 'Accessibility Modifications', subsections: ['Installation'] },
      { name: 'Energy Efficiency Upgrades', subsections: ['Installation'] },
      { name: 'Structural Repairs', subsections: ['Repairs'] },
      { name: 'Hazardous Material Abatement', subsections: ['Removal'] },
      { name: 'Mold Remediation', subsections: ['Removal'] },
      { name: 'Miscellaneous Repairs', subsections: ['Repairs'] }
    ]
  }
];

// Update the getCategoryIcon function to use the new data structure
const getCategoryIcon = (category: string) => {
  const categoryData = categoriesData.find(c => c.name.toLowerCase() === category.toLowerCase());
  return categoryData?.icon || 'mdi:help-circle-outline';
};

// Add these new interfaces
interface EditableCell {
  categoryName: string;
  mainSection: string;
  subsection: string;
  field: 'labor' | 'material';
  value: number;
}

// Add these new refs
const editingCell = ref<EditableCell | null>(null);
const editedCosts = ref<Map<string, CostBreakdown>>(new Map());

// Add these new methods
const getCellKey = (mainSection: string, subsection: string) => {
  return `${mainSection}-${subsection}`;
};

const getCostValue = (mainSection: string, subsection: string) => {
  const key = getCellKey(mainSection, subsection);
  return editedCosts.value.get(key) || calculateCosts(mainSection, subsection);
};

const startEditing = (categoryName: string, mainSection: string, subsection: string, field: 'labor' | 'material') => {
  const costs = getCostValue(mainSection, subsection);
  editingCell.value = {
    categoryName,
    mainSection,
    subsection,
    field,
    value: costs[field]
  };
};

// Update the saveEdit function to simply sum labor and material
const saveEdit = (e: Event) => {
  if (!editingCell.value) return;
  
  const value = Number((e.target as HTMLInputElement).value);
  if (isNaN(value)) return;

  const { mainSection, subsection, field } = editingCell.value;
  const key = getCellKey(mainSection, subsection);
  const currentCosts = getCostValue(mainSection, subsection);
  
  const newCosts = {
    ...currentCosts,
    [field]: value
  };
  
  // Calculate total as simple sum of labor and material
  newCosts.total = newCosts.labor + newCosts.material;
  
  editedCosts.value.set(key, newCosts);
  editingCell.value = null;
};

const cancelEdit = () => {
  editingCell.value = null;
};
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