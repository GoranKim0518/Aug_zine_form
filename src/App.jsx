import { useState } from 'react';
import ProgressBar from './components/ProgressBar.jsx';
import Step1 from './components/Step1.jsx';
import Step2 from './components/Step2.jsx';
import Step3 from './components/Step3.jsx';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const TOTAL_STEPS = 2; // Step3는 완료 화면이므로 진행바는 2단계 기준

  const handleNextStep = (stepData) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleReset = () => {
    setFormData({});
    setCurrentStep(1);
  };

  return (
    <main className="min-h-screen bg-purple-50/50 py-8 px-4 flex justify-center items-start">
      <div className="w-full max-w-lg space-y-4">
        {/* 진행 상태 표시바 (Step 1, 2일 때만 표시) */}
        {currentStep <= TOTAL_STEPS && (
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        )}

        {/* 단계별 화면 전환 */}
        {currentStep === 1 && (
          <Step1 onNext={handleNextStep} defaultValues={formData} />
        )}

        {currentStep === 2 && (
          <Step2
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            defaultValues={formData}
          />
        )}

        {currentStep === 3 && (
          <Step3 onReset={handleReset} />
        )}
      </div>
    </main>
  );
}