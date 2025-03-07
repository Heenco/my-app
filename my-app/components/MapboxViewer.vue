<template>
  <div class="relative h-full w-full">
    <div ref="mapContainer" class="h-full w-full"></div>
    <div class="absolute top-0 right-0 h-1/2 w-1/3 bg-white bg-opacity-95 text-gray-900 p-4 m-4 rounded-lg shadow-lg overflow-y-auto">
      <!-- Replace the existing address banner div -->
      <div v-if="selectedPropertyAddress" class="mb-4 p-4 bg-while-50 rounded-lg border-black-200 shadow-sm">
        <h3 class="text-small font-semibold text-black-100 leading-tight camelcase">
          <span class="mr-2"></span>{{ selectedPropertyAddress }}
        </h3>
        <!-- Add LGA name display -->
        <p class="text-xs text-gray-500 mt-1">
          {{ selectedPropertyDetails?.lga_name || 'LGA not available' }}
        </p>
      </div>
      
      <Tabs default-value="layers" class="w-full" @update:value="activeTab = $event">
        <TabsList class="grid w-full grid-cols-4">
          <TabsTrigger value="layers">Layers</TabsTrigger>
          <TabsTrigger value="census">Census</TabsTrigger>
          <TabsTrigger value="access">Access</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>
        <TabsContent value="layers">
          <h2 class="text-xl font-bold mb-4">Layer Controls</h2>
          <div class="space-y-4">
            <div class="flex items-center">
              <div class="flex items-center space-x-2">
                <Switch v-model="enabled" />
                <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Land Zoning Layer
                </label>
                <span v-if="selectedPropertyDetails?.lzn_label" class="text-xs text-gray-500 ml-2">
                  ({{ selectedPropertyDetails.lzn_label }})
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <Switch v-model="lotEnabled" />
              <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Lot Layer
              </label>
            </div>
            <div class="flex items-center space-x-2">
              <Switch v-model="propertyEnabled" />
              <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Property Layer
              </label>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="census">
          <h2 class="text-xl font-bold mb-4">Census Information</h2>
          <div class="space-y-4">
            <div class="text-sm">
              <p class="mb-2">Census data will appear here when a lot is selected.</p>
              <div v-if="selectedLotCensus" class="space-y-2">
                <!-- Census data will be populated here -->
                <div v-for="(value, key) in selectedLotCensus" :key="key" class="border-b pb-2">
                  <span class="font-semibold">{{ key }}:</span> {{ value }}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="access">

          <div class="space-y-4">
            <div class="text-sm">
              <Accordion type="single" collapsible defaultValue="travel-settings">
                <AccordionItem value="travel-settings">
                  <AccordionTrigger>Travel Time</AccordionTrigger>
                  <AccordionContent>
                    <!-- Isochrone switch -->
                    <div class="flex items-center space-x-2 mb-4">
                      <Switch v-model="isochroneEnabled" />
                      <label class="text-sm font-medium leading-none">
                        Show Travel Time Coverage
                      </label>
                    </div>

                    
                    <!-- Travel settings grid -->
                    <div class="grid grid-cols-2 gap-4">
                      <!-- Travel Mode Select -->
                      <div class="space-y-2">
                        <label class="text-sm font-medium leading-none">Travel Mode</label>
                        <Select v-model="travelMode">
                          <SelectTrigger class="w-full">
                            <SelectValue placeholder="Select travel mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="walking">Walking</SelectItem>
                            <SelectItem value="cycling">Cycling</SelectItem>
                            <SelectItem value="driving">Driving</SelectItem>
                            <SelectItem value="driving-traffic">Public Transport</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <!-- Travel Time Select -->
                      <div class="space-y-2">
                        <label class="text-sm font-medium leading-none">Travel Time (minutes)</label>
                        <Select v-model="travelTime">
                          <SelectTrigger class="w-full">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="10">10 minutes</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="accessibility-features">
                  <AccordionTrigger>Accessibility Features</AccordionTrigger>
                  <AccordionContent>
                    <p class="mb-2">Select features to analyze accessibility:</p>
                    <div class="space-y-2">
                      <div class="flex items-center space-x-2">
                        <Switch v-model="accessOptions.publicTransport" />
                        <label class="text-sm font-medium leading-none">
                          Public Transport
                        </label>
                      </div>
                      <div class="flex items-center space-x-2">
                        <Switch v-model="accessOptions.schools" />
                        <label class="text-sm font-medium leading-none">
                          Schools
                        </label>
                      </div>
                      <div class="flex items-center space-x-2">
                        <Switch v-model="accessOptions.healthcare" />
                        <label class="text-sm font-medium leading-none">
                          Healthcare
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="planning">
          <h2 class="text-xl font-bold mb-4">Planning Insights</h2>
          <div class="space-y-4">
            <div class="text-sm">
              <p class="mb-2">Click on a property to view planning details.</p>
              <div v-if="selectedPropertyDetails" class="space-y-2">
                <div class="grid grid-cols-2 gap-4">
                  <div v-for="(value, key) in selectedPropertyDetails" :key="key" class="border-b pb-2">
                    <span class="font-semibold">{{ formatKey(key) }}:</span>
                    <span class="ml-1">{{ value || 'N/A' }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="text-gray-500 italic">
                No property selected
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent 
} from '@/components/ui/accordion'

