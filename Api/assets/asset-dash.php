<?php
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

if ($_GET['action'] == 'getAssets') {
    try {
        $database = new Database();
        $conn = $database->getConnection();
        
        $query = "SELECT 
                    a.*,
                    ac.name as category_name,
                    d.name as department_name
                  FROM assets a
                  LEFT JOIN asset_categories ac ON a.category_id = ac.id
                  LEFT JOIN departments d ON a.department_id = d.id
                  ORDER BY a.created_at DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $assets = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'assets' => $assets
        ]);
        
    } catch(PDOException $e) {
        echo json_encode([
            'success' => false,
            'error' => "Database error: " . $e->getMessage()
        ]);
    }
}

if ($_GET['action'] == 'getCategories') {
    try {
        $database = new Database();
        $conn = $database->getConnection();
        
        $query = "SELECT id, name FROM asset_categories ORDER BY name";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'categories' => $categories
        ]);
        
    } catch(PDOException $e) {
        echo json_encode([
            'success' => false,
            'error' => "Database error: " . $e->getMessage()
        ]);
    }
}

if ($_GET['action'] == 'getDepartments') {
    try {
        $database = new Database();
        $conn = $database->getConnection();
        
        $query = "SELECT id, name FROM departments ORDER BY name";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $departments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'departments' => $departments
        ]);
        
    } catch(PDOException $e) {
        echo json_encode([
            'success' => false,
            'error' => "Database error: " . $e->getMessage()
        ]);
    }
}

if ($_GET['action'] == 'updateAsset') {
    // Enable error reporting for debugging, but don't display to users
    error_reporting(E_ALL);
    ini_set('display_errors', 0); // Don't display errors to users
    
    // Set headers first
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, DELETE');
    header('Access-Control-Allow-Headers: Content-Type');
    
    // Initialize response
    $response = ['success' => false, 'error' => 'Unknown error'];
    
    try {
        // Check if ID is provided
        if (!isset($_GET['id']) || empty($_GET['id'])) {
            $response['error'] = 'Asset ID is required';
            echo json_encode($response);
            exit;
        }
        
        $assetId = $_GET['id'];
        
        // Get and validate JSON input
        $jsonInput = file_get_contents('php://input');
        if (empty($jsonInput)) {
            $response['error'] = 'No data received';
            echo json_encode($response);
            exit;
        }
        
        $input = json_decode($jsonInput, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $response['error'] = 'Invalid JSON: ' . json_last_error_msg();
            echo json_encode($response);
            exit;
        }
        
        // Validate required fields
        $requiredFields = ['serial_number', 'name', 'category_id', 'department_id', 'status', 'condition_status'];
        foreach ($requiredFields as $field) {
            if (!isset($input[$field]) || empty($input[$field])) {
                $response['error'] = "Required field missing: $field";
                echo json_encode($response);
                exit;
            }
        }
        
        // Get database connection
        $database = new Database();
        $conn = $database->getConnection();
        
        // Check if asset exists
        $checkQuery = "SELECT id FROM assets WHERE id = :id";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->execute([':id' => $assetId]);
        
        if ($checkStmt->rowCount() === 0) {
            $response['error'] = 'Asset not found';
            echo json_encode($response);
            exit;
        }
        
        // Prepare update query
        $query = "UPDATE assets SET 
                    serial_number = :serial_number,
                    name = :name,
                    description = :description,
                    category_id = :category_id,
                    department_id = :department_id,
                    status = :status,
                    condition_status = :condition_status,
                    purchase_date = :purchase_date,
                    purchase_cost = :purchase_cost,
                    supplier = :supplier,
                    warranty_expiry = :warranty_expiry,
                    location = :location,
                    notes = :notes,
                    updated_at = NOW()
                  WHERE id = :id";
        
        $stmt = $conn->prepare($query);
        
        // Execute with all parameters
        $params = [
            ':serial_number' => $input['serial_number'],
            ':name' => $input['name'],
            ':description' => $input['description'] ?? null,
            ':category_id' => $input['category_id'],
            ':department_id' => $input['department_id'],
            ':status' => $input['status'],
            ':condition_status' => $input['condition_status'],
            ':purchase_date' => !empty($input['purchase_date']) ? $input['purchase_date'] : null,
            ':purchase_cost' => !empty($input['purchase_cost']) ? $input['purchase_cost'] : null,
            ':supplier' => $input['supplier'] ?? null,
            ':warranty_expiry' => !empty($input['warranty_expiry']) ? $input['warranty_expiry'] : null,
            ':location' => $input['location'] ?? null,
            ':notes' => $input['notes'] ?? null,
            ':id' => $assetId
        ];
        
        $result = $stmt->execute($params);
        
        if ($result) {
            if ($stmt->rowCount() > 0) {
                $response = [
                    'success' => true,
                    'message' => 'Asset updated successfully',
                    'affected_rows' => $stmt->rowCount()
                ];
            } else {
                $response = [
                    'success' => true,
                    'message' => 'No changes detected (data was already up to date)',
                    'affected_rows' => 0
                ];
            }
        } else {
            $response['error'] = 'Database update failed';
        }
        
    } catch(PDOException $e) {
        error_log("PDO Exception in updateAsset: " . $e->getMessage());
        $response['error'] = "Database error: " . $e->getMessage();
    } catch(Exception $e) {
        error_log("Exception in updateAsset: " . $e->getMessage());
        $response['error'] = "Error: " . $e->getMessage();
    }
    
    // Always return a valid JSON response
    echo json_encode($response);
    exit;
}

