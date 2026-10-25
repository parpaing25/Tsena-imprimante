import { useLayoutEffect, useRef } from "react";
import { apparaitre } from "@/lib/apparition";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Bloc qui apparaît quand on l'atteint en défilant (MOUVEMENT.md, recette B).
 *
 * Le contenu est VISIBLE par défaut : sans JavaScript, dans le HTML pré-rendu, sous
 * « réduire les animations », sans IntersectionObserver, et s'il est déjà dans l'écran au
 * montage. Seul un bloc encore sous l'écran attend, puis entre en fondu montant de 0,5 s ;
 * plusieurs blocs qui entrent ensemble se suivent de 60 ms (src/lib/apparition.ts).
 *
 * Avant le 25/10/2026, il partait de `opacity-0` posé par React : la section Contact entière
 * était figée invisible dans dist/index.html.
 */
const AnimatedSection = ({ children, className = "" }: AnimatedSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    return apparaitre(ref.current);
  }, []);

  return (
    <div ref={ref} className={className || undefined}>
      {children}
    </div>
  );
};

export default AnimatedSection;
