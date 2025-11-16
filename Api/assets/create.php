<?php
/**
 * Create Asset API
 * POST /Api/assets/create.php
 */

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Make sure data is not empty
if(
    !empty($data->serial_number) &&
    !empty($data->name) &&
    !empty($data->department_id)
) {
    // Insert query
    $query = "INSERT INTO assets 
        SET serial_number=:serial_number, name=:name, description=:description,
            category_id=:category_id, department_id=:department_id,
            purchase_date=:purchase_date, purchase_cost=:purchase_cost,
            supplier=:supplier, warranty_expiry=:warranty_expiry,
            status=:status, condition_status=:condition_status,
            location=:location, notes=:notes";

    $stmt = $db->prepare($query);

    // Sanitize
    $serial_number = htmlspecialchars(strip_tags($data->serial_number));
    $name = htmlspecialchars(strip_tags($data->name));
    $description = htmlspecialchars(strip_tags($data->description ?? ''));
    $category_id = $data->category_id ?? null;
    $department_id = $data->department_id;
    $purchase_date = $data->purchase_date ?? null;
    $purchase_cost = $data->purchase_cost ?? null;
    $supplier = htmlspecialchars(strip_tags($data->supplier ?? ''));
    $warranty_expiry = $data->warranty_expiry ?? null;
    $status = $data->status ?? 'active';
    $condition_status = $data->condition_status ?? 'good';
    $location = htmlspecialchars(strip_tags($data->location ?? ''));
    $notes = htmlspecialchars(strip_tags($data->notes ?? ''));

    // Bind values
    $stmt->bindParam(":serial_number", $serial_number);
    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":description", $description);
    $stmt->bindParam(":category_id", $category_id);
    $stmt->bindParam(":department_id", $department_id);
    $stmt->bindParam(":purchase_date", $purchase_date);
    $stmt->bindParam(":purchase_cost", $purchase_cost);
    $stmt->bindParam(":supplier", $supplier);
    $stmt->bindParam(":warranty_expiry", $warranty_expiry);
    $stmt->bindParam(":status", $status);
    $stmt->bindParam(":condition_status", $condition_status);
    $stmt->bindParam(":location", $location);
    $stmt->bindParam(":notes", $notes);

    // Execute query
    if($stmt->execute()) {
        // Log transaction
        $asset_id = $db->lastInsertId();
        $log_query = "INSERT INTO asset_transactions 
            SET asset_id=:asset_id, transaction_type='created', 
                description='Asset created', new_status=:status";
        $log_stmt = $db->prepare($log_query);
        $log_stmt->bindParam(":asset_id", $asset_id);
        $log_stmt->bindParam(":status", $status);
        $log_stmt->execute();

        http_response_code(201);
        echo json_encode(array("message" => "Asset was created.", "id" => $asset_id));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create asset."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create asset. Data is incomplete."));
}
?>
