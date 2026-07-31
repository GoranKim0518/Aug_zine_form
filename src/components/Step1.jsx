import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import ErrorMessage from './ErrorMessage.jsx';
import {
  trackFieldFocus,
  trackFieldBlur,
  trackStep1Complete,
  trackValidationError,
} from '../lib/analytics.js';

export default function Step1({ onNext, onUpdate, defaultValues }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content: defaultValues?.content || '',
    },
    mode: 'onChange',
  });

  const isInitialized = useRef(false);
  useEffect(() => {
    if (!isInitialized.current && defaultValues?.content) {
      reset({ content: defaultValues.content });
      // 🔥 [4번 문제 해결] 복원된 데이터의 유효성 검사 상태를 1회 동기화 (재렌더링 연산 과부하 0%)
      trigger('content');
      isInitialized.current = true;
    }
  }, [defaultValues?.content, reset, trigger]);

  const contentValue = watch('content') || '';
  const charCount = contentValue.length;
  const isValidLength = charCount >= 500 && charCount <= 1000;

  useEffect(() => {
    if (typeof onUpdate !== 'function') return;

    const subscription = watch((value) => {
      onUpdate(value);
    });

    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  const onSubmit = (data) => {
    if (isValidLength) {
      trackStep1Complete(charCount);
      onNext(data);
    }
  };

  const onError = (formErrors) => {
    Object.keys(formErrors).forEach((fieldName) => {
      trackValidationError(fieldName, formErrors[fieldName]?.message, 1);
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8 sm:space-y-10">
        <div className="space-y-6">
          <div className="border-b border-gray-200/80 pb-5">
            <h1 className="text-4xl sm:text-4xl font-bold tracking-tight text-gray-900 leading-snug">
              NO-TE 8월 키워드 &lt;온도&gt; 투고하기
            </h1>
          </div>

          <div className="text-base sm:text-base text-gray-800 leading-relaxed space-y-4">
            <div className="space-y-1">
              <b className="block text-gray-900 font-bold text-base sm:text-lg">
                NO-TE(Nowon-Text): 노원의 이야기를 기록하다
              </b>
              <p className="text-gray-700">
                노원에서 활동하는 이들의 이야기를 모아 카드뉴스와 Zine을 제작합니다.
              </p>
            </div>

            <div className="pt-1">
              <span className="font-semibold text-gray-900">📍 2026년 8월 키워드 : &lt;온도&gt;</span>
              <p className="pt-0.5 text-gray-700">
                '온도'에 대한 여러분만의 글을 써 주세요.{' '}
                <a
                  href="#"
                  title="에디터가 드리는 힌트!"
                  className="text-purple-600 font-semibold underline underline-offset-4 hover:text-purple-800 transition-colors"
                >
                  예시
                </a>
              </p>
            </div>

            <div className="pt-1 text-gray-900">
              <strong>로컬 매거진 특성상, 노원과 관련된</strong> 이야기를 우선 선정하고 있습니다.
            </div>

            <div className="p-4 sm:p-5 bg-gray-50/90 border border-gray-200/70 rounded-2xl space-y-3 mt-2">
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                <li>모집 기간: 8월 1일(토) ~ 8월 31일(월)</li>
                <li>활동 범위가 노원이라면 누구나 참여 가능</li>
                <li>선정작은 카드뉴스 및 Zine에 수록</li>
                <li>분량: 최소 500자, 최대 1,000자</li>
              </ul>

              <div className="space-y-1 pt-2.5 border-t border-gray-200/80 text-xs sm:text-sm text-gray-500 leading-normal">
                <p>※ 지면 사정상 일부 작품이 미선정되거나 원문이 수정될 수 있습니다.</p>
                <p>※ 비영리 무가지 특성상 원고료가 지급되지 않는 점 양해 부탁드립니다.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <label htmlFor="content-input" className="block text-base sm:text-lg font-bold text-gray-900">
            '온도' 에 대한 글을 써주세요. <span className="text-red-500">*</span>
          </label>
          <div className="text-sm text-gray-600">
            제목과 함께 최소 500자, 최대 1,000자로 부탁드립니다.
          </div>

          <textarea
            id="content-input"
            {...register('content', {
              required: '글을 입력해 주세요.',
              minLength: { value: 500, message: '최소 500자 이상 입력해 주세요.' },
              maxLength: { value: 1000, message: '최대 1000자까지 입력 가능합니다.' },
            })}
            onFocus={() => trackFieldFocus('content', 1)}
            onBlur={() => trackFieldBlur('content', 1, charCount > 0)}
            rows={9}
            placeholder="글을 자유롭게 작성해 주세요."
            className="w-full p-4 text-base text-gray-800 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all resize-y shadow-xs"
          />

          <div className="flex justify-between items-center text-sm pt-0.5">
            <div>
              <ErrorMessage message={errors.content?.message} />
            </div>
            <div className={`font-mono text-xs sm:text-sm ${!isValidLength ? 'text-gray-400' : 'text-purple-600 font-bold'}`}>
              {charCount} / 1000자 (최소 500자)
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={!isValidLength}
            className={`w-full sm:w-auto sm:ml-auto flex items-center justify-center min-h-12.5 px-8 py-3 rounded-xl font-bold text-base transition-all duration-200 ${
              isValidLength
                ? 'bg-purple-600 text-white hover:bg-purple-700 active:scale-[0.99] shadow-md cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            다음
          </button>
        </div>
      </form>
    </div>
  );
}