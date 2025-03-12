<template>
    <div class="container mx-auto p-4">
      <!-- Header -->
      <Card class="mb-8">
        <Heading size="xl">Pre-Purchase Property Inspection Report</Heading>
        <Text class="mt-2"><strong>Property Address:</strong> {{ report.address }}</Text>
        <Text><strong>Inspection Date:</strong> {{ report.inspectionDate }}</Text>
        <Text><strong>Completed:</strong> {{ report.completed }}</Text>
        <Text><strong>Client:</strong> {{ report.client }}</Text>
        <Text><strong>Reference ID:</strong> {{ report.referenceId }}</Text>
        <Text><strong>Type:</strong> {{ report.type }}</Text>
        <Text><strong>Inspected by:</strong> {{ report.inspectedBy }}</Text>
        <Text><strong>State License:</strong> {{ report.license }}</Text>
        <Text><strong>Contact:</strong> {{ report.contact }}</Text>
        <Text><strong>Email:</strong> {{ report.email }}</Text>
      </Card>
  
      <!-- Table of Contents -->
      <Heading size="lg" class="mb-4">Table of Contents</Heading>
      <ul class="list-disc pl-5 mb-8">
        <li><a href="#summary" class="text-blue-500 hover:underline">Summary of Issues Identified</a></li>
        <li><a href="#structural" class="text-blue-500 hover:underline">Structural</a></li>
        <li><a href="#exterior" class="text-blue-500 hover:underline">Exterior</a></li>
        <li><a href="#interior" class="text-blue-500 hover:underline">Interior</a></li>
        <li><a href="#bathrooms" class="text-blue-500 hover:underline">Bathrooms</a></li>
        <li><a href="#grounds" class="text-blue-500 hover:underline">Grounds</a></li>
        <li><a href="#timber-pest" class="text-blue-500 hover:underline">Timber Pest</a></li>
        <li><a href="#property-overview" class="text-blue-500 hover:underline">General Property Overview</a></li>
        <li><a href="#additional-notes" class="text-blue-500 hover:underline">Additional Notes</a></li>
        <li><a href="#conclusion" class="text-blue-500 hover:underline">Conclusion</a></li>
      </ul>
  
      <!-- Summary of Issues -->
      <section id="summary" class="mb-8">
        <Heading size="lg">Summary of Issues Identified</Heading>
        <Table :headers="['System', 'Subsystem', 'Issues Identified']" :rows="report.summary.map(item => [item.system, item.subsystem, item.issues])" />
      </section>
  
      <!-- Structural Section -->
      <section id="structural" class="mb-8">
        <Heading size="lg">Structural</Heading>
        <Card class="mt-4">
          <Heading size="md">Foundation</Heading>
          <Text><strong>Type:</strong> {{ report.details.structural.foundation.type }}</Text>
          <Text><strong>Condition:</strong> {{ report.details.structural.foundation.condition }}</Text>
          <Text><strong>Concerns:</strong> {{ report.details.structural.foundation.concerns.join(', ') }}</Text>
          <Heading size="sm" class="mt-4">Issues Identified</Heading>
          <div v-for="issue in report.details.structural.foundation.issues" :key="issue.title" class="mt-2">
            <Card>
              <Heading size="xs">{{ issue.title }}</Heading>
              <Text>{{ issue.description }}</Text>
              <Text><strong>Recommendation:</strong> {{ issue.recommendation }}</Text>
            </Card>
          </div>
        </Card>
      </section>
  
      <!-- Exterior Section -->
      <section id="exterior" class="mb-8">
        <Heading size="lg">Exterior</Heading>
        <Card class="mt-4">
          <Heading size="md">Rainwater Goods</Heading>
          <Text><strong>Gutter Material(s):</strong> {{ report.details.exterior.rainwaterGoods.gutterMaterial }}</Text>
          <Text><strong>Gutter Condition:</strong> {{ report.details.exterior.rainwaterGoods.gutterCondition }}</Text>
          <Text><strong>Gutter Repairs Needed:</strong> {{ report.details.exterior.rainwaterGoods.gutterRepairsNeeded }}</Text>
          <Text><strong>Downpipe Condition:</strong> {{ report.details.exterior.rainwaterGoods.downpipeCondition }}</Text>
          <Text><strong>Downpipe Repairs Needed:</strong> {{ report.details.exterior.rainwaterGoods.downpipeRepairsNeeded }}</Text>
          <Heading size="sm" class="mt-4">Issues Identified</Heading>
          <div v-for="issue in report.details.exterior.rainwaterGoods.issues" :key="issue.title" class="mt-2">
            <Card>
              <Heading size="xs">{{ issue.title }}</Heading>
              <Text>{{ issue.description }}</Text>
              <Text><strong>Recommendation:</strong> {{ issue.recommendation }}</Text>
            </Card>
          </div>
        </Card>
      </section>
  
      <!-- Placeholder for Other Sections -->
      <section id="interior" class="mb-8">
        <Heading size="lg">Interior</Heading>
        <Text>Details for Internal Joinery and other subsystems would follow a similar structure.</Text>
      </section>
      <section id="bathrooms" class="mb-8">
        <Heading size="lg">Bathrooms</Heading>
        <Text>Details for Bathroom Fittings and other subsystems would follow a similar structure.</Text>
      </section>
      <section id="grounds" class="mb-8">
        <Heading size="lg">Grounds</Heading>
        <Text>Details for Retaining Walls & Fences and other subsystems would follow a similar structure.</Text>
      </section>
      <section id="timber-pest" class="mb-8">
        <Heading size="lg">Timber Pest</Heading>
        <Text>Details for Fungal Decay, Excessive Moisture, and other subsystems would follow a similar structure.</Text>
      </section>
  
      <!-- Property Overview -->
      <section id="property-overview" class="mb-8">
        <Heading size="lg">General Property Overview</Heading>
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt class="font-bold">Window Count</dt>
            <dd>{{ report.propertyOverview.windowCount }}</dd>
          </div>
          <div>
            <dt class="font-bold">Bedroom Count</dt>
            <dd>{{ report.propertyOverview.bedroomCount }}</dd>
          </div>
          <div>
            <dt class="font-bold">Bathroom Count</dt>
            <dd>{{ report.propertyOverview.bathroomCount }}</dd>
          </div>
          <div>
            <dt class="font-bold">Interior Door Count</dt>
            <dd>{{ report.propertyOverview.interiorDoorCount }}</dd>
          </div>
          <div>
            <dt class="font-bold">Property Type</dt>
            <dd>{{ report.propertyOverview.propertyType }}</dd>
          </div>
          <div>
            <dt class="font-bold">Approximate Age</dt>
            <dd>{{ report.propertyOverview.approximateAge }}</dd>
          </div>
        </dl>
      </section>
  
      <!-- Additional Notes -->
      <section id="additional-notes" class="mb-8">
        <Heading size="lg">Additional Notes</Heading>
        <ul class="list-disc pl-5">
          <li v-for="note in report.additionalNotes" :key="note">{{ note }}</li>
        </ul>
      </section>
  
      <!-- Conclusion -->
      <section id="conclusion" class="mb-8">
        <Heading size="lg">Conclusion</Heading>
        <Text><strong>Property Condition:</strong> {{ report.conclusion.propertyCondition }}</Text>
        <Text><strong>Major Defects:</strong> {{ report.conclusion.majorDefects }}</Text>
        <Text><strong>Minor Defects:</strong> {{ report.conclusion.minorDefects }}</Text>
        <Text><strong>Timber Pest Treatment:</strong> {{ report.conclusion.timberPestTreatment }}</Text>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        report: {
          address: '1 Bearke Place, Bracken Ridge, QLD 4017, Australia',
          inspectionDate: 'April 13, 2023',
          completed: 'April 13, 2023, 9:59 PM AEST',
          client: 'Manochehr Kheradmand',
          referenceId: 'BP-A1-130423',
          type: 'Pre-Purchase Standard Property & Timber Pest Inspection',
          inspectedBy: 'A1 Building & Pest Consultancy Pty. Ltd',
          license: 'QBCC Lic. No. 15234098',
          contact: '0401 018 030 (8 AM - 5 PM AEST)',
          email: 'info@A1buildinginspection.com.au',
          summary: [
            { system: 'Structural', subsystem: 'Foundation', issues: 'Poor surface drainage, soil erosion under slab, movement cracking on external walls' },
            { system: 'Exterior', subsystem: 'Rainwater Goods', issues: 'Blocked gutters, damaged downpipes' },
            { system: 'Interior', subsystem: 'Internal Joinery', issues: 'Water damage to door jambs and skirtings' },
            { system: 'Bathrooms', subsystem: 'Bathroom Fittings', issues: 'Cracked tiles and damaged sealants in shower recesses' },
            { system: 'Grounds', subsystem: 'Retaining Walls & Fences', issues: 'Movement/subsidence in retaining walls, leaning fences' },
            { system: 'Timber Pest', subsystem: 'Fungal Decay', issues: 'Localized fungal decay on boundary fence and retaining wall timbers' },
            { system: 'Timber Pest', subsystem: 'Excessive Moisture', issues: 'Conditions conducive to timber pests due to drainage issues' }
          ],
          details: {
            structural: {
              foundation: {
                type: 'Slab on Ground',
                condition: 'Damaged',
                concerns: ['Drainage Concerns', 'Structural Movement'],
                issues: [
                  {
                    title: 'Monitor Deficiency: Poor Surface Drainage',
                    description: 'Poor surface drainage observed, with extensive soil erosion under the slab. Needs improvement to reduce the risk of footing movement and moisture-related issues by diverting rain run-offs into a collection point (e.g., catch basin).',
                    recommendation: 'Consult a licensed builder or structural engineer for drainage solutions.'
                  },
                  {
                    title: 'Repair Deficiency: Movement Cracking',
                    description: 'Diagonal, vertical, and horizontal movement cracking noted on external walls, specifically around openings. Indicates potential structural movement.',
                    recommendation: 'A structural engineer should be consulted for further evaluation prior to purchase.'
                  }
                ]
              }
            },
            exterior: {
              rainwaterGoods: {
                gutterMaterial: 'Not specified (assumed standard metal)',
                gutterCondition: 'Damaged',
                gutterRepairsNeeded: 'Yes',
                downpipeCondition: 'Damaged',
                downpipeRepairsNeeded: 'Yes',
                issues: [
                  {
                    title: 'Repair Deficiency: Blocked Gutters',
                    description: 'Gutters blocked by debris, twigs, and leaves in several areas, risking overflow into eave space and deterioration.',
                    recommendation: 'Clean gutters to prevent leaks and further damage.'
                  },
                  {
                    title: 'Repair Deficiency: Damaged Downpipes',
                    description: 'Several downpipes are damaged, cracked, dismounted, or not properly connected to the stormwater system, risking foundation movement and moisture issues.',
                    recommendation: 'Engage a plumber to repair or replace affected downpipes.'
                  }
                ]
              }
            }
            // Additional sections (Interior, Bathrooms, Grounds, Timber Pest) follow a similar structure
          },
          propertyOverview: {
            windowCount: 'Not explicitly counted (assumed standard for 4-bedroom home)',
            bedroomCount: '4 bedrooms',
            bathroomCount: '2 bathrooms',
            interiorDoorCount: 'Not explicitly counted (assumed standard for layout)',
            propertyType: 'Detached house, single storey',
            approximateAge: '24 years'
          },
          additionalNotes: [
            'Undetected Defect Risk: Moderate-High due to obstructions (e.g., internal/external walls, floor coverings, roof space insulation) and inaccessible areas. A further inspection is strongly recommended once access is provided.',
            'Smoke Detectors: Queensland legislation requires interconnected photoelectric smoke alarms by January 1, 2022, for homes being sold. Vendor should provide a compliance certificate prior to settlement.',
            'Council Approvals: Not checked during inspection. Recommend verifying approvals for all structures (e.g., carport, sheds, retaining walls) prior to purchase.'
          ],
          conclusion: {
            propertyCondition: 'Average (consistent with age) compared to similar buildings of approximately 24 years that have been reasonably well maintained.',
            majorDefects: 'Average incidence, including structural and moisture-related issues requiring urgent attention.',
            minorDefects: 'Above average, with numerous items noted (e.g., settlement cracks, paint blemishes, carpet stains) requiring monitoring and maintenance.',
            timberPestTreatment: 'Not required currently, but a subterranean termite management proposal is recommended due to expired previous treatment and conducive conditions.'
          }
        }
      }
    }
  }
  </script>