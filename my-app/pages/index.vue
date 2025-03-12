<template>
  <div class="relative min-h-screen">
    <shadcn-background 
      class="absolute inset-0 z-0" 
      :dot-color="'rgb(200, 200, 200)'"
      :matrix-density="0.8"
      :dot-size="1"
      :blur="0"
    >
      <div class="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent"></div>
    </shadcn-background>
    <div class="container mx-auto p-4 pt-16 text-center relative z-10">
      <nav class="mb-8 flex items-center justify-between max-w-4xl mx-auto">
        <div class="logo-group flex items-center space-x-2 hover:opacity-90 transition-opacity">
          <!--
          <svg 
            class="h-10 w-auto fill-current text-black hover:text-orange-500 transition-colors duration-300" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >

            <path d="M12 2L2 8.37333L2 19.2267L12 22L22 19.2267V8.37333L12 2ZM17.3333 17.8667L12 19.3333L6.66667 17.8667V9.96L12 6.89333L17.3333 9.96V17.8667Z"/>
            <path d="M12 15.6667C13.4728 15.6667 14.6667 14.4728 14.6667 13C14.6667 11.5272 13.4728 10.3333 12 10.3333C10.5272 10.3333 9.33333 11.5272 9.33333 13C9.33333 14.4728 10.5272 15.6667 12 15.6667Z"/>
          </svg>
          -->
          <span class="text-3xl font-black bg-gradient-to-r from-gray-400 via-orange-600 to-orange-400 bg-clip-text text-transparent tracking-tight">Picky</span>
        </div>
        <!---->
        <ul class="flex space-x-8">
         
         
          <li><a href="#" class="text-blue-500 hover:underline text-lg"></a></li>
        
          <li><a href="#" class="text-blue-500 hover:underline text-lg"></a></li>
        </ul>
      </nav>
      <main class="mt-20">
        <div class="intro">
          <br />
          <br />
          <br />
          

          <h1 class="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Find your <span class="highlight text-orange-500">dream home</span>
            <br />with confidence
            <br />
            <br />

          </h1>
          <span class="availability block mb-2">Now available in <strong>Brisbane, Australia</strong></span>
          <p class="mt-3">Search for properties in your ideal neighborhood, assess safety, and evaluate proximity to amenities.</p>
          <div class="search-bar mt-10 flex justify-center w-full relative">
            <div ref="geocoderContainer" class="relative w-full max-w-[800px] mx-auto flex justify-center"></div>
          </div>
          <div class="random-addresses mt-16">
            <p>Not sure where to start?</p>
            <p>Try one of these random addresses to see how the search works.</p>
            <ul class="mt-4 space-y-4">

            </ul>
          </div>
          
          <!-- New Features Section -->
          <div class="features mt-32 mb-20">
            <h2 class="text-3xl font-bold mb-12">Why Choose picky?</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="feature-card p-6 rounded-lg bg-white/50 backdrop-blur-sm shadow-lg">
                <h3 class="text-xl font-semibold mb-4">Smart Search</h3>
                <p class="text-gray-600">Advanced algorithms to help you find the perfect location based on your preferences.</p>
              </div>
              <div class="feature-card p-6 rounded-lg bg-white/50 backdrop-blur-sm shadow-lg">
                <h3 class="text-xl font-semibold mb-4">Safety First</h3>
                <p class="text-gray-600">Detailed safety ratings and crime statistics for every neighborhood.</p>
              </div>
              <div class="feature-card p-6 rounded-lg bg-white/50 backdrop-blur-sm shadow-lg">
                <h3 class="text-xl font-semibold mb-4">Local Insights</h3>
                <p class="text-gray-600">Get real insights from local residents and community data.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer class="mt-12">
        <button class="feedback bg-black text-white px-4 py-2 rounded fixed bottom-8 left-8 z-20">Feedback</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import '@/assets/css/geocoder.css'

const router = useRouter()
const geocoderContainer = ref(null)

onMounted(() => {
  const geocoder = new MapboxGeocoder({
    accessToken: 'pk.eyJ1Ijoia2hlcmFkbWFuZGkiLCJhIjoiY2l4aXF5Ym5lMDAwbzJ6cHA0cWw4OWRkNyJ9.pbe17ldY9KRsNZQRwfkRFA',
    placeholder: 'Search for a location in Brisbane',
    marker: false,
    className: 'index-geocoder'
  })

  geocoder.addTo(geocoderContainer.value)

  geocoder.on('result', (event) => {
    const { result } = event
    // Navigate to MapBrisbane with query parameters
    router.push({
      path: '/mapbrisbane',
      query: {
        lng: result.center[0].toFixed(6),
        lat: result.center[1].toFixed(6),
        zoom: '18.00'
      }
    })
  })
})
</script>

<style>
// Remove or comment out the Inter font import
/* @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'); */

.mapboxgl-ctrl-geocoder {
  width: 140% !important;
  max-width: 600px !important;
  margin: 0 auto !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  border: 2px solid #e5e7eb;
  border-radius: 12px !important;
  transition: all 0.3s ease;
}

.mapboxgl-ctrl-geocoder--input {
  height: 56px !important;
  padding-left: 48px !important;
  font-size: .9rem !important;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  font-weight: 400 !important;
  color: #6B7280 !important; /* Changed to a medium grey */
  letter-spacing: normal !important;
}

.mapboxgl-ctrl-geocoder--suggestion {
  font-family: system-ui, -apple-system, sans-serif !important;
  font-size: 0.95rem !important;
  color: #6B7280 !important;
}

/* Add these new styles for the search icon */
.mapboxgl-ctrl-geocoder--icon-search {
  top: 50% !important;
  left: 12px !important;
  transform: translateY(-50%) !important;
  width: 28px !important;  /* Increased from 24px */
  height: 28px !important; /* Increased from 24px */
}

.mapboxgl-ctrl-geocoder:hover {
  border-color: #fb923c;
  box-shadow: 0 4px 6px rgba(251, 146, 60, 0.1) !important;
}

.mapboxgl-ctrl-geocoder:focus-within {
  border-color: #fb923c;
  box-shadow: 0 4px 6px rgba(251, 146, 60, 0.1) !important;
}

.mapboxgl-ctrl-geocoder--suggestion-title {
  font-weight: 600;
  color: #1f2937;
}

@media (max-width: 768px) {
  .mapboxgl-ctrl-geocoder {
    width: 110% !important;
    border-radius: 12px !important;
  }
  
  .mapboxgl-ctrl-geocoder--input {
    height: 38px !important;
    font-size: 0.875rem !important
  }
  
  .mapboxgl-ctrl-geocoder--icon-search {
    top: 50% !important;
    left: 12px !important;
    transform: translateY(-50%) !important;
    width: 24px !important;  /* Adjusted for mobile */
    height: 24px !important; /* Adjusted for mobile */
  }
}

.logo svg {
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1));
}

.logo svg:hover {
  filter: drop-shadow(0 4px 6px rgb(251 146 60 / 0.3));
}

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

.logo-group:hover svg {
  filter: drop-shadow(0 4px 6px rgb(251 146 60 / 0.3));
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
</style>

