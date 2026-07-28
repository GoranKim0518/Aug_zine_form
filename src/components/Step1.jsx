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
      isInitialized.current = true;
    }
  }, [defaultValues?.content, reset]);

  const contentValue = watch('content') || '';
  const charCount = contentValue.length;
  const isValidLength = charCount >= 500 && charCount <= 1000;

  useEffect(() => {
    if (typeof onUpdate === 'function') {
      onUpdate({ content: contentValue });
    }
  }, [contentValue]);

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
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5">
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4 sm:space-y-5">
        {/* 상단 메인 카드 (모바일 p-5, PC sm:p-8) */}
        <div className="bg-white rounded-xl border border-gray-200 border-t-8 border-t-purple-600 p-5 sm:p-8 shadow-xs">
          <h1 className="text-xl sm:text-3xl font-semibold text-gray-900 mb-5 sm:mb-6 tracking-tight leading-snug">
            NO-TE 8월 키워드 &lt;온도&gt; 투고하기
          </h1>

          <div className="text-base sm:text-base text-gray-800 leading-relaxed space-y-4">
            <div>
              <b>NO-TE(Nowon-Text): 노원의 이야기를 기록하다</b><br />
              노원에서 활동하는 이들의 이야기를 모아 카드뉴스와 Zine을 제작합니다.
            </div>

            <div>
              📍 2026년 8월 키워드 : &lt;온도&gt;<br />
              '온도'에 대한 여러분만의 글을 써 주세요.{' '}
              <a href="#" title="에디터가 드리는 힌트!" className="text-blue-600 underline underline-offset-2">
                예시
              </a>
            </div>

            <div>
              <strong>로컬 매거진 특성상, 노원과 관련된</strong> 이야기를 우선 선정하고 있습니다.
            </div>

            <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base text-gray-800 leading-relaxed pl-0.5">
              <li>모집 기간: 8월 1일(토) ~ 8월 31일(월)</li>
              <li>활동 범위가 노원이라면, 누구나 참여 가능</li>
              <li>선정작은 카드뉴스 및 Zine에 수록</li>
              <li>분량: 최소 500자, 최대 1,000자</li>
            </ul>

            <div className="space-y-1 pt-2 border-t border-gray-100 text-xs sm:text-sm text-gray-600 leading-relaxed">
              <p>※ 지면 사정상 일부 작품이 미선정되거나 원문이 수정될 수 있습니다.</p>
              <p>※ 비영리 무가지 특성상 원고료가 지급되지 않는 점 양해 부탁드립니다.</p>
            </div>
          </div>
        </div>

        {/* 입력 카드 영역 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-8 shadow-xs space-y-3">
          <label htmlFor="content-input" className="block text-base sm:text-lg font-semibold text-gray-900">
            '온도' 에 대한 글을 써주세요. <span className="text-red-500">*</span>
          </label>
          <div className="text-sm text-gray-600 font-medium">
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
            className="w-full p-3.5 text-base text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-colors resize-y"
          />

          <div className="flex justify-between items-center text-xs sm:text-sm pt-1">
            <div>
              <ErrorMessage message={errors.content?.message} />
            </div>
            <div className={`font-mono ${!isValidLength ? 'text-gray-400' : 'text-purple-600 font-semibold'}`}>
              {charCount} / 1000자 (최소 500자)
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end items-center pt-1">
          <button
            type="submit"
            disabled={!isValidLength}
            className={`w-full sm:w-auto min-h-12 px-8 py-3 rounded-lg font-semibold text-base transition-colors ${
              isValidLength
                ? 'bg-purple-600 text-white hover:bg-purple-700 active:scale-[0.99] shadow-xs cursor-pointer'
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