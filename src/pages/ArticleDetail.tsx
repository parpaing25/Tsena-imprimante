import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Calendar,
  User,
  Clock,
  Share2,
  BookOpen
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Articles data avec contenu complet
  const articles = {
    "1": {
      id: 1,
      title: "EcoTank vs Cartouches : Le Guide Complet 2025",
      excerpt: "Découvrez quelle technologie choisir selon vos besoins et économisez jusqu'à 70% sur vos coûts d'impression.",
      date: "15 Janvier 2025",
      author: "Équipe Tsena",
      category: "Guide d'achat",
      readTime: "5 min",
      content: `
        <h2>🌟 Introduction</h2>
        <p>Le choix entre une imprimante EcoTank et une imprimante à cartouches traditionnelles est <strong>crucial</strong> pour optimiser vos coûts d'impression à Madagascar ! 💰 Dans ce guide complet, nous analysons les avantages et inconvénients de chaque technologie pour vous aider à faire le meilleur choix.</p>
        
        <h2>🚀 Imprimantes EcoTank : La révolution des réservoirs d'encre</h2>
        <p>Les imprimantes EcoTank d'Epson ont révolutionné le monde de l'impression avec leurs réservoirs d'encre rechargeables ! ✨ Cette technologie innovante permet :</p>
        <ul>
          <li>💡 <strong>Économies drastiques :</strong> Jusqu'à 70% d'économies sur vos coûts d'impression</li>
          <li>⚡ <strong>Autonomie exceptionnelle :</strong> Jusqu'à 4500 pages en noir et 7500 pages en couleur</li>
          <li>🎯 <strong>Facilité d'utilisation :</strong> Recharge simple avec des flacons d'encre colorés</li>
          <li>🌱 <strong>Écologique :</strong> Réduction significative des déchets plastiques</li>
        </ul>

        <h2>🏆 Cartouches traditionnelles : Fiabilité éprouvée</h2>
        <p>Les imprimantes à cartouches restent une solution <strong>fiable et accessible</strong> avec leurs propres avantages :</p>
        <ul>
          <li>💵 <strong>Investissement initial moindre :</strong> Prix d'achat plus abordable</li>
          <li>🎨 <strong>Qualité constante :</strong> Impression de haute qualité garantie</li>
          <li>🛒 <strong>Disponibilité :</strong> Cartouches facilement trouvables partout à Madagascar</li>
          <li>🔧 <strong>Simplicité :</strong> Installation et remplacement ultra-simple</li>
        </ul>

        <h2>📊 Comparatif des coûts sur 3 ans</h2>
        <p>Voici une analyse détaillée pour un usage de <strong>200 pages par mois</strong> :</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <ul>
            <li>🟢 <strong>EcoTank :</strong> 1 200 000 MGA (imprimante + encre sur 3 ans)</li>
            <li>🔵 <strong>Cartouches :</strong> 1 800 000 MGA (imprimante + cartouches sur 3 ans)</li>
            <li>💰 <strong>Économie EcoTank :</strong> <span style="color: #22c55e; font-size: 1.2em;">600 000 MGA sur 3 ans !</span></li>
          </ul>
        </div>

        <h2>💡 Notre recommandation d'experts</h2>
        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <p><strong>🎯 Choisissez EcoTank si :</strong></p>
          <ul>
            <li>📈 Vous imprimez plus de 100 pages par mois</li>
            <li>💰 Vous cherchez des économies à long terme</li>
            <li>🌱 Vous voulez réduire votre impact environnemental</li>
            <li>🏢 Vous avez un usage professionnel ou familial intensif</li>
          </ul>
        </div>

        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <p><strong>🎯 Optez pour les cartouches si :</strong></p>
          <ul>
            <li>📄 Vous imprimez moins de 50 pages par mois</li>
            <li>💳 Votre budget initial est limité</li>
            <li>🎨 Vous privilégiez l'impression photo occasionnelle</li>
            <li>🏠 Usage domestique léger et ponctuel</li>
          </ul>
        </div>

        <h2>🎉 Conclusion</h2>
        <p>Les imprimantes EcoTank représentent <strong>l'avenir de l'impression</strong> domestique et professionnelle à Madagascar ! 🇲🇬 Malgré un investissement initial plus important, elles offrent des économies substantielles et une expérience utilisateur améliorée.</p>
        
        <div style="background: #22c55e; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <p><strong>🛒 Prêt à faire des économies ? Contactez Tsena Imprimante dès maintenant !</strong></p>
          <p>📞 <strong>033 71 063 34</strong> | 💬 Conseils gratuits et livraison rapide !</p>
        </div>
      `
    },
    "2": {
      id: 2,
      title: "Nouveautés 2025 : Canon MAXIFY et HP Smart Tank",
      excerpt: "Les dernières innovations arrivent à Madagascar ! Découvrez les nouveaux modèles Canon et HP avec Wi-Fi 6 et impression recto-verso automatique.",
      date: "10 Janvier 2025",
      author: "Équipe Tsena",
      category: "Nouveautés",
      readTime: "4 min",
      content: `
        <h2>🚀 Les innovations 2025 débarquent à Madagascar !</h2>
        <p>Cette année marque un <strong>tournant majeur</strong> dans le monde de l'impression ! 🎯 L'arrivée des nouvelles gammes Canon MAXIFY et HP Smart Tank à Madagascar apporte des technologies de pointe spécialement conçues pour répondre aux besoins modernes des entreprises et particuliers malgaches.</p>

        <h2>🏆 Canon MAXIFY 2025 : Performance professionnelle</h2>
        <p>Canon frappe fort avec sa nouvelle gamme MAXIFY qui repousse les limites de l'impression professionnelle ! ⚡</p>
        <ul>
          <li>📶 <strong>Wi-Fi 6 :</strong> Connexion ultra-rapide et stable - fini les coupures !</li>
          <li>🌿 <strong>Impression recto-verso automatique :</strong> Économies de papier garanties (jusqu'à 50% !)</li>
          <li>📱 <strong>Écran tactile 4.3" :</strong> Interface intuitive et moderne comme votre smartphone</li>
          <li>⚡ <strong>Vitesse d'impression :</strong> Jusqu'à 24 pages par minute - Productivité maximale !</li>
          <li>🔒 <strong>Sécurité avancée :</strong> Protection des documents sensibles</li>
        </ul>

        <h2>🤖 HP Smart Tank : Intelligence artificielle intégrée</h2>
        <p>HP révolutionne complètement l'expérience utilisateur avec ses Smart Tank nouvelle génération ! 🌟</p>
        <ul>
          <li>🎯 <strong>Smart Tasks :</strong> Automatisation intelligente des tâches répétitives</li>
          <li>🔍 <strong>Détection automatique :</strong> Reconnaissance du type de document (photo, texte, graphique)</li>
          <li>📱 <strong>Application HP Smart :</strong> Contrôle total depuis votre smartphone - imprimez depuis n'importe où !</li>
          <li>🛡️ <strong>Sécurité renforcée :</strong> Protection avancée contre les cyberattaques</li>
          <li>🌱 <strong>Mode éco intelligent :</strong> Optimisation automatique de la consommation d'encre</li>
        </ul>

        <h2>🇲🇬 Disponibilité à Madagascar</h2>
        <div style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <p><strong>🎉 Tsena Imprimante est fier d'annoncer l'arrivée exclusive de ces nouveaux modèles :</strong></p>
          <ul>
            <li>🖨️ Canon MAXIFY GX7020 : <strong>Disponible dès février 2025</strong></li>
            <li>📦 HP Smart Tank 7602 : <strong>Pré-commandes ouvertes maintenant !</strong></li>
            <li>🚚 <strong>Livraison gratuite</strong> à Antananarivo et environs</li>
            <li>🎓 <strong>Formation gratuite</strong> incluse pour maîtriser toutes les fonctionnalités</li>
            <li>🔧 <strong>Support technique</strong> 1 an gratuit</li>
          </ul>
        </div>

        <h2>💰 Prix et offres de lancement exceptionnelles</h2>
        <p>Profitez de nos <strong>offres spéciales de lancement</strong> - Quantités limitées ! 🔥</p>
        <div style="background: #f59e0b; color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <ul>
            <li>🖨️ <strong>Canon MAXIFY GX7020 :</strong> <span style="font-size: 1.2em;">1 850 000 MGA</span> <span style="text-decoration: line-through; opacity: 0.8;">(au lieu de 2 100 000 MGA)</span></li>
            <li>🖨️ <strong>HP Smart Tank 7602 :</strong> <span style="font-size: 1.2em;">1 650 000 MGA</span> <span style="text-decoration: line-through; opacity: 0.8;">(au lieu de 1 900 000 MGA)</span></li>
            <li>🎁 <strong>Pack encre complet OFFERT</strong> pour tout achat avant fin mars 2025 !</li>
            <li>💳 <strong>Paiement en 3 fois sans frais</strong> disponible</li>
          </ul>
        </div>

        <div style="background: #dc2626; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <p><strong>⏰ OFFRE LIMITÉE - Ne manquez pas cette opportunité !</strong></p>
          <p>📞 <strong>Appelez maintenant : 033 71 063 34</strong></p>
          <p>💬 <strong>Ou visitez notre showroom pour une démonstration gratuite !</strong></p>
        </div>
      `
    },
    "3": {
      id: 3,
      title: "Comment Optimiser la Durée de Vie de votre Imprimante",
      excerpt: "10 conseils pratiques pour maintenir votre imprimante en parfait état et éviter les pannes coûteuses.",
      date: "5 Janvier 2025",
      author: "Service Technique",
      category: "Maintenance",
      readTime: "6 min",
      content: `
        <h2>🔧 Introduction à la maintenance préventive</h2>
        <p>Une imprimante bien entretenue peut durer <strong>10 ans ou plus</strong> ! 🎯 Découvrez nos secrets d'experts pour maintenir votre matériel en parfait état et éviter les pannes coûteuses qui peuvent survenir à Madagascar.</p>
        
        <h2>🌟 Les 10 commandements de l'entretien d'imprimante</h2>
        
        <h3>1. 🧹 Nettoyage régulier - La base de tout !</h3>
        <p>Un nettoyage <strong>hebdomadaire</strong> avec un chiffon doux et sec prolonge significativement la durée de vie :</p>
        <ul>
          <li>✨ <strong>Extérieur :</strong> Utilisez un chiffon microfibre légèrement humide</li>
          <li>🖨️ <strong>Plateau papier :</strong> Retirez la poussière qui peut causer des bourrages</li>
          <li>⚡ <strong>Contacts électriques :</strong> Nettoyez avec un coton-tige sec</li>
        </ul>
        
        <h3>2. 🌡️ Environnement optimal</h3>
        <p>À Madagascar, le climat peut affecter votre imprimante ! Voici comment protéger votre investissement :</p>
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <ul>
            <li>🌡️ <strong>Température :</strong> Entre 15°C et 32°C (évitez les variations brutales)</li>
            <li>💧 <strong>Humidité :</strong> 40-60% - Utilisez un déshumidificateur si nécessaire</li>
            <li>🌞 <strong>Lumière directe :</strong> Évitez l'exposition au soleil direct</li>
            <li>🚭 <strong>Poussière :</strong> Gardez votre imprimante dans un endroit protégé</li>
          </ul>
        </div>
        
        <h3>3. 📄 Qualité du papier - Ne lésinez pas !</h3>
        <p>Le papier de mauvaise qualité est l'<strong>ennemi numéro 1</strong> de votre imprimante :</p>
        <ul>
          <li>✅ <strong>Grammage :</strong> Respectez les spécifications (généralement 80g/m²)</li>
          <li>🚫 <strong>Évitez :</strong> Papier humide, froissé ou de mauvaise qualité</li>
          <li>📦 <strong>Stockage :</strong> Conservez le papier dans un endroit sec</li>
        </ul>
        
        <h3>4. 🖋️ Gestion intelligente de l'encre</h3>
        <div style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <p><strong>💡 Astuces d'experts pour économiser l'encre :</strong></p>
          <ul>
            <li>🎯 <strong>Utilisez votre imprimante régulièrement</strong> - Au moins une fois par semaine</li>
            <li>⚙️ <strong>Mode brouillon</strong> pour les documents internes</li>
            <li>🔄 <strong>Nettoyage des têtes</strong> uniquement si nécessaire</li>
            <li>🛡️ <strong>Encre originale</strong> pour éviter les bouchages</li>
          </ul>
        </div>
        
        <h3>5. ⚡ Alimentation électrique stable</h3>
        <p>Les coupures de courant fréquentes à Madagascar peuvent endommager votre imprimante :</p>
        <ul>
          <li>🔌 <strong>Onduleur recommandé</strong> pour protéger contre les surtensions</li>
          <li>⚡ <strong>Éteignez proprement</strong> après chaque utilisation</li>
          <li>🔒 <strong>Évitez les rallonges</strong> de mauvaise qualité</li>
        </ul>
        
        <h2>🚨 Signaux d'alarme à surveiller</h2>
        <div style="background: #fef2f2; padding: 20px; border-left: 4px solid #dc2626; margin: 20px 0;">
          <p><strong>🚩 Contactez immédiatement un technicien si :</strong></p>
          <ul>
            <li>📢 <strong>Bruits anormaux</strong> pendant l'impression</li>
            <li>🎨 <strong>Qualité d'impression dégradée</strong> malgré un nettoyage</li>
            <li>⚡ <strong>Bourrages papier fréquents</strong></li>
            <li>🔋 <strong>Messages d'erreur persistants</strong></li>
            <li>🌡️ <strong>Surchauffe</strong> de l'appareil</li>
          </ul>
        </div>
        
        <h2>📅 Planning d'entretien recommandé</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4>🗓️ <strong>Hebdomadaire :</strong></h4>
          <ul>
            <li>🧹 Nettoyage extérieur et plateau papier</li>
            <li>📋 Vérification du niveau d'encre</li>
          </ul>
          
          <h4>📅 <strong>Mensuel :</strong></h4>
          <ul>
            <li>🖨️ Test d'impression de qualité</li>
            <li>⚙️ Nettoyage des têtes si nécessaire</li>
          </ul>
          
          <h4>📆 <strong>Trimestriel :</strong></h4>
          <ul>
            <li>🔧 Nettoyage interne par un professionnel</li>
            <li>🔍 Vérification générale du fonctionnement</li>
          </ul>
        </div>
        
        <div style="background: #1d4ed8; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <p><strong>🛠️ Service de maintenance Tsena Imprimante</strong></p>
          <p>📞 <strong>033 71 063 34</strong> | Intervention rapide à domicile !</p>
        </div>
      `
    },
    "4": {
      id: 4,
      title: "Impression Mobile à Madagascar : État des Lieux",
      excerpt: "Comment imprimer facilement depuis votre smartphone ou tablette. Guide des meilleures applications et configurations.",
      date: "28 Décembre 2024",
      author: "Équipe Tsena",
      category: "Technologie", 
      readTime: "7 min",
      content: `
        <h2>📱 La révolution mobile arrive à Madagascar !</h2>
        <p>Imprimer depuis son smartphone n'est plus un luxe mais une <strong>nécessité</strong> ! 🌟 À Madagascar, cette technologie transforme la façon dont nous travaillons, étudions et gérons nos documents au quotidien.</p>
        
        <h2>🚀 Pourquoi l'impression mobile est-elle révolutionnaire ?</h2>
        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <ul>
            <li>⚡ <strong>Instantané :</strong> Imprimez vos documents importants en quelques secondes</li>
            <li>📍 <strong>Partout :</strong> Depuis n'importe où dans votre bureau ou maison</li>
            <li>👨‍👩‍👧‍👦 <strong>Familial :</strong> Toute la famille peut imprimer facilement</li>
            <li>💼 <strong>Professionnel :</strong> Idéal pour les réunions et présentations de dernière minute</li>
            <li>📚 <strong>Éducation :</strong> Les étudiants peuvent imprimer leurs cours instantanément</li>
          </ul>
        </div>
        
        <h2>🏆 Top 5 des applications incontournables</h2>
        
        <h3>1. 📱 HP Smart - L'excellence reconnue</h3>
        <p>L'application <strong>la plus populaire</strong> à Madagascar pour les imprimantes HP !</p>
        <ul>
          <li>✨ <strong>Scan mobile :</strong> Transformez votre téléphone en scanner professionnel</li>
          <li>🔍 <strong>Reconnaissance OCR :</strong> Convertissez vos images en texte modifiable</li>
          <li>☁️ <strong>Cloud intégré :</strong> Synchronisation avec Google Drive, Dropbox</li>
          <li>🎨 <strong>Retouche photo :</strong> Améliorez vos images avant impression</li>
        </ul>
        
        <h3>2. 🖨️ Epson iPrint - Simplicité japonaise</h3>
        <p>L'application officielle Epson, parfaite pour les EcoTank !</p>
        <ul>
          <li>🎯 <strong>Interface intuitive :</strong> Même votre grand-mère peut l'utiliser</li>
          <li>📧 <strong>Impression email :</strong> Imprimez directement vos emails et pièces jointes</li>
          <li>🌐 <strong>Web vers papier :</strong> Imprimez n'importe quelle page web</li>
          <li>⚙️ <strong>Paramètres avancés :</strong> Contrôle total de la qualité d'impression</li>
        </ul>
        
        <h3>3. 🏢 Canon PRINT - Fiabilité professionnelle</h3>
        <ul>
          <li>📊 <strong>Documents office :</strong> Excel, Word, PowerPoint natifs</li>
          <li>🔒 <strong>Sécurité renforcée :</strong> Impression sécurisée avec code PIN</li>
          <li>📱 <strong>Multi-appareils :</strong> Gérez plusieurs imprimantes</li>
        </ul>
        
        <h2>🇲🇬 Configuration optimale pour Madagascar</h2>
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4>📶 <strong>Connexion Wi-Fi recommandée :</strong></h4>
          <ul>
            <li>🏠 <strong>Routeur :</strong> Placez votre imprimante près du routeur Wi-Fi</li>
            <li>📡 <strong>Signal :</strong> Assurez-vous d'avoir au moins 3 barres de signal</li>
            <li>🔐 <strong>Sécurité :</strong> Utilisez WPA2 ou WPA3 pour protéger votre réseau</li>
            <li>⚡ <strong>Bande passante :</strong> Réservez une bande pour l'impression si possible</li>
          </ul>
        </div>
        
        <h2>🛠️ Guide de configuration étape par étape</h2>
        
        <h3>📋 Étape 1 : Préparation de l'imprimante</h3>
        <ol>
          <li>🔌 <strong>Allumez</strong> votre imprimante et assurez-vous qu'elle est connectée au Wi-Fi</li>
          <li>🖨️ <strong>Imprimez une page de test</strong> pour vérifier le bon fonctionnement</li>
          <li>📱 <strong>Notez le nom du réseau Wi-Fi</strong> affiché sur l'écran de l'imprimante</li>
        </ol>
        
        <h3>📱 Étape 2 : Installation de l'application</h3>
        <div style="background: #22c55e; color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <ol>
            <li>📲 <strong>Téléchargez l'application</strong> correspondant à votre marque d'imprimante</li>
            <li>🔍 <strong>Recherche automatique :</strong> Laissez l'app détecter votre imprimante</li>
            <li>✅ <strong>Connexion :</strong> Suivez les instructions à l'écran</li>
            <li>🎯 <strong>Test d'impression :</strong> Imprimez une photo depuis votre galerie</li>
          </ol>
        </div>
        
        <h2>💡 Astuces d'experts pour optimiser vos impressions mobiles</h2>
        <ul>
          <li>🔋 <strong>Économie de batterie :</strong> Fermez l'app après utilisation</li>
          <li>📶 <strong>Connexion stable :</strong> Évitez les impressions pendant les orages (fréquents à Madagascar !)</li>
          <li>💾 <strong>Sauvegarde :</strong> Activez la sauvegarde cloud de vos documents importants</li>
          <li>🎨 <strong>Qualité photo :</strong> Utilisez le mode "Photo" pour vos souvenirs de famille</li>
        </ul>
        
        <div style="background: #f59e0b; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <p><strong>🛒 Prêt à vous lancer dans l'impression mobile ?</strong></p>
          <p>📞 <strong>033 71 063 34</strong> | Configuration gratuite à domicile !</p>
        </div>
      `
    },
    "5": {
      id: 5,
      title: "Comparatif 2025 : Meilleures Imprimantes par Budget",
      excerpt: "De 300 000 à 2 000 000 MGA, trouvez l'imprimante parfaite selon votre budget avec notre guide détaillé.",
      date: "20 Décembre 2024",
      author: "Équipe Tsena",
      category: "Comparatif",
      readTime: "8 min",
      content: `
        <h2>💰 Guide complet par tranches de budget</h2>
        <p>Choisir la <strong>meilleure imprimante selon votre budget</strong> à Madagascar n'a jamais été aussi simple ! 🎯 Découvrez nos recommandations d'experts pour chaque gamme de prix.</p>
        
        <h2>🥉 Budget Étudiant : 300 000 - 500 000 MGA</h2>
        <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h3>🏆 Notre choix : HP DeskJet 2320</h3>
          <p><strong>Prix :</strong> 385 000 MGA | <strong>Note :</strong> ⭐⭐⭐⭐ (4/5)</p>
          <ul>
            <li>✅ <strong>Parfait pour :</strong> Étudiants, usage domestique léger</li>
            <li>📄 <strong>Volume mensuel :</strong> Jusqu'à 100 pages</li>
            <li>💡 <strong>Points forts :</strong> Compact, fiable, cartouches abordables</li>
            <li>⚠️ <strong>Limites :</strong> Pas de Wi-Fi, impression couleur basique</li>
          </ul>
          
          <h4>🥈 Alternative : Canon PIXMA E410</h4>
          <p><strong>Prix :</strong> 420 000 MGA | Excellente qualité photo pour les projets étudiants</p>
        </div>
        
        <h2>🥈 Budget Familial : 500 000 - 800 000 MGA</h2>
        <div style="background: #f0fff4; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h3>🏆 Notre choix : Epson L3250 EcoTank</h3>
          <p><strong>Prix :</strong> 675 000 MGA | <strong>Note :</strong> ⭐⭐⭐⭐⭐ (5/5)</p>
          <ul>
            <li>🎯 <strong>Révolutionnaire :</strong> Réservoirs d'encre rechargeables</li>
            <li>💰 <strong>Économies :</strong> Jusqu'à 70% sur les coûts d'impression</li>
            <li>📱 <strong>Connectivité :</strong> Wi-Fi + application mobile</li>
            <li>🖨️ <strong>Volume :</strong> Jusqu'à 1000 pages/mois sans problème</li>
            <li>🎨 <strong>Qualité photo :</strong> Excellente pour vos souvenirs familiaux</li>
          </ul>
          
          <div style="background: #22c55e; color: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <p><strong>💡 Pourquoi c'est LE choix 2025 :</strong></p>
            <p>Retour sur investissement en 6 mois seulement ! Les familles malgaches économisent en moyenne <strong>450 000 MGA par an</strong> avec cette technologie.</p>
          </div>
          
          <h4>🥈 Alternative : HP Smart Tank 515</h4>
          <p><strong>Prix :</strong> 720 000 MGA | Concurrent sérieux avec interface tactile</p>
        </div>
        
        <h2>🥇 Budget Professionnel : 800 000 - 1 200 000 MGA</h2>
        <div style="background: #fef7e3; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h3>🏆 Notre choix : Canon MAXIFY GX6020</h3>
          <p><strong>Prix :</strong> 1 050 000 MGA | <strong>Note :</strong> ⭐⭐⭐⭐⭐ (5/5)</p>
          <ul>
            <li>⚡ <strong>Vitesse :</strong> 24 pages/minute - Productivité maximale</li>
            <li>📊 <strong>Documents pro :</strong> Qualité laser pour vos présentations</li>
            <li>🔄 <strong>Recto-verso auto :</strong> Économies de papier garanties</li>
            <li>📱 <strong>Cloud ready :</strong> Impression directe depuis Google Drive</li>
            <li>💼 <strong>Volume :</strong> Jusqu'à 3000 pages/mois</li>
          </ul>
          
          <h4>📈 Calculatrice ROI pour entreprises :</h4>
          <div style="background: #1e40af; color: white; padding: 15px; border-radius: 8px;">
            <ul>
              <li>💼 <strong>PME (500 pages/mois) :</strong> Économie de 280 000 MGA/an</li>
              <li>🏢 <strong>Bureau (1000 pages/mois) :</strong> Économie de 520 000 MGA/an</li>
            </ul>
          </div>
        </div>
        
        <h2>👑 Budget Premium : 1 200 000 - 2 000 000 MGA</h2>
        <div style="background: linear-gradient(135deg, #fbbf24, #f59e0b); color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h3>🏆 Notre choix : Epson EcoTank L15160 A3+</h3>
          <p><strong>Prix :</strong> 1 750 000 MGA | <strong>Note :</strong> ⭐⭐⭐⭐⭐ (5/5)</p>
          <ul>
            <li>📐 <strong>Format A3+ :</strong> Affiches et plans techniques</li>
            <li>🖨️ <strong>5 couleurs :</strong> Qualité photo professionnelle</li>
            <li>📠 <strong>Multifonctions :</strong> Impression, scan, copie, fax</li>
            <li>🌐 <strong>Ethernet + Wi-Fi :</strong> Intégration réseau complète</li>
            <li>⚡ <strong>Vitesse :</strong> 25 pages/minute en A4</li>
          </ul>
          
          <p><strong>💎 Parfait pour :</strong> Architectes, graphistes, imprimeries, bureaux d'études</p>
        </div>
        
        <h2>📊 Tableau comparatif synthétique</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #e5e7eb;">
              <th style="padding: 10px; border: 1px solid #d1d5db;">Budget</th>
              <th style="padding: 10px; border: 1px solid #d1d5db;">Modèle</th>
              <th style="padding: 10px; border: 1px solid #d1d5db;">Prix</th>
              <th style="padding: 10px; border: 1px solid #d1d5db;">Usage</th>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #d1d5db;">💚 Étudiant</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">HP DeskJet 2320</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">385 000 MGA</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">100 pages/mois</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #d1d5db;">💙 Familial</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">Epson L3250</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">675 000 MGA</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">1000 pages/mois</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #d1d5db;">💛 Pro</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">Canon MAXIFY</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">1 050 000 MGA</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">3000 pages/mois</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #d1d5db;">🧡 Premium</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">Epson L15160</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">1 750 000 MGA</td>
              <td style="padding: 10px; border: 1px solid #d1d5db;">5000+ pages/mois</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #dc2626; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <p><strong>🎁 OFFRE SPÉCIALE JANVIER 2025</strong></p>
          <p>📞 <strong>Appelez maintenant : 033 71 063 34</strong></p>
          <p>💰 <strong>Financement 3x sans frais disponible !</strong></p>
        </div>
      `
    },
    "6": {
      id: 6,
      title: "Résolution des Problèmes Courants d'Impression", 
      excerpt: "Bourrages papier, impression pâle, problèmes Wi-Fi... Solutions rapides aux problèmes les plus fréquents.",
      date: "15 Décembre 2024",
      author: "Service Technique",
      category: "Dépannage",
      readTime: "5 min",
      content: `
        <h2>🛠️ SOS Imprimante : Guide de dépannage express</h2>
        <p>Votre imprimante fait des caprices ? 😤 Pas de panique ! Nos techniciens experts vous livrent leurs <strong>secrets de dépannage</strong> pour résoudre 95% des problèmes en quelques minutes ! ⚡</p>
        
        <h2>📄 Problème #1 : Bourrage papier (Le plus fréquent !)</h2>
        <div style="background: #fef2f2; padding: 20px; border-left: 4px solid #dc2626; margin: 20px 0;">
          <h3>🚨 Symptômes :</h3>
          <ul>
            <li>❌ Message "Bourrage papier" sur l'écran</li>
            <li>📄 Papier coincé visible ou non</li>
            <li>🔊 Bruits de grincement</li>
          </ul>
        </div>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h3>✅ Solution étape par étape :</h3>
          <ol>
            <li>⚡ <strong>Éteignez</strong> complètement l'imprimante</li>
            <li>🔌 <strong>Débranchez</strong> le câble d'alimentation (sécurité !)</li>
            <li>👀 <strong>Ouvrez tous les capots</strong> et localisez le papier coincé</li>
            <li>👐 <strong>Tirez doucement</strong> dans le sens de sortie du papier</li>
            <li>🔍 <strong>Vérifiez</strong> qu'aucun morceau ne reste coincé</li>
            <li>🔌 <strong>Rebranchez</strong> et rallumez</li>
          </ol>
          
          <div style="background: #22c55e; color: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <p><strong>💡 Astuce pro :</strong> Si le papier se déchire, utilisez une pince à épiler pour retirer les petits morceaux !</p>
          </div>
        </div>
        
        <h2>🎨 Problème #2 : Impression pâle ou striée</h2>
        <div style="background: #fef7e3; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h3>🔍 Diagnostic rapide :</h3>
          <ul>
            <li>📊 <strong>Vérifiez le niveau d'encre :</strong> Souvent la cause principale !</li>
            <li>🧹 <strong>Nettoyage des têtes :</strong> Via le menu imprimante</li>
            <li>⚙️ <strong>Alignement :</strong> Lancez la procédure d'alignement</li>
          </ul>
          
          <h4>🛠️ Procédure de nettoyage avancé :</h4>
          <ol>
            <li>💻 <strong>Accédez aux paramètres</strong> imprimante sur votre PC</li>
            <li>🔧 <strong>Sélectionnez "Maintenance"</strong></li>
            <li>🧹 <strong>Lancez "Nettoyage des têtes"</strong></li>
            <li>📄 <strong>Imprimez une page de test</strong></li>
            <li>🔁 <strong>Répétez si nécessaire</strong> (max 3 fois)</li>
          </ol>
        </div>
        
        <h2>📶 Problème #3 : Connexion Wi-Fi instable</h2>
        <p>Un fléau à Madagascar avec les coupures internet fréquentes ! 📡</p>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h3>🔧 Solutions par ordre de priorité :</h3>
          
          <h4>1. 🔄 Reset réseau imprimante :</h4>
          <ul>
            <li>⚙️ <strong>Menu imprimante</strong> → Paramètres réseau</li>
            <li>🔄 <strong>Restaurer les paramètres</strong> par défaut</li>
            <li>🔗 <strong>Reconnectez</strong> au Wi-Fi avec le mot de passe</li>
          </ul>
          
          <h4>2. 📡 Optimisation du signal :</h4>
          <ul>
            <li>📍 <strong>Rapprochez l'imprimante</strong> de votre box internet</li>
            <li>🚫 <strong>Éliminez les obstacles</strong> (murs, métaux)</li>
            <li>📱 <strong>Vérifiez que votre téléphone</strong> capte bien le Wi-Fi au même endroit</li>
          </ul>
          
          <h4>3. 🔌 Solution temporaire :</h4>
          <div style="background: #22c55e; color: white; padding: 15px; border-radius: 8px;">
            <p><strong>💡 Utilisez un câble USB</strong> en attendant ! Connexion 100% fiable et rapide. 🚀</p>
          </div>
        </div>
        
        <h2>🖨️ Problème #4 : L'imprimante ne répond plus</h2>
        <div style="background: #fef2f2; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h3>⚡ Redémarrage complet (Reset hard) :</h3>
          <ol>
            <li>🔌 <strong>Débranchez</strong> l'alimentation pendant 30 secondes</li>
            <li>💻 <strong>Redémarrez votre ordinateur</strong> également</li>
            <li>🔌 <strong>Rebranchez l'imprimante</strong> et attendez l'initialisation</li>
            <li>💻 <strong>Testez depuis votre PC</strong></li>
          </ol>
          
          <div style="background: #dc2626; color: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <p><strong>⚠️ Si le problème persiste :</strong> Il peut s'agir d'un problème matériel nécessitant l'intervention d'un technicien.</p>
          </div>
        </div>
        
        <h2>💧 Problème #5 : Traces et bavures sur les impressions</h2>
        <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h3>🧹 Nettoyage des rouleaux :</h3>
          <ul>
            <li>🧽 <strong>Utilisez un coton-tige</strong> légèrement humide</li>
            <li>🔄 <strong>Nettoyez délicatement</strong> les rouleaux d'entraînement</li>
            <li>⏰ <strong>Laissez sécher</strong> 10 minutes avant de réutiliser</li>
          </ul>
          
          <h4>📄 Vérification du papier :</h4>
          <ul>
            <li>☔ <strong>Papier humide :</strong> Fréquent pendant la saison des pluies à Madagascar</li>
            <li>📦 <strong>Stockage :</strong> Conservez le papier dans un endroit sec</li>
            <li>✅ <strong>Qualité :</strong> Utilisez du papier de marque reconnue</li>
          </ul>
        </div>
        
        <h2>🚨 Quand faire appel au service technique ?</h2>
        <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <p><strong>📞 Contactez immédiatement nos experts si :</strong></p>
          <ul>
            <li>🔥 <strong>Odeur de brûlé</strong> ou surchauffe anormale</li>
            <li>⚡ <strong>Courts-circuits</strong> ou problèmes électriques</li>
            <li>🔊 <strong>Bruits métalliques</strong> inquiétants</li>
            <li>🚫 <strong>Aucune de ces solutions</strong> n'a fonctionné</li>
            <li>💻 <strong>Messages d'erreur</strong> persistants non résolus</li>
          </ul>
          
          <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin: 10px 0; text-align: center;">
            <p><strong>🛠️ Service technique Tsena Imprimante</strong></p>
            <p>📞 <strong>033 71 063 34</strong></p>
            <p>⚡ <strong>Intervention rapide - Devis gratuit</strong></p>
            <p>🏠 <strong>Dépannage à domicile dans tout Antananarivo</strong></p>
          </div>
        </div>
      `
    }
  };

  const article = articles[id as keyof typeof articles];

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Article non trouvé</h1>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au blog
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Lien copié dans le presse-papier !");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Navigation */}
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/blog')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au blog
            </Button>
          </div>

          {/* Article Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getCategoryColor(article.category)}>
                  {article.category}
                </Badge>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>
              <CardTitle className="text-3xl text-primary mb-4">
                {article.title}
              </CardTitle>
              <p className="text-lg text-muted-foreground mb-4">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {article.date}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {article.author}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.readTime} de lecture
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Article Content */}
          <Card>
            <CardContent className="pt-6">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="mt-8 bg-gradient-elegant text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-80" />
                <h3 className="text-xl font-semibold mb-2">
                  Besoin de conseils personnalisés ?
                </h3>
                <p className="mb-6 opacity-90">
                  Nos experts sont là pour vous aider à choisir la meilleure imprimante selon vos besoins.
                </p>
                <Button 
                  onClick={() => window.location.href = "tel:+261337106334"}
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  <User className="h-4 w-4 mr-2" />
                  Contactez nos experts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetail;