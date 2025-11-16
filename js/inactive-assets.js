// Inactive Assets functionality
document.addEventListener('DOMContentLoaded', function() {
    loadInactiveAssets();
    addEventListeners();
});

async function loadInactiveAssets() {
    try {
        const response = await fetch('../Api/assets/inactive.php');
        const data = await response.json();
        
        const tableBody = document.querySelector('.assets-table tbody');
        if (!tableBody) return;

        // Clear existing rows
        tableBody.innerHTML = '';

        if (data.records && data.records.length > 0) {
            data.records.forEach(asset => {
                const row = createInactiveAssetRow(asset);
                tableBody.appendChild(row);
            });
            
            // Add visual indicators after loading data
            addReasonIndicators();
            // Re-add event listeners for new buttons
            addEventListeners();
        } else {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No inactive assets found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading inactive assets:', error);
        const tableBody = document.querySelector('.assets-table tbody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Error loading inactive assets</td></tr>';
        }
    }
}

function createInactiveAssetRow(asset) {
    const row = document.createElement('tr');
    const dateDeactivated = asset.date_deactivated ? new Date(asset.date_deactivated).toLocaleDateString() : 'N/A';
    
    row.innerHTML = `
        <td>${asset.serial_number}</td>
        <td>${asset.name}</td>
        <td>${asset.department_name || 'N/A'}</td>
        <td>${asset.reason}</td>
        <td>${dateDeactivated}</td>
        <td class="action-buttons">
            <button type="button" class="btn btn-success" onclick="reactivateAsset(this, '${asset.serial_number}')">Reactivate</button>
            <button type="button" class="btn btn-info" onclick="viewAssetDetails(this, '${asset.serial_number}')">View Details</button>
        </td>
    `;
    
    return row;
}

function addReasonIndicators() {
    const rows = document.querySelectorAll('.assets-table tbody tr');
    rows.forEach(row => {
        const reason = row.cells[3].textContent.toLowerCase();
        let color = '#666';
        
        if (reason.includes('end of life') || reason.includes('beyond repair')) {
            color = '#d32f2f';
        } else if (reason.includes('performance') || reason.includes('hardware failure')) {
            color = '#ac8329';
        } else if (reason.includes('replaced')) {
            color = '#1976d2';
        }
        
        row.cells[3].style.color = color;
        row.cells[3].style.fontWeight = '600';
    });
}

function sortByDeactivationDate() {
    const tbody = document.querySelector('.assets-table tbody');
    const rows = Array.from(tbody.children);
    
    rows.sort((a, b) => {
        const dateA = new Date(a.cells[4].textContent);
        const dateB = new Date(b.cells[4].textContent);
        return dateB - dateA; // Newest first
    });
    
    rows.forEach(row => tbody.appendChild(row));
}

function addEventListeners() {
    // Reactivate buttons
    const reactivateButtons = document.querySelectorAll('.btn-success');
    reactivateButtons.forEach(btn => {
        if (btn.textContent.includes('Reactivate')) {
            btn.addEventListener('click', function() {
                reactivateAsset(this);
            });
        }
    });
    
    // Dispose buttons removed - no longer needed
    
    // View Details buttons
    const detailButtons = document.querySelectorAll('.btn-info');
    detailButtons.forEach(btn => {
        if (btn.textContent.includes('View Details')) {
            btn.addEventListener('click', function() {
                viewAssetDetails(this);
            });
        }
    });
}

async function reactivateAsset(button, serialNumber) {
    const row = button.closest('tr');
    const assetName = row.cells[1].textContent;
    const reason = row.cells[3].textContent;
    
    // Check if asset can be reactivated
    if (reason.toLowerCase().includes('beyond repair') || reason.toLowerCase().includes('end of life')) {
        showNotification(`Cannot reactivate ${assetName} - ${reason}`, 'error');
        return;
    }
    
    const confirmation = confirm(`Reactivate ${assetName} (${serialNumber})?\n\nThis will move the asset back to active status.`);
    
    if (confirmation) {
        try {
            const response = await fetch('../Api/assets/reactivate.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    serial_number: serialNumber
                })
            });

            const result = await response.json();

            if (response.ok) {
                // Add reactivation animation
                row.style.backgroundColor = '#e8f5e8';
                row.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    row.style.opacity = '0';
                    setTimeout(() => {
                        row.remove();
                        showNotification(`${assetName} has been reactivated successfully!`, 'success');
                    }, 300);
                }, 1000);
            } else {
                showNotification(result.message || 'Failed to reactivate asset', 'error');
            }
        } catch (error) {
            console.error('Error reactivating asset:', error);
            showNotification('Error reactivating asset. Please try again.', 'error');
        }
    }
}

