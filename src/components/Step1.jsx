// src/components/Step1.jsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { trackFieldFocus, trackFieldBlur } from '../lib/analytics.js';

export default function Step1({ onNext, onUpdate, defaultValues }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      content: defaultValues.content || '',
    },
    mode: 'onChange',
  });

  const contentValue = watch('content') || '';
  const charCount = contentValue.length;
  const isValidLength = charCount >= 500 && charCount <= 1000;

  // 입력할 때마다 부모(App.jsx) state 및 localStorage에 실시간 자동 저장
  useEffect(() => {
    onUpdate({ content: contentValue });
  }, [contentValue, onUpdate]);

  const onSubmit = (data) => {
    if (isValidLength) {
      onNext(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 border-t-8 border-t-purple-600 p-5 sm:p-6 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">투고 원고 작성</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          매거진에 수록될 원고 내용을 작성해 주세요.<br />
          분량은 <strong className="text-purple-700">500자 이상 1000자 이하</strong>로 작성해 주셔야 다음 단계로 이동이 가능합니다.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 shadow-sm space-y-3">
        <label className="block text-base font-semibold text-gray-900">
          작품 <span className="text-red-500">*</span>
        </label>
        
        <textarea
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
            {errors.content && (
              <span className="text-red-500 font-medium">{errors.content.message}</span>
            )}
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