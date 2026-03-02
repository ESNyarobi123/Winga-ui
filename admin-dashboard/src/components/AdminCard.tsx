interface AdminCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
}

export default function AdminCard({ title, subtitle, children, headerAction, className = "" }: AdminCardProps) {
  return (
    <div className={`border border-winga-border bg-white shadow-sm rounded-2xl overflow-hidden ${className}`}>
      {(title || headerAction) && (
        <div className="px-6 pt-6 pb-3 border-b border-winga-border/50 bg-gray-50/50 flex flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            {subtitle && <p className="text-sm text-winga-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {headerAction}
        </div>
      )}
      <div className="px-6 pb-6">{children}</div>
    </div>
  );
}
