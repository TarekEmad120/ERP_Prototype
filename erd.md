```mermaid
erDiagram
    %% === HR Module ===
    Department {
        string name
    }
    Employee {
        string name
        string email
        string position
        decimal salary
    }
    Department ||--o{ Employee : "has"

    %% === Finance Module ===
    Account {
        string name
        enum type
    }
    Transaction {
        date date
        string description
        decimal amount
    }
    Invoice {
        string invoice_number
        enum status
        decimal amount
        decimal paid_amount
        date issued_date
        date due_date
    }
    Account ||--o{ Transaction : "used for"
    Employee ||--o{ Transaction : "created by"
    Transaction ||--o{ Invoice : "pays for"

    %% === Sales Module ===
    Customer {
        string name
        string email
        string phone
        string address
    }
    SalesOrder {
        string order_number
        enum status
        date order_date
        decimal total_amount
    }
    SalesOrderItem {
        int quantity
        decimal unit_price
        decimal subtotal
    }
    Customer ||--o{ SalesOrder : "places"
    SalesOrder ||--o{ SalesOrderItem : "contains"
    Product ||--o{ SalesOrderItem : "sold as"
    Customer ||--o{ Invoice : "billed"
    SalesOrder ||--o{ Invoice : "generates"

    %% === Procurement Module ===
    Supplier {
        string name
        string contact_info
    }
    PurchaseOrder {
        string po_number
        enum status
        date order_date
        decimal total_amount
    }
    PurchaseOrderItem {
        int quantity
        decimal unit_cost
        decimal subtotal
    }
    Supplier ||--o{ PurchaseOrder : "supplies"
    PurchaseOrder ||--o{ PurchaseOrderItem : "contains"
    Product ||--o{ PurchaseOrderItem : "purchased as"

    %% === Inventory & Warehouse ===
    Product {
        string sku
        string name
        string description
        decimal unit_price
        int stock_quantity
    }
    Warehouse {
        string name
        string location
    }
    StockMovement {
        enum movement_type
        int quantity
        date movement_date
    }
    Product ||--o{ StockMovement : "tracked"
    Warehouse ||--o{ StockMovement : "track inside"
