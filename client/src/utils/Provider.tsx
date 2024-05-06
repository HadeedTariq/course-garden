import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as Redux } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "@/store/store";

const client = new QueryClient();

type ProviderProps = {
  children: ReactNode;
};

const AppProvider = ({ children }: ProviderProps) => {
  return (
    <QueryClientProvider client={client}>
      <Redux store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Redux>
    </QueryClientProvider>
  );
};

export default AppProvider;
