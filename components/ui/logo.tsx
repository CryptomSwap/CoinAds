import Link from "next/link";

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className = "", href = "/" }: LogoProps) {
  const logoElement = (
    <div className={`flex items-center ${className}`}>
      <span className="text-2xl font-bold">
        <span className="text-black dark:text-white">Coin</span>
        <span className="text-gradient-brand">Ads</span>
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}
