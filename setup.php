<?php
/**
 * Database Setup Script
 * Run this file once to create the database and tables
 * Access: http://localhost/MCCAsset2.0/setup.php
 */

$host = "localhost";
$username = "root";
$password = "";

try {
    // Connect to MySQL server
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Read and execute SQL file
    $sql = file_get_contents('Database/mcc_asset_management.sql');
    
    // Split SQL into individual statements
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            $pdo->exec($statement);
        }
    }
    
    echo "<h2>✅ Database Setup Complete!</h2>";
    echo "<p>The MCC Asset Management database has been created successfully.</p>";
    echo "<h3>Default Login Credentials:</h3>";
    echo "<ul>";
    echo "<li><strong>Admin:</strong> username = 'admin', password = 'password'</li>";
    echo "<li><strong>Staff:</strong> username = 'staff', password = 'password'</li>";
    echo "</ul>";
    echo "<p><a href='index.html'>Go to Login Page</a></p>";
    echo "<p><strong>Note:</strong> Delete this setup.php file after setup for security.</p>";
    
} catch(PDOException $e) {
    echo "<h2>❌ Database Setup Failed</h2>";
    echo "<p>Error: " . $e->getMessage() . "</p>";
    echo "<p>Make sure XAMPP MySQL is running.</p>";
}
?>
