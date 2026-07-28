import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ErrorMessage from './ErrorMessage.jsx';
import {
  trackFieldFocus,
  trackFieldBlur,
  trackValidationError,
} from '../lib/analytics.js';

export default function Step2({
  onNext,
  onPrev,
  onUpdate,
  defaultValues,
  isSubmitting,
  submitError,
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bio: defaultValues?.bio || '',
      phone: defaultValues?.phone || '',
      instagram: defaultValues?.instagram || '',
      source: defaultValues?.source || '',
      sourceCustom: defaultValues?.sourceCustom || '',
    },
    mode: 'onChange',
  });

  // LocalStorage 데이터 로드 시 폼 입력값 동기화
  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      reset({
        bio: defaultValues.bio || '',
        phone: defaultValues.phone || '',
        instagram: defaultValues.instagram || '',
        source: defaultValues.source || '',
        sourceCustom: defaultValues.sourceCustom || '',
      });
    }
  }, [defaultValues, reset]);

  const formValues = watch();
  const selectedSource = formValues.source;

  // 실시간 입력 내용 상위(App.jsx -> LocalStorage)로 전달
  useEffect(() => {
    if (typeof onUpdate === 'function') {
      onUpdate(formValues);
    }
  }, [formValues, onUpdate]);

  const onSubmit = (data) => {
    onNext(data);
  };

  const onError = (formErrors) => {
    Object.keys(formErrors).forEach((fieldName) => {
      trackValidationError(fieldName, formErrors[fieldName]?.message, 2);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
      {/* 안내 카드 */}
      <div className="bg-white rounded-lg border border-gray-200 border-t-8 border-t-purple-600 p-5 sm:p-6 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">신청자 정보 입력</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          원고 게재 및 리워드 발송을 위한 인적사항을 입력해 주세요.
        </p>
      </div>

      {/* 1. 필명 및 소개 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-3">
        <label htmlFor="bio-input" className="block text-base font-semibold text-gray-900">
          필명 및 한 줄 소개 <span className="text-red-500">*</span>
        </label>
        <input
          id="bio-input"
          type="text"
          {...register('bio', {
            required: '필명 및 한 줄 소개를 입력해 주세요.',
          })}
          onFocus={() => trackFieldFocus('bio', 2)}
          onBlur={(e) => trackFieldBlur('bio', 2, e.target.value.length > 0)}
          placeholder="예: 홍길동 / 일상의 기록을 좋아하는 에세이스트"
          className="w-full p-3 text-base text-gray-800 bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
        />
        <ErrorMessage message={errors.bio?.message} />
      </div>

      {/* 2. 전화번호 (모바일 키패드 UX 최적화: inputMode="numeric") */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-3">
        <label htmlFor="phone-input" className="block text-base font-semibold text-gray-900">
          전화번호 <span className="text-red-500">*</span>
        </label>
        <input
          id="phone-input"
          type="tel"
          inputMode="numeric"
          {...register('phone', {
            required: '전화번호를 입력해 주세요.',
            pattern: {
              value: /^010-?\d{4}-?\d{4}$/,
              message: '010으로 시작하는 올바른 휴대폰 번호 11자리를 입력해 주세요.',
            },
          })}
          onFocus={() => trackFieldFocus('phone', 2)}
          onBlur={(e) => trackFieldBlur('phone', 2, e.target.value.length > 0)}
          placeholder="010-1234-5678 또는 01012345678"
          className="w-full p-3 text-base text-gray-800 bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
        />
        <ErrorMessage message={errors.phone?.message} />
      </div>

      {/* 3. 인스타그램 계정 (자동 대문자 변환 방지: autoCapitalize="none") */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-3">
        <label htmlFor="instagram-input" className="block text-base font-semibold text-gray-900">
          인스타그램 계정 <span className="text-gray-400 font-normal">(선택)</span>
        </label>
        <input
          id="instagram-input"
          type="text"
          autoCapitalize="none"
          autoCorrect="off"
          {...register('instagram')}
          onFocus={() => trackFieldFocus('instagram', 2)}
          onBlur={(e) => trackFieldBlur('instagram', 2, e.target.value.length > 0)}
          placeholder="@username"
          className="w-full p-3 text-base text-gray-800 bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
        />
      </div>

      {/* 4. 유입 경로 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-3">
        <label className="block text-base font-semibold text-gray-900">
          유입 경로 <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          {['인스타그램', '지인 추천', '에브리타임', '기타'].map((option) => (
            <label key={option} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                value={option}
                {...register('source', { required: '유입 경로를 선택해 주세요.' })}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <span className="text-gray-700 text-sm">{option}</span>
            </label>
          ))}
        </div>
        <ErrorMessage message={errors.source?.message} />

        {/* 기타 선택 시 주관식 입력창 */}
        {selectedSource === '기타' && (
          <div className="pt-2">
            <input
              type="text"
              {...register('sourceCustom', {
                required: selectedSource === '기타' ? '기타 유입 경로를 입력해 주세요.' : false,
              })}
              placeholder="유입 경로를 직접 입력해 주세요."
              className="w-full p-3 text-base text-gray-800 bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
            />
            <ErrorMessage message={errors.sourceCustom?.message} />
          </div>
        )}
      </div>

      {/* 네트워크 / 제출 에러 안내 박스 */}
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium leading-relaxed">
          {submitError}
        </div>
      )}

      {/* 하단 버튼 영역 */}
      <div className="flex justify-between items-center pt-2 gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="px-5 py-3 rounded font-medium text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
        >
          이전 단계
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 sm:flex-none px-6 py-3 rounded font-medium text-sm bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-sm cursor-pointer disabled:bg-purple-300"
        >
          {isSubmitting ? '제출 중...' : '최종 제출하기'}
        </button>
      </div>
    </form>
  );
}