if ($_GET['action'] == 'deleteAsset') {
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        echo json_encode([
            'success' => false,
            'error' => 'Asset ID is required'
        ]);
        exit;
    }

    $assetId = $_GET['id'];

    try {
        $database = new Database();
        $conn = $database->getConnection();
        
        $conn->beginTransaction();

        $query = "SELECT id, name, serial_number, status FROM assets WHERE id = :asset_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':asset_id', $assetId);
        $stmt->execute();
        
        $asset = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$asset) {
            echo json_encode([
                'success' => false,
                'error' => 'Asset not found'
            ]);
            exit;
        }
        
        $description = "Asset permanently deleted from system: " . ($asset['name'] ?: $asset['serial_number']);
        
        $query = "INSERT INTO asset_transactions (
                    asset_id, 
                    transaction_type, 
                    description, 
                    performed_by, 
                    old_status, 
                    new_status
                  ) VALUES (
                    :asset_id, 
                    'disposed', 
                    :description, 
                    :user_id, 
                    :old_status, 
                    'permanently_deleted'
                  )";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':asset_id', $assetId);
        $stmt->bindParam(':description', $description);
        
        $performedBy = 1;
        $stmt->bindParam(':user_id', $performedBy);
        $stmt->bindParam(':old_status', $asset['status']);
        $stmt->execute();

        $query = "DELETE FROM borrow_applications WHERE asset_id = :asset_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':asset_id', $assetId);
        $stmt->execute();

        $query = "DELETE FROM maintenance_records WHERE asset_id = :asset_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':asset_id', $assetId);
        $stmt->execute();

        $query = "DELETE FROM asset_transactions WHERE asset_id = :asset_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':asset_id', $assetId);
        $stmt->execute();
        
        $query = "DELETE FROM assets WHERE id = :asset_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':asset_id', $assetId);
        $stmt->execute();
        
        $affectedRows = $stmt->rowCount();
        
        if ($affectedRows > 0) {
            $conn->commit();
            echo json_encode([
                'success' => true,
                'message' => 'Asset permanently deleted successfully',
                'deleted_asset' => $asset
            ]);
        } else {
            $conn->rollBack();
            echo json_encode([
                'success' => false,
                'error' => 'Failed to delete asset - no rows affected'
            ]);
        }
        
    } catch(PDOException $e) {
        if (isset($conn)) {
            $conn->rollBack();
        }
        echo json_encode([
            'success' => false,
            'error' => "Database error: " . $e->getMessage()
        ]);
    } catch(Exception $e) {
        if (isset($conn)) {
            $conn->rollBack();
        }
        echo json_encode([
            'success' => false,
            'error' => "Error: " . $e->getMessage()
        ]);
    }
}
?>