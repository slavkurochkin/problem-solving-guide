import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./components/ui/collapsible";
import { Button } from "./components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Separator } from "./components/ui/separator";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Checkbox } from "./components/ui/checkbox";
import { Progress } from "./components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  Search,
  Clock,
  Target,
  Zap,
  Plus,
  Save,
  FileText,
  CheckCircle,
  Circle,
  Trash2,
  Brain,
  Users,
  BarChart3,
  Repeat,
  TreePine,
  Microscope,
  Layers,
  TrendingUp,
  GitBranch,
} from "lucide-react";
import { useState, useEffect } from "react";

interface ProblemSession {
  id: string;
  title: string;
  description: string;
  methodology: string;
  createdAt: Date;
  completedSteps: number[];
  stepNotes: Record<number, string>;
  actionItems: Record<
    number,
    Array<{ id: string; text: string; completed: boolean }>
  >;
}

interface Methodology {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  steps: Array<{
    number: number;
    title: string;
    icon: React.ReactNode;
    description: string;
    content: string;
    color: string;
    prompts: string[];
  }>;
}

export default function App() {
  const [activeTab, setActiveTab] = useState("guide");
  const [selectedMethodology, setSelectedMethodology] = useState("4-step");
  const [openSteps, setOpenSteps] = useState<Record<string, boolean>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [currentSession, setCurrentSession] = useState<ProblemSession | null>(
    null
  );
  const [sessions, setSessions] = useState<ProblemSession[]>([]);

  const methodologies: Record<string, Methodology> = {
    "4-step": {
      id: "4-step",
      name: "4-Step Method",
      description:
        "Original systematic approach with questioning, isolation, tracing, and quick fixes",
      icon: <Target className="w-5 h-5" />,
      color: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
      steps: [
        {
          number: 1,
          title: "Ask Questions!",
          icon: <Search className="w-6 h-6" />,
          description:
            "Start by understanding the issue fully before implementing solutions",
          content:
            "We're often so focused on fixing things that we sometimes try to implement a solution before properly diagnosing the problem. Always start by asking questions to understand the issue fully.",
          color:
            "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
          prompts: [
            "What exactly is the problem?",
            "When did this problem first occur?",
            "Who is affected by this problem?",
            "What has changed recently?",
            "What are the symptoms vs. the actual problem?",
          ],
        },
        {
          number: 2,
          title: "Isolate the Problem",
          icon: <Target className="w-6 h-6" />,
          description: "Shrink the scope of the potential issue efficiently",
          content:
            "The goal of this method is to shrink the scope of the potential issue. For example: What's the quickest way to guess a number I'm thinking of that's less than 100? If you use a search algorithm like binary search, you're on the right path. Now apply this principle to your problem—narrow it down efficiently.",
          color:
            "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
          prompts: [
            "Can you reproduce the problem consistently?",
            "What components/systems are involved?",
            "What can you rule out as causes?",
            "Is this affecting everyone or just specific users?",
            "What's the smallest test case that shows the problem?",
          ],
        },
        {
          number: 3,
          title: "Follow the Cookie Crumbs",
          icon: <Clock className="w-6 h-6" />,
          description: "Trace back to when the problem first started",
          content:
            "This method requires you to trace back to when the problem first started and work forward from there. It helps you understand the context and progression of the issue.",
          color:
            "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800",
          prompts: [
            "When was the last time this worked correctly?",
            "What changes happened between then and now?",
            "What does the timeline of events look like?",
            "Are there any patterns in when the problem occurs?",
            "What logs or traces can you follow?",
          ],
        },
        {
          number: 4,
          title: "Start with the Quickest Step First",
          icon: <Zap className="w-6 h-6" />,
          description: "Try the simplest, fastest potential fix first",
          content:
            "Try the simplest, fastest potential fix first (e.g., reboot the computer). It might resolve the issue without diving deeper unnecessarily.",
          color:
            "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800",
          prompts: [
            "What's the quickest thing you can try?",
            "Have you tried turning it off and on again?",
            "What are the low-risk, high-impact actions?",
            "Can you rollback recent changes?",
            "What would take less than 5 minutes to test?",
          ],
        },
      ],
    },
    "5-whys": {
      id: "5-whys",
      name: "5 Whys",
      description:
        "Root cause analysis by asking 'why' five times to drill down to fundamental causes",
      icon: <Brain className="w-5 h-5" />,
      color:
        "bg-indigo-50 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-800",
      steps: [
        {
          number: 1,
          title: "Define the Problem",
          icon: <Search className="w-6 h-6" />,
          description: "Clearly state what the problem is",
          content:
            "Start by writing down the specific problem. Be precise and factual. Avoid assumptions or jumping to conclusions about causes.",
          color:
            "bg-indigo-50 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-800",
          prompts: [
            "What exactly happened?",
            "When did it occur?",
            "Where did it occur?",
            "What is the impact?",
            "How do you know this is a problem?",
          ],
        },
        {
          number: 2,
          title: "First Why",
          icon: <Brain className="w-6 h-6" />,
          description: "Ask why the problem occurred",
          content:
            "Ask why the problem happened. Focus on facts, not blame. Look for the immediate cause of the problem.",
          color:
            "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
          prompts: [
            "Why did this problem occur?",
            "What immediate factors contributed?",
            "What evidence supports this cause?",
            "Are there any other immediate causes?",
            "How confident are you in this answer?",
          ],
        },
        {
          number: 3,
          title: "Second Why",
          icon: <Brain className="w-6 h-6" />,
          description: "Ask why the first cause occurred",
          content:
            "Take the answer from the first why and ask why that happened. You're digging deeper into the underlying causes.",
          color:
            "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
          prompts: [
            "Why did the first cause happen?",
            "What led to that situation?",
            "Were there warning signs?",
            "What processes or systems were involved?",
            "Could this have been prevented?",
          ],
        },
        {
          number: 4,
          title: "Third Why",
          icon: <Brain className="w-6 h-6" />,
          description: "Continue drilling down with why",
          content:
            "Ask why the second cause occurred. You're getting closer to systemic or root causes.",
          color:
            "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800",
          prompts: [
            "Why did that underlying cause exist?",
            "What systemic issues contributed?",
            "Are there patterns or recurring themes?",
            "What policies or procedures are relevant?",
            "How long has this underlying issue existed?",
          ],
        },
        {
          number: 5,
          title: "Fourth & Fifth Why",
          icon: <Brain className="w-6 h-6" />,
          description: "Reach the root cause level",
          content:
            "Continue asking why until you reach a root cause that, if addressed, would prevent the problem from recurring. You might need more or fewer than 5 whys.",
          color:
            "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800",
          prompts: [
            "Why does this systemic issue persist?",
            "What fundamental problems exist?",
            "If we fix this, will it prevent recurrence?",
            "Are there multiple root causes?",
            "What actionable solutions emerge?",
          ],
        },
      ],
    },
    "design-thinking": {
      id: "design-thinking",
      name: "Design Thinking",
      description:
        "Human-centered approach: Empathize, Define, Ideate, Prototype, Test",
      icon: <Users className="w-5 h-5" />,
      color: "bg-pink-50 border-pink-200 dark:bg-pink-950 dark:border-pink-800",
      steps: [
        {
          number: 1,
          title: "Empathize",
          icon: <Users className="w-6 h-6" />,
          description: "Understand the users and their needs",
          content:
            "Develop a deep understanding of the people affected by the problem. Observe, engage, and immerse yourself in their experiences.",
          color:
            "bg-pink-50 border-pink-200 dark:bg-pink-950 dark:border-pink-800",
          prompts: [
            "Who are the users affected by this problem?",
            "What are their pain points and frustrations?",
            "What motivates and drives them?",
            "How do they currently solve this problem?",
            "What emotions do they experience?",
          ],
        },
        {
          number: 2,
          title: "Define",
          icon: <Target className="w-6 h-6" />,
          description: "Frame the problem from user perspective",
          content:
            "Synthesize your observations into a clear problem statement. Define the core problem you're trying to solve from the user's perspective.",
          color:
            "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
          prompts: [
            "What is the core problem statement?",
            "How might we frame this from user perspective?",
            "What are the key constraints?",
            "What would success look like?",
            "What assumptions are we making?",
          ],
        },
        {
          number: 3,
          title: "Ideate",
          icon: <Lightbulb className="w-6 h-6" />,
          description: "Generate creative solution ideas",
          content:
            "Brainstorm a wide range of creative solutions. Focus on quantity over quality initially. Think outside the box and challenge assumptions.",
          color:
            "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
          prompts: [
            "What are all possible solutions?",
            "How might we approach this differently?",
            "What would the ideal solution look like?",
            "What if we had unlimited resources?",
            "What unconventional approaches could work?",
          ],
        },
        {
          number: 4,
          title: "Prototype",
          icon: <Layers className="w-6 h-6" />,
          description: "Build quick, testable versions of solutions",
          content:
            "Create simple, scaled-down versions of your solutions to test key assumptions. Focus on learning, not perfection.",
          color:
            "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
          prompts: [
            "What's the minimum viable version to test?",
            "What key assumptions need validation?",
            "How can we build this quickly and cheaply?",
            "What feedback are we seeking?",
            "What could we learn from a simple test?",
          ],
        },
        {
          number: 5,
          title: "Test",
          icon: <Microscope className="w-6 h-6" />,
          description: "Test prototypes with users and gather feedback",
          content:
            "Test your prototypes with real users. Gather feedback, observe behavior, and learn what works and what doesn't.",
          color:
            "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800",
          prompts: [
            "How did users respond to the prototype?",
            "What worked well?",
            "What didn't work as expected?",
            "What new insights emerged?",
            "How should we iterate based on feedback?",
          ],
        },
      ],
    },
    pdca: {
      id: "pdca",
      name: "PDCA Cycle",
      description: "Plan-Do-Check-Act continuous improvement cycle",
      icon: <Repeat className="w-5 h-5" />,
      color:
        "bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800",
      steps: [
        {
          number: 1,
          title: "Plan",
          icon: <Target className="w-6 h-6" />,
          description: "Identify the problem and plan a solution",
          content:
            "Define the problem clearly, analyze the current situation, and develop a plan for improvement. Set objectives and predict outcomes.",
          color:
            "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
          prompts: [
            "What is the current situation?",
            "What are the root causes?",
            "What is our improvement goal?",
            "What actions will we take?",
            "How will we measure success?",
          ],
        },
        {
          number: 2,
          title: "Do",
          icon: <Zap className="w-6 h-6" />,
          description: "Implement the plan on a small scale",
          content:
            "Execute the plan, preferably on a small scale or as a pilot. Document what happens during implementation.",
          color:
            "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
          prompts: [
            "How will we implement this change?",
            "What resources do we need?",
            "Who is responsible for each action?",
            "What timeline will we follow?",
            "How will we document the process?",
          ],
        },
        {
          number: 3,
          title: "Check",
          icon: <BarChart3 className="w-6 h-6" />,
          description: "Study the results and measure outcomes",
          content:
            "Analyze the results of your implementation. Compare actual outcomes with predicted outcomes. Identify what worked and what didn't.",
          color:
            "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800",
          prompts: [
            "What were the actual results?",
            "How do they compare to predictions?",
            "What worked well?",
            "What unexpected issues arose?",
            "What did we learn?",
          ],
        },
        {
          number: 4,
          title: "Act",
          icon: <TrendingUp className="w-6 h-6" />,
          description: "Standardize successful changes or try again",
          content:
            "If the change was successful, standardize it and implement it widely. If not, learn from the failure and start the cycle again with new knowledge.",
          color:
            "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800",
          prompts: [
            "Should we standardize this change?",
            "How can we implement it organization-wide?",
            "What processes need updating?",
            "If unsuccessful, what will we try next?",
            "How do we prevent regression?",
          ],
        },
      ],
    },
    "first-principles": {
      id: "first-principles",
      name: "First Principles",
      description:
        "Break down complex problems to fundamental truths and build up solutions",
      icon: <TreePine className="w-5 h-5" />,
      color: "bg-teal-50 border-teal-200 dark:bg-teal-950 dark:border-teal-800",
      steps: [
        {
          number: 1,
          title: "Identify the Problem",
          icon: <Search className="w-6 h-6" />,
          description: "Clearly define what you're trying to solve",
          content:
            "Start by clearly articulating the problem without any assumptions about how it should be solved.",
          color:
            "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",
          prompts: [
            "What exactly are we trying to achieve?",
            "What is the core problem statement?",
            "What are we assuming about this problem?",
            "How have others typically approached this?",
            "What constraints are we accepting without question?",
          ],
        },
        {
          number: 2,
          title: "Break Down to Fundamentals",
          icon: <Layers className="w-6 h-6" />,
          description: "Reduce the problem to its basic elements",
          content:
            "Strip away all assumptions and break the problem down to its most fundamental components. What are the basic truths that cannot be reduced further?",
          color:
            "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
          prompts: [
            "What are the most basic elements of this problem?",
            "What facts do we know to be absolutely true?",
            "What physics, mathematics, or natural laws apply?",
            "What assumptions can we eliminate?",
            "What are the irreducible components?",
          ],
        },
        {
          number: 3,
          title: "Question Everything",
          icon: <Brain className="w-6 h-6" />,
          description: "Challenge all assumptions and conventional wisdom",
          content:
            "Question every assumption, including those that seem obvious. Why do we believe certain things are true or necessary?",
          color:
            "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800",
          prompts: [
            "Why do we assume this must be done this way?",
            "What if the opposite were true?",
            "What conventional wisdom should we challenge?",
            "What would we do if this was the first time this problem existed?",
            "What are we taking for granted?",
          ],
        },
        {
          number: 4,
          title: "Rebuild from Scratch",
          icon: <Target className="w-6 h-6" />,
          description: "Create new solutions from fundamental truths",
          content:
            "Using only the fundamental truths you've identified, build up new solutions without being constrained by how things are currently done.",
          color:
            "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800",
          prompts: [
            "If we started from scratch, how would we solve this?",
            "What new approaches emerge from first principles?",
            "How can we combine fundamental elements differently?",
            "What would an ideal solution look like?",
            "What innovative approaches are now possible?",
          ],
        },
      ],
    },
  };

  const toggleStep = (key: string) => {
    setOpenSteps((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleSection = (sectionName: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const handleMethodologyChange = (value: string) => {
    setSelectedMethodology(value);
    setOpenSteps({}); // Clear all open states when methodology changes
  };

  useEffect(() => {
    if (activeTab === "guide") {
      setOpenSteps({});
    }
  }, [activeTab]);

  const startNewSession = () => {
    const newSession: ProblemSession = {
      id: Date.now().toString(),
      title: "",
      description: "",
      methodology: selectedMethodology,
      createdAt: new Date(),
      completedSteps: [],
      stepNotes: {},
      actionItems: {},
    };
    setCurrentSession(newSession);
    setActiveTab("session");
  };

  const saveSession = () => {
    if (!currentSession) return;

    setSessions((prev) => {
      const existing = prev.find((s) => s.id === currentSession.id);
      if (existing) {
        return prev.map((s) =>
          s.id === currentSession.id ? currentSession : s
        );
      } else {
        return [...prev, currentSession];
      }
    });
  };

  const updateSession = (updates: Partial<ProblemSession>) => {
    if (!currentSession) return;
    setCurrentSession({ ...currentSession, ...updates });
  };

  const updateStepNote = (stepNumber: number, note: string) => {
    if (!currentSession) return;
    updateSession({
      stepNotes: { ...currentSession.stepNotes, [stepNumber]: note },
    });
  };

  const toggleStepCompleted = (stepNumber: number) => {
    if (!currentSession) return;
    const completedSteps = currentSession.completedSteps.includes(stepNumber)
      ? currentSession.completedSteps.filter((s) => s !== stepNumber)
      : [...currentSession.completedSteps, stepNumber];
    updateSession({ completedSteps });
  };

  const addActionItem = (stepNumber: number, text: string) => {
    if (!currentSession || !text.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
    };
    const stepItems = currentSession.actionItems[stepNumber] || [];
    updateSession({
      actionItems: {
        ...currentSession.actionItems,
        [stepNumber]: [...stepItems, newItem],
      },
    });
  };

  const toggleActionItem = (stepNumber: number, itemId: string) => {
    if (!currentSession) return;
    const stepItems = currentSession.actionItems[stepNumber] || [];
    const updatedItems = stepItems.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updateSession({
      actionItems: {
        ...currentSession.actionItems,
        [stepNumber]: updatedItems,
      },
    });
  };

  const deleteActionItem = (stepNumber: number, itemId: string) => {
    if (!currentSession) return;
    const stepItems = currentSession.actionItems[stepNumber] || [];
    const updatedItems = stepItems.filter((item) => item.id !== itemId);
    updateSession({
      actionItems: {
        ...currentSession.actionItems,
        [stepNumber]: updatedItems,
      },
    });
  };

  const getProgress = () => {
    if (!currentSession) return 0;
    const methodology = methodologies[currentSession.methodology];
    if (!methodology) return 0;
    return (
      (currentSession.completedSteps.length / methodology.steps.length) * 100
    );
  };

  const getCurrentMethodology = () => {
    if (currentSession) {
      return (
        methodologies[currentSession.methodology] || methodologies["4-step"]
      );
    }
    return methodologies[selectedMethodology] || methodologies["4-step"];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="mb-3">Problem-Solving Methodologies</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Multiple systematic approaches to diagnosing and solving problems
            effectively, enhanced with modern AI integration.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guide">Methodologies</TabsTrigger>
            <TabsTrigger value="session">Active Session</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="guide" className="mt-4 pb-32">
            {/* Methodology Selector */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Choose Your Methodology</CardTitle>
                <CardDescription>
                  Select a problem-solving approach that best fits your
                  situation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={selectedMethodology}
                  onValueChange={handleMethodologyChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a methodology" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(methodologies).map((methodology) => (
                      <SelectItem key={methodology.id} value={methodology.id}>
                        <div className="flex items-center gap-2">
                          {methodology.icon}
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {methodology.name}
                            </span>
                            <span className="text-muted-foreground">—</span>
                            <span className="text-sm text-muted-foreground">
                              {methodology.description}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Current methodology steps */}
            <div className="space-y-4 mb-4">
              {getCurrentMethodology().steps.map((step) => (
                <Card
                  key={`${selectedMethodology}-${step.number}`}
                  className={`transition-all duration-200 ${step.color}`}
                >
                  <Collapsible
                    open={openSteps[`${selectedMethodology}-${step.number}`]}
                    onOpenChange={() =>
                      toggleStep(`${selectedMethodology}-${step.number}`)
                    }
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
                              {step.icon}
                            </div>
                            <div className="text-left">
                              <CardTitle className="flex items-center gap-2">
                                #{step.number} – {step.title}
                              </CardTitle>
                              <CardDescription>
                                {step.description}
                              </CardDescription>
                            </div>
                          </div>
                          {openSteps[
                            `${selectedMethodology}-${step.number}`
                          ] ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 pb-4">
                        <p className="text-foreground leading-relaxed mb-4">
                          {step.content}
                        </p>
                        <div className="bg-accent/50 p-3 rounded-lg">
                          <h4 className="mb-2">Key Questions to Ask:</h4>
                          <ul className="space-y-1">
                            {step.prompts.map((prompt, index) => (
                              <li
                                key={index}
                                className="text-sm text-muted-foreground"
                              >
                                • {prompt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>

            {/* Start Session Button */}
            <div className="text-center mb-4">
              <Button onClick={startNewSession} size="lg" className="gap-2">
                <Plus className="w-4 h-4" />
                Start New Session with{" "}
                {methodologies[selectedMethodology]?.name}
              </Button>
            </div>

            {/* Pitfalls and AI sections */}
            <div className="space-y-3">
              <Card className="border-destructive/20 bg-destructive/5">
                <Collapsible
                  open={openSections.pitfalls}
                  onOpenChange={() => toggleSection("pitfalls")}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-destructive/10 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-6 h-6 text-destructive" />
                          <CardTitle className="text-destructive">
                            Common Pitfalls
                          </CardTitle>
                        </div>
                        {openSections.pitfalls ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="space-y-3">
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Going into Autopilot</AlertTitle>
                          <AlertDescription>
                            Rushing to apply familiar solutions without properly
                            understanding the current problem.
                          </AlertDescription>
                        </Alert>
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>
                            Not Identifying the Root Cause
                          </AlertTitle>
                          <AlertDescription>
                            Fixing symptoms instead of addressing the underlying
                            issue that caused the problem.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
                <Collapsible
                  open={openSections.rca}
                  onOpenChange={() => toggleSection("rca")}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-amber-100/50 dark:hover:bg-amber-900/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <GitBranch className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                          <div>
                            <CardTitle className="text-amber-700 dark:text-amber-300">
                              Root Cause Analysis Best Practices
                            </CardTitle>
                            <CardDescription>
                              Guidelines for conducting effective root cause
                              analysis
                            </CardDescription>
                          </div>
                        </div>
                        {openSections.rca ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <p className="mb-6 text-muted-foreground">
                        Root Cause Analysis (RCA) is a systematic approach to
                        identifying the underlying causes of problems to prevent
                        recurrence. Here's what makes an effective RCA:
                      </p>

                      <div className="space-y-4">
                        <div>
                          <h4 className="mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            What Good RCA Should Include
                          </h4>
                          <div className="space-y-3 ml-6">
                            <div className="flex gap-3">
                              <Badge
                                variant="outline"
                                className="flex-shrink-0"
                              >
                                Timeline
                              </Badge>
                              <p>
                                Clear chronological sequence of events leading
                                to the problem
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <Badge
                                variant="outline"
                                className="flex-shrink-0"
                              >
                                Evidence
                              </Badge>
                              <p>
                                Factual data, logs, measurements, and
                                documentation rather than assumptions
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <Badge
                                variant="outline"
                                className="flex-shrink-0"
                              >
                                Multiple Causes
                              </Badge>
                              <p>
                                Recognition that most problems have multiple
                                contributing factors
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <Badge
                                variant="outline"
                                className="flex-shrink-0"
                              >
                                Systemic View
                              </Badge>
                              <p>
                                Analysis of process, technology, and human
                                factors involved
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <Badge
                                variant="outline"
                                className="flex-shrink-0"
                              >
                                Actionable Outcomes
                              </Badge>
                              <p>
                                Specific, measurable recommendations to prevent
                                recurrence
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            Common RCA Mistakes to Avoid
                          </h4>
                          <div className="space-y-2 ml-6">
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Stopping at "Human Error"</strong> -
                                Always dig deeper to understand why the error
                                occurred
                              </AlertDescription>
                            </Alert>
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Confirmation Bias</strong> - Looking
                                only for evidence that supports preconceived
                                notions
                              </AlertDescription>
                            </Alert>
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Single Cause Fallacy</strong> - Assuming
                                there's only one root cause when most problems
                                are multifaceted
                              </AlertDescription>
                            </Alert>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="mb-3 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-primary" />
                            How AI Can Enhance RCA
                          </h4>
                          <div className="space-y-3 ml-6">
                            <div className="flex gap-3">
                              <Badge
                                variant="outline"
                                className="flex-shrink-0"
                              >
                                Pattern Recognition
                              </Badge>
                              <p>
                                Analyze large volumes of log data to identify
                                patterns and anomalies leading up to incidents
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <Badge
                                variant="outline"
                                className="flex-shrink-0"
                              >
                                Timeline Construction
                              </Badge>
                              <p>
                                Automatically correlate events across multiple
                                systems to build comprehensive timelines
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <Badge
                                variant="outline"
                                className="flex-shrink-0"
                              >
                                Hypothesis Generation
                              </Badge>
                              <p>
                                Suggest potential causes based on similar
                                historical incidents and current evidence
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <Badge
                                variant="outline"
                                className="flex-shrink-0"
                              >
                                Impact Analysis
                              </Badge>
                              <p>
                                Model the potential consequences of different
                                root causes and proposed solutions
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <Badge
                                variant="outline"
                                className="flex-shrink-0"
                              >
                                Documentation
                              </Badge>
                              <p>
                                Generate comprehensive RCA reports with
                                structured findings and recommendations
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="bg-accent/50 p-4 rounded-lg">
                          <h4 className="mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            RCA Quality Checklist
                          </h4>
                          <ul className="space-y-1 text-sm">
                            <li>✓ Problem statement is clear and specific</li>
                            <li>
                              ✓ Timeline includes all relevant events and
                              changes
                            </li>
                            <li>✓ Evidence is factual and verifiable</li>
                            <li>
                              ✓ Multiple perspectives have been considered
                            </li>
                            <li>
                              ✓ Root causes address systemic issues, not just
                              symptoms
                            </li>
                            <li>
                              ✓ Recommendations are specific and actionable
                            </li>
                            <li>
                              ✓ Success metrics for preventing recurrence are
                              defined
                            </li>
                          </ul>
                        </div>

                        <Alert>
                          <Lightbulb className="h-4 w-4" />
                          <AlertDescription>
                            <strong>💡 Remember:</strong> The goal of RCA is not
                            to assign blame, but to understand how systems and
                            processes can be improved to prevent similar
                            problems in the future.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <Collapsible
                  open={openSections.ai}
                  onOpenChange={() => toggleSection("ai")}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-primary/10 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Lightbulb className="w-6 h-6 text-primary" />
                          <div>
                            <CardTitle className="text-primary">
                              Modern Addition: Where Does AI Fit In?
                            </CardTitle>
                            <CardDescription>
                              Integrating AI tools into the problem-solving
                              process
                            </CardDescription>
                          </div>
                        </div>
                        {openSections.ai ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <p className="mb-6 text-muted-foreground">
                        AI can enhance any problem-solving methodology by
                        providing additional insights and automation:
                      </p>

                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <Badge variant="outline" className="flex-shrink-0">
                            Analysis
                          </Badge>
                          <p>
                            Use AI to analyze logs, error patterns, or large
                            datasets to identify patterns humans might miss.
                          </p>
                        </div>

                        <div className="flex gap-4">
                          <Badge variant="outline" className="flex-shrink-0">
                            Brainstorming
                          </Badge>
                          <p>
                            AI can help generate additional questions,
                            hypotheses, or solution ideas based on your problem
                            description.
                          </p>
                        </div>

                        <div className="flex gap-4">
                          <Badge variant="outline" className="flex-shrink-0">
                            Research
                          </Badge>
                          <p>
                            Quickly research similar problems, best practices,
                            or industry solutions to inform your approach.
                          </p>
                        </div>

                        <div className="flex gap-4">
                          <Badge variant="outline" className="flex-shrink-0">
                            Documentation
                          </Badge>
                          <p>
                            AI can help summarize findings, create timelines, or
                            organize your problem-solving notes.
                          </p>
                        </div>

                        <Separator className="my-6" />

                        <div className="bg-accent/50 p-4 rounded-lg">
                          <h4 className="mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            As a Supporting Tool
                          </h4>
                          <p className="mb-3">
                            AI can automate routine analysis, simulate outcomes,
                            or provide a second opinion on your reasoning.
                          </p>
                          <Alert>
                            <Lightbulb className="h-4 w-4" />
                            <AlertDescription>
                              <strong>
                                ✳️ AI should augment human judgment, not replace
                                critical thinking and domain expertise.
                              </strong>
                            </AlertDescription>
                          </Alert>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="session" className="mt-4">
            {currentSession ? (
              <div className="space-y-4">
                {/* Session Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getCurrentMethodology().icon}
                          <Badge variant="outline">
                            {getCurrentMethodology().name}
                          </Badge>
                        </div>
                        <Input
                          placeholder="Problem title..."
                          value={currentSession.title}
                          onChange={(e) =>
                            updateSession({ title: e.target.value })
                          }
                          className="text-lg font-medium"
                        />
                        <Textarea
                          placeholder="Describe the problem you're trying to solve..."
                          value={currentSession.description}
                          onChange={(e) =>
                            updateSession({ description: e.target.value })
                          }
                          className="min-h-20"
                        />
                      </div>
                      <Button onClick={saveSession} className="ml-4 gap-2">
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>
                          {currentSession.completedSteps.length}/
                          {getCurrentMethodology().steps.length} steps completed
                        </span>
                      </div>
                      <Progress value={getProgress()} className="w-full" />
                    </div>
                  </CardContent>
                </Card>

                {/* Interactive Steps */}
                <div className="space-y-4">
                  {getCurrentMethodology().steps.map((step) => (
                    <Card
                      key={step.number}
                      className={`transition-all duration-200 ${step.color}`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={currentSession.completedSteps.includes(
                                  step.number
                                )}
                                onCheckedChange={() =>
                                  toggleStepCompleted(step.number)
                                }
                              />
                              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
                                {step.icon}
                              </div>
                            </div>
                            <div className="text-left">
                              <CardTitle className="flex items-center gap-2">
                                #{step.number} – {step.title}
                              </CardTitle>
                              <CardDescription>
                                {step.description}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-foreground leading-relaxed">
                            {step.content}
                          </p>

                          {/* Key Questions */}
                          <div className="bg-accent/50 p-4 rounded-lg">
                            <h4 className="mb-2">Key Questions:</h4>
                            <ul className="space-y-1">
                              {step.prompts.map((prompt, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-muted-foreground"
                                >
                                  • {prompt}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Notes */}
                          <div>
                            <h4 className="mb-2">Notes & Findings:</h4>
                            <Textarea
                              placeholder="Write your notes, observations, and findings for this step..."
                              value={
                                currentSession.stepNotes[step.number] || ""
                              }
                              onChange={(e) =>
                                updateStepNote(step.number, e.target.value)
                              }
                              className="min-h-24"
                            />
                          </div>

                          {/* Action Items */}
                          <div>
                            <h4 className="mb-2">Action Items:</h4>
                            <div className="space-y-2">
                              {(
                                currentSession.actionItems[step.number] || []
                              ).map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-2 p-2 bg-accent/30 rounded"
                                >
                                  <Checkbox
                                    checked={item.completed}
                                    onCheckedChange={() =>
                                      toggleActionItem(step.number, item.id)
                                    }
                                  />
                                  <span
                                    className={`flex-1 ${
                                      item.completed
                                        ? "line-through text-muted-foreground"
                                        : ""
                                    }`}
                                  >
                                    {item.text}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      deleteActionItem(step.number, item.id)
                                    }
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Add action item..."
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      addActionItem(
                                        step.number,
                                        e.currentTarget.value
                                      );
                                      e.currentTarget.value = "";
                                    }
                                  }}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    const input = e.currentTarget
                                      .previousElementSibling as HTMLInputElement;
                                    addActionItem(step.number, input.value);
                                    input.value = "";
                                  }}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="mb-2">No Active Session</h3>
                <p className="text-muted-foreground mb-4">
                  Start a new problem-solving session to begin working through a
                  methodology.
                </p>
                <Button onClick={startNewSession} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Start New Session
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            {sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.map((session) => {
                  const methodology = methodologies[session.methodology];
                  return (
                    <Card
                      key={session.id}
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => {
                        setCurrentSession(session);
                        setActiveTab("session");
                      }}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {methodology?.icon}
                              <Badge variant="outline" className="text-xs">
                                {methodology?.name}
                              </Badge>
                            </div>
                            <CardTitle className="text-base">
                              {session.title || "Untitled Problem"}
                            </CardTitle>
                            <CardDescription>
                              {session.description || "No description"}
                            </CardDescription>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div>
                              {session.completedSteps.length}/
                              {methodology?.steps.length || 0} steps
                            </div>
                            <div>{session.createdAt.toLocaleDateString()}</div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="mb-2">No Sessions Yet</h3>
                <p className="text-muted-foreground">
                  Your completed and saved problem-solving sessions will appear
                  here.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
