"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { GalleryImage } from "@/lib/content";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, ExpandIcon } from "@/components/icons";

/**
 * Diaporama des images d'un projet : flèches, clavier (← →), miniatures,
 * glissement au doigt et affichage plein écran.
 * Les images remplissent le cadre (object-cover) : aucune bande blanche.
 */
export function ProjectGallery({
  images,
  title,
  ratio = "1736/986",
}: {
  images: GalleryImage[];
  title: string;
  /** Rapport largeur/hauteur des images, pour qu'elles remplissent le cadre sans être coupées. */
  ratio?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const count = images.length;
  const [w, h] = ratio.split("/").map(Number);
  const portrait = h > w;

  const goTo = useCallback(
    (target: number, behavior: ScrollBehavior = "smooth") => {
      const track = trackRef.current;
      if (!track || count === 0) return;
      const next = (target + count) % count;
      track.scrollTo({ left: next * track.clientWidth, behavior });
    },
    [count],
  );

  // Index courant d'après la position de défilement (flèches, miniatures ou glissement).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setIndex(Math.round(track.scrollLeft / Math.max(1, track.clientWidth))));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Garde la miniature active visible.
  useEffect(() => {
    const thumb = thumbsRef.current?.querySelector<HTMLElement>(`[data-thumb="${index}"]`);
    thumb?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [index]);

  // Plein écran : disponible selon le navigateur (pas sur iPhone).
  useEffect(() => {
    const supported = Boolean(document.fullscreenEnabled);
    const onChange = () => setFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", onChange);
    // Lecture d'une capacité du navigateur, connue uniquement côté client.
    queueMicrotask(() => setCanFullscreen(supported));
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Après un changement de taille (plein écran), on se recale sur l'image courante.
  useEffect(() => {
    goTo(index, "instant");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- uniquement au changement de mode
  }, [fullscreen]);

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else rootRef.current?.requestFullscreen().catch(() => {});
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
  }

  if (count === 0) return null;

  const overlayButton =
    "glass glass-press flex size-10 items-center justify-center rounded-full text-foreground sm:size-11";

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="diaporama"
      aria-label={`Images du projet ${title}`}
      onKeyDown={onKeyDown}
      className={fullscreen ? "flex h-full flex-col bg-black p-3 sm:p-6" : ""}
    >
      <div
        style={fullscreen ? undefined : { aspectRatio: ratio }}
        className={`relative overflow-hidden ${
          fullscreen
            ? "min-h-0 flex-1 rounded-xl"
            : `rounded-[22px] bg-background/40 ${portrait ? "mx-auto w-full max-w-[440px]" : ""}`
        }`}
      >
        <div
          ref={trackRef}
          className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, i) => (
            <figure
              key={image.src}
              role="group"
              aria-roledescription="diapositive"
              aria-label={`${i + 1} sur ${count}${image.caption ? ` : ${image.caption}` : ""}`}
              className="relative h-full w-full shrink-0 snap-center"
            >
              <Image
                src={image.src}
                alt={image.caption ? `${title} — ${image.caption}` : `${title} — image ${i + 1}`}
                fill
                priority={i === 0}
                sizes={fullscreen ? "100vw" : portrait ? "440px" : "(min-width: 768px) 752px, 100vw"}
                className={fullscreen ? "object-contain" : "object-cover"}
              />
            </figure>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Image précédente"
              className={`${overlayButton} absolute top-1/2 left-3 -translate-y-1/2`}
            >
              <ArrowLeftIcon className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Image suivante"
              className={`${overlayButton} absolute top-1/2 right-3 -translate-y-1/2`}
            >
              <ArrowRightIcon className="size-5" />
            </button>
          </>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className="glass rounded-full px-3 py-1.5 text-xs font-medium tabular-nums">
            {index + 1} / {count}
          </span>
          {canFullscreen && (
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={fullscreen ? "Quitter le plein écran" : "Afficher en plein écran"}
              title={fullscreen ? "Quitter le plein écran" : "Plein écran"}
              className="glass glass-press flex size-8 items-center justify-center rounded-full"
            >
              {fullscreen ? <CloseIcon className="size-4" /> : <ExpandIcon className="size-4" />}
            </button>
          )}
        </div>
      </div>

      <div className={`flex items-center gap-4 px-2 pt-3 ${portrait ? "justify-center" : "justify-between"}`}>
        <p aria-live="polite" className={`text-sm font-medium ${fullscreen ? "text-white" : ""}`}>
          {images[index]?.caption ?? `Image ${index + 1}`}
        </p>
      </div>

      {count > 1 && (
        <div
          ref={thumbsRef}
          className={`flex gap-2 overflow-x-auto px-2 pt-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            portrait ? "justify-center" : ""
          }`}
        >
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              data-thumb={i}
              onClick={() => goTo(i)}
              aria-label={`Afficher l'image ${i + 1}${image.caption ? ` : ${image.caption}` : ""}`}
              aria-current={i === index ? "true" : undefined}
              style={{ aspectRatio: ratio }}
              className={`relative shrink-0 overflow-hidden rounded-xl transition ${portrait ? "w-14 sm:w-16" : "w-24 sm:w-28"} ${
                i === index
                  ? "opacity-100 ring-2 ring-accent ring-offset-2 ring-offset-transparent"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={image.src} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
