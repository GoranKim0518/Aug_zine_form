export default function Step3({ onReset }) {
  return (
    <div className="space-y-4">
      {/* 제출 완료 카드 */}
      <div className="bg-white rounded-lg border border-gray-200 border-t-8 border-t-purple-600 p-6 shadow-sm space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">투고 원고 접수 완료</h1>
        <p className="text-sm text-gray-700 leading-relaxed">
          응답이 기록되었습니다.<br />
          소중한 글을 보내주셔서 감사합니다. 검토 후 입력해 주신 연락처로 개별 안내드리겠습니다.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-purple-600 underline font-medium hover:text-purple-800 transition-colors"
          >
            다른 응답 제출하기
          </button>
        </div>
      </div>
    </div>
  );
}