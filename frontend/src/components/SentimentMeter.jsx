

const SentimentMeter = ({ score, size = "sm" }) => {
  const radius = size === "lg" ? 60 : 40;
  const stroke = size === "lg" ? 8 : 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const svgSize = (radius + stroke) * 2;

  const color = score >= 80 ? "hsl(152, 60%, 42%)" : score >= 60 ? "hsl(38, 92%, 50%)" : "hsl(0, 72%, 56%)";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        <circle cx={radius + stroke} cy={radius + stroke} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
        <circle
          cx={radius + stroke} cy={radius + stroke} r={radius} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`font-bold text-card-foreground ${size === "lg" ? "text-2xl" : "text-lg"}`}>{score}%</span>
        <span className="text-[10px] text-muted-foreground">Sentiment</span>
      </div>
    </div>
  );
};

export default SentimentMeter;
