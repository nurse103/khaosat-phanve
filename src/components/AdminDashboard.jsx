import { useState, useEffect, useMemo } from 'react'
import { supabase, TABLES } from '../lib/supabase'
import * as XLSX from 'xlsx'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { SECTIONS } from '../lib/questionData'

// Mapping câu hỏi sang tên cột trong database
const QUESTION_COLUMNS = {
  // PHẦN II: THỰC TRẠNG
  'II_1': 'ii_1_dao_tao_phan_ve', 'II_2': 'ii_2_da_xu_tri_phan_ve',
  'II_3': 'ii_3_so_lan_xu_tri', 'II_4': 'ii_4_muc_do_tu_tin',
  'II_5': 'ii_5_nam_vung_phac_do', 'II_6': 'ii_6_trang_thiet_bi',
  'II_7': 'ii_7_biet_hop_thuoc', 'II_8': 'ii_8_mong_muon_dao_tao',
  // PHẦN III: KIẾN THỨC
  'III_1': 'iii_1_phan_ve_la_gi', 'III_2': 'iii_2_dau_hieu_som',
  'III_3': 'iii_3_nguyen_nhan_benh_vien', 'III_4': 'iii_4_khong_phai_trieu_chung',
  'III_5': 'iii_5_so_muc_do', 'III_6': 'iii_6_dac_trung_do_2',
  'III_7': 'iii_7_tu_tin_nhan_biet', 'III_8': 'iii_8_tu_tin_phan_biet',
  'III_9': 'iii_9_thuoc_dau_tay', 'III_10': 'iii_10_duong_dung_adrenaline',
  'III_11': 'iii_11_lieu_adrenaline', 'III_12': 'iii_12_lieu_thu_hai',
  'III_13': 'iii_13_tu_the_benh_nhan', 'III_14': 'iii_14_kho_khan_lon_nhat',
  'III_15': 'iii_15_thoi_gian_theo_doi', 'III_16': 'iii_16_dau_hieu_nang',
  'III_17': 'iii_17_trieu_chung_ho_hap', 'III_18': 'iii_18_tien_su_quan_trong',
  'III_19': 'iii_19_thoi_gian_xay_ra', 'III_20': 'iii_20_dau_hieu_khong_noi',
  // PHẦN IV: XỬ TRÍ
  'IV_21': 'iv_21_do_phan_ve_penicillin', 'IV_22': 'iv_22_xu_tri_dau_tien',
  'IV_23': 'iv_23_do_phan_ve_truyen_dich', 'IV_24': 'iv_24_hanh_dong_quan_trong',
  'IV_25': 'iv_25_thanh_phan_mau', 'IV_26': 'iv_26_hanh_dong_truyen_mau',
  'IV_27': 'iv_27_do_phan_ve_ong_dot', 'IV_28': 'iv_28_tinh_lieu_adrenaline',
  'IV_29': 'iv_29_xu_tri_uu_tien', 'IV_30': 'iv_30_xu_tri_di_ung_khang_sinh'
}

