import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./redux/store/store.js";
import { APIProvider } from "@vis.gl/react-google-maps";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}
      libraries={["marker", "routes", "geometry"]}
    >
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Provider>
    </APIProvider>
  </StrictMode>,
);
