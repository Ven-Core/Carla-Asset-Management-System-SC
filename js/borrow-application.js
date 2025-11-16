<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MANDAUE CITY COLLEGE - Borrow Applications</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/asset-dashboard.css">
    <style>
        .success-notification, .error-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            border-left: 4px solid #4CAF50;
            max-width: 400px;
        }
        
        .error-notification {
            border-left-color: #f44336;
        }
        
        .notification-content h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        
        .notification-content i {
            font-size: 24px;
            margin-right: 10px;
        }
        
        .success-notification i {
            color: #4CAF50;
        }
        
        .error-notification i {
            color: #f44336;
        }
        
        .btn-sm {
            padding: 5px 10px;
            font-size: 12px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="sidebar">
            <div class="logo-section">
                <img src="../img/mcc.png" alt="Mandaue City College Logo" class="logo">
            </div>
            
            <nav class="sidebar-nav">
                <ul class="nav-menu">
                    <li class="nav-item" onclick="window.location.href='dashboard.html'">
                        <span>Home</span>
                    </li>
                    <li class="nav-item" onclick="window.location.href='asset-dashboard.html'">
                        <span>Asset</span>
                    </li>
                    <li class="nav-item" onclick="window.location.href='departments.html'">
                        <span>Department</span>
                    </li>
                    <li class="nav-item active">
                        <span>Borrow Application</span>
                    </li>
                    <li class="nav-item" onclick="window.location.href='borrowing-request.html'">
                        <span>Borrowing Request</span>
                    </li>
                    <li class="nav-item" onclick="window.location.href='borrowed-assets.html'">
                        <span>Borrowed Asset</span>
                    </li>
                    <li class="nav-item" onclick="window.location.href='maintenance.html'">
                        <span>Under maintenance</span>
                    </li>
                    <li class="nav-item" onclick="window.location.href='inactive-assets.html'">
                        <span>Inactive asset</span>
                    </li>
                    <li class="nav-item" onclick="window.location.href='reports.html'">
                        <span>Log Out</span>
                    </li>
                </ul>
            </nav>
        </div>
        
        <div class="main-content">
            <div class="header">
                <h1>MANDAUE CITY COLLEGE ASSET MANAGEMENT SYSTEM</h1>
            </div>
            
            <div class="content-section">
                <div class="section-header">
                    <h2>Borrow Information</h2>
                </div>
                
                <form id="borrowForm" class="borrow-form">
                    <div class="form-section">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="borrowerName">Name</label>
                                <input type="text" id="borrowerName" name="borrowerName" required>
                            </div>
                            <div class="form-group">
                                <label for="borrowerId">Borrower ID</label>
                                <input type="text" id="borrowerId" name="borrowerId" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="borrowerDepartment">Department</label>
                                <select id="borrowerDepartment" name="borrowerDepartment" required>
                                    <option value="">Select Department</option>
                                    <option value="School of Technology">School of Technology</option>
                                    <option value="School of Business">School of Business</option>
                                    <option value="School of Education">School of Education</option>
                                    <option value="Faculty">Faculty</option>
                                    <option value="Clinic">Clinic</option>
                                    <option value="Library">Library</option>
                                    <option value="Registrar">Registrar</option>
                                    <option value="Saso">Saso</option>
                                    <option value="Cashier">Cashier</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="borrowerContact">Cellphone #</label>
                                <input type="tel" id="borrowerContact" name="borrowerContact" required>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="borrowerEmail">Email</label>
                                <input type="email" id="borrowerEmail" name="borrowerEmail" required>
                            </div>
                            <div class="form-group">
                                <label for="assetId">Asset ID</label>
                                <input type="number" id="assetId" name="assetId" required>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            
            <div class="content-section">
                <div class="section-header">
                    <h2>Asset Detail</h2>
                </div>
                
                <div class="form-section">
                    <div class="form-row">
                        <div class="form-group full-width">
                            <label for="purpose">Purpose of use</label>
                            <textarea id="purpose" name="purpose" rows="3" required form="borrowForm"></textarea>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="requestedDate">Date borrowed</label>
                            <input type="date" id="requestedDate" name="requestedDate" required form="borrowForm">
                        </div>
                        <div class="form-group">
                            <label for="expectedReturnDate">Expected return date</label>
                            <input type="date" id="expectedReturnDate" name="expectedReturnDate" required form="borrowForm">
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary" form="borrowForm">Submit Request</button>
                        <button type="reset" class="btn btn-secondary" form="borrowForm">Clear Form</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('borrowForm');
            const requestedDateInput = document.getElementById('requestedDate');
            const expectedReturnDateInput = document.getElementById('expectedReturnDate');
            
            const today = new Date().toISOString().split('T')[0];
            requestedDateInput.min = today;
            expectedReturnDateInput.min = today;
            
            requestedDateInput.addEventListener('change', function() {
                expectedReturnDateInput.min = this.value;
                if (expectedReturnDateInput.value && expectedReturnDateInput.value < this.value) {
                    expectedReturnDateInput.value = '';
                }
            });
            
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                
                const formData = new FormData(event.target);
                const borrowData = Object.fromEntries(formData.entries());
                
                if (validateFormData(borrowData)) {
                    showLoadingState();
                    submitBorrowRequest(borrowData);
                }
            });
            
            if (!requestedDateInput.value) {
                requestedDateInput.value = today;
            }
        });

        function validateFormData(data) {
            const errors = [];
            
            const requiredFields = [
                'borrowerName', 'borrowerId', 'borrowerDepartment', 'borrowerContact', 
                'borrowerEmail', 'assetId', 'purpose', 'requestedDate', 'expectedReturnDate'
            ];
            
            requiredFields.forEach(field => {
                if (!data[field] || data[field].trim() === '') {
                    errors.push(`${field} is required`);
                }
            });
            
            if (data.borrowerEmail && !isValidEmail(data.borrowerEmail)) {
                errors.push('Please enter a valid email address');
            }
            
            if (data.borrowerContact && !isValidPhone(data.borrowerContact)) {
                errors.push('Please enter a valid phone number');
            }
            
            if (data.requestedDate && data.expectedReturnDate) {
                if (new Date(data.expectedReturnDate) <= new Date(data.requestedDate)) {
                    errors.push('Expected return date must be after the borrow date');
                }
            }
            
            if (errors.length > 0) {
                showValidationErrors(errors);
                return false;
            }
            
            return true;
        }

        function submitBorrowRequest(data) {
            fetch('../Api/assets/borrow-application.php?action=submitBorrowRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    showSuccessMessage(result.requestId);
                    document.getElementById('borrowForm').reset();
                } else {
                    showError(result.error);
                }
                hideLoadingState();
            })
            .catch(error => {
                showError('Network error occurred');
                hideLoadingState();
            });
        }

        function showLoadingState() {
            const submitBtn = document.querySelector('.btn-primary');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            submitBtn.style.opacity = '0.7';
        }

        function hideLoadingState() {
            const submitBtn = document.querySelector('.btn-primary');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Request';
            submitBtn.style.opacity = '1';
        }

        function showSuccessMessage(requestId) {
            const message = `
                <div class="success-notification">
                    <div class="notification-content">
                        <i class="fas fa-check-circle"></i>
                        <h3>Request Submitted Successfully!</h3>
                        <p>Your borrow request has been submitted.</p>
                        <button onclick="this.parentElement.parentElement.remove()" class="btn btn-secondary btn-sm">Close</button>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', message);
            
            setTimeout(() => {
                const notification = document.querySelector('.success-notification');
                if (notification) {
                    notification.remove();
                }
            }, 5000);
        }

        function showValidationErrors(errors) {
            const errorMessage = `
                <div class="error-notification">
                    <div class="notification-content">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Please correct the following errors:</h3>
                        <ul>
                            ${errors.map(error => `<li>${error}</li>`).join('')}
                        </ul>
                        <button onclick="this.parentElement.parentElement.remove()" class="btn btn-secondary btn-sm">Close</button>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', errorMessage);
            
            setTimeout(() => {
                const notification = document.querySelector('.error-notification');
                if (notification) {
                    notification.remove();
                }
            }, 7000);
        }

        function showError(message) {
            const errorMessage = `
                <div class="error-notification">
                    <div class="notification-content">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Error</h3>
                        <p>${message}</p>
                        <button onclick="this.parentElement.parentElement.remove()" class="btn btn-secondary btn-sm">Close</button>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', errorMessage);
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function isValidPhone(phone) {
            const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
            return phoneRegex.test(phone);
        }
    </script>
</body>
</html>