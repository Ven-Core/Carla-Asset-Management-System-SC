<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();

    if (!isset($_GET['action'])) {
        echo json_encode(['success' => false, 'error' => "No action parameter provided"]);
        exit;
    }

    if ($_GET['action'] == 'getBorrowingRequests') {
        $query = "SELECT 
                    ba.id,
                    ba.asset_id,
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
                    ba.approved_by,
                    ba.approved_at,
                    ba.notes,
                    ba.created_at,
                    ba.updated_at,
                    a.name as asset_name,
                    a.serial_number
                  FROM borrow_applications ba
                  LEFT JOIN assets a ON ba.asset_id = a.id
                  ORDER BY ba.created_at DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $formattedRequests = [];
        
        foreach ($requests as $request) {
            $statusClass = '';
            switch ($request['status']) {
                case 'pending':
                    $statusClass = 'pending';
                    break;
                case 'approved':
                    $statusClass = 'approved';
                    break;
                case 'rejected':
                    $statusClass = 'rejected';
                    break;
                case 'borrowed':
                    $statusClass = 'borrowed';
                    break;
                case 'returned':
                    $statusClass = 'returned';
                    break;
                case 'overdue':
                    $statusClass = 'overdue';
                    break;
                default:
                    $statusClass = 'unknown';
                    break;
            }
            
            $formattedRequests[] = [
                'id' => $request['id'],
                'asset_id' => $request['asset_id'],
                'asset_name' => $request['asset_name'],
                'serial_number' => $request['serial_number'],
                'borrower_name' => $request['borrower_name'],
                'borrower_id' => $request['borrower_id'],
                'borrower_department' => $request['borrower_department'],
                'borrower_contact' => $request['borrower_contact'],
                'borrower_email' => $request['borrower_email'],
                'purpose' => $request['purpose'],
                'requested_date' => $request['requested_date'],
                'expected_return_date' => $request['expected_return_date'],
                'actual_return_date' => $request['actual_return_date'],
                'status' => $request['status'],
                'approved_by' => $request['approved_by'],
                'approved_at' => $request['approved_at'],
                'notes' => $request['notes'],
                'created_at' => $request['created_at'],
                'updated_at' => $request['updated_at'],
                'status_class' => $statusClass
            ];
        }
        
        echo json_encode(['success' => true, 'data' => $formattedRequests]);
        
    } else if ($_GET['action'] == 'updateRequestStatus') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $requestId = $input['id'] ?? 0;
        $status = $input['status'] ?? '';
        $approvedBy = $input['approved_by'] ?? 1;
        
        if (!$requestId || !$status) {
            echo json_encode(['success' => false, 'error' => "Request ID and status are required"]);
            exit;
        }
        
        $validStatuses = ['pending', 'approved', 'rejected', 'borrowed', 'returned', 'overdue'];
        if (!in_array($status, $validStatuses)) {
            echo json_encode(['success' => false, 'error' => "Invalid status"]);
            exit;
        }
        
        if ($status == 'approved' || $status == 'rejected') {
            $query = "UPDATE borrow_applications 
                      SET status = ?, 
                          approved_by = ?, 
                          approved_at = NOW(),
                          updated_at = NOW()
                      WHERE id = ?";
            $stmt = $conn->prepare($query);
            $result = $stmt->execute([$status, $approvedBy, $requestId]);
        } else {
            $query = "UPDATE borrow_applications 
                      SET status = ?, 
                          updated_at = NOW()
                      WHERE id = ?";
            $stmt = $conn->prepare($query);
            $result = $stmt->execute([$status, $requestId]);
        }
        
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Request status updated successfully']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to update request status']);
        }
        
    } else {
        echo json_encode(['success' => false, 'error' => "Unknown action"]);
    }

} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => "Database error: " . $e->getMessage()]);
} catch(Exception $e) {
    echo json_encode(['success' => false, 'error' => "Error: " . $e->getMessage()]);
}
?>