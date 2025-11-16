// Department Dashboard functionality
let currentDepartment = null;
let currentRoom = null;
let navigationHistory = [];

// Sample asset data for different departments
const departmentAssets = {
    business: [
        { id: 1, serial_number: 'SOB-2024-001', name: 'Dell Desktop Computer', quantity: 1, status: 'active' },
        { id: 2, serial_number: 'SOB-2024-002', name: 'HP Printer LaserJet', quantity: 1, status: 'active' },
        { id: 3, serial_number: 'SOB-2024-003', name: 'Projector Epson', quantity: 1, status: 'borrowed' },
        { id: 4, serial_number: 'SOB-2024-004', name: 'Whiteboard Interactive', quantity: 1, status: 'maintenance' }
    ],
    education: [
        { id: 5, serial_number: 'SOE-2024-001', name: 'Smart TV 55 inch', quantity: 1, status: 'active' },
        { id: 6, serial_number: 'SOE-2024-002', name: 'Audio System Yamaha', quantity: 1, status: 'active' },
        { id: 7, serial_number: 'SOE-2024-003', name: 'Laptop HP ProBook', quantity: 2, status: 'borrowed' },
        { id: 8, serial_number: 'SOE-2024-004', name: 'Document Camera', quantity: 1, status: 'active' }
    ],
    technology: [
        { id: 9, serial_number: 'SOT-2024-001', name: 'Desktop Computer Dell', quantity: 25, status: 'active' },
        { id: 10, serial_number: 'SOT-2024-002', name: 'Network Switch Cisco', quantity: 3, status: 'active' },
        { id: 11, serial_number: 'SOT-2024-003', name: 'Server HP ProLiant', quantity: 1, status: 'maintenance' },
        { id: 12, serial_number: 'SOT-2024-004', name: 'Oscilloscope Digital', quantity: 5, status: 'active' },
        { id: 13, serial_number: 'SOT-2024-005', name: 'Microcontroller Kit', quantity: 20, status: 'active' }
    ],
    library: [
        { id: 14, serial_number: 'LIB-2024-001', name: 'Barcode Scanner', quantity: 2, status: 'active' },
        { id: 15, serial_number: 'LIB-2024-002', name: 'Desktop Computer', quantity: 5, status: 'active' },
        { id: 16, serial_number: 'LIB-2024-003', name: 'Printer Canon', quantity: 1, status: 'active' },
        { id: 17, serial_number: 'LIB-2024-004', name: 'Air Conditioner', quantity: 2, status: 'maintenance' }
    ],
    clinic: [
        { id: 18, serial_number: 'CLI-2024-001', name: 'Blood Pressure Monitor', quantity: 2, status: 'active' },
        { id: 19, serial_number: 'CLI-2024-002', name: 'Digital Thermometer', quantity: 5, status: 'active' },
        { id: 20, serial_number: 'CLI-2024-003', name: 'Weighing Scale', quantity: 1, status: 'active' },
        { id: 21, serial_number: 'CLI-2024-004', name: 'First Aid Kit', quantity: 3, status: 'active' }
    ],
    faculty: [
        { id: 22, serial_number: 'FAC-2024-001', name: 'Conference Table', quantity: 1, status: 'active' },
        { id: 23, serial_number: 'FAC-2024-002', name: 'Office Chairs', quantity: 10, status: 'active' }
    ],
    registrar: [
        { id: 24, serial_number: 'REG-2024-001', name: 'Filing Cabinet', quantity: 5, status: 'active' },
        { id: 25, serial_number: 'REG-2024-002', name: 'Document Scanner', quantity: 2, status: 'active' }
    ],
    saso: [
        { id: 26, serial_number: 'SAS-2024-001', name: 'Sound System', quantity: 1, status: 'active' },
        { id: 27, serial_number: 'SAS-2024-002', name: 'Event Chairs', quantity: 50, status: 'active' }
    ],
    cashier: [
        { id: 28, serial_number: 'CAS-2024-001', name: 'Cash Register', quantity: 2, status: 'active' },
        { id: 29, serial_number: 'CAS-2024-002', name: 'Receipt Printer', quantity: 2, status: 'active' }
    ]
};

