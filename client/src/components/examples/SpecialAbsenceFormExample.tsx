import SpecialAbsenceForm from "../SpecialAbsenceForm";
import type { AbsenceRecord } from "../AbsenceFormInput";

// todo: remove mock functionality
const mockRecord: AbsenceRecord = {
  id: "2",
  studentId: "1617",
  studentName: "윤크크",
  reasonCode: "1",
  reasonDetail: "독감",
  startDate: "2024-03-13",
  endDate: "2024-03-15",
  daysCount: 3,
  submitDate: "2024-03-18",
  teacherName: "김정민",
};

export default function SpecialAbsenceFormExample() {
  return (
    <div className="bg-gray-100 p-4">
      <div className="transform scale-50 origin-top-left">
        <SpecialAbsenceForm record={mockRecord} />
      </div>
    </div>
  );
}