const mapContainer = ref(null)
const enabled = ref(false)
const lotEnabled = ref(false)
const propertyEnabled = ref(true)
const popup = ref(null)
const selectedLotCensus = ref(null)
const accessOptions = ref({
  publicTransport: false,
  schools: false,
  healthcare: false
})
const travelMode = ref('walking')  // Make sure this is set to 'walking'
const travelTime = ref('5')        // Make sure this is set to '5'
const selectedPropertyDetails = ref(null)
const selectedPropertyAddress = ref(null)
const selectedPropertyCoords = ref(null)
const activeTab = ref('access')
const isochroneEnabled = ref(false)
let map = null

const formatKey = (key) => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

onMounted(() => {
  mapboxgl.accessToken = 'pk.eyJ1Ijoia2hlcmFkbWFuZGkiLCJhIjoiY2l4aXF5Ym5lMDAwbzJ6cHA0cWw4OWRkNyJ9.pbe17ldY9KRsNZQRwfkRFA'

  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [151.1093, -33.8688], // Sydney CBD coordinates
    zoom: 16  // Higher zoom level to show property points immediately
  })

  map.on('load', () => {
    // Add the LZN source and layer first (bottom layer)
    map.addSource('lzn-source', {
      type: 'vector',
      tiles: ['http://172.105.184.178:3000/LZN/{z}/{x}/{y}']
    })

    map.addLayer({
      'id': 'lzn-layer',
      'type': 'fill',
      'source': 'lzn-source',
      'source-layer': 'LZN',
      'paint': {
        'fill-color': '#b0b0b0',
        'fill-opacity': 0.3
      },
      'layout': {
        'visibility': 'none'
      }
    })

    // Add the Lot source and layer second (top layer)
    map.addSource('lot-source', {
      type: 'vector',
      tiles: ['http://172.105.184.178:3000/Lot/{z}/{x}/{y}']
    })

    map.addLayer({
      'id': 'lot-layer',
      'type': 'fill', // Change to circle for point data
      'source': 'lot-source',
      'source-layer': 'Lot',
      'paint': {
       'fill-color': '#ff0000',
       'fill-opacity': 0.3
      },
      'layout': {
        'visibility': 'none'
      }
    })

    // Add the Property source and layers
    map.addSource('property-source', {
      type: 'vector',
      tiles: ['http://172.105.184.178:3000/UP_Property/{z}/{x}/{y}']
    })

    // Replace the hexbin layer with a heatmap layer
    map.addLayer({
      'id': 'property-heatmap-layer',
      'type': 'heatmap',
      'source': 'property-source',
      'source-layer': 'UP_Property',
      'maxzoom': 14,
      'paint': {
        'heatmap-weight': 1,
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          14, 3
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(187,0,187,0)',
          0.2, 'rgba(187,0,187,0.2)',
          0.4, 'rgba(187,0,187,0.4)',
          0.6, 'rgba(187,0,187,0.6)',
          0.8, 'rgba(187,0,187,0.8)',
          1, 'rgba(187,0,187,1)'
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 2,
          14, 20
        ],
        'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10, 0.8,
          14, 0
        ]
      },
      'layout': {
        'visibility': 'visible'  // Changed from 'none' to 'visible'
      }
    })

    // Add circle layer for zoomed in view
    map.addLayer({
      'id': 'property-layer',
      'type': 'circle',
      'source': 'property-source',
      'source-layer': 'UP_Property',
      'minzoom': 14,  // Only show points when zoomed in beyond level 14
      'paint': {
        'circle-color': '#bb00bb',
        'circle-radius': 3,
        'circle-opacity': 0.8,
        'circle-stroke-width': 0,
        'circle-stroke-color': '#ffffff'
      },
      'layout': {
        'visibility': 'visible'  // Changed from 'none' to 'visible'
      }
    })

    // Add click event handler for lot layer
    map.on('click', 'lot-layer', (e) => {
      if (e.features.length > 0) {
        const feature = e.features[0]
        const coordinates = e.lngLat
        
        // Update census data
        selectedLotCensus.value = {
          population: feature.properties.population || 'N/A',
          households: feature.properties.households || 'N/A',
          medianIncome: feature.properties.median_income || 'N/A',
          // Add more census fields as needed
        }

        // Create popup content from feature properties
        const properties = feature.properties
        const content = `
          <div class="p-2">
            <h3 class="font-bold mb-2">Lot Details</h3>
            <div class="space-y-1">
              ${Object.entries(properties)
                .map(([key, value]) => `
                  <p><span class="font-semibold">${key}:</span> ${value}</p>
                `).join('')}
            </div>
          </div>
        `

        // Remove existing popup if any
        if (popup.value) popup.value.remove()

        // Create and set new popup
        popup.value = new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(content)
          .addTo(map)
      }
    })

    // Modify the property click handler
    map.on('click', 'property-layer', (e) => {
      if (e.features.length > 0) {
        const feature = e.features[0]
        const coordinates = e.lngLat
        const properties = feature.properties
        
        selectedPropertyCoords.value = coordinates
        selectedPropertyDetails.value = properties
        selectedPropertyAddress.value = properties.address || 'Address not available'

        // Switch to access tab immediately when property is clicked
        activeTab.value = 'access'
        
        // Set default values and create isochrone
        travelMode.value = 'walking'
        travelTime.value = '5'
        updateIsochrone()

        // Rest of the popup creation code...
        const content = `
          <div class="p-2">
            <h3 class="font-bold mb-2">Property Details</h3>
            <div class="space-y-1">
              ${Object.entries(properties)
                .slice(0, 2) // Show only first 2 properties in popup
                .map(([key, value]) => `
                  <p><span class="font-semibold">${formatKey(key)}:</span> ${value || 'N/A'}</p>
                `).join('')}
            </div>
          </div>
        `

        if (popup.value) popup.value.remove()
        popup.value = new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(content)
          .addTo(map)
      }
    })

    // Change cursor to pointer when hovering over lots
    map.on('mouseenter', 'lot-layer', () => {
      map.getCanvas().style.cursor = 'pointer'
    })

    map.on('mouseleave', 'lot-layer', () => {
      map.getCanvas().style.cursor = ''
    })

    // Add hover effects for property layer
    map.on('mouseenter', 'property-layer', () => {
      map.getCanvas().style.cursor = 'pointer'
    })

    map.on('mouseleave', 'property-layer', () => {
      map.getCanvas().style.cursor = ''
    })
  })

  // Update the geocoder configuration in the onMounted section
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: 'Search for an address',
    marker: false, // Disable default marker
    zoom: 18, // Set a higher zoom level for better property visibility
  })

  // Replace the existing geocoder.on('result') handler
  geocoder.on('result', (event) => {
    const searchedAddress = event.result.place_name
    const searchedCoords = event.result.center
    
    // Fly to the location first
    map.flyTo({
      center: searchedCoords,
      zoom: 18,
      essential: true,
    })
    
    // Wait for the map movement to complete and tiles to load
    map.once('moveend', () => {
      setTimeout(() => {
        // Query all visible properties in the viewport
        const features = map.queryRenderedFeatures({
          layers: ['property-layer']
        })

        // Find the closest property to the searched coordinates
        if (features.length > 0) {
          const closestProperty = features.reduce((prev, curr) => {
            const prevDist = Math.hypot(
              prev.geometry.coordinates[0] - searchedCoords[0],
              prev.geometry.coordinates[1] - searchedCoords[1]
            )
            const currDist = Math.hypot(
              curr.geometry.coordinates[0] - searchedCoords[0],
              curr.geometry.coordinates[1] - searchedCoords[1]
            )
            return currDist < prevDist ? curr : prev
          })

          const properties = closestProperty.properties
          const coordinates = closestProperty.geometry.coordinates

          // Update all property-related state
          selectedPropertyDetails.value = properties
          selectedPropertyAddress.value = properties.address || 'Address not available'
          selectedPropertyCoords.value = {
            lng: coordinates[0],
            lat: coordinates[1]
          }

          // Create popup with property details
          if (popup.value) popup.value.remove()
          popup.value = new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold mb-2">Property Details</h3>
                <div class="space-y-1">
                  ${Object.entries(properties)
                    .slice(0, 2)
                    .map(([key, value]) => `
                      <p><span class="font-semibold">${formatKey(key)}:</span> ${value || 'N/A'}</p>
                    `).join('')}
                </div>
              </div>
            `)
            .addTo(map)

          // Switch to access tab and update travel analysis
          activeTab.value = 'access'
          
          // Initialize travel analysis if enabled
          if (isochroneEnabled.value) {
            updateIsochrone()
          }
        }
      }, 500) // Reduced timeout since we're querying all visible features
    })
  })
  
  map.addControl(geocoder, 'top-left')
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-left')
})

// Watch for changes in the switch state
watch(enabled, (newValue) => {
  if (map && map.getLayer('lzn-layer')) {
    const visibility = newValue ? 'visible' : 'none'
    map.setLayoutProperty('lzn-layer', 'visibility', visibility)
  }
})

watch(lotEnabled, (newValue) => {
  if (map && map.getLayer('lot-layer')) {
    const visibility = newValue ? 'visible' : 'none'
    map.setLayoutProperty('lot-layer', 'visibility', visibility)
  }
})

// Add watcher for property layer visibility
watch(propertyEnabled, (newValue) => {
  if (map) {
    const visibility = newValue ? 'visible' : 'none'
    if (map.getLayer('property-layer')) {
      map.setLayoutProperty('property-layer', 'visibility', visibility)
    }
    if (map.getLayer('property-heatmap-layer')) {
      map.setLayoutProperty('property-heatmap-layer', 'visibility', visibility)
    }
  }
  if (!newValue) {
    selectedPropertyDetails.value = null
    selectedPropertyAddress.value = null
    selectedPropertyCoords.value = null
    if (map) {
      if (map.getLayer('isochrone')) map.removeLayer('isochrone')
      if (map.getSource('isochrone')) map.removeSource('isochrone')
    }
  }
})

// Watch for changes in the access options
watch(accessOptions, (newValue) => {
  // Handle accessibility layer visibility changes
  Object.entries(newValue).forEach(([key, enabled]) => {
    const layerId = `${key}-layer`
    if (map && map.getLayer(layerId)) {
      const visibility = enabled ? 'visible' : 'none'
      map.setLayoutProperty(layerId, 'visibility', visibility)
    }
  })
}, { deep: true })

// Add function to fetch and display isochrone
const updateIsochrone = async () => {
  // Always remove existing isochrone first
  if (map.getLayer('isochrone')) {
    map.removeLayer('isochrone')
  }
  if (map.getSource('isochrone')) {
    map.removeSource('isochrone')
  }

  // Only proceed if we're on access tab and isochrone is enabled
  if (!map || !selectedPropertyCoords.value || 
      activeTab.value !== 'access' || !isochroneEnabled.value) {
    return
  }
  
  try {
    const query = await fetch(
      `https://api.mapbox.com/isochrone/v1/mapbox/${travelMode.value}/${selectedPropertyCoords.value.lng},${selectedPropertyCoords.value.lat}?contours_minutes=${travelTime.value}&polygons=true&access_token=${mapboxgl.accessToken}`
    )
    const data = await query.json()

    map.addSource('isochrone', {
      type: 'geojson',
      data: data
    })

    map.addLayer({
      'id': 'isochrone',
      'type': 'fill',
      'source': 'isochrone',
      'layout': {
        'visibility': 'visible'
      },
      'paint': {
        'fill-color': '#5a3fc0',
        'fill-opacity': 0.3,
        'fill-outline-color': '#2a1b6d'
      }
    })
  } catch (error) {
    console.error('Error fetching isochrone:', error)
  }
}

// Watch for changes in travel settings
watch([travelMode, travelTime], () => {
  if (activeTab.value === 'access') {
    updateIsochrone()
  }
})

// Update the activeTab watcher
watch(activeTab, (newValue) => {
  if (!map) return
  
  // Remove isochrone when switching to any tab other than access
  if (newValue !== 'access') {
    // Ensure both layer and source are removed
    if (map.getLayer('isochrone')) {
      map.removeLayer('isochrone')
    }
    if (map.getSource('isochrone')) {
      map.removeSource('isochrone')
    }
  } else if (selectedPropertyCoords.value) {
    // Only create isochrone when switching to access tab and we have coordinates
    travelMode.value = 'walking'
    travelTime.value = '5'
    updateIsochrone()
  }
})

// Add this with other watch statements in the script setup section
watch(isochroneEnabled, (newValue) => {
  if (!map || !selectedPropertyCoords.value) return
  
  if (newValue) {
    updateIsochrone()
  } else {
    // Remove isochrone when switch is turned off
    if (map.getLayer('isochrone')) {
      map.removeLayer('isochrone')
    }
    if (map.getSource('isochrone')) {
      map.removeSource('isochrone')
    }
  }
})
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

/* Customize geocoder appearance */
.mapboxgl-ctrl-geocoder {
  min-width: 300px;
  font-family: inherit;
}

/* Add scrollbar styling for the card */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(246, 242, 242, 0.3) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

/* Add custom styles for the popup */
.mapboxgl-popup {
  max-width: 400px;
}

.mapboxgl-popup-content {
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Add some tab-specific styles */
.tabs-content {
  padding-top: 1rem;
}

/* Add some styling for the planning insights panel */
.grid-cols-2 > div {
  @apply overflow-hidden text-ellipsis;
}

.grid-cols-2 > div span {
  @apply text-sm;
}

/* Add styles for address banner */
.bg-purple-100 {
  background-color: #f3e8ff;
}

.text-purple-900 {
  color: #581c87;
}

/* Updated address banner styles */
.bg-purple-50 {
  background-color: #faf5ff;
}

.text-purple-600 {
  color: #9333ea;
}

.border-purple-200 {
  border-color: #e9d5ff;
}

/* Add smooth transition for address banner */
[v-if] {
  transition: all 0.2s ease-in-out;
}
</style>