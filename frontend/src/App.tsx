import React, { useRef, useState } from "react";
import type { EndpointStat } from "../../types";
import { LatencyChart } from "./charts/latency";
import { StatusCodeChart } from "./charts/statusCode";

export default function FileUploader() {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [results, setResults] = useState<EndpointStat[]>();
    const [searchRoute, setSearchRoute] = useState("");
    const [selectedMethod, setSelectedMethod] = useState("");
    const [isMethodDropdownOpen, setIsMethodDropdownOpen] = useState(false);

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file: File) => {
        if (!file.name.endsWith(".jsonl")) {
            alert("Please upload a .jsonl file.");
            return;
        }

        try {
            const text = await file.text();

            const logs = text
                .split("\n")
                .filter((line) => line.trim() !== "")
                .map((line) => JSON.parse(line));

            const response = await fetch(
                "http://localhost:3000/api/analyze",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(logs),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to analyze logs on server");
            }

            const analyzedResults: EndpointStat[] = await response.json();

            setResults(analyzedResults);

            if (analyzedResults.length > 0) {
                setSelectedMethod(analyzedResults[0].method);
                setSearchRoute(analyzedResults[0].route);
            }
        } catch (error) {
            console.error("Error parsing JSONL:", error);
            alert("Failed to parse the file.");
        }
    };

    const methods = results
        ? Array.from(new Set(results.map((result) => result.method)))
        : [];


    const routes = results
        ? Array.from(
            new Set(
                results
                    .filter(
                        (result) => result.method === selectedMethod
                    )
                    .map((result) => result.route)
            )
        )
        : [];


    const routeSuggestions = routes.filter((route) =>
        route.toLowerCase().startsWith(searchRoute.toLowerCase())
    );

    const selectedResult = results?.find(
        (result) =>
            result.method === selectedMethod &&
            result.route === searchRoute
    );

    return (
        <div className="page-wrapper">
            <h1 className="title">Endpoint analyzer</h1>

            {!results ? (
                <div
                    className={`dropZone ${isDragging ? "is-dragging" : ""
                        }`}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <p className="dropText">
                        Drag and drop your <strong>.jsonl</strong> file here
                    </p>

                    <p className="subText">
                        or click to browse your files
                    </p>

                    <input
                        type="file"
                        accept=".jsonl"
                        ref={fileInputRef}
                        onChange={onFileSelect}
                        style={{ display: "none" }}
                    />
                </div>
            ) : (
                <div>
                    <div className="search-controls">
                        <div>
                            <div className="relative">
                                <button
                                    type="button"
                                    className="method-select flex items-center justify-between gap-3 min-w-[120px]"
                                    onClick={() => setIsMethodDropdownOpen(!isMethodDropdownOpen)}
                                    onBlur={() => setTimeout(() => setIsMethodDropdownOpen(false), 150)}
                                >
                                    {selectedMethod || "Select"}

                                    <svg
                                        width="16" height="16" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round"
                                        style={{ transform: isMethodDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                                    >
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>

                                {isMethodDropdownOpen && (
                                    <div className="suggestions-menu" style={{ width: '100%' }}>
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
                                                {method}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="route-search-wrapper">

                            <input
                                id="route"
                                type="text"
                                className="route-input"
                                value={searchRoute}
                                onChange={(e) =>
                                    setSearchRoute(e.target.value)
                                }
                                placeholder="/users"
                            />

                            {searchRoute &&
                                routeSuggestions.length > 0 &&
                                !selectedResult && (
                                    <div className="suggestion-menu">
                                        {routeSuggestions.map((route) => (
                                            <div
                                                key={route}
                                                onClick={() =>
                                                    setSearchRoute(route)
                                                }
                                                className="cursor-pointer"
                                            >
                                                {route}
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </div>
                    </div>

                    {selectedResult ? (
                        <div className="w-[95vw] max-w-7xl w-full flex flex-col items-center gap-4">

                            <div className="flex gap-3">
                                <div className="stat">
                                    <div>Success rate</div>
                                    <div>{selectedResult.successRate.toFixed(2)}%</div>
                                </div>

                                <div className="stat">
                                    <div>Requests</div>
                                    <div>{selectedResult.requests.length}</div>
                                </div>
                            </div>

                            <div className="chart-card">
                                <div className="card-header">
                                    <h3>Latency</h3>
                                    <span>Response time</span>
                                </div>

                                <LatencyChart
                                    data={selectedResult.requests}
                                />
                            </div>

                            <div className="flex gap-3 w-full">
                                <div className="stat-card">
                                    <span>Median</span>
                                    <strong>
                                        {selectedResult.latency.median} ms
                                    </strong>
                                </div>

                                <div className="stat-card">
                                    <span>p95</span>
                                    <strong>
                                        {selectedResult.latency.p95} ms
                                    </strong>
                                </div>

                                <div className="stat-card">
                                    <span>Max</span>
                                    <strong>
                                        {selectedResult.latency.max} ms
                                    </strong>
                                </div>
                            </div>

                            <div className="chart-card">
                                <div className="card-header">
                                    <h3>Status codes</h3>
                                    <span>Request distribution</span>
                                </div>

                                <StatusCodeChart
                                    data={selectedResult.requests}
                                />
                            </div>

                        </div>
                    ) : (
                        <p />
                    )}
                </div>
            )}
        </div>
    );
}