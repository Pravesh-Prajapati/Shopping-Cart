import { useContext } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import Header from "./components/Header";
import AppRoutes from "./routes/AppRoutes";
import { Loader2 } from "lucide-react";
import SkeletonLoader from "./components/SkeletonLoader";

function App() {
  const { loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    );
  }
  
  return (
    <>
      <Header />
      <AppRoutes />
    </>
  );
}

export default App;
