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
        padding: "10mm 20mm",
        maxWidth: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        fontFamily: "'Batang', 'Gulim', 'Noto Sans KR', serif",
        fontSize: "14px",
        lineHeight: "1.9",
        boxSizing: "border-box"
      }}
    >
      <div className="text-center" style={{ marginTop: "5px", marginBottom: "15px" }}>
        <h1 style={{ 
          fontSize: "24px", 
          fontWeight: "bold", 
          letterSpacing: "0.3em",
          textDecoration: "underline"
        }}>
          특 별 결 석 신 고 서
        </h1>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
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
                height: "25px",
                whiteSpace: "nowrap"
              }}>계</td>
              <td style={{ 
                border: "1px solid #000", 
                padding: "6px 25px",
                height: "25px",
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

      <div style={{ marginTop: "40px", marginBottom: "15px", display: "flex", justifyContent: "flex-end", marginRight: "50px" }}>
        <div style={{ textAlign: "left" }}>
          <p style={{ fontSize: "18px", lineHeight: "1.8", marginBottom: "0" }}>학번 : {record.studentId}</p>
          <p style={{ fontSize: "18px", lineHeight: "1.8", marginBottom: "0" }}>성명 : {record.studentName}</p>
        </div>
      </div>

      <div style={{ marginTop: "40px", marginBottom: "15px", textAlign: "left", lineHeight: "2.5", paddingLeft: "5px", paddingRight: "5px" }}>
        <p style={{ fontSize: "18px", textIndent: "1em" }}>
          위 학생은 ( {record.reasonDetail} )(으)로 결석하였기에 학업성적관리규정 ( {record.reasonCode} )번에 의거 서류를 첨부하여 ( {formatDateKorean(record.startDate)} )부터  ( {formatDateKorean(record.endDate)} )까지 ( {record.daysCount} 일간 ) 출석으로 처리하고자 합니다.
        </p>
      </div>

      <div className="text-center" style={{ marginTop: "30px", marginBottom: "8px" }}>
        <p style={{ fontSize: "18px" }}>{formatDateKorean(record.submitDate)}</p>
      </div>

      <div style={{ textAlign: "right", paddingRight: "40px", marginBottom: "8px" }}>
        <p style={{ fontSize: "18px" }}>담 임 : {record.teacherName} (인)</p>
      </div>

      <div className="text-center" style={{ marginTop: "40px", marginBottom: "10px" }}>
        <p style={{ fontSize: "18px", fontWeight: "normal" }}>군산제일중학교장 귀하</p>
      </div>

      <div style={{ 
        borderTop: "1px solid #000", 
        paddingTop: "8px",
        fontSize: "10px",
        lineHeight: "1.4",
        marginTop: "5px"
      }}>
        <p style={{ fontWeight: "bold", marginBottom: "4px", fontSize: "10px" }}>※ 학업성적관리규정 중 출석 인정 결석</p>
        <div style={{ fontSize: "9px", lineHeight: "1.3" }}>
          <p style={{ marginBottom: "2px" }}>1) 지진, 폭우, 폭설, 폭풍, 해일 등의 천재지변 또는 법정 감염병 등(학교 내 확산 방지를 위해 학교장이 필요하다고 인정하는 비법정 감염병을 포함)으로 출석하지 못한 경우</p>
          <p style={{ marginBottom: "2px" }}>2) 병역관계 등 공적의무 또는 공권력의 행사로 인하여 출석하지 못한 경우</p>
          <p style={{ marginBottom: "2px" }}>3) 학교장의 허가를 받은 '학교·시도(교육청)·국가를 대표한 대회 및 훈련 참가, 산업체 실습과정(현장실습, 현장실습과 연계한 취업), 교환학습, 교외체험학습, 「학교보건법」 제8조에 따른 등교중지 등'으로 출석하지 못한 경우</p>
          <p style={{ marginBottom: "2px" }}>4) 「초·중등교육법 시행령」 제31조제1항에 따른 학교 내의 봉사, 사회봉사, 특별교육 이수 기간</p>
          <p style={{ marginBottom: "2px" }}>5) 「초·중등교육법」 제28조제7항에 따른 상담, 진로 프로그램 등 숙려제 참여 인정 기간</p>
          <p style={{ marginBottom: "2px" }}>6) 경조사로 인하여 출석하지 못한 경우 (결혼, 입양, 사망)</p>
          <p style={{ marginBottom: "2px" }}>7) 기타 부득이한 사유로 학교장의 허가를 받아 결석하는 경우</p>
          <p style={{ marginBottom: "2px" }}>8) 「학교폭력예방 및 대책에 관한 법률」 제12조에 따른 학교폭력대책심의위원회 개최 및 동 위원회의 학교폭력 피해학생에 대한 보호조치 요청 이전에, 학교폭력 피해자가 학교폭력으로 인한 피해로 출석하지 못하였음을 같은 법 제14조제3항에 따른 학교폭력 전담기구의 사실 확인을 거쳐 학교의 장이 인정한 경우</p>
          <p style={{ marginBottom: "2px" }}>9) 시도경찰청 ｢소년업무규칙｣에 따른 경찰관서의 선도프로그램에 참여하는 경우</p>
          <p style={{ marginBottom: "2px" }}>10) 「공직선거법」 및 「지방교육자치에 관한 법률」에 따라 투표에 참가하는 경우</p>
          <p style={{ marginBottom: "2px" }}>11) ｢공직선거법｣에 따라 공직에 선출되어 의정활동(본회의, 상임위원회 회의 당일 참석)을사유로 수업일수의 10% 이내에서 결석하는 경우</p>
          <p style={{ marginBottom: "2px" }}>12) 학교장은 여학생 중 생리통이 극심해 출석이 어려운 경우(월 1일 결석)에는 위 7)의 '기타 부득이한 사유로 학교장의 허가를 받아 결석하는 경우'로 보아 출석인정 결석으로 처리한다.</p>
          <p style={{ marginBottom: "2px" }}>13) 그 밖에 법령 및 행정규칙에서 출석으로 인정하도록 한 경우</p>
        </div>
      </div>
    </div>
  );
}
