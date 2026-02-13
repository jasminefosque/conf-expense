# Security Policy

## About This Project

This is a **demonstration application** for a Conference Expense Planner. It is designed to showcase modern web development practices and is **not intended for production use with real data**.

## Data Storage

- **Local Only**: All data is stored exclusively in the browser's `localStorage`
- **No Server**: This application does not communicate with any backend servers
- **No External APIs**: No data is sent to or received from external services
- **Privacy**: Your planning data never leaves your device

## Security Considerations

### What This Application Does

✅ Store conference planning data locally in your browser  
✅ Export data as CSV or JSON files to your local machine  
✅ Use client-side validation for user inputs  

### What This Application Does NOT Do

❌ Send data to any server  
❌ Store data in a database  
❌ Process payments or handle financial transactions  
❌ Collect personal information  
❌ Use cookies or tracking  

## Recommendations

- **Demo Use Only**: This application is designed for demonstration and learning purposes
- **Clear Data**: Use the "Reset" button to clear all stored data from localStorage
- **Browser Storage**: Data is tied to your browser and domain - clearing browser data will delete your plans
- **No Backups**: Since data is stored locally only, make sure to export important plans as CSV/JSON

## Reporting Security Issues

If you discover a security vulnerability in this demo application, please report it by:

1. Opening an issue on the GitHub repository
2. Describing the vulnerability in detail
3. Including steps to reproduce if applicable

## Updates

This security policy may be updated periodically. Last updated: February 2026.
