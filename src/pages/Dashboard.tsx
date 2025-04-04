import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Code, ChevronRight, Trophy, ListChecks } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/components/ui/use-toast";

// Mock programming languages
const programmingLanguages = [
  { id: "java", name: "Java", color: "bg-blue-500", icon: "☕" },
  { id: "python", name: "Python", color: "bg-yellow-600", icon: "🐍" },
  { id: "javascript", name: "JavaScript", color: "bg-yellow-400", icon: "JS" },
  { id: "cpp", name: "C++", color: "bg-blue-600", icon: "C++" },
  { id: "csharp", name: "C#", color: "bg-purple-600", icon: "C#" },
  { id: "golang", name: "Go", color: "bg-blue-400", icon: "Go" },
];

// Mock upcoming contests with real URLs
const upcomingContests = [
  { 
    id: 1, 
    title: "Weekly Coding Challenge", 
    date: "2023-07-15", 
    platform: "LeetCode", 
    url: "https://leetcode.com/contest/"
  },
  { 
    id: 2, 
    title: "Algorithms Throwdown", 
    date: "2023-07-22", 
    platform: "HackerRank", 
    url: "https://www.hackerrank.com/contests" 
  },
  { 
    id: 3, 
    title: "Web Dev Hackathon", 
    date: "2023-08-05", 
    platform: "Devpost", 
    url: "https://devpost.com/hackathons" 
  },
];

// Mock mock interviews with real URLs
const mockInterviews = [
  { 
    id: 1, 
    title: "Data Structures Interview", 
    date: "2023-07-18", 
    duration: "45 min", 
    url: "https://www.pramp.com/#/" 
  },
  { 
    id: 2, 
    title: "System Design Practice", 
    date: "2023-07-25", 
    duration: "60 min", 
    url: "https://www.interviewbit.com/practice/" 
  },
  { 
    id: 3, 
    title: "Frontend Coding Interview", 
    date: "2023-08-10", 
    duration: "45 min", 
    url: "https://interviewing.io/" 
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useUser();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow text-xl">Loading...</div>
      </div>
    );
  }
  
  // Filter to only show languages the user has selected
  const userLanguages = programmingLanguages.filter(
    lang => user.preferences?.languages.includes(lang.id)
  );
  
  // Calculate progress for each language
  const getLanguageProgress = (languageId: string) => {
    return user.progress[languageId] || 0;
  };
  
  // Handle external link navigation
  const handleExternalNavigation = (url: string, title: string) => {
    // Open in new tab
    window.open(url, "_blank");
    
    // Show toast notification
    toast({
      title: "Redirecting to external site",
      description: `Opening ${title} in a new tab.`,
      duration: 3000,
    });
  };
  
  return (
    <div className="min-h-screen flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Welcome, {user.name || "Learner"}!</h1>
            <p className="text-muted-foreground">
              Your personalized learning dashboard for tech placement preparation
            </p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Learning Progress</CardTitle>
                <CardDescription>Your overall learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Object.keys(user.progress).length > 0 
                    ? Math.round(Object.values(user.progress).reduce((sum, val) => sum + val, 0) / Object.keys(user.progress).length)
                    : 0}%
                </div>
                <div className="mt-2 progress-bar">
                  <div 
                    className="progress-value" 
                    style={{ 
                      width: `${Object.keys(user.progress).length > 0 
                        ? Math.round(Object.values(user.progress).reduce((sum, val) => sum + val, 0) / Object.keys(user.progress).length)
                        : 0}%` 
                    }} 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Languages</CardTitle>
                <CardDescription>Programming languages you're learning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {user.preferences?.languages.length || 0}
                </div>
                <div className="flex mt-2 gap-1">
                  {userLanguages.slice(0, 5).map(lang => (
                    <div 
                      key={lang.id} 
                      className={`w-8 h-8 rounded-full ${lang.color} flex items-center justify-center text-white text-sm font-medium`}
                    >
                      {lang.icon}
                    </div>
                  ))}
                  {userLanguages.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-sm font-medium">
                      +{userLanguages.length - 5}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Completed Items</CardTitle>
                <CardDescription>Items you've completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {user.completedCourses.length}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Keep going! You're making great progress.
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Learning Paths</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userLanguages.map(language => (
                <Card key={language.id} className="skill-card overflow-hidden">
                  <CardHeader className={`${language.color} text-white pb-4`}>
                    <div className="flex justify-between items-center">
                      <CardTitle>{language.name}</CardTitle>
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-medium">
                        {language.icon}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="py-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">{getLanguageProgress(language.id)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-value" 
                        style={{ width: `${getLanguageProgress(language.id)}%` }} 
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between" 
                      onClick={() => navigate(`/language/${language.id}`)}
                    >
                      <span>Continue Learning</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <Tabs defaultValue="contests">
              <TabsList className="mb-4">
                <TabsTrigger value="contests" className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  <span>Upcoming Contests</span>
                </TabsTrigger>
                <TabsTrigger value="interviews" className="flex items-center gap-1">
                  <ListChecks className="h-4 w-4" />
                  <span>Mock Interviews</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="contests">
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                  <div className="divide-y">
                    {upcomingContests.map(contest => (
                      <div key={contest.id} className="p-4 hover:bg-muted/20 transition-colors">
                        <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-2">
                          <div>
                            <h3 className="font-medium">{contest.title}</h3>
                            <div className="text-sm text-muted-foreground">
                              {new Date(contest.date).toLocaleDateString('en-US', { 
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm bg-muted px-2 py-1 rounded">
                              {contest.platform}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleExternalNavigation(contest.url, contest.title)}
                              className="flex items-center gap-1"
                            >
                              Register
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="interviews">
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                  <div className="divide-y">
                    {mockInterviews.map(interview => (
                      <div key={interview.id} className="p-4 hover:bg-muted/20 transition-colors">
                        <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-2">
                          <div>
                            <h3 className="font-medium">{interview.title}</h3>
                            <div className="text-sm text-muted-foreground">
                              {new Date(interview.date).toLocaleDateString('en-US', { 
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })} • {interview.duration}
                            </div>
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleExternalNavigation(interview.url, interview.title)}
                            className="flex items-center gap-1"
                          >
                            Schedule
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
