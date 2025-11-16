<?php
/**
 * Read Departments API
 * GET /Api/departments/read.php
 */

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Query to read departments
$query = "SELECT id, name, code, description, location FROM departments ORDER BY name ASC";

$stmt = $db->prepare($query);
$stmt->execute();

$departments = array();
$departments["records"] = array();

if($stmt->rowCount() > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $department_item = array(
            "id" => $row['id'],
            "name" => $row['name'],
            "code" => $row['code'],
            "description" => $row['description'],
            "location" => $row['location']
        );

        array_push($departments["records"], $department_item);
    }

    http_response_code(200);
    echo json_encode($departments);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "No departments found."));
}
?>
