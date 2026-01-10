import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { supabase, TABLES, QUESTION_TO_COLUMN } from '../lib/supabase'

// Đáp án đúng cho các câu hỏi kiến thức (30 câu: Phần III 1-20 và Phần IV 21-30)
const CORRECT_ANSWERS = {
  // PHẦN III: KIẾN THỨC (câu 1-20)
  'III_1': 'B',
  'III_2': 'A',
  'III_3': 'B',
  'III_4': 'B',
  'III_5': 'B',
  'III_6': 'B',
  'III_7': 'B',
  'III_8': 'C',
  'III_9': 'B',
  'III_10': 'B',
  'III_11': 'B',
  'III_12': 'A',
  'III_13': 'B',
  'III_14': 'A',
  'III_15': 'A',
  'III_16': 'D',
  'III_17': 'A',
  'III_18': 'C',
  'III_19': 'B',
  'III_20': 'B',
  // PHẦN IV: XỬ TRÍ PHẢN VỆ (câu 21-30)
  'IV_21': 'A',
  'IV_22': 'B',
  'IV_23': 'C',
  'IV_24': 'B',
  'IV_25': 'C',
  'IV_26': 'D',
  'IV_27': 'B',
  'IV_28': 'B',
  'IV_29': 'A',
  'IV_30': 'D'
}

