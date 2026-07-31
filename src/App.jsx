import { useState, useEffect, useCallback } from 'react';
import Step1 from './components/Step1.jsx';
import Step2 from './components/Step2.jsx';
import Step3 from './components/Step3.jsx';
import { supabase } from './lib/supabase.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import ProgressBar from './components/ProgressBar.jsx';
import {
  trackPageOpen,
  trackStep1View,
  trackStep2View,
  trackSubmitSuccess,
} from './lib/analytics.js';
import ascii from './ascii.txt?raw';

if (ascii) {
  console.log(
    `%c${ascii}`,
    'font-family: Menlo, Monaco, monospace; font-size: 9.5px; line-height: 1.0; letter-spacing: -0.5px;'
  );
}

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData, removeFormData] = useLocalStorage('submit_form_data', {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const TOTAL_STEPS = 2;

  useEffect(() => {
    trackPageOpen();
  }, []);

  useEffect(() => {
    if (currentStep === 1) {
      trackStep1View();
    } else if (currentStep === 2) {
      trackStep2View();
    }
  }, [currentStep]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formData && Object.keys(formData).length > 0 && currentStep <= TOTAL_STEPS) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, currentStep]);

  const handleNextStep = useCallback((step1Data) => {
    setFormData((prev) => ({ ...prev, ...step1Data }));
    setCurrentStep(2);
  }, [setFormData]);

  const handlePrevStep = useCallback((step2Data) => {
    if (step2Data) {
      setFormData((prev) => ({ ...prev, ...step2Data }));
    }
    setSubmitError(null);
    setCurrentStep(1);
  }, [setFormData]);

  const handleSubmitForm = async (step2Data) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    if (!navigator.onLine) {
      setSubmitError('인터넷 연결이 끊겨 있습니다. 네트워크 상태를 확인해 주세요.');
      setIsSubmitting(false);
      return;
    }

    const finalData = { ...formData, ...step2Data };

    // 🔥 [전화번호 null 처리] 11자리 정상 번호가 아니면 null 전송
    let formattedPhone = finalData.phone || '';
    const rawDigits = formattedPhone.replace(/[^0-9]/g, '');
    if (rawDigits.length === 11 && rawDigits.startsWith('010')) {
      formattedPhone = `${rawDigits.slice(0, 3)}-${rawDigits.slice(3, 7)}-${rawDigits.slice(7)}`;
    } else {
      formattedPhone = null; // 선택 입력 미작성 시 DB에 NULL 저장
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
            phone: formattedPhone, // null 또는 정규화 번호
            instagram_id: finalData.instagram ? finalData.instagram : null, // null 처리
            referral_source: finalData.source || '',
            referral_source_other: finalData.source === '기타' ? finalData.sourceCustom : null,
          },
        ])
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) throw error;

      trackSubmitSuccess(finalData.source || '');
      
      // 🔥 [핵심 버그 수정] LocalStorage 삭제 + App React State 동시 초기화
      removeFormData();
      setFormData({});

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

  const handleReset = useCallback(() => {
    removeFormData();
    setFormData({});
    setSubmitError(null);
    setCurrentStep(1);
  }, [removeFormData, setFormData]);

  return (
    <main className="min-h-screen bg-white text-gray-900 antialiased selection:bg-purple-100">
      {currentStep <= TOTAL_STEPS && (
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      )}

      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-12 pb-16">
        {currentStep === 1 && (
          <Step1
            onNext={handleNextStep}
            defaultValues={formData}
          />
        )}

        {currentStep === 2 && (
          <Step2
            onNext={handleSubmitForm}
            onPrev={handlePrevStep}
            defaultValues={formData}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        )}

        {currentStep === 3 && <Step3 onReset={handleReset} />}
      </div>
    </main>
  );
}