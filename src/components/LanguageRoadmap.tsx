import { ChevronRight, CheckCircle2, Circle, ChevronDown } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface RoadmapSection {
  title: string;
  items: RoadmapItem[];
}

interface LanguageRoadmapProps {
  languageId: string;
}

interface Resource {
  id: string;
  title: string;
  type: "video" | "article" | "problem" | "course";
  source: string;
  url: string;
  difficulty?: "easy" | "medium" | "hard";
  tags: string[];
  description?: string;
  moduleId: string; // Reference to the roadmap item
}

// Mock roadmap data
const roadmapData: Record<string, RoadmapSection[]> = {
  java: [
    {
      title: "Basics",
      items: [
        { id: "java-basics-1", title: "Java Syntax", description: "Learn the basic syntax of Java", difficulty: "beginner" },
        { id: "java-basics-2", title: "Variables & Data Types", description: "Understanding variables and data types in Java", difficulty: "beginner" },
        { id: "java-basics-3", title: "Control Flow", description: "Conditionals and loops in Java", difficulty: "beginner" },
      ]
    },
    {
      title: "Object-Oriented Programming",
      items: [
        { id: "java-oop-1", title: "Classes & Objects", description: "Learn about classes, objects, and instances", difficulty: "intermediate" },
        { id: "java-oop-2", title: "Inheritance", description: "Understanding inheritance and extending classes", difficulty: "intermediate" },
        { id: "java-oop-3", title: "Polymorphism", description: "Working with polymorphism and method overriding", difficulty: "advanced" },
      ]
    },
  ],
  python: [
    {
      title: "Python Fundamentals",
      items: [
        { id: "python-basics-1", title: "Python Syntax", description: "Learn the basic syntax of Python", difficulty: "beginner" },
        { id: "python-basics-2", title: "Data Structures", description: "Lists, tuples, dictionaries, and sets", difficulty: "beginner" },
        { id: "python-basics-3", title: "Functions", description: "Creating and using functions in Python", difficulty: "beginner" },
      ]
    },
    {
      title: "Advanced Python",
      items: [
        { id: "python-adv-1", title: "List Comprehensions", description: "Writing concise list operations", difficulty: "intermediate" },
        { id: "python-adv-2", title: "Decorators", description: "Understanding and creating decorators", difficulty: "advanced" },
        { id: "python-adv-3", title: "Generators", description: "Working with generators and yields", difficulty: "advanced" },
      ]
    },
  ],
  javascript: [
    {
      title: "JavaScript Basics",
      items: [
        { id: "js-basics-1", title: "JavaScript Syntax", description: "Learn the basic syntax of JavaScript", difficulty: "beginner" },
        { id: "js-basics-2", title: "DOM Manipulation", description: "Interacting with the Document Object Model", difficulty: "beginner" },
        { id: "js-basics-3", title: "Events", description: "Handling user events in JavaScript", difficulty: "beginner" },
      ]
    },
    {
      title: "Advanced JavaScript",
      items: [
        { id: "js-adv-1", title: "Closures", description: "Understanding closures and scope", difficulty: "intermediate" },
        { id: "js-adv-2", title: "Promises", description: "Working with asynchronous operations", difficulty: "intermediate" },
        { id: "js-adv-3", title: "Modules", description: "Organizing code into modules", difficulty: "advanced" },
      ]
    },
  ],
  cpp: [
    {
      title: "C++ Fundamentals",
      items: [
        { id: "cpp-basics-1", title: "C++ Syntax", description: "Learn the basic syntax of C++", difficulty: "beginner" },
        { id: "cpp-basics-2", title: "Memory Management", description: "Understanding pointers and memory allocation", difficulty: "intermediate" },
        { id: "cpp-basics-3", title: "Classes & Objects", description: "OOP concepts in C++", difficulty: "intermediate" },
      ]
    },
  ],
  csharp: [
    {
      title: "C# Fundamentals",
      items: [
        { id: "csharp-basics-1", title: "C# Syntax", description: "Learn the basic syntax of C#", difficulty: "beginner" },
        { id: "csharp-basics-2", title: ".NET Framework", description: "Introduction to .NET", difficulty: "beginner" },
        { id: "csharp-basics-3", title: "LINQ", description: "Working with Language Integrated Query", difficulty: "intermediate" },
      ]
    },
  ],
  golang: [
    {
      title: "Go Fundamentals",
      items: [
        { id: "go-basics-1", title: "Go Syntax", description: "Learn the basic syntax of Go", difficulty: "beginner" },
        { id: "go-basics-2", title: "Concurrency", description: "Goroutines and channels", difficulty: "intermediate" },
        { id: "go-basics-3", title: "Interfaces", description: "Working with interfaces in Go", difficulty: "intermediate" },
      ]
    },
  ]
};

