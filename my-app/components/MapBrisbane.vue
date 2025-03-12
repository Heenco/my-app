<template>
  <div class="relative h-full w-full">
    <div ref="mapContainer" class="h-full w-full"></div>
    <div class="absolute top-0 right-0 h-1/2 w-1/3 bg-white bg-opacity-95 text-gray-900 p-4 m-4 rounded-lg shadow-lg overflow-y-auto">
      <!-- Updated address banner div with link -->
      <div v-if="selectedPropertyAddress" class="mb-4 p-4 bg-while-50 rounded-lg border-black-200 shadow-sm">
        <h3 class="text-small font-semibold text-black-100 leading-tight">
          <NuxtLink 
            :to="`/property-report#${encodeURIComponent(selectedPropertyAddress)}`"
            class="hover:text-orange-600 transition-colors duration-200"
          >
            <span class="mr-2"></span>{{ selectedPropertyAddress }}
          </NuxtLink>
        </h3>
      </div>
      
      <Tabs default-value="hazard" class="w-full" @update:value="activeTab = $event">
        <TabsList class="grid w-full grid-cols-4">
          <TabsTrigger value="hazard">Hazard</TabsTrigger>
          <TabsTrigger value="census">Census</TabsTrigger>
          <TabsTrigger value="access">Access</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>
        <TabsContent value="hazard">
          <h2 class="text-xl font-bold mb-4">Hazard Analysis</h2>
          <div class="space-y-4">
            <div class="flex items-center">
              <div class="flex items-center space-x-2">
                <Switch v-model="floodEnabled" />
                <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Flood Hazard
                </label>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <Switch v-model="bushfireEnabled" />
              <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Bushfire Hazard
              </label>
            </div>
            <div class="flex items-center space-x-2">
              <Switch v-model="noiseEnabled" />
              <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Noise Corridor
              </label>
            </div>
            <!--
            <div class="flex items-center space-x-2">
              <Switch v-model="propertyEnabled" />
              <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Storm Tide Hazard
              </label>
            </div>
            -->

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

import { useRouter, useRoute } from 'vue-router'

// Add router instance
const router = useRouter()
const route = useRoute()

const mapContainer = ref(null)
const floodEnabled = ref(false)
const bushfireEnabled = ref(false)  // Rename from lotEnabled
const propertyEnabled = ref(true)
const noiseEnabled = ref(false)  // Add this line
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
const selectedBuffer = ref(null) // Add this line
const isMapLoaded = ref(false) // Add loading state
let map = null

const formatKey = (key) => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

