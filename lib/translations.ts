const translations = {
  en: {
    header: {
      title: "Universal Document Converter",
      subtitle: "Effortlessly convert images to PDF and PDFs to LaTeX.",
      switchToDark: "Switch to dark mode",
      switchToLight: "Switch to light mode",
    },
    tabs: {
      imageToPdf: "Image to PDF",
      pdfToLatex: "PDF to LaTeX",
      latexSolver: "LaTeX Solver",
    },
    uploader: {
        clickToUpload: "Click to upload",
        orDragAndDrop: "or drag and drop",
        removeFile: "Remove file",
    },
    imageToPdf: {
      fileTypes: "PNG or WEBP images only",
      previewTitle: "Image Preview",
      orientationLabel: "Orientation",
      portrait: "Portrait",
      landscape: "Landscape",
      generateButton: "Generate PDF",
      clearButton: "Clear All",
      loaderMessage: "Generating PDF...",
      errorAlert: "An error occurred while generating the PDF. Please check the console."
    },
    pdfToLatex: {
      step1Title: "1. Upload your PDF",
      step2Title: "2. Get LaTeX Code",
      fileTypes: "PDF file only",
      buttonConvert: "Convert to LaTeX",
      buttonConverting: "Converting...",
      errorSelectFile: "Please select a PDF file first.",
      errorConversionFailed: "Failed to convert PDF.",
      errorUnknown: "An unknown error occurred."
    },
    latexSolver: {
      step1Title: "1. Upload Exercises",
      step2Title: "2. Get Detailed Solution",
      fileTypes: "PDF or .tex file",
      buttonGenerate: "Generate Solution",
      buttonGenerating: "Generating...",
      errorSelectFile: "Please select a PDF or .tex file first.",
      errorGenerationFailed: "Failed to generate solution.",
      errorUnknown: "An unknown error occurred."
    },
    latexOutput: {
      generating: "Generating LaTeX code...",
      errorTitle: "Generation Failed",
      placeholder: "Your generated LaTeX code will appear here.",
      copied: "Copied!",
      copy: "Copy to clipboard",
      download: "Download .tex file",
    },
    footer: {
      copyright: "Ver. 2025.11.06 | Author: Do Tran Vo Tien (FPT University)",
    },
  },
  vi: {
    header: {
      title: "Bộ chuyển đổi tài liệu đa năng",
      subtitle: "Chuyển đổi hình ảnh sang PDF và PDF sang LaTeX một cách dễ dàng.",
      switchToDark: "Chuyển sang chế độ tối",
      switchToLight: "Chuyển sang chế độ sáng",
    },
    tabs: {
      imageToPdf: "Ảnh sang PDF",
      pdfToLatex: "PDF sang LaTeX",
      latexSolver: "Giải bài tập LaTeX",
    },
    uploader: {
        clickToUpload: "Nhấp để tải lên",
        orDragAndDrop: "hoặc kéo và thả",
        removeFile: "Xóa tệp",
    },
    imageToPdf: {
      fileTypes: "Chỉ nhận tệp ảnh PNG hoặc WEBP",
      previewTitle: "Xem trước ảnh",
      orientationLabel: "Hướng giấy",
      portrait: "Dọc",
      landscape: "Ngang",
      generateButton: "Tạo PDF",
      clearButton: "Xóa tất cả",
      loaderMessage: "Đang tạo PDF...",
      errorAlert: "Đã xảy ra lỗi khi tạo PDF. Vui lòng kiểm tra console."
    },
    pdfToLatex: {
      step1Title: "1. Tải lên tệp PDF của bạn",
      step2Title: "2. Nhận mã LaTeX",
      fileTypes: "Chỉ nhận tệp PDF",
      buttonConvert: "Chuyển đổi sang LaTeX",
      buttonConverting: "Đang chuyển đổi...",
      errorSelectFile: "Vui lòng chọn một tệp PDF trước.",
      errorConversionFailed: "Không thể chuyển đổi PDF.",
      errorUnknown: "Một lỗi không xác định đã xảy ra."
    },
    latexSolver: {
      step1Title: "1. Tải lên bài tập",
      step2Title: "2. Nhận lời giải chi tiết",
      fileTypes: "Tệp PDF hoặc .tex",
      buttonGenerate: "Tạo lời giải",
      buttonGenerating: "Đang tạo...",
      errorSelectFile: "Vui lòng chọn tệp PDF hoặc .tex trước.",
      errorGenerationFailed: "Không thể tạo lời giải.",
      errorUnknown: "Một lỗi không xác định đã xảy ra."
    },
    latexOutput: {
      generating: "Đang tạo mã LaTeX...",
      errorTitle: "Tạo thất bại",
      placeholder: "Mã LaTeX được tạo của bạn sẽ xuất hiện ở đây.",
      copied: "Đã sao chép!",
      copy: "Sao chép vào clipboard",
      download: "Tải xuống tệp .tex",
    },
    footer: {
      copyright: "Ver. 2025.11.06 | Tác giả: Đỗ Trần Võ Tiến (Đại học FPT)",
    },
  },
};

export default translations as any;