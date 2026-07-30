export default function ProgressBar({ currentStep, totalSteps }) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="sticky top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md pt-[env(safe-area-inset-top)]">
      <div className="w-full h-1 bg-gray-100">
        <div
          className="bg-purple-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}