onMounted(() => {
  mapboxgl.accessToken = 'pk.eyJ1Ijoia2hlcmFkbWFuZGkiLCJhIjoiY2l4aXF5Ym5lMDAwbzJ6cHA0cWw4OWRkNyJ9.pbe17ldY9KRsNZQRwfkRFA'

  // Get coordinates and zoom from URL parameters
  const initialCenter = [
    parseFloat(route.query.lng) || 153.0251,
    parseFloat(route.query.lat) || -27.4698
  ]
  const initialZoom = parseFloat(route.query.zoom) || 9

  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/dark-v11', // Changed to light style
    center: initialCenter,
    zoom: initialZoom
  })

  map.on('load', () => {
    // Initialize loading state
    isMapLoaded.value = true


    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Search for an address',
      marker: false,
      zoom: 18,
      bbox: [152.7, -27.7, 153.3, -27.0], // Brisbane bounds
      countries: 'au',
      types: 'address',
      className: 'map-geocoder'
    })

    // Add geocoder result handler after map is loaded
    geocoder.on('result', async (event) => {
      if (!isMapLoaded.value) return
      
      const searchedAddress = event.result.place_name
      const searchedCoords = event.result.center

      // Update URL parameters
      await router.replace({
        query: {
          lng: searchedCoords[0].toFixed(6),
          lat: searchedCoords[1].toFixed(6),
          zoom: 18,
          address: searchedAddress
        }
      })

      // Ensure map is ready before flying
      if (map && map.loaded()) {
        map.flyTo({
          center: searchedCoords,
          zoom: 18,
          essential: true,
        })

        // Wait for the flyTo animation to complete
        map.once('moveend', () => {
          // Add small delay to ensure data is loaded
          setTimeout(() => {
            selectPropertyAtCoordinates(searchedCoords)
          }, 300)
        })
      }
    })

    // Add geocoder control after setting up handlers
    

    // Replace LZN source and layer with ArcGIS Feature Service
    map.addSource('flood-source', {
      type: 'geojson',
      data: 'https://services2.arcgis.com/dEKgZETqwmDAh1rP/arcgis/rest/services/Flood_Awareness_Flood_Risk_Overall/FeatureServer/0/query?where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=2000&f=geojson',
      maxzoom: 22
    })

    map.addLayer({
      'id': 'flood-layer',
      'type': 'fill',
      'source': 'flood-source',
      'paint': {
        'fill-color': [
          'match',
          ['get', 'FLOOD_RISK'],
          'High', '#005FA5',
          'Medium', '#00ABE3',
          'Low', '#00ABE3',
          'Very Low', '#9ADBF9',
          'rgba(0,0,0,0)' // Changed default to transparent
        ],
        'fill-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10, 0.7,
          15, 0.8
        ],
        'fill-outline-color': [
          'match',
          ['get', 'RISK_LEVEL'],
          'High', '#004B84',
          'Medium', '#0089B6',
          'Low', '#0089B6',
          'Very Low', '#78AFC7',
          '#000000'
        ]
      },
      'layout': {
        'visibility': 'none'
      }
    })

    // Add bushfire source and layer
    map.addSource('bushfire-source', {
      type: 'geojson',
      data: 'https://services2.arcgis.com/dEKgZETqwmDAh1rP/arcgis/rest/services/Bushfire_overlay/FeatureServer/0/query?where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=2000&f=geojson',
      maxzoom: 22
    })

    map.addLayer({
      'id': 'bushfire-layer',
      'type': 'fill',
      'source': 'bushfire-source',
      'paint': {
        'fill-color': '#FF0000',
        'fill-opacity': 0.6,
        'fill-outline-color': '#FF0000'
      },
      'layout': {
        'visibility': 'none'
      }
    })

    // Replace the Property source to use GeoJSON with pagination
    map.addSource('property-source', {
      type: 'geojson',
      data: 'https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Basemaps/FoundationData/FeatureServer/0/query?where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=2000&f=geojson',
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
      maxzoom: 22
    })

    // Update property layer for better performance




    map.addLayer({
      'id': 'property-layer',
      'type': 'circle',
      'source': 'property-source',
      'filter': ['!', ['has', 'point_count']],
      'paint': {
        'circle-color': '#bb00bb',
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          12, 2,
          22, 8
        ],
        'circle-opacity': 0.8
      }
    })

    // Add viewport-based data loading for both property and lot layers
    map.on('moveend', () => {
      const bounds = map.getBounds()
      const bbox = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth()
      ].join(',')
      
      // Update property data
      fetch(`https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Basemaps/FoundationData/FeatureServer/0/query?where=1%3D1&outFields=*&geometry=${bbox}&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&resultRecordCount=2000&f=geojson`)
        .then(response => response.json())
        .then(data => {
          const source = map.getSource('property-source')
          if (source) {
            source.setData(data)
          }
        })
        .catch(error => console.error('Error loading property data:', error))

      // Add LZN data fetch
      if (floodEnabled.value) {  // Only fetch flood data if layer is visible
        fetch(`https://services2.arcgis.com/dEKgZETqwmDAh1rP/arcgis/rest/services/Flood_Awareness_Flood_Risk_Overall/FeatureServer/0/query?where=1%3D1&outFields=*&geometry=${bbox}&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&resultRecordCount=2000&f=geojson`)
          .then(response => response.json())
          .then(data => {
            const source = map.getSource('flood-source')
            if (source) {
              source.setData(data)
            }
          })
          .catch(error => console.error('Error loading flood data:', error))
      }

      // Update bushfire data
      if (bushfireEnabled.value) {
        fetch(`https://services2.arcgis.com/dEKgZETqwmDAh1rP/arcgis/rest/services/Bushfire_overlay/FeatureServer/0/query?where=1%3D1&outFields=*&geometry=${bbox}&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&resultRecordCount=2000&f=geojson`)
          .then(response => response.json())
          .then(data => {
            const source = map.getSource('bushfire-source')
            if (source) {
              source.setData(data)
            }
          })
          .catch(error => console.error('Error loading bushfire data:', error))
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
        const coordinates = feature.geometry.coordinates
        const properties = feature.properties

        // Update buffer
        updateSelectedBuffer(coordinates)
        
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

    map.addSource('noise-source', {
      type: 'geojson',
      data: 'https://services2.arcgis.com/dEKgZETqwmDAh1rP/arcgis/rest/services/Transport_noise_corridor_overlay/FeatureServer/0/query?where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=2000&f=geojson',
      maxzoom: 22
    })

    map.addLayer({
      'id': 'noise-layer',
      'type': 'fill',
      'source': 'noise-source',
      'paint': {
        'fill-color': '#FFA500',
        'fill-opacity': 0.6,
        'fill-outline-color': '#FF8C00'
      },
      'layout': {
        'visibility': 'none'
      }
    })

    // Add handler to select property after initial load if coordinates are in URL
    if (route.query.lng && route.query.lat) {
      const searchedCoords = [
        parseFloat(route.query.lng),
        parseFloat(route.query.lat)
      ]
      
      // Wait for map and data to be fully loaded
      map.once('idle', () => {
        // Fly to the location with animation
        map.flyTo({
          center: searchedCoords,
          zoom: 18,
          essential: true,
        })

        // Wait for the flyTo animation to complete
        map.once('moveend', () => {
          setTimeout(() => {
            // Use the same bounding box logic as the search
            const bounds = [
              [searchedCoords[0] - 0.0001, searchedCoords[1] - 0.0001],
              [searchedCoords[0] + 0.0001, searchedCoords[1] + 0.0001]
            ]
            
            const features = map.queryRenderedFeatures(
              [
                map.project([bounds[0][0], bounds[0][1]]),
                map.project([bounds[1][0], bounds[1][1]])
              ],
              { layers: ['property-layer'] }
            )

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

              // Update property details
              selectedPropertyDetails.value = properties
              selectedPropertyAddress.value = properties.address || 'Address not available'
              selectedPropertyCoords.value = {
                lng: coordinates[0],
                lat: coordinates[1]
              }

              // Create popup with closeOnClick: false to match search behavior
              if (popup.value) popup.value.remove()
              popup.value = new mapboxgl.Popup({ closeOnClick: false })
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

              // Switch to access tab and initialize travel analysis
              activeTab.value = 'access'
              if (isochroneEnabled.value) {
                updateIsochrone()
              }
            }
          }, 300) // Use same timeout as search handler
        })
      })
    }

    // Set map loaded state
    isMapLoaded.value = true

    // Check URL parameters after map is loaded
    const lng = parseFloat(route.query.lng)
    const lat = parseFloat(route.query.lat)
    
    if (lng && lat) {
      const searchedCoords = [lng, lat]
      map.flyTo({
        center: searchedCoords,
        zoom: parseFloat(route.query.zoom) || 18,
        essential: true,
      })

      // Wait for the map to finish moving and data to load
      map.once('moveend', () => {
        // Add a small delay to ensure data is loaded
        setTimeout(() => {
          selectPropertyAtCoordinates(searchedCoords)
        }, 1000)
      })
    }
  })

  // Update the geocoder configuration and result handler
 

  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: 'Search for an address',
    marker: false,
    className: 'map-geocoder'
  })


  geocoder.on('result', (event) => {
    const searchedAddress = event.result.place_name
    const searchedCoords = event.result.center
    
    // Update URL with zoom 18
    router.replace({
      query: {
        lng: searchedCoords[0].toFixed(6),
        lat: searchedCoords[1].toFixed(6),
        zoom: '18.00',
        address: searchedAddress
      }
    })

    // Fly to location with zoom 18
    map.flyTo({
      center: searchedCoords,
      zoom: 18,
      essential: true,
    })

    // Wait for the map movement to complete
    map.once('moveend', () => {
      setTimeout(() => {
        selectPropertyAtCoordinates(searchedCoords)
      }, 300)
    })
  })

  map.addControl(geocoder, 'top-left')

  
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-left')

  // Add map move handler to update URL
  map.on('moveend', () => {
    const center = map.getCenter()
    const zoom = map.getZoom()
    
    router.replace({
      query: {
        ...router.currentRoute.value.query,
        lng: center.lng.toFixed(6),
        lat: center.lat.toFixed(6),
        zoom: zoom.toFixed(2)
      }
    })
  })
})

