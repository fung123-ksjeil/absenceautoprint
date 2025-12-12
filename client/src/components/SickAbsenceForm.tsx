import type { AbsenceRecord } from "./AbsenceFormInput";

interface SickAbsenceFormProps {
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

export default function SickAbsenceForm({ record }: SickAbsenceFormProps) {
  return (
    <div className="print-document bg-white text-black p-8 max-w-4xl mx-auto absence-form" style={{ minHeight: "297mm" }}>
      <div className="text-center mt-16 mb-8">
        <h1 className="text-3xl font-bold tracking-widest">결  석  신  고  서</h1>
      </div>
      
      <div className="text-center mb-12">
        <p className="text-base font-bold">(질병 결석 처리용)</p>
      </div>

      <div className="text-right mb-8 pr-8">
        <p className="text-base leading-loose">학번 : {record.studentId}</p>
        <p className="text-base leading-loose">성명 : {record.studentName}</p>
      </div>

      <div className="px-8 mb-12 leading-loose text-base">
        <p className="indent-8">
          위 본인은 ( {formatDateKorean(record.startDate)} )부터 ( {formatDateKorean(record.endDate)} )까지 ( {record.daysCount} )일간 ( {record.reasonDetail} )(으)로 인하여 결석하였기에 이를 확인하고 결석신고서를 제출합니다.
        </p>
      </div>

      <div className="text-right pr-8 mb-16">
        <p className="text-base mb-8">{formatDateKorean(record.submitDate)}</p>
        <p className="text-base">담 임 :  {record.teacherName}  (인)</p>
      </div>

      <div className="text-center mt-24">
        <p className="text-lg font-bold tracking-widest">군  산  제  일  중  학  교  장  귀  하</p>
      </div>
    </div>
  );
}
