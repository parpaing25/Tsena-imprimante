import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  HelpCircle, 
  MessageCircle, 
  Plus,
  Calendar,
  User,
  ThumbsUp,
  Reply,
  ArrowLeft,
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const HelpForum = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [showResponse, setShowResponse] = useState<number | null>(null);
  const [userName, setUserName] = useState(localStorage.getItem('userName') || "");
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    description: "",
    category: "Général"
  });
  const [newResponse, setNewResponse] = useState({
    content: "",
    questionId: 0
  });

  // Questions et réponses fictives pour l'exemple
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "Ma Canon PIXMA ne reconnaît plus mes cartouches",
      description: "Bonjour, depuis hier ma Canon PIXMA G3010 ne reconnaît plus mes cartouches d'encre. J'ai essayé de les retirer et remettre mais rien n'y fait. Que puis-je faire ?",
      author: "Rakoto M.",
      date: "Hier à 14:30",
      category: "Dépannage",
      status: "Résolu",
      responses: [
        {
          id: 1,
          author: "Équipe Tsena",
          date: "Hier à 15:45",
          content: "Bonjour Rakoto, ce problème est courant. Essayez de nettoyer les contacts dorés des cartouches avec un chiffon sec. Si le problème persiste, contactez-nous au 033 71 063 34.",
          helpful: 5,
          isExpert: true
        },
        {
          id: 2,
          author: "Sarah R.",
          date: "Aujourd'hui à 9:20",
          content: "J'ai eu le même problème ! En fait il faut éteindre complètement l'imprimante pendant 30 secondes puis la rallumer. Ça marche !",
          helpful: 3,
          isExpert: false
        }
      ]
    },
    {
      id: 2,
      title: "Quelle imprimante pour un petit bureau ?",
      description: "Je cherche une imprimante pour mon petit bureau (5 personnes). On imprime environ 300 pages par mois, couleur et noir/blanc. Budget max 1.5M MGA. Vos conseils ?",
      author: "Hery A.",
      date: "Il y a 2 heures",
      category: "Conseil d'achat",
      status: "Ouvert",
      responses: [
        {
          id: 3,
          author: "Équipe Tsena",
          date: "Il y a 1 heure",
          content: "Pour votre usage, je recommande la Canon MAXIFY MB5470 (1.2M MGA) ou l'Epson EcoTank L6190 (1.4M MGA). L'EcoTank sera plus économique sur le long terme.",
          helpful: 2,
          isExpert: true
        }
      ]
    },
    {
      id: 3,
      title: "Comment nettoyer les têtes d'impression ?",
      description: "Mes impressions sont de plus en plus pâles. Comment faire un nettoyage des têtes d'impression sur une HP DeskJet ?",
      author: "Aina L.",
      date: "Il y a 3 heures",
      category: "Maintenance",
      status: "Ouvert",
      responses: []
    }
  ]);

  const categories = ["Général", "Dépannage", "Conseil d'achat", "Maintenance", "Installation"];

  const handleSubmitQuestion = () => {
    if (!userName.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer votre nom ou pseudo",
        variant: "destructive"
      });
      return;
    }

    if (!newQuestion.title.trim() || !newQuestion.description.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le titre et la description",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('userName', userName);

    const question = {
      id: questions.length + 1,
      title: newQuestion.title,
      description: newQuestion.description,
      author: userName,
      date: "À l'instant",
      category: newQuestion.category,
      status: "Ouvert",
      responses: []
    };

    setQuestions([question, ...questions]);
    setNewQuestion({ title: "", description: "", category: "Général" });
    setShowNewQuestion(false);
    
    toast({
      title: "Question publiée ! 🎉",
      description: "Votre question a été publiée. La communauté et nos experts vont vous répondre."
    });
  };

  const handleSubmitResponse = () => {
    if (!userName.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez entrer votre nom ou pseudo",
        variant: "destructive"
      });
      return;
    }

    if (!newResponse.content.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez écrire une réponse",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('userName', userName);

    const response = {
      id: Date.now(),
      author: userName,
      date: "À l'instant",
      content: newResponse.content,
      helpful: 0,
      isExpert: false
    };

    setQuestions(prev => prev.map(q => 
      q.id === newResponse.questionId 
        ? { ...q, responses: [...q.responses, response] }
        : q
    ));

    setNewResponse({ content: "", questionId: 0 });
    setShowResponse(null);
    
    toast({
      title: "Réponse ajoutée ! 💬",
      description: "Merci pour votre contribution à la communauté."
    });
  };

  const handleLikeResponse = (questionId: number, responseId: number) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? {
            ...q, 
            responses: q.responses.map(r => 
              r.id === responseId 
                ? { ...r, helpful: r.helpful + 1 }
                : r
            )
          }
        : q
    ));
    
    toast({
      title: "Merci ! 👍",
      description: "Votre vote a été pris en compte"
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Général": "bg-muted text-muted-foreground",
      "Dépannage": "bg-red-100 text-red-700",
      "Conseil d'achat": "bg-primary/10 text-primary",
      "Maintenance": "bg-accent/10 text-accent",
      "Installation": "bg-success/10 text-success"
    };
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  const getStatusColor = (status: string) => {
    return status === "Résolu" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Navigation retour */}
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/blog')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              ← Retour au Blog
            </Button>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <HelpCircle className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-bold text-primary mb-4">
              Forum d'Entraide
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Posez vos questions sur l'impression et aidez la communauté ! Nos experts et utilisateurs partagent leurs connaissances.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setShowNewQuestion(true)}
                className="btn-hero"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Poser une question
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => navigate('/blog')}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                📖 Voir les Articles
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Questions principales */}
            <div className="lg:col-span-3">
              {/* Nouvelle question */}
              {showNewQuestion && (
                <Card className="mb-6 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-primary">Poser une nouvelle question</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">👤 Votre nom ou pseudo</label>
                      <Input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Ex: Rakoto, Sarah, TechExpert..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">📝 Titre de votre question</label>
                      <Input
                        value={newQuestion.title}
                        onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                        placeholder="Ex: Comment résoudre un bourrage papier ?"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">📄 Description détaillée</label>
                      <Textarea
                        value={newQuestion.description}
                        onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                        placeholder="Décrivez votre problème ou question en détail... Soyez précis sur le modèle d'imprimante, le problème rencontré, etc."
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">🏷️ Catégorie</label>
                      <select 
                        value={newQuestion.category}
                        onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                        className="w-full p-2 border border-input bg-background rounded-md"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSubmitQuestion} className="btn-hero">
                        📤 Publier la question
                      </Button>
                      <Button variant="outline" onClick={() => setShowNewQuestion(false)}>
                        ❌ Annuler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Liste des questions */}
              {questions.map(question => (
                <Card key={question.id} className="mb-6 hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2">
                        <Badge className={getCategoryColor(question.category)}>
                          {question.category}
                        </Badge>
                        <Badge className={getStatusColor(question.status)}>
                          {question.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {question.date}
                      </div>
                    </div>
                    <CardTitle className="text-lg hover:text-primary cursor-pointer">
                      {question.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      Par <span className="font-medium">{question.author}</span>
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {question.description}
                    </p>
                    
                    {/* Réponses */}
                    {question.responses.length > 0 && (
                      <div className="space-y-4 mt-6 pt-4 border-t">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Réponses ({question.responses.length})
                        </h4>
                        {question.responses.map(response => (
                          <div key={response.id} className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span className="font-medium text-sm">{response.author}</span>
                                {response.isExpert && (
                                  <Badge className="bg-primary text-primary-foreground text-xs">
                                    Expert Tsena
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">{response.date}</span>
                            </div>
                            <p className="text-sm mb-2">{response.content}</p>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleLikeResponse(question.id, response.id)}
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                {response.helpful}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setShowResponse(question.id)}
                              >
                                <Reply className="h-3 w-3 mr-1" />
                                💬 Répondre
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Formulaire de réponse */}
                    {showResponse === question.id && (
                      <div className="mt-4 p-4 bg-muted/30 rounded-lg border">
                        <h4 className="font-medium mb-3">💬 Votre réponse</h4>
                        {!userName && (
                          <div className="mb-3">
                            <Input
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                              placeholder="Votre nom ou pseudo..."
                              className="mb-2"
                            />
                          </div>
                        )}
                        <Textarea
                          value={newResponse.questionId === question.id ? newResponse.content : ""}
                          onChange={(e) => setNewResponse({ content: e.target.value, questionId: question.id })}
                          placeholder="Partagez votre solution ou vos conseils... Soyez précis et utile !"
                          rows={3}
                          className="mb-3"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSubmitResponse}>
                            ✅ Publier la réponse
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setShowResponse(null)}>
                            ❌ Annuler
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Bouton répondre */}
                    {showResponse !== question.id && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowResponse(question.id)}
                      >
                        <Reply className="h-3 w-3 mr-2" />
                        💬 Répondre à cette question
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Statistiques */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📊 Communauté</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Questions totales</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Questions résolues</span>
                      <span className="font-medium text-success">1,089</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Membres actifs</span>
                      <span className="font-medium">2,341</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Experts Tsena</span>
                      <span className="font-medium text-primary">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top contributeurs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🏆 Top Contributeurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                        ET
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Équipe Tsena</div>
                        <div className="text-xs text-muted-foreground">347 réponses utiles</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-success text-success-foreground rounded-full flex items-center justify-center text-xs font-bold">
                        SR
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Sarah R.</div>
                        <div className="text-xs text-muted-foreground">89 réponses utiles</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-bold">
                        RM
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Rakoto M.</div>
                        <div className="text-xs text-muted-foreground">67 réponses utiles</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact expert */}
              <Card className="bg-gradient-elegant text-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <HelpCircle className="h-8 w-8 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Besoin d'aide urgente ?</h3>
                    <p className="text-sm opacity-90 mb-4">
                      Contactez directement nos experts
                    </p>
                    <Button 
                      onClick={() => window.location.href = "tel:+261337106334"}
                      className="w-full bg-white text-primary hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-2" />
                      033 71 063 34
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpForum;