// Reports functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeReports();
    addEventListeners();
});

function initializeReports() {
    // Add hover effects to report cards
    addHoverEffects();
    
    // Load recent reports data
    loadRecentReports();
}

function addHoverEffects() {
    const reportCards = document.querySelectorAll('.report-card');
    reportCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
}

function loadRecentReports() {
    // Simulate loading recent reports with timestamps
    const reportItems = document.querySelectorAll('.recent-report-item');
    reportItems.forEach((item, index) => {
        const timeAgo = ['2 hours ago', '1 day ago', '3 days ago'][index] || '1 week ago';
        const statusSpan = document.createElement('span');
        statusSpan.textContent = ` • ${timeAgo}`;
        statusSpan.style.color = '#999';
        statusSpan.style.fontSize = '12px';
        
        const pElement = item.querySelector('.report-info p');
        pElement.appendChild(statusSpan);
    });
}

function addEventListeners() {
    // Generate Report buttons
    const generateButtons = document.querySelectorAll('.btn-primary');
    generateButtons.forEach(btn => {
        if (btn.textContent.includes('Generate Report')) {
            btn.addEventListener('click', function() {
                generateReport(this);
            });
        }
    });
    
    // Download buttons
    const downloadButtons = document.querySelectorAll('.btn-info');
    downloadButtons.forEach(btn => {
        if (btn.textContent.includes('Download')) {
            btn.addEventListener('click', function() {
                downloadReport(this);
            });
        }
    });
    
    // View buttons
    const viewButtons = document.querySelectorAll('.btn-secondary');
    viewButtons.forEach(btn => {
        if (btn.textContent.includes('View')) {
            btn.addEventListener('click', function() {
                viewReport(this);
            });
        }
    });
}

function generateReport(button) {
    const card = button.closest('.report-card');
    const reportTitle = card.querySelector('h4').textContent;
    
    // Show loading state
    button.textContent = 'Generating...';
    button.disabled = true;
    
    // Simulate report generation
    setTimeout(() => {
        // Create progress modal
        showProgressModal(reportTitle, () => {
            button.textContent = 'Generate Report';
            button.disabled = false;
            showNotification(`${reportTitle} generated successfully!`, 'success');
            
            // Add to recent reports
            addToRecentReports(reportTitle);
        });
    }, 500);
}

function showProgressModal(reportTitle, onComplete) {
    const modal = document.createElement('div');
    modal.className = 'progress-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Generating Report</h3>
            </div>
            <div class="modal-body">
                <p>Generating: <strong>${reportTitle}</strong></p>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                    <span class="progress-text" id="progressText">0%</span>
                </div>
                <div class="progress-steps">
                    <div class="step" id="step1">Collecting data...</div>
                    <div class="step" id="step2">Processing information...</div>
                    <div class="step" id="step3">Formatting report...</div>
                    <div class="step" id="step4">Finalizing...</div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Simulate progress
    let progress = 0;
    const steps = ['step1', 'step2', 'step3', 'step4'];
    let currentStep = 0;
    
    const progressInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress > 100) progress = 100;
        
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('progressText').textContent = Math.round(progress) + '%';
        
        // Update steps
        if (progress > (currentStep + 1) * 25 && currentStep < steps.length - 1) {
            document.getElementById(steps[currentStep]).style.color = '#2e7d32';
            document.getElementById(steps[currentStep]).innerHTML += ' ✓';
            currentStep++;
            document.getElementById(steps[currentStep]).style.fontWeight = 'bold';
        }
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            document.getElementById(steps[currentStep]).style.color = '#2e7d32';
            document.getElementById(steps[currentStep]).innerHTML += ' ✓';
            
            setTimeout(() => {
                modal.remove();
                onComplete();
            }, 1000);
        }
    }, 200);
}

function downloadReport(button) {
    const reportItem = button.closest('.recent-report-item');
    const reportName = reportItem.querySelector('h5').textContent;
    
    // Simulate download
    button.textContent = 'Downloading...';
    button.disabled = true;
    
    setTimeout(() => {
        // Create fake download
        const link = document.createElement('a');
        link.href = '#';
        link.download = `${reportName.replace(/\s+/g, '_')}.pdf`;
        link.click();
        
        button.textContent = 'Download';
        button.disabled = false;
        
        showNotification(`${reportName} downloaded successfully!`, 'success');
    }, 1500);
}

function viewReport(button) {
    const reportItem = button.closest('.recent-report-item');
    const reportName = reportItem.querySelector('h5').textContent;
    
    // Create report viewer modal
    const modal = document.createElement('div');
    modal.className = 'report-viewer-modal';
    modal.innerHTML = `
        <div class="modal-content large">
            <div class="modal-header">
                <h3>${reportName}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="report-preview">
                    <div class="report-header">
                        <h4>MANDAUE CITY COLLEGE</h4>
                        <h5>Asset Flow Management System</h5>
                        <h6>${reportName}</h6>
                        <p>Generated on: ${new Date().toLocaleDateString()}</p>
                    </div>
                    <div class="report-content">
                        <div class="chart-placeholder">
                            <i class="fas fa-chart-bar" style="font-size: 48px; color: #1a6c25;"></i>
                            <p>Chart visualization would appear here</p>
                        </div>
                        <div class="data-table">
                            <h6>Summary Data</h6>
                            <table>
                                <tr><td>Total Assets</td><td>1,247</td></tr>
                                <tr><td>Active Assets</td><td>1,089</td></tr>
                                <tr><td>Under Maintenance</td><td>64</td></tr>
                                <tr><td>Borrowed Assets</td><td>94</td></tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function addToRecentReports(reportTitle) {
    const recentList = document.querySelector('.recent-reports-list');
    const newReport = document.createElement('div');
    newReport.className = 'recent-report-item';
    newReport.innerHTML = `
        <div class="report-info">
            <h5>${reportTitle}</h5>
            <p>Generated on ${new Date().toLocaleDateString()} • Just now</p>
        </div>
        <div class="report-actions">
            <button class="btn btn-info btn-sm">Download</button>
            <button class="btn btn-secondary btn-sm">View</button>
        </div>
    `;
    
    recentList.insertBefore(newReport, recentList.firstChild);
    
    // Add event listeners to new buttons
    const downloadBtn = newReport.querySelector('.btn-info');
    const viewBtn = newReport.querySelector('.btn-secondary');
    
    downloadBtn.addEventListener('click', function() {
        downloadReport(this);
    });
    
    viewBtn.addEventListener('click', function() {
        viewReport(this);
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

// Add CSS for modals and animations
const style = document.createElement('style');
style.textContent = `
    .progress-modal, .report-viewer-modal {
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
    
    .modal-content.large {
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
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
    
    .progress-container {
        margin: 20px 0;
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .progress-bar {
        flex: 1;
        background: #f0f0f0;
        border-radius: 10px;
        height: 20px;
        overflow: hidden;
    }
    
    .progress-fill {
        background: linear-gradient(to right, #1a6c25, #2e7d32);
        height: 100%;
        width: 0%;
        transition: width 0.3s ease;
    }
    
    .progress-steps {
        margin-top: 20px;
    }
    
    .step {
        padding: 5px 0;
        color: #666;
    }
    
    .report-preview {
        text-align: center;
    }
    
    .report-header {
        border-bottom: 2px solid #1a6c25;
        padding-bottom: 20px;
        margin-bottom: 20px;
    }
    
    .report-header h4 {
        color: #1a6c25;
        margin-bottom: 5px;
    }
    
    .chart-placeholder {
        background: #f8f9fa;
        padding: 40px;
        border-radius: 10px;
        margin-bottom: 20px;
    }
    
    .data-table table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
    }
    
    .data-table td {
        padding: 8px;
        border-bottom: 1px solid #eee;
        text-align: left;
    }
    
    .data-table td:first-child {
        font-weight: 600;
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
`;
document.head.appendChild(style);
