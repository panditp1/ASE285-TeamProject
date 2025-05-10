# User Stories – Inventory Manager

## Add Items
- As an inventory manager, I want to add a new item with a name, price, quantity, and category so that I can track stock accurately from the beginning.
- As a user, I want to add descriptive tags to items so I can better categorize and filter them during search.

## View Stock & Search
- As a user, I want to view all inventory items on a single dashboard so that I can get a quick overview of our current stock.
- As a user, I want to search by item name, category, or tags so that I can locate products quickly and efficiently.
- As a manager, I want to sort items by category or availability so that I can better plan orders or inventory adjustments.

## Update & Manage Inventory
- As an inventory manager, I want to update an item's quantity, name, price, or category so that I can maintain accurate records over time.
- As a manager, I want to see a visual graph of an item's quantity history so that I can understand inventory trends at a glance.
- As a user, I want to delete discontinued or outdated items so that the database remains relevant and uncluttered.

## Import & Export
- As a manager, I want to import items from a `.csv` file so that I can bulk load inventory without manual entry.
- As a user, I want to export the current inventory to a `.csv` file so I can use the data in external tools (e.g., Excel or analytics).
- As a manager, I want the import system to validate entries to ensure only properly formatted items are added.

## Inventory Graphs
- As a user, I want to click on an item and view its stock history in a visual bar chart so that I can understand how it’s been used or sold over time.
- As a manager, I want this graph to reflect both current and past quantity values to better analyze restocking needs.

## Low Stock Notifications
- As a manager, I want to receive an email notification (via EmailJS) when an item’s quantity drops below a set threshold so that I can take action before stock runs out.
- As a user, I want the low-stock threshold to be configurable per item so that we can set urgency levels based on importance.
- As a manager, I want the system to flag low-stock items visually in the dashboard for quick identification.

## Secure Login
- As a manager, I want to log in with a valid email and password so that only authorized users can access or edit the inventory.

## History Tracking
- As a manager, I want changes to be logged with a timestamp so that I can audit inventory activity.
