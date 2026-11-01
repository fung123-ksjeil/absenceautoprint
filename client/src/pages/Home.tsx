import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import AbsenceFormInput, { type AbsenceRecord } from "@/components/AbsenceFormInput";
import PreviewModal from "@/components/PreviewModal";
import SickAbsenceForm from "@/components/SickAbsenceForm";
import SpecialAbsenceForm from "@/components/SpecialAbsenceForm";
import { useToast } from "@/hooks/use-toast";
import { downloadHwpx } from "@/lib/hwpx";

export default function Home() {
  const { toast } = useToast();
  const [records, setRecords] = useState<AbsenceRecord[]>([
    {
      id: "1",
      studentId: "1101",
      studentName: "홍길동",
      reasonCode: "0",
      reasonDetail: "감기",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      daysCount: 1,
      submitDate: new Date().toISOString().split("T")[0],
      teacherName: "김선생",
    }
  ]);
  const [previewRecord, setPreviewRecord] = useState<AbsenceRecord | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [printRecords, setPrintRecords] = useState<AbsenceRecord[]>([]);
  const [shouldPrint, setShouldPrint] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (selected: AbsenceRecord[]) => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await downloadHwpx(selected);
      toast({ title: "원본 양식 파일 생성 완료", description: "내려받은 HWPX를 한글에서 열어 내용을 확인하고 인쇄해주세요. ZIP 파일은 먼저 압축을 풀어주세요." });
    } catch (error) {
      toast({ title: "파일 생성 실패", description: error instanceof Error ? error.message : "다시 시도해주세요.", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (shouldPrint && printRecords.length > 0) {
      const htmlElement = document.documentElement;
      const bodyElement = document.body;
      const wasDarkMode = htmlElement.classList.contains('dark');
      
      const originalHtmlBg = htmlElement.style.backgroundColor;
      const originalBodyBg = bodyElement.style.backgroundColor;
      
      if (wasDarkMode) {
        htmlElement.classList.remove('dark');
      }
      
      htmlElement.style.backgroundColor = '#ffffff';
      bodyElement.style.backgroundColor = '#ffffff';

      const restoreStyles = () => {
        if (wasDarkMode) {
          htmlElement.classList.add('dark');
        }
        htmlElement.style.backgroundColor = originalHtmlBg;
        bodyElement.style.backgroundColor = originalBodyBg;
        toast({
          title: "출력 요청 완료",
          description: "프린터 대화상자가 열렸습니다.",
        });
        setShouldPrint(false);
        window.removeEventListener('afterprint', restoreStyles);
      };

      window.addEventListener('afterprint', restoreStyles);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.print();
          });
        });
      });
    }
  }, [shouldPrint, printRecords, toast]);

  const handleAddRecord = () => {
    const today = new Date().toISOString().split("T")[0];
    const newRecord: AbsenceRecord = {
      id: Date.now().toString(),
      studentId: "",
      studentName: "",
      reasonCode: "0",
      reasonDetail: "",
      startDate: "",
      endDate: "",
      daysCount: 1,
      submitDate: today,
      teacherName: "",
    };
    setRecords([...records, newRecord]);
  };

  const handleUpdateRecord = (id: string, field: keyof AbsenceRecord, value: string | number) => {
    setRecords(prevRecords => prevRecords.map((r) => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
    toast({
      title: "삭제 완료",
      description: "결석 정보가 삭제되었습니다.",
    });
  };

  const handlePreview = (record: AbsenceRecord) => {
    setPreviewRecord(record);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewRecord(null);
  };

  const validateRecords = (recordsToValidate: AbsenceRecord[]): boolean => {
    for (const record of recordsToValidate) {
      if (!record.studentId || !record.studentName || !record.startDate || !record.endDate || !record.teacherName) {
        toast({
          title: "입력 오류",
          description: `${record.studentName || "이름 없음"} 학생의 필수 정보를 모두 입력해주세요.`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handlePrintSingle = () => {
    if (previewRecord) {
      if (!validateRecords([previewRecord])) return;
      setIsPreviewOpen(false);
      setTimeout(() => {
        setPrintRecords([previewRecord]);
        setShouldPrint(true);
      }, 300);
    }
  };

  const handlePrintAll = () => {
    if (records.length === 0) {
      toast({
        title: "출력할 데이터 없음",
        description: "먼저 결석 정보를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!validateRecords(records)) return;

    setPrintRecords(records);
    setShouldPrint(true);
  };

  return (
    <>
      <div className="min-h-screen bg-background no-print">
        <Header />
        
        <main className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <p className="text-muted-foreground text-sm">
              학생들의 결석 정보를 입력하고 결석신고서를 자동으로 생성하여 출력할 수 있습니다.
            </p>
            <p className="text-sm mt-2">
              학교 원본 양식으로 출력하려면 ‘원본 HWPX 저장’으로 파일을 내려받아 한글에서 열고 인쇄해주세요.
              여러 건은 ZIP으로 저장됩니다. 웹 미리보기와 웹 인쇄는 원본 양식과 모양이 다를 수 있습니다.
            </p>
          </div>

          <AbsenceFormInput
            records={records}
            onAddRecord={handleAddRecord}
            onUpdateRecord={handleUpdateRecord}
            onDeleteRecord={handleDeleteRecord}
            onPreview={handlePreview}
            onPrintAll={handlePrintAll}
            onDownloadAll={() => handleDownload(records)}
            isDownloading={isDownloading}
          />

          <PreviewModal
            open={isPreviewOpen}
            onClose={handleClosePreview}
            record={previewRecord}
            onPrint={handlePrintSingle}
            onDownload={() => previewRecord && handleDownload([previewRecord])}
            isDownloading={isDownloading}
          />
        </main>
      </div>

      <div ref={printRef} className="print-only">
        {printRecords.map((record) => (
          <div key={record.id} className="print-page">
            {record.reasonCode === "0" ? (
              <SickAbsenceForm record={record} />
            ) : (
              <SpecialAbsenceForm record={record} />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
