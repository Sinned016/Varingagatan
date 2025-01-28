import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="bg-slate-200 ">
      <header>
        <Header />
      </header>

      <main className=" mx-auto max-w-6xl bg-slate-200 pb-4 min-h-screen flex flex-col">
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
