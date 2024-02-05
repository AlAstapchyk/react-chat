import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { ChatContextProvider } from "./context/ChatContext.tsx";
// import { StrictMode } from "react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <AuthContextProvider>
      <ChatContextProvider>
        <App />
      </ChatContextProvider>
    </AuthContextProvider>
  </BrowserRouter>,
  // </StrictMode>,
);
