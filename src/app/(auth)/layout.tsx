"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isFullWhiteLayout =
    pathname === "/what-are-you" ||
    pathname === "/registration-job-seeker" ||
    pathname === "/registration-employer";

  if (isFullWhiteLayout) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl mx-auto">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Pane - Brand Pattern */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden bg-[#eaf3ed] justify-center items-center">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 mix-blend-multiply"></div>
        <div className="absolute top-[-5%] right-[-15%] w-[600px] h-[600px] rounded-full bg-primary mix-blend-multiply"></div>
        <div className="absolute bottom-[-15%] left-[-20%] w-[700px] h-[700px] rounded-full bg-[#005c36] mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] rounded-full bg-primary/40 mix-blend-multiply"></div>
        <div className="z-10 flex items-center justify-center">
          <Link href="/">
            <img src="/winga_logo.png" alt="Winga" className="h-[60px] object-contain drop-shadow-md" />
          </Link>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:flex-1 bg-white">
        <div className="mx-auto w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
