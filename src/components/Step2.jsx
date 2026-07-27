import { useForm } from 'react-hook-form';

export default function Step2({ onNext, onPrev, defaultValues }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      penName: defaultValues.penName || '',
      introduction: defaultValues.introduction || '',
      phone: defaultValues.phone || '',
      instagram: defaultValues.instagram || '',
      referral: defaultValues.referral || '',
      referralCustom: defaultValues.referralCustom || '',
    },
  });

  const selectedReferral = watch('referral');

  const onSubmit = (data) => {
    // 기타 선택 시 입력한 텍스트로 referral 값 재정의
    const finalData = {
      ...data,
      referralPath: data.referral === '기타' ? data.referralCustom : data.referral,
    };
    onNext(finalData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 1. 필명 & 한 줄 소개 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            필명 <span className="text-red-500">*</span>
          </label>
          <input
            {...register('penName', { required: '필명을 입력해 주세요.' })}
            placeholder="내 답변"
            className="w-full py-2 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 focus:outline-none text-sm text-gray-800 transition-all placeholder-gray-400"
          />
          {errors.penName && <p className="text-xs text-red-500 mt-1">{errors.penName.message}</p>}
        </div>

        <div className="pt-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            한 줄 소개 <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('introduction', { required: '한 줄 소개를 입력해 주세요.' })}
            rows={2}
            placeholder="내 답변"
            className="w-full py-2 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 focus:outline-none text-sm text-gray-800 transition-all placeholder-gray-400 resize-none"
          />
          {errors.introduction && <p className="text-xs text-red-500 mt-1">{errors.introduction.message}</p>}
        </div>
      </div>

      {/* 2. 연락처 정보 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            전화번호 <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register('phone', {
              required: '전화번호를 입력해 주세요.',
              pattern: { value: /^[0-9-]{9,13}$/, message: '올바른 전화번호 형식이 아닙니다.' },
            })}
            placeholder="010-0000-0000"
            className="w-full py-2 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 focus:outline-none text-sm text-gray-800 transition-all placeholder-gray-400"
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>

        <div className="pt-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            인스타그램 아이디
          </label>
          <input
            {...register('instagram')}
            placeholder="@username"
            className="w-full py-2 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 focus:outline-none text-sm text-gray-800 transition-all placeholder-gray-400"
          />
        </div>
      </div>

      {/* 3. 유입 경로 (Radio) */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-3">
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          NO-TE를 알게 된 경로 <span className="text-red-500">*</span>
        </label>

        <div className="space-y-3 pt-1">
          {['지류(매거진)', '인스타그램', '스레드', '당근', '기타'].map((option) => (
            <label key={option} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="radio"
                value={option}
                {...register('referral', { required: '유입 경로를 선택해 주세요.' })}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500 accent-purple-600"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{option}</span>
            </label>
          ))}
        </div>

        {/* '기타' 선택 시 동적 표시되는 Text Input */}
        {selectedReferral === '기타' && (
          <div className="pt-2 pl-7">
            <input
              {...register('referralCustom', { required: '알게 된 경로를 직접 입력해 주세요.' })}
              placeholder="기타 경로 입력"
              className="w-full py-1 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 focus:outline-none text-sm text-gray-800 placeholder-gray-400"
            />
            {errors.referralCustom && (
              <p className="text-xs text-red-500 mt-1">{errors.referralCustom.message}</p>
            )}
          </div>
        )}

        {errors.referral && <p className="text-xs text-red-500 mt-1">{errors.referral.message}</p>}
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded transition-colors"
        >
          뒤로
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-purple-600 text-white font-medium text-sm rounded shadow-sm hover:bg-purple-700 transition-colors"
        >
          제출
        </button>
      </div>
    </form>
  );
}