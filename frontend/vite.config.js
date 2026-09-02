import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), "");
    var backend = env.VITE_BACKEND_URL ||
        env.REACT_APP_BACKEND_URL ||
        "http://localhost:8001";
    return {
        plugins: [react()],
        server: {
            host: "0.0.0.0",
            port: 3000,
            strictPort: true,
            allowedHosts: true,
            hmr: {
                clientPort: 443,
                protocol: "wss",
            },
            proxy: {
                "/api": {
                    target: backend,
                    changeOrigin: true,
                    secure: true,
                },
            },
        },
        preview: {
            host: "0.0.0.0",
            port: 3000,
        },
    };
});
