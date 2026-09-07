import React, { useRef, useState } from 'react';
import type { EndpointStat } from '../../types.ts'

export default function App() {
    const [isDragging, setIsDragging] = useState(false);
    const [results, setResults] = useState<EndpointStat[] | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedMethod, setSelectedMethod] = useState('GET');
    const [searchRoute, setSearchRoute] = useState('');

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
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
        if (!file.name.endsWith('.jsonl')) {
            alert('Please upload a .jsonl file.');
            return;
        }

        try {
            const text = await file.text();
            const logs = text
                .split('\n')
                .filter(line => line.trim() !== '')
                .map(line => JSON.parse(line));

            const response = await fetch('http://localhost:3000/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logs)
            });

            if (!response.ok) throw new Error('Failed to analyze logs on server');

            const analyzedResults = await response.json();
            setResults(analyzedResults);

            // Auto-select the first endpoint to show something immediately
            if (analyzedResults.length > 0) {
                setSelectedMethod(analyzedResults[0].method);
                setSearchRoute(analyzedResults[0].route);
            }

        } catch (error) {
            console.error('Error parsing JSONL:', error);
            alert('Failed to parse the file.');
        }
    };

    // Find EXACTLY one endpoint matching the method and exact route string
    const targetEndpoint = results?.find(stat => 
        stat.method.toUpperCase() === selectedMethod.toUpperCase() && 
        stat.route.toLowerCase() === searchRoute.toLowerCase().trim()
    );

    return (
        <div className="app">
            <h1 className="title">Endpoint analyzer</h1>

            {results ? (
                <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'left', background: 'var(--bg)', padding: '20px', borderRadius: '12px' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                        <button
                            onClick={() => setResults(null)}
                            style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--code-bg)', color: 'var(--text)' }}
                        >
                            ← Upload another file
                        </button>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <select 
                                value={selectedMethod} 
                                onChange={(e) => setSelectedMethod(e.target.value)}
                                style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                            >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                                <option value="PATCH">PATCH</option>
                            </select>
                            
                            <input 
                                type="text" 
                                placeholder="Exact route (e.g., /api/users/:id)" 
                                value={searchRoute}
                                onChange={(e) => setSearchRoute(e.target.value)}
                                style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', width: '300px' }}
                            />
                        </div>
                    </div>

                    {targetEndpoint ? (
                        <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '24px', background: 'var(--code-bg)' }}>
                            <h2 style={{ marginTop: 0, color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                                {targetEndpoint.method} {targetEndpoint.route}
                            </h2>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px', color: 'var(--text)' }}>
                                <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '0.9em', opacity: 0.8, marginBottom: '4px' }}>Total Requests</div>
                                    <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{targetEndpoint.requests?.length || 0}</div>
                                </div>
                                <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '0.9em', opacity: 0.8, marginBottom: '4px' }}>Success Rate</div>
                                    <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
                                        {targetEndpoint.successRate != null ? targetEndpoint.successRate.toFixed(2) : '0.00'}%
                                    </div>
                                </div>
                                <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '0.9em', opacity: 0.8, marginBottom: '4px' }}>Latency (Med / p95)</div>
                                    <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                                        {targetEndpoint.latency?.median ?? 'N/A'}ms / {targetEndpoint.latency?.p95 ?? 'N/A'}ms
                                    </div>
                                </div>
                            </div>

                            <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1em', color: 'var(--text)' }}>Request Timeline</h3>
                            <div style={{
                                maxHeight: '300px',
                                overflowY: 'auto',
                                fontSize: '0.9em',
                                background: 'var(--bg)',
                                padding: '12px',
                                border: '1px solid var(--border)',
                                borderRadius: '6px',
                                color: 'var(--text)'
                            }}>
                                {targetEndpoint.requests?.map((req, i) => (
                                    <div key={i} style={{ marginBottom: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
                                        <span style={{ color: 'var(--accent)', fontWeight: 'bold', marginRight: '8px' }}>
                                            [{req.timestamp ?? 'Missing Timestamp'}]
                                        </span>
                                        <strong>Status:</strong> {req.statusCode ?? '?'} &nbsp;|&nbsp; 
                                        <strong>Duration:</strong> {req.duration ?? '?'}ms
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text)', border: '1px dashed var(--border)', borderRadius: '8px' }}>
                            No endpoint found matching <strong>{selectedMethod} {searchRoute || '...'}</strong>
                        </div>
                    )}
                </div>
            ) : (
                <main className="container">
                    <div
                        className={`dropZone ${isDragging ? 'is-dragging' : ''}`}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <p className="dropText">
                            Drag and drop your <strong>.jsonl</strong> file here
                        </p>
                        <p className="subText">or click to browse your files</p>
                        <input
                            type="file"
                            accept=".jsonl"
                            ref={fileInputRef}
                            onChange={onFileSelect}
                            style={{ display: 'none' }}
                        />
                    </div>
                </main>
            )}
        </div>
    );
}