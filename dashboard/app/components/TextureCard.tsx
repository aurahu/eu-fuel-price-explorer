import Image from "next/image";

type TextureCardProps = {
  children: React.ReactNode;
  overlayColor?: string;
  overlayOpacity?: number;
  className?: string;
};

export default function TextureCard({
  children,
  overlayColor = "#000000",
  overlayOpacity = 0.5,
  className="",
}: TextureCardProps) {
  return (
    <div className={`relative overflow-hidden h-100 p-6 ${className}`}>
      <Image
        src={"/texture-1.avif"}
        alt=""
        fill
        className="object-cover"
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundColor: overlayColor,
          opacity: overlayOpacity,
        }}
      />

      <div className=" w-full flex flex-col gap-9 justify-between relative z-10">
        {children}
      </div>
    </div>
  );
}