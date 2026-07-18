import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to safely get Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ----------------------------------------------------
// API: Check AI Service Status
// ----------------------------------------------------
app.get("/api/ai-status", (req, res) => {
  const isKeyActive = !!getGeminiClient();
  res.json({
    status: "ok",
    mode: isKeyActive ? "realtime_ai" : "simulation",
    message: isKeyActive
      ? "Kết nối trực tiếp với Gemini AI thành công!"
      : "Đang sử dụng bộ máy mô phỏng phân tích RealPath"
  });
});

// ----------------------------------------------------
// API: Get Jigsaw Game Static Data
// ----------------------------------------------------
app.get("/api/jigsaw-data", (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "data", "jigsawData.json");
    const fileData = fs.readFileSync(filePath, "utf8");
    const jigsawData = JSON.parse(fileData);
    res.json(jigsawData);
  } catch (error: any) {
    console.error("Error reading jigsawData.json:", error);
    res.status(500).json({ error: "Không thể lấy dữ liệu trò chơi." });
  }
});

// ----------------------------------------------------
// API: Generate Custom Tasks Based on User Achievement Story
// ----------------------------------------------------
app.get("/api/generate-custom-tasks", (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "data", "jigsawData.json");
    const fileData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileData);
    res.json({ tasks: data.tasks || [] });
  } catch (err) {
    res.json({
      tasks: [
        { id: "soan-so-lieu", label: "Soạn thảo báo cáo số liệu", icon: "📊", type: "logic", description: "Nhập liệu, tính toán doanh thu tháng trên bảng tính Excel." },
        { id: "kich-ban-hai", label: "Lên kịch bản quảng cáo hài hước", icon: "🎬", type: "creative", description: "Lên ý tưởng kịch bản video vui nhộn 30 giây chạy quảng cáo TikTok." },
        { id: "thuyet-phuc-khach", label: "Gọi điện thuyết phục khách hàng", icon: "📞", type: "social", description: "Trực tiếp gọi điện, tư vấn gói sản phẩm phần mềm cho đối tác." },
        { id: "sua-loi-he-thong", label: "Sửa chữa lỗi hệ thống", icon: "💻", type: "logic", description: "Gỡ lỗi code máy chủ để tránh nghẽn băng thông truy cập." },
        { id: "sap-xep-ho-so", label: "Sắp xếp hồ sơ giấy tờ", icon: "📁", type: "operational", description: "Sắp xếp, phân loại hợp đồng đối tác theo bảng chữ cái." }
      ]
    });
  }
});

// Playing Card Deck Rank & Suit Hierarchy (Heart > Diamonds > Clubs > Spades)
const SUIT_PRIORITIES: Record<string, number> = {
  "♥": 4, // Hearts (Cơ - Highest)
  "♦": 3, // Diamonds (Rô)
  "♣": 2, // Clubs (Tép)
  "♠": 1  // Spades (Bích - Lowest)
};

const RANK_VALUES: Record<string, number> = {
  "A": 14, "K": 13, "Q": 12, "J": 11,
  "10": 10, "9": 9, "8": 8, "7": 7,
  "6": 6, "5": 5, "4": 4, "3": 3, "2": 2
};

function calculateCardValue(rank: string, suit: string): number {
  const rVal = RANK_VALUES[rank] || 2;
  const sVal = SUIT_PRIORITIES[suit] || 1;
  return rVal * 10 + sVal;
}

function drawAndRank10Cards(): { rank: string; suit: string; valueOrder: number }[] {
  const ranks = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
  const suits = ["♥", "♦", "♣", "♠"];
  const deck: { rank: string; suit: string; valueOrder: number }[] = [];

  for (const r of ranks) {
    for (const s of suits) {
      deck.push({
        rank: r,
        suit: s,
        valueOrder: calculateCardValue(r, s)
      });
    }
  }

  // Shuffle full 52-card deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  // Draw 10 cards and sort by value descending
  const drawn = deck.slice(0, 10);
  drawn.sort((a, b) => b.valueOrder - a.valueOrder);
  return drawn;
}

function pairTasksWithRankedCards(rawTasks: any[]): any[] {
  const rankedCards = drawAndRank10Cards();
  const tasksToPair = [...rawTasks].slice(0, 10);

  const paired = tasksToPair.map((task, idx) => {
    const card = rankedCards[idx] || rankedCards[rankedCards.length - 1];
    let importanceLevel: "Rất cao" | "Cao" | "Trung bình" | "Tiêu chuẩn" = "Tiêu chuẩn";
    if (idx < 2) importanceLevel = "Rất cao";
    else if (idx < 5) importanceLevel = "Cao";
    else if (idx < 8) importanceLevel = "Trung bình";

    return {
      ...task,
      cardRank: card.rank,
      cardSuit: card.suit,
      cardValueOrder: card.valueOrder,
      importanceLevel
    };
  });

  // Shuffle the paired array to randomize card order on display
  for (let i = paired.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [paired[i], paired[j]] = [paired[j], paired[i]];
  }

  return paired;
}

app.post("/api/generate-custom-tasks", async (req, res) => {
  const { story, userType } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    console.log("[RealPath Server] Không thể gọi Gemini API (Chưa cấu hình GEMINI_API_KEY). Đang sử dụng bộ công việc mô phỏng 10 lá bài.");
    return res.json({ tasks: getSimulatedCustomTasks(story, userType) });
  }

  try {
    const userTypeLabel = userType === "student" ? "Học sinh THCS/THPT" : "Sinh viên sắp / mới ra trường";
    const prompt = `
      Vai trò: Chuyên gia hướng nghiệp AI RealPath. Người dùng: ${userTypeLabel}.
      Phân tích câu chuyện: "${story}".
      Thiết kế đúng 10 nhiệm vụ thực tế đa dạng theo thứ tự quan trọng giảm dần:
      - 1-2: Chuyên môn/Kỹ thuật cốt lõi (Rất cao).
      - 3-5: Sáng tạo/Đàm phán/Nhân sự (Cao).
      - 6-8: Kiểm thử/Quy trình/Dữ liệu (Trung bình).
      - 9-10: Dự toán/Tài nguyên/Hỗ trợ (Tiêu chuẩn).

      Định dạng JSON đầu ra (đúng 10 phần tử):
      [
        {
          "id": "id_viet_thuong",
          "label": "Tên nhiệm vụ (< 10 từ)",
          "icon": "1 Emoji",
          "type": "logic" | "creative" | "social" | "operational",
          "description": "Mô tả thách thức liên quan câu chuyện (15-25 từ)"
        }
      ]
      Yêu cầu: Chỉ trả về JSON bằng Tiếng Việt.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              label: { type: Type.STRING },
              icon: { type: Type.STRING },
              type: {
                type: Type.STRING,
                enum: ["logic", "creative", "social", "operational"]
              },
              description: { type: Type.STRING }
            },
            required: ["id", "label", "icon", "type", "description"]
          }
        },
        temperature: 0.7,
        systemInstruction: "Bạn là chuyên gia thiết kế 10 nhiệm vụ AI của RealPath. Trả về đúng 10 nhiệm vụ xếp theo tầm quan trọng giảm dần."
      }
    });

    let text = response.text?.trim() || "[]";
    if (text.startsWith("```")) {
      text = text.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
    }
    let tasks = JSON.parse(text);
    if (tasks && !Array.isArray(tasks) && Array.isArray(tasks.tasks)) {
      tasks = tasks.tasks;
    }

    if (Array.isArray(tasks) && tasks.length >= 8) {
      const pairedTasks = pairTasksWithRankedCards(tasks);
      return res.json({ tasks: pairedTasks });
    } else {
      console.log("[RealPath Server] Phản hồi AI không đủ 10 nhiệm vụ. Đang sử dụng bộ công việc mô phỏng 10 lá.");
      return res.json({ tasks: getSimulatedCustomTasks(story, userType) });
    }
  } catch (error: any) {
    console.log("[RealPath Server] Lỗi khi kết nối API Gemini:", error?.message || error, ". Đang sử dụng bộ công việc mô phỏng.");
    return res.json({ tasks: getSimulatedCustomTasks(story, userType) });
  }
});

