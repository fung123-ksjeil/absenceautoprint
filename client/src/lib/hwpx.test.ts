import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { strFromU8, unzipSync } from "fflate";
import { fillHwpx, hwpxFilename, validateHwpxRecord } from "./hwpx";

const record = {
  id: "1", studentId: "1101", studentName: "홍길동", reasonCode: "0",
  reasonDetail: "감기", startDate: "2026-11-01", endDate: "2026-11-02",
  daysCount: 2, submitDate: "2026-11-03", teacherName: "김선생",
};

for (const kind of ["sick", "special"]) {
  test(`${kind}: fill every field and preserve original non-text resources`, () => {
    const template = readFileSync(`client/public/templates/${kind}.hwpx`);
    const original = unzipSync(template);
    const input = { ...record, reasonCode: kind === "sick" ? "0" : "12" };
    const bytes = fillHwpx(template, input);
    const output = unzipSync(bytes);
    assert.deepEqual(Object.keys(output), Object.keys(original));
    for (const name of Object.keys(original)) {
      if (name !== "Contents/section0.xml" && name !== "Preview/PrvText.txt") {
        assert.deepEqual(output[name], original[name], name);
      }
    }
    assert.equal(new DataView(bytes.buffer, bytes.byteOffset).getUint16(8, true), 0, "mimetype stored uncompressed");
    const xml = strFromU8(output["Contents/section0.xml"]);
    const cacheCount = (text: string) => (text.match(/<hp:linesegarray>/g) ?? []).length;
    assert.equal(cacheCount(strFromU8(original["Contents/section0.xml"])) - cacheCount(xml), 5,
      "invalidate only the five edited paragraphs, preserving nested memo layout");
    const gap = kind === "sick" ? " " : "   ";
    for (const value of [input.studentName, input.studentId, input.reasonDetail, input.teacherName, `2026년${gap}11월${gap}1일`, `2026년${gap}11월${gap}2일`]) {
      assert.ok(xml.includes(value), value);
      assert.ok(strFromU8(output["Preview/PrvText.txt"]).includes(value), `preview: ${value}`);
    }
    assert.ok(xml.includes(kind === "sick" ? "2026.  11 .  3  . " : "2026년    11월   3일"));
    assert.ok(xml.includes(kind === "sick" ? "(2)일간" : "(  2일간)"));
    const tags = (text: string) => text.replace(/<hp:linesegarray\b[^>]*>[\s\S]*?<\/hp:linesegarray>/g, "").replace(/<hp:t>[\s\S]*?<\/hp:t>/g, "<hp:t/>");
    assert.equal(tags(xml), tags(strFromU8(original["Contents/section0.xml"])), "all styles, tables, paragraph properties preserved");
    if (kind === "special") {
      assert.ok(xml.includes("<hp:t>학업성적관리규정 (</hp:t>"));
      assert.ok(xml.includes("<hp:t>  12  </hp:t>"));
      assert.ok(xml.includes("<hp:t>)번</hp:t>"));
      const regulation = (s: string) => s.slice(s.indexOf("※ 학업성적관리규정"));
      assert.equal(regulation(xml), regulation(strFromU8(original["Contents/section0.xml"])));
    }
  });
}

test("escape XML metacharacters and do not reprocess inserted placeholders", () => {
  const bytes = fillHwpx(readFileSync("client/public/templates/special.hwpx"), {
    ...record, reasonCode: "6", studentName: "김<&>\"'", reasonDetail: "{{studentName}} & <사유>",
  });
  const xml = strFromU8(unzipSync(bytes)["Contents/section0.xml"]);
  assert.ok(xml.includes("김&lt;&amp;&gt;&quot;&apos;"));
  assert.ok(xml.includes("{{studentName}} &amp; &lt;사유&gt;"));
});

test("all special reason codes fill the styled number run without changing memo guidance", () => {
  const template = readFileSync("client/public/templates/special.hwpx");
  for (let code = 1; code <= 13; code++) {
    const xml = strFromU8(unzipSync(fillHwpx(template, { ...record, reasonCode: String(code) }))["Contents/section0.xml"]);
    assert.ok(xml.includes(`<hp:t>  ${code}  </hp:t>`));
    assert.ok(xml.includes("생리통: 12번"), "keep original memo guidance regardless of selected reason");
  }
});

test("reject invalid data and template mismatch", () => {
  for (const patch of [
    { startDate: "2026-02-30" }, { startDate: "2026-11-04" }, { submitDate: "" },
    { daysCount: 0 }, { daysCount: 1.5 }, { reasonCode: "14" }, { reasonDetail: " " },
    { studentName: "bad\u0001" },
  ]) assert.throws(() => validateHwpxRecord({ ...record, ...patch }));
  assert.throws(() => fillHwpx(readFileSync("client/public/templates/sick.hwpx"), { ...record, reasonCode: "1" }), /입력 위치/);
  assert.ok(!hwpxFilename({ ...record, studentName: "../../A:B" }).includes("/"));
});
