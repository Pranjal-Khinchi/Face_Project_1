# Amazon.in-style shopping demo

A React + Vite frontend demo with a larger sample catalog, category filtering, search, sorting, product detail dialogs, wishlist toggles, cart quantities, demo checkout, account sign-in simulation, order history for the current session, delivery PIN editing, and language preference selection.

## Run in VS Code (Windows PowerShell)
1. Extract this ZIP.
2. Open the extracted `amazon.in-demo` folder in VS Code.
3. Open Terminal and run:

```powershell
cd frontend
npm install
npm run dev
```

Open the localhost URL printed by Vite (usually http://localhost:5173).

## Notes
- This is a learning/demo project, not the official Amazon.in website and not affiliated with Amazon.
- Sign-in is a local demo name only. It does not create a real account or use passwords.
- Checkout creates a local demo order only. No real payment, shipping, authentication, or customer account service is connected.
- Order history is kept in the current browser session; cart and demo sign-in name are stored in local browser storage.
- Product images use remote Unsplash URLs, so an internet connection is needed for images.
- The `backend` folder contains a separate starter API and is not required to run the frontend demo.
