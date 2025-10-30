import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Save, X, FolderOpen, FileText, Users, BarChart3, LogOut, Loader2, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import { useTheme } from "next-themes";

interface Flashcard {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  deck_id: string;
}

interface Deck {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface DeckFormData {
  name: string;
  description: string;
  category: string;
}

const AdminDashboard = () => {
  const { theme, setTheme } = useTheme();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "a",
    explanation: "",
    deck_id: ""  // Initialize with empty string
  });
  const [deckFormData, setDeckFormData] = useState<DeckFormData>({
    name: "",
    description: "",
    category: ""
  });

  // Apply theme class to body
  useEffect(() => {
    if (theme) {
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(theme);
    }
  }, [theme]);

  // Fetch decks on component mount
  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const decksData = await api.getDecks();
        setDecks(decksData);
        
        // If there are decks, select the first one by default
        if (decksData.length > 0) {
          setSelectedDeck(decksData[0].id);
        }
      } catch (error) {
        console.error("Error fetching decks:", error);
        toast.error("Failed to fetch decks");
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, []);

  // Fetch cards when a deck is selected
  useEffect(() => {
    const fetchCards = async () => {
      if (!selectedDeck) return;
      
      try {
        setLoading(true);
        const cardsData = await api.getCards(selectedDeck);
        setCards(cardsData);
        // Update form data to use the selected deck
        setFormData(prev => ({ ...prev, deck_id: selectedDeck }));
      } catch (error) {
        console.error("Error fetching cards:", error);
        setCards([]);
        toast.error("Failed to fetch cards");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [selectedDeck]);

  const stats = [
    { label: "Total Flashcards", value: cards.length, icon: FileText, color: "from-blue-500 to-cyan-500" },
    { label: "Categories", value: decks.length, icon: FolderOpen, color: "from-purple-500 to-pink-500" },
    { label: "Active Users", value: "1,234", icon: Users, color: "from-green-500 to-emerald-500" },
    { label: "Completion Rate", value: "87%", icon: BarChart3, color: "from-orange-500 to-yellow-500" }
  ];

  const handleSubmit = async () => {
    if (!formData.question || !formData.option_a || !formData.option_b || 
        !formData.option_c || !formData.option_d || !formData.deck_id) {
      if (!formData.deck_id) {
        toast.error("Please select a deck first");
      } else {
        toast.error("Please fill all required fields");
      }
      return;
    }

    try {
      if (editingId) {
        // Update existing card
        await api.updateCard(editingId, formData);
        setCards(cards.map(card => 
          card.id === editingId ? { ...card, ...formData } : card
        ));
        toast.success("Flashcard updated successfully");
      } else {
        // Create new card
        const response = await api.createCard(formData.deck_id, formData);
        const newCard = {
          id: response.cardId.toString(), 
          ...formData
        };
        setCards([...cards, newCard]);
        toast.success("Flashcard created successfully");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving flashcard:", error);
      toast.error("Failed to save flashcard: " + (error as Error).message);
    }
  };

  const handleEdit = (card: Flashcard) => {
    setFormData({
      question: card.question,
      option_a: card.option_a,
      option_b: card.option_b,
      option_c: card.option_c,
      option_d: card.option_d,
      correct_answer: card.correct_answer,
      explanation: card.explanation,
      deck_id: card.deck_id
    });
    setEditingId(card.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteCard(id);
      setCards(cards.filter(card => card.id !== id));
      toast.success("Flashcard deleted successfully");
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      toast.error("Failed to delete flashcard");
    }
  };

  // Function to add forms for adding data
  const addFormForData = (formType: 'deck' | 'card') => {
    if (formType === 'deck') {
      setIsCreatingDeck(true);
      setDeckFormData({
        name: "",
        description: "",
        category: ""
      });
    } else {
      // Initialize form with selected deck before showing
      setFormData(prev => ({ ...prev, deck_id: selectedDeck }));
      setIsCreating(true);
    }
  };

  // Function to handle deck form submission
  const handleDeckSubmit = async () => {
    if (!deckFormData.name || !deckFormData.description || !deckFormData.category) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await api.createDeck(deckFormData);
      const newDeck = {
        id: response.deckId?.toString() || Date.now().toString(),
        ...deckFormData
      };
      setDecks([...decks, newDeck]);
      toast.success("Deck created successfully");
      setIsCreatingDeck(false);
      setDeckFormData({ name: "", description: "", category: "" });
    } catch (error) {
      console.error("Error creating deck:", error);
      toast.error("Failed to create deck: " + (error as Error).message);
    }
  };

  // Function to reset deck form
  const resetDeckForm = () => {
    setIsCreatingDeck(false);
    setDeckFormData({ name: "", description: "", category: "" });
  };

  const resetForm = () => {
    setFormData({
      question: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "a",
      explanation: "",
      // Maintain the selected deck when resetting form
      deck_id: selectedDeck
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (loading && decks.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simplified Admin Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                <span className="text-lg font-bold text-primary-foreground">AQ</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Admin Panel
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
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your flashcards and monitor platform activity</p>
        </div>

        {/* Deck Selector and Controls */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="deck-selector">Select Deck</Label>
            <Button 
              onClick={() => addFormForData('deck')}
              className="gap-2 bg-gradient-to-r from-primary to-accent"
            >
              <Plus className="w-4 h-4" />
              Add Deck
            </Button>
          </div>
          <div className="flex gap-2">
            <select
              id="deck-selector"
              value={selectedDeck}
              onChange={(e) => {
                setSelectedDeck(e.target.value);
                // Update form data when deck is changed
                setFormData(prev => ({ ...prev, deck_id: e.target.value }));
              }}
              className="w-full p-2 border border-border rounded-md bg-background"
            >
              {decks.map((deck) => (
                <option key={deck.id} value={deck.id}>
                  {deck.name}
                </option>
              ))}
            </select>
            <Button 
              onClick={() => addFormForData('card')}
              disabled={!selectedDeck}
              className="gap-2 bg-gradient-to-r from-primary to-accent"
            >
              <Plus className="w-4 h-4" />
              Add Card
            </Button>
          </div>
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

        <Tabs defaultValue="flashcards" className="space-y-6">
          <TabsList>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="flashcards" className="space-y-6">
            {/* Create Deck Form */}
            {isCreatingDeck && (
              <Card className="border-primary/50 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Create New Deck</CardTitle>
                    <Button variant="ghost" size="icon" onClick={resetDeckForm}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deck-name">Deck Name *</Label>
                    <Input
                      id="deck-name"
                      placeholder="Enter deck name"
                      value={deckFormData.name}
                      onChange={(e) => setDeckFormData({ ...deckFormData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deck-description">Description *</Label>
                    <Textarea
                      id="deck-description"
                      placeholder="Enter deck description"
                      value={deckFormData.description}
                      onChange={(e) => setDeckFormData({ ...deckFormData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deck-category">Category *</Label>
                    <Input
                      id="deck-category"
                      placeholder="Enter category"
                      value={deckFormData.category}
                      onChange={(e) => setDeckFormData({ ...deckFormData, category: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleDeckSubmit} 
                      className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent"
                      disabled={!deckFormData.name || !deckFormData.description || !deckFormData.category}
                    >
                      <Save className="w-4 h-4" />
                      Create Deck
                    </Button>
                    <Button variant="outline" onClick={resetDeckForm} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Create/Edit Flashcard Form */}
            {isCreating && (
              <Card className="border-primary/50 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{editingId ? "Edit Flashcard" : "Create New Flashcard"}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={resetForm}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedDeck && (
                    <div className="bg-primary/5 border border-primary/20 rounded-md p-3">
                      <p className="text-sm text-primary font-medium">
                        Adding to deck: {decks.find(d => d.id === selectedDeck)?.name || 'Unknown Deck'}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="question">Question *</Label>
                    <Textarea
                      id="question"
                      placeholder="Enter your question"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="option_a">Option A *</Label>
                      <Input
                        id="option_a"
                        placeholder="Option A"
                        value={formData.option_a}
                        onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="option_b">Option B *</Label>
                      <Input
                        id="option_b"
                        placeholder="Option B"
                        value={formData.option_b}
                        onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="option_c">Option C *</Label>
                      <Input
                        id="option_c"
                        placeholder="Option C"
                        value={formData.option_c}
                        onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="option_d">Option D *</Label>
                      <Input
                        id="option_d"
                        placeholder="Option D"
                        value={formData.option_d}
                        onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="correct_answer">Correct Answer *</Label>
                    <select
                      id="correct_answer"
                      value={formData.correct_answer}
                      onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      <option value="a">A</option>
                      <option value="b">B</option>
                      <option value="c">C</option>
                      <option value="d">D</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="explanation">Explanation</Label>
                    <Textarea
                      id="explanation"
                      placeholder="Explanation for the correct answer"
                      value={formData.explanation}
                      onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleSubmit} 
                      className="flex-1 gap-2 bg-gradient-to-r from-primary to-accent"
                      disabled={!formData.question || !formData.option_a || !formData.option_b || 
                                !formData.option_c || !formData.option_d}
                    >
                      <Save className="w-4 h-4" />
                      {editingId ? "Update" : "Create"} Flashcard
                    </Button>
                    <Button variant="outline" onClick={resetForm} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Flashcards List */}
            <div className="grid gap-4">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : cards.length === 0 ? (
                <Card className="border-border">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      No flashcards found in this deck. 
                      {selectedDeck && (
                        <Button 
                          variant="link" 
                          onClick={() => addFormForData('card')}
                          className="pl-2"
                        >
                          Create the first one
                        </Button>
                      )}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                cards.map((card) => (
                  <Card key={card.id} className="border-border hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                              Correct: {card.correct_answer.toUpperCase()}
                            </span>
                          </div>
                          <CardTitle className="text-xl mb-2">{card.question}</CardTitle>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                            <div className={`p-2 rounded ${card.correct_answer === 'a' ? 'bg-green-500/20 border border-green-500/30' : 'bg-muted'}`}>
                              <span className="font-semibold">A:</span> {card.option_a}
                            </div>
                            <div className={`p-2 rounded ${card.correct_answer === 'b' ? 'bg-green-500/20 border border-green-500/30' : 'bg-muted'}`}>
                              <span className="font-semibold">B:</span> {card.option_b}
                            </div>
                            <div className={`p-2 rounded ${card.correct_answer === 'c' ? 'bg-green-500/20 border border-green-500/30' : 'bg-muted'}`}>
                              <span className="font-semibold">C:</span> {card.option_c}
                            </div>
                            <div className={`p-2 rounded ${card.correct_answer === 'd' ? 'bg-green-500/20 border border-green-500/30' : 'bg-muted'}`}>
                              <span className="font-semibold">D:</span> {card.option_d}
                            </div>
                          </div>
                          {card.explanation && (
                            <CardDescription className="mt-3 p-3 bg-muted rounded">
                              <span className="font-semibold">Explanation:</span> {card.explanation}
                            </CardDescription>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(card)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(card.id)}
                            className="hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>Track platform performance and user engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Analytics dashboard coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users and their permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  User management coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;