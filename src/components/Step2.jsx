import { useForm } from 'react-hook-form';

export default function Step2({ onNext, onPrev, defaultValues, isSubmitting }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues,
  });

  const selectedSource = watch('source');

  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 1. 필명 & 한 줄 소개 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-3">
        <label className="block text-base font-medium text-gray-900">
          필명 & 한 줄 소개 <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register('bio', { required: '필명과 한 줄 소개를 입력해 주세요.' })}
          rows={2}
          placeholder="내 답변"
          className="w-full py-2 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 focus:outline-none transition-all text-sm bg-transparent"
        />
        {errors.bio && <p className="text-red-500 text-xs">{errors.bio.message}</p>}
      </div>

      {/* 2. 전화번호 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-3">
        <label className="block text-base font-medium text-gray-900">
          전화번호 <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          {...register('phone', {
            required: '전화번호를 입력해 주세요.',
            pattern: {
              value: /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/,
              message: '올바른 전화번호 형식이 아닙니다.'
            }
          })}
          placeholder="내 답변"
          className="w-full py-2 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 focus:outline-none transition-all text-sm bg-transparent"
        />
        {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
      </div>

      {/* 3. 인스타그램 아이디 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-3">
        <label className="block text-base font-medium text-gray-900">
          인스타그램 아이디
        </label>
        <input
          type="text"
          {...register('instagram')}
          placeholder="내 답변 (@username)"
          className="w-full py-2 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 focus:outline-none transition-all text-sm bg-transparent"
        />
      </div>

      {/* 4. NO-TE를 알게 된 경로 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-3">
        <label className="block text-base font-medium text-gray-900">
          NO-TE를 알게 된 경로 <span className="text-red-500">*</span>
        </label>
        
        <div className="space-y-3 pt-2">
          {['지류(매거진)', '인스타그램', '스레드', '당근'].map((option) => (
            <label key={option} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                value={option}
                {...register('source', { required: '유입 경로를 선택해 주세요.' })}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}

          {/* 기타 항목 */}
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              value="기타"
              {...register('source', { required: '유입 경로를 선택해 주세요.' })}
              className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">기타:</span>
          </label>

          {/* 기타 선택 시 동적 표시되는 Text Input */}
          {selectedSource === '기타' && (
            <div className="pl-7 pt-1">
              <input
                type="text"
                {...register('sourceCustom', {
                  required: selectedSource === '기타' ? '기타 사유를 입력해 주세요.' : false
                })}
                placeholder="내 답변"
                className="w-full py-1 border-b border-gray-300 focus:border-b-2 focus:border-purple-600 focus:outline-none transition-all text-sm bg-transparent"
              />
              {errors.sourceCustom && (
                <p className="text-red-500 text-xs mt-1">{errors.sourceCustom.message}</p>
              )}
            </div>
          )}
        </div>
        {errors.source && <p className="text-red-500 text-xs pt-1">{errors.source.message}</p>}
      </div>

      {/* 이전 / 제출 버튼 */}
      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          이전
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 shadow-sm transition-colors cursor-pointer disabled:bg-purple-300"
        >
          {isSubmitting ? '제출 중...' : '제출'}
        </button>
      </div>
    </form>
  );
}