export interface ElectronAPI {
    silentPrint: (data: any) => void;
    onPrintStatus: (callback: (event: any, response: any) => void) => void;
}

declare global {
    interface Window {
        electronAPI?: ElectronAPI;
    }
}