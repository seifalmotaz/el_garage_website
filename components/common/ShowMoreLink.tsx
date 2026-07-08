import Image from "next/image";
import Link from "next/link";

const ShowMoreLink = ({
  href,
  text = "عرض المزيد",
}: {
  href: string;
  text?: string;
}) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-1 text-gray-500 hover:text-primary-500 cursor-pointer transition-colors group"
    >
      <span className="text-sm font-medium underline leading-[150%]">
        {text}
      </span>
      <Image
        src="/assets/arrow_left_gray.svg"
        alt="show more"
        width={16}
        height={16}
        className="size-4.5 group-hover:translate-x-[-4px] translate-y-0.5 transition-transform"
      />
    </Link>
  );
};

export default ShowMoreLink;
