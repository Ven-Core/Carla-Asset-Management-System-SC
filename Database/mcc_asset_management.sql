-- Mandaue City College Asset Management System Database
-- Created: 2025-10-02

CREATE DATABASE IF NOT EXISTS mcc_asset_management;
USE mcc_asset_management;

-- Users table for authentication
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role ENUM('admin', 'staff', 'faculty') DEFAULT 'staff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    head_name VARCHAR(100),
    contact_number VARCHAR(20),
    email VARCHAR(100),
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Asset categories
CREATE TABLE asset_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assets table
CREATE TABLE assets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category_id INT,
    department_id INT,
    purchase_date DATE,
    purchase_cost DECIMAL(10,2),
    supplier VARCHAR(100),
    warranty_expiry DATE,
    status ENUM('active', 'borrowed', 'maintenance', 'inactive', 'disposed') DEFAULT 'active',
    condition_status ENUM('excellent', 'good', 'fair', 'poor') DEFAULT 'good',
    location VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES asset_categories(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Borrow applications table
CREATE TABLE borrow_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT NOT NULL,
    borrower_name VARCHAR(100) NOT NULL,
    borrower_id VARCHAR(50),
    borrower_department VARCHAR(100),
    borrower_contact VARCHAR(20),
    borrower_email VARCHAR(100),
    purpose TEXT NOT NULL,
    requested_date DATE NOT NULL,
    expected_return_date DATE NOT NULL,
    actual_return_date DATE NULL,
    status ENUM('pending', 'approved', 'rejected', 'borrowed', 'returned', 'overdue') DEFAULT 'pending',
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Maintenance records table
CREATE TABLE maintenance_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT NOT NULL,
    maintenance_type ENUM('preventive', 'corrective', 'emergency') NOT NULL,
    description TEXT NOT NULL,
    technician_name VARCHAR(100),
    start_date DATE NOT NULL,
    expected_completion_date DATE,
    actual_completion_date DATE NULL,
    cost DECIMAL(10,2),
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Asset transaction history
CREATE TABLE asset_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT NOT NULL,
    transaction_type ENUM('created', 'updated', 'borrowed', 'returned', 'maintenance', 'disposed') NOT NULL,
    description TEXT,
    performed_by INT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (performed_by) REFERENCES users(id)
);

-- Insert default data
INSERT INTO users (username, password, full_name, email, role) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin@mcc.edu.ph', 'admin'),
('staff', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Staff User', 'staff@mcc.edu.ph', 'staff');

INSERT INTO departments (name, code, description, location) VALUES 
('School of Technology', 'SOT', 'Information Technology and Engineering Programs', 'Technology Building'),
('School of Education', 'SOE', 'Education and Teaching Programs', 'Education Building'),
('School of Business', 'SOB', 'Business and Management Programs', 'Business Building'),
('Computer Lab Room 25', 'CL25', 'Computer Laboratory 25', 'Technology Building Room 25'),
('Computer Lab Room 22', 'CL22', 'Computer Laboratory 22', 'Technology Building Room 22'),
('Speech Lab', 'SL', 'Speech and Communication Laboratory', 'Education Building');

INSERT INTO asset_categories (name, description) VALUES 
('Computer Equipment', 'Desktop computers, laptops, servers'),
('Audio Visual', 'Projectors, speakers, microphones'),
('Furniture', 'Desks, chairs, cabinets'),
('Laboratory Equipment', 'Scientific and technical equipment'),
('Office Equipment', 'Printers, scanners, phones');

INSERT INTO assets (serial_number, name, description, category_id, department_id, purchase_date, purchase_cost, status, location) VALUES 
('ASSET-2024-001', 'Dell Optiplex 3070 Desktop', 'Desktop computer for general use', 1, 1, '2024-01-15', 35000.00, 'active', 'SOT Lab 1'),
('ASSET-2024-002', 'Epson Projector EB-980W', 'Wireless projector for presentations', 2, 4, '2024-02-10', 45000.00, 'maintenance', 'Computer Lab 25'),
('ASSET-2024-003', 'HP Laptop ProBook 450 G8', 'Laptop for mobile computing', 1, 2, '2024-03-05', 42000.00, 'borrowed', 'SOE Faculty'),
('ASSET-2024-004', 'Canon Camera EOS 80D', 'DSLR camera for documentation', 2, 3, '2024-01-20', 55000.00, 'active', 'SOB Media Room'),
('ASSET-2024-005', 'Yamaha Audio System', 'Professional audio system', 2, 6, '2024-02-28', 38000.00, 'inactive', 'Speech Lab'),
('ASSET-2024-006', 'Smart TV Samsung 55"', 'Smart television for presentations', 2, 5, '2024-03-15', 48000.00, 'active', 'Computer Lab 22'),
('ASSET-2024-007', 'Printer HP LaserJet Pro', 'Laser printer for documents', 5, 1, '2024-01-10', 25000.00, 'borrowed', 'SOT Office'),
('ASSET-2024-008', 'Whiteboard Interactive 75"', 'Interactive whiteboard', 2, 2, '2024-02-20', 65000.00, 'active', 'SOE Classroom');

-- Sample borrow applications
INSERT INTO borrow_applications (asset_id, borrower_name, borrower_id, borrower_department, borrower_contact, purpose, requested_date, expected_return_date, status) VALUES 
(3, 'John Doe', 'EMP-001', 'School of Education', '09123456789', 'Faculty presentation preparation', '2024-09-01', '2024-09-15', 'borrowed'),
(7, 'Jane Smith', 'EMP-002', 'School of Technology', '09987654321', 'Document printing for seminar', '2024-09-05', '2024-09-12', 'borrowed');

-- Sample maintenance records
INSERT INTO maintenance_records (asset_id, maintenance_type, description, technician_name, start_date, expected_completion_date, status) VALUES 
(2, 'corrective', 'Projector lamp replacement and cleaning', 'Tech Support Team', '2024-09-10', '2024-09-12', 'in_progress');
