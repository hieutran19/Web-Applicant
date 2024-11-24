// Define options directly with string values
export const levelOptions = [
    { value: '1', label: 'Intern' },
    { value: '2', label: 'Junior' },
    { value: '3', label: 'Mid-level' },
    { value: '4', label: 'Senior' },
    { value: '5', label: 'Expert' },
    { value: '6', label: 'Lead' },
    { value: '7', label: 'Manager' },
    { value: '8', label: 'Director' }
  ];
  
  export const modeOptions = [
    { value: '1', label: 'Part-time' },
    { value: '2', label: 'Full-time' }
  ];
  
  export const highestDegreeOptions = [
    { value: '1', label: 'Associate degree' },
    { value: '2', label: "Bachelor's degree" },
    { value: '3', label: "Master's degree" },
    { value: '4', label: 'Doctoral degree' },
    { value: '5', label: 'Professional degree' }
  ];
  
  export const statusContract = [
    { value: '1', label: 'Active' },
    { value: '2', label: "Expired" },
  ]
  
  export const typeOfferOptions = [
    { value: '1', label: 'Intern' },
    { value: '2', label: "Probation" },
  ];
  
  export const degreeOptions = [
    { value: '1', label: 'Excellent' },
    { value: '2', label: 'Good' },
    { value: '3', label: 'Average' },
    { value: '4', label: 'Below Average' },
    { value: '5', label: 'Poor/Weak' }
  ];
  export const degreeTypeOptions = [
    { value: '1', label: `Associate's Degree` },
    { value: '2', label: "Bachelor's Degree" },
    { value: '3', label: "Master's Degree" },
    { value: '4', label:  "Doctoral Degree" },
    { value: '5', label: "Professional Degree" },
    { value: '6', label: "Certificate" },
    { value: '7', label: "Diploma" },
    { value: '8', label: "Postgraduate Diploma" },
    { value: '9', label: "Postdoctoral Fellowship" },
    { value: '10', label: "Honorary Degree" },
  ];
  export const calculateDateRange = (daysAgo) => {
    const today = new Date();
    const endDate = today.toLocaleDateString('en-GB'); // Định dạng dd/mm/yyyy
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysAgo);
    const start = startDate.toLocaleDateString('en-GB'); // Định dạng dd/mm/yyyy
    return `${start}-${endDate}`;
  };
  
  export const dateOptions = [
    { value: '', label: 'All days', range: '' },
    { value: calculateDateRange(3), label: '3 days ago', range: calculateDateRange(3) },
    { value: calculateDateRange(7), label: '7 days ago', range: calculateDateRange(7) },
    { value: calculateDateRange(30), label: '30 days ago', range: calculateDateRange(30) },
    { value: calculateDateRange(60), label: '60 days ago', range: calculateDateRange(60) },
  ];
  