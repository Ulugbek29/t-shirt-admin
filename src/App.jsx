import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import AlertProvider from "./providers/AlertProvider";
import GlobalFunctionsProvider from "./providers/GlobalFunctionsProvider";
// import MaterialUIProvider from "./providers/MaterialUIProvider";
import Router from "./router";
import { persistor, store } from "./store";
import "./i18next";
import { Suspense } from "react";
import PageFallback from "./components/PageFallback";
import DarkModeProvider from "./context/DarkModeConext";

//ThemeProvider
import { ThemeProvider } from "@mui/material";
import themeConfigs from "./configs/theme.configs.js"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
      <QueryClientProvider client={queryClient}>
    <Suspense fallback={<PageFallback />}>
        <DarkModeProvider>
          <div className="App">
            <Provider store={store}>
              <PersistGate persistor={persistor}>
                {/* <MaterialUIProvider> */}
                <ThemeProvider theme={themeConfigs.custom({ mode: "light" })}>
                  <AlertProvider>
                    <GlobalFunctionsProvider />
                    <BrowserRouter>
                      <Router />
                    </BrowserRouter>
                  </AlertProvider>
                </ThemeProvider>
                {/* </MaterialUIProvider> */}
              </PersistGate>
            </Provider>
          </div>
        </DarkModeProvider>
    </Suspense>
      </QueryClientProvider>
  );
}

export default App;
