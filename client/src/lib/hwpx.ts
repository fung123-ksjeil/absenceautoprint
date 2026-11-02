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

function koreanDate(value: string, spacing = " ") {
  const [year, month, day] = dateParts(value);
  return `${year}년${spacing}${month}월${spacing}${day}일`;
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
  const isSick = record.reasonCode === "0";
  const [submitYear, submitMonth, submitDay] = dateParts(record.submitDate);
  const values: Record<string, string> = {
    studentId: record.studentId,
    studentName: record.studentName,
    reasonDetail: record.reasonDetail,
    reasonCode: record.reasonCode,
    startDate: koreanDate(record.startDate, isSick ? " " : "   "),
    endDate: koreanDate(record.endDate, isSick ? " " : "   "),
    daysCount: String(record.daysCount),
    submitDate: `${submitYear}년    ${submitMonth}월   ${submitDay}일`,
    submitYear: String(submitYear),
    submitMonth: String(submitMonth),
    submitDay: String(submitDay),
    teacherName: record.teacherName,
  };
  const expected = ["studentId", "studentName", "reasonDetail", "startDate", "endDate", "daysCount", "teacherName",
    ...(isSick ? ["submitYear", "submitMonth", "submitDay"] : ["reasonCode", "submitDate"])];
  const counts: Record<string, number> = {};
  const fillText = (text: string, escape: boolean) => text.replace(/\{\{([A-Za-z]+)\}\}/g, (_token, key: string) => {
    if (!expected.includes(key)) throw new Error("원본 양식의 입력 위치가 일치하지 않습니다. 양식 파일을 확인해주세요.");
    if (escape) counts[key] = (counts[key] ?? 0) + 1;
    return escape ? escapeXml(values[key]) : values[key];
  });
  // Nested paragraphs occur inside the special form's guidance field.
  // Edit raw XML ranges so their controls and text-run styling remain intact.
  const edits: { start: number; end: number; value: string }[] = [];
  const paragraphs: { changed: boolean; caches: { start: number; end: number }[] }[] = [];
  const tokens = /<hp:p\b[^>]*>|<\/hp:p>|<hp:t>[\s\S]*?<\/hp:t>|<hp:linesegarray\b[^>]*>[\s\S]*?<\/hp:linesegarray>/g;
  let match: RegExpExecArray | null;
  while ((match = tokens.exec(xml)) !== null) {
    const token = match[0];
    const range = { start: match.index, end: tokens.lastIndex };
    if (token.startsWith("<hp:p")) {
      paragraphs.push({ changed: false, caches: [] });
    } else if (token === "</hp:p>") {
      const paragraph = paragraphs.pop();
      if (paragraph?.changed) paragraph.caches.forEach(cache => edits.push({ ...cache, value: "" }));
    } else if (token.startsWith("<hp:linesegarray")) {
      paragraphs[paragraphs.length - 1]?.caches.push(range);
    } else if (/\{\{[A-Za-z]+\}\}/.test(token)) {
      edits.push({ ...range, value: `<hp:t>${fillText(token.slice(6, -7), true)}</hp:t>` });
      const paragraph = paragraphs[paragraphs.length - 1];
      if (paragraph) paragraph.changed = true;
    }
  }
  edits.sort((a, b) => b.start - a.start).forEach(edit => {
    xml = xml.slice(0, edit.start) + edit.value + xml.slice(edit.end);
  });
  if (expected.some(key => counts[key] !== 1)) throw new Error("원본 양식의 입력 위치가 일치하지 않습니다. 양식 파일을 확인해주세요.");
  // Replace once: user input containing placeholder-like text is never processed again.
  preview = fillText(preview, false);
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
