export default function ProgressBar({ currentStep, totalSteps }) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="sticky top-0 left-0 w-full z-50 bg-purple-50/95 backdrop-blur-md pt-[env(safe-area-inset-top)] pb-2 shadow-xs">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between mb-1.5 text-xs sm:text-sm font-semibold text-purple-950">
          <span>단계 {currentStep} / {totalSteps}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-purple-200/60 h-2 rounded-full overflow-hidden">
          <div
            className="bg-purple-700 h-full transition-all duration-300 ease-out rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}