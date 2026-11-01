import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import type { AbsenceRecord } from "@/components/AbsenceFormInput";

function dateParts(value: string): [number, number, number] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("날짜를 모두 입력해주세요.");
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (year < 1900 || year > 9999 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error("올바른 날짜를 입력해주세요.");
  }
  return [year, month, day];
}

function koreanDate(value: string) {
  const [year, month, day] = dateParts(value);
  return `${year}년 ${month}월 ${day}일`;
}

export function validateHwpxRecord(record: AbsenceRecord) {
  for (const value of [record.studentId, record.studentName, record.reasonDetail, record.teacherName]) {
    if (!value.trim()) throw new Error("학번, 성명, 사유내용, 담임을 모두 입력해주세요.");
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/.test(value)) {
      throw new Error("입력 내용에 사용할 수 없는 문자가 있습니다.");
    }
  }
  if (!/^(?:[0-9]|1[0-3])$/.test(record.reasonCode)) throw new Error("결석 사유코드를 확인해주세요.");
  [record.startDate, record.endDate, record.submitDate].forEach(dateParts);
  if (record.startDate > record.endDate) throw new Error("종료일은 시작일보다 빠를 수 없습니다.");
  if (!Number.isSafeInteger(record.daysCount) || record.daysCount < 1) throw new Error("결석 일수는 1 이상의 정수로 입력해주세요.");
}

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

/** Replace only exact text nodes; keep the uploaded template's styles and objects intact. */
export function fillHwpx(template: Uint8Array, record: AbsenceRecord): Uint8Array {
  validateHwpxRecord(record);
  const files = unzipSync(template);
  const section = "Contents/section0.xml";
  if (!files[section] || strFromU8(files.mimetype ?? new Uint8Array()) !== "application/hwp+zip") {
    throw new Error("HWPX 원본 양식을 확인할 수 없습니다.");
  }
  let xml = strFromU8(files[section]);
  let preview = strFromU8(files["Preview/PrvText.txt"] ?? new Uint8Array());
  const replacements: [string, string][] = record.reasonCode === "0" ? [
    ["      학번:", `      학번: ${record.studentId}`],
    ["                                       성명: ", `                                       성명: ${record.studentName}`],
    ["위 본인은    년    월    일부터     년     월     일까지 (    )일간 (      )으로 인하여 결석하였기에 이를 확인하고 결석계를 제출합니다.",
      `위 본인은 ${koreanDate(record.startDate)}부터 ${koreanDate(record.endDate)}까지 ( ${record.daysCount} )일간 ( ${record.reasonDetail} )으로 인하여 결석하였기에 이를 확인하고 결석계를 제출합니다.`],
    ["                                    .   .    . ", `                                    ${dateParts(record.submitDate).join(". ")}.`],
    ["                               담 임 :          (인)", `                               담 임 : ${record.teacherName} (인)`],
  ] : [
    ["학번 : ", `학번 : ${record.studentId}`],
    ["                                                성명 : ", `                                                성명 : ${record.studentName}`],
    ["위 학생은 (  )으로 결석하였기에 ", `위 학생은 ( ${record.reasonDetail} )으로 결석하였기에 `],
    ["학교성적관리규정 제32조 (  )항", `학교성적관리규정 제32조 ( ${record.reasonCode} )항`],
    ["에 의거 서류를 첨부하여        년   월   일부터    년   월   일까지 (  일간) 출석으로 처리하고자 합니다.",
      `에 의거 서류를 첨부하여 ${koreanDate(record.startDate)}부터 ${koreanDate(record.endDate)}까지 ( ${record.daysCount} 일간) 출석으로 처리하고자 합니다.`],
    ["년   월  일", koreanDate(record.submitDate)],
    ["      담임       (인) ", `      담임 ${record.teacherName} (인) `],
  ];
  // Match each paragraph separately so only changed paragraphs lose stale line-layout caches.
  // Hancom recalculates these lines when opening the filled document.
  const counts = replacements.map(() => 0);
  xml = xml.replace(/<hp:p\b[^>]*>[\s\S]*?<\/hp:p>/g, paragraph => {
    let changed = false;
    const updated = paragraph.replace(/<hp:t>([\s\S]*?)<\/hp:t>/g, (node, text: string) => {
      const index = replacements.findIndex(([original]) => escapeXml(original) === text);
      if (index < 0) return node;
      counts[index]++;
      changed = true;
      return `<hp:t>${escapeXml(replacements[index][1])}</hp:t>`;
    });
    return changed ? updated.replace(/<hp:linesegarray\b[^>]*>[\s\S]*?<\/hp:linesegarray>/g, "") : updated;
  });
  if (counts.some(count => count !== 1)) throw new Error("원본 양식의 입력 위치가 일치하지 않습니다. 양식 파일을 확인해주세요.");
  // One pass prevents a user's text from being interpreted as another replacement target.
  const previewTargets = new Map(replacements);
  const pattern = new RegExp(replacements.map(([text]) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g");
  preview = preview.replace(pattern, text => previewTargets.get(text)!);
  files[section] = strToU8(xml);
  files["Preview/PrvText.txt"] = strToU8(preview);
  // HWPX requires the mimetype entry first and uncompressed.
  const { mimetype, ...rest } = files;
  return zipSync({ mimetype: [mimetype, { level: 0 }], ...rest });
}

export function hwpxFilename(record: AbsenceRecord) {
  const name = `${record.reasonCode === "0" ? "결석신고서" : "특별결석신고서"}_${record.studentId}_${record.studentName}_${record.startDate}`;
  return `${name.replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_").slice(0, 150)}.hwpx`;
}

function saveFile(bytes: Uint8Array, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export async function downloadHwpx(records: AbsenceRecord[]) {
  if (!records.length) throw new Error("먼저 결석 정보를 입력해주세요.");
  records.forEach(validateHwpxRecord);
  const templates = new Map<string, Uint8Array>();
  for (const kind of Array.from(new Set(records.map(r => r.reasonCode === "0" ? "sick" : "special")))) {
    const response = await fetch(`${import.meta.env.BASE_URL}templates/${kind}.hwpx`);
    if (!response.ok) throw new Error("원본 양식을 불러오지 못했습니다. 다시 시도해주세요.");
    templates.set(kind, new Uint8Array(await response.arrayBuffer()));
  }
  const documents = records.map(record => ({
    name: hwpxFilename(record),
    bytes: fillHwpx(templates.get(record.reasonCode === "0" ? "sick" : "special")!, record),
  }));
  if (documents.length === 1) {
    saveFile(documents[0].bytes, documents[0].name, "application/hwp+zip");
  } else {
    const files: Record<string, Uint8Array> = {};
    documents.forEach((doc, index) => { files[`${index + 1}_${doc.name}`] = doc.bytes; });
    saveFile(zipSync(files), "결석신고서_전체.zip", "application/zip");
  }
}
