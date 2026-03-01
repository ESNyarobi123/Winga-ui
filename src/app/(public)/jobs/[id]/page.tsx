import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

/** Redirect /jobs/[id] → /find-jobs/[id] */
export default async function JobDetailRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/find-jobs/${id}`);
}
