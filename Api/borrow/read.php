<?php
/**
 * Read Borrow Applications API
 * GET /Api/borrow/read.php
 */

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Query to read borrow applications with asset info
$query = "SELECT 
    ba.id, ba.borrower_name, ba.borrower_id, ba.borrower_department,
    ba.borrower_contact, ba.borrower_email, ba.purpose,
    ba.requested_date, ba.expected_return_date, ba.actual_return_date,
    ba.status, ba.notes, ba.created_at,
    a.serial_number, a.name as asset_name, a.status as asset_status,
    d.name as department_name
FROM borrow_applications ba
LEFT JOIN assets a ON ba.asset_id = a.id
LEFT JOIN departments d ON a.department_id = d.id
ORDER BY ba.created_at DESC";

$stmt = $db->prepare($query);
$stmt->execute();

$applications = array();
$applications["records"] = array();

if($stmt->rowCount() > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $app_item = array(
            "id" => $row['id'],
            "borrower_name" => $row['borrower_name'],
            "borrower_id" => $row['borrower_id'],
            "borrower_department" => $row['borrower_department'],
            "borrower_contact" => $row['borrower_contact'],
            "borrower_email" => $row['borrower_email'],
            "purpose" => $row['purpose'],
            "requested_date" => $row['requested_date'],
            "expected_return_date" => $row['expected_return_date'],
            "actual_return_date" => $row['actual_return_date'],
            "status" => $row['status'],
            "notes" => $row['notes'],
            "serial_number" => $row['serial_number'],
            "asset_name" => $row['asset_name'],
            "asset_status" => $row['asset_status'],
            "department_name" => $row['department_name'],
            "created_at" => $row['created_at']
        );

        array_push($applications["records"], $app_item);
    }

    http_response_code(200);
    echo json_encode($applications);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "No borrow applications found."));
}
?>
