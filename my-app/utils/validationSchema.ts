import * as yup from 'yup'

export const inspectionSchema = yup.object({
  // Property Details
  propertyType: yup.string()
    .required('Property type is required')
    .min(2, 'Property type must be at least 2 characters'),
  
  inspectionDate: yup.date()
    .required('Inspection date is required')
    .max(new Date(), 'Cannot select future date'),
  
  inspectorName: yup.string()
    .required('Inspector name is required')
    .min(2, 'Name must be at least 2 characters'),

  // Report Summary
  safetyHazards: yup.string()
    .required('Safety hazards assessment is required'),
  
  riskLevel: yup.string()
    .required('Risk level is required')
    .oneOf(['Low', 'Moderate', 'High', 'Moderate-High'], 'Invalid risk level'),

  // Property Details
  buildingType: yup.string()
    .required('Building type is required'),
  
  buildingAge: yup.number()
    .required('Building age is required')
    .positive('Age must be positive')
    .integer('Age must be a whole number'),
  
  bedrooms: yup.number()
    .required('Number of bedrooms is required')
    .min(0, 'Cannot be negative')
    .integer('Must be a whole number')
})