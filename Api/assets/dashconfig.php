<?php
// AYAW INTAWON HILABTI KAY NI GANA
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
if ($_GET['action'] == 'getAssetStats') {
    //total assets
    $query = "SELECT COUNT(*) as total FROM assets";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    //borrowed assets
    $query = "SELECT COUNT(*) as borrowed FROM assets WHERE status = 'borrowed'";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $borrowed = $stmt->fetch(PDO::FETCH_ASSOC)['borrowed'];
    
    //maintenance assets
    $query = "SELECT COUNT(*) as maintenance FROM assets WHERE status = 'maintenance'";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $maintenance = $stmt->fetch(PDO::FETCH_ASSOC)['maintenance'];
    
    //inactive assets
    $query = "SELECT COUNT(*) as inactive FROM assets WHERE status = 'inactive'";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $inactive = $stmt->fetch(PDO::FETCH_ASSOC)['inactive'];
    
    echo json_encode([
        'success' => true,
        'data' => [
            'total' => (int)$total,
            'borrowed' => (int)$borrowed,
            'maintenance' => (int)$maintenance,
            'inactive' => (int)$inactive
        ]
    ]);
}

if ($_GET['action'] == 'getRecentActivities') {
    // Get recent activities from asset_transactions table
    $query = "SELECT 
                at.transaction_type,
                at.description,
                at.transaction_date,
                at.old_status,
                at.new_status,
                a.asset_name,
                a.asset_code,
                u.username as performed_by_name
              FROM asset_transactions at
              LEFT JOIN assets a ON at.asset_id = a.id
              LEFT JOIN users u ON at.performed_by = u.id
              ORDER BY at.transaction_date DESC 
              LIMIT 10";
    
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $activities = [];
    
    foreach ($transactions as $transaction) {
        $activity = [
            'type' => $transaction['transaction_type'],
            'description' => $transaction['description'],
            'time' => $transaction['transaction_date'],
            'asset_name' => $transaction['asset_name'],
            'asset_code' => $transaction['asset_code'],
            'performed_by' => $transaction['performed_by_name'],
            'old_status' => $transaction['old_status'],
            'new_status' => $transaction['new_status']
        ];
        

        // SYSTEM ICONS FOR TRANSACTIONS NI SIYA.
        switch ($transaction['transaction_type']) {
            case 'created':
                $activity['icon'] = 'fas fa-plus-circle';
                $activity['title'] = 'New Asset Added';
                $activity['color'] = 'success';
                break;
            case 'borrowed':
                $activity['icon'] = 'fas fa-hand-holding';
                $activity['title'] = 'Asset Borrowed';
                $activity['color'] = 'warning';
                break;
            case 'returned':
                $activity['icon'] = 'fas fa-undo';
                $activity['title'] = 'Asset Returned';
                $activity['color'] = 'info';
                break;
            case 'maintenance':
                $activity['icon'] = 'fas fa-tools';
                $activity['title'] = 'Maintenance Update';
                $activity['color'] = 'primary';
                break;
            case 'disposed':
                $activity['icon'] = 'fas fa-trash';
                $activity['title'] = 'Asset Disposed';
                $activity['color'] = 'danger';
                break;
            case 'updated':
                $activity['icon'] = 'fas fa-edit';
                $activity['title'] = 'Asset Updated';
                $activity['color'] = 'info';
                break;
            default:
                $activity['icon'] = 'fas fa-info-circle';
                $activity['title'] = 'Asset Activity';
                $activity['color'] = 'secondary';
                break;
        }
        
        $activities[] = $activity;
    }
    
    echo json_encode([
        'success' => true,
        'activities' => $activities
    ]);
}
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => "Database error: " . $e->getMessage()
    ]);
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => "Error: " . $e->getMessage()
    ]);
}
?>