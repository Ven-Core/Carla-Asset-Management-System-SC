<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();

    if (!isset($_GET['action'])) {
        echo json_encode([
            'success' => false,
            'error' => "No action parameter provided"
        ]);
        exit;
    }

    if ($_GET['action'] == 'getAllMaintenance') {
        $query = "SELECT 
                    mr.id,
                    mr.asset_id,
                    mr.maintenance_type,
                    mr.description,
                    mr.technician_name,
                    mr.start_date,
                    mr.expected_completion_date,
                    mr.actual_completion_date,
                    mr.cost,
                    mr.status,
                    mr.notes,
                    mr.created_at,
                    mr.updated_at,
                    a.name as asset_name,
                    a.serial_number as serial_num
                  FROM maintenance_records mr
                  LEFT JOIN assets a ON mr.asset_id = a.id
                  ORDER BY 
                    CASE 
                        WHEN mr.status = 'in_progress' THEN 1
                        WHEN mr.status = 'scheduled' THEN 2
                        WHEN mr.status = 'completed' THEN 3
                        WHEN mr.status = 'cancelled' THEN 4
                        ELSE 5
                    END,
                    mr.start_date DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $maintenanceRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $records = [];
        
        foreach ($maintenanceRecords as $record) {
            $statusClass = '';
            switch ($record['status']) {
                case 'scheduled':
                    $statusClass = 'scheduled';
                    break;
                case 'in_progress':
                    $statusClass = 'in_progress';
                    break;
                case 'completed':
                    $statusClass = 'completed';
                    break;
                case 'cancelled':
                    $statusClass = 'cancelled';
                    break;
                default:
                    $statusClass = 'unknown';
                    break;
            }
            
            $records[] = [
                'id' => $record['id'],
                'asset_id' => $record['asset_id'],
                'asset_name' => $record['asset_name'],
                'serial_num' => $record['serial_num'],
                'maintenance_type' => $record['maintenance_type'],
                'description' => $record['description'],
                'technician_name' => $record['technician_name'],
                'start_date' => $record['start_date'],
                'expected_completion_date' => $record['expected_completion_date'],
                'actual_completion_date' => $record['actual_completion_date'],
                'cost' => $record['cost'],
                'status' => $record['status'],
                'notes' => $record['notes'],
                'created_at' => $record['created_at'],
                'updated_at' => $record['updated_at'],
                'status_class' => $statusClass
            ];
        }
        
        echo json_encode([
            'success' => true,
            'data' => $records
        ]);
        
    } else if ($_GET['action'] == 'updateMaintenanceStatus') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $maintenanceId = $input['id'] ?? 0;
        $status = $input['status'] ?? '';
        $actualCompletionDate = $input['actual_completion_date'] ?? null;
        
        if (!$maintenanceId || !$status) {
            echo json_encode([
                'success' => false,
                'error' => "Maintenance ID and status are required"
            ]);
            exit;
        }
        
        $query = "UPDATE maintenance_records 
                  SET status = ?,
                      actual_completion_date = ?,
                      updated_at = NOW()
                  WHERE id = ?";
        
        $stmt = $conn->prepare($query);
        $result = $stmt->execute([$status, $actualCompletionDate, $maintenanceId]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Maintenance status updated successfully'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Failed to update maintenance status'
            ]);
        }
        
    } else if ($_GET['action'] == 'getMaintenance') {
        $assetId = $_GET['asset_id'] ?? 0;
        
        if (!$assetId) {
            echo json_encode([
                'success' => false,
                'error' => "Asset ID is required"
            ]);
            exit;
        }
        
        // First, get the actual asset_id from borrow_applications
        $assetQuery = "SELECT asset_id FROM borrow_applications WHERE id = ?";
        $assetStmt = $conn->prepare($assetQuery);
        $assetStmt->execute([$assetId]);
        $borrowApp = $assetStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$borrowApp || !$borrowApp['asset_id']) {
            echo json_encode([
                'success' => false,
                'error' => "Asset not found for this borrow application"
            ]);
            exit;
        }
        
        $actualAssetId = $borrowApp['asset_id'];
        
        $query = "SELECT 
                    mr.id,
                    mr.asset_id,
                    mr.maintenance_type,
                    mr.description,
                    mr.technician_name,
                    mr.start_date,
                    mr.expected_completion_date,
                    mr.actual_completion_date,
                    mr.cost,
                    mr.status,
                    mr.notes,
                    mr.created_at,
                    mr.updated_at,
                    a.name as asset_name,
                    a.serial_number as serial_num
                  FROM maintenance_records mr
                  LEFT JOIN assets a ON mr.asset_id = a.id
                  WHERE mr.asset_id = ?
                  ORDER BY mr.start_date DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->execute([$actualAssetId]);
        $maintenanceRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $records = [];
        
        foreach ($maintenanceRecords as $record) {
            $statusClass = '';
            switch ($record['status']) {
                case 'scheduled':
                    $statusClass = 'scheduled';
                    break;
                case 'in_progress':
                    $statusClass = 'in_progress';
                    break;
                case 'completed':
                    $statusClass = 'completed';
                    break;
                case 'cancelled':
                    $statusClass = 'cancelled';
                    break;
                default:
                    $statusClass = 'unknown';
                    break;
            }
            
            $records[] = [
                'id' => $record['id'],
                'asset_id' => $record['asset_id'],
                'asset_name' => $record['asset_name'],
                'serial_num' => $record['serial_num'],
                'maintenance_type' => $record['maintenance_type'],
                'description' => $record['description'],
                'technician_name' => $record['technician_name'],
                'start_date' => $record['start_date'],
                'expected_completion_date' => $record['expected_completion_date'],
                'actual_completion_date' => $record['actual_completion_date'],
                'cost' => $record['cost'],
                'status' => $record['status'],
                'notes' => $record['notes'],
                'created_at' => $record['created_at'],
                'updated_at' => $record['updated_at'],
                'status_class' => $statusClass
            ];
        }
        
        echo json_encode([
            'success' => true,
            'data' => $records,
            'actual_asset_id' => $actualAssetId
        ]);
        
    } else if ($_GET['action'] == 'addMaintenance') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $borrowAppId = $input['asset_id'] ?? 0;
        $maintenanceType = $input['maintenance_type'] ?? '';
        $description = $input['description'] ?? '';
        $technicianName = $input['technician_name'] ?? '';
        $startDate = $input['start_date'] ?? '';
        $expectedCompletionDate = $input['expected_completion_date'] ?? '';
        $actualCompletionDate = $input['actual_completion_date'] ?? '';
        $cost = $input['cost'] ?? 0;
        $status = $input['status'] ?? '';
        $notes = $input['notes'] ?? '';
        
        if (!$borrowAppId || !$maintenanceType || !$description || !$technicianName || !$startDate || !$expectedCompletionDate || !$status) {
            echo json_encode([
                'success' => false,
                'error' => "All required fields must be filled"
            ]);
            exit;
        }
        
        $assetQuery = "SELECT asset_id FROM borrow_applications WHERE id = ?";
        $assetStmt = $conn->prepare($assetQuery);
        $assetStmt->execute([$borrowAppId]);
        $borrowApp = $assetStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$borrowApp || !$borrowApp['asset_id']) {
            echo json_encode([
                'success' => false,
                'error' => "Asset not found for this borrow application"
            ]);
            exit;
        }
        
        $actualAssetId = $borrowApp['asset_id'];
        
        $query = "INSERT INTO maintenance_records 
                  (asset_id, maintenance_type, description, technician_name, start_date, 
                   expected_completion_date, actual_completion_date, cost, status, notes, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        
        $stmt = $conn->prepare($query);
        $result = $stmt->execute([
            $actualAssetId,
            $maintenanceType,
            $description,
            $technicianName,
            $startDate,
            $expectedCompletionDate,
            $actualCompletionDate,
            $cost,
            $status,
            $notes
        ]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Maintenance record added successfully',
                'id' => $conn->lastInsertId()
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Failed to add maintenance record'
            ]);
        }
        
    } else if ($_GET['action'] == 'updateMaintenance') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $maintenanceId = $input['id'] ?? 0;
        $maintenanceType = $input['maintenance_type'] ?? '';
        $description = $input['description'] ?? '';
        $technicianName = $input['technician_name'] ?? '';
        $startDate = $input['start_date'] ?? '';
        $expectedCompletionDate = $input['expected_completion_date'] ?? '';
        $actualCompletionDate = $input['actual_completion_date'] ?? '';
        $cost = $input['cost'] ?? 0;
        $status = $input['status'] ?? '';
        $notes = $input['notes'] ?? '';
        
        if (!$maintenanceId || !$maintenanceType || !$description || !$technicianName || !$startDate || !$expectedCompletionDate || !$status) {
            echo json_encode([
                'success' => false,
                'error' => "All required fields must be filled"
            ]);
            exit;
        }
        
        $query = "UPDATE maintenance_records 
                  SET maintenance_type = ?,
                      description = ?,
                      technician_name = ?,
                      start_date = ?,
                      expected_completion_date = ?,
                      actual_completion_date = ?,
                      cost = ?,
                      status = ?,
                      notes = ?,
                      updated_at = NOW()
                  WHERE id = ?";
        
        $stmt = $conn->prepare($query);
        $result = $stmt->execute([
            $maintenanceType,
            $description,
            $technicianName,
            $startDate,
            $expectedCompletionDate,
            $actualCompletionDate,
            $cost,
            $status,
            $notes,
            $maintenanceId
        ]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Maintenance record updated successfully'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Failed to update maintenance record'
            ]);
        }
        
    } else {
        echo json_encode([
            'success' => false,
            'error' => "Unknown action"
        ]);
    }

} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => "Database error: " . $e->getMessage()
    ]);
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => "Error: " . $e->getMessage()
    ]);
}
?>