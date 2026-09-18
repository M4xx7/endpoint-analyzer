export const METHOD_COLORS: Record<string, string> = {
    GET: "text-blue-400",
    POST: "text-green-400",
    PUT: "text-yellow-400",
    DELETE: "text-red-400",
};

export const DEFAULT_METHOD_COLOR = "text-gray-400";

export const getMethodColor = (method: string): string => {
    return METHOD_COLORS[method.toUpperCase()] || DEFAULT_METHOD_COLOR;
};