// Watch for changes in the switch state
watch(floodEnabled, (newValue) => {
  if (map && map.getLayer('flood-layer')) {
    const visibility = newValue ? 'visible' : 'none'
    map.setLayoutProperty('flood-layer', 'visibility', visibility)
  }
})

// Replace the lot layer watch handler with bushfire handler
watch(bushfireEnabled, (newValue) => {
  if (map && map.getLayer('bushfire-layer')) {
    const visibility = newValue ? 'visible' : 'none'
    map.setLayoutProperty('bushfire-layer', 'visibility', visibility)
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
  // Remove buffer
  if (map) {
    if (map.getLayer('selected-buffer')) {
      map.removeLayer('selected-buffer')
    }
    if (map.getSource('selected-buffer')) {
      map.removeSource('selected-buffer')
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

watch(noiseEnabled, (newValue) => {
  if (map && map.getLayer('noise-layer')) {
    const visibility = newValue ? 'visible' : 'none'
    map.setLayoutProperty('noise-layer', 'visibility', visibility)
  }
})

// Add this function after other function declarations
const updateSelectedBuffer = (coordinates) => {
  if (!map) return

  // Remove existing buffer layers if any
  ['selected-buffer-fill', 'selected-buffer-line'].forEach(layerId => {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId)
    }
  })
  if (map.getSource('selected-buffer')) {
    map.removeSource('selected-buffer')
  }

  // Create a circular buffer around the point
  const center = coordinates
  const radius = 0.00005 // Small radius for a tight buffer
  const points = 64 // Reduced number of points for smoother circle
  const features = []
  
  // Create a circle of points
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * (2 * Math.PI)
    const dx = Math.cos(angle) * radius
    const dy = Math.sin(angle) * radius
    features.push([center[0] + dx, center[1] + dy])
  }
  // Close the circle
  features.push(features[0])

  // Create the GeoJSON
  const geojson = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [features]
    },
    properties: {
      opacity: 1
    }
  }

  // Add the buffer source
  map.addSource('selected-buffer', {
    type: 'geojson',
    data: geojson
  })

  // Add fill layer with radial gradient effect
  map.addLayer({
    'id': 'selected-buffer-fill',
    'type': 'fill',
    'source': 'selected-buffer',
    'paint': {
      'fill-color': '#ffffff',
      'fill-opacity': 0.8
    }
  }, 'property-layer')

  // Add outline layer
  map.addLayer({
    'id': 'selected-buffer-line',
    'type': 'line',
    'source': 'selected-buffer',
    'paint': {
      'line-color': '#ffffff',
      'line-width': 2,
      'line-opacity': 0.8
    }
  }, 'property-layer')

  // Simple fade in animation
  let opacity = 0
  const fadeIn = () => {
    opacity += 0.1
    if (opacity <= 0.4) {
      if (map.getLayer('selected-buffer-fill')) {
        map.setPaintProperty('selected-buffer-fill', 'fill-opacity', opacity)
        requestAnimationFrame(fadeIn)
      }
    }
  }

  requestAnimationFrame(fadeIn)
}

