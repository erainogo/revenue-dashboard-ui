Sales Analytics Dashboard
A React-based dashboard application that provides comprehensive sales insights through interactive charts and data tables. The application fetches data from various analytics APIs to display country-level revenue, product analytics, monthly sales summaries, and regional revenue breakdowns.
Features

Country-Level Revenue Analysis: Paginated table showing revenue data by country
Product Analytics: Displays frequently purchased products with interactive charts
Monthly Sales Summary: Time-series visualization of sales performance over months
Regional Revenue Breakdown: Geographic analysis of revenue distribution across regions
Interactive Data Visualization: Charts and graphs for better data comprehension

API Endpoints
The application integrates with the following backend APIs:
Country Revenue API
GET http://localhost:8090/api/insights/getcountrylevelrevenue
Parameters: page, limit

Provides paginated country-level revenue data
Supports pagination with configurable page size
Returns structured data array with revenue metrics by country

Product Analytics API
GET http://localhost:8090/api/insights/getfrequentlypurchasedproducts

Returns data on most frequently purchased products
Includes product performance metrics
Used for product popularity analysis

Monthly Sales Summary API
GET http://localhost:8090/api/insights/getmonthlysalessummary

Provides monthly aggregated sales data
Time-series data for trend analysis
Supports sales performance tracking over time

Regional Revenue API
GET http://localhost:8090/api/insights/getregionrevenyesummary

Returns revenue breakdown by geographic regions
Enables regional performance comparison
Supports geographic sales analysis

Data Display Components
Charts

Bar Charts: Product frequency and regional comparisons
Line Charts: Monthly sales trends and time-series analysis
Pie Charts: Revenue distribution by region/country
Interactive Legends: Toggle data series visibility

Tables

Paginated Data Tables: Country revenue with sorting capabilities
Infinite Scroll: Seamless data loading for large datasets
Responsive Columns: Adaptive layout for different screen sizes
Search and Filter: Quick data discovery features

Prerequisites
Before running the application, ensure you have:

npm
Backend API Server running on http://localhost:8090

Installation & Setup

1. Clone the Repository
bashgit clone <repository-url>
cd sales-analytics-dashboard

2. Install Dependencies
bash# Using npm
npm install

3. Start the Development Server
bash# Using npm
npm start