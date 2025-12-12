import type { AbsenceRecord } from "./AbsenceFormInput";

interface SpecialAbsenceFormProps {
  record: AbsenceRecord;
}

function formatDateKorean(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

export default function SpecialAbsenceForm({ record }: SpecialAbsenceFormProps) {
  return (
    <div className="print-document bg-white text-black p-8 max-w-4xl mx-auto absence-form" style={{ minHeight: "297mm" }}>
      <div className="text-center mt-8 mb-4">
        <h1 className="text-xl font-bold underline tracking-widest">특 별 결 석 신 고 서</h1>
      </div>

      <div className="flex justify-end mb-4">
        <div className="border border-black">
          <table className="text-xs">
            <tbody>
              <tr>
                <td className="border border-black px-2 py-1 text-center">담임</td>
                <td className="border border-black px-2 py-1 text-center">학년부장</td>
                <td className="border border-black px-2 py-1 text-center">교감</td>
              </tr>
              <tr>
                <td className="border border-black px-4 py-3 h-12"></td>
                <td className="border border-black px-4 py-3 h-12"></td>
                <td className="border border-black px-4 py-3 h-12"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-right mb-6 pr-8">
        <p className="text-sm leading-relaxed">학번 : {record.studentId}</p>
        <p className="text-sm leading-relaxed">성명 : {record.studentName}</p>
      </div>

      <div className="px-4 mb-8 leading-loose text-sm">
        <p className="indent-4">
          위 학생은 ( {record.reasonDetail} )(으)로 인하여 학교성적관리규정 제32조 ( {record.reasonCode} )항에 의거 서류를 첨부하여 ( {formatDateKorean(record.startDate)} )부터 ( {formatDateKorean(record.endDate)} )까지 ( {record.daysCount} )일간 출석으로 처리하고자 합니다.
        </p>
      </div>

      <div className="text-center mb-4">
        <p className="text-sm">{formatDateKorean(record.submitDate)}</p>
      </div>

      <div className="text-right pr-8 mb-6">
        <p className="text-sm">담 임 :  {record.teacherName}  (인)</p>
      </div>

      <div className="text-center mb-6">
        <p className="text-base font-medium">군산제일중학교장  귀하</p>
      </div>

      <div className="px-2 text-xs leading-relaxed border-t pt-4">
        <p className="font-medium mb-2">※ 학교성적관리규정 제32조</p>
        <p className="mb-2">
          교칙에 의거, 출석하여야 할 날짜에 출석하지 않았을 때에는 결석으로 처리한다. 다만, 다음 각항의 하나에 해당되어 학교장이 부득이하다고 인정하거나 또는 허가한 경우에는 출석으로 처리한다.
        </p>
        <ul className="space-y-1 text-xs">
          <li>① 천재지변, 전염병 등 불가항력의 사유로 인하여 출석하지 못한 경우</li>
          <li>② 병역 관계 등 공적 의무 또는 공권력의 행사로 인하여 출석하지 못한 경우</li>
          <li>③ 학교를 대표한 경기, 경연 대회 참가 및 현장 실습, 훈련 참가, 교환학습, 교외체험학습 등으로 인하여 출석하지 못한 경우</li>
          <li>④ 경조사로 인하여 출석하지 못한 경우</li>
          <li>⑤ 초·중등교육법시행령 제31조(학생의 징계 등) 제1항의 규정에 의한 학교 내의 봉사, 사회봉사, 특별교육이수 기간</li>
          <li>⑥ 생리통이 극심해 출석이 어려운 여학생으로 확인된 경우 (매월 1일에 한하여 출석으로 인정)</li>
          <li>⑦ 건강장애로 선정된 학생의 병원학교 수업 참여 및 교육계획 기간 내에 이수한 화상강의</li>
          <li>⑧ 건강장애 선정 대상자는 아니나 3개월 이상의 치료를 요하는 심각한 부상으로 병원학교수업 참여 또는 화상 강의를 이수하도록 교육청이 허가하고 이에 따라 이수한 화상강의</li>
          <li>⑨ 보호소년 등의 처우에 관한 법률 제 42조의2제1항에 따라 판사 또는 검사가 의뢰한 대안교육 대상 소년이 소년원 또는 소년분류심사원에서 정해진 교육과정을 이수하였을 경우</li>
          <li>⑩ 기타 부득이한 사유로 학교장의 허가를 받아 결석한 경우</li>
        </ul>
      </div>
    </div>
  );
}
