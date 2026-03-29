import { Outlet } from "react-router-dom"
import { Github } from "lucide-react"

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Navbar
      <header className="p-4 bg-gray-800 text-white">
        My App
      </header> */}

      {/* Page Content */}
      <main className="flex-1 p-4 mt-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <div className="flex flex-row gap-1 my-3 justify-center items-center text-xs md:text-sm text-gray-500/30">
            <div>Made by</div>
            <a href="https://github.com/airchry" target="_blank">
              <div className="flex gap-1 items-center">
                <p>airchry</p>
                <Github size={15}/>
              </div>
            </a>
          </div>
      </footer>

    </div>
  )
}

export default Layout