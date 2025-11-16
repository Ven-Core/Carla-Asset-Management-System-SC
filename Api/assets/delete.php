<?php
/**
 * Delete Asset API
 * DELETE/POST /Api/assets/delete.php
 */

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Make sure data is not empty
if(!empty($data->id)) {
    // Get asset info for logging
    $info_query = "SELECT serial_number, name, status FROM assets WHERE id = :id";
    $info_stmt = $db->prepare($info_query);
    $info_stmt->bindParam(":id", $data->id);
    $info_stmt->execute();
    $asset_info = $info_stmt->fetch(PDO::FETCH_ASSOC);

    if($asset_info) {
        // Check if asset is currently borrowed
        if($asset_info['status'] === 'borrowed') {
            http_response_code(400);
            echo json_encode(array("message" => "Cannot delete asset that is currently borrowed."));
            exit;
        }

        // Soft delete - update status to 'deleted' instead of actual deletion
        $query = "UPDATE assets SET status='deleted', updated_at=NOW() WHERE id=:id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $data->id);

        // Execute query
        if($stmt->execute()) {
            // Log transaction
            $log_query = "INSERT INTO asset_transactions 
                SET asset_id=:asset_id, transaction_type='deleted', 
                    description='Asset marked as deleted', 
                    old_status=:old_status, new_status='deleted'";
            $log_stmt = $db->prepare($log_query);
            $log_stmt->bindParam(":asset_id", $data->id);
            $log_stmt->bindParam(":old_status", $asset_info['status']);
            $log_stmt->execute();

            http_response_code(200);
            echo json_encode(array(
                "message" => "Asset '{$asset_info['name']}' was deleted successfully."
            ));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to delete asset."));
        }
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Asset not found."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to delete asset. Asset ID is required."));
}
?>
