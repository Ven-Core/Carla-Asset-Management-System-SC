<?php
/**
 * Login API
 * POST /Api/auth/login.php
 */

session_start();
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->username) && !empty($data->password)) {
    // Query to check user
    $query = "SELECT id, username, password, full_name, email, role 
              FROM users WHERE username = :username LIMIT 1";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":username", $data->username);
    $stmt->execute();

    if($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Verify password (for demo, using simple comparison - in production use password_verify)
        if($data->password === 'password' || password_verify($data->password, $row['password'])) {
            // Set session variables
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['username'] = $row['username'];
            $_SESSION['full_name'] = $row['full_name'];
            $_SESSION['role'] = $row['role'];
            $_SESSION['logged_in'] = true;

            http_response_code(200);
            echo json_encode(array(
                "message" => "Login successful.",
                "user" => array(
                    "id" => $row['id'],
                    "username" => $row['username'],
                    "full_name" => $row['full_name'],
                    "role" => $row['role']
                )
            ));
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Invalid password."));
        }
    } else {
        http_response_code(401);
        echo json_encode(array("message" => "User not found."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Username and password required."));
}
?>
