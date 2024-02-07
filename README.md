# React Chat

<p align="center">
  <a href="https://react-chat-aa.netlify.app">
    <img src="https://github.com/AlAstapchyk/react-chat/assets/104316850/84250b1b-9a3d-48a4-a260-a05834b60cec" alt="Icon" height="120">
  </a>
</p>

Chat PWA based on [React.js](https://react.dev/), powered by [Vite](https://vitejs.dev/); [Firebase](https://firebase.google.com/) for authentication and data storage. 

The application is available at the link address: https://react-chat-aa.netlify.app

Since it is PWA, application can be installed on any device using browser that supports this technology.

Also you can launch locally or deploy app with your configuration.

### Custom Firebase configuration

1. Create project on [Firebase](https://firebase.google.com/)
2. Enable Authentication with Email, Google and GitHub
3. Enable Firestore
4. Clone repository and go to it
5. Rename .env.example file to .env and insert the appropriate values from the Firebase project configuration

### Local launch

After configuration you can launch app locally using the following command:

```bash
npm run dev

