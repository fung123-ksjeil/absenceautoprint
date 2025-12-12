import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Eye, Printer } from "lucide-react";

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

function calculateDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

export default function AbsenceFormInput({
  records,
  onAddRecord,
  onUpdateRecord,
  onDeleteRecord,
  onPreview,
  onPrintAll,
}: AbsenceFormInputProps) {
  const handleDateChange = (id: string, field: "startDate" | "endDate", value: string) => {
    onUpdateRecord(id, field, value);
    const record = records.find((r) => r.id === id);
    if (record) {
      const startDate = field === "startDate" ? value : record.startDate;
      const endDate = field === "endDate" ? value : record.endDate;
      const days = calculateDays(startDate, endDate);
      onUpdateRecord(id, "daysCount", days);
    }
  };

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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[80px]">학번</TableHead>
                <TableHead className="min-w-[80px]">성명</TableHead>
                <TableHead className="min-w-[180px]">사유코드</TableHead>
                <TableHead className="min-w-[120px]">사유 내용</TableHead>
                <TableHead className="min-w-[140px]">시작일</TableHead>
                <TableHead className="min-w-[140px]">종료일</TableHead>
                <TableHead className="min-w-[60px]">일수</TableHead>
                <TableHead className="min-w-[140px]">제출일</TableHead>
                <TableHead className="min-w-[80px]">담임</TableHead>
                <TableHead className="min-w-[100px]">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                    결석 정보를 입력해주세요. "행 추가" 버튼을 클릭하여 시작하세요.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id} data-testid={`row-record-${record.id}`}>
                    <TableCell>
                      <Input
                        value={record.studentId}
                        onChange={(e) => onUpdateRecord(record.id, "studentId", e.target.value)}
                        placeholder="1234"
                        className="min-w-[70px]"
                        data-testid={`input-studentId-${record.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={record.studentName}
                        onChange={(e) => onUpdateRecord(record.id, "studentName", e.target.value)}
                        placeholder="홍길동"
                        className="min-w-[70px]"
                        data-testid={`input-studentName-${record.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={record.reasonCode}
                        onValueChange={(value) => onUpdateRecord(record.id, "reasonCode", value)}
                      >
                        <SelectTrigger className="min-w-[160px]" data-testid={`select-reasonCode-${record.id}`}>
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {REASON_CODES.map((code) => (
                            <SelectItem key={code.value} value={code.value}>
                              {code.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={record.reasonDetail}
                        onChange={(e) => onUpdateRecord(record.id, "reasonDetail", e.target.value)}
                        placeholder="몸살"
                        className="min-w-[100px]"
                        data-testid={`input-reasonDetail-${record.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="date"
                        value={record.startDate}
                        onChange={(e) => handleDateChange(record.id, "startDate", e.target.value)}
                        className="flex h-9 w-full min-w-[140px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        data-testid={`input-startDate-${record.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="date"
                        value={record.endDate}
                        onChange={(e) => handleDateChange(record.id, "endDate", e.target.value)}
                        className="flex h-9 w-full min-w-[140px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        data-testid={`input-endDate-${record.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={record.daysCount}
                        onChange={(e) => onUpdateRecord(record.id, "daysCount", parseInt(e.target.value) || 0)}
                        className="min-w-[50px] text-center"
                        data-testid={`input-daysCount-${record.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="date"
                        value={record.submitDate}
                        onChange={(e) => onUpdateRecord(record.id, "submitDate", e.target.value)}
                        className="flex h-9 w-full min-w-[140px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        data-testid={`input-submitDate-${record.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={record.teacherName}
                        onChange={(e) => onUpdateRecord(record.id, "teacherName", e.target.value)}
                        placeholder="김교사"
                        className="min-w-[70px]"
                        data-testid={`input-teacherName-${record.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onPreview(record)}
                          data-testid={`button-preview-${record.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDeleteRecord(record.id)}
                          data-testid={`button-delete-${record.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
