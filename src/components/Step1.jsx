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

  // LocalStorage 등 외부 데이터가 최초에 동적으로 로드될 때 1회만 폼 값 동기화
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

  // contentValue가 변경될 때만 부모에 업데이트 알림
  useEffect(() => {
    if (typeof onUpdate === 'function') {
      onUpdate({ content: contentValue });
    }
  }, [contentValue]); // onUpdate는 부모에서 useCallback처리가 안 되어있을 수 있으므로 제거하거나 값만 추적

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
    <div className="max-w-2xl mx-auto space-y-3">
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-3">
        {/* 상단 메인 카드 */}
        <div className="bg-white rounded-lg border border-gray-200 border-t-8 border-t-purple-600 p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-6 tracking-tight">
            NO-TE 8월 키워드 &lt;온도&gt; 투고하기
          </h1>

          <div className="text-sm sm:text-base text-gray-800 leading-relaxed space-y-3">
            <div>
              <b>NO-TE(Nowon-Text): 노원의 이야기를 기록하다</b><br />
              노원에서 활동하는 이들의 이야기를 모아 카드뉴스와 Zine을 제작합니다.
            </div>

            <div>
              📍 2026년 8월 키워드 : &lt;온도&gt;<br />
              '온도'에 대한 여러분만의 글을 써 주세요.{' '}
              <a href="#" title="에디터가 드리는 힌트!" className="text-blue-600 underline">
                예시
              </a>
            </div>

            <div>
              <strong>로컬 매거진 특성상, 노원과 관련된</strong> 이야기를 우선 선정하고 있습니다.
            </div>

            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>모집 기간: 8월 1일(토) ~ 8월 31일(월)</li>
              <li>활동 범위가 노원이라면, 누구나 참여 가능</li>
              <li>선정작은 카드뉴스 및 Zine에 수록</li>
              <li>분량: 최소 500자, 최대 1,000자</li>
            </ul>

            <div className="space-y-2 pt-2">
              <p>※ 지면 사정상 일부 작품이 미선정되거나 원문이 수정될 수 있습니다.</p>
              <p>※ 비영리 무가지 특성상 원고료가 지급되지 않는 점 양해 부탁드립니다.</p>
            </div>
          </div>
        </div>

        {/* 입력 카드 영역 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 shadow-sm space-y-3">
          <label htmlFor="content-input" className="block text-base font-normal text-gray-900">
            '온도' 에 대한 글을 써주세요. <span className="text-red-500">*</span>
          </label>
          <div className="text-xs sm:text-sm text-gray-700 font-medium">
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
            rows={8}
            placeholder="글을 자유롭게 작성해 주세요."
            className="w-full p-3 text-sm sm:text-base text-gray-800 bg-white border border-gray-300 rounded focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors resize-y"
          />

          <div className="flex justify-between items-center text-xs sm:text-sm pt-1">
            <div>
              <ErrorMessage message={errors.content?.message} />
            </div>
            <div className={`font-normal ${!isValidLength ? 'text-gray-400' : 'text-purple-600'}`}>
              {charCount} / 1000자 (최소 500자)
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end items-center pt-2">
          <button
            type="submit"
            disabled={!isValidLength}
            className={`px-6 py-2.5 rounded font-medium text-sm transition-colors ${
              isValidLength
                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm cursor-pointer'
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