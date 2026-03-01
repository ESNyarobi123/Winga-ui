"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";

export function JobFilter() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Input
        placeholder="Search jobs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-sm"
      />
      {/* Category filter dropdown can be added here; use debouncedQuery for API */}
    </div>
  );
}
