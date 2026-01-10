-- Supabase SQL Schema for Anaphylaxis Survey
-- Run this in your Supabase SQL Editor

-- =============================================
-- BẢNG 1: Lưu trữ JSON (backup)
-- =============================================
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  responses JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_survey_responses_submitted_at ON survey_responses(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_survey_responses_responses ON survey_responses USING GIN (responses);

-- =============================================
-- BẢNG 2: Lưu từng câu hỏi riêng lẻ (dễ xuất Excel)
-- =============================================
CREATE TABLE IF NOT EXISTS survey_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- PHẦN I: THÔNG TIN CHUNG
  I_1_nam_sinh TEXT,
  I_2_gioi_tinh TEXT,
  I_3_trinh_do TEXT,
  I_4_tham_nien TEXT,
  I_5_khoa TEXT,
  
  -- PHẦN II: THỰC TRẠNG
  II_1_dao_tao_phan_ve TEXT,
  II_2_da_xu_tri_phan_ve TEXT,
  II_3_so_lan_xu_tri TEXT,
  II_4_muc_do_tu_tin TEXT,
  II_5_nam_vung_phac_do TEXT,
  II_6_trang_thiet_bi TEXT,
  II_7_biet_hop_thuoc TEXT,
  II_8_mong_muon_dao_tao TEXT,
  
  -- PHẦN III: NHẬN BIẾT PHẢN VỆ (1-20)
  III_1_phan_ve_la_gi TEXT,
  III_2_dau_hieu_som TEXT,
  III_3_nguyen_nhan_benh_vien TEXT,
  III_4_khong_phai_trieu_chung TEXT,
  III_5_so_muc_do TEXT,
  III_6_dac_trung_do_2 TEXT,
  III_7_tu_tin_nhan_biet TEXT,
  III_8_tu_tin_phan_biet TEXT,
  III_9_thuoc_dau_tay TEXT,
  III_10_duong_dung_adrenaline TEXT,
  III_11_lieu_adrenaline TEXT,
  III_12_lieu_thu_hai TEXT,
  III_13_tu_the_benh_nhan TEXT,
  III_14_kho_khan_lon_nhat TEXT,
  III_15_thoi_gian_theo_doi TEXT,
  III_16_dau_hieu_nang TEXT,
  III_17_trieu_chung_ho_hap TEXT,
  III_18_tien_su_quan_trong TEXT,
  III_19_thoi_gian_xay_ra TEXT,
  III_20_dau_hieu_khong_noi TEXT,
  
  -- PHẦN IV: XỬ TRÍ PHẢN VỆ (21-30)
  IV_21_do_phan_ve_penicillin TEXT,
  IV_22_xu_tri_dau_tien TEXT,
  IV_23_do_phan_ve_truyen_dich TEXT,
  IV_24_hanh_dong_quan_trong TEXT,
  IV_25_thanh_phan_mau TEXT,
  IV_26_hanh_dong_truyen_mau TEXT,
  IV_27_do_phan_ve_ong_dot TEXT,
  IV_28_tinh_lieu_adrenaline TEXT,
  IV_29_xu_tri_uu_tien TEXT,
  IV_30_xu_tri_di_ung_khang_sinh TEXT,
  
  -- ĐIỂM SỐ
  diem_so INTEGER DEFAULT 0,
  so_cau_dung INTEGER DEFAULT 0,
  tong_so_cau INTEGER DEFAULT 30,
  
  -- Metadata
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes cho bảng survey_answers
CREATE INDEX IF NOT EXISTS idx_survey_answers_submitted_at ON survey_answers(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_survey_answers_diem_so ON survey_answers(diem_so);
CREATE INDEX IF NOT EXISTS idx_survey_answers_gioi_tinh ON survey_answers(I_2_gioi_tinh);
CREATE INDEX IF NOT EXISTS idx_survey_answers_trinh_do ON survey_answers(I_3_trinh_do);

-- =============================================
-- RLS POLICIES
-- =============================================
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers ENABLE ROW LEVEL SECURITY;

-- Policies cho survey_responses
DROP POLICY IF EXISTS "Allow anonymous inserts" ON survey_responses;
CREATE POLICY "Allow anonymous inserts" ON survey_responses
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read" ON survey_responses;
CREATE POLICY "Allow authenticated read" ON survey_responses
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow anonymous read" ON survey_responses;
CREATE POLICY "Allow anonymous read" ON survey_responses
  FOR SELECT TO anon USING (true);

-- Policies cho survey_answers
DROP POLICY IF EXISTS "Allow anonymous inserts answers" ON survey_answers;
CREATE POLICY "Allow anonymous inserts answers" ON survey_answers
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read answers" ON survey_answers;
CREATE POLICY "Allow authenticated read answers" ON survey_answers
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow anonymous read answers" ON survey_answers;
CREATE POLICY "Allow anonymous read answers" ON survey_answers
  FOR SELECT TO anon USING (true);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_survey_responses_updated_at ON survey_responses;
CREATE TRIGGER update_survey_responses_updated_at
  BEFORE UPDATE ON survey_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
