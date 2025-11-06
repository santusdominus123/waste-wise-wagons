// Sample data untuk testing analitik admin
export const initializeSampleData = () => {
  // Cek apakah sudah ada data
  const existingPickups = localStorage.getItem('local-pickup-requests');
  const existingPoints = localStorage.getItem('local-user-points');
  
  if (!existingPickups || JSON.parse(existingPickups).length === 0) {
    // Sample pickup requests data
    const samplePickups = [
      {
        id: 'pickup-1',
        user_id: 'local-user',
        scheduled_date: '2024-01-15',
        status: 'completed',
        estimated_weight: 3.2,
        actual_weight: 3.5,
        waste_types: ['plastic', 'paper'],
        points_earned: 35,
        created_at: '2024-01-12T10:00:00Z',
        address: 'Jl. Sudirman No. 123, Jakarta'
      },
      {
        id: 'pickup-2',
        user_id: 'local-user',
        scheduled_date: '2024-01-20',
        status: 'completed',
        estimated_weight: 5.1,
        actual_weight: 4.8,
        waste_types: ['organic', 'plastic'],
        points_earned: 48,
        created_at: '2024-01-18T14:30:00Z',
        address: 'Jl. Thamrin No. 456, Jakarta'
      },
      {
        id: 'pickup-3',
        user_id: 'local-admin',
        scheduled_date: '2024-01-25',
        status: 'completed',
        estimated_weight: 2.8,
        actual_weight: 3.1,
        waste_types: ['paper', 'cardboard'],
        points_earned: 31,
        created_at: '2024-01-22T09:15:00Z',
        address: 'Jl. MH Thamrin No. 789, Jakarta'
      },
      {
        id: 'pickup-4',
        user_id: 'local-driver',
        scheduled_date: '2024-02-01',
        status: 'in_progress',
        estimated_weight: 4.2,
        waste_types: ['metal', 'plastic'],
        points_earned: 0,
        created_at: '2024-01-28T16:20:00Z',
        address: 'Jl. Gatot Subroto No. 321, Jakarta'
      },
      {
        id: 'pickup-5',
        user_id: 'local-user',
        scheduled_date: '2024-02-05',
        status: 'scheduled',
        estimated_weight: 6.0,
        waste_types: ['organic', 'paper', 'plastic'],
        points_earned: 0,
        created_at: '2024-02-01T11:45:00Z',
        address: 'Jl. Rasuna Said No. 654, Jakarta'
      },
      {
        id: 'pickup-6',
        user_id: 'local-admin',
        scheduled_date: '2024-02-08',
        status: 'completed',
        estimated_weight: 3.7,
        actual_weight: 4.0,
        waste_types: ['glass', 'metal'],
        points_earned: 40,
        created_at: '2024-02-05T13:10:00Z',
        address: 'Jl. HR Rasuna Said No. 987, Jakarta'
      },
      {
        id: 'pickup-7',
        user_id: 'local-user',
        scheduled_date: '2024-02-12',
        status: 'completed',
        estimated_weight: 5.5,
        actual_weight: 5.2,
        waste_types: ['plastic', 'organic'],
        points_earned: 52,
        created_at: '2024-02-08T08:30:00Z',
        address: 'Jl. Kuningan No. 147, Jakarta'
      },
      {
        id: 'pickup-8',
        user_id: 'local-driver',
        scheduled_date: '2024-02-15',
        status: 'completed',
        estimated_weight: 2.9,
        actual_weight: 3.3,
        waste_types: ['paper', 'cardboard'],
        points_earned: 33,
        created_at: '2024-02-12T15:45:00Z',
        address: 'Jl. Senayan No. 258, Jakarta'
      },
      {
        id: 'pickup-9',
        user_id: 'local-user',
        scheduled_date: '2024-02-20',
        status: 'cancelled',
        estimated_weight: 4.1,
        waste_types: ['plastic'],
        points_earned: 0,
        created_at: '2024-02-17T12:15:00Z',
        address: 'Jl. Kemang No. 369, Jakarta'
      },
      {
        id: 'pickup-10',
        user_id: 'local-admin',
        scheduled_date: '2024-02-25',
        status: 'completed',
        estimated_weight: 7.2,
        actual_weight: 6.8,
        waste_types: ['organic', 'plastic', 'paper'],
        points_earned: 68,
        created_at: '2024-02-22T10:00:00Z',
        address: 'Jl. Pondok Indah No. 741, Jakarta'
      },
      {
        id: 'pickup-11',
        user_id: 'local-user',
        scheduled_date: '2024-03-01',
        status: 'completed',
        estimated_weight: 3.8,
        actual_weight: 4.1,
        waste_types: ['metal', 'glass'],
        points_earned: 41,
        created_at: '2024-02-26T14:20:00Z',
        address: 'Jl. Blok M No. 852, Jakarta'
      },
      {
        id: 'pickup-12',
        user_id: 'local-driver',
        scheduled_date: '2024-03-05',
        status: 'completed',
        estimated_weight: 5.8,
        actual_weight: 5.5,
        waste_types: ['plastic', 'organic', 'paper'],
        points_earned: 55,
        created_at: '2024-03-01T09:30:00Z',
        address: 'Jl. Fatmawati No. 963, Jakarta'
      }
    ];

    localStorage.setItem('local-pickup-requests', JSON.stringify(samplePickups));
  }

  if (!existingPoints || JSON.parse(existingPoints).length === 0) {
    // Sample user points data
    const samplePoints = [
      { id: 'points-1', user_id: 'local-user', points_earned: 35, source: 'pickup-1', created_at: '2024-01-15T12:00:00Z' },
      { id: 'points-2', user_id: 'local-user', points_earned: 48, source: 'pickup-2', created_at: '2024-01-20T16:00:00Z' },
      { id: 'points-3', user_id: 'local-admin', points_earned: 31, source: 'pickup-3', created_at: '2024-01-25T14:00:00Z' },
      { id: 'points-4', user_id: 'local-admin', points_earned: 40, source: 'pickup-6', created_at: '2024-02-08T17:00:00Z' },
      { id: 'points-5', user_id: 'local-user', points_earned: 52, source: 'pickup-7', created_at: '2024-02-12T12:00:00Z' },
      { id: 'points-6', user_id: 'local-driver', points_earned: 33, source: 'pickup-8', created_at: '2024-02-15T18:00:00Z' },
      { id: 'points-7', user_id: 'local-admin', points_earned: 68, source: 'pickup-10', created_at: '2024-02-25T15:00:00Z' },
      { id: 'points-8', user_id: 'local-user', points_earned: 41, source: 'pickup-11', created_at: '2024-03-01T16:30:00Z' },
      { id: 'points-9', user_id: 'local-driver', points_earned: 55, source: 'pickup-12', created_at: '2024-03-05T13:45:00Z' },
      // Bonus points untuk aktivitas lain
      { id: 'points-10', user_id: 'local-user', points_earned: 25, source: 'referral', created_at: '2024-01-10T10:00:00Z' },
      { id: 'points-11', user_id: 'local-admin', points_earned: 15, source: 'survey', created_at: '2024-01-28T11:30:00Z' },
      { id: 'points-12', user_id: 'local-driver', points_earned: 20, source: 'feedback', created_at: '2024-02-18T14:15:00Z' }
    ];

    localStorage.setItem('local-user-points', JSON.stringify(samplePoints));
  }

  // Initialize additional users for more realistic data
  const existingUsers = localStorage.getItem('local-users');
  if (!existingUsers || JSON.parse(existingUsers).length <= 3) {
    const additionalUsers = [
      {
        id: 'user-001',
        email: 'john.doe@email.com',
        fullName: 'John Doe',
        role: 'user',
        createdAt: '2024-01-05T08:00:00Z',
        isActive: true
      },
      {
        id: 'user-002',
        email: 'jane.smith@email.com',
        fullName: 'Jane Smith',
        role: 'user',
        createdAt: '2024-01-12T10:30:00Z',
        isActive: true
      },
      {
        id: 'driver-001',
        email: 'mike.wilson@email.com',
        fullName: 'Mike Wilson',
        role: 'driver',
        createdAt: '2024-01-18T14:15:00Z',
        isActive: true
      },
      {
        id: 'user-003',
        email: 'sarah.johnson@email.com',
        fullName: 'Sarah Johnson',
        role: 'user',
        createdAt: '2024-01-25T09:45:00Z',
        isActive: false
      },
      {
        id: 'user-004',
        email: 'david.brown@email.com',
        fullName: 'David Brown',
        role: 'user',
        createdAt: '2024-02-02T16:20:00Z',
        isActive: true
      }
    ];

    localStorage.setItem('local-users', JSON.stringify(additionalUsers));
  }
};

// Function to reset all data (untuk testing)
export const resetSampleData = () => {
  localStorage.removeItem('local-pickup-requests');
  localStorage.removeItem('local-user-points');
  localStorage.removeItem('local-users');
  initializeSampleData();
};