// --- DỮ LIỆU CÂU HỎI (Trích xuất từ PDF) ---
const SECTIONS = [
  {
    id: 'general',
    title: 'I. THÔNG TIN CHUNG',
    questions: [
      {
        id: 'I_1',
        text: '1. Năm sinh của anh/chị là:',
        type: 'text',
        placeholder: 'VD: 1990',
        required: true
      },
      {
        id: 'I_2',
        text: '2. Giới tính của anh/chị:',
        type: 'radio',
        options: ['Nam', 'Nữ'],
        required: true
      },
      {
        id: 'I_3',
        text: '3. Trình độ chuyên môn cao nhất của anh/chị là:',
        type: 'radio',
        options: ['TC', 'CĐ', 'ĐH', 'SĐH'],
        required: true
      },
      {
        id: 'I_4',
        text: '4. Thời gian công tác của anh/chị tại Bệnh viện Quân y 103 là:',
        type: 'radio',
        options: ['< 5 năm', '5-10 năm', '11-15 năm', '> 15 năm'],
        required: true
      },
      {
        id: 'I_5',
        text: '5. Anh/chị đang thực hiện chăm sóc người bệnh:',
        type: 'radio',
        options: ['Nội khoa', 'Ngoại khoa'],
        required: true
      }
    ]
  },
  {
    id: 'status',
    title: 'II. THỰC TRẠNG',
    questions: [
      {
        id: 'II_1',
        text: '1. Anh/chị đã được đào tạo/tập huấn về phản vệ theo Thông tư 51/2017/TT-BYT chưa?',
        type: 'radio',
        options: ['Rồi', 'Chưa'],
        required: true
      },
      {
        id: 'II_2',
        text: '2. Anh/chị đã từng trực tiếp xử trí một trường hợp phản vệ nào chưa?',
        type: 'radio',
        options: ['Rồi', 'Chưa'],
        required: true
      },
      {
        id: 'II_3',
        text: '3. Nếu có, anh chị cho biết số lần anh/chị đã trực tiếp xử trí phản vệ:',
        type: 'number',
        placeholder: 'Số lần',
        conditionField: 'II_2',
        conditionValue: 'Rồi'
      },
      {
        id: 'II_4',
        text: '4. Nếu có, anh/chị cảm thấy mức độ tự tin của mình khi xử trí trường hợp đó như thế nào?',
        type: 'radio',
        options: ['Rất tự tin', 'Tự tin', 'Bình thường', 'Ít tự tin', 'Không tự tin'],
        conditionField: 'II_2',
        conditionValue: 'Rồi'
      },
      {
        id: 'II_5',
        text: '5. Anh/chị có nắm vững phác đồ xử trí phản vệ hiện hành của bệnh viện không?',
        type: 'radio',
        options: ['Rất nắm vững', 'Nắm vững', 'Biết nhưng không chắc chắn', 'Chưa biết'],
        required: true
      },
      {
        id: 'II_6',
        text: '6. Theo anh/chị, việc chuẩn bị sẵn sàng các trang thiết bị và thuốc cấp cứu phản vệ tại đơn vị mình có đầy đủ và dễ tiếp cận không?',
        type: 'radio',
        options: ['Rất đầy đủ và dễ tiếp cận', 'Đầy đủ và dễ tiếp cận', 'Tạm ổn', 'Chưa đầy đủ', 'Rất thiếu'],
        required: true
      },
      {
        id: 'II_7',
        text: '7. Anh/chị có biết rõ vị trí và cách sử dụng hộp thuốc cấp cứu phản vệ tại đơn vị mình không?',
        type: 'radio',
        options: ['Biết rõ', 'Biết', 'Không rõ', 'Chưa biết'],
        required: true
      },
      {
        id: 'II_8',
        text: '8. Anh/chị có mong muốn được đào tạo/tập huấn thêm về nhận biết và xử trí phản vệ không?',
        type: 'radio',
        options: ['Rất mong muốn', 'Mong muốn', 'Không có ý kiến', 'Không mong muốn'],
        required: true
      }
    ]
  },
  {
    id: 'knowledge',
    title: 'III. NHẬN BIẾT PHẢN VỆ',
    description: 'Hãy chọn đáp án đúng nhất cho các câu hỏi sau:',
    questions: [
      {
        id: 'III_1',
        text: '1. Theo anh/chị, phản vệ là gì?',
        type: 'radio',
        options: [
          'A. Một phản ứng dị ứng nhẹ.',
          'B. Một phản ứng dị ứng nghiêm trọng, có khả năng đe dọa tính mạng.',
          'C. Một phản ứng viêm do nhiễm trùng.',
          'D. Một tác dụng phụ của thuốc.'
        ],
        required: true
      },
      {
        id: 'III_2',
        text: '2. Dấu hiệu nào sau đây thường xuất hiện sớm nhất trong phản vệ?',
        type: 'radio',
        options: [
          'A. Khó thở, thở rít.',
          'B. Nổi mề đay, ngứa.',
          'C. Tụt huyết áp.',
          'D. Mất ý thức.'
        ],
        required: true
      },
      {
        id: 'III_3',
        text: '3. Yếu tố nào sau đây là nguyên nhân thường gặp gây phản vệ trong bệnh viện?',
        type: 'radio',
        options: [
          'A. Dị ứng thức ăn.',
          'B. Thuốc và các chế phẩm máu.',
          'C. Thay đổi thời tiết.',
          'D. Căng thẳng.'
        ],
        required: true
      },
      {
        id: 'III_4',
        text: '4. Triệu chứng nào sau đây KHÔNG phải là triệu chứng của phản vệ?',
        type: 'radio',
        options: [
          'A. Sưng môi, lưỡi.',
          'B. Đau bụng, nôn mửa.',
          'C. Sốt cao.',
          'D. Tim đập nhanh.'
        ],
        required: true
      },
      {
        id: 'III_5',
        text: '5. Theo phân độ phản vệ của Bộ Y tế, có mấy mức độ phản vệ?',
        type: 'radio',
        options: ['A. 2', 'B. 3', 'C. 4', 'D. 5'],
        required: true
      },
      {
        id: 'III_6',
        text: '6. Dấu hiệu đặc trưng của phản vệ độ II là gì?',
        type: 'radio',
        options: [
          'A. Chỉ có các triệu chứng ở da và niêm mạc.',
          'B. Xuất hiện các triệu chứng ở nhiều cơ quan, bao gồm da, hô hấp, tim mạch.',
          'C. Ngừng tim, ngừng thở.',
          'D. Khó thở nhẹ.'
        ],
        required: true
      },
      {
        id: 'III_7',
        text: '7. Anh/chị có tự tin nhận biết các dấu hiệu sớm của phản vệ không?',
        type: 'radio',
        options: ['Rất tự tin', 'Tự tin', 'Bình thường', 'Ít tự tin', 'Không tự tin'],
        required: true
      },
      {
        id: 'III_8',
        text: '8. Anh/chị có tự tin phân biệt được các mức độ phản vệ khác nhau không?',
        type: 'radio',
        options: ['Rất tự tin', 'Tự tin', 'Bình thường', 'Ít tự tin', 'Không tự tin'],
        required: true
      },
      {
        id: 'III_9',
        text: '9. Thuốc nào là thuốc đầu tay trong xử trí phản vệ?',
        type: 'radio',
        options: [
          'A. Kháng histamin.',
          'B. Corticoid.',
          'C. Adrenaline (Epinephrine).',
          'D. Thuốc giãn phế quản.'
        ],
        required: true
      },
      {
        id: 'III_10',
        text: '10. Đường dùng adrenaline nào được ưu tiên trong xử trí phản vệ ban đầu?',
        type: 'radio',
        options: [
          'A. Tiêm tĩnh mạch.',
          'B. Tiêm bắp.',
          'C. Uống.',
          'D. Tiêm dưới da.'
        ],
        required: true
      },
      {
        id: 'III_11',
        text: '11. Liều adrenaline tiêm bắp cho người lớn thường là bao nhiêu?',
        type: 'radio',
        options: ['A. 0.1 mg', 'B. 0.3-0.5 mg', 'C. 1 mg', 'D. 2 mg'],
        required: true
      },
      {
        id: 'III_12',
        text: '12. Khi nào cần tiêm liều adrenaline thứ hai nếu tình trạng bệnh nhân không cải thiện?',
        type: 'radio',
        options: [
          'A. Sau 5 phút.',
          'B. Sau 10-15 phút.',
          'C. Sau 30 phút.',
          'D. Chỉ tiêm một liều duy nhất.'
        ],
        required: true
      },
      {
        id: 'III_13',
        text: '13. Việc đặt bệnh nhân nằm ở tư thế nào là phù hợp nhất khi xử trí phản vệ có tụt huyết áp?',
        type: 'radio',
        options: [
          'A. Nằm ngửa, đầu cao.',
          'B. Nằm sấp.',
          'C. Nằm ngửa, đầu thấp, chân cao.',
          'D. Tư thế Fowler.'
        ],
        required: true
      },
      {
        id: 'III_14',
        text: '14. Theo anh/chị, khó khăn lớn nhất trong xử trí phản vệ là gì?',
        type: 'radio',
        options: [
          'A. Nhận biết muộn các dấu hiệu.',
          'B. Thiếu thuốc và trang thiết bị.',
          'C. Thiếu kinh nghiệm và sự tự tin.',
          'D. Tất cả các phương án trên.',
          'E. Không có khó khăn gì.'
        ],
        required: true
      },
      {
        id: 'III_15',
        text: '15. Sau khi xử trí phản vệ ổn định, bệnh nhân cần được theo dõi trong khoảng thời gian tối thiểu là bao lâu để phát hiện các triệu chứng pha muộn?',
        type: 'radio',
        options: ['A. 1 giờ', 'B. 2-4 giờ', 'C. 6-8 giờ', 'D. 12-24 giờ'],
        required: true
      },
      {
        id: 'III_16',
        text: '16. Dấu hiệu nào sau đây cho thấy tình trạng phản vệ đang tiến triển nặng?',
        type: 'radio',
        options: [
          'A. Chỉ nổi mề đay cục bộ.',
          'B. Huyết áp giảm so với huyết áp bình thường của bệnh nhân.',
          'C. Ho khan vài tiếng.',
          'D. Cảm giác ngứa nhẹ ở miệng.'
        ],
        required: true
      },
      {
        id: 'III_17',
        text: '17. Triệu chứng nào sau đây ở đường hô hấp là dấu hiệu của phản vệ?',
        type: 'radio',
        options: [
          'A. Thở chậm và sâu.',
          'B. Thở nhanh, nông, khò khè, khó thở.',
          'C. Ho có đờm.',
          'D. Đau ngực khi hít thở sâu.'
        ],
        required: true
      },
      {
        id: 'III_18',
        text: '18. Khi đánh giá bệnh nhân nghi ngờ phản vệ, việc hỏi tiền sử nào sau đây là quan trọng nhất?',
        type: 'radio',
        options: [
          'A. Tiền sử bệnh tim mạch.',
          'B. Tiền sử dị ứng thuốc, thức ăn hoặc các yếu tố khác.',
          'C. Tiền sử tăng huyết áp.',
          'D. Tiền sử bệnh tiểu đường.'
        ],
        required: true
      },
      {
        id: 'III_19',
        text: '19. Phản ứng phản vệ thường xảy ra trong khoảng thời gian nào sau khi tiếp xúc với dị nguyên?',
        type: 'radio',
        options: [
          'A. Sau vài giờ đến vài ngày.',
          'B. Ngay lập tức hoặc trong vòng vài phút đến 1 giờ.',
          'C. Sau 24 giờ.',
          'D. Không có thời gian cụ thể.'
        ],
        required: true
      },
      {
        id: 'III_20',
        text: '20. Trong trường hợp bệnh nhân không thể nói rõ triệu chứng, dấu hiệu nào sau đây có thể giúp điều dưỡng nhận biết tình trạng phản vệ?',
        type: 'radio',
        options: [
          'A. Da ấm và khô.',
          'B. Mạch nhanh, da tái nhợt, lạnh.',
          'C. Huyết áp tăng.',
          'D. Thở đều, không khó khăn.'
        ],
        required: true
      }
    ]
  },
  {
    id: 'treatment',
    title: 'IV. XỬ TRÍ PHẢN VỆ',
    questions: [
      {
        id: 'IV_21',
        text: '21. Một bệnh nhân sau khi tiêm penicillin xuất hiện nổi mề đay, ngứa nhiều. Anh/chị nhận định đây là phản vệ độ mấy?',
        type: 'radio',
        options: ['A. Độ I', 'B. Độ II', 'C. Độ III', 'D. Độ IV'],
        required: true
      },
      {
        id: 'IV_22',
        text: '22. Trong tình huống trên (Câu 21), bước xử trí đầu tiên anh/chị sẽ làm là gì?',
        type: 'radio',
        options: [
          'A. Tiêm ngay adrenaline.',
          'B. Ngừng thuốc nghi ngờ và báo cáo bác sĩ.',
          'C. Cho bệnh nhân uống thuốc kháng histamin.',
          'D. Theo dõi sát tình trạng bệnh nhân.'
        ],
        required: true
      },
      {
        id: 'IV_23',
        text: '23. Một bệnh nhân đang truyền dịch có biểu hiện khó thở, tím tái, huyết áp tụt. Anh/chị nghĩ đến phản vệ độ mấy?',
        type: 'radio',
        options: ['A. Độ I', 'B. Độ II', 'C. Độ III', 'D. Độ IV'],
        required: true
      },
      {
        id: 'IV_24',
        text: '24. Trong tình huống trên (Câu 23), hành động nào sau đây là quan trọng nhất cần thực hiện ngay lập tức?',
        type: 'radio',
        options: [
          'A. Báo cáo bác sĩ.',
          'B. Ngừng ngay dịch truyền.',
          'C. Tiêm adrenaline.',
          'D. Đặt bệnh nhân nằm đầu thấp, thở oxy.'
        ],
        required: true
      },
      {
        id: 'IV_25',
        text: '25. Một bệnh nhân đang truyền máu bỗng nhiên cảm thấy khó thở, đau ngực, và nổi mẩn đỏ toàn thân. Anh/chị nghi ngờ bệnh nhân bị phản vệ với thành phần nào của máu?',
        type: 'radio',
        options: [
          'A. Hồng cầu',
          'B. Bạch cầu',
          'C. Tiểu cầu',
          'D. Protein huyết tương'
        ],
        required: true
      },
      {
        id: 'IV_26',
        text: '26. Một bệnh nhân đang truyền máu bỗng nhiên cảm thấy khó thở, đau ngực, và nổi mẩn đỏ toàn thân. Hành động đầu tiên anh/chị cần thực hiện là gì?',
        type: 'radio',
        options: [
          'A. Giảm tốc độ truyền máu.',
          'B. Ngừng truyền máu ngay lập tức.',
          'C. Báo cáo bác sĩ và tiếp tục theo dõi.',
          'D. Cho bệnh nhân thở oxy.'
        ],
        required: true
      },
      {
        id: 'IV_27',
        text: '27. Một trẻ em 5 tuổi bị ong đốt ở cổ, sau đó xuất hiện khàn tiếng, khó thở, và sưng phù vùng mặt. Anh/chị đánh giá đây là phản vệ độ mấy?',
        type: 'radio',
        options: ['A. Độ I', 'B. Độ II', 'C. Độ III', 'D. Độ IV'],
        required: true
      },
      {
        id: 'IV_28',
        text: '28. Một trẻ em 5 tuổi bị ong đốt ở cổ, sau đó xuất hiện khàn tiếng, khó thở, và sưng phù vùng mặt. Anh/chị xử trí liều adrenaline tiêm bắp thường được tính dựa trên yếu tố nào?',
        type: 'radio',
        options: [
          'A. Tuổi',
          'B. Cân nặng',
          'C. Chiều cao',
          'D. Tiền sử dị ứng'
        ],
        required: true
      },
      {
        id: 'IV_29',
        text: '29. Trong ca trực của bạn có một bệnh nhân vào viện do bị ong đốt dẫn đến khó thở, phù mạch, huyết áp giảm. Xử trí ưu tiên của bạn là gì?',
        type: 'radio',
        options: [
          'A. Gọi hỗ trợ từ đồng nghiệp',
          'B. Tiêm bắp Adrenaline ½ ống ngay lập tức',
          'C. Kiểm tra huyết áp cho bệnh nhân',
          'D. Đưa bệnh nhân vào phòng nghỉ và theo dõi'
        ],
        required: true
      },
      {
        id: 'IV_30',
        text: '30. Bệnh nhân có tiền sử phản vệ với Cefotaxim. Khi nhập viện, bác sĩ chỉ định sử dụng một loại kháng sinh khác, khi đang tiêm thì bệnh nhân xuất hiện nổi mề đay và cảm giác ngứa. Điều dưỡng cần ưu tiên làm gì?',
        type: 'radio',
        options: [
          'A. Dừng ngay thuốc và thông báo bác sĩ',
          'B. Cho bệnh nhân uống thuốc kháng histamin',
          'C. Tiêm adrenaline đường tĩnh mạch ngay lập tức',
          'D. Tiêm nốt thuốc và theo dõi thêm vì triệu chứng nhẹ'
        ],
        required: true
      }
    ]
  }
]

