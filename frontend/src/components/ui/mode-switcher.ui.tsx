import Logo from "/Logo.webp";
import { useTheme } from "../../hooks/layout/useTheme";

const ModeSwitcherUi = () => {
  const { theme, setTheme } = useTheme(); // Shadcn Theme Hook

  return (
    <div className="flex justify-center gap-6 p-6">
      {/* Light Mode Card */}
      <div
        className={`w-72 flex flex-col border rounded-lg shadow-md cursor-pointer transform transition-all duration-300 
                    ${
                      theme === "light"
                        ? "scale-105 ring-4 ring-violet-400"
                        : ""
                    } 
                    bg-white text-gray-900 border-gray-300 hover:scale-105 hover:shadow-lg`}
        onClick={() => setTheme("light")}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-4 h-12 border-b rounded-t-lg bg-gray-100 border-gray-200">
          <div className="flex items-center">
            <img src={Logo} alt="Zynqly Logo" className="h-8" />
          </div>
          <nav className="flex gap-1">
            <div className="w-6 h-1 bg-violet-500 rounded"></div>
            <div className="w-6 h-1 bg-violet-500 rounded"></div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="p-4 flex flex-col gap-4 bg-white">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-32 bg-violet-500 rounded-full"></div>
            <div className="h-5 w-5/6 rounded bg-violet-200"></div>
            <div className="h-5 w-4/5 rounded bg-violet-200"></div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="p-3 border rounded-lg bg-gray-50 border-violet-300">
              <div className="h-4 w-24 bg-violet-500 rounded mb-1"></div>
              <div className="h-3 w-full rounded bg-violet-200"></div>
            </div>
            <div className="p-3 border rounded-lg bg-gray-50 border-violet-300">
              <div className="h-4 w-24 bg-violet-500 rounded mb-1"></div>
              <div className="h-3 w-full rounded bg-violet-200"></div>
            </div>
          </div>
        </main>
      </div>

      {/* Dark Mode Card */}
      <div
        className={`w-72 flex flex-col border rounded-lg shadow-md cursor-pointer transform transition-all duration-300 
                    ${
                      theme === "dark" ? "scale-105 ring-4 ring-violet-400" : ""
                    } 
                    bg-slate-950 text-white border-slate-700 hover:scale-105 hover:shadow-lg`}
        onClick={() => setTheme("dark")}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-4 h-12 border-b rounded-t-lg bg-slate-900 border-slate-800">
          <div className="flex items-center">
            <img src={Logo} alt="Zynqly Logo" className="h-8" />
          </div>
          <nav className="flex gap-1">
            <div className="w-5 h-1 bg-violet-500 rounded"></div>
            <div className="w-5 h-1 bg-violet-500 rounded"></div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="p-4 flex flex-col gap-4 bg-slate-950">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-32 bg-violet-500 rounded-full"></div>
            <div className="h-5 w-5/6 rounded bg-violet-700"></div>
            <div className="h-5 w-4/5 rounded bg-violet-700"></div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="p-3 border rounded-lg bg-slate-900 border-violet-700">
              <div className="h-4 w-24 bg-violet-500 rounded mb-1"></div>
              <div className="h-3 w-full rounded bg-violet-700"></div>
            </div>
            <div className="p-3 border rounded-lg bg-slate-900 border-violet-700">
              <div className="h-4 w-24 bg-violet-500 rounded mb-1"></div>
              <div className="h-3 w-full rounded bg-violet-700"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModeSwitcherUi;
