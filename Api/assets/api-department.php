<?php
// AYAW INTAWON HILABTI KAY NI GANA
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Turn off error display for production ya.
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once '../config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();

    $action = $_POST['action'] ?? $_GET['action'] ?? '';

    if ($action == 'addDepartment') {
        $name = $_POST['name'] ?? '';
        $code = $_POST['code'] ?? '';
        $description = $_POST['description'] ?? '';
        $head_name = $_POST['head_name'] ?? '';
        $contact_number = $_POST['contact_number'] ?? '';
        $email = $_POST['email'] ?? '';
        $location = $_POST['location'] ?? '';

        if (empty($name) || empty($code)) {
            echo json_encode([
                'success' => false,
                'message' => 'Department name and code are required'
            ]);
            exit;
        }

        // Check if department code already exists
        $query = "SELECT id FROM departments WHERE code = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$code]);
        
        if ($stmt->fetch()) {
            echo json_encode([
                'success' => false,
                'message' => 'Department code already exists'
            ]);
            exit;
        }

        // Insert new department
        $query = "INSERT INTO departments (name, code, description, head_name, contact_number, email, location, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
        
        $stmt = $conn->prepare($query);
        $result = $stmt->execute([$name, $code, $description, $head_name, $contact_number, $email, $location]);

        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Department added successfully'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Failed to add department'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid or missing action parameter'
        ]);
    }

} catch(PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database error occurred'
    ]);
} catch(Exception $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred'
    ]);
}
?>