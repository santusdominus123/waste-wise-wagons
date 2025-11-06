import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // App & Navigation
    'app.name': 'RE-GEN TECH',
    'nav.app_name': 'RE-GEN TECH',
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.admin_panel': 'Admin Panel',
    'nav.request_pickup': 'Request Pickup',
    'nav.pickup_history': 'Pickup History',
    'nav.cart_calculator': 'Cart Calculator',
    'nav.driver_hub': 'Driver Hub',
    'nav.driver': 'Driver',
    'nav.rewards': 'Rewards',
    'nav.sign_out': 'Sign Out',

    // Auth & Login
    'auth.local_login': 'Local Login',
    'auth.sign_in': 'Sign In',
    'auth.sign_up': 'Sign Up',
    'auth.username': 'Username',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.full_name': 'Full Name',
    'auth.enter_username': 'Enter username',
    'auth.enter_email': 'Enter your email',
    'auth.enter_password': 'Enter password',
    'auth.enter_full_name': 'Enter your full name',
    'auth.create_password': 'Create a password',
    'auth.logging_in': 'Logging in...',
    'auth.signing_in': 'Signing in...',
    'auth.creating_account': 'Creating account...',
    'auth.demo_credentials': 'Demo credentials:',
    'auth.sustainable_platform': 'Sustainable waste management platform',
    'auth.success_local': 'Successfully logged in locally!',
    'auth.success_signup': 'Account created successfully! Please check your email to verify your account.',
    'auth.error': 'Error',
    'auth.success': 'Success',

    // User Roles
    'role.user': 'User',
    'role.admin': 'Admin',
    'role.driver': 'Driver',

    // Status
    'status.scheduled': 'Scheduled',
    'status.in_progress': 'In Progress',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',
    'status.active': 'Active',
    'status.inactive': 'Inactive',

    // Dashboard - General
    'dashboard.welcome_back': 'Welcome back',
    'dashboard.welcome_user': 'Welcome back, {{name}}!',
    'dashboard.subtitle': 'Manage your waste pickup requests and track your environmental impact.',
    'dashboard.loading': 'Loading dashboard...',
    'dashboard.refresh': 'Refresh',

    // User Dashboard
    'user_dashboard.welcome': 'Welcome back, {{name}}! 👋',
    'user_dashboard.subtitle': 'Here\'s your environmental impact summary',
    'user_dashboard.environmental_impact': 'Your environmental impact summary',
    'user_dashboard.total_pickups': 'Total Pickups',
    'user_dashboard.points_earned': 'Points Earned',
    'user_dashboard.waste_collected': 'Waste Collected',
    'user_dashboard.co2_saved': 'CO₂ Saved',
    'user_dashboard.schedule_pickup': 'Schedule New Pickup',
    'user_dashboard.view_history': 'View Pickup History',
    'user_dashboard.redeem_rewards': 'Redeem Rewards',
    'user_dashboard.next_pickup': 'Next Pickup',
    'user_dashboard.recent_pickups': 'Recent Pickups',
    'user_dashboard.achievements': 'Achievements',

    // Admin Dashboard
    'admin.dashboard': 'Admin Dashboard',
    'admin.subtitle': 'Manage users and system settings',
    'admin.overview': 'Overview',
    'admin.users': 'Users',
    'admin.pickups': 'Pickups',
    'admin.analytics': 'Analytics',
    'admin.user_management': 'User Management',
    'admin.manage_users': 'Manage user accounts and permissions',
    'admin.system_health': 'System Health',
    'admin.recent_alerts': 'Recent Alerts',
    'admin.total_users': 'Total Users',
    'admin.active_users': 'Active Users',
    'admin.total_pickups': 'Total Pickups',
    'admin.active_pickups': 'Active Pickups',
    'admin.waste_collected': 'Waste Collected',
    'admin.monthly_growth': 'Monthly Growth',
    'admin.name': 'Name',
    'admin.email': 'Email',
    'admin.role': 'Role',
    'admin.status': 'Status',
    'admin.actions': 'Actions',
    'admin.active': 'Active',
    'admin.inactive': 'Inactive',
    'admin.created': 'Created',

    // Pickup Request
    'pickup.title': 'Request Pickup',
    'pickup.subtitle': 'Schedule a waste collection and earn reward points!',
    'pickup.address': 'Pickup Address',
    'pickup.address_placeholder': 'Enter your full pickup address...',
    'pickup.preferred_date': 'Preferred Date',
    'pickup.preferred_time': 'Preferred Time (Optional)',
    'pickup.estimated_weight': 'Estimated Weight (kg)',
    'pickup.weight_placeholder': 'e.g., 5.5',
    'pickup.waste_types': 'Waste Types',
    'pickup.special_instructions': 'Special Instructions (Optional)',
    'pickup.instructions_placeholder': 'Any special instructions for the pickup...',
    'pickup.estimated_reward': 'Estimated Reward',
    'pickup.points_estimate': 'Based on estimated weight and waste types',
    'pickup.submitting': 'Submitting...',
    'pickup.submit_request': 'Submit Pickup Request',
    'pickup.success': 'Pickup request submitted successfully!',
    'pickup.error_waste_type': 'Please select at least one waste type.',

    // Waste Types
    'waste.organic': 'Organic',
    'waste.plastic': 'Plastic',
    'waste.paper': 'Paper',
    'waste.metal': 'Metal',
    'waste.glass': 'Glass',
    'waste.electronic': 'Electronic',
    'waste.mixed': 'Mixed',

    // Home Page
    'home.hero.title': 'RE-GEN TECH',
    'home.hero.subtitle': 'Smart Sustainable Waste Management',
    'home.hero.description': 'Transform waste management through intelligent technology, community collaboration, and environmental responsibility for a sustainable future.',
    'home.hero.get_started': 'Get Started',
    'home.hero.open_dashboard': 'Open Dashboard',
    'home.hero.view_rewards': 'View Rewards',
    'home.stats.waste_processed': 'Waste Processed',
    'home.stats.energy_generated': 'Renewable Energy Generated',
    'home.stats.co2_prevented': 'CO₂ Emissions Prevented',
    'home.stats.products_sold': 'Upcycled Products Sold',
    'home.services.cities.title': 'Waste Processing for Cities',
    'home.services.cities.description': 'Smart waste management solutions with AI-powered sorting and automated processing facilities for urban areas.',
    'home.services.energy.title': 'Renewable Energy from Waste',
    'home.services.energy.description': 'Converting organic waste into biogas and other renewable energy sources through advanced anaerobic digestion.',
    'home.services.marketplace.title': 'Sustainable Materials Marketplace',
    'home.services.marketplace.description': 'Connect businesses with recycled and upcycled materials, creating a circular economy ecosystem.',

    // User Dashboard Additional
    'user_dashboard.your_achievements': 'Your Achievements',
    'user_dashboard.recent_updates': 'Recent Updates',
    'user_dashboard.stay_informed': 'Stay informed about your activities',
    'user_dashboard.detailed_analytics': 'Detailed Analytics',
    'user_dashboard.vs_last_month': 'vs last month',
    'user_dashboard.unlocked': 'unlocked',
    'user_dashboard.of': 'of',

    // Common Actions & Labels
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.date': 'Date',
    'common.time': 'Time',
    'common.address': 'Address',
    'common.weight': 'Weight',
    'common.type': 'Type',
    'common.description': 'Description',
    'common.points': 'points',
    'common.kg': 'kg',
    'common.pts': 'pts',
  },
  id: {
    // App & Navigation
    'app.name': 'RE-GEN TECH',
    'nav.app_name': 'RE-GEN TECH',
    'nav.home': 'Beranda',
    'nav.dashboard': 'Dasbor',
    'nav.admin_panel': 'Panel Admin',
    'nav.request_pickup': 'Permintaan Pickup',
    'nav.pickup_history': 'Riwayat Pickup',
    'nav.cart_calculator': 'Kalkulator Keranjang',
    'nav.driver_hub': 'Hub Driver',
    'nav.driver': 'Pengemudi',
    'nav.rewards': 'Hadiah',
    'nav.sign_out': 'Keluar',

    // Auth & Login
    'auth.local_login': 'Login Lokal',
    'auth.sign_in': 'Masuk',
    'auth.sign_up': 'Daftar',
    'auth.username': 'Nama Pengguna',
    'auth.email': 'Email',
    'auth.password': 'Kata Sandi',
    'auth.full_name': 'Nama Lengkap',
    'auth.enter_username': 'Masukkan nama pengguna',
    'auth.enter_email': 'Masukkan email Anda',
    'auth.enter_password': 'Masukkan kata sandi',
    'auth.enter_full_name': 'Masukkan nama lengkap Anda',
    'auth.create_password': 'Buat kata sandi',
    'auth.logging_in': 'Sedang masuk...',
    'auth.signing_in': 'Sedang masuk...',
    'auth.creating_account': 'Membuat akun...',
    'auth.demo_credentials': 'Kredensial demo:',
    'auth.sustainable_platform': 'Platform manajemen sampah berkelanjutan',
    'auth.success_local': 'Berhasil login secara lokal!',
    'auth.success_signup': 'Akun berhasil dibuat! Silakan periksa email Anda untuk memverifikasi akun.',
    'auth.error': 'Kesalahan',
    'auth.success': 'Berhasil',

    // User Roles
    'role.user': 'Pengguna',
    'role.admin': 'Admin',
    'role.driver': 'Pengemudi',

    // Status
    'status.scheduled': 'Terjadwal',
    'status.in_progress': 'Sedang Berlangsung',
    'status.completed': 'Selesai',
    'status.cancelled': 'Dibatalkan',
    'status.active': 'Aktif',
    'status.inactive': 'Tidak Aktif',

    // Dashboard - General
    'dashboard.welcome_back': 'Selamat datang kembali',
    'dashboard.welcome_user': 'Selamat datang kembali, {{name}}!',
    'dashboard.subtitle': 'Kelola permintaan pickup sampah dan lacak dampak lingkungan Anda.',
    'dashboard.loading': 'Memuat dasbor...',
    'dashboard.refresh': 'Refresh',

    // User Dashboard
    'user_dashboard.welcome': 'Selamat datang kembali, {{name}}! 👋',
    'user_dashboard.subtitle': 'Berikut ringkasan dampak lingkungan Anda',
    'user_dashboard.environmental_impact': 'Ringkasan dampak lingkungan Anda',
    'user_dashboard.total_pickups': 'Total Pickup',
    'user_dashboard.points_earned': 'Poin yang Diperoleh',
    'user_dashboard.waste_collected': 'Sampah Terkumpul',
    'user_dashboard.co2_saved': 'CO₂ yang Disimpan',
    'user_dashboard.schedule_pickup': 'Jadwalkan Pickup Baru',
    'user_dashboard.view_history': 'Lihat Riwayat Pickup',
    'user_dashboard.redeem_rewards': 'Tukar Hadiah',
    'user_dashboard.next_pickup': 'Pickup Selanjutnya',
    'user_dashboard.recent_pickups': 'Pickup Terbaru',
    'user_dashboard.achievements': 'Pencapaian',

    // Admin Dashboard
    'admin.dashboard': 'Dasbor Admin',
    'admin.subtitle': 'Kelola pengguna dan pengaturan sistem',
    'admin.overview': 'Ringkasan',
    'admin.users': 'Pengguna',
    'admin.pickups': 'Pickup',
    'admin.analytics': 'Analitik',
    'admin.user_management': 'Manajemen Pengguna',
    'admin.manage_users': 'Kelola akun pengguna dan izin',
    'admin.system_health': 'Kesehatan Sistem',
    'admin.recent_alerts': 'Peringatan Terbaru',
    'admin.total_users': 'Total Pengguna',
    'admin.active_users': 'Pengguna Aktif',
    'admin.total_pickups': 'Total Pickup',
    'admin.active_pickups': 'Pickup Aktif',
    'admin.waste_collected': 'Sampah Terkumpul',
    'admin.monthly_growth': 'Pertumbuhan Bulanan',
    'admin.name': 'Nama',
    'admin.email': 'Email',
    'admin.role': 'Peran',
    'admin.status': 'Status',
    'admin.actions': 'Aksi',
    'admin.active': 'Aktif',
    'admin.inactive': 'Tidak Aktif',
    'admin.created': 'Dibuat',

    // Pickup Request
    'pickup.title': 'Permintaan Pickup',
    'pickup.subtitle': 'Jadwalkan pengumpulan sampah dan dapatkan poin hadiah!',
    'pickup.address': 'Alamat Pickup',
    'pickup.address_placeholder': 'Masukkan alamat pickup lengkap Anda...',
    'pickup.preferred_date': 'Tanggal Pilihan',
    'pickup.preferred_time': 'Waktu Pilihan (Opsional)',
    'pickup.estimated_weight': 'Perkiraan Berat (kg)',
    'pickup.weight_placeholder': 'contoh: 5,5',
    'pickup.waste_types': 'Jenis Sampah',
    'pickup.special_instructions': 'Instruksi Khusus (Opsional)',
    'pickup.instructions_placeholder': 'Instruksi khusus untuk pickup...',
    'pickup.estimated_reward': 'Perkiraan Hadiah',
    'pickup.points_estimate': 'Berdasarkan perkiraan berat dan jenis sampah',
    'pickup.submitting': 'Mengirim...',
    'pickup.submit_request': 'Kirim Permintaan Pickup',
    'pickup.success': 'Permintaan pickup berhasil dikirim!',
    'pickup.error_waste_type': 'Silakan pilih setidaknya satu jenis sampah.',

    // Waste Types
    'waste.organic': 'Organik',
    'waste.plastic': 'Plastik',
    'waste.paper': 'Kertas',
    'waste.metal': 'Logam',
    'waste.glass': 'Kaca',
    'waste.electronic': 'Elektronik',
    'waste.mixed': 'Campuran',

    // Home Page
    'home.hero.title': 'RE-GEN TECH',
    'home.hero.subtitle': 'Manajemen Sampah Berkelanjutan Cerdas',
    'home.hero.description': 'Transformasi manajemen sampah melalui teknologi cerdas, kolaborasi komunitas, dan tanggung jawab lingkungan untuk masa depan yang berkelanjutan.',
    'home.hero.get_started': 'Mulai Sekarang',
    'home.hero.open_dashboard': 'Buka Dasbor',
    'home.hero.view_rewards': 'Lihat Hadiah',
    'home.stats.waste_processed': 'Sampah Diproses',
    'home.stats.energy_generated': 'Energi Terbarukan Dihasilkan',
    'home.stats.co2_prevented': 'Emisi CO₂ Dicegah',
    'home.stats.products_sold': 'Produk Daur Ulang Terjual',
    'home.services.cities.title': 'Pengolahan Sampah untuk Kota',
    'home.services.cities.description': 'Solusi manajemen sampah cerdas dengan pemilahan bertenaga AI dan fasilitas pengolahan otomatis untuk wilayah perkotaan.',
    'home.services.energy.title': 'Energi Terbarukan dari Sampah',
    'home.services.energy.description': 'Mengubah sampah organik menjadi biogas dan sumber energi terbarukan lainnya melalui pencernaan anaerob canggih.',
    'home.services.marketplace.title': 'Pasar Material Berkelanjutan',
    'home.services.marketplace.description': 'Menghubungkan bisnis dengan material daur ulang dan upcycle, menciptakan ekosistem ekonomi sirkular.',

    // User Dashboard Additional
    'user_dashboard.your_achievements': 'Pencapaian Anda',
    'user_dashboard.recent_updates': 'Pembaruan Terkini',
    'user_dashboard.stay_informed': 'Tetap terinformasi tentang aktivitas Anda',
    'user_dashboard.detailed_analytics': 'Analitik Detail',
    'user_dashboard.vs_last_month': 'vs bulan lalu',
    'user_dashboard.unlocked': 'terbuka',
    'user_dashboard.of': 'dari',

    // Common Actions & Labels
    'common.loading': 'Memuat...',
    'common.save': 'Simpan',
    'common.cancel': 'Batal',
    'common.edit': 'Edit',
    'common.delete': 'Hapus',
    'common.view': 'Lihat',
    'common.search': 'Cari',
    'common.filter': 'Filter',
    'common.all': 'Semua',
    'common.date': 'Tanggal',
    'common.time': 'Waktu',
    'common.address': 'Alamat',
    'common.weight': 'Berat',
    'common.type': 'Tipe',
    'common.description': 'Deskripsi',
    'common.points': 'poin',
    'common.kg': 'kg',
    'common.pts': 'poin',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string, params?: Record<string, string>) => {
    let text = translations[language][key as keyof typeof translations['en']] || key;
    
    // Simple parameter replacement
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{{${param}}}`, value);
      });
    }
    
    return text;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};