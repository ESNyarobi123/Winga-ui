"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import { jobService } from "@/services/job.service";
import { jobResponseToListItem } from "@/lib/format";
import type { JobListItem } from "@/types";
import type { JobResponseBackend } from "@/types";

export default function JobDetailPage() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const [job, setJob] = useState<JobResponseBackend | null>(null);
  const [listItem, setListItem] = useState<JobListItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    jobService
      .getJobById(id)
      .then((j) => {
        if (j) {
          setJob(j);
          setListItem(jobResponseToListItem(j));
        } else {
          setListItem(null);
          setJob(null);
        }
      })
      .catch(() => {
        setListItem(null);
        setJob(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container py-8 max-w-3xl">
        <Skeleton className="h-9 w-48 rounded-lg mb-4" />
        <Skeleton className="h-4 w-full rounded-lg mb-4" />
        <Skeleton className="h-4 w-32 rounded-lg mb-4" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    );
  }

  if (!listItem && !job) {
    return (
      <div className="container py-8 max-w-3xl">
        <Card className="border border-default-200" shadow="sm">
          <CardBody className="py-12 text-center">
            <p className="text-default-500 mb-4">Job not found.</p>
            <Button as={Link} href="/find-jobs" color="primary" variant="flat">
              Back to jobs
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const title = listItem?.title ?? job?.title ?? "";
  const description = listItem?.description ?? job?.description ?? "";
  const budget = listItem?.budget ?? (job ? `TZS ${Number(job.budget).toLocaleString()}` : "");
  const clientName = listItem?.clientName ?? job?.client?.fullName ?? "Client";
  const category = listItem?.category ?? job?.category ?? "";
  const tags = listItem?.tags ?? job?.tags ?? [];

  return (
    <div className="container py-8 max-w-3xl">
      <Button as={Link} href="/find-jobs" variant="light" color="primary" size="sm" className="mb-6 -ml-2">
        ← Back to jobs
      </Button>
      <Card className="border border-default-200" shadow="sm">
        <CardBody className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-default-500 text-sm mb-2">{clientName}</p>
          <p className="font-semibold text-primary mb-4">{budget}</p>
          <p className="whitespace-pre-wrap text-[15px] text-foreground leading-relaxed mb-6">{description}</p>
          {(category || tags.length > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <Chip size="sm" color="primary" variant="flat">{category}</Chip>
              )}
              {tags.map((tag) => (
                <Chip key={tag} size="sm" variant="bordered">{tag}</Chip>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
