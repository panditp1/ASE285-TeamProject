# Epics & Requirements

## Feature: Add & Manage Items (Jacob)

**Epic:**  
Allow users to create, update, and manage inventory items with essential details and historical tracking.

**User Stories:**
- As an inventory manager, I want to add a new item with a name, price, quantity, and category so that I can track stock accurately from the beginning.
- As a user, I want to add descriptive tags to items so I can better categorize and filter them during search.
- As an inventory manager, I want to update an item's quantity, name, price, or category so that I can maintain accurate records over time.
- As a user, I want to delete discontinued or outdated items so that the database remains relevant and uncluttered.
- As a manager, I want changes to be logged with a timestamp so that I can audit inventory activity.

**Requirements:**
- [ ] Create a form to add inventory items with fields: name, quantity, price, category, and tags
- [ ] Validate form inputs (e.g., prevent negative quantity or price)
- [ ] Enable editing and updating existing items
- [ ] Allow deleting or archiving items
- [ ] Store all item data in MongoDB
- [ ] Track and store update history with timestamps

## Feature: View, Search & Filter Items (Jacob)

**Epic:**  
Enable users to view and search through the inventory using various filters and criteria.

**User Stories:**
- As a user, I want to view all inventory items on a single dashboard so that I can get a quick overview of our current stock.
- As a user, I want to search by item name, category, or tags so that I can locate products quickly and efficiently.
- As a manager, I want to sort items by category or availability so that I can better plan orders or inventory adjustments.

**Requirements:**
- [ ] Display inventory items in a clean, scrollable list or card view
- [ ] Add a search bar to filter by name, category, or tags
- [ ] Allow real-time filtering and sorting by category or stock status
- [ ] Sync item data with MongoDB dynamically

## Feature: Inventory Graphs (Jacob)

**Epic:**  
Give users visual insight into inventory trends through interactive stock history graphs.

**User Stories:**
- As a manager, I want to see a visual graph of an item's quantity history so that I can understand inventory trends at a glance.
- As a user, I want to click on an item and view its stock history in a visual bar chart so that I can understand how it’s been used or sold over time.
- As a manager, I want this graph to reflect both current and past quantity values to better analyze restocking needs.

**Requirements:**
- [ ] Implement bar charts for quantity history using Chart.js
- [ ] Display stock history per item with timestamps
- [ ] Load graph data dynamically based on item selection

## Feature: Import & Export Inventory (Jacob)

**Epic:**  
Provide tools for bulk management of inventory data through `.csv` import/export.

**User Stories:**
- As a manager, I want to import items from a `.csv` file so that I can bulk load inventory without manual entry.
- As a user, I want to export the current inventory to a `.csv` file so I can use the data in external tools (e.g., Excel or analytics).
- As a manager, I want the import system to validate entries to ensure only properly formatted items are added.

**Requirements:**
- [ ] Implement `.csv` export button to download current inventory
- [ ] Implement `.csv` import form to upload new items
- [ ] Validate imported rows (ensure name, quantity, price, and category are present)
- [ ] Handle import errors with user feedback

## Feature: Low Stock Notifications (Preston)

**Epic:**  
Alert managers when inventory levels drop below a threshold to prompt timely restocking.

**User Stories:**
- As a manager, I want to receive an email notification (via EmailJS) when an item’s quantity drops below a set threshold so that I can take action before stock runs out.
- As a user, I want the low-stock threshold to be configurable per item so that we can set urgency levels based on importance.
- As a manager, I want the system to flag low-stock items visually in the dashboard for quick identification.

**Requirements:**
- [ ] Monitor stock levels and flag items below threshold
- [ ] Display low-stock alerts visually (e.g., red highlight or badge)
- [ ] Configure EmailJS to send alert emails to manager accounts
- [ ] Allow per-item threshold customization

## Feature: Secure Login (Preston)

**Epic:**  
Restrict access to inventory management features using email and password authentication.

**User Stories:**
- As a manager, I want to log in with a valid email and password so that only authorized users can access or edit the inventory.

**Requirements:**
- [ ] Implement login form with email/password
- [ ] Validate login credentials against environment-stored values
- [ ] Redirect unauthorized users to login page
- [ ] Store session token during active session

---

## Feature: Category Breakdown Chart (Priyanka)

**Epic:**  
Provide a separate visual representation of item categories via pie chart.

**User Stories:**
- As a user, I want to view a pie chart of the inventory grouped by category so that I can see the stock distribution at a glance.

**Requirements:**
- [ ] Implement a pie chart showing category breakdown
- [ ] Pull category data from MongoDB
- [ ] Display chart in a dedicated panel or page

## Feature: Trending Items View (Priyanka)

**Epic:**  
Highlight the top 3 and bottom 3 stocked items based on quantity.

**User Stories:**
- As a user, I want to see a list of top 3 and bottom 3 stocked items so I can monitor overstocked or understocked products easily.

**Requirements:**
- [ ] Calculate top 3 and bottom 3 items based on quantity
- [ ] Display these lists in a dedicated widget or section
- [ ] Refresh data in real time