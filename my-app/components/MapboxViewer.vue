<template>
  <div class="relative h-full w-full">
    <div ref="mapContainer" class="h-full w-full"></div>
    <div class="absolute top-0 right-0 h-1/2 w-1/3 bg-white bg-opacity-95 text-gray-900 p-4 m-4 rounded-lg shadow-lg overflow-y-auto">
      <Tabs default-value="layers" class="w-full">
        <TabsList class="grid w-full grid-cols-4">
          <TabsTrigger value="layers">Layers</TabsTrigger>
          <TabsTrigger value="census">Census</TabsTrigger>
          <TabsTrigger value="access">Access</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>
        <TabsContent value="layers">
          <h2 class="text-xl font-bold mb-4">Layer Controls</h2>
          <div class="space-y-4">
            <div class="flex items-center space-x-2">
              <Switch v-model="enabled" />
              <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Land Zoning Layer
              </label>
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
          <h2 class="text-xl font-bold mb-4">Accessibility Analysis</h2>
          <div class="space-y-4">
            <div class="text-sm">
              <p class="mb-2">Configure travel settings:</p>
              <!-- Update this div to use grid -->
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

              <!-- Existing accessibility switches -->
              <p class="mb-2 mt-4">Select features to analyze accessibility:</p>
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

const mapContainer = ref(null)
const enabled = ref(false)
const lotEnabled = ref(false)
const propertyEnabled = ref(false)
const popup = ref(null)
const selectedLotCensus = ref(null)
const accessOptions = ref({
  publicTransport: false,
  schools: false,
  healthcare: false
})
const travelMode = ref('walking')
const travelTime = ref('5')
const selectedPropertyDetails = ref(null)
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
    center: [150.9631, -33.8136],
    zoom: 12
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
        'visibility': 'none'
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
        'circle-radius': 4,
        'circle-opacity': 0.8,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff'
      },
      'layout': {
        'visibility': 'none'
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

    // Add click handler for property layer
    map.on('click', 'property-layer', (e) => {
      if (e.features.length > 0) {
        const feature = e.features[0]
        const coordinates = e.lngLat
        const properties = feature.properties
        
        // Update the planning insights panel
        selectedPropertyDetails.value = properties

        // Create popup content
        const content = `
          <div class="p-2">
            <h3 class="font-bold mb-2">Property Details</h3>
            <div class="space-y-1">
              ${Object.entries(properties)
                .slice(0, 5) // Show only first 5 properties in popup
                .map(([key, value]) => `
                  <p><span class="font-semibold">${formatKey(key)}:</span> ${value || 'N/A'}</p>
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

  // Add search control
  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: 'Search for a location',
    marker: true
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
  if (!map) return
  
  // Get coordinates from map center
  const center = map.getCenter()
  
  try {
    const query = await fetch(
      `https://api.mapbox.com/isochrone/v1/mapbox/${travelMode.value}/${center.lng},${center.lat}?contours_minutes=${travelTime.value}&polygons=true&access_token=${mapboxgl.accessToken}`
    )
    const data = await query.json()

    // Remove existing isochrone layer and source if they exist
    if (map.getLayer('isochrone')) map.removeLayer('isochrone')
    if (map.getSource('isochrone')) map.removeSource('isochrone')

    // Add the new isochrone source and layer
    map.addSource('isochrone', {
      type: 'geojson',
      data: data
    })

    map.addLayer({
      'id': 'isochrone',
      'type': 'fill',
      'source': 'isochrone',
      'layout': {},
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
  updateIsochrone()
}, { immediate: false })
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
</style>