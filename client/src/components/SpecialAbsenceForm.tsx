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
  return `${year} 년 ${month} 월 ${day} 일`;
}

export default function SpecialAbsenceForm({ record }: SpecialAbsenceFormProps) {
  return (
    <div 
      className="print-document absence-form" 
      style={{ 
        backgroundColor: "#ffffff",
        color: "#000000",
        padding: "15mm 20mm",
        maxWidth: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        fontFamily: "'Batang', 'Gulim', 'Noto Sans KR', serif",
        fontSize: "14px",
        lineHeight: "1.9",
        boxSizing: "border-box"
      }}
    >
      <div className="text-center" style={{ marginTop: "30px", marginBottom: "30px" }}>
        <h1 style={{ 
          fontSize: "24px", 
          fontWeight: "bold", 
          letterSpacing: "0.3em",
          textDecoration: "underline"
        }}>
          특 별 결 석 신 고 서
        </h1>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "30px" }}>
        <table style={{ 
          borderCollapse: "collapse", 
          fontSize: "12px",
          textAlign: "center"
        }}>
          <tbody>
            <tr>
              <td style={{ 
                border: "1px solid #000", 
                padding: "6px 25px",
                height: "28px",
                whiteSpace: "nowrap"
              }}>계</td>
              <td style={{ 
                border: "1px solid #000", 
                padding: "6px 25px",
                height: "28px",
                whiteSpace: "nowrap"
              }}>부장</td>
            </tr>
            <tr>
              <td style={{ 
                border: "1px solid #000", 
                padding: "6px 25px",
                height: "40px"
              }}></td>
              <td style={{ 
                border: "1px solid #000", 
                padding: "6px 25px",
                height: "40px",
                verticalAlign: "middle",
                textAlign: "center",
                whiteSpace: "nowrap"
              }}>전결</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: "right", marginBottom: "40px", paddingRight: "40px" }}>
        <p style={{ fontSize: "14px", lineHeight: "2", marginBottom: "0" }}>학번 : {record.studentId}</p>
        <p style={{ fontSize: "14px", lineHeight: "2", marginBottom: "0" }}>성명 : {record.studentName}</p>
      </div>

      <div style={{ marginBottom: "30px", textAlign: "left", lineHeight: "2.2", paddingLeft: "5px", paddingRight: "5px" }}>
        <p style={{ fontSize: "14px", textIndent: "1em" }}>
          위 학생은 ( {record.reasonDetail} )(으)로 인하여 학교성적관리규정 제 32 조 ( {record.reasonCode} )항에 의거 서류를 첨부하여 ( {formatDateKorean(record.startDate)} )부터 ( {formatDateKorean(record.endDate)} )까지 ( {record.daysCount} )일간 출석으로 처리하고자 합니다.
        </p>
      </div>

      <div className="text-center" style={{ marginTop: "40px", marginBottom: "30px" }}>
        <p style={{ fontSize: "14px" }}>{formatDateKorean(record.submitDate)}</p>
      </div>

      <div style={{ textAlign: "right", paddingRight: "40px", marginBottom: "30px" }}>
        <p style={{ fontSize: "14px" }}>담 임 : {record.teacherName} (인)</p>
      </div>

      <div className="text-center" style={{ marginBottom: "40px" }}>
        <p style={{ fontSize: "16px", fontWeight: "normal" }}>군산제일중학교장 귀하</p>
      </div>

      <div style={{ 
        borderTop: "1px solid #000", 
        paddingTop: "12px",
        fontSize: "11px",
        lineHeight: "1.6",
        marginTop: "20px"
      }}>
        <p style={{ fontWeight: "bold", marginBottom: "8px" }}>※ 학교성적관리규정 제 32 조</p>
        <p style={{ marginBottom: "8px", textAlign: "justify" }}>
          교칙에 의거, 출석하여야 할 날짜에 출석하지 않았을 때에는 결석으로 처리한다. 다만, 다음 각항의 하나에 해당되어 학교장이 부득이하다고 인정하거나 또는 허가한 경우에는 출석으로 처리한다.
        </p>
        <div style={{ fontSize: "11px", lineHeight: "1.55" }}>
          <p>① 천재지변, 전염병 등 불가항력의 사유로 인하여 출석하지 못한 경우</p>
          <p>② 병역 관계 등 공적 의무 또는 공권력의 행사로 인하여 출석하지 못한 경우</p>
          <p>③ 학교를 대표한 경기, 경연 대회 참가 및 현장 실습, 훈련 참가, 교환학습, 교외체험학습 등으로 인하여 출석하지 못한 경우</p>
          <p>④ 경조사로 인하여 출석하지 못한 경우</p>
          <p>⑤ 초·중등교육법시행령 제 31 조(학생의 징계 등) 제 1 항의 규정에 의한 학교 내의 봉사, 사회봉사, 특별교육이수 기간</p>
          <p>⑥ 생리통이 극심해 출석이 어려운 여학생으로 확인된 경우 (매월 1 일에 한하여 출석으로 인정)</p>
          <p>⑦ 건강장애로 선정된 학생의 병원학교 수업 참여 및 교육계획 기간 내에 이수한 화상강의</p>
          <p>⑧ 건강장애 선정 대상자는 아니나 3 개월 이상의 치료를 요하는 심각한 부상으로 병원학교수업 참여 또는 화상 강의를 이수하도록 교육청이 허가하고 이에 따라 이수한 화상강의</p>
          <p>⑨ 보호소년 등의 처우에 관한 법률 제 42 조의 2 제 1 항에 따라 판사 또는 검사가 의뢰한 대안교육 대상 소년이 소년원 또는 소년분류심사원에서 정해진 교육과정을 이수하였을 경우</p>
          <p>⑩ 기타 부득이한 사유로 학교장의 허가를 받아 결석한 경우</p>
        </div>
      </div>
    </div>
  );
}