function getSimulatedCustomTasks(story: string = "", userType: string = ""): any[] {
  const storyLower = story.toLowerCase();
  const isStudent = userType === "student";
  let rawTasks: any[] = [];

  // Computer Repair / Hardware / Tech Shop topic
  if (storyLower.includes("máy tính") || storyLower.includes("sửa máy") || storyLower.includes("linh kiện") || storyLower.includes("phần cứng") || storyLower.includes("tiệm")) {
    rawTasks = isStudent ? [
      { id: "sua-pc-phong-tin-hoc", label: "Kiểm tra máy tính phòng tin học", icon: "🛠️", type: "logic", description: "Hỗ trợ thầy cô cắm lại cáp mạng, kiểm tra chuột bàn phím bị lỏng dây để buổi học diễn ra suôn sẻ." },
      { id: "phac-thao-so-do-phong-lap", label: "Phác thảo sơ đồ đấu nối mạng lớp học", icon: "💡", type: "creative", description: "Vẽ sơ đồ bố trí 20 máy tính học sinh nối với máy chủ của giáo viên hướng dẫn." },
      { id: "thuong-luong-mua-chuot", label: "Nhờ lớp trưởng duyệt mua chuột máy tính mới", icon: "🤝", type: "social", description: "Trình bày lý do chuột hỏng nhiều để xin trích quỹ lớp mua 3 con chuột mới thay thế." },
      { id: "stress-test-may-tinh-truong", label: "Cài đặt phần mềm học lập trình Pascal/Python", icon: "⚡", type: "logic", description: "Cài đặt môi trường lập trình và chạy thử bài tập mẫu để kiểm tra máy hoạt động bình thường." },
      { id: "tu-van-chon-lap-top-ban", label: "Tư vấn cấu hình laptop học tập cho bạn thân", icon: "📞", type: "social", description: "Dựa vào nhu cầu học tập và chơi game giải trí để khuyên bạn chọn RAM và ổ cứng phù hợp giá tiền." },
      { id: "thiet-ke-poster-tin-hoc", label: "Thiết kế Poster giới thiệu CLB Tin học trường", icon: "🎨", type: "creative", description: "Sử dụng Canva thiết kế ảnh quảng cáo buổi sinh hoạt CLB cuối tuần." },
      { id: "kiem-ke-chuot-phim", label: "Đếm số lượng tai nghe & bàn phím trong kho", icon: "📦", type: "operational", description: "Liệt kê danh sách thiết bị còn dùng được và thiết bị hỏng cần thanh lý." },
      { id: "toi-uu-gio-thuc-hanh", label: "Đề xuất chia ca thực hành Tin học lớp", icon: "⏱️", type: "operational", description: "Sắp xếp danh sách học sinh theo nhóm chẵn/lẻ để tránh tình trạng 2 bạn phải tranh nhau 1 máy." },
      { id: "tinh-toan-quy-clb", label: "Tính toán tiền quỹ hoạt động CLB tháng", icon: "📊", type: "operational", description: "Ghi chép các khoản thu chi mua nước ngọt, giấy in tài liệu phục vụ sinh hoạt CLB." },
      { id: "don-dep-phong-tin", label: "Dọn dẹp & xếp gọn ghế phòng máy", icon: "🧹", type: "operational", description: "Tắt nguồn toàn bộ PC, xếp gọn ghế sau khi kết thúc buổi thực hành." }
    ] : [
      { id: "sua-mainboard-phuc-hoc", label: "Chẩn đoán & hàn tụ bo mạch Mainboard hỏng", icon: "🛠️", type: "logic", description: "Sử dụng đồng hồ đo điện áp để tìm vi mạch bị chập cháy và thay thế linh kiện chân rết khó nhất." },
      { id: "phac-thao-so-do-tan-nhiet", label: "Thiết kế giải pháp tản nhiệt nước cho dàn PC Gaming", icon: "💡", type: "creative", description: "Lên bản vẽ nguyên lý đi dây ống nước tản nhiệt và tính toán lưu lượng gió tối ưu cho dàn máy cao cấp." },
      { id: "thuong-luong-nha-cung-cap", label: "Đàm phán giá chiết khấu với nhà phân phối VGA", icon: "🤝", type: "social", description: "Trực tiếp làm việc với đại lý hãng để xin chính sách bảo hành 1 đổi 1 và giảm 10% giá linh kiện nhập số lượng lớn." },
      { id: "kiem-thu-stress-test", label: "Chạy bài kiểm thử chịu tải Stress Test 24h", icon: "⚡", type: "logic", description: "Sử dụng phần mềm FurMark & Prime95 ép xung thiết bị trong 24 giờ liên tục để đảm bảo máy không sập khi giao cho khách." },
      { id: "tu-van-cau-hinh-chuyen-sau", label: "Tư vấn thiết kế cấu hình Workstation đồ họa", icon: "📞", type: "social", description: "Phân tích nhu cầu dựng phim 4K để tư vấn dung lượng RAM, chip CPU và card đồ họa phù hợp với ngân sách." },
      { id: "thiet-ke-poster-banner-store", label: "Thiết kế Banner nhận diện cửa hàng tiệm máy tính", icon: "🎨", type: "creative", description: "Tạo các mẫu ảnh quảng cáo dịch vụ vệ sinh laptop và nâng cấp SSD cho học sinh sinh viên." },
      { id: "kiem-ke-kho-linh-kien", label: "Rà soát & mã hóa danh mục 1000 linh kiện kho", icon: "📦", type: "operational", description: "Gán mã vạch bar-code cho từng RAM, ổ cứng SSD và quạt tản nhiệt để dễ dàng quản lý tồn kho." },
      { id: "toi-uu-quy-trinh-bao-hanh", label: "Tối ưu hóa quy trình tiếp nhận & trả máy bảo hành", icon: "⏱️", type: "operational", description: "Xây dựng biểu mẫu hẹn giờ trả máy cho khách giúp giảm thời gian chờ đợi từ 3 ngày xuống 24h." },
      { id: "lap-ngan-sach-vat-tu", label: "Lập bảng kế hoạch chi phí vật tư & bảo hành quý", icon: "📊", type: "operational", description: "Hệ thống hóa ngân sách nhập linh kiện dự phòng, tính toán tỷ lệ lợi nhuận và quỹ bảo hành rủi ro." },
      { id: "don-dep-khu-vat-tu", label: "Quét dọn & phân loại rác linh kiện hỏng tồn đọng", icon: "🧹", type: "operational", description: "Gom các vỏ hộp carton và vỏ dây cáp hỏng xếp vào góc kho lưu trữ vật tư cũ." }
    ];
  }
  // Sports / Event topic
  else if (storyLower.includes("bóng đá") || storyLower.includes("thể thao") || storyLower.includes("sự kiện") || storyLower.includes("giải đấu") || storyLower.includes("tổ chức")) {
    rawTasks = [
      { id: "giai-quyet-tranh-chap-san", label: "Xử lý sự cố tranh chấp thẻ phạt trận chung kết", icon: "⚖️", type: "social", description: "Trực tiếp đối thoại với ban huấn luyện 2 đội bóng để hạ nhiệt căng thẳng và quyết định kỷ luật công bằng." },
      { id: "thiet-ke-nhan-dien-giai", label: "Sáng tạo bộ nhận diện thương hiệu & cúp giải đấu", icon: "🎨", type: "creative", description: "Lên ý tưởng thiết kế logo giải đấu, huy chương mạ vàng và hệ thống nhận diện truyền thông trên các kênh." },
      { id: "chot-hop-dong-tai-tro", label: "Thuyết phục nhà tài trợ rót vốn kinh phí", icon: "🎙️", type: "social", description: "Trình bày slide đề án giải đấu với đại diện doanh nghiệp để chốt gói tài trợ 50 triệu đồng." },
      { id: "khiem-soat-an-ninh-san", label: "Rà soát quy trình an ninh & y tế cấp cứu sân thi đấu", icon: "🛡️", type: "operational", description: "Kiểm tra kỹ thuật mặt sân, điều phối xe cấp cứu túc trực và phân công lực lượng bảo vệ các khán đài." },
      { id: "dieu-hanh-trong-tai", label: "Phân công & điều phối tổ trọng tài quốc gia", icon: "🚩", type: "social", description: "Bố trí trọng tài chính, trọng tài biên và giám sát VAR đảm bảo tính minh bạch cho giải đấu." },
      { id: "san-xuat-highlight-media", label: "Biên tập video Highlight các bàn thắng đẹp", icon: "🎬", type: "creative", description: "Cắt ghép những pha ghi bàn ấn tượng chèn nhạc sôi động đăng tải lên mạng xã hội." },
      { id: "phat-hanh-ve-va-ngan-sach", label: "Lập bảng cân đối thu chi & phân phối vé giải", icon: "📈", type: "logic", description: "Tính toán chi phí thuê trọng tài, sân bãi và hạch toán doanh thu bán vé cùng tiền thưởng cho các đội." },
      { id: "soan-thao-dieu-le-giai", label: "Soạn thảo tài liệu Điều lệ thi đấu chính thức", icon: "📜", type: "operational", description: "Hệ thống hóa các quy định số lượng thay người, độ tuổi VĐV và thể thức đá luân lưu 11m." },
      { id: "lien-he-thue-san-bai", label: "Làm việc với quản lý cụm sân cỏ nhân tạo", icon: "🏟️", type: "operational", description: "Thỏa thuận khung giờ vàng thi đấu và đặt cọc chi phí bảo dưỡng mặt sân thi đấu." },
      { id: "nhap-danh-sach-vdv", label: "Điền danh sách VĐV & kiểm tra hồ sơ đăng ký", icon: "📝", type: "operational", description: "Rà soát chứng minh thư, thẻ học sinh của 200 VĐV để loại bỏ các trường hợp vi phạm quy chế." }
    ];
  }
  // Code / Software topic
  else if (storyLower.includes("code") || storyLower.includes("lập trình") || storyLower.includes("phần mềm") || storyLower.includes("web") || storyLower.includes("ứng dụng") || storyLower.includes("thuật toán")) {
    rawTasks = [
      { id: "refactor-core-algorithm", label: "Tối ưu hóa kiến trúc thuật toán xử lý dữ liệu lớn", icon: "🚀", type: "logic", description: "Viết lại module xử lý luồng dữ liệu song song giúp giảm tải CPU máy chủ từ 90% xuống còn 30%." },
      { id: "design-user-journey", label: "Xây dựng bản phác thảo trải nghiệm UI/UX đột phá", icon: "✨", type: "creative", description: "Nghiên cứu hành vi người dùng và tạo prototype tương tác mượt mà cho tính năng thanh toán 1 chạm." },
      { id: "lead-sprint-planning", label: "Chủ trì buổi Họp phân bổ nhiệm vụ Sprint cho nhóm", icon: "🗣️", type: "social", description: "Giải thích các yêu cầu nghiệp vụ phức tạp, phân chia công việc cho lập trình viên và chốt thời hạn cam kết." },
      { id: "automated-unit-testing", label: "Viết kịch bản kiểm thử tự động Automated Unit Test", icon: "🧪", type: "logic", description: "Thiết lập hệ thống CI/CD tự động phát hiện gỡ lỗi bẫy exception trước khi đẩy sản phẩm lên môi trường thực." },
      { id: "thiet-ke-database-schema", label: "Thiết kế mô hình cơ sở dữ liệu relational DB", icon: "🗄️", type: "logic", description: "Vẽ sơ đồ ERD tối ưu hóa các khóa ngoại và chỉ mục index để truy vấn dưới 10ms." },
      { id: "viet-api-documentation", label: "Soạn thảo tài liệu Swagger/OpenAPI hướng dẫn", icon: "📖", type: "operational", description: "Mô tả đầy đủ các tham số request/response cho bộ phận Frontend và đối tác dễ tích hợp." },
      { id: "phat-trien-bot-canh-bao", label: "Lập trình Bot Telegram tự động cảnh báo sự cố", icon: "🤖", type: "creative", description: "Tự động gửi thông báo về kênh chat của nhóm khi hệ thống gặp lỗi sập server hoặc trễ truy vấn." },
      { id: "manage-cloud-budget", label: "Lập báo cáo tối ưu hóa chi phí điện toán mây AWS", icon: "📊", type: "operational", description: "Rà soát dung lượng lưu trữ kho dữ liệu và cấu hình lại các server ảo để tiết kiệm 20% chi phí điện toán." },
      { id: "review-pull-request", label: "Rà soát & phê duyệt Pull Request của thành viên", icon: "🔍", type: "logic", description: "Kiểm tra chất lượng code, bẫy lỗi bảo mật SQL Injection trước khi merge vào nhánh main." },
      { id: "dien-form-cham-cong", label: "Điền báo cáo tiến độ tuần & hóa đơn công tác", icon: "📑", type: "operational", description: "Kê khai thời gian làm việc OT và nộp hóa đơn mua thiết bị máy chủ dự phòng." }
    ];
  }
  // Design / Media topic
  else if (storyLower.includes("thiết kế") || storyLower.includes("vẽ") || storyLower.includes("video") || storyLower.includes("ảnh") || storyLower.includes("nội dung")) {
    rawTasks = [
      { id: "direct-video-shoot", label: "Đạo diễn góc quay & ánh sáng cho video quảng cáo", icon: "🎬", type: "creative", description: "Trực tiếp chỉ đạo ekip quay phim, setup hệ thống đèn chiếu sáng và điều phối diễn xuất của nhân vật." },
      { id: "build-brand-guidelines", label: "Xây dựng bộ quy chuẩn thương hiệu Brand Guidelines", icon: "🎨", type: "creative", description: "Quy định mã màu chuẩn, phông chữ chủ đạo và quy tắc sử dụng logo cho tập đoàn khách hàng." },
      { id: "pitching-creative-concept", label: "Thuyết trình bảo vệ ý tưởng sáng tạo với khách hàng", icon: "📢", type: "social", description: "Trình bày thông điệp chiến dịch truyền thông và chinh phục ban giám đốc đối tác chốt hợp đồng sản xuất." },
      { id: "color-grading-master", label: "Chỉnh màu Color Grading & Hiệu ứng kỹ xảo Visual Effects", icon: "🖌️", type: "logic", description: "Khử nhiễu, cân bằng tông màu điện ảnh và ghép hiệu ứng kỹ xảo 3D cho thước phim ấn tượng." },
      { id: "phac-thao-storyboard", label: "Vẽ kịch bản khung hình Storyboard 30 cảnh", icon: "✍️", type: "creative", description: "Phác thảo tay các góc quay chuyển cảnh minh họa cho đạo diễn và khách hàng hình dung trước." },
      { id: "bien-tap-am-thanh", label: "Phối âm thanh SFX & nhạc nền bản quyền", icon: "🎧", type: "creative", description: "Khử tạp âm thoại nhân vật, lồng hiệu ứng tiếng động chân thực và chọn bản nhạc bắt tai." },
      { id: "manage-production-budget", label: "Lập bảng dự toán chi phí quay phim & thiết bị media", icon: "📋", type: "operational", description: "Hạch toán tiền thuê máy ảnh, ống kính cine, chi phí diễn viên và phụ cấp hậu trường cho ekip." },
      { id: "xu-ly-file-in-an", label: "Xuất file thiết kế chuẩn in ấn khổ lớn Billboard", icon: "🖨️", type: "logic", description: "Chuyển màu CMYK 300 DPI và khoanh vùng đường cắt bế cho xưởng in thi công." },
      { id: "quan-ly-luu-tru-harddrive", label: "Lưu trữ & đóng gói tài nguyên dự án Media", icon: "🗄️", type: "operational", description: "Hệ thống hóa folder ảnh thô RAW và file dựng gốc theo mã ngày để tiện tra cứu sau 1 năm." },
      { id: "giao-tiep-xuat-file", label: "Gửi link Preview & tiếp nhận góp ý từ khách hàng", icon: "💬", type: "social", description: "Ghi chép danh sách các điểm cần sửa màu hoặc cắt ngắn thời lượng theo yêu cầu đối tác." }
    ];
  }
  // Default / Generic topic
  else {
    rawTasks = isStudent ? [
      { id: "lam-bai-tap-kho", label: "Trực tiếp giải bài tập nâng cao khó nhất", icon: "⚡", type: "logic", description: "Tự mày mò công thức nâng cao để hoàn thành bài tập khó chuẩn bị cho kỳ thi." },
      { id: "sang-tao-y-tuong-clb", label: "Nghiên cứu & lên ý tưởng tổ chức CLB trường", icon: "💡", type: "creative", description: "Đề xuất nội dung sinh hoạt sáng tạo thu hút thành viên mới tham gia CLB học tập." },
      { id: "phat-bieu-y-kien", label: "Đại diện nhóm thuyết trình bài tập lớn trước lớp", icon: "🤝", type: "social", description: "Trình bày tự tin, trả lời các câu hỏi phản biện từ thầy cô và bạn bè." },
      { id: "kiem-tra-chinh-ta", label: "Rà soát lỗi chính tả & bố cục bài luận nhóm", icon: "🛡️", type: "logic", description: "Đọc kỹ từng đoạn văn, sửa lỗi diễn đạt để nộp bài làm đạt điểm tối đa." },
      { id: "dieu-dieu-phoi-nhom-hoc", label: "Chủ trì buổi học nhóm phân công bài tập", icon: "🗣️", type: "social", description: "Lắng nghe thế mạnh của từng bạn và phân chia phần việc công bằng." },
      { id: "ve-so-do-tu-duy", label: "Tóm tắt bài học bằng sơ đồ tư duy Mindmap", icon: "📐", type: "creative", description: "Vẽ mindmap trực quan tóm tắt toàn bộ chương học để cả nhóm dễ ôn thi." },
      { id: "cham-diem-thanh-vien", label: "Phân tích điểm số & tiến độ làm bài của nhóm", icon: "📈", type: "logic", description: "Theo sát xem bạn nào chưa nộp phần việc để nhắc nhở nộp bài đúng hạn." },
      { id: "quan-ly-quy-lop", label: "Lập bảng thu chi tiền quỹ lớp học", icon: "📊", type: "operational", description: "Ghi chép minh bạch tiền photo tài liệu học tập và tiền mua phấn viết bảng." },
      { id: "chuan-bi-ban-ghe", label: "Soạn tài liệu & in ấn đề cương ôn tập", icon: "📄", type: "operational", description: "In sẵn các mẫu đề thi thử năm trước để phát cho các thành viên trong nhóm." },
      { id: "sap-xep-giay-kiem-tra", label: "Sắp xếp & lưu trữ tập bài kiểm tra cũ", icon: "🗂️", type: "operational", description: "Phân loại bài kiểm tra theo môn học để dễ dàng tra cứu điểm số khi cần." }
    ] : [
      { id: "giai-quyet-su-co-truc-tiep", label: "Trực tiếp xử lý điểm nghẽn kỹ thuật phức tạp nhất", icon: "⚡", type: "logic", description: "Tập trung trí tuệ bóc tách nguyên nhân rễ tre của sự cố và đưa ra phương án khắc phục triệt để." },
      { id: "phat-trien-giai-phap-moi", label: "Nghiên cứu & sáng tạo giải pháp công việc đột phá", icon: "💡", type: "creative", description: "Đề xuất quy trình làm việc sáng tạo giúp tăng 50% hiệu suất làm việc cho toàn nhóm." },
      { id: "dam-phan-va-dieu-phoi", label: "Đàm phán với đối tác & điều phối đội ngũ dự án", icon: "🤝", type: "social", description: "Thương lượng điều khoản hợp tác và truyền cảm hứng cho các thành viên trong dự án." },
      { id: "kiem-soat-chat-luong", label: "Rà soát chất lượng & kiểm định quy trình an toàn", icon: "🛡️", type: "logic", description: "Thiết lập danh mục kiểm tra tiêu chuẩn chất lượng khắt khe để loại bỏ rủi ro sai sót." },
      { id: "dieu-hanh-cuoc-hop", label: "Chủ trì cuộc họp thống nhất mục tiêu chiến lược", icon: "🗣️", type: "social", description: "Kết nối các phòng ban, lắng nghe ý kiến đóng góp và thống nhất kế hoạch hành động." },
      { id: "thiet-ke-mo-hinh", label: "Vẽ sơ đồ quy trình vận hành trực quan", icon: "📐", type: "creative", description: "Hệ thống hóa các bước công việc dưới dạng flowchart cho nhân sự mới dễ học tập." },
      { id: "phan-tich-hieu-suat", label: "Phân tích chỉ số báo cáo KPI hiệu suất", icon: "📈", type: "logic", description: "Tổng hợp số liệu từ các phòng ban để chỉ ra các mắt xích làm việc chậm trễ." },
      { id: "quan-ly-ngan-sach-tai-chinh", label: "Lập kế hoạch phân bổ ngân sách & nguồn lực", icon: "📊", type: "operational", description: "Hạch toán toàn bộ bảng thu chi tài chính và phân bổ tài nguyên tối ưu cho dự án." },
      { id: "soan-thao-hop-dong", label: "Soạn thảo văn bản điều khoản pháp lý dự án", icon: "📄", type: "operational", description: "Rà soát các quy định phạt vi phạm tiến độ và bảo mật thông tin trước khi ký kết." },
      { id: "sap-xep-luu-tru-ho-so", label: "Đóng gói & phân loại hồ sơ tài liệu văn phòng", icon: "🗂️", type: "operational", description: "Sắp xếp tài liệu gốc vào tủ lưu trữ theo tháng để phòng ngừa kiểm tra đột xuất." }
    ];
  }

  return pairTasksWithRankedCards(rawTasks);
}

