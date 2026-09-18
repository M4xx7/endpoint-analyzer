export const STATUS_PALETTE = {
    success: {
        background: "rgba(34, 197, 94, 0.75)",
        border: "rgb(34, 197, 94)",
    },
    redirect: {
        background: "rgba(234, 179, 8, 0.75)",
        border: "rgb(234, 179, 8)",
    },
    clientError: {
        background: "rgba(249, 115, 22, 0.75)",
        border: "rgb(249, 115, 22)",
    },
    serverError: {
        background: "rgba(239, 68, 68, 0.75)",
        border: "rgb(239, 68, 68)",
    },
    default: {
        background: "rgba(156, 163, 175, 0.75)",
        border: "rgb(156, 163, 175)",
    },
} as const;


export const CHART_THEME = {
    latencyLine: {
        borderColor: "rgb(255, 238, 88)",       
        backgroundColor: "rgba(255, 238, 88, 0.07)", 
        hoverDotBg: "rgb(255, 255, 255)",          
        hoverDotBorder: "rgb(156, 163, 175)",
    },
    tooltip: {
        background: "#1e1e1e",
        title: "#ffffff",
        body: "#b8bdc9",
        border: "rgba(255, 255, 255, 0.1)",
    },
    gridLines: "rgba(255, 255, 255, 0.04)",
    text: "#b8bdc9",
} as const;

export const getStatusColor = (status: number) => {

    if (status >= 200 && status < 300) return STATUS_PALETTE.success;
    if (status >= 300 && status < 400) return STATUS_PALETTE.redirect;
    if (status >= 400 && status < 500) return STATUS_PALETTE.clientError;
    if (status >= 500) return STATUS_PALETTE.serverError;
    
    return STATUS_PALETTE.default;
};