// Maintenance functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeMaintenance();
    addEventListeners();
});

function initializeMaintenance() {
    // Sort maintenance cards by priority
    sortMaintenanceByPriority();
    
    // Update progress indicators
    updateProgressIndicators();
}

function sortMaintenanceByPriority() {
    const grid = document.querySelector('.maintenance-grid');
    const cards = Array.from(grid.children);
    
    cards.sort((a, b) => {
        const priorityA = a.querySelector('.maintenance-priority').textContent.toLowerCase();
        const priorityB = b.querySelector('.maintenance-priority').textContent.toLowerCase();
        
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[priorityB] - priorityOrder[priorityA];
    });
    
    cards.forEach(card => grid.appendChild(card));
}

function updateProgressIndicators() {
    const cards = document.querySelectorAll('.maintenance-card');
    cards.forEach(card => {
        const startDate = new Date(card.querySelector('.maintenance-details p:nth-child(4)').textContent.split(': ')[1]);
        const endDate = new Date(card.querySelector('.maintenance-details p:nth-child(5)').textContent.split(': ')[1]);
        const today = new Date();
        
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const elapsedDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
        const progress = Math.min((elapsedDays / totalDays) * 100, 100);
        
        // Add progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `
            <div class="progress-fill" style="width: ${progress}%"></div>
            <span class="progress-text">${Math.round(progress)}% Complete</span>
        `;
        
        const details = card.querySelector('.maintenance-details');
        details.appendChild(progressBar);
    });
}

function addEventListeners() {
    // Mark Complete buttons
    const completeButtons = document.querySelectorAll('.btn-success');
    completeButtons.forEach(btn => {
        if (btn.textContent.includes('Mark Complete')) {
            btn.addEventListener('click', function() {
                markMaintenanceComplete(this);
            });
        }
    });
    
    // Update Status buttons
    const updateButtons = document.querySelectorAll('.btn-info');
    updateButtons.forEach(btn => {
        if (btn.textContent.includes('Update Status')) {
            btn.addEventListener('click', function() {
                updateMaintenanceStatus(this);
            });
        }
    });
}

function markMaintenanceComplete(button) {
    const card = button.closest('.maintenance-card');
    const assetName = card.querySelector('h4').textContent;
    
    if (confirm(`Mark maintenance complete for ${assetName}?`)) {
        // Simulate API call
        setTimeout(() => {
            card.style.opacity = '0.6';
            card.style.border = '2px solid #2e7d32';
            
            // Update status
            const priority = card.querySelector('.maintenance-priority');
            priority.textContent = 'Completed';
            priority.className = 'maintenance-priority completed';
            priority.style.backgroundColor = '#e8f5e8';
            priority.style.color = '#2e7d32';
            
            // Disable buttons
            button.textContent = 'Completed';
            button.disabled = true;
            button.className = 'btn btn-secondary';
            
            const updateBtn = card.querySelector('.btn-info');
            updateBtn.disabled = true;
            updateBtn.className = 'btn btn-secondary';
            
            showNotification(`Maintenance completed for ${assetName}!`, 'success');
        }, 500);
    }
}

function updateMaintenanceStatus(button) {
    const card = button.closest('.maintenance-card');
    const assetName = card.querySelector('h4').textContent;
    
    const newStatus = prompt(`Update status for ${assetName}:\n\nEnter new status update:`);
    
    if (newStatus && newStatus.trim()) {
        // Add status update to the card
        const details = card.querySelector('.maintenance-details');
        const statusUpdate = document.createElement('p');
        statusUpdate.innerHTML = `<strong>Latest Update:</strong> ${newStatus.trim()}`;
        statusUpdate.style.color = '#1a6c25';
        statusUpdate.style.fontStyle = 'italic';
        statusUpdate.style.marginTop = '10px';
        statusUpdate.style.padding = '8px';
        statusUpdate.style.backgroundColor = '#f0f8f0';
        statusUpdate.style.borderRadius = '4px';
        
        details.appendChild(statusUpdate);
        
        showNotification(`Status updated for ${assetName}`, 'success');
    }
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

// Add CSS for progress bars and animations
const style = document.createElement('style');
style.textContent = `
    .progress-bar {
        margin-top: 15px;
        background: #f0f0f0;
        border-radius: 10px;
        height: 20px;
        position: relative;
        overflow: hidden;
    }
    
    .progress-fill {
        background: linear-gradient(to right, #1a6c25, #2e7d32);
        height: 100%;
        border-radius: 10px;
        transition: width 0.3s ease;
    }
    
    .progress-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        font-weight: 600;
        color: #333;
    }
    
    .maintenance-priority.completed {
        background: #e8f5e8 !important;
        color: #2e7d32 !important;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(style);
