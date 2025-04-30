'use client'
import { Home, SearchIcon, UsersRound, CarFront, ChevronUp } from "lucide-react"
import{ IconListDetails} from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { useRouter } from "next/navigation"


// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin_dashboard",
    icon: Home,
  },
  {
    title: "Users",
    url: "/admin_dashboard/users",
    icon: UsersRound,
  },
  {
    title: "Vehicle Category",
    url: "/admin_dashboard/vehicleCategory",
    icon: CarFront,
  },
  {
    title: "Monitor Transactions",
    url: "/admin_dashboard/monitorTransactions",
    icon: IconListDetails,
  },
]

export function AppSidebar() {
  const router = useRouter()
  const handleLogout = async () => {
    const res = await fetch("/api/logout", { method: "POST" })
    if (res.ok) {
      router.push("/")
    }
  }
  const handleProfile = async () => {
    const res = await fetch("/api/profile", { method: "GET" })
    if (res.ok) {
      router.push("/profile")
    }
  }
  return (
    <Sidebar collapsible="icon">
        <SidebarHeader></SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                      
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                ))}
                
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>


        <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <ChevronUp className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width]"
                  >
                    <DropdownMenuItem>
                      <span >
                        Account
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>
                        <button
                          onClick={handleLogout}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                          Logout
                        </button>
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          
        </SidebarFooter>
      
      </Sidebar>
  )
}
