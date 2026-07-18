import { QuizQuestion, Career } from "./types";

export const CITIES = [
  { id: "all", name: "Tất cả thành phố" },
  { id: "hanoi", name: "Hà Nội" },
  { id: "hcm", name: "TP Hồ Chí Minh" },
  { id: "haiphong", name: "Hải Phòng" }
];

export const CATEGORIES = [
  { id: "all", name: "Tất cả lĩnh vực" },
  { id: "tech", name: "Công nghệ thông tin" },
  { id: "design", name: "Thiết kế & Sáng tạo" },
  { id: "business", name: "Kinh doanh & Tiếp thị" },
  { id: "science", name: "Khoa học & Nghiên cứu" }
];

export const PRESET_CAREERS: Career[] = [
  {
    title: "UI/UX Product Designer",
    category: "Thiết kế & Sáng tạo",
    salaryRange: "15 - 35 triệu VNĐ",
    jobDemand: "Cao",
    futureOutlook: "Tăng trưởng vượt bậc nhờ sự chuyển dịch số hóa trải nghiệm người dùng toàn cầu.",
    skillsRequired: ["Figma & Framer", "User Research", "Wireframing", "UI Design Systems", "Interaction Design"],
    matchReason: "Thế giới hiện đại luôn cần những người thấu hiểu cảm xúc con người và chuyển hóa nó thành giao diện trực quan tuyệt đẹp.",
    cities: ["Hà Nội", "TP Hồ Chí Minh"],
    image: "bg-gradient-to-tr from-pink-400 to-indigo-500"
  },
  {
    title: "AI Engineer / Machine Learning Scientist",
    category: "Công nghệ thông tin",
    salaryRange: "25 - 60 triệu VNĐ",
    jobDemand: "Cao",
    futureOutlook: "Trọng tâm cốt lõi của kỷ nguyên thông minh, có tiềm năng thay đổi toàn bộ các ngành công nghiệp.",
    skillsRequired: ["Python", "Machine Learning & NLP", "Deep Learning", "TensorFlow / PyTorch", "Data Analysis"],
    matchReason: "Thích hợp cho những bộ óc logic sắc bén, say mê giải quyết các thuật toán phức tạp và xây dựng trí tuệ nhân tạo.",
    cities: ["Hà Nội", "TP Hồ Chí Minh", "Hải Phòng"],
    image: "bg-gradient-to-tr from-blue-500 to-emerald-400"
  },
  {
    title: "Growth Marketing Strategist",
    category: "Kinh doanh & Tiếp thị",
    salaryRange: "14 - 30 triệu VNĐ",
    jobDemand: "Cao",
    futureOutlook: "Các thương hiệu không chỉ cần truyền thông thuần túy, họ cần tiếp thị dựa trên tăng trưởng số liệu thực chiến.",
    skillsRequired: ["Digital Ads", "A/B Testing", "SEO & Content Strategy", "Google Analytics", "Data Modeling"],
    matchReason: "Kết hợp hài hòa giữa sự nhạy bén thị trường, sáng tạo nội dung và tư duy số liệu chặt chẽ.",
    cities: ["TP Hồ Chí Minh", "Hà Nội", "Hải Phòng"],
    image: "bg-gradient-to-tr from-amber-400 to-rose-500"
  },
  {
    title: "Data Analyst & Business Intelligence",
    category: "Khoa học & Nghiên cứu",
    salaryRange: "16 - 32 triệu VNĐ",
    jobDemand: "Cao",
    futureOutlook: "Dữ liệu được coi là nguồn 'vàng đen' mới của mọi doanh nghiệp. Người làm chủ số liệu nắm giữ chìa khóa chiến lược.",
    skillsRequired: ["SQL", "Python / R", "Power BI / Tableau", "Statistics", "Data Storytelling"],
    matchReason: "Phù hợp với những bạn có xu hướng khám phá sự thật ẩn giấu đằng sau những con số và chuyển hóa chúng thành giải pháp.",
    cities: ["Hà Nội", "TP Hồ Chí Minh"],
    image: "bg-gradient-to-tr from-purple-500 to-violet-400"
  },
  {
    title: "Product Manager (Tech Startup)",
    category: "Công nghệ thông tin",
    salaryRange: "20 - 45 triệu VNĐ",
    jobDemand: "Cao",
    futureOutlook: "Cực kỳ hứa hẹn tại các trung tâm khởi nghiệp, đóng vai trò nhạc trưởng điều phối toàn bộ vòng đời sản phẩm.",
    skillsRequired: ["Product Strategy", "Agile & Scrum", "User UX Core", "Market Analysis", "Leadership"],
    matchReason: "Cầu nối hoàn hảo giữa tầm nhìn kinh doanh, năng lực công nghệ và trải nghiệm người dùng.",
    cities: ["Hà Nội", "TP Hồ Chí Minh"],
    image: "bg-gradient-to-tr from-cyan-400 to-indigo-600"
  },
  {
    title: "Creative Art Director",
    category: "Thiết kế & Sáng tạo",
    salaryRange: "18 - 42 triệu VNĐ",
    jobDemand: "Trung bình",
    futureOutlook: "Thế hệ Gen Z yêu cầu những chiến dịch có tính thẩm mỹ và thông điệp sâu sắc hơn bao giờ hết.",
    skillsRequired: ["Visual Communication", "Brand Identity", "Adobe Creative Suite", "Art Direction", "Storytelling"],
    matchReason: "Dành cho những tâm hồn nghệ sĩ muốn định hình phong cách hình ảnh và mang tính thẩm mỹ cao cấp vào đời sống.",
    cities: ["Hà Nội", "TP Hồ Chí Minh"],
    image: "bg-gradient-to-tr from-rose-400 to-orange-400"
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "quiz1",
    type: "single",
    title: "Bạn thấy mình hào hứng nhất khi đối mặt với thử thách nào sau đây?",
    description: "Hãy chọn phương án gần gũi nhất với sở thích tự nhiên của bạn.",
    options: [
      {
        value: "creative",
        label: "Thiết kế trải nghiệm & Sáng tạo",
        icon: "🎨",
        description: "Phối hợp màu sắc, sắp xếp giao diện ứng dụng đẹp mắt, hài hòa và trực quan."
      },
      {
        value: "analytical",
        label: "Giải mã logic & Lập trình",
        icon: "💻",
        description: "Tìm lỗi thuật toán, tổ chức cơ sở dữ liệu hoặc giải quyết các câu đố mã hóa hóc búa."
      },
      {
        value: "social",
        label: "Kế hoạch kinh doanh & Tiếp thị",
        icon: "📈",
        description: "Thuyết phục mọi người tham gia một chiến dịch thú vị hoặc tạo kế hoạch phát triển thị trường."
      },
      {
        value: "research",
        label: "Nghiên cứu & Khám phá khoa học",
        icon: "🔬",
        description: "Tìm kiếm các nguyên lý khoa học, phân tích cấu trúc dữ liệu hoặc giải thích hành vi con người."
      }
    ]
  },
  {
    id: "quiz2",
    type: "image",
    title: "Chọn không gian làm việc lý tưởng mang lại nguồn cảm hứng tuyệt đối cho bạn:",
    description: "Trực giác của bạn hướng về nơi nào nhất?",
    options: [
      {
        value: "creative_studio",
        label: "Studio Sáng Tạo Ngập Tràn Ánh Sáng",
        icon: "🌸",
        imageClass: "from-pink-100 to-orange-100 border-pink-200"
      },
      {
        value: "minimal_lab",
        label: "Tech Lab Tối Giản Hai Màn Hình",
        icon: "⚡",
        imageClass: "from-slate-100 to-indigo-100 border-slate-200"
      },
      {
        value: "co_working",
        label: "Phòng Họp Kính Hiện Đại & Sôi Nổi",
        icon: "🗣️",
        imageClass: "from-teal-50 to-emerald-100 border-teal-200"
      },
      {
        value: "silent_library",
        label: "Thư Viện Tĩnh Lặng & Sách Khoa Học",
        icon: "📚",
        imageClass: "from-amber-50 to-amber-100 border-amber-200"
      }
    ]
  },
  {
    id: "quiz3",
    type: "multi",
    title: "Chọn những chủ đề thường xuyên thu hút sự chú ý của bạn nhất trên mạng xã hội:",
    description: "Bạn có thể chọn nhiều câu trả lời (Hãy chọn ít nhất 1).",
    options: [
      {
        value: "design",
        label: "Thẩm mỹ thiết kế, typography, phối màu",
        icon: "✨"
      },
      {
        value: "tech",
        label: "AI thế hệ mới, xu hướng công nghệ, code ứng dụng",
        icon: "🤖"
      },
      {
        value: "business",
        label: "Ý tưởng khởi nghiệp, chiến dịch marketing sáng tạo",
        icon: "💡"
      },
      {
        value: "science",
        label: "Bí ẩn tâm lý, hành vi con người, phát triển bản thân",
        icon: "🧠"
      }
    ]
  },
  {
    id: "quiz4",
    type: "situation",
    title: "Mini-game tình huống: Sự cố Giao diện Thanh toán",
    description: "Một khách hàng gửi tin nhắn: 'Tôi vừa cập nhật app và giao diện trông quá rối rắm, tôi loay hoay mãi không tìm thấy nút Thanh toán đâu cả!'. Bạn sẽ làm gì?",
    options: [
      {
        value: "empathy_design",
        label: "Trực tiếp thu thập phản hồi, xin lỗi khách hàng và cùng team tối ưu hóa lại vị trí nút Thanh toán trực quan hơn.",
        icon: "🎯",
        description: "Tập trung tối đa vào trải nghiệm người dùng (Thiên hướng UI/UX & Product Design)."
      },
      {
        value: "tech_automation",
        label: "Viết một chatbot phản hồi nhanh tự động gửi hướng dẫn từng bước quay lại phiên bản cũ và log lỗi lên hệ thống Jira.",
        icon: "⚙️",
        description: "Tập trung tối đa vào tự động hóa và kỹ thuật hệ thống (Thiên hướng Software/AI Engineering)."
      },
      {
        value: "business_coupon",
        label: "Phản hồi cảm ơn góp ý, đề xuất tặng ngay mã giảm giá 20% cho đơn hàng tiếp theo để bù đắp trải nghiệm không tốt.",
        icon: "🎟️",
        description: "Tập trung tối đa vào quan hệ khách hàng và hiệu quả kinh doanh (Thiên hướng Business/Marketing)."
      },
      {
        value: "process_manual",
        label: "Thiết kế ngay một tài liệu infographic PDF hướng dẫn sử dụng 10 trang kèm hình vẽ chi tiết để gửi cho khách hàng.",
        icon: "📋",
        description: "Tập trung vào tính quy chuẩn, quy trình rõ ràng và chi tiết (Thiên hướng Process & Operations)."
      }
    ]
  }
];
