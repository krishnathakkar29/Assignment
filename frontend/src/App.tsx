import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "./components/ui/sonner";
import Layout from "./layout/Layout";
import { MessageGenerator } from "./pages/message-generator";
import LinkedInScraper from "./pages/linkedin-scrapper";
import CampaignsDashboard from "./pages/campaign-dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<CampaignsDashboard />} />
            <Route path="/generate-message" element={<MessageGenerator />} />
            <Route path="/linkedin-scraper" element={<LinkedInScraper />} />
          </Route>
        </Routes>
        <Toaster richColors position="bottom-right" />
      </BrowserRouter>{" "}
    </>
  );
}

export default App;
