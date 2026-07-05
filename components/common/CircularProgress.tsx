import { cn } from "../../lib/utils";

type CircularProgressProps = {
  step: number;
  size?: number;
  pathWidth?: number;
};

const CircularProgress = ({
  step,
  size = 122,
  pathWidth = 7,
}: CircularProgressProps) => {
  return (
    <div>
      <div
        className="rounded-full flex justify-center items-center duration-1000 transition-colors"
        style={{
          background: `conic-gradient(#002EC1 ${step * 20}%, #D1D5DB 0deg)`,
          width: size,
          height: size,
        }}
      >
        <div
          className={cn("absolute rounded-full ", "bg-white")}
          style={{
            width: `calc(${size}px - ${pathWidth}px)`,
            height: `calc(${size}px - ${pathWidth}px)`,
          }}
        />

        <span className="relative m-0 text-center flex flex-col gap-1">
          <span className="text-sm">
            <span
              className={step === 5 ? "text-primary-500" : "text-[#9CA3AF]"}
            >
              {step}
            </span>
            <span className="text-primary-500">/5</span>
          </span>
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
