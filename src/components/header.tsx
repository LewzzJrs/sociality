import Image from "next/image";
import Link from "next/link";
import { UserMenu } from "@/components/user-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-900 bg-background">
      <div className="mx-auto flex h-16 max-w-300 items-center justify-between px-4 md:h-20 xl:px-0">
        <Link href="/feed" className="flex items-center gap-2.75">
          <Image
            src="/logo.svg"
            alt=""
            width={30}
            height={30}
            loading="eager"
          />
          <span className="text-display-xs font-bold">Sociality</span>
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
