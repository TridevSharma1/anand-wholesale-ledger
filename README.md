# Anand Wholesale Ledger

Clone this repo and complete it :- https://github.com/TridevSharma1/anand-wholesale-ledger.git


## Project Information

**Client Name:** Anand Wholesale

**Business Name:** Anand Wholesale

**Business Type:** Wholesale Distributor & Offline Billing Software

**Address:**
Extension Center, NH-52, Vijayapur-Solapur Rd,
Tidagundi, Vijayapura,
Karnataka - 586119

**Phone:** +91 91759 95609

**Email:** anand@gmail.com

---

# Primary Objective

Create a **professional, responsive and modern Wholesale Billing Software UI** for **Anand Wholesale**.

The project must be built using:

- React.js
- Vite
- Tailwind CSS

### Important Rules

- Do NOT use Next.js.
- Do NOT use TypeScript.
- Do NOT use Material UI, Bootstrap, Chakra UI, Ant Design or any other UI library.
- Do NOT use Redux, Zustand or any state management library.
- Do NOT use Firebase.
- Do NOT use any backend.
- Do NOT use any database.
- Do NOT use APIs.
- Use only React + Vite + Tailwind CSS.
- Use Mock Data (JSON Arrays only).
- All data should be hardcoded.
- Keep the project structure clean and production-ready.

---

# Design Theme

The website should represent a **Wholesale Business**.

Use business colors:

Primary Color:
- #1E3A8A (Deep Blue)

Secondary:
- #0F766E (Teal)

Accent:
- #F59E0B (Amber)

Success:
- #16A34A

Danger:
- #DC2626

Background:
- #F8FAFC

Cards:
- White

Buttons:
- Rounded
- Professional
- Soft shadow

Use a modern dashboard design with clean spacing and business-focused UI.

---

# Hero Section

Create a professional hero section.

Include:

- Large wholesale warehouse/banner image
- Company Name
- Billing Software Heading
- Short business description
- "Manage Purchase, Sales & Inventory Easily"
- Get Started button
- Contact button

Hero should have a modern gradient background.

---

# Public Website Pages

- Home
- About Us
- Services
- Features
- Pricing
- Contact
- Login
- Footer

---

# Footer

Footer should contain:

- Company Information
- Address
- Phone
- Email
- Quick Links
- Social Icons (Mock)
- Copyright
- **Admin Login Redirect Link**

The Admin Login link should be clearly visible.

---

# Login System

Create Mock Login.

## Roles

### Admin

Full Access

### Cashier

Limited Access

No authentication required.

Just simulate login using mock credentials.

Example:

Admin

Email:
admin@anand.com

Password:
admin123

Cashier

Email:
cashier@anand.com

Password:
cash123

---

# Admin Dashboard

Dashboard should include summary cards:

- Total Products
- Total Categories
- Today's Sales
- Monthly Sales
- Total Purchases
- Stock Value
- Pending Vendor Payments
- Expenses
- Active Customers

Charts are not required.

Use cards only.

---

# Admin Modules

## Product Category

Fields

- Category Name
- Description
- Status

CRUD UI using Mock Data.

---

## Product Management

Fields

- Product Name
- Category
- Brand
- Size
- SKU
- Purchase Price
- Selling Price
- Quantity
- Stock Status
- Barcode (Mock)
- Unit

---

## Purchase Entry

Create Purchase Entry Screen.

Fields

- Purchase ID
- Vendor Name
- Invoice Number
- Purchase Date
- Due Date
- Payment Status
- Product List
- Quantity
- Rate
- Discount
- GST
- Total Amount
- Notes

---

## Vendor Management

Fields

- Vendor Name
- Phone
- Email
- GST Number
- Address
- Outstanding Balance
- Due Date
- Status

---

## Purchase Report

Purchase Report should include:

- Purchase ID
- Vendor Name
- Product
- Quantity
- Total Amount
- Paid Amount
- Due Amount
- Due Date
- Payment Status
- Purchase Date

Provide:

- Search
- Filter
- Export Button (Mock)
- Print Button (Mock)

---

## Sales Billing

Billing Screen should include:

- Bill Number
- Customer Name
- Mobile Number
- Product Search
- Product List
- Quantity
- Discount
- GST
- Grand Total
- Payment Type
- Cash
- UPI
- Card

Buttons

- Save Bill
- Print Bill
- Cancel

Use mock invoice generation.

---

## Stock Management

Display:

- Product
- Current Stock
- Purchase Quantity
- Sold Quantity
- Remaining Stock
- Low Stock Alert

---

## Customer Management

Fields

- Customer Name
- Phone
- Address
- Total Purchase
- Outstanding Amount

---

## Expense Module

Fields

- Expense Name
- Category
- Amount
- Date
- Description

Expense Categories

- Electricity
- Rent
- Salary
- Transport
- Office Expense
- Maintenance
- Miscellaneous

---

## Reports

Create separate pages for:

- Purchase Report
- Sales Report
- Expense Report
- Stock Report
- Vendor Report

All using mock data.

---

## Vendor Due Payment

Separate page showing:

- Vendor Name
- Invoice Number
- Due Amount
- Due Date
- Status

Highlight overdue payments using red badges.

---

## Inventory

Display:

- Product
- Opening Stock
- Purchased
- Sold
- Available
- Stock Value

---

## Settings

Business Information

Editable Mock Form

Fields

- Company Name
- GST Number
- Address
- Email
- Phone
- Logo Upload (Mock)
- Invoice Prefix

---

# Cashier Dashboard

Cashier should ONLY have access to:

- Dashboard
- Sales Billing
- Product Search
- Customer Search
- Print Bill

Cashier must NOT access:

- Purchase
- Vendor
- Expense
- Reports
- Settings
- Product Management
- Categories
- User Management

Restrict navigation based on role.

---

# Navigation

Sidebar

Admin Menu

- Dashboard
- Categories
- Products
- Purchase
- Vendors
- Purchase Reports
- Sales Billing
- Customers
- Inventory
- Stock
- Expenses
- Reports
- Settings
- Logout

Cashier Menu

- Dashboard
- Sales Billing
- Product Search
- Customers
- Logout

---

# UI Requirements

- Fully Responsive
- Mobile Friendly
- Tablet Friendly
- Desktop Friendly
- Professional Cards
- Search Bars
- Filters
- Tables
- Pagination UI (Mock)
- Toast-style success/error messages (Mock using React state only)
- Confirmation Dialogs (Mock)
- Smooth hover effects
- Clean spacing
- Modern icons created with simple SVG or CSS (avoid external icon libraries)

---

# Mock Data

Create realistic mock data for:

- 30 Products
- 10 Categories
- 20 Vendors
- 30 Customers
- 50 Purchase Records
- 100 Sales Records
- 20 Expense Records

---

# Folder Structure

```
src/
 components/
 layouts/
 pages/
   Home/
   Admin/
   Cashier/
 data/
 assets/
 hooks/
 utils/
 App.jsx
 main.jsx
```

---

# Final Deliverable

Generate a complete **React + Vite + Tailwind CSS** project for **Anand Wholesale Billing Software** with a professional wholesale business design, using only mock data and no backend. Ensure the Admin Panel controls almost every business operation, while the Cashier role is limited strictly to billing and sales. The UI should be clean, scalable, responsive, and suitable for future backend integration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1522bbc9-d306-4411-8f79-3cc30de2096c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
