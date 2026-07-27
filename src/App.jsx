import { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';
import ProgressBar from './components/ProgressBar.jsx';
import Step1 from './components/Step1.jsx';
import Step2 from './components/Step2.jsx';
import Step3 from './components/Step3.jsx';
import { supabase } from './lib/supabase.js';

// .env 환경변수 가져오기
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID;

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const TOTAL_STEPS = 2;

  // 1. GA4 초기화 및 기본 페이지뷰 전송
  useEffect(() => {
    if (GA_MEASUREMENT_ID) {
      ReactGA.initialize(GA_MEASUREMENT_ID);
      ReactGA.send({ 
        hitType: "pageview", 
        page: window.location.pathname + window.location.search 
      });
    }
  }, []);

  // 2. 단계 이동 시 GA4 퍼널 이벤트 전송
  useEffect(() => {
    if (GA_MEASUREMENT_ID) {
      ReactGA.event({
        category: 'Form_Funnel',
        action: `view_step_${currentStep}`,
        label: `Step ${currentStep} View`,
      });
    }
  }, [currentStep]);

  // 자식 컴포넌트(Step1, Step2)에서 입력값을 실시간 업데이트할 때 사용
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

    try {
      // 💡 보내주신 스크린샷 DB 컬럼명에 맞춰 1:1 매핑
      const { error } = await supabase.from('submissions').insert([
        {
          content: finalData.content,
          pen_name_intro: finalData.bio || finalData.pen_name_intro || '', // 필명 및 소개
          phone: finalData.phone,
          instagram_id: finalData.instagram || finalData.instagram_id || null,
          referral_source: finalData.source || finalData.referral_source || '',
          referral_source_other:
            (finalData.source === '기타' || finalData.referral_source === '기타')
              ? finalData.sourceCustom || finalData.referral_source_other
              : null,
        },
      ]);

      if (error) throw error;

      // 제출 성공 이벤트 전송
      if (GA_MEASUREMENT_ID) {
        ReactGA.event({
          category: 'Form_Funnel',
          action: 'submit_success',
        });
      }

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