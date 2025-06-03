# transparency-insurance-system

Getting Started
After cloning the repository, follow the steps below to set up and run the project:

1. Switch to the develop branch
git checkout develop

2. Set up the API server
cd api
yarn install      # Install all backend dependencies
yarn start        # Start the API server
The API server should now be running on http://localhost:3000. You can test this by opening the URL in your browser.

3. Set up the Web client
Open a new terminal window/tab and run the following:
cd web
npm install       # Install all frontend dependencies
npm run dev       # Start the web application
The web app will typically be accessible at http://localhost:5173 or the port shown in the terminal.