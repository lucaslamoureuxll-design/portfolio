import Image from "next/image";

/** Image de couverture, ou dégradé généré à partir du titre si aucune image n'est fournie. */
export function ProjectCover({ title, cover, priority = false }: { title: string; cover?: string; priority?: boolean }) {
  if (cover) {
    return (
      <Image
        src={cover}
        alt=""
        fill
        priority={priority}
        sizes="(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw"
        unoptimized={cover.endsWith(".svg")}
        className="object-cover"
      />
    );
  }

  const hue = [...title].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
  return (
    <div
      aria-hidden="true"
      className="flex size-full items-center justify-center"
      style={{
        background: `radial-gradient(circle at 25% 20%, hsl(${hue} 85% 65% / 0.55), transparent 55%),
                     radial-gradient(circle at 80% 80%, hsl(${(hue + 60) % 360} 85% 60% / 0.45), transparent 50%)`,
      }}
    >
      <span className="text-4xl font-semibold tracking-tight text-foreground/80">
        {title
          .split(/\s+/)
          .slice(0, 2)
          .map((word) => word[0])
          .join("")
          .toUpperCase()}
      </span>
    </div>
  );
}
