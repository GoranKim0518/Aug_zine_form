import { useState, useEffect } from 'react';
import ProgressBar from './components/ProgressBar.jsx';
import Step1 from './components/Step1.jsx';
import Step2 from './components/Step2.jsx';
import Step3 from './components/Step3.jsx';
import { supabase } from './lib/supabase.js';
import {
  trackPageOpen,
  trackStep1View,
  trackStep2View,
  trackSubmitSuccess,
} from './lib/analytics.js';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const TOTAL_STEPS = 2;

  // 1. 최초 접속 트래킹
  useEffect(() => {
    trackPageOpen();
  }, []);

  // 2. 단계 이동 시 GTM DataLayer 이벤트 전송
  useEffect(() => {
    if (currentStep === 1) {
      trackStep1View();
    } else if (currentStep === 2) {
      trackStep2View();
    }
  }, [currentStep]);

  const handleUpdateForm = (stepData) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const handleNextStep = (stepData) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitForm = async (step2Data) => {
    setIsSubmitting(true);
    const finalData = { ...formData, ...step2Data };

    // 전화번호 010-XXXX-XXXX 포맷 통일 (11자리)
    let formattedPhone = finalData.phone || '';
    const rawDigits = formattedPhone.replace(/[^0-9]/g, '');
    if (rawDigits.length === 11 && rawDigits.startsWith('010')) {
      formattedPhone = `${rawDigits.slice(0, 3)}-${rawDigits.slice(3, 7)}-${rawDigits.slice(7)}`;
    }

    try {
      const { error } = await supabase.from('submissions').insert([
        {
          content: finalData.content,
          pen_name_intro: finalData.bio || '',
          phone: formattedPhone,
          instagram_id: finalData.instagram || null,
          referral_source: finalData.source || '',
          referral_source_other: finalData.source === '기타' ? finalData.sourceCustom : null,
        },
      ]);

      if (error) throw error;

      // 최종 제출 성공 트래킹 (유입경로 함께 전송)
      trackSubmitSuccess(finalData.source || '');

      setCurrentStep(3);
    } catch (err) {
      console.error('제출 실패:', err);
      alert('제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({});
    setCurrentStep(1);
  };

  return (
    <main className="min-h-screen bg-purple-50 py-8 px-4 flex justify-center items-start">
      <div className="w-full max-w-xl space-y-4">
        {currentStep <= TOTAL_STEPS && (
          <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        )}

        {currentStep === 1 && (
          <Step1
            onNext={handleNextStep}
            onUpdate={handleUpdateForm}
            defaultValues={formData}
          />
        )}

        {currentStep === 2 && (
          <Step2
            onNext={handleSubmitForm}
            onPrev={handlePrevStep}
            onUpdate={handleUpdateForm}
            defaultValues={formData}
            isSubmitting={isSubmitting}
          />
        )}

        {currentStep === 3 && <Step3 onReset={handleReset} />}
      </div>
    </main>
  );
}