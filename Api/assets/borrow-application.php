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

    if ($_GET['action'] == 'submitBorrowRequest') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $borrowerName = $input['borrowerName'] ?? '';
        $borrowerId = $input['borrowerId'] ?? '';
        $borrowerDepartment = $input['borrowerDepartment'] ?? '';
        $borrowerContact = $input['borrowerContact'] ?? '';
        $borrowerEmail = $input['borrowerEmail'] ?? '';
        $assetSerial = $input['assetSerial'] ?? '';
        $purpose = $input['purpose'] ?? '';
        $requestedDate = $input['requestedDate'] ?? '';
        $expectedReturnDate = $input['expectedReturnDate'] ?? '';
        
        if (!$borrowerName || !$borrowerId || !$borrowerDepartment || !$borrowerContact || 
            !$borrowerEmail || !$assetSerial || !$purpose || !$requestedDate || !$expectedReturnDate) {
            echo json_encode(['success' => false, 'error' => "All fields are required"]);
            exit;
        }
        
        $assetQuery = "SELECT id FROM assets WHERE serial_number = ?";
        $assetStmt = $conn->prepare($assetQuery);
        $assetStmt->execute([$assetSerial]);
        $asset = $assetStmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$asset) {
            echo json_encode(['success' => false, 'error' => "Asset with serial number '$assetSerial' not found"]);
            exit;
        }
        
        $assetId = $asset['id'];
        
        $query = "INSERT INTO borrow_applications 
                  (borrower_name, borrower_id, borrower_department, borrower_contact, 
                   borrower_email, asset_id, purpose, requested_date, expected_return_date, 
                   status, created_at) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())";
        
        $stmt = $conn->prepare($query);
        $result = $stmt->execute([
            $borrowerName,
            $borrowerId,
            $borrowerDepartment,
            $borrowerContact,
            $borrowerEmail,
            $assetId,
            $purpose,
            $requestedDate,
            $expectedReturnDate
        ]);
        
        if ($result) {
            $requestId = $conn->lastInsertId();
            echo json_encode([
                'success' => true, 
                'message' => 'Borrow request submitted successfully',
                'requestId' => $requestId
            ]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to submit borrow request']);
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