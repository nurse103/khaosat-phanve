// Supabase configuration
// Replace these with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  RESPONSES: 'survey_responses',    // Bảng JSON (backup)
  ANSWERS: 'survey_answers'         // Bảng từng câu riêng lẻ (xuất Excel)
}

// Mapping từ ID câu hỏi sang tên cột trong database (chữ thường)
export const QUESTION_TO_COLUMN = {
  'I_1': 'i_1_nam_sinh',
  'I_2': 'i_2_gioi_tinh',
  'I_3': 'i_3_trinh_do',
  'I_4': 'i_4_tham_nien',
  'I_5': 'i_5_khoa',
  'II_1': 'ii_1_dao_tao_phan_ve',
  'II_2': 'ii_2_da_xu_tri_phan_ve',
  'II_3': 'ii_3_so_lan_xu_tri',
  'II_4': 'ii_4_muc_do_tu_tin',
  'II_5': 'ii_5_nam_vung_phac_do',
  'II_6': 'ii_6_trang_thiet_bi',
  'II_7': 'ii_7_biet_hop_thuoc',
  'II_8': 'ii_8_mong_muon_dao_tao',
  'III_1': 'iii_1_phan_ve_la_gi',
  'III_2': 'iii_2_dau_hieu_som',
  'III_3': 'iii_3_nguyen_nhan_benh_vien',
  'III_4': 'iii_4_khong_phai_trieu_chung',
  'III_5': 'iii_5_so_muc_do',
  'III_6': 'iii_6_dac_trung_do_2',
  'III_7': 'iii_7_tu_tin_nhan_biet',
  'III_8': 'iii_8_tu_tin_phan_biet',
  'III_9': 'iii_9_thuoc_dau_tay',
  'III_10': 'iii_10_duong_dung_adrenaline',
  'III_11': 'iii_11_lieu_adrenaline',
  'III_12': 'iii_12_lieu_thu_hai',
  'III_13': 'iii_13_tu_the_benh_nhan',
  'III_14': 'iii_14_kho_khan_lon_nhat',
  'III_15': 'iii_15_thoi_gian_theo_doi',
  'III_16': 'iii_16_dau_hieu_nang',
  'III_17': 'iii_17_trieu_chung_ho_hap',
  'III_18': 'iii_18_tien_su_quan_trong',
  'III_19': 'iii_19_thoi_gian_xay_ra',
  'III_20': 'iii_20_dau_hieu_khong_noi',
  'IV_21': 'iv_21_do_phan_ve_penicillin',
  'IV_22': 'iv_22_xu_tri_dau_tien',
  'IV_23': 'iv_23_do_phan_ve_truyen_dich',
  'IV_24': 'iv_24_hanh_dong_quan_trong',
  'IV_25': 'iv_25_thanh_phan_mau',
  'IV_26': 'iv_26_hanh_dong_truyen_mau',
  'IV_27': 'iv_27_do_phan_ve_ong_dot',
  'IV_28': 'iv_28_tinh_lieu_adrenaline',
  'IV_29': 'iv_29_xu_tri_uu_tien',
  'IV_30': 'iv_30_xu_tri_di_ung_khang_sinh'
}
