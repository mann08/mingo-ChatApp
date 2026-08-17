import { ThemeProvider } from "./context/ThemeContext";
import SiteHeader from "./components/SiteHeader";
import Home from "./pages/Home";

const App = () => {
  return (
    <ThemeProvider>
      <SiteHeader />
      <Home />
    </ThemeProvider>
  );
};

export default App;
