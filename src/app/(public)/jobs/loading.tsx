export default function JobsLoading() {
  return (
    <div className="container py-8 animate-pulse">
      <div className="h-9 w-48 bg-muted rounded mb-6" />
      <div className="h-10 w-full bg-muted rounded mb-6" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted rounded" />
        ))}
      </div>
    </div>
  );
}
