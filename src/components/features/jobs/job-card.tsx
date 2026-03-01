import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type JobCardProps = {
  title: string;
  description: string;
  category: string;
  budget: string;
  id?: string;
};

export function JobCard({ title, description, category, budget, id }: JobCardProps) {
  const href = id ? `/find-jobs/${id}` : "#";
  return (
    <Card className="bg-white hover:border-primary/40 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6">
        <div className="flex-1 min-w-0">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-lg">{title}</CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">{category}</span>
              <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {budget}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-1">
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </CardContent>
        </div>
        <Link href={href} className="shrink-0">
          <Button className="w-full sm:w-auto bg-primary text-white hover:bg-primary-dark">
            Apply
          </Button>
        </Link>
      </div>
    </Card>
  );
}
