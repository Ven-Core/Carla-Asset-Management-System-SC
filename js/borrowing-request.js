// Borrowing Request Dashboard functionality
// Sample borrowing request data
const borrowingRequests = [
    {
        id: 1,
        assetNumber: 'ASSET-2024-001',
        assetName: 'Dell Optiplex 3070 Desktop',
        borrower: 'John Doe',
        borrowerEmail: 'john.doe@mcc.edu.ph',
        department: 'School of Technology',
        dateRequested: '2024-10-08',
        dateNeeded: '2024-10-15',
        returnDate: '2024-10-22',
        purpose: 'Computer Programming Class',
        status: 'pending'
    },
    {
        id: 2,
        assetNumber: 'ASSET-2024-003',
        assetName: 'HP Laptop ProBook 450 G8',
        borrower: 'Jane Smith',
        borrowerEmail: 'jane.smith@mcc.edu.ph',
        department: 'School of Education',
        dateRequested: '2024-10-07',
        dateNeeded: '2024-10-14',
        returnDate: '2024-10-21',
        purpose: 'Online Teaching Session',
        status: 'approved'
    },
    {
        id: 3,
        assetNumber: 'ASSET-2024-002',
        assetName: 'Epson Projector EB-980W',
        borrower: 'Mike Johnson',
        borrowerEmail: 'mike.johnson@mcc.edu.ph',
        department: 'School of Business',
        dateRequested: '2024-10-06',
        dateNeeded: '2024-10-13',
        returnDate: '2024-10-20',
        purpose: 'Business Presentation',
        status: 'rejected'
    },
    {
        id: 4,
        assetNumber: 'ASSET-2024-005',
        assetName: 'Yamaha Audio System',
        borrower: 'Sarah Wilson',
        borrowerEmail: 'sarah.wilson@mcc.edu.ph',
        department: 'Speech Lab',
        dateRequested: '2024-10-09',
        dateNeeded: '2024-10-16',
        returnDate: '2024-10-23',
        purpose: 'Speech Training Workshop',
        status: 'pending'
    },
    {
        id: 5,
        assetNumber: 'ASSET-2024-006',
        assetName: 'Smart TV Samsung 55"',
        borrower: 'Robert Brown',
        borrowerEmail: 'robert.brown@mcc.edu.ph',
        department: 'Library',
        dateRequested: '2024-10-05',
        dateNeeded: '2024-10-12',
        returnDate: '2024-10-19',
        purpose: 'Library Orientation Program',
        status: 'approved'
    }
];

// Add immediate test to verify script is loading
console.log('🚀 Borrowing Request JavaScript file loaded successfully!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 DOM Content Loaded - Initializing Borrowing Dashboard');
    console.log('📊 Sample data available:', borrowingRequests.length, 'requests');
    
    // Test if table body exists
    const tableBody = document.getElementById('requestsTableBody');
    console.log('🎯 Table body found:', tableBody ? 'YES' : 'NO');
    
    initializeBorrowingDashboard();
});

function initializeBorrowingDashboard() {
    console.log('Initializing borrowing dashboard...');
    loadBorrowingRequests();
    updateStatistics();
}

function loadBorrowingRequests() {
    const tableBody = document.getElementById('requestsTableBody');
    if (!tableBody) {
        console.error('❌ Table body element not found!');
        console.log('🔍 Available elements with ID:', document.querySelectorAll('[id]'));
        return;
    }
    
    console.log('✅ Loading borrowing requests...', borrowingRequests);
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add a simple test row first
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #666;">🔄 Loading requests...</td></tr>';
    
    // Small delay to show loading message
    setTimeout(() => {
        tableBody.innerHTML = '';
        
        // Add borrowing requests
        borrowingRequests.forEach((request, index) => {
            console.log(`📝 Creating row ${index + 1}:`, request.assetNumber);
            const row = createRequestRow(request);
            tableBody.appendChild(row);
        });
        
        console.log('✅ Borrowing requests loaded successfully:', borrowingRequests.length, 'rows added');
    }, 100);
}

