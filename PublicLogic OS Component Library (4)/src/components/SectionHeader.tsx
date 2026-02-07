import { cn } from "@/app/components/ui/utils";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h2 className="text-balance text-2xl font-semibold tracking-tight text-slate-900">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-pretty text-sm leading-relaxed text-slate-700">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
