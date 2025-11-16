// Asset Dashboard functionality
// Sample asset data
const sampleAssets = [
    { 
        id: 1, 
        serial_number: 'ASSET-2024-001', 
        name: 'Dell Optiplex 3070 Desktop', 
        category: 'Computer',
        department_name: 'School of Technology', 
        status: 'active',
        last_updated: '2024-03-15'
    },
    { 
        id: 2, 
        serial_number: 'ASSET-2024-002', 
        name: 'Epson Projector EB-980W', 
        category: 'Projector',
        department_name: 'Computer Lab room 25', 
        status: 'maintenance',
        last_updated: '2024-03-10'
    },
    { 
        id: 3, 
        serial_number: 'ASSET-2024-003', 
        name: 'HP Laptop ProBook 450 G8', 
        category: 'Laptop',
        department_name: 'School of Education', 
        status: 'active',
        last_updated: '2024-03-12'
    },
    { 
        id: 4, 
        serial_number: 'ASSET-2024-004', 
        name: 'Canon Camera EOS 80D', 
        category: 'Camera',
        department_name: 'School of Business', 
        status: 'active',
        last_updated: '2024-03-14'
    },
    { 
        id: 5, 
        serial_number: 'ASSET-2024-005', 
        name: 'Yamaha Audio System', 
        category: 'Audio',
        department_name: 'Speech Lab', 
        status: 'inactive',
        last_updated: '2024-02-28'
    },
    { 
        id: 6, 
        serial_number: 'ASSET-2024-006', 
        name: 'Smart TV Samsung 55\"', 
        category: 'Display',
        department_name: 'Computer Lab room 22', 
        status: 'active',
        last_updated: '2024-03-13'
    },
    { 
        id: 7, 
        serial_number: 'ASSET-2024-007', 
        name: 'Printer HP LaserJet Pro', 
        category: 'Printer',
        department_name: 'School of Technology', 
        status: 'maintenance',
        last_updated: '2024-03-11'
    },
    { 
        id: 8, 
        serial_number: 'ASSET-2024-008', 
        name: 'Whiteboard Interactive 75\"', 
        category: 'Interactive Display',
        department_name: 'School of Education', 
        status: 'active',
        last_updated: '2024-03-09'
    }
];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const assetTableBody = document.getElementById('assetTableBody');

// Stats Elements
const totalAssetsEl = document.getElementById('totalAssets');
const activeAssetsEl = document.getElementById('activeAssets');
const maintenanceAssetsEl = document.getElementById('maintenanceAssets');
const inactiveAssetsEl = document.getElementById('inactiveAssets');

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    updateDashboard();
    setupEventListeners();
});

// Update dashboard with data
function updateDashboard() {
    updateStats();
    renderAssetTable(sampleAssets);
}

// Update statistics cards
function updateStats() {
    const total = sampleAssets.length;
    const active = sampleAssets.filter(asset => asset.status === 'active').length;
    const maintenance = sampleAssets.filter(asset => asset.status === 'maintenance').length;
    const inactive = sampleAssets.filter(asset => asset.status === 'inactive').length;
    
    totalAssetsEl.textContent = total;
    activeAssetsEl.textContent = active;
    maintenanceAssetsEl.textContent = maintenance;
    inactiveAssetsEl.textContent = inactive;
}

