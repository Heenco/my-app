<template>
  <div class="flex h-screen bg-background">
    <aside :class="[
      'fixed left-0 top-0 h-full border-r bg-background transition-all duration-300 ease-in-out',
      isOpen ? 'w-1/4' : 'w-16'
    ]">
      <ScrollArea class="h-full">
        <div class="p-6">
          <div class="logo-group flex items-center space-x-2 hover:opacity-90 transition-opacity">
            <span :class="[
              'text-3xl font-black bg-gradient-to-r from-gray-400 via-orange-600 to-orange-400 bg-clip-text text-transparent tracking-tight transition-all duration-300',
              isOpen ? '' : 'scale-0 w-0 opacity-0'
            ]">
              Picky
            </span>
          </div>
          <Separator class="my-4" />
        </div>
      </ScrollArea>

      <!-- Sidebar Toggle Button -->
      <Button 
        variant="ghost" 
        size="icon" 
        class="absolute -right-3 top-6 h-8 w-8 rounded-full border shadow-md bg-background"
        @click="toggleSidebar"
      >
        <ChevronLeft v-if="isOpen" class="h-4 w-4" />
        <ChevronRight v-else class="h-4 w-4" />
      </Button>
    </aside>

    <!-- Main Content -->
    <main :class="[
      'min-h-screen p-8 transition-all duration-300 ease-in-out',
      isOpen ? 'ml-[25%] w-3/4' : 'ml-16 w-[calc(100%-4rem)]'
    ]">
      <div class="max-w-[1200px] mx-auto">
        <!-- New Property Details Section -->
        <Card class="mb-8">
          <CardHeader>
            <CardTitle class="text-2xl font-semibold">{{ address || 'Property Details' }}</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="propertyDetails" class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="(value, key) in propertyDetails" :key="key" class="space-y-1">
                <p class="text-sm font-medium text-muted-foreground">
                  {{ formatKey(key) }}
                </p>
                <p class="text-sm">{{ value }}</p>
              </div>
            </div>
            <div v-else class="text-muted-foreground text-sm">
              No property details available
            </div>
          </CardContent>
        </Card>

        <h1 class="text-2xl font-semibold text-foreground mb-8">
          Property Analysis Report
        </h1>

        <Card class="mb-8">
          <CardHeader>
            <CardTitle>Analysis Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Factor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow 
                  v-for="factor in factors" 
                  :key="factor.id"
                  class="cursor-pointer hover:bg-muted/50"
                  @click="scrollToSection(factor.id)"
                >
                  <TableCell>{{ factor.name }}</TableCell>
                  <TableCell>{{ factor.status }}</TableCell>
                  <TableCell>
                    <Badge :variant="factor.risk">{{ factor.risk }}</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div class="space-y-8">
          <Card v-for="factor in factors" :key="factor.id" :id="factor.id">
            <CardHeader>
              <CardTitle>{{ factor.name }}</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="grid gap-4">
                <div class="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div>
                    <p class="font-medium">Status</p>
                    <p class="text-sm text-muted-foreground">{{ factor.status }}</p>
                  </div>
                  <Badge :variant="factor.risk">{{ factor.risk }}</Badge>
                </div>
                
                <p class="text-sm text-muted-foreground">
                  {{ factor.description }}
                </p>

                <div v-if="factor.map" class="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  GIS Map for {{ factor.name }}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const isOpen = ref(true)
const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const { getPropertyFactors } = usePropertyReport()
const factors = getPropertyFactors()

const scrollToSection = (id) => {
  const element = document.getElementById(id)
  element?.scrollIntoView({ behavior: 'smooth' })
}

const { propertyDetails, address } = usePropertyDetails()

// Add this helper function
const formatKey = (key) => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
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
</style>