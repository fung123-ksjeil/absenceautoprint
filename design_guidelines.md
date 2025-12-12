# Design Guidelines: 중학교 결석계 자동 출력 웹앱

## Design Approach
**System-Based Design** using Material Design principles for data-heavy administrative interface with professional institutional aesthetics suitable for Korean educational settings.

## Core Design Elements

### Typography
- **Primary Font**: Noto Sans KR (Google Fonts) for Korean text - weights 400, 500, 700
- **Headings**: text-2xl to text-4xl, font-medium to font-bold
- **Body**: text-base for forms, text-sm for helper text
- **Print Documents**: Gulim/Batang for official form compliance

### Layout System
**Spacing Units**: Consistent use of 4, 8, 16, 24, 32 (p-4, m-8, gap-4, py-8, etc.)
- Form containers: max-w-6xl centered
- Input groups: gap-4 for tight spacing, gap-6 for section separation
- Document preview: max-w-4xl for A4 proportions

### Component Library

**Navigation**
- Fixed header with app title "결석계 자동 출력 시스템", minimal navigation
- Breadcrumb or tab navigation between "입력 폼" and "출력 미리보기"

**Forms**
- Table-based bulk input interface (similar to Excel experience)
- Columns: 학번, 성명, 결석구분, 사유코드, 사유, 시작일, 종료일, 일수, 제출일, 담임
- Inline validation with clear error states
- "행 추가" button for new entries
- Dropdown selects for 사유코드 (0-10) with descriptions
- Date pickers for start/end dates
- Auto-calculate 결석일수 based on date range

**Data Display**
- Clean table with alternating row backgrounds (hover states)
- Action buttons per row: "미리보기", "삭제"
- Summary panel: "총 {n}건" display
- Batch action bar: "전체 미리보기", "전체 출력"

**Document Preview**
- Modal overlay or dedicated preview section
- Pixel-perfect recreation of Word document layouts
- Two templates:
  - 질병결석신고서: Centered title (30pt equivalent), formal layout
  - 특별결석신고서: Title with underline, approval stamp placeholder, footnotes
- Print-optimized CSS with @media print rules
- "출력하기" prominent button

**Overlays**
- Confirmation modals for batch operations
- Success/error toast notifications
- Print queue progress indicator

### Visual Hierarchy
- Primary actions (출력, 미리보기) in prominent blue
- Destructive actions (삭제) in subdued red
- Form validation errors in clear red with icon indicators
- Success states in green

### Professional Touches
- School name/logo placeholder in header: "군산제일중학교"
- Official stamp/seal image placeholder in 특별결석신고서
- Clean, institutional color palette (blues, grays, minimal accent colors)
- Crisp borders and dividers (border-gray-200/300)

### Responsive Considerations
- Desktop-first (primary use case)
- Table scrolls horizontally on smaller screens
- Mobile: Stack form inputs vertically, preserve functionality

### Print Optimization
- @media print: Hide navigation, buttons, non-essential UI
- White background, black text for documents
- Preserve exact spacing and typography for official forms
- Page break controls for multi-document printing

## Images
No hero images needed. Include:
- School logo/emblem placeholder in header (50x50px, subtle)
- Approval stamp image placeholder in 특별결석신고서 template (삽입이미지.png equivalent, positioned top-right)