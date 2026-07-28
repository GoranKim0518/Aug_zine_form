import { useEffect } from 'react';
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

  // LocalStorage 등 외부에서 defaultValues가 동적으로 로드될 때 폼 값 동기화
  useEffect(() => {
    if (defaultValues?.content) {
      reset({ content: defaultValues.content });
    }
  }, [defaultValues?.content, reset]);

  const contentValue = watch('content') || '';
  const charCount = contentValue.length;
  const isValidLength = charCount >= 500 && charCount <= 1000;

  useEffect(() => {
    if (typeof onUpdate === 'function') {
      onUpdate({ content: contentValue });
    }
  }, [contentValue, onUpdate]);

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
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 border-t-8 border-t-purple-600 p-5 sm:p-6 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">투고 원고 작성</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          매거진에 수록될 원고 내용을 작성해 주세요.<br />
          분량은 <strong className="text-purple-700">500자 이상 1000자 이하</strong>로 작성해 주셔야 다음 단계로 이동이 가능합니다.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 shadow-sm space-y-3">
        <label htmlFor="content-input" className="block text-base font-semibold text-gray-900">
          작품 <span className="text-red-500">*</span>
        </label>

        <textarea
          id="content-input"
          {...register('content', {
            required: '작품 내용을 입력해 주세요.',
            minLength: { value: 500, message: '최소 500자 이상 입력해 주세요.' },
            maxLength: { value: 1000, message: '최대 1000자까지 입력 가능합니다.' },
          })}
          onFocus={() => trackFieldFocus('content', 1)}
          onBlur={() => trackFieldBlur('content', 1, charCount > 0)}
          rows={8}
          placeholder="작품 내용을 자유롭게 작성해 주세요."
          className="w-full p-3 text-base text-gray-800 bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors resize-y"
        />

        <div className="flex justify-between items-center text-xs sm:text-sm">
          <div>
            <ErrorMessage message={errors.content?.message} />
          </div>
          <div className={`font-semibold ${!isValidLength ? 'text-gray-400' : 'text-purple-600'}`}>
            {charCount} / 1000자 (최소 500자)
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={!isValidLength}
          className={`w-full sm:w-auto px-6 py-3 sm:py-2 rounded font-medium text-base sm:text-sm transition-colors ${
            isValidLength
              ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          다음
        </button>
      </div>
    </form>
  );
}