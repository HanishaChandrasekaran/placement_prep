
import { ExternalLink, Youtube, Globe, Code, BookOpen, ListChecks } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface Resource {
  id: string;
  title: string;
  type: "video" | "article" | "problem" | "course";
  source: string;
  url: string;
  difficulty?: "easy" | "medium" | "hard";
  tags: string[];
  description?: string;
}

interface ResourcesListProps {
  languageId: string;
}

// Mock resources data
const resourcesData: Record<string, Resource[]> = {
  java: [
    {
      id: "java-res-1",
      title: "Java Programming for Beginners",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=eIrMbAQSU34",
      tags: ["beginner", "tutorial"],
      description: "A comprehensive Java tutorial covering syntax, OOP concepts, and basic programming principles"
    },
    {
      id: "java-res-2",
      title: "Java Collections Framework",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=1OpAgZvYXLQ",
      tags: ["intermediate", "collections"],
      description: "Learn about Lists, Sets, Maps and other collection interfaces in Java"
    },
    {
      id: "java-res-3",
      title: "Java Data Structures & Algorithms",
      type: "article",
      source: "GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/data-structures-in-java/",
      tags: ["intermediate", "data structures"],
      description: "Comprehensive guide to implementing various data structures in Java"
    },
    {
      id: "java-res-4",
      title: "Java Multithreading Tutorial",
      type: "article",
      source: "GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/multithreading-in-java/",
      tags: ["advanced", "concurrency"],
      description: "Learn about creating and managing threads in Java applications"
    },
    {
      id: "java-res-5",
      title: "Two Sum",
      type: "problem",
      source: "LeetCode",
      url: "https://leetcode.com/problems/two-sum/",
      difficulty: "easy",
      tags: ["arrays", "algorithms"],
      description: "Find two numbers that add up to a specific target"
    },
    {
      id: "java-res-6",
      title: "Merge Intervals",
      type: "problem",
      source: "LeetCode",
      url: "https://leetcode.com/problems/merge-intervals/",
      difficulty: "medium",
      tags: ["arrays", "sorting"],
      description: "Merge overlapping intervals in an array of interval pairs"
    },
    {
      id: "java-res-7",
      title: "Complete Java Masterclass",
      type: "course",
      source: "Udemy",
      url: "https://www.udemy.com/course/java-the-complete-java-developer-course/",
      tags: ["comprehensive", "projects"],
      description: "A complete course covering Java from basics to advanced topics with practical projects"
    },
  ],
  python: [
    {
      id: "python-res-1",
      title: "Python for Everybody",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=8DvywoWv6fI",
      tags: ["beginner", "tutorial"],
      description: "Introduction to Python programming language fundamentals"
    },
    {
      id: "python-res-2",
      title: "Advanced Python Features",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=HGOBQPFzWKo",
      tags: ["advanced", "features"],
      description: "Learn about decorators, generators, context managers and more"
    },
    {
      id: "python-res-3",
      title: "Python Data Structures Guide",
      type: "article",
      source: "Real Python",
      url: "https://realpython.com/python-data-structures/",
      tags: ["intermediate", "data structures"],
      description: "Comprehensive guide to Python's built-in data structures"
    },
    {
      id: "python-res-4",
      title: "Python Design Patterns",
      type: "article",
      source: "GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/python-design-patterns/",
      tags: ["advanced", "design patterns"],
      description: "Implementation of common design patterns in Python"
    },
    {
      id: "python-res-5",
      title: "Valid Parentheses",
      type: "problem",
      source: "LeetCode",
      url: "https://leetcode.com/problems/valid-parentheses/",
      difficulty: "easy",
      tags: ["stack", "algorithms"],
      description: "Determine if the input string has valid parentheses ordering"
    },
    {
      id: "python-res-6",
      title: "LRU Cache",
      type: "problem",
      source: "LeetCode",
      url: "https://leetcode.com/problems/lru-cache/",
      difficulty: "medium",
      tags: ["design", "hash table"],
      description: "Design and implement a Least Recently Used (LRU) cache"
    },
    {
      id: "python-res-7",
      title: "Complete Python Bootcamp",
      type: "course",
      source: "Udemy",
      url: "https://www.udemy.com/course/complete-python-bootcamp/",
      tags: ["comprehensive", "projects"],
      description: "Learn Python with projects, exercises, and interactive notebooks"
    },
  ],
  javascript: [
    {
      id: "js-res-1",
      title: "JavaScript Crash Course",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
      tags: ["beginner", "tutorial"],
      description: "Quick introduction to JavaScript syntax and core concepts"
    },
    {
      id: "js-res-2",
      title: "Async JavaScript - Callbacks, Promises, Async/Await",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=PoRJizFvM7s",
      tags: ["intermediate", "async"],
      description: "Deep dive into asynchronous programming in JavaScript"
    },
    {
      id: "js-res-3",
      title: "Modern JavaScript Guide",
      type: "article",
      source: "JavaScript.info",
      url: "https://javascript.info/",
      tags: ["intermediate", "ES6"],
      description: "Comprehensive modern JavaScript tutorial with detailed explanations"
    },
    {
      id: "js-res-4",
      title: "JavaScript Event Loop Explained",
      type: "article",
      source: "Medium",
      url: "https://medium.com/front-end-weekly/javascript-event-loop-explained-4cd26af121d4",
      tags: ["advanced", "event loop"],
      description: "Understanding the JavaScript event loop and asynchronous execution"
    },
    {
      id: "js-res-5",
      title: "Reverse String",
      type: "problem",
      source: "LeetCode",
      url: "https://leetcode.com/problems/reverse-string/",
      difficulty: "easy",
      tags: ["strings", "algorithms"],
      description: "Write a function that reverses a string"
    },
    {
      id: "js-res-6",
      title: "Maximum Subarray",
      type: "problem",
      source: "LeetCode",
      url: "https://leetcode.com/problems/maximum-subarray/",
      difficulty: "medium",
      tags: ["arrays", "dynamic programming"],
      description: "Find the contiguous subarray with the largest sum"
    },
    {
      id: "js-res-7",
      title: "Modern JavaScript From The Beginning",
      type: "course",
      source: "Udemy",
      url: "https://www.udemy.com/course/modern-javascript-from-the-beginning/",
      tags: ["comprehensive", "projects"],
      description: "Build modern JavaScript applications with pure JS without frameworks"
    },
  ],
  cpp: [
    {
      id: "cpp-res-1",
      title: "C++ Programming Tutorial",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
      tags: ["beginner", "tutorial"],
      description: "Complete C++ programming tutorial for beginners"
    },
    {
      id: "cpp-res-2",
      title: "C++ STL Tutorial",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=LyGlTmaWEPs",
      tags: ["intermediate", "STL"],
      description: "Learn about C++ Standard Template Library (STL)"
    },
    {
      id: "cpp-res-3",
      title: "C++ Templates Tutorial",
      type: "article",
      source: "GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/templates-cpp/",
      tags: ["intermediate", "templates"],
      description: "Comprehensive guide to C++ templates and generic programming"
    },
    {
      id: "cpp-res-4",
      title: "Roman to Integer",
      type: "problem",
      source: "LeetCode",
      url: "https://leetcode.com/problems/roman-to-integer/",
      difficulty: "easy",
      tags: ["string", "math"],
      description: "Convert a roman numeral to an integer"
    },
    {
      id: "cpp-res-5",
      title: "Binary Tree Level Order Traversal",
      type: "problem",
      source: "LeetCode",
      url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      difficulty: "medium",
      tags: ["tree", "BFS"],
      description: "Return the level order traversal of binary tree nodes' values"
    },
  ],
  csharp: [
    {
      id: "csharp-res-1",
      title: "C# Tutorial for Beginners",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=GhQdlIFylQ8",
      tags: ["beginner", "tutorial"],
      description: "Complete C# tutorial from basics to advanced topics"
    },
    {
      id: "csharp-res-2",
      title: ".NET Core Web API",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=fmvcAzHpsk8",
      tags: ["intermediate", "web development"],
      description: "Build RESTful APIs with ASP.NET Core and C#"
    },
    {
      id: "csharp-res-3",
      title: "LINQ in C#",
      type: "article",
      source: "Microsoft Docs",
      url: "https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/",
      tags: ["intermediate", "LINQ"],
      description: "Language-Integrated Query (LINQ) in C#"
    },
    {
      id: "csharp-res-4",
      title: "Palindrome Number",
      type: "problem",
      source: "LeetCode",
      url: "https://leetcode.com/problems/palindrome-number/",
      difficulty: "easy",
      tags: ["math"],
      description: "Determine whether an integer is a palindrome"
    },
  ],
  golang: [
    {
      id: "go-res-1",
      title: "Learn Go Programming",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=YS4e4q9oBaU",
      tags: ["beginner", "tutorial"],
      description: "Comprehensive Go programming language tutorial"
    },
    {
      id: "go-res-2",
      title: "Concurrency in Go",
      type: "video",
      source: "YouTube",
      url: "https://www.youtube.com/watch?v=LvgVSSpwND8",
      tags: ["intermediate", "concurrency"],
      description: "Learn about goroutines, channels, and concurrency patterns in Go"
    },
    {
      id: "go-res-3",
      title: "Go Web Programming",
      type: "article",
      source: "Go by Example",
      url: "https://gobyexample.com/http-servers",
      tags: ["intermediate", "web"],
      description: "Building web servers and applications with Go"
    },
    {
      id: "go-res-4",
      title: "Best Time to Buy and Sell Stock",
      type: "problem",
      source: "LeetCode",
      url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
      difficulty: "easy",
      tags: ["array", "dynamic programming"],
      description: "Find the maximum profit from buying and selling a stock"
    },
  ]
};