// Render asset table
function renderAssetTable(assets) {
    assetTableBody.innerHTML = '';
    
    if (assets.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="5" class="text-center">No assets found</td>
        `;
        assetTableBody.appendChild(row);
        return;
    }
    
    assets.forEach(asset => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${asset.serial_number}</td>
            <td>${asset.name}</td>
            <td>${asset.category}</td>
            <td><span class="status-badge status-${asset.status}">${formatStatus(asset.status)}</span></td>
            <td>
                <button class="action-btn view" onclick="viewAsset(${asset.id})" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit" onclick="editAsset(${asset.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteAsset(${asset.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        assetTableBody.appendChild(row);
    });
}

// Format status text
function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

// Search functionality
function searchAssets(query) {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) {
        renderAssetTable(sampleAssets);
        return;
    }
    
    const filtered = sampleAssets.filter(asset => 
        asset.serial_number.toLowerCase().includes(searchTerm) ||
        asset.name.toLowerCase().includes(searchTerm) ||
        asset.category.toLowerCase().includes(searchTerm) ||
        asset.department_name.toLowerCase().includes(searchTerm) ||
        asset.status.toLowerCase().includes(searchTerm)
    );
    
    renderAssetTable(filtered);
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchAssets(e.target.value);
        });
    }
    
    // Filter button
    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            // Implement filter modal/functionality here
            alert('Filter functionality will be implemented here');
        });
    }
}

// CRUD Operations
function viewAsset(id) {
    const asset = sampleAssets.find(a => a.id === id);
    if (asset) {
        alert(`Viewing asset: ${asset.name}\nStatus: ${formatStatus(asset.status)}\nLast Updated: ${asset.last_updated}`);
    }
}

function editAsset(id) {
    const asset = sampleAssets.find(a => a.id === id);
    if (asset) {
        // In a real app, this would open an edit form/modal
        alert(`Editing asset: ${asset.name}`);
    }
}

function deleteAsset(id) {
    if (confirm('Are you sure you want to delete this asset?')) {
        // In a real app, this would make an API call to delete the asset
        const index = sampleAssets.findIndex(a => a.id === id);
        if (index !== -1) {
            sampleAssets.splice(index, 1);
            updateDashboard();
            alert('Asset deleted successfully');
        }
    }
}

function addAsset() {
    // In a real app, this would open an add asset form/modal
    alert('Add new asset form will open here');
}

// Filter assets based on search and filter criteria

document.addEventListener('DOMContentLoaded', function() {
    initializeAssetDashboard();
    addEventListeners();
});

async function initializeAssetDashboard() {
    // Initialize search and filter functionality
    await setupSearchAndFilter();
    
    // Load asset data
    loadAssetsFromSample();
}

async function setupSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const departmentFilter = document.getElementById('departmentFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterAssets);
    }
    
    if (departmentFilter) {
        departmentFilter.addEventListener('change', filterAssets);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterAssets);
    }
}

function addEventListeners() {
    // Search button is handled inline now via openSearchModal(); no extra listener to avoid duplicate handling
    
    // Clear filters button
    const clearBtn = document.querySelector('.clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
    }
}

function toggleSearch() {
    const searchSection = document.getElementById('searchSection');
    if (searchSection) {
        if (searchSection.style.display === 'none') {
            searchSection.style.display = 'block';
        } else {
            searchSection.style.display = 'none';
        }
    }
}

function loadAssetsFromSample() {
    const tableBody = document.getElementById('assetTableBody');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add sample assets
    sampleAssets.forEach(asset => {
        const row = createAssetRow(asset);
        tableBody.appendChild(row);
    });
}

function createAssetRow(asset) {
    const row = document.createElement('tr');
    row.dataset.departmentId = asset.department_id || '';
    row.dataset.assetId = asset.id;
    row.innerHTML = `
        <td>${asset.serial_number}</td>
        <td>${asset.name}</td>
        <td>${asset.department_name || 'N/A'}</td>
        <td><span class="status-badge ${asset.status}">${asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}</span></td>
        <td>
            <button class="history-btn" onclick="viewHistory('${asset.serial_number}')">View</button>
            <button class="action-btn edit" onclick="editAsset('${asset.serial_number}')">Edit</button>
            <button class="action-btn delete" onclick="deleteAssetFromTable('${asset.serial_number}', ${asset.id})">Delete</button>
        </td>
    `;
    return row;
}

function filterAssets() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const departmentFilterValue = document.getElementById('departmentFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value.toLowerCase() || '';
    
    const rows = document.querySelectorAll('.asset-table tbody tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
            const serialNum = cells[0].textContent.toLowerCase();
            const name = cells[1].textContent.toLowerCase();
            const department = cells[2].textContent.toLowerCase();
            const status = cells[3].textContent.toLowerCase();
            
            const matchesSearch = !searchTerm || 
                serialNum.includes(searchTerm) || 
                name.includes(searchTerm) || 
                department.includes(searchTerm);
            
            const matchesDepartment = !departmentFilterValue || 
                row.dataset.departmentId === departmentFilterValue ||
                department.includes(departmentFilterValue.toLowerCase());
            
            const matchesStatus = !statusFilter || 
                status.includes(statusFilter);
            
            if (matchesSearch && matchesDepartment && matchesStatus) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

function clearFilters() {
    const searchInput = document.getElementById('searchInput');
    const departmentFilter = document.getElementById('departmentFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (searchInput) searchInput.value = '';
    if (departmentFilter) departmentFilter.value = '';
    if (statusFilter) statusFilter.value = '';
    
    const rows = document.querySelectorAll('.asset-table tbody tr');
    rows.forEach(row => {
        row.style.display = '';
    });
    
    showNotification('Filters cleared', 'info');
}

function deleteAssetFromTable(serialNumber, assetId) {
    const modal = document.createElement('div');
    modal.className = 'delete-confirmation-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Confirm Delete</h3>
            </div>
            <div class="modal-body">
                <div class="warning-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <p>Are you sure you want to delete asset <strong>${serialNumber}</strong>?</p>
                <p class="warning-text">This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeDeleteModal()">Cancel</button>
                <button class="btn btn-danger" onclick="confirmDelete('${serialNumber}', ${assetId})">Delete</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentDeleteModal = modal;
}

function closeDeleteModal() {
    if (window.currentDeleteModal) {
        window.currentDeleteModal.remove();
        window.currentDeleteModal = null;
    }
}

function confirmDelete(serialNumber, assetId) {

    const deleteBtn = document.querySelector('#deleteModal .btn-danger');
    const originalText = deleteBtn.innerHTML;
    deleteBtn.innerHTML = 'Deleting... <span class="loading"></span>';
    deleteBtn.disabled = true;

    fetch(`../Api/assets/asset-dash.php?action=deleteAsset&id=${assetId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        if (data.success) {
            const rows = document.querySelectorAll('.asset-table tbody tr');
            rows.forEach(row => {
                if (row.dataset.assetId == assetId) {
                    row.remove();
                }
            });
            
            closeDeleteModal();
            showNotification(`Asset ${serialNumber} deleted successfully`, 'success');
            
            updateStats();
        } else {
            throw new Error(data.error || 'Failed to delete asset');
        }
    })
    .catch(error => {
        console.error('Error deleting asset:', error);
        showNotification(`Error deleting asset: ${error.message}`, 'error');
        
        const index = sampleAssets.findIndex(asset => asset.id === assetId);
        if (index > -1) {
            sampleAssets.splice(index, 1);
        }
        
        const rows = document.querySelectorAll('.asset-table tbody tr');
        rows.forEach(row => {
            if (row.dataset.assetId == assetId) {
                row.remove();
            }
        });
    })
    .finally(() => {
        deleteBtn.innerHTML = originalText;
        deleteBtn.disabled = false;
    });
}