// Department room data
const departmentRooms = {
    business: [
        { room: 'SOB faculty', type: '' },
        { room: 'Room 8', type: '' },
        { room: 'Room 11', type: '' },
        { room: 'Room 14', type: '' },
        { room: 'Room 16', type: '' },
        { room: 'Room 19', type: '' }
    ],
    education: [
        { room: 'SOE faculty', type: '' },
        { room: 'Room 7', type: '' },
        { room: 'Room 9', type: '' },
        { room: 'Room 10', type: '' },
        { room: 'Room 12', type: '' },
        { room: 'Room 13', type: '' },
        { room: 'Room 15', type: '' }
    ],
    technology: [
        { room: 'Faculty Room', type: 'SOT office' },
        { room: 'Room 17', type: '' },
        { room: 'Room 18', type: '' },
        { room: 'Room 19', type: 'Comtech Lab' },
        { room: 'Room 21', type: 'Electronic' },
        { room: 'Room 22', type: 'Comlab 2' },
        { room: 'Room 23', type: 'Audio Studio' },
        { room: 'Room 24', type: 'Speech Lab' },
        { room: 'Room 25', type: 'Comlab 1' }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    initializeDepartmentDashboard();
    addEventListeners();
});

function initializeDepartmentDashboard() {
    showDepartmentList();
}

function addEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterDepartments);
    }
    
    // Department filter
    const departmentFilter = document.getElementById('departmentFilter');
    if (departmentFilter) {
        departmentFilter.addEventListener('change', filterDepartments);
    }
}

function showDepartmentList() {
    document.getElementById('departmentView').style.display = 'block';
    document.getElementById('departmentDetailView').style.display = 'none';
    document.getElementById('assetDetailView').style.display = 'none';
    currentDepartment = null;
}

function showDepartmentAssets(department) {
    currentDepartment = department;
    
    // Update department title
    const titles = {
        business: 'SCHOOL OF BUSINESS',
        education: 'SCHOOL OF EDUCATION', 
        technology: 'SCHOOL OF TECHNOLOGY',
        library: 'LIBRARY',
        clinic: 'CLINIC',
        faculty: 'FACULTY',
        registrar: 'REGISTRAR',
        saso: 'SASO',
        cashier: 'CASHIER'
    };
    
    document.getElementById('departmentTitle').textContent = titles[department];
    
    // Show department detail view
    document.getElementById('departmentView').style.display = 'none';
    document.getElementById('departmentDetailView').style.display = 'block';
    document.getElementById('assetDetailView').style.display = 'none';
    
    // Load department content
    loadDepartmentContent(department);
}

function loadDepartmentContent(department) {
    const contentDiv = document.getElementById('departmentContent');
    
    if (department === 'business' || department === 'education' || department === 'technology') {
        // Show room layout for main schools
        const rooms = departmentRooms[department] || [];
        const hasType = department === 'technology';
        
        let content = `
            <div class="rooms-table">
                <div class="table-header">
                    <span>Room</span>
                    ${hasType ? '<span>Type</span>' : ''}
                    <span>Action</span>
                </div>
        `;
        
        rooms.forEach(room => {
            content += `
                <div class="room-row" onclick="exploreAssets('${department}', '${room.room}')">
                    <span>${room.room}</span>
                    ${hasType ? `<span>${room.type}</span>` : ''}
                    <span class="explore-btn">Explore asset</span>
                </div>
            `;
        });
        
        content += '</div>';
        contentDiv.innerHTML = content;
    } else {
        // Show asset table directly for other departments
        showAssetTable(department);
    }
}

function exploreAssets(department, room) {
    currentRoom = room;
    navigationHistory.push('departmentDetail');
    
    // Show asset view
    document.getElementById('departmentDetailView').style.display = 'none';
    document.getElementById('assetDetailView').style.display = 'block';
    
    // Update title
    document.getElementById('assetTitle').textContent = `${room.toUpperCase()} ASSETS`;
    
    // Load assets for the department
    loadAssets(department);
}

function showAssetTable(department) {
    navigationHistory.push('departmentList');
    
    // Show asset view
    document.getElementById('departmentDetailView').style.display = 'none';
    document.getElementById('assetDetailView').style.display = 'block';
    
    const titles = {
        library: 'LIBRARY',
        clinic: 'CLINIC',
        faculty: 'FACULTY',
        registrar: 'REGISTRAR',
        saso: 'SASO',
        cashier: 'CASHIER'
    };
    
    document.getElementById('assetTitle').textContent = titles[department];
    
    // Load assets for the department
    loadAssets(department);
}

function loadAssets(department) {
    const assets = departmentAssets[department] || [];
    const tableBody = document.getElementById('assetTableBody');
    
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    if (assets.length > 0) {
        assets.forEach(asset => {
            const row = createAssetRow(asset);
            tableBody.appendChild(row);
        });
    } else {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No assets found for this department</td></tr>';
    }
}