// Dispose function removed - no longer needed

async function viewAssetDetails(button, serialNumber) {
    // Create loading modal first
    const modal = document.createElement('div');
    modal.className = 'asset-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Asset Details - ${serialNumber}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="loading">Loading asset details...</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    try {
        // Fetch real asset details
        const response = await fetch(`../Api/assets/details.php?serial_number=${serialNumber}`);
        const asset = await response.json();
        
        const modalBody = modal.querySelector('.modal-body');
        
        if (response.ok && asset) {
            const purchaseDate = asset.purchase_date ? new Date(asset.purchase_date).toLocaleDateString() : 'N/A';
            const dateDeactivated = asset.updated_at ? new Date(asset.updated_at).toLocaleDateString() : 'N/A';
            
            // Determine reason from notes or condition
            let reason = 'Not Specified';
            const notes = asset.notes?.toLowerCase() || '';
            if (asset.condition_status === 'poor') {
                reason = 'Poor Condition';
            } else if (notes.includes('end of life')) {
                reason = 'End of Life';
            } else if (notes.includes('beyond repair')) {
                reason = 'Beyond Repair';
            } else if (notes.includes('hardware failure')) {
                reason = 'Hardware Failure';
            } else if (notes.includes('replaced')) {
                reason = 'Replaced by New Model';
            } else if (notes.includes('performance')) {
                reason = 'Performance Issues';
            }
            
            modalBody.innerHTML = `
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Serial Number:</strong>
                        <span>${asset.serial_number}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Asset Name:</strong>
                        <span>${asset.name}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Department:</strong>
                        <span>${asset.department_name || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Category:</strong>
                        <span>${asset.category_name || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Reason for Deactivation:</strong>
                        <span>${reason}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Date Deactivated:</strong>
                        <span>${dateDeactivated}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Last Known Location:</strong>
                        <span>${asset.location || asset.department_name || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Purchase Date:</strong>
                        <span>${purchaseDate}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Condition:</strong>
                        <span>${asset.condition_status?.charAt(0).toUpperCase() + asset.condition_status?.slice(1) || 'N/A'}</span>
                    </div>
                    ${asset.description ? `
                    <div class="detail-item">
                        <strong>Description:</strong>
                        <span>${asset.description}</span>
                    </div>
                    ` : ''}
                    ${asset.notes ? `
                    <div class="detail-item">
                        <strong>Notes:</strong>
                        <span>${asset.notes}</span>
                    </div>
                    ` : ''}
                </div>
            `;
        } else {
            modalBody.innerHTML = '<div class="error">Error loading asset details.</div>';
        }
    } catch (error) {
        console.error('Error loading asset details:', error);
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = '<div class="error">Error loading asset details.</div>';
    }
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
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

// Add CSS for modal and animations
const style = document.createElement('style');
style.textContent = `
    .asset-modal {
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
        border-radius: 10px;
        width: 90%;
        max-width: 500px;
        animation: slideUp 0.3s ease;
    }
    
    .modal-header {
        padding: 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .modal-header h3 {
        color: #1a6c25;
        margin: 0;
    }
    
    .close-modal {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .detail-grid {
        display: grid;
        gap: 15px;
    }
    
    .detail-item {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 5px;
    }
    
    .detail-item strong {
        color: #1a6c25;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    .loading {
        text-align: center;
        padding: 40px;
        color: #666;
        font-size: 16px;
    }
    
    .error {
        text-align: center;
        padding: 40px;
        color: #f44336;
        font-size: 16px;
    }
    
    .text-center {
        text-align: center;
        padding: 20px;
        color: #666;
    }
`;
document.head.appendChild(style);
