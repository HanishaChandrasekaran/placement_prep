
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, BookOpen, Award, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { UserPreferences } from "@/contexts/UserContext";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser, isAuthenticated, isLoading } = useUser();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Set initial form values from user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setYear(user.preferences?.year || "");
      setBranch(user.preferences?.branch || "");
      setSelectedLanguages(user.preferences?.languages || []);
    }
  }, [user]);
  
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow text-xl">Loading...</div>
      </div>
    );
  }
  
  const programmingLanguages = [
    { id: "java", name: "Java" },
    { id: "python", name: "Python" },
    { id: "javascript", name: "JavaScript" },
    { id: "cpp", name: "C++" },
    { id: "csharp", name: "C#" },
    { id: "golang", name: "Go" },
  ];
  
  const studyYears = [
    { value: "1", label: "1st Year" },
    { value: "2", label: "2nd Year" },
    { value: "3", label: "3rd Year" },
    { value: "4", label: "4th Year" },
    { value: "graduate", label: "Graduate" },
  ];
  
  const branches = [
    { value: "cs", label: "Computer Science" },
    { value: "it", label: "Information Technology" },
    { value: "ee", label: "Electrical Engineering" },
    { value: "ece", label: "Electronics & Communication" },
    { value: "me", label: "Mechanical Engineering" },
    { value: "civil", label: "Civil Engineering" },
    { value: "other", label: "Other" },
  ];
  
  const handleLanguageToggle = (languageId: string) => {
    setSelectedLanguages(prev => 
      prev.includes(languageId)
        ? prev.filter(id => id !== languageId)
        : [...prev, languageId]
    );
  };
  
  const handleSaveProfile = async () => {
    if (selectedLanguages.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one programming language",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedPreferences: UserPreferences = {
        year,
        branch,
        languages: selectedLanguages,
      };
      
      updateUser({
        name,
        preferences: updatedPreferences,
      });
      
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="min-h-screen flex w-full">
      <DashboardSidebar />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <p className="text-muted-foreground">
              View and update your profile information
            </p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Manage your personal details</CardDescription>
                    </div>
                    
                    {!isEditing ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="bg-skillsync-accent hover:bg-skillsync-primary"
                        >
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        value={email} 
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year of Study</Label>
                      <Select
                        value={year}
                        onValueChange={setYear}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="year">
                          <SelectValue placeholder="Select your study year" />
                        </SelectTrigger>
                        <SelectContent>
                          {studyYears.map(y => (
                            <SelectItem key={y.value} value={y.value}>
                              {y.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch/Major</Label>
                      <Select
                        value={branch}
                        onValueChange={setBranch}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="branch">
                          <SelectValue placeholder="Select your branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map(b => (
                            <SelectItem key={b.value} value={b.value}>
                              {b.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-base mb-2 block">Programming Languages</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {programmingLanguages.map(language => (
                        <div key={language.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`language-${language.id}`}
                            checked={selectedLanguages.includes(language.id)}
                            onCheckedChange={() => isEditing && handleLanguageToggle(language.id)}
                            disabled={!isEditing}
                          />
                          <Label 
                            htmlFor={`language-${language.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {language.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-skillsync-accent" />
                    <div>
                      <div className="text-sm font-medium">Account</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-skillsync-accent" />
                    <div>
                      <div className="text-sm font-medium">Learning</div>
                      <div className="text-sm text-muted-foreground">
                        {user.preferences?.languages?.length || 0} Languages
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-skillsync-accent" />
                    <div>
                      <div className="text-sm font-medium">Completed</div>
                      <div className="text-sm text-muted-foreground">
                        {user.completedCourses.length} Items
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-skillsync-accent" />
                    <div>
                      <div className="text-sm font-medium">Member Since</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.preferences?.languages.map(langId => {
                    const language = programmingLanguages.find(l => l.id === langId);
                    const progress = user.progress[langId] || 0;
                    
                    return language ? (
                      <div key={langId} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">{language.name}</span>
                          <span className="text-sm font-medium">{progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-value" 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>
                      </div>
                    ) : null;
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
