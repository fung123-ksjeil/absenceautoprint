import SickAbsenceForm from "../SickAbsenceForm";
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

export default function SickAbsenceFormExample() {
  return (
    <div className="bg-gray-100 p-4">
      <div className="transform scale-50 origin-top-left">
        <SickAbsenceForm record={mockRecord} />
      </div>
    </div>
  );
}
