<?php
/**
 * Get Asset Transaction History API
 * GET /Api/assets/history.php?serial_number=ASSET-2024-001
 */

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get serial number from query parameter
$serial_number = isset($_GET['serial_number']) ? $_GET['serial_number'] : '';

if (empty($serial_number)) {
    http_response_code(400);
    echo json_encode(array("message" => "Serial number is required."));
    exit;
}

// First get the asset ID
$asset_query = "SELECT id FROM assets WHERE serial_number = :serial_number";
$asset_stmt = $db->prepare($asset_query);
$asset_stmt->bindParam(":serial_number", $serial_number);
$asset_stmt->execute();

if ($asset_stmt->rowCount() == 0) {
    http_response_code(404);
    echo json_encode(array("message" => "Asset not found."));
    exit;
}

$asset_row = $asset_stmt->fetch(PDO::FETCH_ASSOC);
$asset_id = $asset_row['id'];

// Query to get transaction history
$query = "SELECT 
    at.transaction_type,
    at.description,
    at.transaction_date,
    at.old_status,
    at.new_status,
    u.full_name as performed_by_name
FROM asset_transactions at
LEFT JOIN users u ON at.performed_by = u.id
WHERE at.asset_id = :asset_id
ORDER BY at.transaction_date DESC";

$stmt = $db->prepare($query);
$stmt->bindParam(":asset_id", $asset_id);
$stmt->execute();

$history = array();
$history["records"] = array();

if($stmt->rowCount() > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $history_item = array(
            "transaction_type" => $row['transaction_type'],
            "description" => $row['description'],
            "transaction_date" => $row['transaction_date'],
            "old_status" => $row['old_status'],
            "new_status" => $row['new_status'],
            "performed_by" => $row['performed_by_name']
        );

        array_push($history["records"], $history_item);
    }

    http_response_code(200);
    echo json_encode($history);
} else {
    http_response_code(200);
    echo json_encode(array("records" => array()));
}
?>