function createRequestRow(request) {
    const row = document.createElement('tr');
    row.dataset.requestId = request.id;
    
    const actionButtons = getActionButtons(request);
    
    row.innerHTML = `
        <td>${request.assetNumber}</td>
        <td>${request.assetName}</td>
        <td>
            <div class="borrower-info">
                <strong>${request.borrower}</strong><br>
                <small>${request.department}</small>
            </div>
        </td>
        <td>${formatDate(request.dateRequested)}</td>
        <td><span class="status-badge ${request.status}">${request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span></td>
        <td>${actionButtons}</td>
    `;
    return row;
}

function getActionButtons(request) {
    if (request.status === 'pending') {
        return `
            <button class="action-btn approve-btn" onclick="approveRequest(${request.id})">Approve</button>
            <button class="action-btn reject-btn" onclick="rejectRequest(${request.id})">Reject</button>
            <button class="action-btn view-btn" onclick="viewRequest(${request.id})">View</button>
        `;
    } else if (request.status === 'approved') {
        return `
            <button class="action-btn view-btn" onclick="viewRequest(${request.id})">View</button>
            <button class="action-btn edit-btn" onclick="editRequest(${request.id})">Edit</button>
        `;
    } else if (request.status === 'rejected') {
        return `
            <button class="action-btn view-btn" onclick="viewRequest(${request.id})">View</button>
            <button class="action-btn delete-btn" onclick="deleteRequest(${request.id})">Delete</button>
        `;
    }
}

