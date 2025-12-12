import SickAbsenceForm from "./SickAbsenceForm";
import SpecialAbsenceForm from "./SpecialAbsenceForm";
import type { AbsenceRecord } from "./AbsenceFormInput";

interface PrintContainerProps {
  records: AbsenceRecord[];
}

export default function PrintContainer({ records }: PrintContainerProps) {
  return (
    <div className="print-only">
      {records.map((record) => (
        <div key={record.id}>
          {record.reasonCode === "0" ? (
            <SickAbsenceForm record={record} />
          ) : (
            <SpecialAbsenceForm record={record} />
          )}
        </div>
      ))}
    </div>
  );
}
