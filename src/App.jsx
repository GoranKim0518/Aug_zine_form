import { useState, useEffect } from 'react';
import Step1 from './components/Step1.jsx';
import Step2 from './components/Step2.jsx';
import Step3 from './components/Step3.jsx';
import { supabase } from './lib/supabase.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import {
  trackPageOpen,
  trackStep1View,
  trackStep2View,
  trackSubmitSuccess,
} from './lib/analytics.js';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  
  // LocalStorage 커스텀 훅 적용 (새로고침 시 데이터 유지)
  const [formData, setFormData, removeFormData] = useLocalStorage('submit_form_data', {});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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

  // 3. 작성 중 페이지 이탈(새로고침/탭 닫기) 방지 경고
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (Object.keys(formData).length > 0 && currentStep <= TOTAL_STEPS) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, currentStep]);

  const handleUpdateForm = (stepData) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const handleNextStep = (stepData) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setSubmitError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitForm = async (step2Data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    if (!navigator.onLine) {
      setSubmitError('인터넷 연결이 끊겨 있습니다. 네트워크 상태를 확인해 주세요.');
      setIsSubmitting(false);
      return;
    }

    const finalData = { ...formData, ...step2Data };

    let formattedPhone = finalData.phone || '';
    const rawDigits = formattedPhone.replace(/[^0-9]/g, '');
    if (rawDigits.length === 11 && rawDigits.startsWith('010')) {
      formattedPhone = `${rawDigits.slice(0, 3)}-${rawDigits.slice(3, 7)}-${rawDigits.slice(7)}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const { error } = await supabase
        .from('submissions')
        .insert([
          {
            content: finalData.content,
            pen_name_intro: finalData.bio || '',
            phone: formattedPhone,
            instagram_id: finalData.instagram || null,
            referral_source: finalData.source || '',
            referral_source_other: finalData.source === '기타' ? finalData.sourceCustom : null,
          },
        ])
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) throw error;

      trackSubmitSuccess(finalData.source || '');
      removeFormData();
      setCurrentStep(3);
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('제출 실패:', err);

      if (err.name === 'AbortError') {
        setSubmitError('요청 시간이 초과되었습니다. 네트워크 상태를 확인 후 다시 시도해 주세요.');
      } else {
        setSubmitError('제출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    removeFormData();
    setSubmitError(null);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-purple-50 text-gray-900 antialiased selection:bg-purple-200">
      <main className="w-full max-w-2xl mx-auto px-3.5 sm:px-4 py-6 sm:py-8 pb-12">
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
            submitError={submitError}
          />
        )}

        {currentStep === 3 && <Step3 onReset={handleReset} />}
      </main>
    </div>
  );
}