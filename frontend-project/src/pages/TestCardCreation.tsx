import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";
import { toast } from "sonner";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const TestCardCreation = () => {
  const { theme, setTheme } = useTheme();
  const [deckId, setDeckId] = useState("1");
  const [formData, setFormData] = useState({
    question: "What is React?",
    option_a: "A JavaScript library",
    option_b: "A programming language",
    option_c: "A database",
    option_d: "A CSS framework",
    correct_answer: "a",
    explanation: "React is a JavaScript library for building user interfaces"
  });
  const [loading, setLoading] = useState(false);

  // Apply theme class to body
  useEffect(() => {
    if (theme) {
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(theme);
    }
  }, [theme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.createCard(deckId, formData);
      console.log("Card created:", response);
      toast.success(`Card created successfully with ID: ${response.cardId}`);
    } catch (error) {
      console.error("Error creating card:", error);
      toast.error("Failed to create card: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Test Card Creation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deckId">Deck ID</Label>
              <Input
                id="deckId"
                value={deckId}
                onChange={(e) => setDeckId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="option_a">Option A</Label>
                <Input
                  id="option_a"
                  value={formData.option_a}
                  onChange={(e) => setFormData({...formData, option_a: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="option_b">Option B</Label>
                <Input
                  id="option_b"
                  value={formData.option_b}
                  onChange={(e) => setFormData({...formData, option_b: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="option_c">Option C</Label>
                <Input
                  id="option_c"
                  value={formData.option_c}
                  onChange={(e) => setFormData({...formData, option_c: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="option_d">Option D</Label>
                <Input
                  id="option_d"
                  value={formData.option_d}
                  onChange={(e) => setFormData({...formData, option_d: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="correct_answer">Correct Answer</Label>
              <Input
                id="correct_answer"
                value={formData.correct_answer}
                onChange={(e) => setFormData({...formData, correct_answer: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="explanation">Explanation</Label>
              <Textarea
                id="explanation"
                value={formData.explanation}
                onChange={(e) => setFormData({...formData, explanation: e.target.value})}
              />
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Card"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestCardCreation;