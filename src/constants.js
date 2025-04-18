import * as XLSX from 'xlsx';

// Fallback data in case Excel loading fails
const fallbackData = {
  managers: [
    { id: 'manager1', name: 'Nguyễn Văn A' },
    { id: 'manager2', name: 'Trần Thị B' },
    { id: 'manager3', name: 'Lê Văn C' }
  ],
  storesByManager: {
    manager1: [
      { id: 'store1', name: 'Cửa hàng 1A' },
      { id: 'store2', name: 'Cửa hàng 1B' }
    ],
    manager2: [
      { id: 'store3', name: 'Cửa hàng 2A' },
      { id: 'store4', name: 'Cửa hàng 2B' }
    ],
    manager3: [
      { id: 'store5', name: 'Cửa hàng 3A' },
      { id: 'store6', name: 'Cửa hàng 3B' }
    ]
  },
  products: [
    { id: 'prod1', name: 'Sản phẩm A' },
    { id: 'prod2', name: 'Sản phẩm B' },
    { id: 'prod3', name: 'Sản phẩm C' },
    { id: 'prod4', name: 'Sản phẩm D' },
    { id: 'prod5', name: 'Sản phẩm E' }
  ]
};

// Initial exports with fallback data
export let managers = [...fallbackData.managers];
export let storesByManager = {...fallbackData.storesByManager};
export let products = [...fallbackData.products];

// Function to load data from Excel
async function loadExcelData() {
  try {
    // Fetch the Excel file
    const response = await fetch('/data/survey-data.xlsx');
    if (!response.ok) {
      throw new Error(`Failed to fetch Excel file: ${response.status}`);
    }
    
    // Convert to array buffer
    const arrayBuffer = await response.arrayBuffer();
    
    // Load workbook
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    
    // Process managers
    if (workbook.SheetNames.includes('managers')) {
      const managersSheet = workbook.Sheets['managers'];
      managers = XLSX.utils.sheet_to_json(managersSheet);
    }
    
    // Process stores by manager
    if (workbook.SheetNames.includes('storesByManager')) {
      const storesSheet = workbook.Sheets['storesByManager'];
      const storesData = XLSX.utils.sheet_to_json(storesSheet);
      
      // Reset storesByManager
      storesByManager = {};
      
      // Process the flattened stores data back into the original structure
      storesData.forEach(item => {
        const { managerId, storeId, storeName } = item;
        
        // Initialize the array for this manager if it doesn't exist
        if (!storesByManager[managerId]) {
          storesByManager[managerId] = [];
        }
        
        // Add the store to the manager's array
        storesByManager[managerId].push({
          id: storeId,
          name: storeName
        });
      });
    }
    
    // Process products
    if (workbook.SheetNames.includes('products')) {
      const productsSheet = workbook.Sheets['products'];
      products = XLSX.utils.sheet_to_json(productsSheet);
    }
    
    console.log('Excel data loaded successfully');
  } catch (error) {
    console.error('Error loading Excel data:', error);
    console.log('Using fallback data instead');
  }
}

// Load Excel data when this module is imported
loadExcelData();
