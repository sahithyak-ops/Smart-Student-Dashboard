LUNERA — FRONTEND REFRESH

Contents:
- index.html
- style.css
- script.js

INSTALL:
1. Stop the frontend server with Ctrl+C in its PowerShell window.
2. Make a backup copy of your current frontend folder.
3. Extract these three files into:
   C:\Users\sahit\Desktop\PROJECTS\SmartStudentDashboard\frontend
4. Choose Replace files when prompted.
5. Restart the frontend server:
   python -m http.server 5500
6. Open http://127.0.0.1:5500/ and hard-refresh with Ctrl+Shift+R.

The existing FastAPI backend and API URL are unchanged.

FIRST VISIT:
- Enter your name once.
- Add a personal reminder if you want.
- Choose “Skip quote” to continue without a quote.
- The name and quote are saved in this browser using localStorage.
- The quote is optional; skipping it does not prevent entry to the dashboard.

NOTES:
- Lucide icons are loaded from the Lucide CDN, so internet access is needed for those icons.
- Existing API-backed dashboard features remain wired to the original backend.
