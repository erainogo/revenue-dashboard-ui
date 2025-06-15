#  Revenue-Dashboard-UI

A React-based dashboard application that provides comprehensive sales insights through interactive charts and data tables. The application fetches data from various analytics APIs to display country-level revenue, product analytics, monthly sales summaries, and regional revenue breakdowns.
Features

<img width="1728" alt="Screenshot 2025-06-15 at 19 14 38" src="https://github.com/user-attachments/assets/6e10b602-7bc9-4669-a7fa-2419cbc4be61" />

<img width="1728" alt="Screenshot 2025-06-15 at 19 15 02" src="https://github.com/user-attachments/assets/a79dff3f-bd33-47a5-a407-a05f765321c3" />

<img width="1728" alt="Screenshot 2025-06-15 at 19 15 34" src="https://github.com/user-attachments/assets/86b4ddf6-f586-4bdd-ab86-7294ec8aa0f2" />

### Country-Level Revenue Analysis: 
- Paginated table showing revenue data by country

### Product Analytics: 
- Displays frequently purchased products with interactive charts

### Monthly Sales Summary: 
- Time-series visualization of sales performance over months

### Regional Revenue Breakdown:
- Geographic analysis of revenue distribution across regions

# API Endpoints
The application integrates with the following backend APIs:

### Country Revenue API
GET - /api/insights/getcountrylevelrevenue

- Parameters: page, limit

- Provides paginated country-level revenue datay

### Product Summary API
GET - /api/insights/getfrequentlypurchasedproducts

- Returns data on most frequently purchased products

### Monthly Sales Summary API
GET - /api/insights/getmonthlysalessummary

- Provides monthly aggregated sales data

### Regional Revenue API
GET - /api/insights/getregionrevenyesummary

- Returns revenue breakdown by geographic regions

# Data Display Components

### Charts

- Bar Charts: Product frequency and regional comparisons
- Line Charts: Monthly sales trends and time-series analysis

### Tables

- Paginated Data Tables: Country revenue with sorting capabilities

# Prerequisites

- Before running the application, ensure you have: npm

- Backend API Server running on http://localhost:8090 or your desired port.

- Set up Backend Here - https://github.com/erainogo/revenue-dashboard/

# Installation & Setup

1. Clone the Repository

2. Install Dependencies

3. Start the Development Server