function createAssetRow(asset) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${asset.serial_number}</td>
        <td>${asset.name}</td>
        <td>${asset.quantity}</td>
        <td><span class="status-badge ${asset.status}">${asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}</span></td>
        <td>
            <button class="action-btn view" onclick="viewAsset('${asset.serial_number}')">View</button>
            <button class="action-btn edit" onclick="editAsset('${asset.serial_number}')">Edit</button>
            <button class="action-btn delete" onclick="deleteAsset('${asset.serial_number}', ${asset.id})">Delete</button>
        </td>
    `;
    return row;
}

function showDepartmentDetail() {
    document.getElementById('assetDetailView').style.display = 'none';
    document.getElementById('departmentDetailView').style.display = 'block';
}

function goBackFromAssets() {
    const lastView = navigationHistory.pop();
    
    if (lastView === 'departmentDetail') {
        // Go back to department detail view
        document.getElementById('assetDetailView').style.display = 'none';
        document.getElementById('departmentDetailView').style.display = 'block';
    } else {
        // Go back to department list
        showDepartmentList();
    }
}

function filterDepartments() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const departmentFilter = document.getElementById('departmentFilter')?.value || '';
    
    const departmentItems = document.querySelectorAll('.department-item');
    
    departmentItems.forEach(item => {
        const departmentName = item.textContent.toLowerCase();
        const departmentValue = item.getAttribute('onclick').match(/'([^']+)'/)[1];
        
        const matchesSearch = !searchTerm || departmentName.includes(searchTerm);
        const matchesFilter = !departmentFilter || departmentValue === departmentFilter;
        
        if (matchesSearch && matchesFilter) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Asset operations functions
function viewAsset(serialNumber) {
    // Find the asset
    let asset = null;
    for (let dept in departmentAssets) {
        asset = departmentAssets[dept].find(a => a.serial_number === serialNumber);
        if (asset) break;
    }
    
    if (!asset) {
        alert('Asset not found');
        return;
    }
    
    // Create view modal
    const modal = document.createElement('div');
    modal.className = 'asset-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Asset Details</h3>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="asset-details">
                    <div class="detail-row">
                        <label>Serial Number:</label>
                        <span>${asset.serial_number}</span>
                    </div>
                    <div class="detail-row">
                        <label>Asset Name:</label>
                        <span>${asset.name}</span>
                    </div>
                    <div class="detail-row">
                        <label>Quantity:</label>
                        <span>${asset.quantity}</span>
                    </div>
                    <div class="detail-row">
                        <label>Status:</label>
                        <span class="status-badge ${asset.status}">${asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentModal = modal;
}

function editAsset(serialNumber) {
    // Find the asset
    let asset = null;
    let assetDept = null;
    for (let dept in departmentAssets) {
        asset = departmentAssets[dept].find(a => a.serial_number === serialNumber);
        if (asset) {
            assetDept = dept;
            break;
        }
    }
    
    if (!asset) {
        alert('Asset not found');
        return;
    }
    
    // Create edit modal
    const modal = document.createElement('div');
    modal.className = 'asset-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Asset</h3>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editAssetForm">
                    <div class="form-group">
                        <label>Serial Number:</label>
                        <input type="text" id="editSerialNumber" value="${asset.serial_number}" readonly>
                    </div>
                    <div class="form-group">
                        <label>Asset Name:</label>
                        <input type="text" id="editAssetName" value="${asset.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Quantity:</label>
                        <input type="number" id="editQuantity" value="${asset.quantity}" min="1" required>
                    </div>
                    <div class="form-group">
                        <label>Status:</label>
                        <select id="editStatus" required>
                            <option value="active" ${asset.status === 'active' ? 'selected' : ''}>Active</option>
                            <option value="borrowed" ${asset.status === 'borrowed' ? 'selected' : ''}>Borrowed</option>
                            <option value="maintenance" ${asset.status === 'maintenance' ? 'selected' : ''}>Maintenance</option>
                            <option value="inactive" ${asset.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="saveAssetChanges('${serialNumber}', '${assetDept}')">Save Changes</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentModal = modal;
}

function saveAssetChanges(serialNumber, department) {
    const name = document.getElementById('editAssetName').value;
    const quantity = parseInt(document.getElementById('editQuantity').value);
    const status = document.getElementById('editStatus').value;
    
    if (!name || !quantity) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Update asset in data
    const asset = departmentAssets[department].find(a => a.serial_number === serialNumber);
    if (asset) {
        asset.name = name;
        asset.quantity = quantity;
        asset.status = status;
    }
    
    // Reload assets table
    loadAssets(currentDepartment);
    
    // Close modal
    closeModal();
    
    // Show success message
    showNotification(`Asset ${serialNumber} updated successfully`, 'success');
}

function deleteAsset(serialNumber, assetId) {
    // Create confirmation modal
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
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn btn-danger" onclick="confirmDelete('${serialNumber}', ${assetId})">Delete</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentModal = modal;
}

function confirmDelete(serialNumber, assetId) {
    // Remove from data and table
    for (let dept in departmentAssets) {
        const index = departmentAssets[dept].findIndex(asset => asset.id === assetId);
        if (index > -1) {
            departmentAssets[dept].splice(index, 1);
            break;
        }
    }
    
    // Reload current view
    if (currentDepartment) {
        loadAssets(currentDepartment);
    }
    
    // Close modal
    closeModal();
    
    // Show success message
    showNotification(`Asset ${serialNumber} deleted successfully`, 'success');
}

function closeModal() {
    if (window.currentModal) {
        window.currentModal.remove();
        window.currentModal = null;
    }
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

function addAsset() {
    alert('Add Asset functionality - to be implemented');
}

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    .department-view {
        padding: 20px;
    }
    
    .department-list {
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        margin-top: 20px;
    }
    
    .department-item {
        padding: 15px 20px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        transition: background-color 0.2s ease;
        font-weight: 500;
    }
    
    .department-item:hover {
        background: #f8f9fa;
    }
    
    .department-item:last-child {
        border-bottom: none;
    }
    
    .department-detail-view {
        padding: 20px;
    }
    
    .department-detail-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    
    .department-header {
        background: linear-gradient(135deg, #2e7d32, #4caf50);
        color: white;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .department-header h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        text-align: center;
        flex: 1;
    }
    
    .back-btn {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
    }
    
    .back-btn:hover {
        background: rgba(255, 255, 255, 0.3);
    }
    
    .rooms-table {
        width: 100%;
    }
    
    .table-header {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        background: #f5f5f5;
        padding: 15px 20px;
        font-weight: 600;
        color: #333;
        border-bottom: 1px solid #ddd;
    }
    
    .table-header span:nth-child(2) {
        text-align: center;
    }
    
    .table-header span:last-child {
        text-align: right;
    }
    
    .room-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        padding: 12px 20px;
        border-bottom: 1px solid #eee;
        align-items: center;
        transition: background-color 0.2s ease;
        cursor: pointer;
    }
    
    .room-row:hover {
        background: #f9f9f9;
    }
    
    .room-row:last-child {
        border-bottom: none;
    }
    
    .room-row span:nth-child(2) {
        text-align: center;
        color: #666;
        font-size: 14px;
    }
    
    .explore-btn {
        text-align: right;
        color: #4caf50;
        font-weight: 500;
        font-size: 14px;
    }
    
    .asset-detail-view {
        padding: 20px;
    }
    
    .asset-header {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 20px;
        padding: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        position: relative;
    }
    
    .asset-header .back-btn {
        background: #6c757d;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        position: absolute;
        left: 20px;
    }
    
    .asset-header .back-btn:hover {
        background: #5a6268;
        transform: translateY(-2px);
    }
    
    .asset-header h2 {
        color: #2e7d32;
        margin: 0;
        font-size: 24px;
        width: 100%;
        text-align: center;
        font-weight: 600;
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
    
    .action-btn {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        margin: 0 2px;
        transition: all 0.3s ease;
    }
    
    .action-btn.view {
        background: #2196f3;
        color: white;
    }
    
    .action-btn.view:hover {
        background: #1976d2;
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
    
    .search-bar {
        position: relative;
        flex: 1;
        min-width: 250px;
    }
    
    .search-bar i {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
    }
    
    .search-bar input {
        width: 100%;
        padding: 12px 15px 12px 45px;
        border: 2px solid #ddd;
        border-radius: 8px;
        font-size: 14px;
        transition: border-color 0.3s ease;
    }
    
    .search-bar input:focus {
        outline: none;
        border-color: #4caf50;
    }
    
    .filter-dropdown select {
        padding: 12px 15px;
        border: 2px solid #ddd;
        border-radius: 8px;
        font-size: 14px;
        background: white;
        cursor: pointer;
        transition: border-color 0.3s ease;
    }
    
    .filter-dropdown select:focus {
        outline: none;
        border-color: #4caf50;
    }
    
    .btn {
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
    }
    
    .btn-primary {
        background: #4caf50;
        color: white;
    }
    
    .btn-primary:hover {
        background: #45a049;
        transform: translateY(-2px);
    }
    
    .text-center {
        text-align: center;
        color: #666;
        font-style: italic;
    }
    
    /* Modal Styles */
    .asset-modal, .delete-confirmation-modal {
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
    
    .close-btn {
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
    
    .close-btn:hover {
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
    
    .asset-details {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
    }
    
    .detail-row:last-child {
        border-bottom: none;
    }
    
    .detail-row label {
        font-weight: 600;
        color: #333;
        min-width: 120px;
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
    .form-group select {
        width: 100%;
        padding: 10px;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 14px;
        transition: border-color 0.3s ease;
    }
    
    .form-group input:focus,
    .form-group select:focus {
        outline: none;
        border-color: #4caf50;
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
    
    .btn-danger {
        background: #dc3545;
        color: white;
    }
    
    .btn-danger:hover {
        background: #c82333;
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
