import { useState, useEffect } from 'react';
import ProgressBar from './components/ProgressBar.jsx';
import Step1 from './components/Step1.jsx';
import Step2 from './components/Step2.jsx';
import Step3 from './components/Step3.jsx';
import { trackFieldFocus } from './lib/analytics.js';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const TOTAL_STEPS = 2;

  // 모바일 탭 이탈 시 감지
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && currentStep <= TOTAL_STEPS) {
        trackFieldFocus(`tab_leave_step${currentStep}`, currentStep);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentStep]);

  const handleNextStep = (stepData) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // 최종 제출 처리 (중복 제출 방지 포함)
  const handleSubmitAll = async (step2Data) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const finalData = { ...formData, ...step2Data };

    try {
      // 추후 Supabase 연동 지점
      console.log('최종 제출 데이터:', finalData);
      
      // 모의 네트워크 지연 (1초)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setCurrentStep(3); // 제출 완료 화면으로 이동
    } catch (error) {
      console.error('제출 실패:', error);
      alert('제출 도중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({});
    setCurrentStep(1);
  };

  return (
    <main className="min-h-screen bg-purple-50/50 py-6 sm:py-8 px-4 flex justify-center items-start">
      <div className="w-full max-w-lg space-y-4">
        {currentStep <= TOTAL_STEPS && (
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        )}

        {currentStep === 1 && (
          <Step1 onNext={handleNextStep} defaultValues={formData} />
        )}

        {currentStep === 2 && (
          <Step2
            onNext={handleSubmitAll}
            onPrev={handlePrevStep}
            defaultValues={formData}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep === 3 && (
          <Step3 onReset={handleReset} />
        )}
      </div>
    </main>
  );
}