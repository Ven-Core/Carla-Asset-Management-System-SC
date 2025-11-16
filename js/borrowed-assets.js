// Borrowed Assets functionality
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Filter functionality
    const statusFilter = document.getElementById('statusFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    
    if (departmentFilter) {
        departmentFilter.addEventListener('change', applyFilters);
    }
}

// Enhanced search handler
function handleSearch() {
    applyFilters();
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value.toLowerCase() || '';
    const departmentFilter = document.getElementById('departmentFilter')?.value.toLowerCase() || '';
    
    const rows = document.querySelectorAll('.asset-table tbody tr');
    
    rows.forEach(row => {
        const serialNum = row.cells[0].textContent.toLowerCase();
        const assetName = row.cells[1].textContent.toLowerCase();
        const borrower = row.cells[2].textContent.toLowerCase();
        const department = row.cells[3].textContent.toLowerCase();
        const status = row.dataset.status || '';
        
        const matchesSearch = !searchTerm || 
            serialNum.includes(searchTerm) || 
            assetName.includes(searchTerm) || 
            borrower.includes(searchTerm) || 
            department.includes(searchTerm);
        
        const matchesStatus = !statusFilter || status === statusFilter;
        
        const matchesDepartment = !departmentFilter || 
            department.includes(departmentFilter.replace('-', ' '));
        
        if (matchesSearch && matchesStatus && matchesDepartment) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Filter handler
function filterTable() {
    const filters = document.querySelectorAll('.filter-dropdown select');
    const statusValue = (filters[0]?.value || '').toLowerCase();
    const departmentValue = (filters[1]?.value || '').toLowerCase();
    const rows = document.querySelectorAll('.assets-table tbody tr');

    rows.forEach(row => {
        const status = row.cells[5]?.textContent.toLowerCase() || '';
        const department = row.cells[2]?.textContent.toLowerCase() || '';
        const statusMatch = !statusValue || status.includes(statusValue);
        const departmentMatch = !departmentValue || department.includes(departmentValue);
        row.style.display = statusMatch && departmentMatch ? '' : 'none';
    });
}

// Return modal logic
function openReturnModal(serial, name) {
    const serialEl = document.getElementById('assetSerial');
    const nameEl = document.getElementById('assetName');
    const modal = document.getElementById('returnModal');
    if (!serialEl || !nameEl || !modal) return;
    serialEl.value = serial;
    nameEl.value = name;
    modal.style.display = 'flex';
}

function closeReturnModal() {
    const modal = document.getElementById('returnModal');
    if (modal) modal.style.display = 'none';
}

function processReturn() {
    const serial = document.getElementById('assetSerial')?.value;
    const returnDate = document.getElementById('returnDate')?.value;
    const condition = document.getElementById('condition')?.value;
    const notes = document.getElementById('notes')?.value || '';

    if (!condition || !returnDate) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Update the asset data
    const asset = borrowedAssets.find(a => a.serialNumber === serial);
    if (asset) {
        asset.status = 'returned';
        asset.condition = condition;
        asset.notes = notes || asset.notes;
        asset.returnDate = returnDate;
        
        // Reload the table
        loadBorrowedAssetsTable();
        
        showNotification(`Asset ${serial} has been returned successfully`, 'success');
        closeReturnModal();
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('returnModal');
    if (modal && event.target === modal) {
        closeReturnModal();
    }
});

// Toggle search section
function toggleSearch() {
    const searchSection = document.getElementById('searchSection');
    if (searchSection) {
        searchSection.style.display = searchSection.style.display === 'none' ? 'block' : 'none';
    }
}

// Clear filters
function clearFilters() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    
    if (searchInput) searchInput.value = '';
    if (statusFilter) statusFilter.value = '';
    if (departmentFilter) departmentFilter.value = '';
    
    // Reset table display
    const rows = document.querySelectorAll('.asset-table tbody tr');
    rows.forEach(row => row.style.display = '');
    
    showNotification('Filters cleared', 'info');
}

// Enhanced view asset function
function viewAsset(serialNum) {
    const asset = borrowedAssets.find(a => a.serialNumber === serialNum);
    if (!asset) {
        showNotification('Asset not found', 'error');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'viewModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Asset Details - ${asset.serialNumber}</h3>
                <button class="close-modal" onclick="closeViewModal()">&times;</button>
            </div>
            <div class="modal-form">
                <div class="asset-details">
                    <div class="detail-row">
                        <label>Serial Number:</label>
                        <span>${asset.serialNumber}</span>
                    </div>
                    <div class="detail-row">
                        <label>Asset Name:</label>
                        <span>${asset.assetName}</span>
                    </div>
                    <div class="detail-row">
                        <label>Borrower:</label>
                        <span>${asset.borrower}</span>
                    </div>
                    <div class="detail-row">
                        <label>Department:</label>
                        <span>${asset.department}</span>
                    </div>
                    <div class="detail-row">
                        <label>Borrowed Date:</label>
                        <span>${formatDate(asset.borrowedDate)}</span>
                    </div>
                    <div class="detail-row">
                        <label>Due Date:</label>
                        <span>${formatDate(asset.dueDate)}</span>
                    </div>
                    <div class="detail-row">
                        <label>Status:</label>
                        <span class="status-badge ${asset.status}">${asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}</span>
                    </div>
                    <div class="detail-row">
                        <label>Condition:</label>
                        <span>${asset.condition.charAt(0).toUpperCase() + asset.condition.slice(1)}</span>
                    </div>
                    <div class="detail-row">
                        <label>Notes:</label>
                        <span>${asset.notes}</span>
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-cancel" onclick="closeViewModal()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function closeViewModal() {
    const modal = document.getElementById('viewModal');
    if (modal) {
        modal.remove();
    }
}

// Enhanced extend functionality
function openExtendModal(serialNum, assetName) {
    const asset = borrowedAssets.find(a => a.serialNumber === serialNum);
    if (!asset) {
        showNotification('Asset not found', 'error');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'extendModal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Extend Borrowing Period</h3>
                <button class="close-modal" onclick="closeExtendModal()">&times;</button>
            </div>
            <div class="modal-form">
                <div class="form-group">
                    <label for="extendSerial">Serial Number</label>
                    <input type="text" id="extendSerial" value="${serialNum}" readonly>
                </div>
                <div class="form-group">
                    <label for="extendAssetName">Asset Name</label>
                    <input type="text" id="extendAssetName" value="${assetName}" readonly>
                </div>
                <div class="form-group">
                    <label for="currentDueDate">Current Due Date</label>
                    <input type="text" id="currentDueDate" value="${formatDate(asset.dueDate)}" readonly>
                </div>
                <div class="form-group">
                    <label for="newDueDate">New Due Date *</label>
                    <input type="date" id="newDueDate" required>
                </div>
                <div class="form-group">
                    <label for="extendReason">Reason for Extension *</label>
                    <textarea id="extendReason" placeholder="Please provide a reason for the extension..." required></textarea>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-cancel" onclick="closeExtendModal()">Cancel</button>
                <button class="btn btn-submit" onclick="processExtension()">Extend Period</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('newDueDate').min = tomorrow.toISOString().split('T')[0];
}

function closeExtendModal() {
    const modal = document.getElementById('extendModal');
    if (modal) {
        modal.remove();
    }
}

function processExtension() {
    const serialNum = document.getElementById('extendSerial').value;
    const newDueDate = document.getElementById('newDueDate').value;
    const reason = document.getElementById('extendReason').value.trim();
    
    if (!newDueDate || !reason) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Update the asset data
    const asset = borrowedAssets.find(a => a.serialNumber === serialNum);
    if (asset) {
        asset.dueDate = newDueDate;
        asset.notes += ` | Extended on ${new Date().toLocaleDateString()}: ${reason}`;
        
        // Reload the table
        loadBorrowedAssetsTable();
        
        showNotification(`Due date extended for ${asset.assetName}`, 'success');
        closeExtendModal();
    }
}

function checkOverdueAssets() {
    const overdueRows = document.querySelectorAll('.status-overdue');
    overdueRows.forEach(row => {
        const parentRow = row.closest('tr');
        if (parentRow) {
            parentRow.style.backgroundColor = '#ffebee';
        }
    });
}

function updateStatusBadges() {
    const statusBadges = document.querySelectorAll('.status-badge');
    statusBadges.forEach(badge => {
        if (badge.textContent === 'Overdue') {
            badge.style.animation = 'pulse 2s infinite';
        }
    });
}

function addEventListeners() {
    // Mark Returned buttons
    const returnButtons = document.querySelectorAll('.btn-success');
    returnButtons.forEach(btn => {
        if (btn.textContent.includes('Mark Returned')) {
            btn.addEventListener('click', function() {
                markAsReturned(this);
            });
        }
    });
    
    // Extend buttons
    const extendButtons = document.querySelectorAll('.btn-warning');
    extendButtons.forEach(btn => {
        if (btn.textContent.includes('Extend')) {
            btn.addEventListener('click', function() {
                extendBorrowPeriod(this);
            });
        }
    });
    
    // Send Reminder buttons
    const reminderButtons = document.querySelectorAll('.btn-danger');
    reminderButtons.forEach(btn => {
        if (btn.textContent.includes('Send Reminder')) {
            btn.addEventListener('click', function() {
                sendReminder(this);
            });
        }
    });
}

function markAsReturned(button) {
    const row = button.closest('tr');
    const assetName = row.cells[0].textContent;
    
    if (confirm(`Mark ${assetName} as returned?`)) {
        // Simulate API call
        setTimeout(() => {
            row.style.opacity = '0.5';
            button.textContent = 'Returned';
            button.disabled = true;
            button.className = 'btn btn-secondary';
            
            showNotification(`${assetName} marked as returned successfully!`, 'success');
        }, 500);
    }
}

function extendBorrowPeriod(button) {
    const row = button.closest('tr');
    const assetName = row.cells[0].textContent;
    const currentDueDate = row.cells[4].textContent;
    
    const newDate = prompt(`Extend due date for ${assetName}\nCurrent due date: ${currentDueDate}\nEnter new due date (MM/DD/YYYY):`);
    
    if (newDate && isValidDate(newDate)) {
        // Simulate API call
        setTimeout(() => {
            row.cells[4].textContent = newDate;
            const statusBadge = row.querySelector('.status-badge');
            statusBadge.textContent = 'Extended';
            statusBadge.className = 'status-badge status-borrowed';
            
            showNotification(`Due date extended for ${assetName}`, 'success');
        }, 500);
    }
}

function sendReminder(button) {
    const row = button.closest('tr');
    const assetName = row.cells[0].textContent;
    const borrower = row.cells[1].textContent;
    
    if (confirm(`Send overdue reminder to ${borrower} for ${assetName}?`)) {
        // Simulate API call
        setTimeout(() => {
            button.textContent = 'Reminder Sent';
            button.disabled = true;
            button.className = 'btn btn-secondary';
            
            showNotification(`Reminder sent to ${borrower}`, 'success');
        }, 500);
    }
}

function isValidDate(dateString) {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(dateString);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.backgroundColor = '#2e7d32';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#d32f2f';
    } else {
        notification.style.backgroundColor = '#1976d2';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for animations and modal styles
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    .asset-details {
        display: flex;
        flex-direction: column;
        gap: 12px;
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
        min-width: 140px;
    }
    
    .detail-row span {
        color: #666;
        text-align: right;
        flex: 1;
    }
    
    .status-badge.borrowed {
        background: #fff3e0;
        color: #f57c00;
    }
    
    .status-badge.overdue {
        background: #ffebee;
        color: #d32f2f;
        animation: pulse 2s infinite;
    }
    
    .status-badge.returned {
        background: #e8f5e8;
        color: #2e7d32;
    }
    
    .action-btn {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        margin: 0 2px;
        transition: all 0.3s ease;
        font-weight: 500;
    }
    
    .action-btn.view {
        background: #2196f3;
        color: white;
    }
    
    .action-btn.view:hover {
        background: #1976d2;
        transform: translateY(-1px);
    }
    
    .action-btn.return {
        background: #4caf50;
        color: white;
    }
    
    .action-btn.return:hover {
        background: #45a049;
        transform: translateY(-1px);
    }
    
    .action-btn.extend {
        background: #ff9800;
        color: white;
    }
    
    .action-btn.extend:hover {
        background: #f57c00;
        transform: translateY(-1px);
    }
    
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }
    
    .modal-content {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 600px;
        animation: slideUp 0.3s ease;
        overflow: hidden;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .modal-header {
        padding: 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8f9fa;
    }
    
    .modal-title {
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
    
    .modal-form {
        padding: 20px;
    }
    
    .modal-actions {
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
    
    .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .btn-cancel {
        background: #6c757d;
        color: white;
    }
    
    .btn-cancel:hover {
        background: #5a6268;
    }
    
    .btn-submit {
        background: #4caf50;
        color: white;
    }
    
    .btn-submit:hover {
        background: #45a049;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
