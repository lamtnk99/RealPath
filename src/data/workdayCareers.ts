import { WorkdayCareer } from "../types";

export const WORKDAY_CAREERS: WorkdayCareer[] = [
  {
    id: "ai-engineer",
    title: "Kỹ sư AI",
    iconName: "Cpu",
    bgColorClass: "bg-indigo-50/80 hover:bg-indigo-100/80 border-indigo-100/60 text-indigo-900",
    intro: "Bạn tham gia một nhóm đang xây dựng tính năng AI cho sản phẩm. Trong ngày hôm nay, bạn cần xử lý dữ liệu, hiệu suất hệ thống và một yêu cầu có ảnh hưởng đến người dùng.",
    scenarios: [
      {
        id: "ai-1",
        time: "09:00",
        title: "Mô hình giảm độ chính xác",
        description: "Một mô hình đang hoạt động ổn định bỗng cho kết quả kém hơn sau khi nhóm cập nhật dữ liệu.",
        choices: [
          {
            id: "A",
            label: "Kiểm tra mẫu dữ liệu mới và toàn bộ quy trình tiền xử lý.",
            outcome: "Bạn phát hiện một số trường thông tin bị thiếu định dạng khiến mô hình suy luận sai.",
            consideration: "Mất nhiều thời gian rà soát dữ liệu thủ công nhưng giúp tìm đúng nguyên nhân gốc rễ.",
            signals: ["phân tích", "chi tiết", "giải quyết vấn đề"]
          },
          {
            id: "B",
            label: "Điều chỉnh tham số và huấn luyện lại mô hình ngay.",
            outcome: "Mô hình cải thiện chỉ số ngắn hạn trên tập kiểm thử nhanh.",
            consideration: "Có thể bỏ qua lỗi dữ liệu ẩn bên dưới, khiến lỗi tái diễn khi gặp dữ liệu thực tế mới.",
            signals: ["hành động nhanh", "thử nghiệm", "kỹ thuật"]
          },
          {
            id: "C",
            label: "Trao đổi với nhóm dữ liệu và sản phẩm để xác định thay đổi gần đây.",
            outcome: "Cả nhóm làm rõ được sự thay đổi trong cách thu thập dữ liệu từ phía người dùng.",
            consideration: "Cần thời gian họp hội ý nhưng giúp các phòng ban đồng bộ hiểu biết về hệ thống.",
            signals: ["hợp tác", "giao tiếp", "tư duy hệ thống"]
          }
        ]
      },
      {
        id: "ai-2",
        time: "13:30",
        title: "API phản hồi quá chậm",
        description: "Bản demo sắp diễn ra nhưng API AI đang phản hồi chậm hơn yêu cầu.",
        choices: [
          {
            id: "A",
            label: "Đo thời gian từng bước để tìm chính xác điểm nghẽn.",
            outcome: "Bạn xác định được câu lệnh truy vấn cơ sở dữ liệu chiếm 70% thời gian phản hồi.",
            consideration: "Đòi hỏi kỹ năng đọc log và phân tích kỹ thuật tỉ mỉ trước áp lực thời gian.",
            signals: ["phân tích", "kỹ thuật", "chi tiết"]
          },
          {
            id: "B",
            label: "Thử một mô hình nhẹ hơn để giảm thời gian phản hồi.",
            outcome: "Tốc độ phản hồi tăng gấp đôi, đủ điều kiện cho buổi demo diễn ra trơn tru.",
            consideration: "Độ chính xác của câu trả lời AI giảm nhẹ trong một số tình huống phức tạp.",
            signals: ["thực nghiệm", "thích nghi", "ra quyết định"]
          },
          {
            id: "C",
            label: "Trao đổi với nhóm về mức đánh đổi giữa tốc độ và độ chính xác.",
            outcome: "Nhóm thống nhất phương án giới hạn độ dài phản hồi để tối ưu trải nghiệm người dùng.",
            consideration: "Đòi hỏi kỹ năng giải thích khái niệm kỹ thuật đơn giản cho người làm sản phẩm.",
            signals: ["giao tiếp", "tư duy sản phẩm", "quản lý kỳ vọng"]
          }
        ]
      },
      {
        id: "ai-3",
        time: "16:00",
        title: "Yêu cầu tự động loại hồ sơ",
        description: "Một bộ phận muốn AI tự động loại hồ sơ ứng viên mà không cần con người xem lại.",
        choices: [
          {
            id: "A",
            label: "Thực hiện ngay theo yêu cầu để kịp thời hạn.",
            outcome: "Hệ thống tự động hóa được hoàn thành nhanh chóng đúng tiến độ bàn giao.",
            consideration: "Mô hình có nguy cơ cao bị thiên lệch (bias) và loại bỏ vô tình các ứng viên tiềm năng mà không có giám sát.",
            signals: ["tốc độ", "thực thi"]
          },
          {
            id: "B",
            label: "Nêu rủi ro công bằng và đề nghị luôn có bước con người xem lại.",
            outcome: "Bộ phận vận hành đồng ý giữ bước duyệt cuối của chuyên viên tuyển dụng.",
            consideration: "Thời gian xử lý hồ sơ không giảm tối đa nhưng đảm bảo tính đạo đức và công bằng.",
            signals: ["đạo đức", "giao tiếp", "trách nhiệm"]
          },
          {
            id: "C",
            label: "Đề xuất AI chỉ hỗ trợ sắp xếp, kèm giải thích và cơ chế kiểm tra.",
            outcome: "Hệ thống hiển thị điểm gợi ý kèm lý do cho chuyên viên nhân sự tham khảo.",
            consideration: "Cần thiết kế thêm giao diện giải thích (Explainable AI) làm tăng độ phức tạp hệ thống.",
            signals: ["giải quyết vấn đề", "đạo đức", "thiết kế hệ thống"]
          }
        ]
      }
    ]
  },
  {
    id: "graphic-designer",
    title: "Thiết kế Đồ họa",
    iconName: "Palette",
    bgColorClass: "bg-rose-50/80 hover:bg-rose-100/80 border-rose-100/60 text-rose-900",
    intro: "Bạn phụ trách thiết kế hình ảnh cho một chiến dịch mới. Trong ngày, bạn phải làm rõ yêu cầu, xử lý phản hồi và chuẩn bị sản phẩm cuối.",
    scenarios: [
      {
        id: "design-1",
        time: "09:00",
        title: "Brief chưa rõ ràng",
        description: "Khách hàng yêu cầu thiết kế phải 'hiện đại và nổi bật' nhưng không cung cấp thêm thông tin.",
        choices: [
          {
            id: "A",
            label: "Đặt câu hỏi về đối tượng, mục tiêu và nơi sử dụng thiết kế.",
            outcome: "Bạn thu thập được định vị thương hiệu và nhóm khách hàng mục tiêu cần hướng tới.",
            consideration: "Tốn thời gian làm rõ thông tin ban đầu nhưng tránh phải làm lại nhiều lần.",
            signals: ["giao tiếp", "tư duy người dùng", "làm rõ vấn đề"]
          },
          {
            id: "B",
            label: "Tạo nhanh một moodboard với ba hướng hình ảnh.",
            outcome: "Khách hàng dễ dàng hình dung và chọn được phong cách hình ảnh họ mong muốn.",
            consideration: "Cần khả năng tổng hợp thị giác nhanh và chuẩn bị nhiều phương án mẫu.",
            signals: ["sáng tạo", "khám phá", "trực quan hóa"]
          },
          {
            id: "C",
            label: "Bắt đầu ngay một bản thiết kế hoàn chỉnh dựa trên cảm nhận cá nhân.",
            outcome: "Bạn hoàn thành bản phác thảo đầu tiên trong thời gian rất ngắn.",
            consideration: "Nguy cơ cao thiết kế bị lệch hoàn toàn so với kỳ vọng của khách hàng.",
            signals: ["chủ động", "trực giác"]
          }
        ]
      },
      {
        id: "design-2",
        time: "12:30",
        title: "Phản hồi mâu thuẫn",
        description: "Người phụ trách thương hiệu muốn thiết kế tối giản, trong khi nhóm bán hàng muốn thêm nhiều thông tin.",
        choices: [
          {
            id: "A",
            label: "So sánh hai yêu cầu với mục tiêu chính của chiến dịch.",
            outcome: "Bạn phân bổ bố cục hợp lý, giữ nét tối giản ở khu vực chính và thêm thông tin ở phần phụ.",
            consideration: "Đòi hỏi tư duy cân bằng giữa thẩm mỹ thương hiệu và hiệu quả thương mại.",
            signals: ["phân tích", "tư duy mục tiêu", "cân bằng yêu cầu"]
          },
          {
            id: "B",
            label: "Làm theo ý kiến của người có vị trí cao hơn.",
            outcome: "Thiết kế được duyệt nhanh chóng mà không tốn thời gian tranh luận.",
            consideration: "Mâu thuẫn cốt lõi giữa hai phòng ban vẫn chưa được giải quyết triệt để trên sản phẩm.",
            signals: ["tốc độ", "tuân thủ"]
          },
          {
            id: "C",
            label: "Tạo hai phiên bản nhanh để mọi người so sánh.",
            outcome: "Cả hai nhóm trực quan so sánh và cùng chọn phương án dung hòa nhất.",
            consideration: "Bạn phải tốn công sức thiết kế song song hai bản thể hiện khác nhau.",
            signals: ["thử nghiệm", "hợp tác", "sáng tạo"]
          }
        ]
      },
      {
        id: "design-3",
        time: "16:30",
        title: "Màu sắc khi xuất file bị sai",
        description: "Thiết kế đẹp trên màn hình nhưng màu in thử khác đáng kể.",
        choices: [
          {
            id: "A",
            label: "Kiểm tra hệ màu, profile màu và thông số xuất file.",
            outcome: "Bạn phát hiện file chưa chuyển sang hệ màu CMYK và Profile in tương thích.",
            consideration: "Yêu cầu kiến thức kỹ thuật in ấn và rà soát tỉ mỉ từng thông số.",
            signals: ["kỹ thuật", "chi tiết", "giải quyết vấn đề"]
          },
          {
            id: "B",
            label: "Điều chỉnh màu bằng mắt cho gần với bản in.",
            outcome: "Bản in sau đó có màu sắc cải thiện hơn tương đối.",
            consideration: "Phụ thuộc vào cảm nhận cảm quan cá nhân và có thể không đồng nhất giữa các máy in.",
            signals: ["trực giác thị giác", "thích nghi"]
          },
          {
            id: "C",
            label: "Trao đổi với đơn vị in để kiểm tra quy trình và thông số thiết bị.",
            outcome: "Xưởng in hỗ trợ căn chỉnh máy in theo đúng file gốc của bạn.",
            consideration: "Tốn thời gian liên lạc phối hợp ngoài nhưng đảm bảo chuẩn mực quy trình xuất bản.",
            signals: ["hợp tác", "giao tiếp", "kỹ thuật sản xuất"]
          }
        ]
      }
    ]
  },
  {
    id: "auditor",
    title: "Kiểm toán viên",
    iconName: "FileText",
    bgColorClass: "bg-amber-50/80 hover:bg-amber-100/80 border-amber-100/60 text-amber-900",
    intro: "Bạn đang kiểm tra hồ sơ tài chính của một doanh nghiệp trước thời hạn báo cáo. Công việc yêu cầu sự chính xác, ưu tiên rủi ro và tính độc lập.",
    scenarios: [
      {
        id: "audit-1",
        time: "08:30",
        title: "Hóa đơn không khớp",
        description: "Một hóa đơn có số tiền không khớp với biên bản giao nhận.",
        choices: [
          {
            id: "A",
            label: "Lần theo chứng từ liên quan để tìm nguồn sai lệch.",
            outcome: "Bạn phát hiện sai lệch do tính thiếu khoản chiết khấu thương mại.",
            consideration: "Cần sự kiên trì đọc lại toàn bộ tập hồ sơ chứng từ liên quan.",
            signals: ["chi tiết", "phân tích", "kiên trì"]
          },
          {
            id: "B",
            label: "Hỏi khách hàng về bối cảnh của giao dịch trước.",
            outcome: "Kế toán doanh nghiệp giải thích bối cảnh và cung cấp thêm phụ lục hợp đồng bổ sung.",
            consideration: "Giúp thu thập thông tin nhanh nhưng vẫn cần xác minh lại bằng chứng từ gốc.",
            signals: ["giao tiếp", "thu thập thông tin", "hợp tác"]
          },
          {
            id: "C",
            label: "Ghi chú lại và tiếp tục vì giá trị không lớn.",
            outcome: "Bạn tiết kiệm được thời gian để kiểm tra các mục tài chính lớn hơn.",
            consideration: "Sai lệch nhỏ có thể là dấu hiệu ẩn của một lỗ hổng quy trình cần xem xét kỹ hơn.",
            signals: ["ưu tiên", "tốc độ"]
          }
        ]
      },
      {
        id: "audit-2",
        time: "13:00",
        title: "Không đủ thời gian",
        description: "Nhóm còn nhiều hạng mục nhưng thời hạn báo cáo đang đến gần.",
        choices: [
          {
            id: "A",
            label: "Ưu tiên các khoản mục có rủi ro và ảnh hưởng lớn.",
            outcome: "Nhóm hoàn thành kiểm tra 100% các tài khoản trọng yếu đúng thời hạn.",
            consideration: "Đòi hỏi tư duy đánh giá rủi ro sắc bén để quyết định bỏ qua các mục rủi ro thấp.",
            signals: ["quản lý rủi ro", "lập kế hoạch", "phân tích"]
          },
          {
            id: "B",
            label: "Chia đều thời gian cho tất cả hạng mục.",
            outcome: "Mọi khoản mục đều được lướt qua một lượt đồng đều.",
            consideration: "Có nguy cơ bỏ sót các rủi ro lớn do không có đủ thời gian soi kỹ mục trọng yếu.",
            signals: ["tính hệ thống", "nhất quán"]
          },
          {
            id: "C",
            label: "Trao đổi với nhóm để phân công lại phần việc.",
            outcome: "Công việc được điều phối lại theo điểm mạnh của từng kiểm toán viên.",
            consideration: "Tốn chút thời gian họp phân công lại công việc ở giữa chặng đường.",
            signals: ["hợp tác", "lập kế hoạch", "giao tiếp"]
          }
        ]
      },
      {
        id: "audit-3",
        time: "17:00",
        title: "Đề nghị bỏ qua sai lệch",
        description: "Một người quản lý đề nghị không đưa một sai lệch nhỏ vào hồ sơ để kịp hoàn thành.",
        choices: [
          {
            id: "A",
            label: "Ghi nhận đầy đủ và báo cáo theo quy trình.",
            outcome: "Hồ sơ kiểm toán phản ánh chính xác tình trạng tài chính đúng tính độc lập.",
            consideration: "Có thể tạo ra căng thẳng ngắn hạn với cấp quản lý doanh nghiệp.",
            signals: ["đạo đức", "trách nhiệm", "chi tiết"]
          },
          {
            id: "B",
            label: "Trao đổi về mức độ trọng yếu và yêu cầu thêm bằng chứng.",
            outcome: "Quản lý đồng ý bổ sung tài liệu chứng minh sai lệch không ảnh hưởng bản chất.",
            consideration: "Cần kỹ năng thương lượng chuyên môn dựa trên các tiêu chuẩn kiểm toán.",
            signals: ["phân tích", "giao tiếp", "chuyên môn"]
          },
          {
            id: "C",
            label: "Đồng ý bỏ qua vì sai lệch không lớn.",
            outcome: "Báo cáo được hoàn tất nhanh chóng và không phát sinh tranh luận.",
            consideration: "Tạo ra rủi ro về tính độc lập nghề nghiệp và chất lượng của hồ sơ kiểm toán.",
            signals: ["tốc độ", "linh hoạt"]
          }
        ]
      }
    ]
  },
  {
    id: "growth-marketer",
    title: "Growth Marketer",
    iconName: "TrendingUp",
    bgColorClass: "bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-100/60 text-emerald-900",
    intro: "Bạn phụ trách tăng trưởng người dùng cho một sản phẩm số. Trong ngày, bạn cần phân tích phễu, lựa chọn thử nghiệm và kiểm chứng kết quả.",
    scenarios: [
      {
        id: "growth-1",
        time: "09:00",
        title: "Nhiều lượt nhấp nhưng ít đăng ký",
        description: "Quảng cáo có nhiều lượt nhấp nhưng số người hoàn thành đăng ký rất thấp.",
        choices: [
          {
            id: "A",
            label: "Kiểm tra từng bước trong hành trình từ quảng cáo đến đăng ký.",
            outcome: "Bạn tìm ra mẫu đăng ký ở trang đích bị lỗi hiển thị trên trình duyệt di động.",
            consideration: "Đòi hỏi phân tích dữ liệu hành vi tỉ mỉ từng bước trong phễu chuyển đổi.",
            signals: ["phân tích dữ liệu", "tư duy hệ thống", "chi tiết"]
          },
          {
            id: "B",
            label: "Thay hình ảnh và nội dung quảng cáo ngay.",
            outcome: "Quảng cáo mới mang lại làn gió mới cho chiến dịch trong ngày.",
            consideration: "Thay đổi nội dung không giải quyết được điểm nghẽn ở trang đăng ký.",
            signals: ["sáng tạo", "thử nghiệm", "hành động nhanh"]
          },
          {
            id: "C",
            label: "Tăng ngân sách để thu hút thêm lượt truy cập.",
            outcome: "Số lượng người nhấp tăng lên nhanh chóng.",
            consideration: "Tăng lưu lượng truy cập khi phễu bị rò rỉ sẽ gây lãng phí ngân sách quảng cáo.",
            signals: ["mở rộng", "ra quyết định"]
          }
        ]
      },
      {
        id: "growth-2",
        time: "12:00",
        title: "Ngân sách thử nghiệm hạn chế",
        description: "Bạn chỉ đủ ngân sách để thực hiện một thử nghiệm nhỏ trong tuần.",
        choices: [
          {
            id: "A",
            label: "Chọn giả thuyết có ảnh hưởng lớn nhất và đo một chỉ số chính.",
            outcome: "Thử nghiệm A/B thu được kết quả rõ ràng về tỷ lệ chuyển đổi nút đăng ký.",
            consideration: "Bỏ qua các thử nghiệm nhỏ khác để dồn nguồn lực xác minh một giả thuyết lớn.",
            signals: ["ưu tiên", "thử nghiệm", "phân tích"]
          },
          {
            id: "B",
            label: "Chia đều ngân sách cho nhiều ý tưởng.",
            outcome: "Bạn thu thập được một ít dữ liệu từ nhiều kênh thử nghiệm khác nhau.",
            consideration: "Dữ liệu mẫu từ mỗi thử nghiệm quá nhỏ, khó đưa ra kết luận có ý nghĩa thống kê.",
            signals: ["khám phá", "đa dạng hóa"]
          },
          {
            id: "C",
            label: "Dồn ngân sách vào kênh đang có kết quả tốt nhất.",
            outcome: "Đảm bảo duy trì số lượng đăng ký ổn định an toàn cho mục tiêu tuần.",
            consideration: "Bỏ lỡ cơ hội khám phá các kênh tăng trưởng mới tiềm năng hơn.",
            signals: ["tối ưu", "thực dụng", "ra quyết định"]
          }
        ]
      },
      {
        id: "growth-3",
        time: "16:00",
        title: "Lượng người dùng tăng bất thường",
        description: "Lượng người dùng mới tăng mạnh sau một bài đăng nhưng chưa rõ đây có phải tăng trưởng bền vững.",
        choices: [
          {
            id: "A",
            label: "Kiểm tra nguồn người dùng, tỷ lệ quay lại và hành vi sau đăng ký.",
            outcome: "Bạn xác định được nhóm người dùng mới có tỷ lệ giữ chân (retention) cao vượt trội.",
            consideration: "Tốn thời gian phân tích dữ liệu chuyên sâu thay vì ăn mừng thành tích ngay.",
            signals: ["phân tích", "kiểm chứng", "tư duy dài hạn"]
          },
          {
            id: "B",
            label: "Đăng ngay báo cáo rằng chiến dịch đã thành công.",
            outcome: "Tạo được không khí hứng khởi và động lực lớn cho toàn bộ đội ngũ.",
            consideration: "Nguy cơ kết luận quá sớm nếu lượt người dùng mới chỉ tăng ảo ngắn hạn rồi rời đi.",
            signals: ["truyền thông", "tốc độ"]
          },
          {
            id: "C",
            label: "Phỏng vấn một số người dùng mới để hiểu lý do họ đăng ký.",
            outcome: "Bạn phát hiện ra tính năng họ yêu thích nhất lại khác hẳn dự đoán ban đầu.",
            consideration: "Thu thập dữ liệu định tính tốn thời gian trao đổi trực tiếp với từng người dùng.",
            signals: ["nghiên cứu người dùng", "giao tiếp", "tò mò"]
          }
        ]
      }
    ]
  },
  {
    id: "hr-manager",
    title: "Quản trị Nhân sự",
    iconName: "Users",
    bgColorClass: "bg-purple-50/80 hover:bg-purple-100/80 border-purple-100/60 text-purple-900",
    intro: "Bạn hỗ trợ nhân viên và quản lý các hoạt động nhân sự trong tổ chức. Hôm nay có các vấn đề về hội nhập, xung đột và tuyển dụng.",
    scenarios: [
      {
        id: "hr-1",
        time: "08:30",
        title: "Nhân viên mới chưa biết bắt đầu từ đâu",
        description: "Một nhân viên mới tỏ ra bối rối vì chưa hiểu quy trình và người cần liên hệ.",
        choices: [
          {
            id: "A",
            label: "Tạo danh sách onboarding rõ ràng và hướng dẫn từng bước.",
            outcome: "Nhân viên mới nhanh chóng nắm được lộ trình làm việc và các kênh hỗ trợ.",
            consideration: "Bạn tốn thời gian soạn thảo danh sách chi tiết nhưng giúp quy trình chuẩn hóa lâu dài.",
            signals: ["tổ chức", "hỗ trợ", "lập kế hoạch"]
          },
          {
            id: "B",
            label: "Sắp xếp một người đồng hành trong tuần đầu.",
            outcome: "Nhân viên mới cảm thấy được chào đón và hòa nhập nhanh với văn hóa nhóm.",
            consideration: "Cần sự sẵn sàng và thời gian hỗ trợ từ phía người đồng hành trong nhóm.",
            signals: ["kết nối", "hợp tác", "đồng cảm"]
          },
          {
            id: "C",
            label: "Để nhân viên tự tìm hiểu nhằm tăng tính chủ động.",
            outcome: "Nhân viên mới rèn luyện khả năng quan sát và tự tìm kiếm giải pháp.",
            consideration: "Người mới có thể cảm thấy lạc lỏng do thiếu thông tin nền tảng ban đầu.",
            signals: ["tự chủ", "thích nghi"]
          }
        ]
      },
      {
        id: "hr-2",
        time: "11:30",
        title: "Hai thành viên mâu thuẫn",
        description: "Hai thành viên trong cùng nhóm không thống nhất cách phối hợp và bắt đầu đổ lỗi cho nhau.",
        choices: [
          {
            id: "A",
            label: "Trao đổi riêng với từng người trước khi tổ chức buổi làm việc chung.",
            outcome: "Bạn lắng nghe được góc nhìn nguyên nhân của mỗi bên mà không có cái tôi lấn lướt.",
            consideration: "Tốn gấp đôi thời gian trò chuyện riêng trước khi đưa hai bên ngồi lại với nhau.",
            signals: ["lắng nghe", "đồng cảm", "giải quyết xung đột"]
          },
          {
            id: "B",
            label: "Mời cả hai vào họp ngay để giải quyết trực tiếp.",
            outcome: "Vấn đề được đưa ra ánh sáng đối thoại ngay lập tức.",
            consideration: "Căng thẳng có thể leo leo nếu các bên chưa sẵn sàng lắng nghe và kiềm chế cảm xúc.",
            signals: ["quyết đoán", "giao tiếp", "hành động nhanh"]
          },
          {
            id: "C",
            label: "Chuyển vấn đề cho quản lý trực tiếp quyết định.",
            outcome: "Tôn trọng đúng thẩm quyền quản lý điều hành của nhóm.",
            consideration: "Bỏ lỡ cơ hội hòa giải nhân sự ở cấp độ xây dựng niềm tin ban đầu.",
            signals: ["phân quyền", "tuân thủ quy trình"]
          }
        ]
      },
      {
        id: "hr-3",
        time: "15:30",
        title: "Yêu cầu tuyển người gấp",
        description: "Một bộ phận muốn tuyển ngay nhưng mô tả công việc và tiêu chí còn chưa rõ.",
        choices: [
          {
            id: "A",
            label: "Làm rõ nhiệm vụ chính và tiêu chí bắt buộc trước khi đăng tuyển.",
            outcome: "Mô tả công việc chuẩn xác giúp thu hút đúng các ứng viên đáp ứng yêu cầu.",
            consideration: "Tốn thêm 1-2 ngày làm việc với trưởng bộ phận trước khi chính thức đăng tin.",
            signals: ["lập kế hoạch", "phân tích", "giao tiếp"]
          },
          {
            id: "B",
            label: "Đăng tin trên nhiều kênh ngay để tiết kiệm thời gian.",
            outcome: "Số lượng hồ sơ gửi về tăng nhanh chóng ngay trong ngày.",
            consideration: "Sẽ tốn nhiều thời gian lọc hồ sơ không phù hợp do tiêu chí tuyển dụng ban đầu chưa rõ.",
            signals: ["hành động nhanh", "chủ động"]
          },
          {
            id: "C",
            label: "Tìm ứng viên qua giới thiệu nội bộ trước.",
            outcome: "Tận dụng được mạng lưới uy tín của nhân viên hiện tại trong công ty.",
            consideration: "Số lượng ứng viên tiếp cận có thể hạn chế nếu mạng lưới nội bộ chưa đủ rộng.",
            signals: ["kết nối", "thực dụng", "tận dụng nguồn lực"]
          }
        ]
      }
    ]
  }
];
