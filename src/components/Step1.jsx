import { useForm } from 'react-hook-form';
import { trackFieldFocus, trackFieldBlur } from '../lib/analytics.js';

export default function Step1({ onNext, defaultValues }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      story: defaultValues.story || '',
    },
    mode: 'onChange', // 실시간 입력 검증
  });

  const storyValue = watch('story') || '';
  const charCount = storyValue.length;
  const isValidLength = charCount >= 500 && charCount <= 1000;

  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 상단 안내문 카드 */}
      <div className="bg-white rounded-lg border border-gray-200 border-t-8 border-t-purple-600 p-5 sm:p-6 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">투고 원고 작성</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          매거진에 수록될 원고 내용을 작성해 주세요.<br />
          분량은 <strong className="text-purple-700">500자 이상 1000자 이하</strong>로 작성해 주셔야 다음 단계로 이동이 가능합니다.
        </p>
      </div>

      {/* 장문형 질문 카드 (작품) */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6 shadow-sm space-y-3">
        <label className="block text-base font-semibold text-gray-900">
          작품 <span className="text-red-500">*</span>
        </label>
        
        <textarea
          {...register('story', {
            required: '작품 내용을 입력해 주세요.',
            minLength: { value: 500, message: '최소 500자 이상 입력해 주세요.' },
            maxLength: { value: 1000, message: '최대 1000자까지 입력 가능합니다.' },
          })}
          onFocus={() => trackFieldFocus('story', 1)}
          onBlur={() => trackFieldBlur('story', 1, charCount > 0)}
          rows={8}
          placeholder="작품 내용을 자유롭게 작성해 주세요."
          className="w-full p-3 text-base text-gray-800 bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors resize-y"
        />

        {/* 글자 수 및 에러 메시지 */}
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <div>
            {errors.story && (
              <span className="text-red-500 font-medium">{errors.story.message}</span>
            )}
          </div>
          <div className={`font-semibold ${!isValidLength ? 'text-gray-400' : 'text-purple-600'}`}>
            {charCount} / 1000자 (최소 500자)
          </div>
        </div>
      </div>

      {/* 다음 버튼 */}
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