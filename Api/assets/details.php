<?php
/**
 * Get Asset Details API
 * GET /Api/assets/details.php?serial_number=ASSET-2024-001
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

// Query to get detailed asset information
$query = "SELECT 
    a.id, a.serial_number, a.name, a.description, a.status, a.condition_status,
    a.purchase_date, a.purchase_cost, a.supplier, a.warranty_expiry, a.location, a.notes,
    d.name as department_name, d.code as department_code, d.location as department_location,
    c.name as category_name, c.description as category_description,
    a.created_at, a.updated_at
FROM assets a
LEFT JOIN departments d ON a.department_id = d.id
LEFT JOIN asset_categories c ON a.category_id = c.id
WHERE a.serial_number = :serial_number";

$stmt = $db->prepare($query);
$stmt->bindParam(":serial_number", $serial_number);
$stmt->execute();

if($stmt->rowCount() > 0) {
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $asset_details = array(
        "id" => $row['id'],
        "serial_number" => $row['serial_number'],
        "name" => $row['name'],
        "description" => $row['description'],
        "status" => $row['status'],
        "condition_status" => $row['condition_status'],
        "purchase_date" => $row['purchase_date'],
        "purchase_cost" => $row['purchase_cost'],
        "supplier" => $row['supplier'],
        "warranty_expiry" => $row['warranty_expiry'],
        "location" => $row['location'],
        "notes" => $row['notes'],
        "department_name" => $row['department_name'],
        "department_code" => $row['department_code'],
        "department_location" => $row['department_location'],
        "category_name" => $row['category_name'],
        "category_description" => $row['category_description'],
        "created_at" => $row['created_at'],
        "updated_at" => $row['updated_at']
    );

    http_response_code(200);
    echo json_encode($asset_details);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Asset not found."));
}
?>
