import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { trackFieldFocus, trackFieldBlur } from '../lib/analytics.js';

export default function Step2({ onNext, onPrev, onUpdate, defaultValues, isSubmitting }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      pen_name_intro: defaultValues.pen_name_intro || '',
      phone: defaultValues.phone || '',
      instagram_id: defaultValues.instagram_id || '',
      referral_source: defaultValues.referral_source || '',
      referral_source_other: defaultValues.referral_source_other || '',
    },
    mode: 'onTouched',
  });

  const selectedReferral = watch('referral_source');

  // 구독 패턴으로 무한 루프 방지
  useEffect(() => {
    const subscription = watch((value) => {
      onUpdate(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, onUpdate]);

  const onSubmit = async (data) => {
    await onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 1. 필명 & 한 줄 소개 */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            필명 & 한 줄 소개 <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('pen_name_intro', { required: '필명과 한 줄 소개를 입력해 주세요.' })}
            onFocus={() => trackFieldFocus('pen_name_intro', 2)}
            onBlur={(e) => trackFieldBlur('pen_name_intro', 2, !!e.target.value)}
            rows={3}
            placeholder="예: 홍길동 / 매일을 기쁨으로 기록하는 에세이스트입니다."
            className="w-full py-2 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 focus:outline-none text-base text-gray-800 transition-all placeholder-gray-400 resize-none"
          />
          {errors.pen_name_intro && (
            <p className="text-xs text-red-500 mt-1">{errors.pen_name_intro.message}</p>
          )}
        </div>
      </div>

      {/* 2. 연락처 정보 */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            전화번호 <span className="text-xs text-gray-500 font-normal">(선택)</span>
          </label>
          <input
            type="tel"
            inputMode="tel"
            {...register('phone', {
              validate: (value) => {
                if (!value) return true;
                const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
                return phoneRegex.test(value) || '올바른 전화번호 형식(010-0000-0000)으로 입력해 주세요.';
              },
            })}
            onFocus={() => trackFieldFocus('phone', 2)}
            onBlur={(e) => trackFieldBlur('phone', 2, !!e.target.value)}
            placeholder="010-0000-0000"
            className="w-full py-2 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 focus:outline-none text-base text-gray-800 transition-all placeholder-gray-400"
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>

        <div className="pt-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            인스타그램 아이디 <span className="text-xs text-gray-500 font-normal">(선택)</span>
          </label>
          <input
            {...register('instagram_id')}
            onFocus={() => trackFieldFocus('instagram_id', 2)}
            onBlur={(e) => trackFieldBlur('instagram_id', 2, !!e.target.value)}
            placeholder="@username"
            className="w-full py-2 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 focus:outline-none text-base text-gray-800 transition-all placeholder-gray-400"
          />
        </div>
      </div>

      {/* 3. 알게 된 경로 */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 shadow-sm space-y-3">
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          알게 된 경로 <span className="text-red-500">*</span>
        </label>

        <div className="space-y-3 pt-1">
          {['지류(매거진)', '인스타그램', '스레드', '당근', '기타'].map((option) => (
            <label key={option} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="radio"
                value={option}
                {...register('referral_source', { required: '알게 된 경로를 선택해 주세요.' })}
                onClick={() => trackFieldFocus(`referral_${option}`, 2)}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500 accent-purple-600"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{option}</span>
            </label>
          ))}
        </div>

        {selectedReferral === '기타' && (
          <div className="pt-2 pl-7">
            <input
              {...register('referral_source_other', {
                required: selectedReferral === '기타' ? '기타 경로를 직접 입력해 주세요.' : false,
              })}
              onFocus={() => trackFieldFocus('referral_source_other', 2)}
              onBlur={(e) => trackFieldBlur('referral_source_other', 2, !!e.target.value)}
              placeholder="기타 경로 입력"
              className="w-full py-1 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 focus:outline-none text-base text-gray-800 placeholder-gray-400"
            />
            {errors.referral_source_other && (
              <p className="text-xs text-red-500 mt-1">{errors.referral_source_other.message}</p>
            )}
          </div>
        )}

        {errors.referral_source && (
          <p className="text-xs text-red-500 mt-1">{errors.referral_source.message}</p>
        )}
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded transition-colors disabled:opacity-50"
        >
          이전
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2.5 bg-purple-600 text-white font-medium text-sm rounded shadow-sm hover:bg-purple-700 transition-colors flex items-center justify-center ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {isSubmitting ? '제출 중...' : '제출'}
        </button>
      </div>
    </form>
  );
}