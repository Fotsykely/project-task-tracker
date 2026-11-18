import { useId, type ReactNode } from "react";

type Tone = "primary" | "success";

const FILL_CLASSES: Record<Tone, string> = {
  primary: "bg-primary",
  success: "bg-status-done-fg",
};

type ProgressBarProps = {
  value: number;
  max: number;
  tone?: Tone;
  className?: string;
  // The visible text above the bar (for example "2 / 5 tâches terminées"). It also names the bar
  // for screen readers, so the same information is not announced twice.
  children: ReactNode;
};

// A generic progress bar: it only knows a value out of a maximum, nothing about what is counted.
export function ProgressBar({ value, max, tone = "primary", className, children }: ProgressBarProps) {
  const labelId = useId();
  const percent = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className={className}>
      <p id={labelId}>{children}</p>
      <div
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border"
      >
        <div className={`h-full transition-all ${FILL_CLASSES[tone]}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
