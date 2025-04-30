"use client"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { UserSidebar } from "@/components/userSidebar"
import { useState } from "react"
// import { ClerkProvider } from "@clerk/nextjs"


export default function Layout({ children }) {
  const [open, setOpen] = useState(false)
  return (

      <SidebarProvider open={open} onOpenChange={setOpen} >
      <UserSidebar />
      <main className="w-full">
      
        <SidebarTrigger/>
        {children}
      </main>
    </SidebarProvider>
  
    
  )
}
