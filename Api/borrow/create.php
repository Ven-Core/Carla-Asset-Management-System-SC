<?php
/**
 * Create Borrow Application API
 * POST /Api/borrow/create.php
 */

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Make sure data is not empty
if(
    !empty($data->asset_id) &&
    !empty($data->borrower_name) &&
    !empty($data->purpose) &&
    !empty($data->expected_return_date)
) {
    // Insert query
    $query = "INSERT INTO borrow_applications 
        SET asset_id=:asset_id, borrower_name=:borrower_name,
            borrower_id=:borrower_id, borrower_department=:borrower_department,
            borrower_contact=:borrower_contact, borrower_email=:borrower_email,
            purpose=:purpose, requested_date=:requested_date,
            expected_return_date=:expected_return_date, notes=:notes";

    $stmt = $db->prepare($query);

    // Sanitize
    $asset_id = $data->asset_id;
    $borrower_name = htmlspecialchars(strip_tags($data->borrower_name));
    $borrower_id = htmlspecialchars(strip_tags($data->borrower_id ?? ''));
    $borrower_department = htmlspecialchars(strip_tags($data->borrower_department ?? ''));
    $borrower_contact = htmlspecialchars(strip_tags($data->borrower_contact ?? ''));
    $borrower_email = htmlspecialchars(strip_tags($data->borrower_email ?? ''));
    $purpose = htmlspecialchars(strip_tags($data->purpose));
    $requested_date = $data->requested_date ?? date('Y-m-d');
    $expected_return_date = $data->expected_return_date;
    $notes = htmlspecialchars(strip_tags($data->notes ?? ''));

    // Bind values
    $stmt->bindParam(":asset_id", $asset_id);
    $stmt->bindParam(":borrower_name", $borrower_name);
    $stmt->bindParam(":borrower_id", $borrower_id);
    $stmt->bindParam(":borrower_department", $borrower_department);
    $stmt->bindParam(":borrower_contact", $borrower_contact);
    $stmt->bindParam(":borrower_email", $borrower_email);
    $stmt->bindParam(":purpose", $purpose);
    $stmt->bindParam(":requested_date", $requested_date);
    $stmt->bindParam(":expected_return_date", $expected_return_date);
    $stmt->bindParam(":notes", $notes);

    // Execute query
    if($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Borrow application was created.", "id" => $db->lastInsertId()));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create borrow application."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create application. Data is incomplete."));
}
?>
