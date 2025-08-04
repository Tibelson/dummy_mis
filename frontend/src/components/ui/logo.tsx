import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 80, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src="/university-of-ghana-seeklogo.png"
        alt="University of Ghana Logo"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
    </div>
  );
} 