function updateStatistics() {
    const total = borrowingRequests.length;
    const approved = borrowingRequests.filter(req => req.status === 'approved').length;
    const pending = borrowingRequests.filter(req => req.status === 'pending').length;
    const rejected = borrowingRequests.filter(req => req.status === 'rejected').length;
    
    // Update statistics in the panel (you can add counters to the HTML if needed)
    console.log(`Statistics - Total: ${total}, Approved: ${approved}, Pending: ${pending}, Rejected: ${rejected}`);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function approveRequest(requestId) {
    const request = borrowingRequests.find(req => req.id === requestId);
    if (!request) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Approve Borrowing Request</h3>
                <button class="close-modal" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to approve this borrowing request?</p>
                <div class="request-summary">
                    <p><strong>Asset:</strong> ${request.assetName}</p>
                    <p><strong>Borrower:</strong> ${request.borrower}</p>
                    <p><strong>Purpose:</strong> ${request.purpose}</p>
                    <p><strong>Date Needed:</strong> ${formatDate(request.dateNeeded)}</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="confirmApproval(${requestId})">Approve Request</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentModal = modal;
}

function confirmApproval(requestId) {
    const request = borrowingRequests.find(req => req.id === requestId);
    if (request) {
        request.status = 'approved';
        loadBorrowingRequests();
        updateStatistics();
        closeModal();
        showNotification(`Request for ${request.assetName} has been approved`, 'success');
    }
}

function rejectRequest(requestId) {
    const request = borrowingRequests.find(req => req.id === requestId);
    if (!request) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Reject Borrowing Request</h3>
                <button class="close-modal" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="request-summary">
                    <p><strong>Asset:</strong> ${request.assetName}</p>
                    <p><strong>Borrower:</strong> ${request.borrower}</p>
                    <p><strong>Purpose:</strong> ${request.purpose}</p>
                </div>
                <div class="form-group">
                    <label>Reason for Rejection *</label>
                    <textarea id="rejectionReason" rows="3" placeholder="Please provide a reason for rejection..." required></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="confirmRejection(${requestId})">Reject Request</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentModal = modal;
}

function confirmRejection(requestId) {
    const reason = document.getElementById('rejectionReason').value.trim();
    if (!reason) {
        alert('Please provide a reason for rejection');
        return;
    }
    
    const request = borrowingRequests.find(req => req.id === requestId);
    if (request) {
        request.status = 'rejected';
        request.rejectionReason = reason;
        loadBorrowingRequests();
        updateStatistics();
        closeModal();
        showNotification(`Request for ${request.assetName} has been rejected`, 'success');
    }
}

function viewRequest(requestId) {
    const request = borrowingRequests.find(req => req.id === requestId);
    if (!request) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Borrowing Request Details</h3>
                <button class="close-modal" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="request-details">
                    <div class="detail-row">
                        <label>Asset Number:</label>
                        <span>${request.assetNumber}</span>
                    </div>
                    <div class="detail-row">
                        <label>Asset Name:</label>
                        <span>${request.assetName}</span>
                    </div>
                    <div class="detail-row">
                        <label>Borrower:</label>
                        <span>${request.borrower}</span>
                    </div>
                    <div class="detail-row">
                        <label>Email:</label>
                        <span>${request.borrowerEmail}</span>
                    </div>
                    <div class="detail-row">
                        <label>Department:</label>
                        <span>${request.department}</span>
                    </div>
                    <div class="detail-row">
                        <label>Date Requested:</label>
                        <span>${formatDate(request.dateRequested)}</span>
                    </div>
                    <div class="detail-row">
                        <label>Date Needed:</label>
                        <span>${formatDate(request.dateNeeded)}</span>
                    </div>
                    <div class="detail-row">
                        <label>Return Date:</label>
                        <span>${formatDate(request.returnDate)}</span>
                    </div>
                    <div class="detail-row">
                        <label>Purpose:</label>
                        <span>${request.purpose}</span>
                    </div>
                    <div class="detail-row">
                        <label>Status:</label>
                        <span class="status-badge ${request.status}">${request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                    </div>
                    ${request.rejectionReason ? `
                    <div class="detail-row">
                        <label>Rejection Reason:</label>
                        <span>${request.rejectionReason}</span>
                    </div>
                    ` : ''}
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

function editRequest(requestId) {
    const request = borrowingRequests.find(req => req.id === requestId);
    if (!request) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Borrowing Request</h3>
                <button class="close-modal" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form class="edit-request-form">
                    <div class="form-group">
                        <label>Borrower Name *</label>
                        <input type="text" id="editBorrower" value="${request.borrower}" required>
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" id="editEmail" value="${request.borrowerEmail}" required>
                    </div>
                    <div class="form-group">
                        <label>Department *</label>
                        <select id="editDepartment" required>
                            <option value="School of Technology" ${request.department === 'School of Technology' ? 'selected' : ''}>School of Technology</option>
                            <option value="School of Education" ${request.department === 'School of Education' ? 'selected' : ''}>School of Education</option>
                            <option value="School of Business" ${request.department === 'School of Business' ? 'selected' : ''}>School of Business</option>
                            <option value="Library" ${request.department === 'Library' ? 'selected' : ''}>Library</option>
                            <option value="Speech Lab" ${request.department === 'Speech Lab' ? 'selected' : ''}>Speech Lab</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date Needed *</label>
                        <input type="date" id="editDateNeeded" value="${request.dateNeeded}" required>
                    </div>
                    <div class="form-group">
                        <label>Return Date *</label>
                        <input type="date" id="editReturnDate" value="${request.returnDate}" required>
                    </div>
                    <div class="form-group">
                        <label>Purpose *</label>
                        <textarea id="editPurpose" rows="3" required>${request.purpose}</textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="saveRequestEdit(${requestId})">Save Changes</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentModal = modal;
}

function saveRequestEdit(requestId) {
    const borrower = document.getElementById('editBorrower').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const department = document.getElementById('editDepartment').value;
    const dateNeeded = document.getElementById('editDateNeeded').value;
    const returnDate = document.getElementById('editReturnDate').value;
    const purpose = document.getElementById('editPurpose').value.trim();
    
    if (!borrower || !email || !department || !dateNeeded || !returnDate || !purpose) {
        alert('Please fill in all required fields');
        return;
    }
    
    const request = borrowingRequests.find(req => req.id === requestId);
    if (request) {
        request.borrower = borrower;
        request.borrowerEmail = email;
        request.department = department;
        request.dateNeeded = dateNeeded;
        request.returnDate = returnDate;
        request.purpose = purpose;
        
        loadBorrowingRequests();
        closeModal();
        showNotification(`Request for ${request.assetName} updated successfully`, 'success');
    }
}

function deleteRequest(requestId) {
    const request = borrowingRequests.find(req => req.id === requestId);
    if (!request) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Delete Borrowing Request</h3>
                <button class="close-modal" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="warning-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <p>Are you sure you want to delete this borrowing request?</p>
                <div class="request-summary">
                    <p><strong>Asset:</strong> ${request.assetName}</p>
                    <p><strong>Borrower:</strong> ${request.borrower}</p>
                </div>
                <p class="warning-text">This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="confirmDelete(${requestId})">Delete Request</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentModal = modal;
}

function confirmDelete(requestId) {
    const index = borrowingRequests.findIndex(req => req.id === requestId);
    if (index > -1) {
        const request = borrowingRequests[index];
        borrowingRequests.splice(index, 1);
        loadBorrowingRequests();
        updateStatistics();
        closeModal();
        showNotification(`Request for ${request.assetName} deleted successfully`, 'success');
    }
}

function addBorrowRequest() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add New Borrowing Request</h3>
                <button class="close-modal" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form class="add-request-form">
                    <div class="form-group">
                        <label>Asset Number *</label>
                        <input type="text" id="addAssetNumber" placeholder="Enter asset number" required>
                    </div>
                    <div class="form-group">
                        <label>Asset Name *</label>
                        <input type="text" id="addAssetName" placeholder="Enter asset name" required>
                    </div>
                    <div class="form-group">
                        <label>Borrower Name *</label>
                        <input type="text" id="addBorrower" placeholder="Enter borrower name" required>
                    </div>
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" id="addEmail" placeholder="Enter email address" required>
                    </div>
                    <div class="form-group">
                        <label>Department *</label>
                        <select id="addDepartment" required>
                            <option value="">Select Department</option>
                            <option value="School of Technology">School of Technology</option>
                            <option value="School of Education">School of Education</option>
                            <option value="School of Business">School of Business</option>
                            <option value="Library">Library</option>
                            <option value="Speech Lab">Speech Lab</option>
                            <option value="Clinic">Clinic</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Date Needed *</label>
                        <input type="date" id="addDateNeeded" required>
                    </div>
                    <div class="form-group">
                        <label>Return Date *</label>
                        <input type="date" id="addReturnDate" required>
                    </div>
                    <div class="form-group">
                        <label>Purpose *</label>
                        <textarea id="addPurpose" rows="3" placeholder="Enter purpose for borrowing..." required></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="saveNewRequest()">Add Request</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    window.currentModal = modal;
}

function saveNewRequest() {
    const assetNumber = document.getElementById('addAssetNumber').value.trim();
    const assetName = document.getElementById('addAssetName').value.trim();
    const borrower = document.getElementById('addBorrower').value.trim();
    const email = document.getElementById('addEmail').value.trim();
    const department = document.getElementById('addDepartment').value;
    const dateNeeded = document.getElementById('addDateNeeded').value;
    const returnDate = document.getElementById('addReturnDate').value;
    const purpose = document.getElementById('addPurpose').value.trim();
    
    if (!assetNumber || !assetName || !borrower || !email || !department || !dateNeeded || !returnDate || !purpose) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newId = Math.max(...borrowingRequests.map(req => req.id)) + 1;
    const today = new Date().toISOString().split('T')[0];
    
    const newRequest = {
        id: newId,
        assetNumber: assetNumber,
        assetName: assetName,
        borrower: borrower,
        borrowerEmail: email,
        department: department,
        dateRequested: today,
        dateNeeded: dateNeeded,
        returnDate: returnDate,
        purpose: purpose,
        status: 'pending'
    };
    
    borrowingRequests.push(newRequest);
    loadBorrowingRequests();
    updateStatistics();
    closeModal();
    showNotification(`New borrowing request for ${assetName} added successfully`, 'success');
}

function refreshRequests() {
    loadBorrowingRequests();
    updateStatistics();
    showNotification('Borrowing requests refreshed', 'info');
}

function closeModal() {
    if (window.currentModal) {
        window.currentModal.remove();
        window.currentModal = null;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for additional styling
const additionalStyle = document.createElement('style');
additionalStyle.textContent = `
    .borrower-info {
        line-height: 1.4;
    }
    
    .borrower-info small {
        color: #666;
        font-size: 11px;
    }
    
    .request-summary {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin: 15px 0;
    }
    
    .request-summary p {
        margin: 5px 0;
    }
    
    .request-details {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
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
`;

document.head.appendChild(additionalStyle);
