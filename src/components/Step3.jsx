export default function Step3({ onReset }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      <div className="space-y-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          투고 원고 접수 완료
        </h1>

        <div className="text-base text-gray-800 leading-relaxed space-y-4 p-5 bg-gray-50 border border-gray-100 rounded-2xl">
          <p>
            소중한 투고 감사드립니다! 연락처를 남겨주신 분께는 8월 중 진행 안내를 드릴 예정입니다.
          </p>

          <p>
            글과 어울리는 사진·이미지가 있다면 <strong>필명과 함께</strong> 아래 메일로 보내주세요.<br />
            카드뉴스와 Zine 제작에 활용됩니다.
          </p>

          <p className="text-purple-700 font-semibold text-base">
            📧 weare@nycast.net
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-purple-600 underline font-medium hover:text-purple-800 transition-colors cursor-pointer"
          >
            다른 응답 제출하기
          </button>
        </div>
      </div>
    </div>
  );
}