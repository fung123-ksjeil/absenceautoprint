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
  return `${year} 년 ${month} 월 ${day} 일`;
}

export default function SickAbsenceForm({ record }: SickAbsenceFormProps) {
  return (
    <div 
      className="print-document bg-white text-black px-16 py-12 max-w-[210mm] mx-auto absence-form" 
      style={{ 
        fontFamily: "'Gulim', 'Batang', 'Noto Sans KR', sans-serif",
        fontSize: "15px",
        lineHeight: "2"
      }}
    >
      <div className="text-center" style={{ marginTop: "80px", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", letterSpacing: "0.5em" }}>
          결 석 신 고 서
        </h1>
      </div>
      
      <div className="text-center" style={{ marginBottom: "60px" }}>
        <p style={{ fontSize: "16px", fontWeight: "bold" }}>(질병 결석 처리용)</p>
      </div>

      <div style={{ textAlign: "right", marginBottom: "50px", paddingRight: "40px" }}>
        <p style={{ fontSize: "15px", lineHeight: "2.2" }}>학번 : {record.studentId}</p>
        <p style={{ fontSize: "15px", lineHeight: "2.2" }}>성명 : {record.studentName}</p>
      </div>

      <div style={{ marginBottom: "60px", textAlign: "left", lineHeight: "2.5" }}>
        <p style={{ fontSize: "15px", textIndent: "2em" }}>
          위 본인은 ( {formatDateKorean(record.startDate)} )부터 ( {formatDateKorean(record.endDate)} )까지 ( {record.daysCount} )일간 ( {record.reasonDetail} )(으)로 인하여 결석하였기에 이를 확인하고 결석신고서를 제출합니다.
        </p>
      </div>

      <div style={{ textAlign: "right", paddingRight: "40px", marginTop: "80px" }}>
        <p style={{ fontSize: "15px", marginBottom: "40px" }}>{formatDateKorean(record.submitDate)}</p>
        <p style={{ fontSize: "15px" }}>담 임 : {record.teacherName} (인)</p>
      </div>

      <div className="text-center" style={{ marginTop: "120px" }}>
        <p style={{ fontSize: "18px", fontWeight: "bold", letterSpacing: "0.3em" }}>
          군 산 제 일 중 학 교 장 귀 하
        </p>
      </div>
    </div>
  );
}
