import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, X, Download } from "lucide-react";
import SickAbsenceForm from "./SickAbsenceForm";
import SpecialAbsenceForm from "./SpecialAbsenceForm";
import type { AbsenceRecord } from "./AbsenceFormInput";

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  record: AbsenceRecord | null;
  onPrint: () => void;
  onDownload: () => void;
  isDownloading: boolean;
}

export default function PreviewModal({ open, onClose, record, onPrint, onDownload, isDownloading }: PreviewModalProps) {
  if (!record) return null;

  const isSickAbsence = record.reasonCode === "0";
  const formTitle = isSickAbsence ? "질병결석신고서" : "특별결석신고서";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <span>{formTitle} 웹 미리보기 - {record.studentName}</span>
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          이 화면은 참고용입니다. 원본 HWPX 저장 후 한글에서 열어 학교 양식으로 인쇄해주세요.
        </p>
        
        <div className="border rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 p-4">
          <div className="transform scale-75 origin-top">
            {isSickAbsence ? (
              <SickAbsenceForm record={record} />
            ) : (
              <SpecialAbsenceForm record={record} />
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} data-testid="button-close-preview">
            <X className="h-4 w-4 mr-1" />
            닫기
          </Button>
          <Button variant="outline" onClick={onPrint} data-testid="button-print-single">
            <Printer className="h-4 w-4 mr-1" />
            웹 인쇄
          </Button>
          <Button onClick={onDownload} disabled={isDownloading} data-testid="button-download-single">
            <Download className="h-4 w-4 mr-1" />
            {isDownloading ? "생성 중…" : "원본 HWPX 저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
