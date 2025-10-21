const config = {
  API_BASE_URL: process.env.REACT_APP_API_URL || '/api',
  SERVICE_TYPES: [
    'General Consultation',
    'Dental Checkup',
    'Eye Examination',
    'Physical Therapy',
    'Mental Health Counseling',
    'Vaccination',
    'Blood Test',
    'X-Ray/Imaging',
    'Dermatology',
    'Pediatric Care',
    'Other'
  ]
};

export default config;
