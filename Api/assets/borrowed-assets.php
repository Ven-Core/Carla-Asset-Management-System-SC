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

    if ($_GET['action'] == 'getBorrowedAssets') {
        // REMOVED status filter to show ALL applications
        $query = "SELECT 
                    ba.id,
                    ba.borrower_name,
                    ba.borrower_id,
                    ba.borrower_department,
                    ba.borrower_contact,
                    ba.borrower_email,
                    ba.purpose,
                    ba.requested_date,
                    ba.expected_return_date,
                    ba.actual_return_date,
                    ba.status,
                    ba.notes,
                    a.name as asset_name,
                    a.serial_number,
                    d.name as department_name,
                    ba.borrower_department as department_id
                  FROM borrow_applications ba
                  LEFT JOIN assets a ON ba.asset_id = a.id
                  LEFT JOIN departments d ON ba.borrower_department = d.id
                  ORDER BY 
                    CASE 
                        WHEN ba.status = 'pending' THEN 1
                        WHEN ba.status = 'approved' THEN 2
                        WHEN ba.status = 'borrowed' THEN 3
                        WHEN ba.status = 'overdue' THEN 4
                        WHEN ba.status = 'returned' THEN 5
                        WHEN ba.status = 'rejected' THEN 6
                        ELSE 7
                    END,
                    ba.requested_date DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $borrowedAssets = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $assets = [];
        
        foreach ($borrowedAssets as $asset) {
            $statusClass = '';
            $statusText = '';
            
            switch ($asset['status']) {
                case 'pending':
                    $statusClass = 'pending';
                    $statusText = 'Pending';
                    break;
                case 'approved':
                    $statusClass = 'approved';
                    $statusText = 'Approved';
                    break;
                case 'borrowed':
                    $statusClass = 'borrowed';
                    $statusText = 'Borrowed';
                    break;
                case 'overdue':
                    $statusClass = 'overdue';
                    $statusText = 'Overdue';
                    break;
                case 'returned':
                    $statusClass = 'returned';
                    $statusText = 'Returned';
                    break;
                case 'rejected':
                    $statusClass = 'rejected';
                    $statusText = 'Rejected';
                    break;
                default:
                    $statusClass = 'unknown';
                    $statusText = ucfirst($asset['status']);
                    break;
            }
            
            $departmentName = $asset['department_name'];
            if (empty($departmentName)) {
                $departmentName = 'Department ID: ' . $asset['department_id'];
            }
            
            $assets[] = [
                'id' => $asset['id'],
                'serial_num' => $asset['serial_number'],
                'asset_name' => $asset['asset_name'],
                'borrower_name' => $asset['borrower_name'],
                'borrower_id' => $asset['borrower_id'],
                'borrower_department' => $departmentName,
                'borrower_contact' => $asset['borrower_contact'],
                'borrower_email' => $asset['borrower_email'],
                'purpose' => $asset['purpose'],
                'borrowed_date' => $asset['requested_date'],
                'due_date' => $asset['expected_return_date'],
                'actual_return_date' => $asset['actual_return_date'],
                'status' => $statusText,
                'status_class' => $statusClass,
                'notes' => $asset['notes'],
                'department_id' => $asset['department_id'],
                'raw_status' => $asset['status']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'data' => $assets
        ]);
        
    } else if ($_GET['action'] == 'getAssetDetails') {
        $assetId = $_GET['id'] ?? 0;
        
        if (!$assetId) {
            echo json_encode([
                'success' => false,
                'error' => "Asset ID is required"
            ]);
            exit;
        }
        
        $query = "SELECT 
                    ba.id,
                    ba.borrower_name,
                    ba.borrower_id,
                    ba.borrower_department,
                    ba.borrower_contact,
                    ba.borrower_email,
                    ba.purpose,
                    ba.requested_date,
                    ba.expected_return_date,
                    ba.actual_return_date,
                    ba.status,
                    ba.notes,
                    a.name as asset_name,
                    a.serial_number,
                    d.name as department_name,
                    ba.borrower_department as department_id
                  FROM borrow_applications ba
                  LEFT JOIN assets a ON ba.asset_id = a.id
                  LEFT JOIN departments d ON ba.borrower_department = d.id
                  WHERE ba.id = ?";
        
        $stmt = $conn->prepare($query);
        $stmt->execute([$assetId]);
        $asset = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($asset) {
            $statusClass = '';
            $statusText = '';
            
            switch ($asset['status']) {
                case 'pending':
                    $statusClass = 'pending';
                    $statusText = 'Pending';
                    break;
                case 'approved':
                    $statusClass = 'approved';
                    $statusText = 'Approved';
                    break;
                case 'borrowed':
                    $statusClass = 'borrowed';
                    $statusText = 'Borrowed';
                    break;
                case 'overdue':
                    $statusClass = 'overdue';
                    $statusText = 'Overdue';
                    break;
                case 'returned':
                    $statusClass = 'returned';
                    $statusText = 'Returned';
                    break;
                case 'rejected':
                    $statusClass = 'rejected';
                    $statusText = 'Rejected';
                    break;
                default:
                    $statusClass = 'unknown';
                    $statusText = ucfirst($asset['status']);
                    break;
            }
            
            $departmentName = $asset['department_name'];
            if (empty($departmentName)) {
                $departmentName = 'Department ID: ' . $asset['department_id'];
            }
            
            $assetData = [
                'id' => $asset['id'],
                'serial_num' => $asset['serial_number'],
                'asset_name' => $asset['asset_name'],
                'borrower_name' => $asset['borrower_name'],
                'borrower_id' => $asset['borrower_id'],
                'borrower_department' => $departmentName,
                'borrower_contact' => $asset['borrower_contact'],
                'borrower_email' => $asset['borrower_email'],
                'purpose' => $asset['purpose'],
                'borrowed_date' => $asset['requested_date'],
                'due_date' => $asset['expected_return_date'],
                'actual_return_date' => $asset['actual_return_date'],
                'status' => $statusText,
                'status_class' => $statusClass,
                'notes' => $asset['notes'],
                'department_id' => $asset['department_id'],
                'raw_status' => $asset['status']
            ];
            
            echo json_encode([
                'success' => true,
                'data' => $assetData
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => "Borrow application not found"
            ]);
        }
        
    } else if ($_GET['action'] == 'returnAsset') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $assetId = $input['id'] ?? 0;
        $returnDate = $input['return_date'] ?? '';
        $condition = $input['condition'] ?? '';
        $notes = $input['notes'] ?? '';
        
        if (!$assetId || !$returnDate || !$condition) {
            echo json_encode([
                'success' => false,
                'error' => "All fields are required"
            ]);
            exit;
        }
        
        $query = "UPDATE borrow_applications 
                  SET status = 'returned', 
                      actual_return_date = ?,
                      notes = CONCAT(IFNULL(notes, ''), ?),
                      updated_at = NOW()
                  WHERE id = ?";
        
        $stmt = $conn->prepare($query);
        $returnNotes = "\n\nReturn Details:\nReturn Date: " . $returnDate . "\nCondition: " . $condition . "\nNotes: " . $notes;
        $result = $stmt->execute([$returnDate, $returnNotes, $assetId]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Asset returned successfully'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Failed to return asset'
            ]);
        }
        
    } else if ($_GET['action'] == 'extendAsset') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $assetId = $input['id'] ?? 0;
        $newDueDate = $input['new_due_date'] ?? '';
        $reason = $input['reason'] ?? '';
        
        if (!$assetId || !$newDueDate || !$reason) {
            echo json_encode([
                'success' => false,
                'error' => "All fields are required"
            ]);
            exit;
        }
        
        $query = "UPDATE borrow_applications 
                  SET expected_return_date = ?,
                      notes = CONCAT(IFNULL(notes, ''), ?),
                      updated_at = NOW()
                  WHERE id = ?";
        
        $stmt = $conn->prepare($query);
        $extensionNotes = "\n\nExtension Details:\nNew Due Date: " . $newDueDate . "\nReason: " . $reason;
        $result = $stmt->execute([$newDueDate, $extensionNotes, $assetId]);
        
        if ($result) {
            echo json_encode([
                'success' => true,
                'message' => 'Asset extension approved'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Failed to extend asset'
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