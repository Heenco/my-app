import { ref, onMounted } from 'vue'

export const usePropertyDetails = () => {
  const propertyDetails = ref(null)
  const address = ref(null)

  onMounted(() => {
    // Get address from URL hash
    const hash = window.location.hash.slice(1)
    if (hash) {
      address.value = decodeURIComponent(hash)
      // Here you would typically fetch property details from your API
      // For now we'll use mock data
      propertyDetails.value = {
        address: address.value,
        lot_plan: "L123 RP456789",
        area: "650m²",
        zoning: "LDR - Low Density Residential",
        overlays: ["Flood", "Bushfire"],
        lastSale: "$750,000 (2022)"
      }
    }
  })

  return {
    propertyDetails,
    address
  }
}