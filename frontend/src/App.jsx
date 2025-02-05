import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="bg-slate-100 ">
      <header>
        <Header />
      </header>
      {/* Add px-6 and bg color here if you want borders on the side */}
      <main className=" mx-auto max-w-6xl sm:min-h-screen flex flex-col">
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
