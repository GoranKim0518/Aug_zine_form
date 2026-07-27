// src/App.jsx
import { useState, useEffect } from 'react';
import ProgressBar from './components/ProgressBar.jsx';
import Step1 from './components/Step1.jsx';
import Step2 from './components/Step2.jsx';
import Step3 from './components/Step3.jsx';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { trackFieldFocus } from './lib/analytics.js';

// 기본 폼 스키마 정의
const INITIAL_FORM_DATA = {
  content: '',
  pen_name_intro: '',
  phone: '',
  instagram_id: '',
  referral_source: '',
  referral_source_other: '',
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // localStorage 훅 연결 (자동 저장 & 새로고침 시 자동 복원)
  const [formData, setFormData, removeFormData] = useLocalStorage(
    'aug_zine_draft',
    INITIAL_FORM_DATA
  );

  const TOTAL_STEPS = 2;

  // 모바일 탭 이탈 감지
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && currentStep <= TOTAL_STEPS) {
        trackFieldFocus(`tab_leave_step${currentStep}`, currentStep);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentStep]);

  // 각 Step에서 입력값이 변경될 때 실시간 데이터 업데이트
  const handleUpdateFormData = (stepData) => {
    setFormData((prev) => ({
      ...prev,
      ...stepData,
    }));
  };

  const handleNextStep = (step1Data) => {
    handleUpdateFormData(step1Data);
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  // 최종 제출 처리
  const handleSubmitAll = async (step2Data) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const finalData = { ...formData, ...step2Data };

    try {
      console.log('최종 제출 데이터:', finalData);
      
      // 모의 네트워크 제출 지연 (1초)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 제출 성공 시 localStorage 임시 저장 데이터 즉시 삭제
      removeFormData();
      
      setCurrentStep(3); // 완료 화면으로 이동
    } catch (error) {
      console.error('제출 실패:', error);
      alert('제출 도중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    removeFormData();
    setCurrentStep(1);
  };

  return (
    <main className="min-h-screen bg-purple-50/50 py-6 sm:py-8 px-4 flex justify-center items-start">
      <div className="w-full max-w-lg space-y-4">
        {currentStep <= TOTAL_STEPS && (
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        )}

        {currentStep === 1 && (
          <Step1
            onNext={handleNextStep}
            onUpdate={handleUpdateFormData}
            defaultValues={formData}
          />
        )}

        {currentStep === 2 && (
          <Step2
            onNext={handleSubmitAll}
            onPrev={handlePrevStep}
            onUpdate={handleUpdateFormData}
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