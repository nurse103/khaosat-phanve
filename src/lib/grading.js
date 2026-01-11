// Bảng đáp án chấm điểm
// Dựa trên file DAP_AN_KHAO_SAT.md
// Chỉ chấm điểm các câu hỏi kiến thức (Phần III và IV)

export const ANSWER_KEY = {
    // PHẦN III: KIẾN THỨC
    'III_1': 'B',
    'III_2': 'B',
    'III_3': 'B',
    'III_4': 'C',
    'III_5': 'C',
    'III_6': 'B',
    // Câu 7, 8 là câu hỏi tự đánh giá (không chấm điểm)
    'III_9': 'C',
    'III_10': 'B',
    'III_11': 'B',
    'III_12': 'B',
    'III_13': 'C',
    'III_14': 'D',
    'III_15': 'D',
    'III_16': 'B',
    'III_17': 'B',
    'III_18': 'B',
    'III_19': 'B',
    'III_20': 'B',

    // PHẦN IV: XỬ TRÍ
    'IV_21': 'A',
    'IV_22': 'B',
    'IV_23': 'C',
    'IV_24': 'C',
    'IV_25': 'D',
    'IV_26': 'B',
    'IV_27': 'C',
    'IV_28': 'B',
    'IV_29': 'B',
    'IV_30': 'A'
}

/**
 * Chấm điểm một câu trả lời
 * @param {string} questionId - ID câu hỏi (VD: 'III_1')
 * @param {string} answer - Nội dung câu trả lời của người dùng (VD: 'B. ...')
 * @returns {string} - 'Đúng', 'Sai', hoặc null nếu không phải câu hỏi chấm điểm
 */
export const gradeAnswer = (questionId, answer) => {
    const correctKey = ANSWER_KEY[questionId]

    // Nếu không có trong bảng đáp án -> Không chấm
    if (!correctKey) return null

    // Nếu không có câu trả lời -> Sai
    if (!answer) return 'Sai'

    // Lấy ký tự đầu tiên của câu trả lời người dùng để so sánh
    // VD: "A. ..." -> "A"
    const answerKey = answer.trim().charAt(0).toUpperCase()

    return answerKey === correctKey ? 'Đúng' : 'Sai'
}
