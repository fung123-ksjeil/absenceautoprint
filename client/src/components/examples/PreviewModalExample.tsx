import { useState } from "react";
import PreviewModal from "../PreviewModal";
import { Button } from "@/components/ui/button";
import type { AbsenceRecord } from "../AbsenceFormInput";

// todo: remove mock functionality
const mockRecord: AbsenceRecord = {
  id: "1",
  studentId: "1626",
  studentName: "김하하",
  reasonCode: "0",
  reasonDetail: "몸살",
  startDate: "2024-03-11",
  endDate: "2024-03-11",
  daysCount: 1,
  submitDate: "2024-03-12",
  teacherName: "김정민",
};

export default function PreviewModalExample() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>미리보기 열기</Button>
      <PreviewModal
        open={open}
        onClose={() => setOpen(false)}
        record={mockRecord}
        onPrint={() => console.log("Print triggered")}
      />
    </div>
  );
}
