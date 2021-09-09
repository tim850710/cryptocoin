import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import CryptoTracker from "./CryptoTracker";
import "./styles.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CryptoTracker cryptoName="helium" />
    <ReactQueryDevtools />
    <a
      className="api-link"
      href="https://www.coingecko.com/en/api"
      target="_blank"
      rel="noopener noreferrer"
    >
      Powered by CoinGecko API
    </a>
  </QueryClientProvider>
);

export default App;
