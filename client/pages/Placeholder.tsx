import { LucideIcon } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function Placeholder({
  title,
  description,
  icon: Icon,
}: PlaceholderProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 rounded-xl border border-pos-border bg-white p-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-pos-green-soft">
        <Icon size={28} className="text-pos-primary" />
      </div>
      <h1 className="text-2xl font-extrabold text-pos-dark">{title}</h1>
      <p className="max-w-md text-sm text-pos-muted">{description}</p>
      <p className="max-w-md text-sm text-pos-subtle">
        This page hasn't been built yet. Keep chatting with Fusion to design
        and build out this section.
      </p>
    </div>
  );
}
