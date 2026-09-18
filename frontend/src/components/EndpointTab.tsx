import { useState, useEffect } from "react";
import type { EndpointData } from "../../../types";
import { Dashboard } from "../components/Dashboard";
import { getMethodColor } from "../utils/methodColors";

type Props = {
    results: EndpointData[];
};

export function EndpointTab({ results }: Props) {
    const [searchRoute, setSearchRoute] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("");
    const [isMethodDropdownOpen, setIsMethodDropdownOpen] = useState(false);

    useEffect(() => {
        if (results.length > 0 && !selectedMethod) {
            setSelectedMethod(results[0].method);
            setSearchRoute(results[0].route);
        }
    }, [results]);

    const methods = Array.from(new Set(results.map((result) => result.method)));

    const routes = Array.from(
        new Set(
            results
                .filter((result) => result.method === selectedMethod)
                .map((result) => result.route)
        )
    );

    const routeSuggestions = routes.filter((route) =>
        route.toLowerCase().includes(searchRoute.toLowerCase())
    );

    const selectedResult = results.find(
        (result) => result.method === selectedMethod && result.route === searchRoute
    );

    return (
        <div className="flex flex-col items-center gap-10 w-full">
            <div className="search-controls">
                <div>
                    <div className="relative">
                        <button
                            type="button"
                            className={`method-select ${selectedMethod ? getMethodColor(selectedMethod) : ""
                                }`}
                            onClick={() => setIsMethodDropdownOpen(!isMethodDropdownOpen)}
                            onBlur={() => setTimeout(() => setIsMethodDropdownOpen(false), 150)}
                        >
                            {selectedMethod || "Select"}
                        </button>

                        {isMethodDropdownOpen && (
                            <div className="suggestions-menu">
                                {methods.map((method) => (
                                    <div
                                        key={method}
                                        className="suggestion-item"
                                        onClick={() => {
                                            setSelectedMethod(method);
                                            setIsMethodDropdownOpen(false);
                                            const firstRoute = results
                                                .filter((result) => result.method === method)
                                                .map((result) => result.route)[0];
                                            setSearchRoute(firstRoute ?? "");
                                        }}
                                    >
                                        <span className={`method-badge ${getMethodColor(method)}`}>
                                            {method}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative flex items-center flex-1 w-full">
                    <input
                        id="route"
                        type="text"
                        className="route-input"
                        value={searchRoute}
                        onChange={(e) => setSearchRoute(e.target.value)}
                        placeholder="/users"
                    />

                    {searchRoute && routeSuggestions.length > 0 && !selectedResult && (
                        <div className="suggestions-menu">
                            {routeSuggestions.map((route) => (
                                <div
                                    key={route}
                                    onClick={() => setSearchRoute(route)}
                                    className="suggestion-item"
                                >
                                    {route}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedResult && (
                <div className="w-full">
                    <Dashboard requests={selectedResult.requests} />
                </div>
            )}
        </div>
    );
}