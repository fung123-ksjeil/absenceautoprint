import { FileText } from "lucide-react";

export default function Header() {
  return (
    <header className="no-print border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold">결석계 자동 출력 시스템</h1>
          <p className="text-xs text-muted-foreground">군산제일중학교</p>
        </div>
      </div>
    </header>
  );
}
