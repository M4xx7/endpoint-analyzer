import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../DataContext";
import { OverviewTab } from "../OverviewTab";
import { EndpointTab } from "../EndpointTab";

type Tab = "OVERVIEW" | "ENDPOINT";

export function DashboardPage() {
    const { results, setResults } = useData();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>("ENDPOINT");

    useEffect(() => {
        if (!results) {
            navigate("/");
        }
    }, [results, navigate]);

    if (!results) return null;

    const handleBack = () => {
        setResults(null);
        navigate("/");
    };

    return (
        <div className="w-full min-h-screen px-4 md:px-8 py-6">
            <div className="relative flex justify-center items-center w-full mb-8 pb-4">

                <button
                    onClick={handleBack}
                    className="absolute left-0 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span className="hidden sm:inline font-medium">back</span>
                </button>

                <div className="relative flex border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab("OVERVIEW")}
                        className={`w-48 pb-3 font-medium transition-colors z-10 ${activeTab === "OVERVIEW" ? "text-white" : "text-gray-400 hover:text-gray-200"
                            }`}
                    >
                        Overview
                    </button>

                    <button
                        onClick={() => setActiveTab("ENDPOINT")}
                        className={`w-48 pb-3 font-medium transition-colors z-10 ${activeTab === "ENDPOINT" ? "text-white" : "text-gray-400 hover:text-gray-200"
                            }`}
                    >
                        Endpoints
                    </button>

                    <div className={`absolute bottom-0 left-0 w-48 h-[2px] bg-indigo-500 transition-transform duration-300 ${activeTab === "OVERVIEW" ? "translate-x-0" : "translate-x-full"
                        }`} />
                </div>
            </div>

            {activeTab === "OVERVIEW" && <OverviewTab results={results} />}
            {activeTab === "ENDPOINT" && <EndpointTab results={results} />}
        </div>
    );
}