// Watch for route changes
watch(
  () => route.query,
  (newQuery) => {
    if (!map || !isMapLoaded.value) return

    const lng = parseFloat(newQuery.lng)
    const lat = parseFloat(newQuery.lat)
    // Only use default zoom when no zoom parameter is provided
    const zoom = newQuery.zoom ? parseFloat(newQuery.zoom) : map.getZoom()

    if (lng && lat) {
      const searchedCoords = [lng, lat]
      
      map.flyTo({
        center: searchedCoords,
        zoom: zoom,  // Use the calculated zoom level
        essential: true,
      })

      // Wait for the flyTo animation to complete
      map.once('moveend', () => {
        selectPropertyAtCoordinates(searchedCoords)
      })
    }
  },
  { immediate: true }
)

// Add new function to handle property selection
const selectPropertyAtCoordinates = (coords) => {
  if (!map || !isMapLoaded.value) return

  // Create a tighter bounding box for more accurate property selection
  const bounds = [
    [coords[0] - 0.00005, coords[1] - 0.00005], // Reduced from 0.0001
    [coords[0] + 0.00005, coords[1] + 0.00005]
  ]
  
  const features = map.queryRenderedFeatures(
    [
      map.project([bounds[0][0], bounds[0][1]]),
      map.project([bounds[1][0], bounds[1][1]])
    ],
    { layers: ['property-layer'] }
  )

  if (features.length > 0) {
    const closestProperty = features.reduce((prev, curr) => {
      const prevDist = Math.hypot(
        prev.geometry.coordinates[0] - coords[0],
        prev.geometry.coordinates[1] - coords[1]
      )
      const currDist = Math.hypot(
        curr.geometry.coordinates[0] - coords[0],
        curr.geometry.coordinates[1] - coords[1]
      )
      return currDist < prevDist ? curr : prev
    })

    const properties = closestProperty.properties
    const coordinates = closestProperty.geometry.coordinates

    // Update buffer immediately
    updateSelectedBuffer(coordinates)

    // Update property details
    selectedPropertyDetails.value = properties
    selectedPropertyAddress.value = properties.address || 'Address not available'
    selectedPropertyCoords.value = {
      lng: coordinates[0],
      lat: coordinates[1]
    }

    // Create popup
    if (popup.value) popup.value.remove()
    popup.value = new mapboxgl.Popup({ closeOnClick: false })
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

    // Switch to access tab and initialize travel analysis
    activeTab.value = 'access'
    if (isochroneEnabled.value) {
      updateIsochrone()
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
.mapboxgl-ctrl-geocoder {
  min-width: 360px;
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
  border-radius: 1%;
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

.mapboxgl-popup-content {
  padding: 0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

</style>