// Helper to read local job recruitment database
function getLocalJobsData(): any[] {
  try {
    const filePath = path.join(process.cwd(), "data", "localJobsData.json");
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf8");
      return JSON.parse(fileData);
    }
  } catch (err) {
    console.error("Error reading localJobsData.json:", err);
  }
  return [];
}

// Matching engine: filters local jobs matching the given domain/category or skill keywords
function matchLocalJobsForCategory(category: string = "", title: string = "", skills: string[] = []): any[] {
  const allJobs = getLocalJobsData();
  if (!allJobs || allJobs.length === 0) return [];

  const catLower = (category || "").toLowerCase();
  const titleLower = (title || "").toLowerCase();
  const skillsLower = skills.map(s => s.toLowerCase());

  // Extract meaningful keywords from the career title
  const titleKeywords = titleLower
    .replace(/[()\/&,\-]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !["and", "the", "các", "của", "cho", "với", "trong"].includes(w));

  // Score each job by relevance
  const scored = allJobs.map((job: any) => {
    const jobCat = (job.category || "").toLowerCase();
    const jobTitle = (job.jobTitle || "").toLowerCase();
    const jobSkills = (job.skillsRequired || []).map((s: string) => s.toLowerCase());
    let score = 0;

    // Category match (broad)
    if (catLower && jobCat.includes(catLower)) score += 2;
    if (catLower && catLower.split("&")[0] && jobCat.includes(catLower.split("&")[0].trim())) score += 1;

    // Title keyword matches (specific)
    for (const kw of titleKeywords) {
      if (jobTitle.includes(kw)) score += 3;
      if (jobCat.includes(kw)) score += 1;
    }

    // Direct title substring match
    if (titleLower && jobTitle.includes(titleLower)) score += 5;

    // Skill overlap (very specific)
    for (const skill of skillsLower) {
      const skillWords = skill.split(/[\s\/]+/).filter(w => w.length > 2);
      for (const sw of skillWords) {
        if (jobTitle.includes(sw)) score += 2;
        for (const js of jobSkills) {
          if (js.includes(sw)) score += 2;
        }
      }
    }

    // Domain-specific keyword boosters
    const domainMap: Record<string, string[]> = {
      "machine learning": ["ai", "ml", "machine", "learning", "data", "python", "tensorflow", "pytorch"],
      "ai": ["ai", "ml", "machine", "learning", "data", "trí tuệ", "nhân tạo"],
      "fullstack": ["full-stack", "fullstack", "frontend", "backend", "react", "node", "javascript", "typescript", "lập trình"],
      "full-stack": ["full-stack", "fullstack", "frontend", "backend", "react", "node", "javascript", "lập trình"],
      "frontend": ["frontend", "react", "vue", "angular", "css", "javascript", "giao diện"],
      "backend": ["backend", "server", "api", "database", "node", "java", "python"],
      "cybersecurity": ["security", "bảo mật", "penetration", "firewall", "cloud", "hạ tầng"],
      "security": ["security", "bảo mật", "penetration", "firewall", "cloud", "hạ tầng"],
      "devops": ["devops", "docker", "kubernetes", "ci/cd", "cloud", "aws", "server"],
      "designer": ["thiết kế", "design", "figma", "ui", "ux", "photoshop", "illustrator"],
      "ui/ux": ["ui", "ux", "giao diện", "design", "figma", "thiết kế"],
      "marketing": ["marketing", "tiếp thị", "quảng cáo", "seo", "content", "ads"],
      "content": ["content", "nội dung", "biên tập", "kịch bản", "video", "sáng tạo"],
      "logistics": ["logistics", "kho", "vận hành", "chuỗi cung ứng", "vận tải", "xuất nhập"],
      "kiểm toán": ["kiểm toán", "tài chính", "kế toán", "audit", "chứng từ"],
      "nhân sự": ["nhân sự", "tuyển dụng", "hr", "talent", "phỏng vấn"],
      "mc": ["mc", "truyền thông", "biểu diễn", "nghệ thuật", "sáng tạo", "nội dung", "kịch bản"],
    };

    for (const [domainKey, domainWords] of Object.entries(domainMap)) {
      if (titleLower.includes(domainKey)) {
        for (const dw of domainWords) {
          if (jobTitle.includes(dw)) score += 2;
          if (jobCat.includes(dw)) score += 1;
          for (const js of jobSkills) {
            if (js.includes(dw)) score += 1;
          }
        }
      }
    }

    return { job, score };
  });

  // Sort by score descending, filter out zero-score entries
  const sorted = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (sorted.length === 0) {
    // Fallback: return first 2 jobs from the same broad category if any
    const catFallback = allJobs.filter((j: any) => {
      const jc = (j.category || "").toLowerCase();
      return catLower && (jc.includes(catLower.split("&")[0].trim()) || jc.includes(catLower));
    });
    return catFallback.slice(0, 2);
  }

  return sorted.slice(0, 2).map(s => s.job);
}

// ----------------------------------------------------
// API: Refresh Matched Jobs for cached career results
// ----------------------------------------------------
app.post("/api/refresh-matched-jobs", (req, res) => {
  const { careers } = req.body;
  if (!careers || !Array.isArray(careers)) {
    return res.status(400).json({ error: "Missing careers array" });
  }

  const usedJobIds = new Set<string>();
  const refreshed = careers.map((career: any) => {
    let jobs = matchLocalJobsForCategory(career.category || "", career.title || "", career.skillsRequired || []);
    // Avoid duplicate jobs across careers
    jobs = jobs.filter((j: any) => !usedJobIds.has(j.id));
    jobs.forEach((j: any) => usedJobIds.add(j.id));
    return {
      title: career.title,
      matchedJobs: jobs.slice(0, 2)
    };
  });

  return res.json({ refreshed });
});

// ----------------------------------------------------
// API: Process Jigsaw Game Choices and Guess Results
// ----------------------------------------------------
app.post("/api/jigsaw-guess", async (req, res) => {
  const { gameState } = req.body;
  const ai = getGeminiClient();

  let jigsawData: any;
  try {
    const filePath = path.join(process.cwd(), "data", "jigsawData.json");
    jigsawData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    return res.status(500).json({ error: "Lỗi đọc dữ liệu trò chơi ở máy chủ." });
  }

  if (!ai) {
    console.log("No GEMINI_API_KEY found, running realistic story-driven Jigsaw guess simulation.");
    const result = getSimulatedJigsawGuess(gameState, jigsawData);
    return res.json(result);
  }

  try {
    const { story = "", taskAssignments = {}, styles = {}, userType = "" } = gameState;
    const userTypeLabel = userType === "student" ? "Học sinh THCS/THPT" : "Sinh viên sắp / mới ra trường";

    const prompt = `
      Vai trò: Chuyên gia hướng nghiệp AI RealPath. Người dùng: ${userTypeLabel}.
      1. Câu chuyện cá nhân: "${story}"
      2. Phân công 10 lá bài công việc (trọng số: A > K > Q > J > 10...; Cơ ♥ > Rô ♦ > Tép ♣ > Bích ♠):
         ${JSON.stringify(taskAssignments, null, 2)}
      3. Phong cách làm việc/học tập:
         ${JSON.stringify(styles, null, 2)}

      Yêu cầu đầu ra (JSON bằng tiếng Việt):
      {
        "targetDomain": "Tên Lĩnh vực chủ đạo",
        "domainShortageReason": "Báo cáo ngắn gọn thực trạng khan hiếm nhân lực mảng này tại Việt Nam",
        "beginnerFriendlyAnalysis": "Phân tích thói quen làm việc ở Bước 2 (đặc biệt các lá bài chất Cơ/Rô giá trị cao) (2-3 câu dễ hiểu)",
        "strategicPreferenceAdvice": "Tư vấn gợi ý chọn ngành theo mục tiêu cá nhân",
        "extractedSkills": ["Kỹ năng 1", "Kỹ năng 2"],
        "inferredFromTasks": ["Kỹ năng từ phân công 1", "Kỹ năng 2"],
        "inferredFromStyles": ["Kỹ năng từ phong cách 1", "Kỹ năng 2"],
        "strengths": [{"name": "Năng lực", "evidence": "Minh chứng từ Bước 1/2", "analysis": "Đánh giá cụ thể"}],
        "thinkingStyles": [{"name": "Tư duy", "evidence": "Minh chứng từ Bước 2/3", "analysis": "Đánh giá ưu/nhược điểm"}],
        "skillGaps": [{"name": "Điểm cần cải thiện", "evidence": "Từ lá bài Skip/Bước 3", "analysis": "Khuyến nghị cụ thể"}],
        "recommendations": [
          {
            "title": "Tên nghề nghiệp trong cùng lĩnh vực",
            "category": "Tên Lĩnh vực",
            "reason": "Lý do phù hợp ngắn gọn",
            "whyRecommended": "Giải thích chi tiết sự tương thích dựa trên các lá bài giá trị cao đã chọn ở Bước 2",
            "salaryRange": "Lương thực tế Việt Nam",
            "jobDemand": "Cao",
            "futureOutlook": "Đánh giá triển vọng 5 năm tới",
            "skillsRequired": ["Kỹ năng 1", "Kỹ năng 2"],
            "shortageNote": "🔥 Thực trạng thiếu hụt nhân lực thực tế",
            "cities": ["Hà Nội", "TP Hồ Chí Minh"]
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
        systemInstruction: "Bạn là chuyên gia hướng nghiệp AI của RealPath. Phân tích 10 lá bài có trọng số và đối chiếu cơ sở dữ liệu tuyển dụng địa phương."
      }
    });

    const text = response.text?.trim() || "{}";
    const data = JSON.parse(text);

    const targetDomain = data.targetDomain || "Lĩnh vực chuyên môn phù hợp";

    const usedJobIds = new Set<string>();
    const enrichedRecommendations = (data.recommendations || []).map((rec: any) => {
      let jobs = rec.matchedJobs;
      if (!jobs || jobs.length === 0) {
        jobs = matchLocalJobsForCategory(rec.category || targetDomain, rec.title, rec.skillsRequired || []);
      }
      // Deduplicate across careers
      jobs = (jobs || []).filter((j: any) => !usedJobIds.has(j.id));
      jobs.forEach((j: any) => usedJobIds.add(j.id));
      return {
        ...rec,
        matchedJobs: jobs.slice(0, 2)
      };
    });

    const matchedJobs = matchLocalJobsForCategory(targetDomain);

    return res.json({
      targetDomain,
      domainShortageReason: data.domainShortageReason || "Thị trường Việt Nam đang khát nhân sự có tay nghề cao mảng này.",
      beginnerFriendlyAnalysis: data.beginnerFriendlyAnalysis || "Qua các lá bài giá trị cao bạn chọn ở Bước 2, bạn thể hiện phong cách làm việc chủ động: ưu tiên tự mình xử lý các khâu cốt lõi để đảm bảo kết quả tốt nhất.",
      strategicPreferenceAdvice: data.strategicPreferenceAdvice || "Nếu bạn muốn tìm công việc có thể bắt đầu nhanh với mức lương hấp dẫn tại địa phương, các vị trí kỹ thuật thực chiến là lựa chọn hàng đầu.",
      extractedSkills: data.extractedSkills || ["Giải quyết vấn đề thực tế"],
      inferredFromTasks: data.inferredFromTasks || ["Tập trung giá trị cốt lõi"],
      inferredFromStyles: data.inferredFromStyles || ["Thích ứng linh hoạt"],
      strengths: data.strengths || [],
      thinkingStyles: data.thinkingStyles || [],
      skillGaps: data.skillGaps || [],
      recommendations: enrichedRecommendations,
      matchedJobs
    });

  } catch (error: any) {
    console.error("Gemini Jigsaw Guess API Error:", error);
    const result = getSimulatedJigsawGuess(gameState, jigsawData);
    return res.json(result);
  }
});

// ----------------------------------------------------
// API: Generate Topic-Specific Scenarios via AI Studio (Gemini)
// ----------------------------------------------------
app.post("/api/workday-generate-scenarios", async (req, res) => {
  const { careerId, careerTitle } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    console.log(`[RealPath Server] API key missing. Returning default scenarios for ${careerId}`);
    return res.json({ scenarios: null });
  }

  try {
    const prompt = `
      Vai trò: Thiết kế kịch bản mô phỏng nghề "${careerTitle}" (ID: ${careerId}) cho RealPath.
      Tạo đúng 3 tình huống trong ngày ("09:00", "13:30", "16:00") không có đúng/sai.

      Yêu cầu đầu ra (JSON tiếng Việt):
      {
        "scenarios": [
          {
            "id": "${careerId}-1",
            "time": "09:00",
            "title": "Tiêu đề ngắn (< 8 từ)",
            "description": "Mô tả hoàn cảnh (1-2 câu)",
            "choices": [
              {
                "id": "A",
                "label": "Hành động xử lý (1 câu)",
                "outcome": "Kết quả dự kiến (1-2 câu)",
                "consideration": "Rủi ro/Cân nhắc (1 câu)",
                "signals": ["kỹ năng/thái độ 1", "kỹ năng/thái độ 2"]
              }
            ]
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
        systemInstruction: "Bạn là chuyên gia thiết kế kịch bản tình huống AI cho RealPath. Chỉ trả về JSON hợp lệ."
      }
    });

    const text = response.text?.trim() || "{}";
    const data = JSON.parse(text);

    return res.json({ scenarios: data.scenarios || null });
  } catch (error: any) {
    console.error("Gemini Workday Generate Scenarios Error:", error);
    return res.json({ scenarios: null });
  }
});

