
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

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

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser, isAuthenticated } = useUser();
  
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    navigate("/");
    return null;
  }
  
  // If not a new user, redirect to dashboard
  if (user && !user.isNewUser) {
    navigate("/dashboard");
    return null;
  }

  const handleLanguageToggle = (languageId: string) => {
    setSelectedLanguages(prev => 
      prev.includes(languageId)
        ? prev.filter(id => id !== languageId)
        : [...prev, languageId]
    );
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedYear || !selectedBranch) {
        toast({
          title: "Required fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (selectedLanguages.length === 0) {
        toast({
          title: "Select languages",
          description: "Please select at least one programming language.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      // Generate AI roadmap (simulated)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user profile
      updateUser({
        isNewUser: false,
        preferences: {
          year: selectedYear,
          branch: selectedBranch,
          languages: selectedLanguages,
        }
      });
      
      toast({
        title: "Profile Complete!",
        description: "Your personalized learning roadmap is ready.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-skillsync-background p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Welcome to SkillSync</CardTitle>
              <CardDescription>Let's personalize your learning journey</CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of 3
            </div>
          </div>
          <div className="mt-4 w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-skillsync-accent transition-all duration-300 ease-out" 
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="study-year">What year are you studying in?</Label>
                <Select
                  value={selectedYear}
                  onValueChange={setSelectedYear}
                >
                  <SelectTrigger id="study-year">
                    <SelectValue placeholder="Select your study year" />
                  </SelectTrigger>
                  <SelectContent>
                    {studyYears.map(year => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="branch">What's your branch/major?</Label>
                <Select
                  value={selectedBranch}
                  onValueChange={setSelectedBranch}
                >
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Select your branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.value} value={branch.value}>
                        {branch.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label className="text-base">Which programming languages would you like to learn?</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Select all that apply. You can change this later.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {programmingLanguages.map(language => (
                    <div key={language.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`language-${language.id}`}
                        checked={selectedLanguages.includes(language.id)}
                        onCheckedChange={() => handleLanguageToggle(language.id)}
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
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold mb-2">Your AI Learning Roadmap</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on your preferences, we'll create a personalized learning path for:
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-skillsync-primary mr-3"></div>
                    <span>Your selected programming languages: {selectedLanguages.map(id => 
                      programmingLanguages.find(lang => lang.id === id)?.name
                    ).join(", ")}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-skillsync-secondary mr-3"></div>
                    <span>Education: {studyYears.find(y => y.value === selectedYear)?.label}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-skillsync-accent mr-3"></div>
                    <span>Branch: {branches.find(b => b.value === selectedBranch)?.label}</span>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm">
                  <span className="font-medium">Note:</span> Your personalized roadmap will include curated resources like YouTube tutorials, GeeksforGeeks articles, and LeetCode problems based on your preferences.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {currentStep > 1 ? (
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(prev => prev - 1)}
            >
              Back
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
          )}
          
          {currentStep < 3 ? (
            <Button onClick={handleNext} className="bg-skillsync-accent hover:bg-skillsync-primary">
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleComplete} 
              className="bg-skillsync-primary hover:bg-skillsync-accent"
              disabled={isLoading}
            >
              {isLoading ? "Creating Roadmap..." : "Complete Setup"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Onboarding;
