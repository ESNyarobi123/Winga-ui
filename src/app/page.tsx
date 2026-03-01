import { redirect } from "next/navigation";

/** App inaanzia hapa: redirect "/" → "/find-jobs" */
export default function Home() {
  redirect("/find-jobs");
}