export const ResourcesList = ({ languageId }: ResourcesListProps) => {
  const resources = resourcesData[languageId] || [];
  const [activeTab, setActiveTab] = useState<string>("all");
  
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
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Youtube className="text-red-500" />;
      case "article":
        return <Globe className="text-blue-500" />;
      case "problem":
        return <Code className="text-green-500" />;
      case "course":
        return <BookOpen className="text-purple-500" />;
      default:
        return <ExternalLink />;
    }
  };
  
  const getSourceColor = (source: string) => {
    switch (source) {
      case "YouTube":
        return "bg-red-100 text-red-800";
      case "GeeksforGeeks":
        return "bg-green-100 text-green-800";
      case "LeetCode":
        return "bg-yellow-100 text-yellow-800";
      case "Real Python":
        return "bg-blue-100 text-blue-800";
      case "JavaScript.info":
        return "bg-indigo-100 text-indigo-800";
      case "Medium":
        return "bg-slate-100 text-slate-800";
      case "Udemy":
        return "bg-purple-100 text-purple-800";
      case "Microsoft Docs":
        return "bg-cyan-100 text-cyan-800";
      case "Go by Example":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };
  
  // Filter resources by type
  const filteredResources = activeTab === "all" 
    ? resources 
    : resources.filter(resource => resource.type === activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Learning Resources for {languageName}</h2>
        <p className="text-muted-foreground">Curated materials to help you master {languageName}</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="video">
            <Youtube className="h-4 w-4 mr-1" /> Videos
          </TabsTrigger>
          <TabsTrigger value="article">
            <Globe className="h-4 w-4 mr-1" /> Articles
          </TabsTrigger>
          <TabsTrigger value="problem">
            <Code className="h-4 w-4 mr-1" /> Problems
          </TabsTrigger>
          <TabsTrigger value="course">
            <BookOpen className="h-4 w-4 mr-1" /> Courses
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <Card key={resource.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSourceColor(resource.source)}`}>
                          {getTypeIcon(resource.type)}
                          <span className="ml-1">{resource.source}</span>
                        </span>
                        
                        {resource.difficulty && (
                          <span className={`inline-flex ml-2 px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                            {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {resource.description && (
                    <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                  )}
                  
                  <div className="mt-1 mb-4">
                    {resource.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="mr-1 mb-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2" 
                    onClick={() => window.open(resource.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Open Resource</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

