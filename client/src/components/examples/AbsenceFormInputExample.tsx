import { useState } from "react";
import AbsenceFormInput, { type AbsenceRecord } from "../AbsenceFormInput";

// todo: remove mock functionality
const initialMockRecords: AbsenceRecord[] = [
  {
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
  },
  {
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
  },
];

export default function AbsenceFormInputExample() {
  const [records, setRecords] = useState<AbsenceRecord[]>(initialMockRecords);

  const handleAddRecord = () => {
    const newRecord: AbsenceRecord = {
      id: Date.now().toString(),
      studentId: "",
      studentName: "",
      reasonCode: "0",
      reasonDetail: "",
      startDate: "",
      endDate: "",
      daysCount: 0,
      submitDate: "",
      teacherName: "",
    };
    setRecords([...records, newRecord]);
  };

  const handleUpdateRecord = (id: string, field: keyof AbsenceRecord, value: string | number) => {
    setRecords(records.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  const handlePreview = (record: AbsenceRecord) => {
    console.log("Preview triggered for:", record);
  };

  const handlePrintAll = () => {
    console.log("Print all triggered");
  };

  return (
    <AbsenceFormInput
      records={records}
      onAddRecord={handleAddRecord}
      onUpdateRecord={handleUpdateRecord}
      onDeleteRecord={handleDeleteRecord}
      onPreview={handlePreview}
      onPrintAll={handlePrintAll}
    />
  );
}
