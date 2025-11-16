-- Add some inactive assets for testing
-- Update existing asset to inactive status
UPDATE assets SET 
    status = 'inactive', 
    condition_status = 'poor',
    notes = 'Hardware failure - motherboard damaged',
    updated_at = CURRENT_TIMESTAMP
WHERE serial_number = 'ASSET-2024-005';

-- Add some new inactive assets
INSERT INTO assets (serial_number, name, description, category_id, department_id, purchase_date, purchase_cost, status, condition_status, location, notes) VALUES 
('ASSET-2022-045', 'Old Desktop Computer', 'Outdated desktop computer', 1, 5, '2022-01-15', 25000.00, 'inactive', 'poor', 'Computer Lab room 22', 'End of life - too old for current software requirements'),
('ASSET-2022-033', 'Broken Projector', 'Projector with display issues', 2, 2, '2022-03-10', 35000.00, 'inactive', 'poor', 'School of Education', 'Beyond repair - display panel cracked'),
('ASSET-2021-078', 'Outdated Laptop', 'Old laptop with performance issues', 1, 3, '2021-06-20', 40000.00, 'inactive', 'fair', 'School of Business', 'Performance issues - too slow for current applications'),
('ASSET-2022-012', 'Faulty Audio Equipment', 'Audio system with hardware problems', 2, 6, '2022-02-28', 28000.00, 'inactive', 'poor', 'Speech Lab', 'Hardware failure - amplifier not working'),
('ASSET-2021-089', 'Old Printer', 'Laser printer replaced by newer model', 5, 1, '2021-11-10', 18000.00, 'inactive', 'good', 'School of Technology', 'Replaced by new model - still functional but outdated');

-- Add transaction records for these inactive assets
INSERT INTO asset_transactions (asset_id, transaction_type, description, old_status, new_status, transaction_date) 
SELECT id, 'updated', 'Asset deactivated', 'active', 'inactive', updated_at 
FROM assets 
WHERE status = 'inactive' AND serial_number IN ('ASSET-2024-005', 'ASSET-2022-045', 'ASSET-2022-033', 'ASSET-2021-078', 'ASSET-2022-012', 'ASSET-2021-089');
