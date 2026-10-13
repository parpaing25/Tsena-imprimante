import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Play, Phone, MessageCircle, Video } from "lucide-react";
import Header from "@/components/Header";
import EnTetePage from "@/components/EnTetePage";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { TUTOS } from "@/data/tutos";
import { CONTACT, lienTel, lienWhatsApp } from "@/config/contact";
import { evenement } from "@/lib/mesure";

/**
 * Tutos vidéo — nos propres reels (voix malgache, sous-titres incrustés), fabriqués pour la
 * page Facebook en septembre 2026.
 *
 * Audit du 13/10/2026 : le site ne portait aucune vidéo, alors que trente étaient déjà
 * produites à côté. Les fichiers sont servis depuis /videos (o2switch), jamais depuis
 * YouTube : pas de traceur tiers, et la page reste utile sans JavaScript (l'affiche et le
 * texte s'affichent, la vidéo se charge au clic).
 */
const SITE = CONTACT.site;

const Tutos = () => {
  const [ouverte, setOuverte] = useState<string | null>(null);

  const jsonld = {
    "@context": "https://schema.org",
    "@graph": TUTOS.map((t) => ({
      "@type": "VideoObject",
      name: t.titre,
      description: t.etapes.join(" "),
      thumbnailUrl: `${SITE}/videos/${t.slug}.jpg`,
      contentUrl: `${SITE}/videos/${t.slug}.mp4`,
      uploadDate: "2026-09-19",
      duration: `PT${t.duree}S`,
      inLanguage: "mg",
      publisher: { "@type": "Organization", name: CONTACT.nom, url: SITE },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Tutos vidéo imprimante en malgache | Tsena Imprimante</title>
        <meta
          name="description"
          content="Dix tutos vidéo en malgache : bourrage papier, nettoyage des têtes, test des buses, impression depuis le téléphone, coupures de courant. Par Tsena Imprimante, Antananarivo."
        />
        <link rel="canonical" href={`${SITE}/tutos`} />
        <meta property="og:title" content="Tutos vidéo imprimante en malgache | Tsena Imprimante" />
        <meta property="og:image" content={`${SITE}/videos/${TUTOS[0]?.slug}.jpg`} />
        <script type="application/ld+json">{JSON.stringify(jsonld)}</script>
      </Helmet>

      <Header />
      <EnTetePage
        titre="Tutos vidéo"
        sousTitre="Les gestes qui font durer votre imprimante, expliqués en malgache, en moins de 30 secondes."
        icone={<Video className="h-12 w-12" aria-hidden="true" />}
        fil={[{ libelle: "Tutos vidéo" }]}
      />

      <main className="container mx-auto px-4 py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TUTOS.map((tuto) => (
            <article key={tuto.slug} className="overflow-hidden rounded-xl border border-border bg-card shadow-soft">
              <div className="relative aspect-[9/16] bg-muted">
                {ouverte === tuto.slug ? (
                  <video
                    className="h-full w-full"
                    controls
                    autoPlay
                    playsInline
                    preload="none"
                    poster={`/videos/${tuto.slug}.jpg`}
                    aria-label={tuto.titre}
                  >
                    <source src={`/videos/${tuto.slug}.mp4`} type="video/mp4" />
                    Votre navigateur ne lit pas les vidéos. <a href={`/videos/${tuto.slug}.mp4`}>Télécharger le tuto</a>.
                  </video>
                ) : (
                  <button
                    type="button"
                    className="group relative h-full w-full"
                    onClick={() => { setOuverte(tuto.slug); evenement("tuto_lu", { t: tuto.slug }); }}
                    aria-label={`Lire la vidéo : ${tuto.titre}`}
                  >
                    <img
                      src={`/videos/${tuto.slug}.jpg`}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                      width={540}
                      height={960}
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/10">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg">
                        <Play className="h-7 w-7 translate-x-0.5" aria-hidden="true" />
                      </span>
                    </span>
                    <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                      {tuto.duree} s
                    </span>
                  </button>
                )}
              </div>

              <div className="p-5">
                <h2 className="text-lg font-bold text-foreground">{tuto.titre}</h2>
                <p className="mt-1 text-sm italic text-accent" lang="mg">{tuto.mg}</p>
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  {tuto.etapes.map((e) => (
                    <li key={e} className="flex gap-2"><span className="text-primary">•</span>{e}</li>
                  ))}
                </ul>
                <Link to={tuto.lien} className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-primary hover:underline">
                  En savoir plus
                </Link>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-14 rounded-xl border border-border bg-card p-6 text-center">
          <h2 className="text-xl font-bold text-primary">Une panne qui résiste ?</h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Dites-nous le modèle et ce que vous voyez : on vous répond, et on prend la machine en
            réparation si besoin.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button asChild className="btn-call min-h-[44px]">
              <a href={lienTel()} onClick={() => evenement("clic_appel")}>
                <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                {CONTACT.telephonePrincipal.affichage}
              </a>
            </Button>
            <Button asChild variant="outline" className="min-h-[44px]">
              <a
                href={lienWhatsApp("Bonjour, j'ai regardé vos tutos et j'ai une question sur mon imprimante.")}
                target="_blank"
                rel="noopener"
                onClick={() => evenement("clic_whatsapp")}
              >
                <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                WhatsApp
              </a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Tutos;
