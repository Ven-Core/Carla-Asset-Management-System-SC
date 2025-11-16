<?php
/**
 * Read Assets API
 * GET /Api/assets/read.php
 */

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Query to read assets with department and category info
$query = "SELECT 
    a.id, a.serial_number, a.name, a.description, a.status, a.condition_status,
    a.purchase_date, a.purchase_cost, a.location, a.notes,
    d.name as department_name, d.code as department_code,
    c.name as category_name,
    a.created_at, a.updated_at
FROM assets a
LEFT JOIN departments d ON a.department_id = d.id
LEFT JOIN asset_categories c ON a.category_id = c.id
ORDER BY a.created_at DESC";

$stmt = $db->prepare($query);
$stmt->execute();

$assets = array();
$assets["records"] = array();

if($stmt->rowCount() > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $asset_item = array(
            "id" => $row['id'],
            "serial_number" => $row['serial_number'],
            "name" => $row['name'],
            "description" => $row['description'],
            "status" => $row['status'],
            "condition_status" => $row['condition_status'],
            "purchase_date" => $row['purchase_date'],
            "purchase_cost" => $row['purchase_cost'],
            "location" => $row['location'],
            "notes" => $row['notes'],
            "department_name" => $row['department_name'],
            "department_code" => $row['department_code'],
            "category_name" => $row['category_name'],
            "created_at" => $row['created_at'],
            "updated_at" => $row['updated_at']
        );

        array_push($assets["records"], $asset_item);
    }

    http_response_code(200);
    echo json_encode($assets);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "No assets found."));
}
?>
