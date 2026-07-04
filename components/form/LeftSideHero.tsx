import Image from "next/image";

type Props = {
  text?: {
    line1?: string;
    line2?: string;
  };
  bottomSubText?: {
    line1?: string;
    line2?: string;
  };
};

const LeftSideHero = ({ text = {}, bottomSubText = {} }: Props) => {
  const { line1 = "انضم للجراج الآن و اكتشف", line2 = "سياراتك المفضلة" } =
    text;

  const {
    line1: subLine1 = "سجل مجانًا واحصل على إشعارات السيارات الجديدة",
    line2: subLine2 = "فحوصات فورية، وأفضل العروض اليومية",
  } = bottomSubText;

  return (
    <div className="sticky top-0 hidden md:block md:w-[45%] lg:w-[50%] 2xl:w-[55%] overflow-hidden">
      <Image
        src="/images/auth-hero.png"
        alt="hero"
        fill
        priority
        className="2xl:hidden object-cover"
      />
      <img
        src="/images/auth-hero.png"
        className="max-2xl:hidden absolute object-cover"
        alt="hero"
      />

      {/* Heading block (per-line highlight via box-decoration-break) */}
      <div className="absolute top-[80px] lg:top-[103px] right-0 left-0 flex justify-center px-6">
        <h1
          className="font-bold text-white text-[26px] lg:text-4xl xl:text-5xl leading-normal text-center"
          style={{
            boxDecorationBreak: "clone",
            WebkitBoxDecorationBreak: "clone",
          }}
        >
          <span className="relative">
            <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[30%] h-[39px] w-[calc(100%+36px)] bg-primary-800"></span>
            <span className="relative">{line1}</span>
          </span>
          <br />
          <span className="relative">
            <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-[10%] h-[39px] w-[calc(100%+36px)] bg-primary-800"></span>

            <span className="relative">{line2}</span>
          </span>
        </h1>
      </div>

      {/* Bottom subtext */}
      <div className="absolute bottom-[80px] lg:bottom-[100px] right-0 left-0 flex justify-center px-6">
        <p className="text-white text-xl lg:text-2xl xl:text-3xl leading-normal text-center max-w-[769px]">
          {subLine1} <br /> {subLine2}
        </p>
      </div>
    </div>
  );
};

export default LeftSideHero;
