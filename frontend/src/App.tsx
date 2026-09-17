import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./components/DataContext";
import { UploadPage } from "./components/pages/UploadPage";
import { DashboardPage } from "./components/pages/DashboardPage";

export default function App() {
    return (
        <DataProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<UploadPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
            </BrowserRouter>
        </DataProvider>
    );
}