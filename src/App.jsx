import { useState } from 'react';
import ProgressBar from './components/ProgressBar.jsx';
import Step1 from './components/Step1.jsx';
import Step2 from './components/Step2.jsx';
import Step3 from './components/Step3.jsx';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const TOTAL_STEPS = 3;

  const handleNextStep = (stepData) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitAll = () => {
    console.log('최종 제출 데이터:', formData);
    alert('성공적으로 제출되었습니다!');
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {currentStep === 1 && (
          <Step1
            onNext={handleNextStep}
            defaultValues={formData}
          />
        )}

        {currentStep === 2 && (
          <Step2
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            defaultValues={formData}
          />
        )}

        {currentStep === 3 && (
          <Step3
            formData={formData}
            onPrev={handlePrevStep}
            onSubmit={handleSubmitAll}
          />
        )}
      </div>
    </main>
  );
}