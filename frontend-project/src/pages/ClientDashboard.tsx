import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Trophy, Target, TrendingUp, Play, RotateCcw, CheckCircle2, XCircle, LogOut, Loader2, Sun, Moon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface Quiz {
  id: string;
  name: string;
  description: string;
  category: string;
  cards_count: number;
}

interface Question {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
}

interface AnswerResult {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
}

const ClientDashboard = () => {
  const { theme, setTheme } = useTheme();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerResult[]>([]); // Track all answers
  const [showSummary, setShowSummary] = useState(false); // Show summary at the end

  // Apply theme class to body
  useEffect(() => {
    if (theme) {
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(theme);
    }
  }, [theme]);

  // Fetch quizzes on component mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const decksData = await api.getDecks();
        // Transform decks data to match our Quiz interface
        const transformedQuizzes = decksData.map((deck: any) => ({
          id: deck.id,
          name: deck.name,
          description: deck.description,
          category: deck.category,
          cards_count: 0 // We'll need to get this from the backend or estimate
        }));
        setQuizzes(transformedQuizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        toast.error("Failed to fetch quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const stats = [
    { label: "Quizzes Completed", value: "24", icon: Trophy, color: "from-yellow-500 to-orange-500" },
    { label: "Current Streak", value: "7 days", icon: Target, color: "from-green-500 to-emerald-500" },
    { label: "Average Score", value: "88%", icon: TrendingUp, color: "from-blue-500 to-cyan-500" },
    { label: "Total Study Time", value: "42h", icon: BookOpen, color: "from-purple-500 to-pink-500" }
  ];

  const completedQuizzes = quizzes.slice(0, 2); // Mock completed quizzes
  const availableQuizzes = quizzes;

  const startQuiz = async (quiz: Quiz) => {
    try {
      setCurrentQuiz(quiz);
      setCurrentQuestion(0);
      setSelectedAnswer("");
      
      // Fetch actual questions from the backend
      const cardsData = await api.getCards(quiz.id);
      const transformedQuestions = cardsData.map((card: any) => ({
        id: card.id,
        question: card.question,
        option_a: card.option_a,
        option_b: card.option_b,
        option_c: card.option_c,
        option_d: card.option_d,
        correct_answer: card.correct_answer,
        explanation: card.explanation
      }));
      
      setQuestions(transformedQuestions);
    } catch (error) {
      console.error("Error starting quiz:", error);
      toast.error("Failed to start quiz");
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer && currentQuestionData) {
      // Store the answer without showing immediate feedback
      const newAnswer: AnswerResult = {
        questionId: currentQuestionData.id,
        selectedAnswer,
        isCorrect: selectedAnswer === currentQuestionData.correct_answer,
        correctAnswer: currentQuestionData.correct_answer,
        explanation: currentQuestionData.explanation
      };
      
      setAnswers(prev => [...prev, newAnswer]);
      
      // Move to next question or show summary
      if (currentQuestion < (questions.length || 0) - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer("");
      } else {
        // Quiz completed - show summary
        setShowSummary(true);
      }
    }
  };

  const endQuiz = () => {
    setCurrentQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setQuestions([]);
    setAnswers([]); // Reset answers
    setShowSummary(false); // Reset summary
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Add a function to restart the quiz
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswers([]);
    setShowSummary(false);
  };

  const currentQuestionData = questions[currentQuestion];
  // const isCorrectAnswer = currentQuestionData && selectedAnswer === currentQuestionData.correct_answer;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show summary page when quiz is completed
  if (showSummary && currentQuiz) {
    return (
      <div className="min-h-screen bg-background">
        {/* Simplified Client Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                  <span className="text-lg font-bold text-primary-foreground">CQ</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Client Dashboard
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={toggleTheme}>
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="container mx-auto px-4 pt-24 pb-12">
          <Card className="max-w-4xl mx-auto border-primary/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-2xl">Quiz Summary: {currentQuiz.name}</CardTitle>
                <Button variant="outline" onClick={endQuiz}>
                  Exit Quiz
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="text-2xl font-bold">
                        {answers.filter(a => a.isCorrect).length}/{answers.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-green-500/5 border-green-500/20">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Correct</p>
                      <p className="text-2xl font-bold text-green-500">
                        {answers.filter(a => a.isCorrect).length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-red-500/5 border-red-500/20">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Incorrect</p>
                      <p className="text-2xl font-bold text-red-500">
                        {answers.filter(a => !a.isCorrect).length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Review Your Answers</h3>
                {questions.map((question, index) => {
                  const answer = answers.find(a => a.questionId === question.id);
                  const isCorrect = answer?.isCorrect;
                  
                  return (
                    <Card 
                      key={question.id} 
                      className={`border-2 ${
                        isCorrect 
                          ? "border-green-500/30 bg-green-500/5" 
                          : "border-red-500/30 bg-red-500/5"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isCorrect 
                              ? "bg-green-500 text-white" 
                              : "bg-red-500 text-white"
                          }`}>
                            <span className="font-semibold">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">{question.question}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                              {[
                                { label: "A", value: "a", text: question.option_a },
                                { label: "B", value: "b", text: question.option_b },
                                { label: "C", value: "c", text: question.option_c },
                                { label: "D", value: "d", text: question.option_d }
                              ].map((option) => {
                                const isSelected = answer?.selectedAnswer === option.value;
                                const isCorrectOption = option.value === question.correct_answer;
                                
                                return (
                                  <div 
                                    key={option.value}
                                    className={`p-3 rounded-lg border ${
                                      isSelected && !isCorrectOption
                                        ? "border-red-500 bg-red-500/10"
                                        : isSelected && isCorrectOption
                                        ? "border-green-500 bg-green-500/10"
                                        : isCorrectOption
                                        ? "border-green-500 bg-green-500/10"
                                        : "border-border"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold">{option.label}.</span>
                                      <span>{option.text}</span>
                                      {isCorrectOption && (
                                        <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                                      )}
                                      {isSelected && !isCorrectOption && (
                                        <XCircle className="w-4 h-4 text-red-500 ml-auto" />
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            {!isCorrect && answer && (
                              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm">
                                  <span className="font-semibold">Correct Answer:</span> {question.correct_answer.toUpperCase()}. {question[("option_" + question.correct_answer) as keyof typeof question]}
                                </p>
                                {question.explanation && (
                                  <p className="text-sm mt-2">
                                    <span className="font-semibold">Explanation:</span> {question.explanation}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={restartQuiz}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restart Quiz
                </Button>
                <Button 
                  onClick={endQuiz}
                  className="flex-1 bg-gradient-to-r from-primary to-accent"
                >
                  Finish Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentQuiz) {
    return (
      <div className="min-h-screen bg-background">
        {/* Simplified Client Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                  <span className="text-lg font-bold text-primary-foreground">CQ</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Client Dashboard
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={toggleTheme}>
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="container mx-auto px-4 pt-24 pb-12">
          <Card className="max-w-3xl mx-auto border-primary/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-2xl">{currentQuiz.name}</CardTitle>
                <Button variant="outline" onClick={endQuiz}>
                  Exit Quiz
                </Button>
              </div>
              <Progress value={((currentQuestion + 1) / (questions.length || 1)) * 100} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentQuestionData ? (
                <>
                  <div className="p-8 rounded-lg bg-muted/50 min-h-[150px] flex items-center justify-center">
                    <p className="text-xl font-medium text-center">
                      {currentQuestionData.question}
                    </p>
                  </div>

                  <RadioGroup 
                    value={selectedAnswer} 
                    onValueChange={setSelectedAnswer}
                    className="space-y-3"
                  >
                    {[
                      { label: "A", value: "a", text: currentQuestionData.option_a },
                      { label: "B", value: "b", text: currentQuestionData.option_b },
                      { label: "C", value: "c", text: currentQuestionData.option_c },
                      { label: "D", value: "d", text: currentQuestionData.option_d }
                    ].map((option) => {
                      const isSelected = selectedAnswer === option.value;
                      
                      // Don't show correctness indicators during the quiz
                      return (
                        <div 
                          key={option.value}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                          <Label 
                            htmlFor={`option-${option.value}`}
                            className="flex-1 cursor-pointer text-base"
                          >
                            <span className="font-semibold mr-2">{option.label}.</span> {option.text}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleAnswerSubmit} 
                      className="flex-1 bg-gradient-to-r from-primary to-accent"
                      size="lg"
                      disabled={!selectedAnswer}
                    >
                      {currentQuestion >= (questions.length || 0) - 1 ? "Finish Quiz" : "Next Question"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading questions...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simplified Client Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                <span className="text-lg font-bold text-primary-foreground">CQ</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Client Dashboard
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Learning Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and continue your learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList>
            <TabsTrigger value="available">Available Quizzes</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            {availableQuizzes.length === 0 ? (
              <Card className="border-border">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No quizzes available at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {availableQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="border-border hover:border-primary/50 transition-colors group">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                          {quiz.category}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{quiz.name}</CardTitle>
                      <CardDescription>{quiz.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => startQuiz(quiz)}
                        className="w-full gap-2 bg-gradient-to-r from-primary to-accent group-hover:shadow-lg transition-shadow"
                      >
                        <Play className="w-4 h-4" />
                        Start Quiz
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedQuizzes.length === 0 ? (
              <Card className="border-border">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">You haven't completed any quizzes yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {completedQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="border-border hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                          {quiz.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-semibold">85%</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{quiz.name}</CardTitle>
                      <CardDescription>{quiz.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => startQuiz(quiz)}
                        variant="outline" 
                        className="w-full gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Retake Quiz
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;