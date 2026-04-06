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
  { value: "1", label: "1: 특별결석(천재지변,법정감염병)" },
  { value: "2", label: "2: 특별결석(공적의무,공권력행사)" },
  { value: "3", label: "3: 특별결석(교외체험학습 등)" },
  { value: "4", label: "4: 특별결석(봉사 및 특별교육이수)" },
  { value: "5", label: "5: 특별결석(숙려제 참여)" },
  { value: "6", label: "6: 특별결석(경조사)" },
  { value: "7", label: "7: 특별결석(기타 부득이한 사유)" },
  { value: "8", label: "8: 특별결석(학교폭력관련)" },
  { value: "9", label: "9: 특별결석(경찰관서 선도프로그램)" },
  { value: "10", label: "10: 특별결석(투표 참가)" },
  { value: "11", label: "11: 특별결석(의정활동)" },
  { value: "12", label: "12: 특별결석(생리통)" },
  { value: "13", label: "13: 특별결석(법령 및 행정규칙 상 인정)" },
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
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">{value ? format(new Date(value), "yyyy-MM-dd") : placeholder}</span>
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
        <div className="space-y-3">
          {records.length === 0 ? (
            <div className="text-center text-muted-foreground py-8 border rounded-md">
              결석 정보를 입력해주세요. "행 추가" 버튼을 클릭하여 시작하세요.
            </div>
          ) : (
            <>
              <div className="hidden xl:grid xl:grid-cols-[3rem_1fr_1fr_1fr_1fr_1fr_1fr_4rem_1fr_1fr_5rem] gap-3 px-3 py-2 bg-muted/50 rounded-md text-sm text-muted-foreground font-medium">
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
                  className="border rounded-md p-3 xl:p-0 xl:border-0 xl:py-2 xl:px-3 xl:hover:bg-muted/30 xl:grid xl:grid-cols-[3rem_1fr_1fr_1fr_1fr_1fr_1fr_4rem_1fr_1fr_5rem] gap-3 items-center"
                  data-testid={`row-record-${record.id}`}
                >
                  <div className="hidden xl:flex items-center text-sm text-muted-foreground font-medium">
                    {index + 1}
                  </div>
                  
                  <div className="xl:hidden flex items-center justify-between mb-3">
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

                  <div className="grid grid-cols-2 md:grid-cols-4 xl:contents gap-3 mb-3 xl:mb-0">
                    <div className="xl:contents">
                      <label className="text-xs text-muted-foreground mb-1 block xl:hidden">학번</label>
                      <Input
                        value={record.studentId}
                        onChange={(e) => onUpdateRecord(record.id, "studentId", e.target.value)}
                        placeholder="학번"
                        data-testid={`input-studentId-${record.id}`}
                      />
                    </div>
                    <div className="xl:contents">
                      <label className="text-xs text-muted-foreground mb-1 block xl:hidden">성명</label>
                      <Input
                        value={record.studentName}
                        onChange={(e) => onUpdateRecord(record.id, "studentName", e.target.value)}
                        placeholder="성명"
                        data-testid={`input-studentName-${record.id}`}
                      />
                    </div>
                    <div className="xl:contents">
                      <label className="text-xs text-muted-foreground mb-1 block xl:hidden">사유코드</label>
                      <Select
                        value={record.reasonCode}
                        onValueChange={(value) => onUpdateRecord(record.id, "reasonCode", value)}
                      >
                        <SelectTrigger data-testid={`select-reasonCode-${record.id}`}>
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
                    </div>
                    <div className="xl:contents">
                      <label className="text-xs text-muted-foreground mb-1 block xl:hidden">사유내용</label>
                      <Input
                        value={record.reasonDetail}
                        onChange={(e) => onUpdateRecord(record.id, "reasonDetail", e.target.value)}
                        placeholder="사유내용"
                        data-testid={`input-reasonDetail-${record.id}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 xl:contents gap-3">
                    <div className="xl:contents">
                      <label className="text-xs text-muted-foreground mb-1 block xl:hidden">시작일</label>
                      <DatePickerButton
                        value={record.startDate}
                        onChange={(date) => onUpdateRecord(record.id, "startDate", date)}
                        placeholder="시작일"
                        testId={`input-startDate-${record.id}`}
                      />
                    </div>
                    <div className="xl:contents">
                      <label className="text-xs text-muted-foreground mb-1 block xl:hidden">종료일</label>
                      <DatePickerButton
                        value={record.endDate}
                        onChange={(date) => onUpdateRecord(record.id, "endDate", date)}
                        placeholder="종료일"
                        testId={`input-endDate-${record.id}`}
                      />
                    </div>
                    <div className="xl:contents">
                      <label className="text-xs text-muted-foreground mb-1 block xl:hidden">일수</label>
                      <Input
                        type="number"
                        value={record.daysCount}
                        onChange={(e) => onUpdateRecord(record.id, "daysCount", parseInt(e.target.value) || 0)}
                        className="text-center"
                        placeholder="일수"
                        data-testid={`input-daysCount-${record.id}`}
                      />
                    </div>
                    <div className="xl:contents">
                      <label className="text-xs text-muted-foreground mb-1 block xl:hidden">제출일</label>
                      <DatePickerButton
                        value={record.submitDate}
                        onChange={(date) => onUpdateRecord(record.id, "submitDate", date)}
                        placeholder="제출일"
                        testId={`input-submitDate-${record.id}`}
                      />
                    </div>
                    <div className="xl:contents">
                      <label className="text-xs text-muted-foreground mb-1 block xl:hidden">담임</label>
                      <Input
                        value={record.teacherName}
                        onChange={(e) => onUpdateRecord(record.id, "teacherName", e.target.value)}
                        placeholder="담임"
                        data-testid={`input-teacherName-${record.id}`}
                      />
                    </div>
                  </div>

                  <div className="hidden xl:flex items-center justify-end gap-1">
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
