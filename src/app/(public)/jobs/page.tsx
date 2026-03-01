import { redirect } from "next/navigation";

/** Redirect /jobs → /find-jobs */
export default function JobsRedirect() {
  redirect("/find-jobs");
}
