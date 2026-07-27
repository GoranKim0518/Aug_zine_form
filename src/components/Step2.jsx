import { useForm } from 'react-hook-form';
import { trackFieldFocus, trackFieldBlur } from '../lib/analytics.js';

export default function Step2({ onNext, onPrev, defaultValues, isSubmitting }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      penName: defaultValues.penName || '',
      introduction: defaultValues.introduction || '',
      phone: defaultValues.phone || '',
      instagram: defaultValues.instagram || '',
      referral: defaultValues.referral || '',
      referralCustom: defaultValues.referralCustom || '',
    },
    mode: 'onTouched',
  });

  const selectedReferral = watch('referral');

  const onSubmit = async (data) => {
    const finalData = {
      ...data,
      referralPath: data.referral === '기타' ? data.referralCustom : data.referral,
    };
    await onNext(finalData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 1. 필명 & 한 줄 소개 (필수) */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            필명 <span className="text-red-500">*</span>
          </label>
          <input
            {...register('penName', { required: '필명을 입력해 주세요.' })}
            onFocus={() => trackFieldFocus('penName', 2)}
            onBlur={(e) => trackFieldBlur('penName', 2, !!e.target.value)}
            placeholder="내 답변"
            className="w-full py-2 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 focus:outline-none text-base text-gray-800 transition-all placeholder-gray-400"
          />
          {errors.penName && <p className="text-xs text-red-500 mt-1">{errors.penName.message}</p>}
        </div>

        <div className="pt-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            한 줄 소개 <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('introduction', { required: '한 줄 소개를 입력해 주세요.' })}
            onFocus={() => trackFieldFocus('introduction', 2)}
            onBlur={(e) => trackFieldBlur('introduction', 2, !!e.target.value)}
            rows={2}
            placeholder="내 답변"
            className="w-full py-2 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 focus:outline-none text-base text-gray-800 transition-all placeholder-gray-400 resize-none"
          />
          {errors.introduction && <p className="text-xs text-red-500 mt-1">{errors.introduction.message}</p>}
        </div>
      </div>

      {/* 2. 연락처 정보 (전화번호: 선택 + 정규식, 인스타: 선택) */}
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
                // 선택 입력: 값이 비어있으면 통과, 작성된 경우만 정규식 검증
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
            {...register('instagram')}
            onFocus={() => trackFieldFocus('instagram', 2)}
            onBlur={(e) => trackFieldBlur('instagram', 2, !!e.target.value)}
            placeholder="@username"
            className="w-full py-2 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 focus:outline-none text-base text-gray-800 transition-all placeholder-gray-400"
          />
        </div>
      </div>

      {/* 3. 알게 된 경로 (필수) */}
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
                {...register('referral', { required: '알게 된 경로를 선택해 주세요.' })}
                onClick={() => trackFieldFocus(`referral_${option}`, 2)}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500 accent-purple-600"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{option}</span>
            </label>
          ))}
        </div>

        {/* '기타' 선택 시 동적 입력 필드 (필수) */}
        {selectedReferral === '기타' && (
          <div className="pt-2 pl-7">
            <input
              {...register('referralCustom', {
                required: selectedReferral === '기타' ? '기타 경로를 직접 입력해 주세요.' : false,
              })}
              onFocus={() => trackFieldFocus('referralCustom', 2)}
              onBlur={(e) => trackFieldBlur('referralCustom', 2, !!e.target.value)}
              placeholder="기타 경로 입력"
              className="w-full py-1 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 focus:outline-none text-base text-gray-800 placeholder-gray-400"
            />
            {errors.referralCustom && (
              <p className="text-xs text-red-500 mt-1">{errors.referralCustom.message}</p>
            )}
          </div>
        )}

        {errors.referral && <p className="text-xs text-red-500 mt-1">{errors.referral.message}</p>}
      </div>

      {/* 버튼 영역 (이전, 제출, 중복 제출 방지 비활성화) */}
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
          {isSubmitting ? (
            <span className="flex items-center space-x-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>제출 중...</span>
            </span>
          ) : (
            '제출'
          )}
        </button>
      </div>
    </form>
  );
}