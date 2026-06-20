import Image from "next/image";

type PrototypeCropProps = {
  alt: string;
  className?: string;
  src: string;
};

export default function PrototypeCrop({ alt, className = "", src }: PrototypeCropProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}
