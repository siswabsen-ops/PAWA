export type UserRole = 
  | 'admin_yayasan'      // Akses penuh, atur pengguna, lihat semua data
  | 'ketua_laz'          // Setujui transaksi, lihat laporan lengkap
  | 'bendahara'          // Input pemasukan/pengeluaran, kelola kas
  | 'sekretaris'          // Kelola data muzakki dan mustahik
  | 'bidang_lapangan'    // Input data dan bukti penyaluran
  | 'donatur';           // Hanya bisa lihat riwayat setoran dan laporan umum

export interface UserProfile {
  username: string;
  fullName: string;
  role: UserRole;
  email: string;
}

export type DanaType = 
  | 'Zakat Fitrah'
  | 'Zakat Mal'
  | 'Infak'
  | 'Sedekah'
  | 'Wakaf';

export interface SetoranDana {
  id: string;
  muzakkiName: string;
  phone: string;
  alamat: string;
  amount: number;
  type: DanaType;
  paymentMethod: 'Tunai' | 'Transfer Bank' | 'QRIS' | 'Lainnya';
  tanggal: string;
  keterangan: string;
  noKwitansi: string;
}

export type AsnafType = 
  | 'Fakir'
  | 'Miskin'
  | 'Amil'
  | 'Muallaf'
  | 'Riqab'
  | 'Gharimin'
  | 'Fisabilillah'
  | 'Ibnu Sabil';

export type VerifikasiStatus = 'Belum Diperiksa' | 'Layak' | 'Tidak Layak';

export interface MustahikProfile {
  id: string;
  nama: string;
  identitasNo: string; // KTP / KK
  phone: string;
  alamat: string;
  asnaf: AsnafType;
  penghasilan: number;
  tanggungan: number;
  kondisiRumah: string;
  statusVerifikasi: VerifikasiStatus;
  catatanVerifikasi: string;
  tanggalVerifikasi?: string;
  riwayatBantuanIds: string[];
}

export type PenyaluranStatus = 
  | 'Usulan'
  | 'Verifikasi'
  | 'Persetujuan'
  | 'Penyaluran'
  | 'Dokumentasi';

export interface PenyaluranDana {
  id: string;
  noPenyaluran: string;
  peruntukanName: string; // Misal: Bantuan Beras Kaum Miskin RT 02
  mustahikId?: string; // bisa spesifik ke satu orang atau komunitas/asnaf umum
  mustahikNama?: string;
  asnafTarget: AsnafType | 'Gabungan' | 'Lainnya';
  danaSourceType: DanaType;
  amountRequested: number;
  amountApproved: number;
  status: PenyaluranStatus;
  tanggalUsulan: string;
  tanggalPenyaluran?: string;
  diusulkanOleh: string;
  disetujuiOleh?: string;
  keterangan: string;
  buktiFotoUrl?: string; // mockup / real upload data URI
  tandaTerimaDigital?: string; // canvas signature data URI
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
