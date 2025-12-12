import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Trash2, Eye, Printer, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export interface AbsenceRecord {
  id: string;
  studentId: string;
  studentName: string;
  reasonCode: string;
  reasonDetail: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  submitDate: string;
  teacherName: string;
}

interface AbsenceFormInputProps {
  records: AbsenceRecord[];
  onAddRecord: () => void;
  onUpdateRecord: (id: string, field: keyof AbsenceRecord, value: string | number) => void;
  onDeleteRecord: (id: string) => void;
  onPreview: (record: AbsenceRecord) => void;
  onPrintAll: () => void;
}

const REASON_CODES = [
  { value: "0", label: "0: 질병결석" },
  { value: "1", label: "1: 특별결석, 천재지변,전염병" },
  { value: "2", label: "2: 특별결석, 공적의무 또는 공권력 행사" },
  { value: "3", label: "3: 특별결석, 교외체험학습 등" },
  { value: "4", label: "4: 특별결석, 경조사" },
  { value: "5", label: "5: 특별결석, 징계" },
  { value: "6", label: "6: 특별결석, 생리통" },
  { value: "7", label: "7: 특별결석, 건강장애" },
  { value: "8", label: "8: 특별결석, 화상강의" },
  { value: "9", label: "9: 특별결석, 대안교육" },
  { value: "10", label: "10: 특별결석, 기타" },
];

function DatePickerButton({ 
  value, 
  onChange, 
  placeholder,
  testId 
}: { 
  value: string; 
  onChange: (date: string) => void; 
  placeholder: string;
  testId: string;
}) {
  const [open, setOpen] = useState(false);
  const dateValue = value ? new Date(value) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, "yyyy-MM-dd"));
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
          data-testid={testId}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "yyyy-MM-dd") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleSelect}
          locale={ko}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default function AbsenceFormInput({
  records,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
  onPreview,
  onPrintAll,
}: AbsenceFormInputProps) {

  return (
    <Card className="no-print">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
        <CardTitle className="text-xl font-medium">결석 정보 입력</CardTitle>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">
            총 {records.length}건
          </span>
          <Button onClick={onAddRecord} size="sm" data-testid="button-add-record">
            <Plus className="h-4 w-4 mr-1" />
            행 추가
          </Button>
          <Button
            onClick={onPrintAll}
            variant="default"
            size="sm"
            disabled={records.length === 0}
            data-testid="button-print-all"
          >
            <Printer className="h-4 w-4 mr-1" />
            전체 출력
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {records.length === 0 ? (
            <div className="text-center text-muted-foreground py-8 border rounded-md">
              결석 정보를 입력해주세요. "행 추가" 버튼을 클릭하여 시작하세요.
            </div>
          ) : (
            <>
              <div className="hidden lg:grid lg:grid-cols-[40px_70px_70px_120px_100px_120px_120px_50px_120px_70px_70px] gap-2 px-2 text-xs text-muted-foreground font-medium">
                <div>#</div>
                <div>학번</div>
                <div>성명</div>
                <div>사유코드</div>
                <div>사유내용</div>
                <div>시작일</div>
                <div>종료일</div>
                <div>일수</div>
                <div>제출일</div>
                <div>담임</div>
                <div></div>
              </div>
              {records.map((record, index) => (
                <div 
                  key={record.id} 
                  className="border rounded-md p-2 lg:p-0 lg:border-0 lg:grid lg:grid-cols-[40px_70px_70px_120px_100px_120px_120px_50px_120px_70px_70px] gap-2 items-center"
                  data-testid={`row-record-${record.id}`}
                >
                  <div className="hidden lg:flex items-center justify-center text-sm text-muted-foreground font-medium">
                    {index + 1}
                  </div>
                  <div className="lg:hidden flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" onClick={() => onPreview(record)} data-testid={`button-preview-${record.id}`}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => onDeleteRecord(record.id)} data-testid={`button-delete-${record.id}`}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 lg:contents gap-2 mb-2 lg:mb-0">
                    <Input
                      value={record.studentId}
                      onChange={(e) => onUpdateRecord(record.id, "studentId", e.target.value)}
                      placeholder="학번"
                      className="text-sm"
                      data-testid={`input-studentId-${record.id}`}
                    />
                    <Input
                      value={record.studentName}
                      onChange={(e) => onUpdateRecord(record.id, "studentName", e.target.value)}
                      placeholder="성명"
                      className="text-sm"
                      data-testid={`input-studentName-${record.id}`}
                    />
                    <Select
                      value={record.reasonCode}
                      onValueChange={(value) => onUpdateRecord(record.id, "reasonCode", value)}
                    >
                      <SelectTrigger className="text-sm" data-testid={`select-reasonCode-${record.id}`}>
                        <SelectValue placeholder="사유" />
                      </SelectTrigger>
                      <SelectContent>
                        {REASON_CODES.map((code) => (
                          <SelectItem key={code.value} value={code.value}>
                            {code.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={record.reasonDetail}
                      onChange={(e) => onUpdateRecord(record.id, "reasonDetail", e.target.value)}
                      placeholder="사유내용"
                      className="text-sm"
                      data-testid={`input-reasonDetail-${record.id}`}
                    />
                  </div>

                  <div className="grid grid-cols-5 lg:contents gap-2">
                    <DatePickerButton
                      value={record.startDate}
                      onChange={(date) => onUpdateRecord(record.id, "startDate", date)}
                      placeholder="시작일"
                      testId={`input-startDate-${record.id}`}
                    />
                    <DatePickerButton
                      value={record.endDate}
                      onChange={(date) => onUpdateRecord(record.id, "endDate", date)}
                      placeholder="종료일"
                      testId={`input-endDate-${record.id}`}
                    />
                    <Input
                      type="number"
                      value={record.daysCount}
                      onChange={(e) => onUpdateRecord(record.id, "daysCount", parseInt(e.target.value) || 0)}
                      placeholder="일수"
                      className="text-sm text-center"
                      data-testid={`input-daysCount-${record.id}`}
                    />
                    <DatePickerButton
                      value={record.submitDate}
                      onChange={(date) => onUpdateRecord(record.id, "submitDate", date)}
                      placeholder="제출일"
                      testId={`input-submitDate-${record.id}`}
                    />
                    <Input
                      value={record.teacherName}
                      onChange={(e) => onUpdateRecord(record.id, "teacherName", e.target.value)}
                      placeholder="담임"
                      className="text-sm"
                      data-testid={`input-teacherName-${record.id}`}
                    />
                  </div>

                  <div className="hidden lg:flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => onPreview(record)} data-testid={`button-preview-lg-${record.id}`}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onDeleteRecord(record.id)} data-testid={`button-delete-lg-${record.id}`}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
