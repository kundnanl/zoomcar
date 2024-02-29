import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Host from "./pages/Host";
import CarRentPage from "./pages/CarRentPage";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/carRentPage" element={<CarRentPage />} />
        <Route path="/host" element={<Host />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const PUBLISHABLE_KEY =
  process.env.VITE_CLERK_PUBLISHABLE_KEY ||
  "pk_test_bW9yZS1za3lsYXJrLTQ4LmNsZXJrLmFjY291bnRzLmRldiQ";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ClerkProvider publishableKey="pk_test_bW9yZS1za3lsYXJrLTQ4LmNsZXJrLmFjY291bnRzLmRldiQ">
      <App />
      <Toaster />
  </ClerkProvider>
);
