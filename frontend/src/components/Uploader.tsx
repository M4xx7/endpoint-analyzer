import React, { useRef, useState } from "react";
import type { EndpointData } from "../../../types";
import { API_URL } from "../constants/constants";
import { InfoTooltip } from "./InfoToolTip";

type Props = {
    onUploadComplete: (data: EndpointData[]) => void;
};

export function Uploader({ onUploadComplete }: Props) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

            const response = await fetch(`${API_URL}/api/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(logs),
            });

            if (!response.ok) throw new Error("Failed to analyze logs");

            const analyzedResults: EndpointData[] = await response.json();
            onUploadComplete(analyzedResults);
        } catch (error) {
            console.error("Error parsing JSONL:", error);
            alert("Failed to parse the file.");
        }
    };

    return (
        <div
            className={`dropZone ${isDragging ? "is-dragging" : ""}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
        >

            <div className="absolute top-3 right-3">
                <InfoTooltip />
            </div>

            <p className="text-sm text-gray-400 font-medium">
                Drop <span className="text-gray-200 font-semibold">.jsonl</span> or browse
            </p>
            <input
                type="file"
                accept=".jsonl"
                ref={fileInputRef}
                onChange={onFileSelect}
                style={{ display: "none" }}
            />
        </div>
    );
}