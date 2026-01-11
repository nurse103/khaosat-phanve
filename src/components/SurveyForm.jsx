import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { supabase, TABLES, QUESTION_TO_COLUMN } from '../lib/supabase'
import { SECTIONS } from '../lib/questionData'
import { gradeAnswer } from '../lib/grading'

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
      const timestamp = new Date().toISOString()

      // 1. Prepare data for survey_answers table (RAW DATA)
      const answersData = {
        submitted_at: timestamp,
        tong_so_cau: 30
      }

      // 2. Prepare data for survey_results table (GRADED DATA)
      const resultsData = {
        submitted_at: timestamp,
        tong_so_cau: 30
      }

      // Map responses to columns
      // Save RAW values (e.g., "A. ...", "B. ...") instead of checking Correct/Incorrect
      Object.keys(data).forEach(questionId => {
        const columnName = QUESTION_TO_COLUMN[questionId]
        if (columnName) {
          const rawAnswer = data[questionId]

          // Populate Raw Data
          answersData[columnName] = rawAnswer

          // Populate Graded Data
          // Try to grade. If returns "Đúng"/"Sai" use it. If null, use raw answer.
          const grade = gradeAnswer(questionId, rawAnswer)
          resultsData[columnName] = grade !== null ? grade : rawAnswer
        }
      })

      // Save to both tables in parallel
      // 1. JSON responses (required)
      const responsesPromise = supabase.from(TABLES.RESPONSES).insert([{
        responses: data,
        submitted_at: timestamp
      }])

      // 2. Individual columns (for Excel/Stats)
      const answersPromise = supabase.from(TABLES.ANSWERS).insert([answersData])

      // 3. Graded Results (for correctness analysis)
      const resultsPromise = supabase.from(TABLES.RESULTS).insert([resultsData])

      // Execute all inserts
      const [responsesResult, answersResult, resultsResult] = await Promise.all([
        responsesPromise,
        answersPromise,
        resultsPromise
      ])

      if (responsesResult.error) throw responsesResult.error

      if (answersResult.error) {
        console.error('Error saving to survey_answers:', answersResult.error)
        // Don't throw error to show success message to user
      } else {
        console.log('Successfully saved to survey_answers!')
      }

      if (resultsResult.error) {
        console.error('Error saving to survey_results:', resultsResult.error)
        const errMsg = resultsResult.error.message || JSON.stringify(resultsResult.error)
        alert(`Lỗi lưu bảng survey_results: ${errMsg}\n\nHãy kiểm tra lại cột 'i_6_ten_khoa' và RLS Policy!`)
        setSubmitError(`Lỗi lưu kết quả chấm điểm (survey_results): ${errMsg}`)
        setIsSubmitting(false)
        return
      } else {
        console.log('Successfully saved to survey_results!')
      }

      setSubmitSuccess(true)
      reset()
      window.scrollTo(0, 0)
    } catch (error) {
      console.error('Error submitting survey:', error)
      const errDetail = error.message || JSON.stringify(error)
      alert(`Đã có lỗi xảy ra: ${errDetail}`)
      setSubmitError(`Có lỗi chi tiết: ${errDetail}`)
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