export default function SurveyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm()
  
  const watchedData = watch()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setSubmitError(null)
    
    try {
      // Hàm kiểm tra đáp án đúng (so sánh chữ cái đầu tiên)
      const isCorrectAnswer = (questionId, answer) => {
        if (!answer || !CORRECT_ANSWERS[questionId]) return false
        // Lấy chữ cái đầu tiên của câu trả lời (A, B, C, D)
        const answerLetter = answer.trim().charAt(0).toUpperCase()
        return answerLetter === CORRECT_ANSWERS[questionId]
      }
      
      // Tính điểm số
      let correctCount = 0
      Object.keys(CORRECT_ANSWERS).forEach(questionId => {
        if (isCorrectAnswer(questionId, data[questionId])) {
          correctCount++
        }
      })
      
      // Tính điểm theo phần trăm (số nguyên 0-100)
      const diemSo = Math.round((correctCount / 30) * 100)
      
      // Chuẩn bị dữ liệu cho bảng survey_answers (từng cột riêng)
      const answersData = {
        submitted_at: new Date().toISOString(),
        diem_so: diemSo, // Điểm phần trăm (0-100)
        so_cau_dung: correctCount,
        tong_so_cau: 30
      }
      
      // Map từng câu trả lời sang cột tương ứng
      // Với câu hỏi kiến thức (III, IV): ghi "Đúng" hoặc "Sai"
      // Với câu hỏi khác (I, II): ghi nguyên giá trị
      Object.keys(data).forEach(questionId => {
        const columnName = QUESTION_TO_COLUMN[questionId]
        if (columnName) {
          // Kiểm tra nếu là câu hỏi kiến thức có đáp án
          if (CORRECT_ANSWERS[questionId]) {
            answersData[columnName] = isCorrectAnswer(questionId, data[questionId]) ? 'Đúng' : 'Sai'
          } else {
            answersData[columnName] = data[questionId]
          }
        }
      })
      
      // Lưu vào cả 2 bảng song song
      // Bảng JSON (bắt buộc)
      const responsesResult = await supabase.from(TABLES.RESPONSES).insert([{
        responses: data,
        submitted_at: new Date().toISOString()
      }])
      
      if (responsesResult.error) throw responsesResult.error
      
      // Bảng từng cột (xuất Excel)
      console.log('Dữ liệu gửi đến survey_answers:', answersData)
      const answersResult = await supabase.from(TABLES.ANSWERS).insert([answersData])
      
      if (answersResult.error) {
        console.error('Lỗi lưu survey_answers:', answersResult.error)
        // Không throw error để vẫn hiện thông báo thành công
      } else {
        console.log('Đã lưu vào survey_answers thành công!')
      }
      
      setSubmitSuccess(true)
      reset()
      window.scrollTo(0, 0)
    } catch (error) {
      console.error('Error submitting survey:', error)
      setSubmitError('Có lỗi xảy ra khi gửi phiếu khảo sát. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if a conditional question should be shown
  const shouldShowQuestion = (question) => {
    if (!question.conditionField) return true
    return watchedData[question.conditionField] === question.conditionValue
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gửi thành công!</h2>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã hoàn thành phiếu khảo sát. Dữ liệu của bạn đã được ghi nhận.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Làm bài khảo sát khác
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-sm border-b-4 border-blue-600 p-6 sm:p-10 mb-6">
          <div className="flex items-center justify-center mb-4">
            <svg className="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 uppercase leading-tight mb-2">
            PHIẾU KHẢO SÁT NHẬN BIẾT VÀ XỬ TRÍ PHẢN VỆ
          </h1>
          <h2 className="text-xl font-semibold text-center text-blue-800 uppercase mb-4">
            CỦA ĐIỀU DƯỠNG TẠI BỆNH VIỆN QUÂN Y 103
          </h2>
          <p className="text-gray-600 text-center italic text-sm">
            Phiếu khảo sát này nhằm mục đích đánh giá thực trạng kiến thức và kỹ năng xử trí phản vệ. 
            Rất mong nhận được sự hợp tác của Anh/Chị.
          </p>
        </div>

        {submitError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md flex items-start">
            <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-red-700">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {SECTIONS.map((section) => (
            <div key={section.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-blue-800">{section.title}</h3>
                {section.description && (
                  <p className="text-sm text-gray-600 mt-1 italic">{section.description}</p>
                )}
              </div>
              
              <div className="p-6 space-y-6">
                {section.questions.map((question) => {
                  if (!shouldShowQuestion(question)) {
                    return null
                  }

                  return (
                    <div key={question.id} className="p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                      <label className="block text-base font-medium text-gray-800 mb-3">
                        {question.text}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {question.type === 'text' && (
                        <input
                          type="text"
                          className="mt-1 block w-full sm:w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder={question.placeholder}
                          {...register(question.id, { required: question.required })}
                        />
                      )}

                      {question.type === 'number' && (
                        <input
                          type="number"
                          min="0"
                          className="mt-1 block w-full sm:w-1/3 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder={question.placeholder}
                          {...register(question.id)}
                        />
                      )}

                      {question.type === 'radio' && (
                        <div className="space-y-2 mt-2">
                          {question.options?.map((option, idx) => (
                            <div key={idx} className="flex items-start">
                              <div className="flex items-center h-5">
                                <input
                                  id={`${question.id}-${idx}`}
                                  type="radio"
                                  value={option}
                                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                  {...register(question.id, { required: question.required })}
                                />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor={`${question.id}-${idx}`} className="font-medium text-gray-700 cursor-pointer select-none">
                                  {option}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {errors[question.id] && (
                        <p className="mt-1 text-sm text-red-600">Vui lòng trả lời câu hỏi này</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4 pb-12">
            <button
              type="button"
              onClick={() => reset()}
              className="mr-4 inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Xóa form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white 
                ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}
              `}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang gửi...
                </>
              ) : (
                <>
                  <svg className="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                  </svg>
                  Gửi Khảo Sát
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
