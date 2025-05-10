# Inventory Manager – Team 2

## Slogan
Simple, Fast, and Reliable Inventory Tracking.

## Goal
Build a user-friendly inventory management system using Node.js and MongoDB that allows authorized users to efficiently manage stock, track inventory in real-time, and receive smart alerts for low-stock items.

## Features

### Add Items
- Add inventory entries with name, quantity, price, category, and optional tags.

### View Stock & Search
- View all items on a central dashboard.
- Search by name, category, or tags.
- Filter items and sort by availability or category.

### Update & Manage Inventory
- Update item details including name, quantity, price, and category.
- View item history graph with quantity changes over time.
- Delete or disable discontinued items.

### Low Stock Notifications
- Receive email alerts via EmailJS when item quantity falls below threshold.
- Set custom low-stock thresholds per item.
- Visually flag low-stock items in the dashboard.

### Import & Export
- Import inventory items from `.csv` files.
- Export inventory to `.csv` for external use.
- Validate imported entries to ensure format correctness.

### Secure Login
- Authenticate with a valid email and password (via environment variables).

### History Tracking
- Track item changes with timestamped logs to audit inventory changes.

## Tools & Technologies

- **Runtime:** Node.js
- **Database:** MongoDB with Mongoose
- **Frontend:** React
- **API Testing:** Jest, Supertest
- **IDE:** Visual Studio Code & WebStorm
- **Docs:** Markdown, Pandoc
- **CI:** GitHub Actions
- **Communication:** Discord

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/your-org/inventory-manager.git
   cd inventory-manager
   ```

2. Install dependencies:
   ```
   npm install
   cd client
   npm install
   cd ../server
   npm install
   ```

3. Set up environment variables in `server/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/inventory
   LOGIN_EMAILS=admin@example.com
   LOGIN_PASSWORDS=password123
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Testing
To run backend tests:
```
npm test
```

## Team Members
- **Jacob Nelson** – Team Lead
- **Priyanka Pandit** 
- **Preston Jackson**

## Project Files
- `requirements.md` – Feature requirements
- `user-stories.md` – Expanded user stories
- `test-plan.md` – Testing methodology and cases
- `team-rules.md` – Team collaboration agreements
- `user-stories.md` – User stories