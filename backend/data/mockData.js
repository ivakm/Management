const mockData = {
  users: [
    {
      id: 1,
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=667eea&color=fff'
    },
    {
      id: 2,
      email: 'user@example.com',
      password: 'user123',
      name: 'Regular User',
      role: 'user',
      avatar: 'https://ui-avatars.com/api/?name=Regular+User&background=764ba2&color=fff'
    }
  ],

  customers: [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      company: 'Tech Solutions Inc.',
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=667eea&color=fff',
      joinDate: '2024-01-15',
      lastActivity: '2024-03-10T14:30:00Z',
      totalSpent: 12500.00
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@innovate.io',
      phone: '+1 (555) 234-5678',
      company: 'Innovate Labs',
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=764ba2&color=fff',
      joinDate: '2024-02-20',
      lastActivity: '2024-03-12T09:15:00Z',
      totalSpent: 8750.00
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'mchen@globaltech.com',
      phone: '+1 (555) 345-6789',
      company: 'Global Tech Corp',
      status: 'inactive',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=f093fb&color=fff',
      joinDate: '2023-11-05',
      lastActivity: '2024-02-28T16:45:00Z',
      totalSpent: 34200.00
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.d@startup.co',
      phone: '+1 (555) 456-7890',
      company: 'StartUp Ventures',
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=4facfe&color=fff',
      joinDate: '2024-03-01',
      lastActivity: '2024-03-11T11:00:00Z',
      totalSpent: 4500.00
    },
    {
      id: 5,
      name: 'Robert Wilson',
      email: 'rwilson@enterprise.net',
      phone: '+1 (555) 567-8901',
      company: 'Enterprise Systems',
      status: 'pending',
      avatar: 'https://ui-avatars.com/api/?name=Robert+Wilson&background=fa709a&color=fff',
      joinDate: '2024-03-05',
      lastActivity: '2024-03-08T10:20:00Z',
      totalSpent: 2200.00
    },
    {
      id: 6,
      name: 'Lisa Anderson',
      email: 'lisa@digitalagency.com',
      phone: '+1 (555) 678-9012',
      company: 'Digital Agency Pro',
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=a8edea&color=000',
      joinDate: '2023-09-12',
      lastActivity: '2024-03-12T08:30:00Z',
      totalSpent: 56800.00
    },
    {
      id: 7,
      name: 'David Martinez',
      email: 'david.m@cloudservices.io',
      phone: '+1 (555) 789-0123',
      company: 'Cloud Services LLC',
      status: 'active',
      avatar: 'https://ui-avatars.com/api/?name=David+Martinez&background=fed6e3&color=000',
      joinDate: '2024-01-28',
      lastActivity: '2024-03-10T15:45:00Z',
      totalSpent: 18900.00
    },
    {
      id: 8,
      name: 'Jennifer Brown',
      email: 'jbrown@mediagroup.com',
      phone: '+1 (555) 890-1234',
      company: 'Media Group Intl',
      status: 'inactive',
      avatar: 'https://ui-avatars.com/api/?name=Jennifer+Brown&background=d299c2&color=fff',
      joinDate: '2023-07-20',
      lastActivity: '2024-01-15T12:00:00Z',
      totalSpent: 78500.00
    }
  ],

  dashboardStats: {
    totalRevenue: 216350.00,
    newCustomers: 24,
    activeUsers: 156,
    conversionRate: 12.5,
    monthlyRevenue: [
      { month: 'Jan', revenue: 32000 },
      { month: 'Feb', revenue: 38000 },
      { month: 'Mar', revenue: 45000 },
      { month: 'Apr', revenue: 41000 },
      { month: 'May', revenue: 48500 },
      { month: 'Jun', revenue: 52500 }
    ],
    customerDistribution: [
      { status: 'Active', count: 5, color: '#667eea' },
      { status: 'Inactive', count: 2, color: '#f093fb' },
      { status: 'Pending', count: 1, color: '#4facfe' }
    ],
    recentActivity: [
      { id: 1, type: 'purchase', customer: 'John Smith', amount: 1500, date: '2024-03-12T10:30:00Z' },
      { id: 2, type: 'signup', customer: 'Emily Davis', amount: null, date: '2024-03-11T14:15:00Z' },
      { id: 3, type: 'purchase', customer: 'Lisa Anderson', amount: 3200, date: '2024-03-11T09:45:00Z' },
      { id: 4, type: 'update', customer: 'Sarah Johnson', amount: null, date: '2024-03-10T16:20:00Z' },
      { id: 5, type: 'purchase', customer: 'David Martinez', amount: 890, date: '2024-03-10T11:00:00Z' }
    ],
    topCustomers: [
      { name: 'Jennifer Brown', totalSpent: 78500, avatar: 'https://ui-avatars.com/api/?name=Jennifer+Brown&background=d299c2&color=fff' },
      { name: 'Lisa Anderson', totalSpent: 56800, avatar: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=a8edea&color=000' },
      { name: 'Michael Chen', totalSpent: 34200, avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=f093fb&color=fff' },
      { name: 'David Martinez', totalSpent: 18900, avatar: 'https://ui-avatars.com/api/?name=David+Martinez&background=fed6e3&color=000' },
      { name: 'John Smith', totalSpent: 12500, avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=667eea&color=fff' }
    ]
  }
};

module.exports = mockData;