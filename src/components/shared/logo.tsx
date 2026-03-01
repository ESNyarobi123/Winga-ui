import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <img
        src="/icon.png"
        alt="Winga"
        className="h-12 md:h-14 w-auto object-contain transition-transform group-hover:scale-105"
      />
    </Link>
  );
}
