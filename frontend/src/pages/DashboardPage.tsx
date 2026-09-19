import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../components/DataContext";
import { OverviewTab } from "../components/OverviewTab";
import { EndpointTab } from "../components/EndpointTab";

type Tab = "OVERVIEW" | "ENDPOINT";

export function DashboardPage() {
    const { results } = useData();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>("OVERVIEW");

    useEffect(() => {
        if (!results) {
            navigate("/");
        }
    }, [results, navigate]);

    if (!results) return null;

    return (
        <div className="w-full min-h-screen px-4 md:px-8 py-6">
            <div className="relative flex justify-center items-center w-full mb-8 pb-4">

                <div className="relative flex ">
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

                    <div className={`absolute bottom-0 left-0 w-48 h-[2px] bg-white transition-transform duration-300 ${activeTab === "OVERVIEW" ? "translate-x-0" : "translate-x-full"
                        }`} />
                </div>
            </div>

            {activeTab === "OVERVIEW" && <OverviewTab results={results} />}
            {activeTab === "ENDPOINT" && <EndpointTab results={results} />}
        </div>
    );
}