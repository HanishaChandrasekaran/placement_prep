
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { LanguageRoadmap } from "@/components/LanguageRoadmap";
import { ResourcesList } from "@/components/ResourcesList";
import { useUser } from "@/contexts/UserContext";
import { BookOpen, LayoutList, BarChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const LanguagePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, getPerformanceStats } = useUser();
  const [activeTab, setActiveTab] = useState("roadmap");
  
  // Language name mapping
  const languageNames: Record<string, string> = {
    java: "Java",
    python: "Python",
    javascript: "JavaScript",
    cpp: "C++",
    csharp: "C#",
    golang: "Go"
  };
  
  // Get stats for this language
  const stats = id ? getPerformanceStats(undefined, id) : {
    averageScore: 0,
    totalAttempts: 0,
    bestScore: 0,
    averageTime: 0
  };
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Redirect if language not found in user preferences
  useEffect(() => {
    if (user && user.preferences?.languages && id) {
      if (!user.preferences.languages.includes(id)) {
        navigate("/dashboard");
      }
    }
  }, [user, id, navigate]);
  
  if (isLoading || !user || !id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow text-xl">Loading...</div>
      </div>
    );
  }
  
  const languageName = languageNames[id] || id;
  const progress = user.progress[id] || 0;

  return (
    <div className="min-h-screen flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{languageName}</h1>
                <p className="text-muted-foreground">
                  Master {languageName} with our curated learning path
                </p>
              </div>
            </div>
          </header>
          
          {/* Language Overview Card */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Track your progress in {languageName}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="text-sm font-medium mb-2">Overall Progress</div>
                  <Progress value={progress} className="h-2 mb-1" />
                  <div className="text-xs text-muted-foreground text-right">{progress}% Complete</div>
                </div>
                
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1">Performance Stats</div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Average Score</div>
                      <div className="text-lg font-medium">{stats.averageScore.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Best Score</div>
                      <div className="text-lg font-medium">{stats.bestScore.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Total Attempts</div>
                      <div className="text-lg font-medium">{stats.totalAttempts}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Avg. Time</div>
                      <div className="text-lg font-medium">{(stats.averageTime / 60).toFixed(1)} min</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="roadmap" className="flex items-center gap-1">
                <LayoutList className="h-4 w-4" />
                <span>Learning Roadmap</span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>All Resources</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>Performance</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="roadmap">
              <LanguageRoadmap languageId={id} />
            </TabsContent>
            
            <TabsContent value="resources">
              <ResourcesList languageId={id} />
            </TabsContent>
            
            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>Performance History</CardTitle>
                  <CardDescription>
                    View your performance history for {languageName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.totalAttempts === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No performance data available yet.</p>
                      <p className="text-sm mt-2">
                        Complete contests, practice, or interviews to see your performance metrics here.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {/* Performance data visualization would be displayed here */}
                      <p>Your performance data will appear here as you complete more activities.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LanguagePage;
