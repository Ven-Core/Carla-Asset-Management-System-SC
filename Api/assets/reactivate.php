<?php
/**
 * Reactivate Asset API
 * POST /Api/assets/reactivate.php
 */

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Make sure data is not empty
if(!empty($data->serial_number)) {
    
    // First check if asset exists and is inactive
    $check_query = "SELECT id, name, notes FROM assets WHERE serial_number = :serial_number AND status = 'inactive'";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(":serial_number", $data->serial_number);
    $check_stmt->execute();
    
    if($check_stmt->rowCount() == 0) {
        http_response_code(404);
        echo json_encode(array("message" => "Asset not found or not inactive."));
        exit;
    }
    
    $asset_row = $check_stmt->fetch(PDO::FETCH_ASSOC);
    $asset_id = $asset_row['id'];
    $asset_name = $asset_row['name'];
    $notes = $asset_row['notes'] ?? '';
    
    // Check if asset can be reactivated (not beyond repair or end of life)
    $cannot_reactivate = (
        strpos(strtolower($notes), 'beyond repair') !== false ||
        strpos(strtolower($notes), 'end of life') !== false
    );
    
    if ($cannot_reactivate) {
        http_response_code(400);
        echo json_encode(array("message" => "Cannot reactivate asset - marked as beyond repair or end of life."));
        exit;
    }
    
    // Update asset status to active
    $query = "UPDATE assets SET status = 'active', updated_at = CURRENT_TIMESTAMP WHERE id = :asset_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":asset_id", $asset_id);
    
    // Execute query
    if($stmt->execute()) {
        // Log transaction
        $log_query = "INSERT INTO asset_transactions 
            SET asset_id=:asset_id, transaction_type='updated', 
                description='Asset reactivated from inactive status', 
                old_status='inactive', new_status='active'";
        $log_stmt = $db->prepare($log_query);
        $log_stmt->bindParam(":asset_id", $asset_id);
        $log_stmt->execute();

        http_response_code(200);
        echo json_encode(array("message" => "Asset reactivated successfully.", "asset_name" => $asset_name));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to reactivate asset."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Serial number is required."));
}
?>
