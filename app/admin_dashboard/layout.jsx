import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
// import { Navbar } from "@/components/navbar"

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        {/* <Navbar/> */}
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
