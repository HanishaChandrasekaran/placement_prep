
import { useNavigate } from "react-router-dom";
import { LogOut, User, BookOpen, Home, Code, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";

export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  const programmingLanguages = [
    { id: "java", name: "Java" },
    { id: "python", name: "Python" },
    { id: "javascript", name: "JavaScript" },
    { id: "cpp", name: "C++" },
    { id: "csharp", name: "C#" },
    { id: "golang", name: "Go" },
  ];
  
  // Filter only selected languages
  const userLanguages = programmingLanguages.filter(
    lang => user?.preferences?.languages.includes(lang.id)
  );

  return (
    <>
      <Sidebar>
        <SidebarHeader className="flex items-center px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="bg-skillsync-primary rounded-md p-1">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">SkillSync</span>
          </div>
          <SidebarTrigger className="ml-auto md:hidden" />
        </SidebarHeader>
        
        <SidebarContent>
          <div className="px-4 py-2">
            <div className="flex items-center space-x-3 mb-6">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-skillsync-accent text-white">
                  {user?.name?.substring(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{user?.name || "User"}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </div>
          </div>
          
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/dashboard")}>
                    <Home className="h-4 w-4 mr-2" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/profile")}>
                    <User className="h-4 w-4 mr-2" />
                    <span>Profile</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>My Learning</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {userLanguages.map(language => (
                  <SidebarMenuItem key={language.id}>
                    <SidebarMenuButton onClick={() => navigate(`/language/${language.id}`)}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>{language.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="px-4 py-4">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};
