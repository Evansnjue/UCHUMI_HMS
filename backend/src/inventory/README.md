# Inventory (Central Store) Module

Overview
- Tracks all inventory across departments
- Allows add/remove/transfer stock with batch & expiry handling
- Emits events: `StockUpdated`, `StockLowAlert`

DB
- Run `backend/src/inventory/migrations/001-create-inventory-schema.sql` to create tables: `departments`, `inventory_items`, `stock_movements`

API
- GET /inventory/items — list items (Roles: Admin, Pharmacist, SupplyManager)
- GET /inventory/items/:id — get item details
- POST /inventory/items/add — add stock (Roles: Admin, SupplyManager)
  - Body: { itemId, quantity, reason }
- POST /inventory/items/remove — remove stock (Roles: Admin, SupplyManager)
- POST /inventory/items/transfer — transfer stock between departments (Roles: Admin, SupplyManager)
- GET /inventory/items/low — list items below threshold

Business rules
- Only `Admin` and `SupplyManager` may perform add/remove/transfer operations (RBAC enforced)
- Stock operations are transactional and recorded in `stock_movements` for audit
- Low stock alerts are emitted as events (`StockLowAlert`) and recorded in `pharmacy_audit`

Testing
- Unit tests added in `backend/src/inventory/tests` and e2e scaffold in `inventory.controller.int-spec.ts`

Notes
- Integrate with Notification service for `StockLowAlert` to email/SMS/webhooks
- Import `InventoryModule` into `AppModule` to enable endpoints