// ----------------------------------------------------
// API: Analyze Workday Simulation Experience
// ----------------------------------------------------
app.post("/api/workday-analyze", async (req, res) => {
  const { careerId, careerTitle, scenarios, userSelections } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    console.log("[RealPath Server] Running simulated Workday Analysis (No API key)");
    return res.json(getSimulatedWorkdayAnalysis(careerId, careerTitle, scenarios, userSelections));
  }

  try {
    const prompt = `
      Vai trò: Trợ lý khám phá nghề nghiệp Việt Nam.
      Phân tích cách người dùng xử lý 3 tình huống của nghề "${careerTitle}" (ID: ${careerId}):
      ${JSON.stringify(userSelections, null, 2)}

      Yêu cầu: Đánh giá khách quan, không dùng điểm số/phần trăm, dùng ngôn từ trung lập/thận trọng.
      
      Yêu cầu đầu ra (JSON tiếng Việt):
      {
        "careerId": "${careerId}",
        "summary": "Tóm tắt xu hướng tiếp cận công việc (1-2 câu)",
        "observations": [
          {
            "title": "Nhận xét ngắn",
            "evidence": "Dẫn chứng từ lựa chọn của họ",
            "caveat": "Lưu ý/Cân nhắc thêm"
          }
        ],
        "interestSignals": [
          {
            "name": "Tín hiệu sở thích",
            "reason": "Lý do qua lựa chọn"
          }
        ],
        "smallExperiment": {
          "title": "Thử nghiệm nhỏ (30-90 phút)",
          "description": "Mô tả hoạt động thực tế",
          "estimatedTime": "30–90 phút"
        },
        "disclaimer": "Ba tình huống mô phỏng chưa đủ để kết luận mức độ phù hợp nghề nghiệp."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
        systemInstruction: "Bạn là trợ lý khám phá nghề nghiệp AI cho RealPath. Chỉ trả về JSON hợp lệ."
      }
    });

    const text = response.text?.trim() || "{}";
    const data = JSON.parse(text);

    if (Array.isArray(data.observations) && data.observations.length > 3) {
      data.observations = data.observations.slice(0, 3);
    }
    if (Array.isArray(data.interestSignals) && data.interestSignals.length > 3) {
      data.interestSignals = data.interestSignals.slice(0, 3);
    }

    return res.json(data);

  } catch (error: any) {
    console.error("Gemini Workday Analyze Error:", error);
    return res.json(getSimulatedWorkdayAnalysis(careerId, careerTitle, scenarios, userSelections));
  }
});

// Helper for Workday Analysis Simulation Fallback
function getSimulatedWorkdayAnalysis(careerId: string, careerTitle: string, scenarios: any[], userSelections: any[]): any {
  const observations: any[] = [];
  const interestSignals: any[] = [];

  (userSelections || []).forEach((sel: any, idx: number) => {
    if (sel.selectedChoice) {
      const choice = sel.selectedChoice;
      if (idx === 0) {
        observations.push({
          title: `Ưu tiên ${choice.signals?.[0] || 'xử lý trực tiếp'} khi khởi đầu`,
          evidence: `Ở tình huống 1, bạn đã chọn "${choice.label}"`,
          caveat: choice.consideration || "Cần cân nhắc nguồn lực và thời gian khi triển khai thực tế."
        });
        if (choice.signals?.[1]) {
          interestSignals.push({
            name: `Hứng thú với góc nhìn ${choice.signals[1]}`,
            reason: `Thể hiện qua cách bạn tiếp cận bài toán ban đầu.`
          });
        }
      } else if (idx === 1) {
        observations.push({
          title: `Cách ứng biến ${choice.signals?.[0] || 'thích ứng'} trước áp lực`,
          evidence: `Ở tình huống 2, bạn chọn "${choice.label}"`,
          caveat: choice.consideration || "Nên duy trì sự cân bằng giữa tiến độ và chất lượng."
        });
      } else if (idx === 2) {
        observations.push({
          title: `Tư duy ${choice.signals?.[0] || 'trách nhiệm'} trong quyết định cuối`,
          evidence: `Ở tình huống 3, bạn chọn "${choice.label}"`,
          caveat: choice.consideration || "Cân nhắc kỹ tác động dài hạn đến các bên liên quan."
        });
        if (choice.signals?.[1]) {
          interestSignals.push({
            name: `Tín hiệu ${choice.signals[1]}`,
            reason: `Bộc lộ qua quyết định ở tình huống cuối ngày.`
          });
        }
      }
    }
  });

  let experimentTitle = `Thử nghiệm nhỏ cho ${careerTitle}`;
  let experimentDesc = `Thực hiện một bài tập nhỏ 45 phút để hiểu sâu hơn về công việc này.`;

  if (careerId === "ai-engineer") {
    experimentTitle = "Thực hành tinh chỉnh Prompt & Kiểm thử mẫu Dữ liệu";
    experimentDesc = "Dành 45 phút thử nghiệm 5 prompt khác nhau trên AI Playground, ghi lại sự khác biệt về độ dài và độ chính xác của phản hồi.";
  } else if (careerId === "graphic-designer") {
    experimentTitle = "Tạo Moodboard 3 Phong cách Thị giác";
    experimentDesc = "Dành 45 phút trên Pinterest/Figma để thu thập 9 hình ảnh đại diện cho 3 phong cách thiết kế: Tối giản, Nổi bật và Cổ điển.";
  } else if (careerId === "auditor") {
    experimentTitle = "Đối chiếu 5 Hóa đơn với Nhật ký Giao dịch mẫu";
    experimentDesc = "Tải một file Excel kiểm toán mẫu và dành 30 phút rà soát sự lệch số liệu giữa sổ cái và chứng từ giao nhận.";
  } else if (careerId === "growth-marketer") {
    experimentTitle = "Phân tích Phễu Chuyển đổi của 1 Sản phẩm yêu thích";
    experimentDesc = "Dành 45 phút vẽ lại hành trình từ lúc bạn nhìn thấy quảng cáo của một ứng dụng đến khi bạn tạo tài khoản và dùng tính năng đầu tiên.";
  } else if (careerId === "hr-manager") {
    experimentTitle = "Soạn Checkpoint Onboarding 7 Ngày cho Bạn cùng nhóm";
    experimentDesc = "Dành 30 phút phác thảo danh sách 5 điều một thành viên mới cần biết khi gia nhập một câu lạc bộ hoặc dự án nhóm.";
  }

  return {
    careerId,
    summary: `Ngày làm việc mô phỏng của bạn ở vai trò ${careerTitle} cho thấy cách tiếp cận công việc có sự kết hợp giữa phân tích và thực thi trực tiếp.`,
    observations: observations.slice(0, 3),
    interestSignals: interestSignals.slice(0, 3),
    smallExperiment: {
      title: experimentTitle,
      description: experimentDesc,
      estimatedTime: "30–90 phút"
    },
    disclaimer: "Ba tình huống mô phỏng chưa đủ để kết luận mức độ phù hợp nghề nghiệp."
  };
}


// Helper for Heuristics Fallback Engine (Groups 3 positions in the SAME domain)
function getSimulatedJigsawGuess(gameState: any, jigsawData: any): any {
  const { story = "", taskAssignments = {}, styles = {} } = gameState;
  const storyLower = story.toLowerCase();

  // 1. Extract skills from story
  const extractedSkills: string[] = [];
  if (storyLower.includes("máy tính") || storyLower.includes("sửa máy") || storyLower.includes("linh kiện") || storyLower.includes("phần cứng")) {
    extractedSkills.push("Sửa chữa phần cứng & Máy tính", "Chẩn đoán kỹ thuật thực tế");
  }
  if (storyLower.includes("quản lý") || storyLower.includes("lãnh đạo") || storyLower.includes("tổ chức") || storyLower.includes("điều hành")) {
    extractedSkills.push("Quản lý dự án", "Điều hành quy trình");
  }
  if (storyLower.includes("thiết kế") || storyLower.includes("vẽ") || storyLower.includes("giao diện") || storyLower.includes("màu sắc") || storyLower.includes("thẩm mỹ")) {
    extractedSkills.push("Tư duy thẩm mỹ", "Sáng tạo trực quan");
  }
  if (storyLower.includes("lập trình") || storyLower.includes("code") || storyLower.includes("thuật toán") || storyLower.includes("sửa lỗi") || storyLower.includes("hệ thống")) {
    extractedSkills.push("Giải quyết vấn đề kỹ thuật", "Tư duy giải thuật");
  }
  if (storyLower.includes("kho") || storyLower.includes("vận chuyển") || storyLower.includes("logistics") || storyLower.includes("hàng hóa") || storyLower.includes("sắp xếp")) {
    extractedSkills.push("Quản trị kho bãi & Luồng hàng", "Tối ưu hóa chuỗi cung ứng");
  }
  if (extractedSkills.length === 0) {
    extractedSkills.push("Tự chủ giải quyết công việc", "Thích ứng thực tế", "Kỹ năng chuyên môn cốt lõi");
  }

  // 2. Infer skills from tasks
  const inferredFromTasks: string[] = [];
  const doNowList: string[] = [];
  const delegateList: string[] = [];
  const skipList: string[] = [];

  Object.entries(taskAssignments).forEach(([taskId, col]) => {
    if (col === "doNow") doNowList.push(taskId);
    else if (col === "delegate") delegateList.push(taskId);
    else if (col === "skip") skipList.push(taskId);
  });

  if (doNowList.some(id => id.includes("sua") || id.includes("toi-uu") || id.includes("chuyen-mon"))) {
    inferredFromTasks.push("Đam mê thực chiến chuyên môn sâu");
  }
  if (doNowList.some(id => id.includes("y-tuong") || id.includes("storyboard") || id.includes("poster"))) {
    inferredFromTasks.push("Tư duy Sáng tạo Đột phá");
  }
  if (delegateList.some(id => id.includes("tu-van") || id.includes("giao-tiep") || id.includes("dat-san"))) {
    inferredFromTasks.push("Ưu tiên và Ủy quyền hậu cần");
  }
  if (skipList.some(id => id.includes("kiem-ke") || id.includes("don-dep") || id.includes("nhap-lieu") || id.includes("form"))) {
    inferredFromTasks.push("Tập trung giá trị cốt lõi & Bỏ qua sự xao nhãng thủ công");
  }
  if (inferredFromTasks.length === 0) {
    inferredFromTasks.push("Quản trị hiệu suất cá nhân linh hoạt");
  }

  // 3. Infer skills from styles
  const inferredFromStyles: string[] = [];
  if (styles.workStyle === "collaborative") {
    inferredFromStyles.push("Khả năng cộng tác Đội nhóm");
  } else {
    inferredFromStyles.push("Độc lập tập trung sâu");
  }
  if (styles.studyStyle === "practical") {
    inferredFromStyles.push("Học tập thực chiến qua dự án thật");
  } else {
    inferredFromStyles.push("Nắm vững nguyên lý hệ thống bài bản");
  }

  // 4. MATCH 3 POSITIONS IN THE EXACT SAME DOMAIN BASED ON STORY KEYWORDS
  let targetDomain = "";
  let domainShortageReason = "";
  let recs: any[] = [];

  if (storyLower.includes("kho") || storyLower.includes("vận chuyển") || storyLower.includes("logistics") || storyLower.includes("hàng hóa") || storyLower.includes("hóa đơn")) {
    targetDomain = "Logistics & Chuỗi Cung ứng (Logistics & Supply Chain)";
    domainShortageReason = "Việt Nam là trung tâm sản xuất và xuất nhập khẩu khu vực, nhưng ngành Logistics đang đối mặt với nguy cơ thiếu hơn 200.000 nhân sự quản lý vận hành kho bãi và chuỗi cung ứng chuyên nghiệp.";
    recs = [
      {
        title: "Chuyên viên Quản lý Kho bãi & Tồn kho (Warehouse & Inventory Specialist)",
        category: "Logistics & Chuỗi Cung ứng",
        reason: `Từ câu chuyện ở Bước 1 của bạn về kiểm kê và sắp xếp, việc bạn trực tiếp phân loại luồng công việc giúp bạn cực kỳ phù hợp với vị trí quản trị vận hành kho bãi.`,
        salaryRange: "14 - 30 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Nhu cầu lớn từ các tập đoàn logistics, trung tâm fulfillment và sàn thương mại điện tử.",
        skillsRequired: ["WMS (Warehouse Management System)", "Kiểm soát tồn kho", "Tối ưu diện tích lưu kho", "Phân tích số liệu nhập xuất"],
        shortageNote: "🔥 Thiếu hụt trầm trọng: Các trung tâm Fulfillment thương mại điện tử đang ráo riết săn đón nhân sự quản lý kho số hóa.",
        cities: ["TP Hồ Chí Minh", "Hà Nội", "Bình Dương", "Hải Phòng"]
      },
      {
        title: "Chuyên viên Điều hành Vận tải & Supply Chain (Freight & Logistics Coordinator)",
        category: "Logistics & Chuỗi Cung ứng",
        reason: `Từ khả năng ủy quyền hậu cần và điều phối tiến độ của bạn, vị trí này cho phép bạn làm chủ luồng vận tải hàng hóa từ cảng/kho đến khách hàng.`,
        salaryRange: "16 - 35 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Trọng tâm chuỗi giá trị xuất nhập khẩu toàn cầu.",
        skillsRequired: ["Điều phối đội xe vận tải", "Lập kế hoạch tuyến đường (TMS)", "Quản lý hợp đồng nhà xe", "Xử lý sự cố giao vận"],
        shortageNote: "🔥 Tuyển dụng liên tục: Doanh nghiệp xuất nhập khẩu Việt Nam luôn thiếu nhân sự điều phối vận tải am hiểu số hóa.",
        cities: ["TP Hồ Chí Minh", "Hải Phòng", "Hà Nội"]
      },
      {
        title: "Chuyên viên Khai báo Hải quan & Xuất Nhập khẩu (Customs & Forwarding Specialist)",
        category: "Logistics & Chuỗi Cung ứng",
        reason: `Phù hợp với thói quen cẩn trọng, tuân thủ quy trình và giải quyết nhanh gọn các thủ tục hải quan xuất nhập khẩu.`,
        salaryRange: "15 - 32 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Đóng vai trò then chốt khi Việt Nam ký kết hàng loạt hiệp định thương mại tự do FTA.",
        skillsRequired: ["Tra cứu mã HS Code", "Truyền tờ khai hải quan (VNACCS)", "Chứng từ xuất nhập khẩu (LC, BL, Invoice)", "Tiếng Anh thương mại"],
        shortageNote: "🔥 Nhân lực cực hiếm: Rất ít nhân sự vừa thành thạo chứng từ vừa am hiểu luật hải quan thực chiến.",
        cities: ["Hải Phòng", "TP Hồ Chí Minh", "Đà Nẵng", "Hà Nội"]
      }
    ];
  } else if (storyLower.includes("sửa máy") || storyLower.includes("máy tính") || storyLower.includes("phần cứng") || storyLower.includes("linh kiện") || storyLower.includes("bảo trì")) {
    targetDomain = "Kỹ thuật Máy tính & Bảo trì Hệ thống (Hardware & Systems Engineering)";
    domainShortageReason = "Hàng triệu thiết bị phần cứng, máy chủ và hạ tầng mạng tại các doanh nghiệp Việt Nam cần đội ngũ kỹ thuật viên am hiểu tháo ráp, chẩn đoán sự cố và bảo trì thực chiến.";
    recs = [
      {
        title: "Kỹ thuật viên Sửa chữa & Bảo trì Máy tính (Computer Hardware Specialist)",
        category: "Kỹ thuật Máy tính & Bảo trì Hệ thống",
        reason: `Dựa trên câu chuyện trực tiếp tháo lắp, chẩn đoán lỗi linh kiện và tối ưu thiết bị ở Bước 1, bạn hoàn toàn làm chủ vị trí kỹ thuật phần cứng thực tế.`,
        salaryRange: "12 - 25 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Nhu cầu bền vững từ tất cả các trung tâm bảo hành, cửa hàng thiết bị và chuỗi bán lẻ công nghệ.",
        skillsRequired: ["Chẩn đoán lỗi bo mạch & Mainboard", "Thay thế linh kiện (RAM/SSD/VGA)", "Tối ưu hệ điều hành & BIOS", "Kỹ năng tư vấn kỹ thuật"],
        shortageNote: "🔥 Thiếu nhân sự lành nghề: Các trung tâm dịch vụ kỹ thuật liên tục khát kỹ thuật viên thực chiến giỏi bắt bệnh máy.",
        cities: ["Hà Nội", "TP Hồ Chí Minh", "Đà Nẵng", "Cần Thơ"]
      },
      {
        title: "Kỹ sư Hạ tầng Mạng & Hệ thống IT (Systems & Network Administrator)",
        category: "Kỹ thuật Máy tính & Bảo trì Hệ thống",
        reason: `Từ tư duy gỡ lỗi thiết bị và quản lý linh kiện của bạn, vị trí này nâng tầm công việc lên quản trị toàn bộ hệ thống máy chủ, switch mạng và bảo mật thiết bị cho văn phòng/doanh nghiệp.`,
        salaryRange: "16 - 35 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Xương sống vận hành hệ thống IT cho mọi tập đoàn và công ty.",
        skillsRequired: ["Cấu hình Router/Switch (Cisco/Mikrotik)", "Quản trị Server (Windows Server/Linux)", "Bảo mật hạ tầng mạng", "Sao lưu dữ liệu phòng sự cố"],
        shortageNote: "🔥 Tuyển dụng lớn: Các doanh nghiệp quy mô vừa và lớn luôn cần Kỹ sư hệ thống túc trực xử lý sự cố mạng.",
        cities: ["Hà Nội", "TP Hồ Chí Minh", "Đà Nẵng"]
      },
      {
        title: "Chuyên viên Hỗ trợ Kỹ thuật & IT Helpdesk (IT Technical Support Specialist)",
        category: "Kỹ thuật Máy tính & Bảo trì Hệ thống",
        reason: `Phù hợp với khả năng xử lý sự cố thiết bị nhanh gọn, đồng thời hỗ trợ người dùng khắc phục các lỗi phần cứng/phần mềm văn phòng hàng ngày.`,
        salaryRange: "12 - 22 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Vị trí nền tảng quan trọng giúp thăng tiến lên Chuyên gia Bảo mật hoặc Quản trị Hạ tầng IT.",
        skillsRequired: ["ITIL Workflow", "Remote Troubleshooting (TeamViewer/AnyDesk)", "Quản lý tài sản IT", "Giao tiếp & Hỗ trợ người dùng"],
        shortageNote: "🔥 Nhu cầu thị trường cực cao: Mọi công ty từ 30 nhân sự trở lên đều cần IT Helpdesk chuyên trách.",
        cities: ["Hà Nội", "TP Hồ Chí Minh", "Bình Dương"]
      }
    ];
  } else if (storyLower.includes("thiết kế") || storyLower.includes("vẽ") || storyLower.includes("ảnh") || storyLower.includes("giao diện")) {
    targetDomain = "Thiết kế & Công nghệ Sản phẩm (Product Design)";
    domainShortageReason = "Hàng ngàn phần mềm và ứng dụng số ra đời mỗi năm, kéo theo cơn khát nhân lực thiết kế hiểu về tư duy người dùng thực tế.";
    recs = [
      {
        title: "UI/UX Product Designer",
        category: "Thiết kế & Công nghệ Sản phẩm",
        reason: `Từ câu chuyện tạo ra sản phẩm thị giác của bạn ở Bước 1, vị trí này giúp bạn biến các phác thảo thành giao diện ứng dụng triệu người dùng.`,
        salaryRange: "15 - 32 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Bùng nổ cùng làn sóng chuyển đổi số ứng dụng mobile & web.",
        skillsRequired: ["User Research", "Wireframing & Prototyping", "Figma & Framer", "Design System"],
        shortageNote: "🔥 Thiếu hụt nghiêm trọng: Ước tính thiếu 35% nhân sự UI/UX có khả năng làm sản phẩm thực chiến.",
        cities: ["TP Hồ Chí Minh", "Hà Nội"]
      },
      {
        title: "Design System & Interaction Specialist",
        category: "Thiết kế & Công nghệ Sản phẩm",
        reason: `Dựa trên thói quen sắp xếp và chuẩn hóa quy trình của bạn ở Bước 2, bạn rất thích hợp quản lý bộ nguyên tắc thiết kế toàn hệ thống.`,
        salaryRange: "18 - 35 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Chuẩn hóa trải nghiệm thị giác cho tập đoàn công nghệ lớn.",
        skillsRequired: ["Design Tokens", "Component Library", "Framer/Rive Animation", "UI Accessibility"],
        shortageNote: "🔥 Nhân lực cực hiếm: Thị trường rất khó kiếm chuyên gia chuyên sâu về Design System.",
        cities: ["TP Hồ Chí Minh", "Hà Nội"]
      },
      {
        title: "Product Visual & Motion Designer",
        category: "Thiết kế & Công nghệ Sản phẩm",
        reason: `Từ khả năng tạo cảm xúc thị giác của bạn ở Bước 1, vị trí này tập trung tạo các hiệu ứng chuyển động mượt mà cho sản phẩm.`,
        salaryRange: "16 - 32 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Nhu cầu cao từ ứng dụng game, fintech và thương mại điện tử.",
        skillsRequired: ["2D/3D Motion Graphics", "After Effects & Rive", "Micro-interaction", "Brand Identity"],
        shortageNote: "🔥 Đang khát nhân tài: Săn đón mạnh mẽ các chuyên viên Motion có tư tư sản phẩm.",
        cities: ["TP Hồ Chí Minh", "Hà Nội", "Đà Nẵng"]
      }
    ];
  } else {
    targetDomain = "Công nghệ Thông tin & Lập trình Phần mềm (Software Engineering)";
    domainShortageReason = "Thị trường Việt Nam liên tục báo động thiếu hụt hàng chục ngàn lập trình viên và kỹ sư phần mềm chất lượng cao mỗi năm.";
    recs = [
      {
        title: "AI & Machine Learning Engineer",
        category: "Công nghệ Thông tin & Lập trình Phần mềm",
        reason: `Từ câu chuyện giải quyết vấn đề kỹ thuật của bạn ở Bước 1, vị trí này mở ra cơ hội huấn luyện các mô hình trí tuệ nhân tạo thế hệ mới.`,
        salaryRange: "25 - 55 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Mô hình AI đang tích hợp vào mọi giải pháp phần mềm doanh nghiệp.",
        skillsRequired: ["Python / C++", "Machine Learning & NLP", "PyTorch / TensorFlow", "Data Pipeline"],
        shortageNote: "🔥 Khát nhân lực đỉnh điểm: Việt Nam đang thiếu hơn 150.000 kỹ sư công nghệ, đặc biệt là mảng AI.",
        cities: ["Hà Nội", "TP Hồ Chí Minh", "Đà Nẵng"]
      },
      {
        title: "Fullstack Software Engineer",
        category: "Công nghệ Thông tin & Lập trình Phần mềm",
        reason: `Việc bạn tự tay xử lý mảng cốt lõi và bỏ qua các công việc kiểm kê thủ công ở Bước 2 là tố chất điển hình của một Kỹ sư phần mềm Fullstack.`,
        salaryRange: "20 - 45 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Trọng tâm xây dựng hệ thống phần mềm doanh nghiệp.",
        skillsRequired: ["TypeScript & React/Next.js", "Node.js / Go", "PostgreSQL / Redis", "System Architecture"],
        shortageNote: "🔥 Tuyển dụng liên tục: Doanh nghiệp luôn tìm kiếm Lập trình viên Fullstack chủ động giải quyết bài toán.",
        cities: ["Hà Nội", "TP Hồ Chí Minh"]
      },
      {
        title: "Cybersecurity & Cloud Security Specialist",
        category: "Công nghệ Thông tin & Lập trình Phần mềm",
        reason: `Phù hợp với tư duy cẩn trọng, bảo vệ quy trình và gỡ lỗi hệ thống của bạn.`,
        salaryRange: "22 - 50 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Bảo mật dữ liệu là ưu tiên hàng đầu của ngân hàng và doanh nghiệp.",
        skillsRequired: ["Cloud Architecture (AWS/GCP)", "Penetration Testing", "Zero Trust Security", "Network Protocol"],
        shortageNote: "🔥 Thiếu hụt chuyên gia trầm trọng: Rất ít nhân sự Việt Nam đạt chứng chỉ bảo mật quốc tế.",
        cities: ["Hà Nội", "TP Hồ Chí Minh"]
      }
    ];
  }

  const matchedJobs = matchLocalJobsForCategory(targetDomain);

  const simUsedJobIds = new Set<string>();
  const enrichedRecs = recs.map((r: any) => {
    let jobs = matchLocalJobsForCategory(r.category || targetDomain, r.title, r.skillsRequired || []);
    jobs = jobs.filter((j: any) => !simUsedJobIds.has(j.id));
    jobs.forEach((j: any) => simUsedJobIds.add(j.id));
    return {
      ...r,
      whyRecommended: r.whyRecommended || `Dựa vào cách bạn chọn bốc các lá bài ở Bước 2 (ưu tiên làm các tác vụ cốt lõi, ủy quyền công việc hậu cần), kết hợp với câu chuyện thành tích ở Bước 1, điều này cho thấy bạn là mẫu người có tư duy thực chiến rõ ràng và năng lực phù hợp để đảm nhận vị trí ${r.title}.`,
      matchedJobs: jobs.slice(0, 2)
    };
  });

  const simulatedStrengths = extractedSkills.map(sk => ({
    name: sk,
    evidence: "Trích xuất từ câu chuyện học tập/làm việc của bạn ở Bước 1",
    analysis: "Kỹ năng thực chiến thể hiện qua bối cảnh câu chuyện tự thuật."
  }));

  const simulatedThinking = inferredFromTasks.map(sk => ({
    name: sk,
    evidence: "Suy luận từ phân loại 10 lá bài ở Bước 2",
    analysis: "Ưu tiên phân phối thời gian và cách phân chia giải quyết nhiệm vụ."
  }));

  const simulatedGaps = inferredFromStyles.map(sk => ({
    name: sk,
    evidence: "Suy luận từ phong cách hoạt động chọn ở Bước 3",
    analysis: "Điểm cần lưu ý bồi dưỡng thêm để tránh mất cân bằng phong cách làm việc."
  }));

  return {
    targetDomain,
    domainShortageReason,
    beginnerFriendlyAnalysis: `Dành cho người mới bắt đầu: Qua việc bạn xếp 5 lá bài công việc ở Bước 2, có thể thấy bạn là mẫu người thiên về giải quyết vấn đề trực tiếp — bạn chọn tự làm các việc chuyên môn quan trọng nhất, đồng thời chủ động nhờ đồng đội gánh vác các khâu giao tiếp hậu cần và bỏ qua những công việc dọn dẹp thủ công xao nhãng.`,
    strategicPreferenceAdvice: `Lời tư vấn chọn ngành theo mục tiêu cá nhân: Nếu bạn muốn đi làm ngay có mức lương tốt và tiếp cận môi trường thực tế tại địa phương thì các vị trí Kỹ thuật / Vận hành thực chiến là lựa chọn hàng đầu. Nếu bạn ưa thích định hướng tích lũy kiến thức sâu để phát triển sự nghiệp bền vững lâu dài, bạn nên chọn lộ trình quản trị hệ thống sản phẩm.`,
    extractedSkills,
    inferredFromTasks,
    inferredFromStyles,
    strengths: simulatedStrengths,
    thinkingStyles: simulatedThinking,
    skillGaps: simulatedGaps,
    recommendations: enrichedRecs,
    matchedJobs
  };
}

// ----------------------------------------------------
// API: Analyze Career Assessment
// ----------------------------------------------------
app.post("/api/analyze-career", async (req, res) => {
  const { answers } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    console.log("No GEMINI_API_KEY found, running critical analyst simulation with domain career options.");
    const sim = getSimulatedAssessment(answers);
    return res.json({ ...sim, userInputsMemory: answers });
  }

  try {
    const prompt = `
      Vai trò: Nhà phân tích/phê bình định hướng sự nghiệp độc lập RealPath.
      Mổ xẻ dữ liệu đầu vào khách quan, trung thực, không tâng bốc.
      
      Quy tắc đề xuất:
      - Đề xuất 1 LĨNH VỰC CHỦ ĐẠO (targetDomain) và 2-3 nghề bình đẳng (careerOptions) trong đó (để người dùng tự chọn).
      - Các nghề phải khát nhân lực tại Việt Nam (kèm shortageNote thực trạng).
      - KHÔNG dùng phần trăm khớp giả định.
      
      Khảo sát người dùng:
      ${JSON.stringify(answers, null, 2)}

      Yêu cầu đầu ra (JSON tiếng Việt):
      {
        "targetDomain": "Lĩnh vực phù hợp",
        "domainShortageReason": "Thực trạng thiếu nhân sự chất lượng cao mảng này ở Việt Nam",
        "careerOptions": [
          {
            "title": "Tên nghề nghiệp",
            "category": "Lĩnh vực",
            "salaryRange": "Khoảng lương thực tế (ví dụ: 15-30 triệu VNĐ)",
            "jobDemand": "Cao",
            "futureOutlook": "Triển vọng và áp lực 5 năm tới",
            "skillsRequired": ["Kỹ năng 1", "Kỹ năng 2"],
            "matchReason": "Lý do phù hợp dựa trên khảo sát",
            "shortageNote": "Thực trạng thiếu nhân sự thực tế",
            "cities": ["Hà Nội", "TP Hồ Chí Minh"]
          }
        ],
        "strengths": [{"name": "Năng lực", "evidence": "Dẫn chứng từ khảo sát", "analysis": "Đánh giá chi tiết"}],
        "thinkingStyles": [{"name": "Tư duy", "evidence": "Dẫn chứng từ khảo sát", "analysis": "Đánh giá ưu/nhược"}],
        "skillGaps": [{"name": "Điểm cần cải thiện", "evidence": "Từ kỹ năng bỏ trống/chưa thể hiện", "analysis": "Cảnh báo hậu quả"}],
        "riskAnalysis": [{"risk": "Rủi ro thực tế", "mitigation": "Giải pháp khắc phục"}],
        "naturalLanguageExplanation": "Phân tích phê bình tổng quan ngắn gọn"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
        systemInstruction: "Bạn là nhà phân tích và phê bình định hướng sự nghiệp độc lập của RealPath. Đưa ra 2-3 tùy chọn bình đẳng trong cùng lĩnh vực đang thiếu nhân lực để người dùng tự chọn."
      }
    });

    const text = response.text?.trim() || "{}";
    const data = JSON.parse(text);
    const careerOptions = data.careerOptions || [];
    const primaryCareer = careerOptions[0] || data.primaryCareer;
    const topCareers = careerOptions.slice(1);

    return res.json({
      ...data,
      careerOptions,
      primaryCareer,
      topCareers,
      userInputsMemory: answers
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const fallback = getSimulatedAssessment(answers);
    return res.status(500).json({
      error: "Không thể phân tích dữ liệu bằng AI. Đang kích hoạt bộ máy dự phòng.",
      details: error.message,
      fallbackData: { ...fallback, userInputsMemory: answers }
    });
  }
});

