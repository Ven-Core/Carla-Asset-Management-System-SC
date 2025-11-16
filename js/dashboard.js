// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
    
    // Add event listeners
    addEventListeners();
});

// HAVEN
function initializeDashboard() {
    updateStats();
    loadRecentActivities();
}

function updateStats() {
    fetchAssetData();
}

function fetchAssetData() {
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.innerHTML = 'Refreshing <span class="loading"></span>';
        refreshBtn.disabled = true;
    }
    fetch('Api/assets/dashconfig.php?action=getAssetStats')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data.success) {
                updateDashboard(data.data);
                document.getElementById('last-updated').textContent = new Date().toLocaleString();
                showNotification('Data refreshed successfully!', 'success');
            } else {
                throw new Error(data.error);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            
            // Fallback to sample data if API fails
            const stats = {
                total: 247,
                borrowed: 18,
                maintenance: 5,
                inactive: 12
            };
            
            updateDashboard(stats);
            document.getElementById('last-updated').textContent = new Date().toLocaleString() + ' (Sample Data)';
            showNotification('Using sample data - API connection failed', 'warning');
        })
        .finally(() => {
            if (refreshBtn) {
                refreshBtn.textContent = 'Refresh Data';
                refreshBtn.disabled = false;
            }
        });
}

function updateDashboard(data) {
    animateCounter('total-assets', data.total);
    animateCounter('borrowed-assets', data.borrowed);
    animateCounter('maintenance-assets', data.maintenance);
    animateCounter('inactive-assets', data.inactive);
}

function animateCounter(elementId, finalValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let currentValue = 0;
    const increment = finalValue / 30;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
            element.textContent = finalValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(currentValue);
        }
    }, 50);
}

function loadRecentActivities() {
    const activities = [
        {
            type: 'asset-added',
            icon: 'fas fa-plus-circle',
            title: 'New Asset Added',
            description: 'Dell Laptop - ASSET-2024-001',
            time: '2 hours ago',
            color: 'success'
        },
        {
            type: 'asset-borrowed',
            icon: 'fas fa-hand-holding',
            title: 'Asset Borrowed',
            description: 'Projector - ASSET-2023-045',
            time: '4 hours ago',
            color: 'warning'
        },
        {
            type: 'asset-returned',
            icon: 'fas fa-undo',
            title: 'Asset Returned',
            description: 'Camera - ASSET-2023-032',
            time: '6 hours ago',
            color: 'info'
        },
        {
            type: 'maintenance-completed',
            icon: 'fas fa-check-circle',
            title: 'Maintenance Completed',
            description: 'Printer - ASSET-2023-018',
            time: '1 day ago',
            color: 'success'
        },
        {
            type: 'asset-inactive',
            icon: 'fas fa-ban',
            title: 'Asset Marked Inactive',
            description: 'Old Computer - ASSET-2022-089',
            time: '2 days ago',
            color: 'danger'
        }
    ];
    
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.color}">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
                <small class="activity-time">${activity.time}</small>
            </div>
        </div>
    `).join('');
}

function addEventListeners() {
    // Refresh button functionality
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            fetchAssetData();
        });
    }
    
    // Auto refresh button functionality
    const autoRefreshBtn = document.getElementById('auto-refresh-btn');
    if (autoRefreshBtn) {
        autoRefreshBtn.addEventListener('click', function() {
            toggleAutoRefresh();
        });
    }
    
    // Review button functionality
    const reviewButtons = document.querySelectorAll('.btn-primary');
    reviewButtons.forEach(btn => {
        if (btn.textContent.includes('Review')) {
            btn.addEventListener('click', function() {
                window.location.href = 'borrow-application.html';
            });
        }
    });
    
    // Assign button functionality
    const assignButtons = document.querySelectorAll('.btn-warning');
    assignButtons.forEach(btn => {
        if (btn.textContent.includes('Assign')) {
            btn.addEventListener('click', function() {
                window.location.href = 'maintenance.html';
            });
        }
    });
}

// Auto refresh functionality
let autoRefreshInterval = null;
let isAutoRefresh = true;

function toggleAutoRefresh() {
    const btn = document.getElementById('auto-refresh-btn');
    if (!btn) return;
    
    if (isAutoRefresh) {
        clearInterval(autoRefreshInterval);
        btn.textContent = 'Auto Refresh: OFF';
        btn.style.background = '#dc3545';
        showNotification('Auto refresh disabled', 'warning');
    } else {
        autoRefreshInterval = setInterval(fetchAssetData, 30000);
        btn.textContent = 'Auto Refresh: ON';
        btn.style.background = '#28a745';
        showNotification('Auto refresh enabled', 'success');
    }
    isAutoRefresh = !isAutoRefresh;
}

// Start auto refresh when page loads
function startAutoRefresh() {
    if (isAutoRefresh) {
        autoRefreshInterval = setInterval(fetchAssetData, 30000);
    }
}

// Initialize auto refresh
document.addEventListener('DOMContentLoaded', function() {
    startAutoRefresh();
});

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles based on type
    const styles = {
        info: 'background: #17a2b8; color: white;',
        success: 'background: #28a745; color: white;',
        warning: 'background: #ffc107; color: black;',
        error: 'background: #dc3545; color: white;'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        ${styles[type] || styles.info}
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Error handling for missing elements
function handleMissingElements() {
    const requiredElements = ['total-assets', 'borrowed-assets', 'maintenance-assets', 'inactive-assets'];
    
    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            console.warn(`Element with id '${id}' not found`);
        }
    });
}

// Initialize error handling
document.addEventListener('DOMContentLoaded', function() {
    handleMissingElements();
});