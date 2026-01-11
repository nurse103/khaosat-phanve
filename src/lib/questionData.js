export const SECTIONS = [
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
