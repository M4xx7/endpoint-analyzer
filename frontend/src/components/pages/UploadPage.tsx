import { useNavigate } from "react-router-dom";
import { useData } from "../DataContext";
import { Uploader } from "../Uploader";

export function UploadPage() {
    const { setResults } = useData();
    const navigate = useNavigate();

    const handleUploadComplete = (data: any[]) => {
        setResults(data);
        navigate("/dashboard");
    };

    return (
        <div className="page-wrapper max-w-7xl mx-auto w-full p-4 flex flex-col items-center justify-center min-h-screen">
            <h1 className="title mb-8 text-white">Endpoint Analyzer</h1>
            <Uploader onUploadComplete={handleUploadComplete} />
        </div>
    );
}
