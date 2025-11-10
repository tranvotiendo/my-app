import { GoogleGenAI } from "@google/genai";

const fileToGenerativePart = (file: File): Promise<{ inlineData: { data: string; mimeType: string; }; }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('Failed to read file as data URL.'));
      }
      const base64EncodedData = reader.result.split(',')[1];
      if (!base64EncodedData) {
        return reject(new Error('Could not extract base64 data from file.'));
      }
      resolve({
        inlineData: {
          data: base64EncodedData,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const prompts = {
    latexConverter: {
        en: `You are a LaTeX expert. Your task is to convert the content of the provided PDF file into a well-structured LaTeX document.
- The document should be formatted as a study guide.
- Use appropriate LaTeX commands for titles, sections, subsections, lists, mathematical formulas (if any), and code blocks.
- The main title should be 'Study Guide'.
- **Crucially, the original language and content of the document must be preserved perfectly.** Only format it into LaTeX.
- Ensure the output is clean, valid LaTeX code that can be compiled directly.
- Structure the document logically, allowing content to flow naturally across pages when compiled. Do not try to force all content onto a single page.
- Return only the raw LaTeX code, without any extra explanations, notes, or markdown formatting like \`\`\`latex.
- Start directly with \\documentclass{article}.`,
        vi: `Bạn là một chuyên gia về LaTeX. Nhiệm vụ của bạn là chuyển đổi nội dung của tệp PDF được cung cấp thành một tài liệu LaTeX có cấu trúc tốt.
- Tài liệu phải được định dạng như một tài liệu ôn tập (study guide).
- Sử dụng các lệnh LaTeX thích hợp cho tiêu đề, các mục, mục con, danh sách, công thức toán học (nếu có), và các khối mã.
- Tiêu đề chính phải là 'Tài liệu ôn tập'.
- **Điều quan trọng là ngôn ngữ và nội dung gốc của tài liệu phải được giữ nguyên một cách hoàn hảo.** Chỉ định dạng nó thành LaTeX.
- Đảm bảo đầu ra là mã LaTeX sạch, hợp lệ có thể biên dịch trực tiếp.
- Sắp xếp tài liệu một cách logic, cho phép nội dung chảy tự nhiên qua các trang khi biên dịch. Đừng cố gắng ép buộc tất cả nội dung vào một trang duy nhất.
- Chỉ trả về mã LaTeX thô, không có giải thích, ghi chú hay định dạng markdown như \`\`\`latex.
- Bắt đầu trực tiếp với \\documentclass{article}.`
    },
    latexSolver: {
        en: `You are an expert university-level tutor. Your task is to analyze the exercises in the provided PDF or LaTeX file and generate a detailed, step-by-step solution guide.
- The output must be a complete and valid LaTeX document.
- For each exercise, provide a clear, detailed explanation of the solution process, including any relevant formulas, theories, or concepts.
- The goal is to help a student understand *how* to arrive at the answer, not just to provide the answer itself.
- Preserve the original questions from the document and follow them with your detailed solutions.
- Structure the output logically with a main title 'Exercise Solution Guide', using sections for each question.
- **The language of your explanation should match the primary language of the input document.**
- Return only the raw LaTeX code, without any extra explanations or markdown formatting.
- Start directly with \\documentclass{article}.`,
        vi: `Bạn là một gia sư chuyên nghiệp trình độ đại học. Nhiệm vụ của bạn là phân tích các bài tập trong tệp PDF hoặc LaTeX được cung cấp và tạo ra một tài liệu hướng dẫn giải chi tiết, từng bước.
- Đầu ra phải là một tài liệu LaTeX hoàn chỉnh và hợp lệ.
- Đối với mỗi bài tập, hãy cung cấp một lời giải thích rõ ràng, chi tiết về quá trình giải, bao gồm mọi công thức, lý thuyết hoặc khái niệm liên quan.
- Mục tiêu là giúp sinh viên hiểu *cách* để đi đến câu trả lời, chứ không chỉ cung cấp đáp án.
- Giữ nguyên các câu hỏi gốc từ tài liệu và trình bày lời giải chi tiết của bạn ngay sau đó.
- Cấu trúc đầu ra một cách logic với tiêu đề chính là 'Hướng dẫn giải bài tập', sử dụng các section cho mỗi câu hỏi.
- **Ngôn ngữ giải thích của bạn phải khớp với ngôn ngữ chính của tài liệu đầu vào.**
- Chỉ trả về mã LaTeX thô, không có giải thích thêm hoặc định dạng markdown.
- Bắt đầu trực tiếp với \\documentclass{article}.`
    }
};


export const convertPdfToLatex = async (pdfFile: File, language: 'en' | 'vi' = 'en'): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const pdfPart = await fileToGenerativePart(pdfFile);

  const prompt = prompts.latexConverter[language];

  // Fix: Correct the structure of the `contents` property for single-turn multimodal requests.
  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }, pdfPart] },
  });

  const responseText = response.text;
  
  return responseText.replace(/^```latex\s*|```\s*$/g, '').trim();
};

export const generateLatexSolution = async (file: File, language: 'en' | 'vi' = 'en'): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const filePart = await fileToGenerativePart(file);

  const prompt = prompts.latexSolver[language];

  // Fix: Correct the structure of the `contents` property for single-turn multimodal requests.
  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }, filePart] },
  });

  const responseText = response.text;

  return responseText.replace(/^```latex\s*|```\s*$/g, '').trim();
};