// ----------------------------------------------------
// API: Generate Customized Learning Roadmap
// ----------------------------------------------------
app.post("/api/generate-roadmap", async (req, res) => {
  const { careerTitle, skills } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    console.log("No GEMINI_API_KEY found, running realistic roadmap simulation.");
    return res.json(getSimulatedRoadmap(careerTitle, skills));
  }

  try {
    const prompt = `
      Vai trò: Chuyên gia hướng nghiệp AI RealPath. 
      Xây dựng lộ trình học tập cá nhân hóa Timeline cho nghề: "${careerTitle}".
      Kỹ năng trọng tâm: ${JSON.stringify(skills)}

      Yêu cầu đầu ra (JSON tiếng Việt, các trường đại học/đơn vị đào tạo thực tế ở Việt Nam):
      {
        "steps": [
          {
            "stage": "Giai đoạn 1: Nền tảng & Tư duy (0 - 3 tháng)",
            "title": "Xây dựng tư duy/kỹ năng cơ bản",
            "duration": "1 - 3 tháng",
            "skillsToLearn": ["Kỹ năng 1", "Kỹ năng 2"],
            "recommendedProjects": ["Dự án thực hành cơ bản"],
            "certifications": ["Chứng chỉ trực tuyến uy tín (ví dụ: Coursera)"],
            "colleges": ["Trường Đại học đào tạo tốt ở Việt Nam"],
            "vocationalSchools": ["Học viện/Đơn vị đào tạo ngắn hạn"],
            "tips": "Lời khuyên cốt lõi"
          },
          {
            "stage": "Giai đoạn 2: Phát triển Chuyên môn & Dự án (3 - 9 tháng)",
            "title": "Chuyên sâu thực chiến & Portfolio",
            "duration": "3 - 6 tháng",
            "skillsToLearn": ["Kỹ năng nâng cao", "Công cụ"],
            "recommendedProjects": ["Dự án hoàn chỉnh"],
            "certifications": ["Chứng chỉ chuyên môn trung cấp"],
            "colleges": ["Nguồn học liệu/Lab"],
            "vocationalSchools": ["Đơn vị đào tạo ngắn hạn uy tín"],
            "tips": "Lời khuyên thực hành/kết nối"
          },
          {
            "stage": "Giai đoạn 3: Thực tập & Sẵn sàng Nghề nghiệp (9+ tháng)",
            "title": "Gia nhập thị trường lao động",
            "duration": "3 - 6 tháng",
            "skillsToLearn": ["Kỹ năng mềm/phỏng vấn"],
            "recommendedProjects": ["Dự án doanh nghiệp/Hackathon"],
            "certifications": ["Chứng chỉ chuyên nghiệp"],
            "colleges": ["Chương trình liên kết doanh nghiệp"],
            "vocationalSchools": ["Ngày hội việc làm/Apprenticeship"],
            "tips": "Cách tối ưu CV/Portfolio"
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
        systemInstruction: "Bạn là chuyên gia thiết kế lộ trình sự nghiệp AI. Phản hồi chuẩn định dạng JSON."
      }
    });

    const text = response.text?.trim() || "{}";
    const data = JSON.parse(text);
    return res.json(data);
  } catch (error: any) {
    console.error("Gemini Roadmap API Error:", error);
    return res.status(500).json({
      error: "Không thể tạo lộ trình bằng AI. Đang kích hoạt bộ máy dự phòng.",
      details: error.message,
      fallbackData: getSimulatedRoadmap(careerTitle, skills)
    });
  }
});

// ----------------------------------------------------
// Mock Data Engine for realistic simulation with Critical Analysis & Risks
// ----------------------------------------------------
function getSimulatedAssessment(answers: any): any {
  const text = JSON.stringify(answers || {}).toLowerCase();

  let targetDomain = "";
  let domainShortageReason = "";
  let careerOptions: any[] = [];
  let strengths: any[], thinking: any[], gaps: any[], riskAnalysis: any[];

  if (text.includes("logistics") || text.includes("kho") || text.includes("vận chuyển") || text.includes("vận tải") || text.includes("hàng hóa") || text.includes("hải quan") || text.includes("xuất nhập khẩu") || text.includes("tồn kho")) {
    targetDomain = "Logistics & Chuỗi Cung ứng (Logistics & Supply Chain)";
    domainShortageReason = "Việt Nam là trung tâm sản xuất và xuất nhập khẩu khu vực, nhưng ngành Logistics đang đối mặt với nguy cơ thiếu hơn 200.000 nhân sự quản lý vận hành kho bãi và chuỗi cung ứng chuyên nghiệp.";
    careerOptions = [
      {
        title: "Chuyên viên Quản lý Kho bãi & Tồn kho",
        category: "Logistics & Chuỗi Cung ứng",
        salaryRange: "14 - 30 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Nhu cầu lớn từ các trung tâm Fulfillment và sàn TMĐT.",
        skillsRequired: ["WMS System", "Kiểm soát tồn kho", "Tối ưu kho bãi", "Phân tích số liệu xuất nhập"],
        matchReason: "Trực tiếp quản lý và tối ưu hóa luồng lưu trữ hàng hóa trong kho bãi.",
        shortageNote: "🔥 Thiếu hụt nghiêm trọng: Các tập đoàn TMĐT đang rất thiếu nhân sự quản lý kho bãi số hóa.",
        cities: ["TP Hồ Chí Minh", "Hà Nội", "Bình Dương", "Hải Phòng"]
      },
      {
        title: "Chuyên viên Điều hành Vận tải & Supply Chain",
        category: "Logistics & Chuỗi Cung ứng",
        salaryRange: "16 - 35 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Trọng tâm điều phối luồng hàng vận chuyển quốc tế và nội địa.",
        skillsRequired: ["TMS System", "Điều phối đội xe", "Quản lý hợp đồng giao vận", "Xử lý sự cố"],
        matchReason: "Lập kế hoạch và giám sát hành trình vận chuyển hàng hóa tối ưu chi phí.",
        shortageNote: "🔥 Tuyển dụng liên tục: Doanh nghiệp xuất nhập khẩu luôn khát nhân sự điều phối vận tải.",
        cities: ["TP Hồ Chí Minh", "Hải Phòng", "Hà Nội"]
      },
      {
        title: "Chuyên viên Khai báo Hải quan & Xuất Nhập khẩu",
        category: "Logistics & Chuỗi Cung ứng",
        salaryRange: "15 - 32 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Đóng vai trò then chốt trong xuất nhập khẩu thương mại quốc tế.",
        skillsRequired: ["Mã HS Code", "Truyền tờ khai VNACCS", "Chứng từ XNK (LC, BL)", "Tiếng Anh thương mại"],
        matchReason: "Thành thạo rà soát chứng từ và hoàn tất thủ tục hải quan xuất nhập khẩu.",
        shortageNote: "🔥 Nhân lực cực hiếm: Thị trường thiếu chuyên viên am hiểu luật hải quan thực chiến.",
        cities: ["Hải Phòng", "TP Hồ Chí Minh", "Đà Nẵng", "Hà Nội"]
      }
    ];
    strengths = [
      {
        name: "Tư duy Quản trị Luồng Hàng & Quy trình",
        evidence: "Bóc tách từ ưu tiên giải quyết các bước kiểm kê và sắp xếp kho bãi.",
        analysis: "Giúp tối ưu thời gian giao nhận hàng nhưng cần cẩn trọng rủi ro thất thoát vật tư."
      }
    ];
    thinking = [
      {
        name: "Tư duy Vận hành & Hệ thống Cung ứng",
        evidence: "Ưu tiên quy trình logic rõ ràng từ khâu nhập hàng đến xuất hàng.",
        analysis: "Đảm bảo tính chính xác cao trong quản lý vận chuyển."
      }
    ];
    gaps = [
      {
        name: "Kỹ năng Sử dụng Phần mềm Quản trị Kho WMS / TMS Nâng cao",
        evidence: "Chưa thể hiện kinh nghiệm vận hành các phần mềm quản lý kho quốc tế.",
        analysis: "Cần trau dồi các công cụ quản lý số để đáp ứng quy mô doanh nghiệp lớn."
      }
    ];
    riskAnalysis = [
      {
        risk: "Rủi ro đứt gãy chuỗi cung ứng do biến động chi phí vận tải hoặc chậm trễ hải quan.",
        mitigation: "Xây dựng phương án dự phòng nhà xe và đối tác vận tải đa kênh."
      }
    ];
  } else if (text.includes("máy tính") || text.includes("linh kiện") || text.includes("sửa máy") || text.includes("code") || text.includes("lập trình") || text.includes("thuật toán") || text.includes("tech") || text.includes("analytical")) {
    targetDomain = "Công nghệ Thông tin & Phần mềm (Information Technology)";
    domainShortageReason = "Tập đoàn công nghệ và startup đang bùng nổ, nhưng thị trường Việt Nam liên tục báo động thiếu hụt hàng chục ngàn lập trình viên và kỹ sư dữ liệu chất lượng cao mỗi năm.";
    careerOptions = [
      {
        title: "AI & Machine Learning Engineer",
        category: "Công nghệ Thông tin & Phần mềm",
        salaryRange: "25 - 55 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Mô hình trí tuệ nhân tạo đang tích hợp vào mọi giải pháp phần mềm doanh nghiệp.",
        skillsRequired: ["Python / C++", "Machine Learning & NLP", "PyTorch / TensorFlow", "Data Pipeline"],
        matchReason: "Xây dựng các mô hình máy học và huấn luyện dữ liệu thông minh.",
        shortageNote: "🔥 Khát nhân lực đỉnh điểm: Việt Nam đang thiếu hơn 150.000 kỹ sư công nghệ, đặc biệt là nhân sự làm chủ AI.",
        cities: ["Hà Nội", "TP Hồ Chí Minh", "Đà Nẵng"]
      },
      {
        title: "Fullstack Software Engineer",
        category: "Công nghệ Thông tin & Phần mềm",
        salaryRange: "20 - 45 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Cốt lõi xây dựng hệ thống web & app ứng dụng cho mọi doanh nghiệp.",
        skillsRequired: ["TypeScript & React/Next.js", "Node.js / Go", "PostgreSQL / Redis", "System Architecture"],
        matchReason: "Phát triển toàn diện từ giao diện người dùng đến hệ thống máy chủ xử lý dữ liệu.",
        shortageNote: "🔥 Tuyển dụng liên tục: Các công ty luôn trong tình trạng săn đón Lập trình viên Fullstack có khả năng làm chủ sản phẩm.",
        cities: ["Hà Nội", "TP Hồ Chí Minh"]
      },
      {
        title: "Cybersecurity & Cloud Security Specialist",
        category: "Công nghệ Thông tin & Phần mềm",
        salaryRange: "22 - 50 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Bảo mật thông tin là ưu tiên hàng đầu của ngân hàng, fintech và chính phủ số.",
        skillsRequired: ["Cloud Architecture (AWS/GCP)", "Penetration Testing", "Zero Trust Security", "Network Protocol"],
        matchReason: "Bảo vệ hệ thống dữ liệu khỏi các cuộc tấn công mạng và rò rỉ thông tin.",
        shortageNote: "🔥 Thiếu hụt chuyên gia trầm trọng: Rất ít nhân sự tại Việt Nam đạt chuẩn chứng chỉ bảo mật quốc tế.",
        cities: ["Hà Nội", "TP Hồ Chí Minh"]
      }
    ];
    strengths = [
      {
        name: "Tư duy Logic & Thuật toán Kỹ thuật",
        evidence: `Trích xuất từ lựa chọn ưu tiên mảng Công nghệ/Kỹ thuật.`,
        analysis: "Có năng lực mổ xẻ bài toán phức tạp thành các bước xử lý nhỏ."
      }
    ];
    thinking = [
      {
        name: "Tư duy Hệ thống & Cấu trúc (Systematic Thinking)",
        evidence: "Ưu tiên quy trình rõ ràng và logic nguyên nhân - kết quả.",
        analysis: "Giúp gỡ lỗi tốt nhưng có thể thiếu linh hoạt trước các yêu cầu thay đổi đột ngột."
      }
    ];
    gaps = [
      {
        name: "Giao tiếp Thuyết trình cho Người ngoài ngành",
        evidence: "Khảo sát chưa ghi nhận ưu tiên mảng giao tiếp xã hội.",
        analysis: "Rào cản lớn khi cần giải thích giải pháp kỹ thuật cho người không hiểu về code."
      }
    ];
    riskAnalysis = [
      {
        risk: "Lạc hậu công nghệ nhanh chóng nếu ngừng học trong 6 tháng.",
        mitigation: "Dành 5 tiếng mỗi tuần để đọc báo cáo công nghệ mới và đóng góp dự án mã nguồn mở."
      }
    ];
  } else if (text.includes("thiết kế") || text.includes("vẽ") || text.includes("ảnh") || text.includes("giao diện") || text.includes("creative")) {
    targetDomain = "Thiết kế & Công nghệ Sản phẩm (Product Design)";
    domainShortageReason = "Thị trường Việt Nam đang phát triển hàng ngàn sản phẩm số và phần mềm, nhưng đang thiếu nghiêm trọng nhân lực thiết kế hiểu sâu về tư duy sản phẩm và UX chứ không chỉ dừng ở vẽ đồ họa.";
    careerOptions = [
      {
        title: "UI/UX Product Designer",
        category: "Thiết kế & Công nghệ Sản phẩm",
        salaryRange: "15 - 32 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Nhu cầu lớn từ các công ty công nghệ, fintech và thương mại điện tử.",
        skillsRequired: ["User Research", "Wireframing & Prototyping", "UI Design System", "Figma & Framer"],
        matchReason: "Giải quyết bài toán trải nghiệm người dùng số. Phù hợp nếu bạn thích kết nối tâm lý người dùng với giao diện ứng dụng.",
        shortageNote: "🔥 Thiếu hụt nghiêm trọng: Ước tính các công ty công nghệ Việt Nam thiếu 35% nhân sự UI/UX có khả năng nghiên cứu người dùng thật.",
        cities: ["TP Hồ Chí Minh", "Hà Nội", "Hải Phòng"]
      },
      {
        title: "Design System & Interaction Specialist",
        category: "Thiết kế & Công nghệ Sản phẩm",
        salaryRange: "18 - 35 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Đóng vai trò duy trì tính đồng nhất giao diện ứng dụng cho các tập đoàn công nghệ lớn.",
        skillsRequired: ["Design Tokens", "Component Library", "Framer/Code Interaction", "Accessibility Standard"],
        matchReason: "Chuyên sâu vào chuẩn hóa thư viện giao diện và tương tác chuyển động phức tạp.",
        shortageNote: "🔥 Nhân lực cực hiếm: Rất ít nhân sự tại Việt Nam làm chủ chuyên sâu mảng Design System chuẩn cho quy mô lớn.",
        cities: ["TP Hồ Chí Minh", "Hà Nội"]
      },
      {
        title: "Product Visual & Motion Designer",
        category: "Thiết kế & Công nghệ Sản phẩm",
        salaryRange: "16 - 32 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Bùng nổ ứng dụng di động đòi hỏi trải nghiệm thị giác và animation mượt mà.",
        skillsRequired: ["2D/3D Motion Graphics", "Visual Branding", "Micro-interaction", "After Effects & Rive"],
        matchReason: "Tạo sự sống động và cảm xúc cho ứng dụng qua các hiệu ứng thị giác đỉnh cao.",
        shortageNote: "🔥 Đang khát nhân tài: Thị trường sản xuất sản phẩm toàn cầu đang săn đón các Motion Designer có tư duy sản phẩm.",
        cities: ["TP Hồ Chí Minh", "Hà Nội", "Đà Nẵng"]
      }
    ];
    strengths = [
      {
        name: "Tư duy Giải quyết Vấn đề Trực quan",
        evidence: `Trích xuất từ lựa chọn mảng Thiết kế & Sáng tạo.`,
        analysis: "Có nhạy cảm tốt với trải nghiệm người dùng."
      }
    ];
    thinking = [
      {
        name: "Tư duy Trực quan & Nguyên mẫu",
        evidence: "Xu hướng thích cụ thể hóa ý tưởng bằng hình ảnh và phác thảo.",
        analysis: "Thích hợp làm việc với sản phẩm số."
      }
    ];
    gaps = [
      {
        name: "Thiếu hụt kỹ năng Phân tích Số liệu (Data Analytics)",
        evidence: "Chưa thể hiện sự lựa chọn mảng số liệu trong bài khảo sát.",
        analysis: "Khó bảo vệ quan điểm thiết kế nếu không có dữ liệu chứng minh."
      }
    ];
    riskAnalysis = [
      {
        risk: "Nguy cơ kiệt sức do sửa đổi giao diện nhiều lần theo yêu cầu khách hàng.",
        mitigation: "Nghiên cứu dữ liệu người dùng thật để bảo vệ quan điểm thiết kế."
      }
    ];
  } else if (text.includes("tài chính") || text.includes("kiểm toán") || text.includes("kế toán") || text.includes("thuế") || text.includes("ngân sách") || text.includes("doanh thu")) {
    targetDomain = "Tài chính & Kiểm toán Doanh nghiệp (Finance & Audit)";
    domainShortageReason = "Mọi doanh nghiệp và tập đoàn kinh tế đều yêu cầu tính chính xác tối cao trong quản trị dòng tiền, khiến mảng kiểm toán và phân tích rủi ro tài chính luôn duy trì nhu cầu tuyển dụng ở mức đỉnh.";
    careerOptions = [
      {
        title: "Kiểm toán viên Tài chính & Doanh nghiệp",
        category: "Tài chính & Kiểm toán Doanh nghiệp",
        salaryRange: "15 - 35 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Đảm bảo tính bạch minh tài chính và tuân thủ pháp luật thuế cho doanh nghiệp.",
        skillsRequired: ["IFRS & VAS", "Rà soát báo cáo tài chính", "Excel nâng cao & SQL", "Đánh giá kiểm soát nội bộ"],
        matchReason: "Thích hợp cho những ai tỉ mỉ, tuân thủ quy trình bài bản và cẩn trọng với các con số.",
        shortageNote: "🔥 Cơn khát mùa cao điểm: Các hãng kiểm toán Big4 và doanh nghiệp luôn thiếu kiểm toán viên vững chuyên môn.",
        cities: ["Hà Nội", "TP Hồ Chí Minh"]
      },
      {
        title: "Chuyên viên Phân tích Đầu tư & Rủi ro Tài chính",
        category: "Tài chính & Kiểm toán Doanh nghiệp",
        salaryRange: "18 - 40 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Thị trường chứng khoán, quỹ đầu tư và doanh nghiệp đòi hỏi chuyên viên thẩm định dự án.",
        skillsRequired: ["Mô hình hóa tài chính (Financial Modeling)", "Định giá doanh nghiệp", "Phân tích báo cáo dòng tiền", "Thẩm định dự án"],
        matchReason: "Đánh giá sức khỏe tài chính và dự báo tiềm năng tăng trưởng của doanh nghiệp.",
        shortageNote: "🔥 Đang săn đón nhân tài: Các quỹ đầu tư và công ty chứng khoán sẵn sàng chi trả mức lương cao cho chuyên viên định giá tốt.",
        cities: ["TP Hồ Chí Minh", "Hà Nội"]
      },
      {
        title: "Chuyên viên Quản trị Tài chính & Ngân sách (Financial Controller)",
        category: "Tài chính & Kiểm toán Doanh nghiệp",
        salaryRange: "20 - 45 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Kiểm soát chi phí vận hành và lập kế hoạch ngân sách hàng năm cho tập đoàn.",
        skillsRequired: ["Quản trị ngân sách (FP&A)", "Tối ưu dòng tiền", "Phân tích chi phí & điểm hòa vốn", "Báo cáo quản trị"],
        matchReason: "Giúp ban giám đốc kiểm soát chi phí và tối ưu hóa lợi nhuận thực tế.",
        shortageNote: "🔥 Vị trí cốt lõi: Các doanh nghiệp quy mô vừa và lớn luôn cần người kiểm soát chi phí chặt chẽ.",
        cities: ["TP Hồ Chí Minh", "Hà Nội"]
      }
    ];
    strengths = [
      {
        name: "Tư duy Cẩn trọng & Kiểm soát Số liệu Chính xác",
        evidence: "Bóc tách từ ưu tiên xử lý chứng từ sổ sách và quy trình tài chính.",
        analysis: "Đảm bảo tính chính xác và chính trực cao trong quản lý ngân sách."
      }
    ];
    thinking = [
      {
        name: "Tư duy Phân tích Cấu trúc Tài chính",
        evidence: "Ưu tiên làm việc theo chuẩn mực và quy định minh bạch.",
        analysis: "Thích hợp vận hành các hệ thống kế toán kiểm toán."
      }
    ];
    gaps = [
      {
        name: "Khả năng Quản trị Áp lực Mùa Cao điểm",
        evidence: "Cần lưu ý khối lượng công việc lớn trong giai đoạn lập báo cáo tài chính.",
        analysis: "Cần rèn luyện sức bền và kỹ năng sắp xếp thời gian."
      }
    ];
    riskAnalysis = [
      {
        risk: "Áp lực trách nhiệm pháp lý cao khi ký duyệt các chứng từ báo cáo tài chính.",
        mitigation: "Luôn tuân thủ nghiêm ngặt các chuẩn mực kế toán kiểm toán và quy định pháp luật hiện hành."
      }
    ];
  } else {
    targetDomain = "Kinh doanh & Tiếp thị Tăng trưởng Số (Digital Business & Growth)";
    domainShortageReason = "Thương mại điện tử và tiếp thị số đòi hỏi số liệu thực tế đang bùng nổ, nhưng thị trường lại thiếu các chuyên viên thực chiến biết phân tích dữ liệu kinh doanh.";
    careerOptions = [
      {
        title: "Growth Marketing & Data Strategist",
        category: "Kinh doanh & Tiếp thị Tăng trưởng Số",
        salaryRange: "16 - 35 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Tối ưu hóa phễu tăng trưởng và chi phí chuyển đổi cho doanh nghiệp số.",
        skillsRequired: ["Performance Ad Tối ưu", "A/B Testing & Analytics", "Customer Journey", "Funnel Optimization"],
        matchReason: "Thúc đẩy tăng trưởng doanh số bằng dữ liệu và chiến dịch marketing sáng tạo.",
        shortageNote: "🔥 Thiếu hụt nhân lực thực chiến: Đa số nhân sự marketing thiếu tư duy phân tích số liệu kinh doanh sâu.",
        cities: ["TP Hồ Chí Minh", "Hà Nội", "Hải Phòng"]
      },
      {
        title: "E-Commerce Operations & Growth Manager",
        category: "Kinh doanh & Tiếp thị Tăng trưởng Số",
        salaryRange: "18 - 38 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Vận hành kênh bán hàng trực tuyến đa nền tảng (TikTok Shop, Shopee, D2C Website).",
        skillsRequired: ["Store Analytics", "Supply Chain Basics", "Platform Algorithm", "CRM & Retention"],
        matchReason: "Quản trị vận hành gian hàng trực tuyến và tối ưu chuỗi giá trị bán lẻ.",
        shortageNote: "🔥 Cơn khát nhân sự sàn: Bán lẻ trực tuyến bùng nổ kéo theo nhu cầu khổng lồ về quản trị vận hành sàn.",
        cities: ["TP Hồ Chí Minh", "Hà Nội"]
      },
      {
        title: "B2B Tech Solution Sales & Partnership",
        category: "Kinh doanh & Tiếp thị Tăng trưởng Số",
        salaryRange: "18 - 45 triệu VNĐ",
        jobDemand: "Cao",
        futureOutlook: "Tư vấn và cung cấp giải pháp phần mềm doanh nghiệp (SaaS/B2B).",
        skillsRequired: ["B2B Consultative Sales", "Solution Selling", "Negotiation", "Key Account Management"],
        matchReason: "Làm việc trực tiếp với ban lãnh đạo doanh nghiệp để tư vấn giải pháp chuyển đổi số.",
        shortageNote: "🔥 Đang săn tìm nhân tài: Rất ít nhân sự vừa hiểu biết kỹ thuật vừa có kỹ năng đàm phán thương mại B2B cao cấp.",
        cities: ["TP Hồ Chí Minh", "Hà Nội"]
      }
    ];
    strengths = [
      {
        name: "Nhạy bén Xu hướng Thị trường & Giao tiếp",
        evidence: `Trích xuất từ lựa chọn mảng Kinh doanh/Marketing.`,
        analysis: "Nắm bắt nhanh thị hiếu công chúng."
      }
    ];
    thinking = [
      {
        name: "Tư duy Thích ứng Nhanh (Agile & Practical)",
        evidence: "Thích thử nghiệm thực tế và đo lường kết quả tức thì.",
        analysis: "Tốt cho các chiến dịch ngắn hạn."
      }
    ];
    gaps = [
      {
        name: "Quản trị Rủi ro Ngân sách & Đọc Báo cáo Tài chính",
        evidence: "Chưa chọn mảng kiểm soát số liệu tài chính.",
        analysis: "Cần kiểm soát chi phí chặt chẽ."
      }
    ];
    riskAnalysis = [
      {
        risk: "Rủi ro đốt ngân sách quảng cáo mà không mang lại tỷ lệ chuyển đổi thực tế.",
        mitigation: "Luôn chạy thử nghiệm A/B với ngân sách nhỏ trước khi nhân rộng chiến dịch."
      }
    ];
  }

  return {
    targetDomain,
    domainShortageReason,
    careerOptions,
    primaryCareer: careerOptions[0],
    topCareers: careerOptions.slice(1),
    strengths,
    thinkingStyles: thinking,
    skillGaps: gaps,
    riskAnalysis,
    naturalLanguageExplanation: `Phân tích khách quan: Lựa chọn của bạn thuộc lĩnh vực "${targetDomain}" - nơi thị trường đang khát nhân sự chất lượng cao. Hệ thống đưa ra 3 tùy chọn chuyên môn bình đẳng đang thiếu người làm để bạn tự do lựa chọn hướng đi mong muốn.`
  };
}

function getSimulatedRoadmap(careerTitle: string, skills: string[]): any {
  return {
    steps: [
      {
        stage: "Giai đoạn 1: Nền tảng tư duy & Công cụ cốt lõi (0 - 3 tháng)",
        title: `Làm quen với ${careerTitle}`,
        duration: "1 - 3 tháng",
        skillsToLearn: [skills[0] || "Tư duy cơ bản", "Sử dụng công cụ thiết lập ban đầu", "Khám phá nguyên lý vận hành chuyên ngành"],
        recommendedProjects: ["Xây dựng 1 dự án cá nhân đơn giản áp dụng lý thuyết học được từ các khóa học mở."],
        certifications: ["Google Career Certificate hoặc khóa học uy tín trên Coursera/Interaction Design Foundation."],
        colleges: ["Đại học RMIT Việt Nam", "Đại học Bách Khoa Hà Nội", "Đại học FPT"],
        vocationalSchools: ["FPT Arena Multimedia", "Học viện Keyframe", "MindX Technology School"],
        tips: "Đừng vội vàng lao vào các kiến thức quá phức tạp. Hãy nắm thật chắc các nguyên lý cốt lõi trước và rèn luyện thói quen tự học hàng ngày."
      },
      {
        stage: "Giai đoạn 2: Thực chiến chuyên sâu & Tạo dựng Portfolio (3 - 9 tháng)",
        title: "Tạo sản phẩm mẫu & Khẳng định năng lực",
        duration: "3 - 6 tháng",
        skillsToLearn: [skills[1] || "Kỹ năng chuyên sâu", skills[2] || "Kỹ năng thực hành hệ thống", "Tối ưu quy trình làm việc độc lập"],
        recommendedProjects: ["Thiết kế lại (Redesign) trải nghiệm của một ứng dụng phổ biến tại Việt Nam hoặc tham gia xây dựng 1 sản phẩm mã nguồn mở."],
        certifications: ["Professional Certified từ các nền tảng quốc tế (Udacity, Interaction Design Foundation, AWS Cloud Practitioner)."],
        colleges: ["Đại học Công nghệ thông tin - ĐHQG TP.HCM", "Đại học Mỹ thuật Công nghiệp"],
        vocationalSchools: ["Học viện CoderSchool", "Green Academy Việt Nam"],
        tips: "Chất lượng hơn số lượng. Một Portfolio chỉ cần 2-3 dự án nhưng được trình bày cực kỳ chi tiết từ quy trình nghiên cứu, giải thích lý do thiết kế đến kết quả cuối cùng."
      },
      {
        stage: "Giai đoạn 3: Cọ xát thực tế & Sẵn sàng gia nhập Doanh nghiệp (9+ tháng)",
        title: "Thực tập thực tế & Tối ưu kỹ năng phỏng vấn",
        duration: "3 - 6 tháng",
        skillsToLearn: ["Giao tiếp thuyết trình trước khách hàng/ban giám đốc", "Kỹ năng làm việc nhóm Agile/Scrum", "Tối ưu CV và hồ sơ LinkedIn"],
        recommendedProjects: ["Tham gia ít nhất một cuộc thi chuyên môn (Hackathon, Design Arena) hoặc ứng tuyển chương trình thực tập sinh tại các Tech Startup hàng đầu."],
        certifications: ["Scrum Master Certificate hoặc các chứng chỉ chuyên gia cao cấp từ các tập đoàn công nghệ lớn."],
        colleges: ["Đại học Kinh tế Quốc dân", "Đại học Quốc tế - ĐHQG TP.HCM"],
        vocationalSchools: ["Học viện đào tạo doanh nghiệp ngắn hạn"],
        tips: "Khi phỏng vấn, nhà tuyển dụng đánh giá cao tư duy giải quyết vấn đề và thái độ ham học hỏi của bạn. Hãy tự tin kể câu chuyện đằng sau hành trình học tập đầy đam mê của mình!"
      }
    ]
  };
}

// ----------------------------------------------------
// Vite Dev Server Middleware & Static Serving Setup
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      configLoader: "runner",
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[RealPath Server] Running on http://localhost:${PORT}`);
  });
}

// Chỉ chạy server.listen ở máy local, tránh chạy trên môi trường Serverless của Vercel
if (!process.env.VERCEL) {
  startServer();
}

export default app;