// Màu sắc cho biểu đồ
const COLORS = ['#0088FE', '#FF6384', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658']
const GENDER_COLORS = { 'Nam': '#0088FE', 'Nữ': '#FF6384', 'Khác': '#00C49F' }

export default function AdminDashboard() {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState(null)
  const [selectedResponse, setSelectedResponse] = useState(null)
  const [activeTab, setActiveTab] = useState('overview') // overview, questions, data

  // Stats data
  const [genderData, setGenderData] = useState([])
  const [educationData, setEducationData] = useState([])
  const [experienceData, setExperienceData] = useState([])
  const [trainingData, setTrainingData] = useState([])
  const [witnessedData, setWitnessedData] = useState([])
  const [handledCountData, setHandledCountData] = useState([])
  const [handledData, setHandledData] = useState([])
  const [departmentData, setDepartmentData] = useState([])
  const [detailedStats, setDetailedStats] = useState([])
  const [totalResponses, setTotalResponses] = useState(0)

  // Tạo map để tra cứu nội dung câu hỏi nhanh
  const questionTextMap = useMemo(() => {
    const map = {}
    SECTIONS.forEach(section => {
      section.questions.forEach(q => {
        map[q.id] = q.text
      })
    })
    return map
  }, [])

  useEffect(() => {
    fetchResponses()
  }, [])

  const fetchResponses = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from(TABLES.ANSWERS)
        .select('*')
        .order('submitted_at', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        setError(`Không thể tải dữ liệu. Lỗi: ${error.message || error}`)
        return
      }
      setResponses(data || [])
      calculateAllStats(data || [])
    } catch (err) {
      console.error('Error fetching responses:', err)
      setError(`Không thể tải dữ liệu. Lỗi: ${err.message || err}`)
    } finally {
      setLoading(false)
    }
  }

  const calculateAllStats = (data) => {
    if (data.length === 0) return
    setTotalResponses(data.length)

    // Thống kê theo giới tính (biểu đồ tròn)
    const genderCount = {}
    data.forEach(item => {
      const gender = item.i_2_gioi_tinh || 'Không xác định'
      genderCount[gender] = (genderCount[gender] || 0) + 1
    })
    setGenderData(Object.entries(genderCount).map(([name, value]) => ({
      name, value,
      percent: Math.round((value / data.length) * 100),
      color: GENDER_COLORS[name] || '#8884d8'
    })))

    // Thống kê theo trình độ (biểu đồ cột)
    const eduCount = {}
    data.forEach(item => {
      const edu = item.i_3_trinh_do || 'Không xác định'
      eduCount[edu] = (eduCount[edu] || 0) + 1
    })
    setEducationData(Object.entries(eduCount).map(([name, value]) => ({ name, 'Số lượng': value })))

    // Thống kê theo thâm niên (biểu đồ cột)
    const expCount = {}
    data.forEach(item => {
      const exp = item.i_4_tham_nien || 'Không xác định'
      expCount[exp] = (expCount[exp] || 0) + 1
    })
    setExperienceData(Object.entries(expCount).map(([name, value]) => ({ name, 'Số lượng': value })))

    // Thống kê theo Khoa/Phòng
    const deptCount = {}
    data.forEach(item => {
      let dept = item.i_6_ten_khoa || 'Không xác định'
      dept = dept.trim()
      if (!dept) dept = 'Không xác định'
      deptCount[dept] = (deptCount[dept] || 0) + 1
    })
    setDepartmentData(Object.entries(deptCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, 'Số lượng': value }))
    )

    // Thống kê đã tập huấn (II.1)
    const trainingCount = {}
    data.forEach(item => {
      const val = item.ii_1_dao_tao_phan_ve || 'Không xác định'
      trainingCount[val] = (trainingCount[val] || 0) + 1
    })
    setTrainingData(Object.entries(trainingCount).map(([name, value]) => ({ name, 'Số lượng': value })))

    // Thống kê đã chứng kiến/xử trí (II.2)
    const witnessCount = {}
    data.forEach(item => {
      const val = item.ii_2_da_xu_tri_phan_ve || 'Không xác định'
      witnessCount[val] = (witnessCount[val] || 0) + 1
    })
    setWitnessedData(Object.entries(witnessCount).map(([name, value]) => ({ name, 'Số lượng': value })))

    // Thống kê số lần xử trí (II.3)
    const handledCountStats = {}
    data.forEach(item => {
      const val = item.ii_3_so_lan_xu_tri || 'Không xác định'
      handledCountStats[val] = (handledCountStats[val] || 0) + 1
    })
    setHandledCountData(Object.entries(handledCountStats).map(([name, value]) => ({ name, 'Số lượng': value })))

    // Thống kê mức độ tự tin (II.4)
    const confidentCount = {}
    data.forEach(item => {
      const val = item.ii_4_muc_do_tu_tin || 'Không xác định'
      confidentCount[val] = (confidentCount[val] || 0) + 1
    })
    setHandledData(Object.entries(confidentCount).map(([name, value]) => ({ name, 'Số lượng': value })))

    // === THỐNG KÊ CHI TIẾT TỪNG CÂU HỎI (Phần II, III và IV) ===
    const stats = []

    // Lấy danh sách câu hỏi từ SECTIONS (Thêm 'status' cho phần II)
    const activeSections = SECTIONS.filter(s => s.id === 'status' || s.id === 'knowledge' || s.id === 'treatment')

    activeSections.forEach(section => {
      section.questions.forEach(question => {
        const colName = QUESTION_COLUMNS[question.id]
        if (!colName) return

        const optionCounts = {}
        // Khởi tạo count = 0 cho tất cả các option có sẵn
        if (question.options) {
          question.options.forEach(opt => {
            optionCounts[opt] = 0
          })
        }

        // Đếm số lượng phản hồi cho từng option
        data.forEach(item => {
          const userVal = item[colName]
          if (userVal) {
            // Chuẩn hóa một chút nếu cần
            if (optionCounts.hasOwnProperty(userVal)) {
              optionCounts[userVal] = (optionCounts[userVal] || 0) + 1
            } else {
              // Trường hợp dữ liệu không khớp hoặc option mở (nếu có), gộp vào key chính nó
              optionCounts[userVal] = (optionCounts[userVal] || 0) + 1
            }
          }
        })

        stats.push({
          id: question.id,
          text: question.text,
          options: Object.entries(optionCounts).map(([optText, count]) => ({
            text: optText,
            count: count
          }))
        })
      })
    })

    setDetailedStats(stats)
  }

  // Handle Export (Raw or Graded)
  const handleExport = async (type) => {
    if (responses.length === 0) return
    setExporting(true)

    try {
      let dataToExport = []
      let fileNameSuffix = ''

      if (type === 'raw') {
        dataToExport = responses
        fileNameSuffix = '_Goc'
      } else if (type === 'graded') {
        const { data, error } = await supabase
          .from(TABLES.RESULTS)
          .select('*')
          .order('submitted_at', { ascending: false })

        if (error) throw error
        dataToExport = data || []
        fileNameSuffix = '_ChamDiem'
      }

      if (dataToExport.length === 0) {
        alert(`Không tìm thấy dữ liệu ${type === 'raw' ? 'gốc' : 'chấm điểm'} để xuất!`)
        setExporting(false)
        return
      }

      const columnOrder = [
        'submitted_at',
        'i_1_nam_sinh', 'i_2_gioi_tinh', 'i_3_trinh_do', 'i_4_tham_nien', 'i_5_khoa', 'i_6_ten_khoa',
        'ii_1_dao_tao_phan_ve', 'ii_2_da_xu_tri_phan_ve', 'ii_3_so_lan_xu_tri',
        'ii_4_muc_do_tu_tin', 'ii_5_nam_vung_phac_do', 'ii_6_trang_thiet_bi',
        'ii_7_biet_hop_thuoc', 'ii_8_mong_muon_dao_tao',
        'iii_1_phan_ve_la_gi', 'iii_2_dau_hieu_som', 'iii_3_nguyen_nhan_benh_vien',
        'iii_4_khong_phai_trieu_chung', 'iii_5_so_muc_do', 'iii_6_dac_trung_do_2',
        'iii_7_tu_tin_nhan_biet', 'iii_8_tu_tin_phan_biet', 'iii_9_thuoc_dau_tay',
        'iii_10_duong_dung_adrenaline', 'iii_11_lieu_adrenaline', 'iii_12_lieu_thu_hai',
        'iii_13_tu_the_benh_nhan', 'iii_14_kho_khan_lon_nhat', 'iii_15_thoi_gian_theo_doi',
        'iii_16_dau_hieu_nang', 'iii_17_trieu_chung_ho_hap', 'iii_18_tien_su_quan_trong',
        'iii_19_thoi_gian_xay_ra', 'iii_20_dau_hieu_khong_noi',
        'iv_21_do_phan_ve_penicillin', 'iv_22_xu_tri_dau_tien', 'iv_23_do_phan_ve_truyen_dich',
        'iv_24_hanh_dong_quan_trong', 'iv_25_thanh_phan_mau', 'iv_26_hanh_dong_truyen_mau',
        'iv_27_do_phan_ve_ong_dot', 'iv_28_tinh_lieu_adrenaline', 'iv_29_xu_tri_uu_tien',
        'iv_30_xu_tri_di_ung_khang_sinh'
      ]

      const headers = [
        'STT', 'Ngày gửi',
        'Năm sinh', 'Giới tính', 'Trình độ', 'Thâm niên', 'Khoa', 'Tên Khoa',
        'II.1', 'II.2', 'II.3', 'II.4', 'II.5', 'II.6', 'II.7', 'II.8',
        'III.1', 'III.2', 'III.3', 'III.4', 'III.5', 'III.6', 'III.7', 'III.8',
        'III.9', 'III.10', 'III.11', 'III.12', 'III.13', 'III.14', 'III.15',
        'III.16', 'III.17', 'III.18', 'III.19', 'III.20',
        'IV.21', 'IV.22', 'IV.23', 'IV.24', 'IV.25', 'IV.26', 'IV.27', 'IV.28', 'IV.29', 'IV.30'
      ]

      const excelData = dataToExport.map((row, index) => {
        const rowData = { 'STT': index + 1, 'Ngày gửi': row.submitted_at ? new Date(row.submitted_at).toLocaleString('vi-VN') : '' }
        columnOrder.slice(1).forEach((col, colIndex) => {
          const headerName = headers[colIndex + 2]
          rowData[headerName] = row[col] || ''
        })
        return rowData
      })

      const ws = XLSX.utils.json_to_sheet(excelData, { header: headers })
      const colWidths = headers.map(h => ({ wch: Math.max(h.length + 2, 10) }))
      colWidths[0] = { wch: 5 }
      colWidths[1] = { wch: 18 }
      ws['!cols'] = colWidths

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Kết quả khảo sát')

      XLSX.writeFile(wb, `KhaoSat_PhanVe${fileNameSuffix}_${new Date().toISOString().split('T')[0]}.xlsx`)

    } catch (err) {
      console.error('Export error:', err)
      alert('Có lỗi khi xuất file: ' + (err.message || err))
    } finally {
      setExporting(false)
    }
  }

  // Custom tooltip cho biểu đồ tròn
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-semibold">{payload[0].name}</p>
          <p>Số lượng: {payload[0].value}</p>
          <p>Tỷ lệ: {payload[0].payload.percent}%</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Quản lý kết quả khảo sát</h1>
            <p className="text-gray-600 mt-1">Tổng số phản hồi: <span className="font-bold text-blue-600">{totalResponses}</span></p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchResponses}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              disabled={exporting}
            >
              🔄 Làm mới
            </button>
            <button
              onClick={() => handleExport('raw')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-2"
              disabled={responses.length === 0 || exporting}
            >
              📥 Xuất Dữ Liệu Gốc
            </button>
            <button
              onClick={() => handleExport('graded')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition flex items-center gap-2"
              disabled={responses.length === 0 || exporting}
            >
              📥 Xuất Dữ Liệu Chấm Điểm
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-6 border-b">
          {['overview', 'questions', 'data'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition ${activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab === 'overview' ? '📊 Tổng quan' : tab === 'questions' ? '📋 Thống kê câu hỏi' : '📄 Dữ liệu chi tiết'}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Tab: Tổng quan */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Row 1: Thống kê Khoa/Phòng (NEW) + Biểu đồ tròn - Giới tính */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Biểu đồ cột ngang - Khoa/Phòng */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Thống kê người tham gia theo Khoa/Phòng</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={departmentData.slice(0, 15)} // Top 15 khoa
                    margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={90} fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="Số lượng" fill="#0088FE" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
                {departmentData.length > 15 && (
                  <p className="text-center text-sm text-gray-500 mt-2">*(Hiển thị 15 đơn vị có số lượng người tham gia nhiều nhất)*</p>
                )}
              </div>
            </div>

            {/* Biểu đồ tròn - Giới tính */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Thống kê theo Giới tính</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, value, percent }) => `${name}: ${value} (${percent}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Biểu đồ cột - Trình độ */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Thống kê theo Trình độ</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={educationData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="Số lượng" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 2: Thâm niên + Đã tập huấn */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Thống kê theo Thâm niên công tác</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={experienceData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="Số lượng" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Đã được tập huấn về phản vệ</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trainingData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="Số lượng" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 3: Đã chứng kiến + Số lần xử trí */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Đã chứng kiến/xử trí phản vệ</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={witnessedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="Số lượng" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Số lần trực tiếp xử trí</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={handledCountData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="Số lượng" fill="#FF6384" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Row 4: Mức độ tự tin */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Mức độ tự tin xử trí phản vệ</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={handledData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Số lượng" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Thống kê câu hỏi */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* Bảng thống kê chi tiết */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Thống kê chi tiết từng câu hỏi (Phần II, III, IV)</h3>
            <div className="space-y-8">
              {detailedStats.map((q, idx) => (
                <div key={q.id} className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-bold text-blue-800 mb-3">{q.text}</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300 bg-white">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border px-4 py-2 text-left">Lựa chọn</th>
                          <th className="border px-4 py-2 text-center w-32">Số lượng</th>
                          <th className="border px-4 py-2 text-center w-32">Tỷ lệ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {q.options.map((opt, optIdx) => (
                          <tr key={optIdx} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">{opt.text}</td>
                            <td className="border px-4 py-2 text-center font-bold">{opt.count}</td>
                            <td className="border px-4 py-2 text-center text-gray-600">
                              {totalResponses > 0 ? Math.round((opt.count / totalResponses) * 100) : 0}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Dữ liệu chi tiết */}
      {activeTab === 'data' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📄 Danh sách phản hồi ({responses.length})</h3>

          {responses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có dữ liệu khảo sát nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-3 py-2 text-left">STT</th>
                    <th className="border px-3 py-2 text-left">Ngày gửi</th>
                    <th className="border px-3 py-2 text-left">Năm sinh</th>
                    <th className="border px-3 py-2 text-left">Giới tính</th>
                    <th className="border px-3 py-2 text-left">Trình độ</th>
                    <th className="border px-3 py-2 text-left">Thâm niên</th>
                    <th className="border px-3 py-2 text-left">Tên Khoa</th>
                    <th className="border px-3 py-2 text-center">Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((response, index) => (
                    <tr key={response.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border px-3 py-2">{index + 1}</td>
                      <td className="border px-3 py-2">
                        {response.submitted_at ? new Date(response.submitted_at).toLocaleString('vi-VN') : '-'}
                      </td>
                      <td className="border px-3 py-2">{response.i_1_nam_sinh || '-'}</td>
                      <td className="border px-3 py-2">{response.i_2_gioi_tinh || '-'}</td>
                      <td className="border px-3 py-2">{response.i_3_trinh_do || '-'}</td>
                      <td className="border px-3 py-2">{response.i_4_tham_nien || '-'}</td>
                      <td className="border px-3 py-2">{response.i_6_ten_khoa || '-'}</td>
                      <td className="border px-3 py-2 text-center">
                        <button
                          onClick={() => setSelectedResponse(response)}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal chi tiết */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-blue-800">Chi tiết phản hồi</h3>
              <button
                onClick={() => setSelectedResponse(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-gray-100 p-3 rounded">
                  <p className="text-sm text-gray-500">Năm sinh</p>
                  <p className="font-bold">{selectedResponse.i_1_nam_sinh || '-'}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <p className="text-sm text-gray-500">Giới tính</p>
                  <p className="font-bold">{selectedResponse.i_2_gioi_tinh || '-'}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <p className="text-sm text-gray-500">Trình độ</p>
                  <p className="font-bold">{selectedResponse.i_3_trinh_do || '-'}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <p className="text-sm text-gray-500">Thâm niên</p>
                  <p className="font-bold">{selectedResponse.i_4_tham_nien || '-'}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded">
                  <p className="text-sm text-gray-500">Tên Khoa</p>
                  <p className="font-bold">{selectedResponse.i_6_ten_khoa || '-'}</p>
                </div>
              </div>

              {/* Chi tiết câu trả lời */}
              <h4 className="font-bold text-lg mb-3">Chi tiết câu trả lời (Phần II, III, IV):</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.keys(QUESTION_COLUMNS).map(qId => {
                  // Hiển thị cả phần II, III, IV
                  if (!qId.startsWith('II_') && !qId.startsWith('III_') && !qId.startsWith('IV_')) return null

                  const colName = QUESTION_COLUMNS[qId]
                  const answer = selectedResponse[colName]

                  return (
                    <div
                      key={qId}
                      className="p-3 rounded text-sm bg-gray-50 text-gray-800 border"
                    >
                      <span className="font-bold block mb-1 text-blue-800">{questionTextMap[qId] || qId}</span>
                      <span className="block">{answer || '-'}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
