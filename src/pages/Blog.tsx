import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Phone, 
  Calendar,
  User,
  Lightbulb,
  TrendingUp,
  Award,
  Settings,
  HelpCircle,
  MessageCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Blog = () => {
  const navigate = useNavigate();
  
  const handleCall = () => {
    window.location.href = "tel:+261337106334";
  };

  const articles = [
    {
      id: 1,
      title: "EcoTank vs Cartouches : Le Guide Complet 2025",
      excerpt: "Découvrez quelle technologie choisir selon vos besoins et économisez jusqu'à 70% sur vos coûts d'impression.",
      date: "15 Janvier 2025",
      author: "Équipe Tsena",
      category: "Guide d'achat",
      readTime: "5 min",
      featured: true
    },
    {
      id: 2,
      title: "Nouveautés 2025 : Canon MAXIFY et HP Smart Tank",
      excerpt: "Les dernières innovations arrivent à Madagascar ! Découvrez les nouveaux modèles Canon et HP avec Wi-Fi 6 et impression recto-verso automatique.",
      date: "10 Janvier 2025",
      author: "Équipe Tsena",
      category: "Nouveautés",
      readTime: "4 min"
    },
    {
      id: 3,
      title: "Comment Optimiser la Durée de Vie de votre Imprimante",
      excerpt: "10 conseils pratiques pour maintenir votre imprimante en parfait état et éviter les pannes coûteuses.",
      date: "5 Janvier 2025",
      author: "Service Technique",
      category: "Maintenance",
      readTime: "6 min"
    },
    {
      id: 4,
      title: "Impression Mobile à Madagascar : État des Lieux",
      excerpt: "Comment imprimer facilement depuis votre smartphone ou tablette. Guide des meilleures applications et configurations.",
      date: "28 Décembre 2024",
      author: "Équipe Tsena",
      category: "Technologie",
      readTime: "7 min"
    },
    {
      id: 5,
      title: "Comparatif 2025 : Meilleures Imprimantes par Budget",
      excerpt: "De 300 000 à 2 000 000 MGA, trouvez l'imprimante parfaite selon votre budget avec notre guide détaillé.",
      date: "20 Décembre 2024",
      author: "Équipe Tsena",
      category: "Comparatif",
      readTime: "8 min"
    },
    {
      id: 6,
      title: "Résolution des Problèmes Courants d'Impression",
      excerpt: "Bourrages papier, impression pâle, problèmes Wi-Fi... Solutions rapides aux problèmes les plus fréquents.",
      date: "15 Décembre 2024",
      author: "Service Technique",
      category: "Dépannage",
      readTime: "5 min"
    }
  ];

  const categories = [
    { name: "Guide d'achat", count: 8, icon: <Lightbulb className="h-4 w-4" /> },
    { name: "Nouveautés", count: 5, icon: <TrendingUp className="h-4 w-4" /> },
    { name: "Maintenance", count: 6, icon: <Settings className="h-4 w-4" /> },
    { name: "Comparatif", count: 4, icon: <Award className="h-4 w-4" /> }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      "Guide d'achat": "bg-primary/10 text-primary",
      "Nouveautés": "bg-success/10 text-success", 
      "Maintenance": "bg-accent/10 text-accent",
      "Technologie": "bg-purple-100 text-purple-700",
      "Comparatif": "bg-warning/10 text-warning",
      "Dépannage": "bg-red-100 text-red-700"
    };
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <BookOpen className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl font-bold text-primary mb-4">
              Blog & Actualités
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Conseils d'experts, guides d'achat et actualités du monde de l'impression à Madagascar
            </p>
            <Button 
              onClick={() => navigate('/aide')}
              className="btn-hero mr-4"
              size="lg"
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              Forum d'Entraide
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => navigate('/aide')}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Poser une Question
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Article */}
              {articles
                .filter(article => article.featured)
                .map(article => (
                  <Card key={article.id} className="mb-8 hover:shadow-medium transition-all duration-300 border-2 border-primary/20">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-primary text-primary-foreground">Article Vedette</Badge>
                        <Badge variant="outline" className={getCategoryColor(article.category)}>
                          {article.category}
                        </Badge>
                      </div>
                      <CardTitle 
                        className="text-2xl text-primary hover:text-primary/80 cursor-pointer"
                        onClick={() => navigate(`/blog/${article.id}`)}
                      >
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 text-lg">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {article.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {article.author}
                        </div>
                        <span>📖 {article.readTime} de lecture</span>
                      </div>
                      <Button 
                        className="mt-4 btn-hero"
                        onClick={() => navigate(`/blog/${article.id}`)}
                      >
                        Lire l'article complet
                      </Button>
                    </CardContent>
                  </Card>
                ))}

              {/* Other Articles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles
                  .filter(article => !article.featured)
                  .map(article => (
                    <Card key={article.id} className="hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                      <CardHeader>
                        <div className="mb-2">
                          <Badge variant="outline" className={getCategoryColor(article.category)}>
                            {article.category}
                          </Badge>
                        </div>
                        <CardTitle 
                          className="text-lg hover:text-primary cursor-pointer"
                          onClick={() => navigate(`/blog/${article.id}`)}
                        >
                          {article.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 text-sm">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {article.date}
                          </div>
                          <span>📖 {article.readTime}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => navigate(`/blog/${article.id}`)}
                        >
                          Lire la suite
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Charger plus d'articles
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Newsletter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📧 Newsletter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Recevez nos derniers conseils et offres spéciales directement par email !
                  </p>
                  <Button onClick={handleCall} className="w-full btn-call">
                    <Phone className="h-4 w-4 mr-2" />
                    S'abonner par téléphone
                  </Button>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🏷️ Catégories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.map(category => (
                      <div key={category.name} className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer">
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Articles */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🔥 Articles Populaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="cursor-pointer hover:bg-muted p-2 rounded">
                      <h4 className="text-sm font-medium mb-1">
                        Guide d'achat imprimante 2025
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Le guide complet pour choisir
                      </p>
                    </div>
                    <div className="cursor-pointer hover:bg-muted p-2 rounded">
                      <h4 className="text-sm font-medium mb-1">
                        EcoTank : économies garanties
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Calcul du retour sur investissement
                      </p>
                    </div>
                    <div className="cursor-pointer hover:bg-muted p-2 rounded">
                      <h4 className="text-sm font-medium mb-1">
                        Dépannage imprimante
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Solutions aux problèmes courants
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact CTA */}
              <Card className="bg-gradient-elegant text-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Phone className="h-8 w-8 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Besoin de Conseils ?</h3>
                    <p className="text-sm opacity-90 mb-4">
                      Nos experts vous conseillent personnellement
                    </p>
                    <Button 
                      onClick={handleCall} 
                      className="w-full bg-white text-primary hover:bg-gray-100"
                    >
                      <Phone className="h-4 w-4 mr-2" />
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

export default Blog;
