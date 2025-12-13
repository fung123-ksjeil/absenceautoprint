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
      className="print-document absence-form" 
      style={{ 
        backgroundColor: "#ffffff",
        color: "#000000",
        padding: "20mm 25mm",
        maxWidth: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        fontFamily: "'Batang', 'Gulim', 'Noto Sans KR', serif",
        fontSize: "16px",
        lineHeight: "2.2",
        boxSizing: "border-box"
      }}
    >
      <div className="text-center" style={{ marginTop: "50px", marginBottom: "10px" }}>
        <h1 style={{ 
          fontSize: "28px", 
          fontWeight: "bold", 
          letterSpacing: "0.4em",
          marginBottom: "0"
        }}>
          결 석 신 고 서
        </h1>
      </div>
      
      <div className="text-center" style={{ marginBottom: "60px" }}>
        <p style={{ fontSize: "16px", fontWeight: "normal" }}>(질병 결석 처리용)</p>
      </div>

      <div style={{ textAlign: "right", marginBottom: "50px", paddingRight: "60px" }}>
        <p style={{ fontSize: "16px", lineHeight: "2", marginBottom: "0" }}>학번 : {record.studentId}</p>
        <p style={{ fontSize: "16px", lineHeight: "2", marginBottom: "0" }}>성명 : {record.studentName}</p>
      </div>

      <div style={{ marginBottom: "80px", textAlign: "left", lineHeight: "2.5", paddingLeft: "10px", paddingRight: "10px" }}>
        <p style={{ fontSize: "16px", textIndent: "0" }}>
          위 본인은 ( {formatDateKorean(record.startDate)} )부터 ( {formatDateKorean(record.endDate)} )까지 ( {record.daysCount} )일간 ( {record.reasonDetail} )(으)로 인하여 결석하였기에 이를 확인하고 결석신고서를 제출합니다.
        </p>
      </div>

      <div style={{ textAlign: "right", paddingRight: "60px", marginTop: "60px" }}>
        <p style={{ fontSize: "16px", marginBottom: "50px" }}>{formatDateKorean(record.submitDate)}</p>
        <p style={{ fontSize: "16px" }}>담 임 : {record.teacherName} (인)</p>
      </div>

      <div className="text-center" style={{ marginTop: "100px" }}>
        <p style={{ fontSize: "18px", fontWeight: "bold", letterSpacing: "0.4em" }}>
          군 산 제 일 중 학 교 장 귀 하
        </p>
      </div>
    </div>
  );
}
