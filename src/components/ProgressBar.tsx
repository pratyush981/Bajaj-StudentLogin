
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentSection: number;
  totalSections: number;
}

const ProgressBar = ({ currentSection, totalSections }: ProgressBarProps) => {
  const percentage = ((currentSection + 1) / totalSections) * 100;

  return (
    <div className="w-full space-y-2 mb-6">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Section {currentSection + 1} of {totalSections}</span>
        <span>{Math.round(percentage)}% Complete</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

export default ProgressBar;
