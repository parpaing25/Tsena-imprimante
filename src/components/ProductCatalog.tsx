import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "./ProductCard";
import { products } from "@/data/products";
import { toast } from "sonner";

/**
 * Catalogue. Refonte mobile du 07/09/2026.
 *
 * Avant : la section faisait 10 944 px sur un téléphone (13 écrans). Trois
 * causes, mesurées : des cartes de 548 px, une seule colonne, et un bloc
 * « Nos Bestsellers » qui répétait trois produits déjà présents plus bas
 * (1 644 px de doublon). La carte de filtres dépliée en ajoutait 400.
 *
 * Après : deux colonnes, cartes de ~250 px, plus de doublon, une barre de
 * filtres d'une ligne avec des puces de type, et huit produits affichés
 * d'emblée — le reste au clic. À partir de `sm:` la grille reprend sa
 * densité d'origine.
 */
const TYPES: { valeur: string; libelle: string }[] = [
  { valeur: "all", libelle: "Toutes" },
  { valeur: "tank", libelle: "Réservoir" },
  { valeur: "inkjet", libelle: "Jet d'encre" },
  { valeur: "laser", libelle: "Laser" },
];

const PREMIER_LOT = 8;

const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [hasWifi, setHasWifi] = useState<boolean | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [toutAfficher, setToutAfficher] = useState(false);

  const brands = Array.from(new Set(products.map((p) => p.brand)));

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const recherche = searchTerm.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(recherche) ||
        product.brand.toLowerCase().includes(recherche) ||
        product.model.toLowerCase().includes(recherche) ||
        product.features.some((f) => f.toLowerCase().includes(recherche));

      const matchesType = selectedType === "all" || product.type === selectedType;
      const matchesBrand = selectedBrand === "all" || product.brand === selectedBrand;
      const matchesWifi = hasWifi === null || product.hasWifi === hasWifi;

      let matchesPrice = true;
      if (priceRange !== "all") {
        const price = product.priceMin;
        if (priceRange === "low") matchesPrice = price < 500000;
        else if (priceRange === "medium") matchesPrice = price >= 500000 && price < 1000000;
        else if (priceRange === "high") matchesPrice = price >= 1000000;
      }

      return matchesSearch && matchesType && matchesBrand && matchesPrice && matchesWifi;
    });
  }, [searchTerm, selectedType, selectedBrand, priceRange, hasWifi]);

  // Un changement de filtre ramène à la première page de résultats
  useEffect(() => {
    setToutAfficher(false);
  }, [searchTerm, selectedType, selectedBrand, priceRange, hasWifi]);

  const visibleProducts = toutAfficher ? filteredProducts : filteredProducts.slice(0, PREMIER_LOT);
  const reste = filteredProducts.length - visibleProducts.length;

  const filtresActifs =
    (selectedType !== "all" ? 1 : 0) +
    (selectedBrand !== "all" ? 1 : 0) +
    (priceRange !== "all" ? 1 : 0) +
    (hasWifi !== null ? 1 : 0);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedBrand("all");
    setPriceRange("all");
    setHasWifi(null);
  };

  const handleRequestQuote = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    // Sur telephone la section devis est repliee : on la deplie avant d'y aller.
    window.dispatchEvent(new CustomEvent("tsena:devis"));
    window.requestAnimationFrame(() =>
      document.getElementById("devis")?.scrollIntoView({ behavior: "smooth" })
    );
    toast.success(`Devis demandé pour ${product.name}`, {
      description: "Vous pouvez maintenant remplir le formulaire ci-dessous.",
    });
  };

  return (
    <section id="catalogue" className="scroll-mt-16 bg-gradient-subtle py-6 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xl font-extrabold tracking-tight text-primary sm:text-4xl">
            Nos imprimantes
          </h2>
          <span className="whitespace-nowrap text-xs text-muted-foreground sm:text-base">
            {products.length} modèles
          </span>
        </div>
        <p className="mt-1 text-[12.5px] text-muted-foreground sm:mt-3 sm:text-lg">
          Canon, HP et Epson, neuves sous carton. Prix TTC en ariary, livraison province,
          installation gratuite à Tana.
        </p>

        {/* Barre de recherche + filtres : une ligne de 44 px */}
        <div className="mt-3 flex gap-2 sm:mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Modèle, marque…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 pl-9"
              aria-label="Rechercher une imprimante"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="h-11 shrink-0 px-3"
            aria-expanded={showFilters}
            aria-label={showFilters ? "Masquer les filtres" : "Afficher les filtres"}
          >
            <SlidersHorizontal className="h-4 w-4 sm:mr-2" aria-hidden="true" />
            <span className="hidden sm:inline">Filtres</span>
            {filtresActifs > 0 && (
              <span className="ml-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                {filtresActifs}
              </span>
            )}
          </Button>
        </div>

        {/* Puces de type : le filtre que tout le monde utilise, sans ouvrir un panneau */}
        <div className="-mx-4 mt-2.5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {TYPES.map((t) => (
            <button
              key={t.valeur}
              type="button"
              onClick={() => setSelectedType(t.valeur)}
              aria-pressed={selectedType === t.valeur}
              className={`shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                selectedType === t.valeur
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground hover:border-primary"
              }`}
            >
              {t.libelle}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setHasWifi(hasWifi === true ? null : true)}
            aria-pressed={hasWifi === true}
            className={`shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors ${
              hasWifi === true
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground hover:border-primary"
            }`}
          >
            Wi-Fi
          </button>
        </div>

        {/* Filtres détaillés, repliés par défaut */}
        {showFilters && (
          <div className="mt-3 grid grid-cols-1 gap-2 rounded-xl border border-border bg-card p-3 sm:grid-cols-3 sm:gap-4 sm:p-4">
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="h-11" aria-label="Filtrer par marque">
                <SelectValue placeholder="Marque" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les marques</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="h-11" aria-label="Filtrer par gamme de prix">
                <SelectValue placeholder="Prix" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les prix</SelectItem>
                <SelectItem value="low">Moins de 500 000 Ar</SelectItem>
                <SelectItem value="medium">500 000 à 1 000 000 Ar</SelectItem>
                <SelectItem value="high">Plus de 1 000 000 Ar</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={clearFilters} variant="outline" className="h-11 w-full">
              <X className="mr-2 h-4 w-4" aria-hidden="true" />
              Effacer les filtres
            </Button>
          </div>
        )}

        {/* Grille : 2 colonnes sur téléphone */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:mt-6 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} onRequestQuote={handleRequestQuote} />
              ))}
            </div>

            {reste > 0 && (
              <Button
                variant="outline"
                onClick={() => setToutAfficher(true)}
                className="mt-4 h-12 w-full border-primary text-[14.5px] font-bold text-primary"
              >
                Voir les {reste} autres modèles
              </Button>
            )}
          </>
        ) : (
          <div className="py-10 text-center">
            <h3 className="text-lg font-semibold">Aucune imprimante ne correspond</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Essayez un autre mot, ou appelez-nous : nous avons aussi des modèles qui ne sont pas
              encore sur le site.
            </p>
            <Button onClick={clearFilters} variant="outline" className="mt-4">
              Effacer les filtres
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;