// Mock resources data
const moduleResourcesData: Record<string, Resource[]> = {
  "java-basics-1": [
    {
      id: "java-syntax-res-1",
      moduleId: "java-basics-1",
      title: "Java Syntax Tutorial",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=eIrMbAQSU34",
      tags: ["beginner", "syntax"],
      description: "Learn the basic syntax of Java programming language"
    },
    {
      id: "java-syntax-res-2",
      moduleId: "java-basics-1",
      title: "Java Syntax Guide",
      type: "article",
      source: "GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/java-syntax/",
      tags: ["beginner", "syntax"],
      description: "Comprehensive guide to Java syntax with examples"
    }
  ],
  "java-basics-2": [
    {
      id: "java-vars-res-1",
      moduleId: "java-basics-2",
      title: "Java Variables and Data Types",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=oPpnCh7InLY",
      tags: ["beginner", "variables"],
      description: "Understanding variables and data types in Java"
    },
    {
      id: "java-vars-res-2",
      moduleId: "java-basics-2",
      title: "Java Data Types Tutorial",
      type: "article",
      source: "JavaTpoint",
      url: "https://www.javatpoint.com/java-data-types",
      tags: ["beginner", "data types"],
      description: "Complete reference for Java data types"
    }
  ],
  "java-basics-3": [
    {
      id: "java-control-res-1",
      moduleId: "java-basics-3",
      title: "Java Control Flow Statements",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=rjkYAs6gAkk",
      tags: ["beginner", "control flow"],
      description: "Learn about if-else, switch, loops in Java"
    }
  ],
  "java-oop-1": [
    {
      id: "java-classes-res-1",
      moduleId: "java-oop-1",
      title: "Java Classes and Objects",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=IUqKuGNasdM",
      tags: ["intermediate", "OOP"],
      description: "Understanding classes and objects in Java"
    }
  ],
  "java-oop-2": [
    {
      id: "java-inheritance-res-1",
      moduleId: "java-oop-2",
      title: "Java Inheritance Tutorial",
      type: "article",
      source: "GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/inheritance-in-java/",
      tags: ["intermediate", "inheritance"],
      description: "Complete guide to inheritance in Java with examples"
    }
  ],
  "java-oop-3": [
    {
      id: "java-poly-res-1",
      moduleId: "java-oop-3",
      title: "Java Polymorphism",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=Ft7oYDt2F_s",
      tags: ["advanced", "polymorphism"],
      description: "Deep dive into polymorphism in Java"
    }
  ],
  "python-basics-1": [
    {
      id: "python-syntax-res-1",
      moduleId: "python-basics-1",
      title: "Python Syntax for Beginners",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
      tags: ["beginner", "syntax"],
      description: "Learn the basic syntax of Python programming language"
    }
  ],
  "python-basics-2": [
    {
      id: "python-ds-res-1",
      moduleId: "python-basics-2",
      title: "Python Data Structures",
      type: "article",
      source: "Real Python",
      url: "https://realpython.com/python-data-structures/",
      tags: ["beginner", "data structures"],
      description: "Guide to Python's built-in data structures"
    }
  ],
  "js-basics-1": [
    {
      id: "js-syntax-res-1",
      moduleId: "js-basics-1",
      title: "JavaScript Syntax Crash Course",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
      tags: ["beginner", "syntax"],
      description: "Quick introduction to JavaScript syntax"
    }
  ]
};

export const LanguageRoadmap = ({ languageId }: LanguageRoadmapProps) => {
  const { user, completeItem } = useUser();
  const roadmap = roadmapData[languageId] || [];
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  // Find language name
  const languageNames: Record<string, string> = {
    java: "Java",
    python: "Python",
    javascript: "JavaScript",
    cpp: "C++",
    csharp: "C#",
    golang: "Go"
  };
  
  const languageName = languageNames[languageId] || languageId;
  
  // Check if an item is completed
  const isItemCompleted = (itemId: string) => {
    return user?.completedCourses.includes(itemId) || false;
  };
  
  // Handle item click to mark as completed
  const handleItemClick = (itemId: string) => {
    if (!isItemCompleted(itemId)) {
      completeItem(itemId);
    }
  };
  
  // Handle toggle expand/collapse
  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };
  
  // Calculate overall progress
  const calculateProgress = () => {
    let totalItems = 0;
    let completedItems = 0;
    
    roadmap.forEach(section => {
      totalItems += section.items.length;
      section.items.forEach(item => {
        if (isItemCompleted(item.id)) {
          completedItems++;
        }
      });
    });
    
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  // Get resources for a specific module
  const getModuleResources = (moduleId: string) => {
    return moduleResourcesData[moduleId] || [];
  };
  
  // Get icon based on resource type
  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return "🎬";
      case "article":
        return "📄";
      case "problem":
        return "⚙️";
      case "course":
        return "📚";
      default:
        return "🔗";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{languageName} Learning Path</h2>
          <p className="text-muted-foreground">Your personalized roadmap for mastering {languageName}</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border w-full sm:w-auto">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <p className="text-xl font-semibold">{calculateProgress()}%</p>
            </div>
            <div className="h-10 w-10 rounded-full border-4 border-skillsync-accent flex items-center justify-center font-medium">
              {calculateProgress()}
            </div>
          </div>
          <div className="mt-2 progress-bar">
            <div className="progress-value" style={{ width: `${calculateProgress()}%` }} />
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {roadmap.map((section, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b bg-muted/30">
              <h3 className="text-lg font-semibold">{section.title}</h3>
            </div>
            <div>
              {section.items.map((item) => (
                <Collapsible 
                  key={item.id}
                  open={expandedItems.includes(item.id)}
                  onOpenChange={() => toggleExpand(item.id)}
                  className={`border-b last:border-0 transition-colors ${
                    isItemCompleted(item.id) ? "bg-green-50" : ""
                  }`}
                >
                  <CollapsibleTrigger className="w-full">
                    <div 
                      className="px-6 py-4 hover:bg-muted/10 cursor-pointer"
                    >
                      <div className="flex items-start">
                        <div className="mt-1 mr-3">
                          {isItemCompleted(item.id) ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{item.title}</h4>
                            {expandedItems.includes(item.id) ? (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          <div className="mt-2">
                            <span className={`inline-block px-2 py-1 text-xs rounded ${
                              item.difficulty === 'beginner' 
                                ? 'bg-green-100 text-green-800' 
                                : item.difficulty === 'intermediate'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                            </span>
                            <span className="ml-3 text-xs text-muted-foreground">
                              Estimated time: {item.difficulty === 'beginner' ? '1-2 hours' : 
                                              item.difficulty === 'intermediate' ? '3-5 hours' : 
                                              '5-10 hours'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-6 py-4 bg-muted/5 border-t">
                      <div className="pl-8">
                        <h5 className="font-medium mb-2">Module Resources</h5>
                        <div className="space-y-3">
                          {getModuleResources(item.id).length > 0 ? (
                            getModuleResources(item.id).map(resource => (
                              <div key={resource.id} className="bg-white rounded border p-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h6 className="font-medium text-sm">
                                      {getResourceTypeIcon(resource.type)} {resource.title}
                                    </h6>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {resource.description}
                                    </p>
                                    <div className="mt-2">
                                      {resource.tags.map(tag => (
                                        <Badge key={tag} variant="outline" className="mr-1 mb-1 text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => window.open(resource.url, "_blank")}
                                  >
                                    Open
                                  </Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No resources available for this module yet.</p>
                          )}
                        </div>
                        
                        <div className="mt-4 flex justify-between">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleItemClick(item.id)}
                          >
                            {isItemCompleted(item.id) 
                              ? "Marked as Completed" 
                              : "Mark as Completed"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
