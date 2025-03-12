export const usePropertyReport = () => {
  const getPropertyFactors = () => {
    return [
      {
        id: 'land-zoning',
        name: 'Land Zoning',
        status: 'R2 Low Density Residential',
        risk: 'low',
        description: 'The property is zoned for residential development with standard setback requirements.',
        map: true
      },
      {
        id: 'easement',
        name: 'Easement',
        status: 'Identified',
        risk: 'medium',
        description: 'There is a drainage easement along the western boundary of the property.',
        map: true
      },
      {
        id: 'heritage',
        name: 'Heritage',
        status: 'No Heritage Items',
        risk: 'low',
        description: 'No heritage items or conservation areas affect this property.',
        map: true
      },
      {
        id: 'flood-risk',
        name: 'Flood Risk',
        status: 'Partial Affected',
        risk: 'high',
        description: 'Property is partially within the 1:100 year flood zone.',
        map: true
      },
      {
        id: 'biodiversity',
        name: 'Biodiversity',
        status: 'Significant Vegetation',
        risk: 'medium',
        description: 'Contains significant native vegetation that requires assessment.',
        map: true
      },
      {
        id: 'koala-habitat',
        name: 'Koala Habitat',
        status: 'Core Habitat',
        risk: 'high',
        description: 'Property contains core koala habitat requiring protection.',
        map: true
      },
      {
        id: 'coastal-hazard',
        name: 'Coastal Hazard',
        status: 'Not Affected',
        risk: 'low',
        description: 'Property is not within any coastal hazard zones.',
        map: true
      }
    ];
  };

  return {
    getPropertyFactors
  };
};