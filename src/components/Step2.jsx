import { useEffect, useRef } from 'react';
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

  const isInitialized = useRef(false);
  useEffect(() => {
    if (!isInitialized.current && defaultValues && Object.keys(defaultValues).length > 0) {
      reset({
        bio: defaultValues.bio || '',
        phone: defaultValues.phone || '',
        instagram: defaultValues.instagram || '',
        source: defaultValues.source || '',
        sourceCustom: defaultValues.sourceCustom || '',
      });
      isInitialized.current = true;
    }
  }, [defaultValues, reset]);

  // UI 조건부 렌더링용 선택된 source 관찰
  const selectedSource = watch('source');
  const INPUT_LENGTH = 100;

  // 폼 입력값 변경 시 부모 컴포넌트에 안전하게 전달 (watch 구독 사용으로 재렌더링 방지)
  useEffect(() => {
    if (typeof onUpdate !== 'function') return;

    const subscription = watch((value) => {
      onUpdate(value);
    });

    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  const onSubmit = (data) => {
    // 제출 시 혹시 모를 공백이나 국가번호(+82)가 섞여있다면 순수 숫자로 정제해서 전달
    const cleanData = {
      ...data,
      phone: data.phone ? data.phone.replace(/^\+82\s?/, '0').replace(/[^0-9]/g, '') : '',
    };
    onNext(cleanData);
  };

  const onError = (formErrors) => {
    Object.keys(formErrors).forEach((fieldName) => {
      trackValidationError(fieldName, formErrors[fieldName]?.message, 2);
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6 sm:space-y-8">
        {/* 구글 폼 섹션 2 안내 카드 */}
        <div className="space-y-1 border-b border-gray-200/80 pb-4">
          <h1 className="text-base sm:text-lg text-gray-900 font-bold leading-relaxed">
            매거진과 인스타그램 카드뉴스 제작을 위한 정보 입력 페이지입니다.
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Zine·카드뉴스 제작용으로만 활용되며, 배포 완료 후 즉시 폐기됩니다.
          </p>
        </div>

        {/* 1. 필명 및 소개 */}
        <div className="space-y-1.5">
          <label htmlFor="bio-input" className="block text-base font-bold text-gray-900">
            필명 및 한줄소개 <span className="text-red-500">*</span>
          </label>

          <div className="text-sm text-gray-600 leading-relaxed">
            글과 함께 게재할 필명을 남겨주세요. 본명과 닉네임 모두 가능합니다.
          </div>

          <input
            id="bio-input"
            type="text"
            {...register('bio', {
              required: '필명 및 한줄소개를 입력해 주세요.',
            })}
            maxLength={INPUT_LENGTH}
            onFocus={() => trackFieldFocus('bio', 2)}
            onBlur={(e) => trackFieldBlur('bio', 2, e.target.value.length > 0)}
            placeholder="예: 노유캐 / 일상의 순간을 기록합니다."
            className="w-full h-12 px-3.5 text-base text-gray-800 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all shadow-xs"
          />
          <ErrorMessage message={errors.bio?.message} />
        </div>

        {/* 2. 전화번호 (선택 항목) */}
        <div className="space-y-1.5">
          <label htmlFor="phone-input" className="block text-base font-bold text-gray-900">
            전화번호 <span className="text-gray-500 font-normal">(선택)</span>
          </label>

          <div className="text-sm text-gray-600 leading-relaxed">
            투고 결과 안내 및 Zine 수령을 위한 연락처입니다. (접수 후 20일 이내 안내)
          </div>

          <input
            id="phone-input"
            type="tel"
            maxLength="11"
            inputMode="numeric"
            {...register('phone', {
              validate: (val) => {
                if (!val) return true;
                // 국가번호(+82)나 공백이 섞여 들어와도 순수 숫자 자릿수로만 판별
                const rawDigits = val.replace(/^\+82\s?/, '0').replace(/[^0-9]/g, '');
                const isValid = rawDigits.length === 11 && rawDigits.startsWith('010');
                return isValid || '010으로 시작하는 전화번호 11자리를 입력해 주세요.';
              },
            })}
            onFocus={() => trackFieldFocus('phone', 2)}
            onBlur={(e) => trackFieldBlur('phone', 2, e.target.value.length > 0)}
            placeholder="01012345678"
            className="w-full h-12 px-3.5 text-base text-gray-800 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all shadow-xs"
          />
          <ErrorMessage message={errors.phone?.message} />
        </div>

        {/* 3. 인스타그램 계정 */}
        <div className="space-y-1.5">
          <label htmlFor="instagram-input" className="block text-base font-bold text-gray-900">
            인스타그램 계정 <span className="text-gray-500 font-normal">(선택)</span>
          </label>

          <div className="text-sm text-gray-600 leading-relaxed">
            적어주신 분에 한하여, 인스타그램 카드뉴스와 Zine에 필명과 함께 게재됩니다.
          </div>

          <input
            id="instagram-input"
            type="text"
            maxLength={INPUT_LENGTH}
            autoCapitalize="none"
            autoCorrect="off"
            {...register('instagram')}
            onFocus={() => trackFieldFocus('instagram', 2)}
            onBlur={(e) => trackFieldBlur('instagram', 2, e.target.value.length > 0)}
            placeholder="@username"
            className="w-full h-12 px-3.5 text-base text-gray-800 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all shadow-xs"
          />
        </div>

        {/* 4. 유입 경로 */}
        <div className="space-y-2.5">
          <label className="block text-base font-bold text-gray-900">
            유입 경로 <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-2 gap-2">
            {['인스타그램', '지인 추천', '에브리타임', '기타'].map((option) => {
              const isChecked = selectedSource === option;
              return (
                <label
                  key={option}
                  className={`flex items-center justify-center h-12 px-3 rounded-xl border text-sm sm:text-base font-medium cursor-pointer transition-all active:scale-[0.98] select-none ${
                    isChecked
                      ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold shadow-xs'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={option}
                    {...register('source', { required: '알게 된 경로를 선택해 주세요.' })}
                    className="sr-only"
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
          <ErrorMessage message={errors.source?.message} />

          {selectedSource === '기타' && (
            <div className="pt-1">
              <input
                type="text"
                maxLength={INPUT_LENGTH}
                {...register('sourceCustom', {
                  required: selectedSource === '기타' ? '알게 된 경로를 입력해 주세요.' : false,
                })}
                placeholder="알게 된 경로를 직접 입력해 주세요."
                className="w-full h-12 px-3.5 text-base text-gray-800 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all shadow-xs"
              />
              <ErrorMessage message={errors.sourceCustom?.message} />
            </div>
          )}
        </div>

        {/* 에러 박스 */}
        {submitError && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium leading-relaxed">
            {submitError}
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="flex justify-between items-center pt-1 gap-3">
          <button
            type="button"
            onClick={onPrev}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none min-h-12.5 px-6 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
          >
            이전
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-2 sm:flex-none min-h-12.5 px-8 py-3 rounded-xl font-bold text-base bg-purple-600 text-white hover:bg-purple-700 active:scale-[0.99] transition-all shadow-md cursor-pointer disabled:bg-purple-300"
          >
            {isSubmitting ? '제출 중...' : '최종 제출하기'}
          </button>
        </div>
      </form>
    </div>
  );
}