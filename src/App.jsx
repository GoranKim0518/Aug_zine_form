// src/App.jsx
import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './components/ProgressBar.jsx';
import Step1 from './components/Step1.jsx';
import Step2 from './components/Step2.jsx';
import Step3 from './components/Step3.jsx';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import {
  trackPageOpen,
  trackSubmitSuccess,
  trackFieldFocus,
} from './lib/analytics.js';
import { captureUtmParams, getStoredUtmParams } from './lib/utm.js';
import { supabase } from './lib/supabase.js';

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
  const [submitError, setSubmitError] = useState(null);

  const [formData, setFormData, removeFormData] = useLocalStorage(
    'aug_zine_draft',
    INITIAL_FORM_DATA
  );

  const TOTAL_STEPS = 2;

  // 최초 접속 시 UTM 파라미터 캡처 및 page_open 수집
  useEffect(() => {
    captureUtmParams();
    trackPageOpen();
  }, []);

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

  const handleUpdateFormData = useCallback((stepData) => {
    setFormData((prev) => ({
      ...prev,
      ...stepData,
    }));
  }, [setFormData]);

  const handleNextStep = (step1Data) => {
    handleUpdateFormData(step1Data);
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmitAll = async (step2Data) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const mergedData = { ...formData, ...step2Data };
    const utmParams = getStoredUtmParams();

    const payload = {
      content: mergedData.content || '',
      pen_name_intro: mergedData.pen_name_intro || '',
      phone: mergedData.phone || null,
      instagram_id: mergedData.instagram_id || null,
      referral_source: mergedData.referral_source || '',
      referral_source_other: mergedData.referral_source === '기타' ? mergedData.referral_source_other : null,
      utm_source: utmParams.utm_source || null,
      utm_medium: utmParams.utm_medium || null,
      utm_campaign: utmParams.utm_campaign || null,
      utm_content: utmParams.utm_content || null,
      utm_term: utmParams.utm_term || null,
    };

    try {
      const { error } = await supabase.from('submissions').insert([payload]);

      if (error) throw error;

      // 최종 제출 성공 트래킹
      trackSubmitSuccess(payload.referral_source);

      removeFormData();
      setCurrentStep(3);
    } catch (error) {
      console.error('Supabase 제출 에러:', error);
      setSubmitError('원고 제출 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
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

        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg shadow-sm">
            {submitError}
          </div>
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

        {currentStep === 3 && <Step3 onReset={handleReset} />}
      </div>
    </main>
  );
}