function editAsset(assetId) {
    const asset = sampleAssets.find(a => a.serial_number === assetId);
    
    if (!asset) {
        showNotification('Asset not found', 'error');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'edit-asset-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Asset - ${assetId}</h3>
                <button class="close-modal" onclick="closeEditModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form class="edit-asset-form">
                    <div class="form-group">
                        <label>Serial Number *</label>
                        <input type="text" id="editSerialNumber" required value="${asset.serial_number}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Asset Name *</label>
                        <input type="text" id="editAssetName" required value="${asset.name}">
                    </div>
                    <div class="form-group">
                        <label>Department *</label>
                        <select id="editAssetDepartment" required>
                            <option value="">Select Department</option>
                            <option value="School of Technology" ${asset.department_name === 'School of Technology' ? 'selected' : ''}>School of Technology</option>
                            <option value="School of Education" ${asset.department_name === 'School of Education' ? 'selected' : ''}>School of Education</option>
                            <option value="School of Business" ${asset.department_name === 'School of Business' ? 'selected' : ''}>School of Business</option>
                            <option value="Computer Lab room 25" ${asset.department_name === 'Computer Lab room 25' ? 'selected' : ''}>Computer Lab room 25</option>
                            <option value="Computer Lab room 22" ${asset.department_name === 'Computer Lab room 22' ? 'selected' : ''}>Computer Lab room 22</option>
                            <option value="Speech Lab" ${asset.department_name === 'Speech Lab' ? 'selected' : ''}>Speech Lab</option>
                            <option value="Library" ${asset.department_name === 'Library' ? 'selected' : ''}>Library</option>
                            <option value="Clinic" ${asset.department_name === 'Clinic' ? 'selected' : ''}>Clinic</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="editStatus">
                            <option value="active" ${asset.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="borrowed" ${asset.status === 'borrowed' ? 'selected' : ''}>Borrowed</option>
                            <option value="maintenance" ${asset.status === 'maintenance' ? 'selected' : ''}>Under Maintenance</option>
                            <option value="inactive" ${asset.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeEditModal()">Cancel</button>
                <button class="btn btn-primary" onclick="saveAssetEdit('${assetId}')">Save Changes</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentEditModal = modal;
}

function closeEditModal() {
    if (window.currentEditModal) {
        window.currentEditModal.remove();
        window.currentEditModal = null;
    }
}

function saveAssetEdit(assetId) {
    const name = document.getElementById('editAssetName').value;
    const department = document.getElementById('editAssetDepartment').value;
    const status = document.getElementById('editStatus').value;
    
    if (!name || !department) {
        alert('Please fill in all required fields');
        return;
    }
    
    const asset = sampleAssets.find(a => a.serial_number === assetId);
    if (asset) {
        asset.name = name;
        asset.department_name = department;
        asset.status = status;
    }
    
    loadAssetsFromSample();
    closeEditModal();
    showNotification(`Asset ${assetId} updated successfully`, 'success');
}

function viewHistory(serialNumber) {
    alert(`Viewing transaction history for asset: ${serialNumber}`);
}

function addAsset() {
    const modal = document.createElement('div');
    modal.className = 'add-asset-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add New Asset</h3>
                <button class="close-modal" onclick="closeAddModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form class="add-asset-form">
                    <div class="form-group">
                        <label>Serial Number *</label>
                        <input type="text" id="addSerialNumber" required placeholder="Enter serial number">
                    </div>
                    <div class="form-group">
                        <label>Asset Name *</label>
                        <input type="text" id="addAssetName" required placeholder="Enter asset name">
                    </div>
                    <div class="form-group">
                        <label>Department *</label>
                        <select id="addAssetDepartment" required>
                            <option value="">Select Department</option>
                            <option value="School of Technology">School of Technology</option>
                            <option value="School of Education">School of Education</option>
                            <option value="School of Business">School of Business</option>
                            <option value="Computer Lab room 25">Computer Lab room 25</option>
                            <option value="Computer Lab room 22">Computer Lab room 22</option>
                            <option value="Speech Lab">Speech Lab</option>
                            <option value="Library">Library</option>
                            <option value="Clinic">Clinic</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select id="addStatus">
                            <option value="active">Active</option>
                            <option value="borrowed">Borrowed</option>
                            <option value="maintenance">Under Maintenance</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="addDescription" rows="3" placeholder="Enter asset description (optional)"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeAddModal()">Cancel</button>
                <button class="btn btn-primary" onclick="saveNewAsset()">Add Asset</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentAddModal = modal;
}

function closeAddModal() {
    if (window.currentAddModal) {
        window.currentAddModal.remove();
        window.currentAddModal = null;
    }
}

function saveNewAsset() {
    const serialNumber = document.getElementById('addSerialNumber').value.trim();
    const name = document.getElementById('addAssetName').value.trim();
    const department = document.getElementById('addAssetDepartment').value;
    const status = document.getElementById('addStatus').value;
    const description = document.getElementById('addDescription').value.trim();
    
    // Validation
    if (!serialNumber || !name || !department) {
        alert('Please fill in all required fields (Serial Number, Asset Name, Department)');
        return;
    }
    
    // Check if serial number already exists
    const existingAsset = sampleAssets.find(asset => asset.serial_number === serialNumber);
    if (existingAsset) {
        alert('Serial number already exists. Please use a different serial number.');
        return;
    }
    
    // Generate new ID
    const newId = Math.max(...sampleAssets.map(a => a.id)) + 1;
    
    // Create new asset object
    const newAsset = {
        id: newId,
        serial_number: serialNumber,
        name: name,
        department_name: department,
        status: status,
        description: description
    };
    
    // Add to sample data
    sampleAssets.push(newAsset);
    
    // Reload the table
    loadAssetsFromSample();
    
    // Close modal
    closeAddModal();
    
    // Show success notification
    showNotification(`Asset ${serialNumber} added successfully`, 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    if (type === 'success') {
        notification.style.backgroundColor = '#4caf50';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
    } else {
        notification.style.backgroundColor = '#2196f3';
    }
    
    notification.style.cssText += `
        position: fixed;
        top: 20px;
        right: 20px;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    .action-buttons {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
        align-items: center;
    }
    
    .search-section {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
    }
    
    .search-container {
        display: flex;
        gap: 15px;
        align-items: center;
        flex-wrap: wrap;
    }
    
    .search-input, .filter-select {
        padding: 10px 15px;
        border: 2px solid #ddd;
        border-radius: 8px;
        font-size: 14px;
        transition: border-color 0.3s ease;
        flex: 1;
        min-width: 200px;
    }
    
    .search-input:focus, .filter-select:focus {
        outline: none;
        border-color: #4caf50;
    }
    
    .clear-btn {
        background: #ff9800;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .clear-btn:hover {
        background: #f57c00;
        transform: translateY(-2px);
    }
    
    .table-container {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    
    .asset-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .asset-table th {
        background: linear-gradient(135deg, #2e7d32, #4caf50);
        color: white;
        padding: 15px;
        text-align: left;
        font-weight: 600;
        border: none;
    }
    
    .asset-table td {
        padding: 15px;
        border-bottom: 1px solid #eee;
        vertical-align: middle;
    }
    
    .asset-table tr:hover {
        background: #f9f9f9;
    }
    
    .status-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .status-badge.active {
        background: #e8f5e8;
        color: #2e7d32;
    }
    
    .status-badge.borrowed {
        background: #fff3e0;
        color: #f57c00;
    }
    
    .status-badge.maintenance {
        background: #ffebee;
        color: #d32f2f;
    }
    
    .status-badge.inactive {
        background: #f5f5f5;
        color: #666;
    }
    
    .history-btn {
        background: #2196f3;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.3s ease;
        margin-right: 5px;
    }
    
    .history-btn:hover {
        background: #1976d2;
        transform: translateY(-1px);
    }
    
    .action-btn {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        margin: 0 2px;
        transition: all 0.3s ease;
    }
    
    .action-btn.edit {
        background: #ff9800;
        color: white;
    }
    
    .action-btn.edit:hover {
        background: #f57c00;
    }
    
    .action-btn.delete {
        background: #f44336;
        color: white;
    }
    
    .action-btn.delete:hover {
        background: #d32f2f;
    }
    
    .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .btn-secondary {
        background: #6c757d;
        color: white;
    }
    
    .btn-secondary:hover {
        background: #5a6268;
    }
    
    .btn-primary {
        background: #4caf50;
        color: white;
    }
    
    .btn-primary:hover {
        background: #45a049;
    }
    
    .btn-danger {
        background: #dc3545;
        color: white;
    }
    
    .btn-danger:hover {
        background: #c82333;
    }
    
    .edit-asset-modal, .delete-confirmation-modal, .add-asset-modal, .search-asset-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }
    
    .modal-content {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        animation: slideUp 0.3s ease;
        overflow: hidden;
    }
    
    .modal-header {
        padding: 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8f9fa;
    }
    
    .modal-header h3 {
        margin: 0;
        color: #333;
        font-size: 18px;
    }
    
    .close-modal {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .close-modal:hover {
        color: #333;
    }
    
    .modal-body {
        padding: 20px;
        max-height: 400px;
        overflow-y: auto;
    }
    
    .modal-footer {
        padding: 20px;
        border-top: 1px solid #eee;
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        background: #f8f9fa;
    }
    
    .form-group {
        margin-bottom: 15px;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 600;
        color: #333;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 10px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        transition: border-color 0.3s ease;
        font-family: inherit;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #4caf50;
    }
    
    .form-group textarea {
        resize: vertical;
        min-height: 80px;
    }
    
    .form-group input[readonly] {
        background: #f8f9fa;
        color: #666;
    }
    
    .warning-icon {
        text-align: center;
        margin-bottom: 15px;
    }
    
    .warning-icon i {
        font-size: 48px;
        color: #ff9800;
    }
    
    .warning-text {
        color: #666;
        font-size: 14px;
        margin-top: 10px;
        text-align: center;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
`;

document.head.appendChild(style);
