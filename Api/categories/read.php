<?php
/**
 * Read Asset Categories API
 * GET /Api/categories/read.php
 */

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Query to read categories
$query = "SELECT id, name, description FROM asset_categories ORDER BY name ASC";

$stmt = $db->prepare($query);
$stmt->execute();

$categories = array();
$categories["records"] = array();

if($stmt->rowCount() > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $category_item = array(
            "id" => $row['id'],
            "name" => $row['name'],
            "description" => $row['description']
        );

        array_push($categories["records"], $category_item);
    }

    http_response_code(200);
    echo json_encode($categories);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "No categories found."));
}
?>
