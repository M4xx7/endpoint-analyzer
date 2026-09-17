import { createContext, useContext, useState, type ReactNode } from "react";
import type { EndpointData } from "../../../types";

type DataContextType = {
    results: EndpointData[] | null;
    setResults: (data: EndpointData[] | null) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const [results, setResults] = useState<EndpointData[] | null>(null);
    return (
        <DataContext.Provider value={{ results, setResults }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) throw new Error("useData must be used within a DataProvider");
    return context;
}