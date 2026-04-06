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

      <div className="text-center" style={{ marginTop: "40px", marginBottom: "15px" }}>
        <p style={{ fontSize: "14px" }}>{formatDateKorean(record.submitDate)}</p>
      </div>

      <div style={{ textAlign: "right", paddingRight: "40px", marginBottom: "15px" }}>
        <p style={{ fontSize: "14px" }}>담 임 : {record.teacherName} (인)</p>
      </div>

      <div className="text-center" style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "16px", fontWeight: "normal" }}>군산제일중학교장 귀하</p>
      </div>

      <div style={{ 
        borderTop: "1px solid #000", 
        paddingTop: "12px",
        fontSize: "11px",
        lineHeight: "1.6",
        marginTop: "10px"
      }}>
        <p style={{ fontWeight: "bold", marginBottom: "8px" }}>※ 학업성적관리규정 중 추석 인정 결석</p>
        <div style={{ fontSize: "10px", lineHeight: "1.5" }}>
          <p style={{ marginBottom: "4px" }}>1) 자연, 폭우, 폭설, 폭풍, 해일 등의 천재지변 또는 법정 감염병 중 당교 내 확산 방지를 위해 학교가 필요하다고 인정하는 버평정 감염병로 로한으로 출석하지 못한 경우</p>
          <p style={{ marginBottom: "4px" }}>2) 병역관계 등 공적 의무 또는 공권력의 행사로 인하여 출석하지 못한 경우</p>
          <p style={{ marginBottom: "4px" }}>3) 학교를 대표한 경기, 경연 대회 참가 및 현장 실습, 훈련 참가, 교환학습, 교외체험학습 등으로 인하여 출석하지 못한 경우</p>
          <p style={{ marginBottom: "4px" }}>4) 가족·중조교육중 사생청, 제자조치비에 따른 학교 이용 금지, 사회봉사, 특별교육 이수 기간</p>
          <p style={{ marginBottom: "4px" }}>5) 숙 중교육중, 제자조치비에 따른 정학, 자숙 프로그램 참가 기간</p>
          <p style={{ marginBottom: "4px" }}>6) 경조사증 인정하 출석하지 못한 경우 (궁, 입당, 사망)</p>
          <p style={{ marginBottom: "4px" }}>7) 기타 부득이한 사유 학교장의 허가를 받아 결석하는 경우 내용 합리적 민간인 당으로 비용통합위원회에서 질의 및 도 위원회의 학교폭력 아동 미치원에 대한 문제조치 용점 이전에, 학교폭력 피해자가 치료 중인 피해증 증상처 포함 법치고문</p>
          <p style={{ marginBottom: "4px" }}>8) 학교폭력 관련 사유</p>
          <p style={{ marginBottom: "4px" }}>9) 사도정상 "소년영우거리", 따라 전환관시의 선도프로그램에 참여하는 경우</p>
          <p style={{ marginBottom: "4px" }}>10) 공직자법에 의한 (민감 공직에 선도이 의정활동 (문화의, 상임위원회 회의 당정 정주) 통사료 수장 또는</p>
          <p style={{ marginBottom: "4px" }}>11) 중 정치개법에 의한 (민감 공직에 선도이 의정활동 (문화의, 상임위원회 회의 당정 정주) 통사료 수장 또는</p>
          <p style={{ marginBottom: "4px" }}>12) 학교폰 여학생 중 생리통이 극심해 출석이 어려운 경우 (월 1 일 공적)매는 위 7)이 "기다 부득이한 사유로 학교장의 허가를 받아 결석하는 경우" 도 보아 증신증 결석으로 처리한다.</p>
          <p style={{ marginBottom: "4px" }}>13) 기 법령 명령 및 행정규칙에 의해 인정되는 한 경우</p>
        </div>
      </div>
    </div>
  );
}
