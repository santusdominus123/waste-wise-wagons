import { Bell, Calendar, Gift, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Notification {
  id: number;
  type: 'pickup' | 'reward' | 'education' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface NotificationCenterProps {
  className?: string;
}

const NotificationCenter = ({ className = '' }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'pickup',
      title: 'Pickup Reminder',
      message: 'Pickup dijadwalkan besok pukul 14:00 di alamat Anda',
      time: '2 jam lalu',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'reward',
      title: 'New Reward Available',
      message: 'Reward baru tersedia: Eco Tumbler untuk 150 poin!',
      time: '1 hari lalu',
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'education',
      title: 'Tips Lingkungan',
      message: 'Tips: Pisahkan sampah organik dan anorganik untuk hasil terbaik',
      time: '2 hari lalu',
      read: true,
      priority: 'low'
    },
    {
      id: 4,
      type: 'system',
      title: 'Pickup Completed',
      message: 'Pickup tanggal 15 Jan berhasil! Anda mendapat 32 poin',
      time: '3 hari lalu',
      read: true,
      priority: 'medium'
    }
  ]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'pickup':
        return <Calendar className="h-4 w-4 text-cyan-300" />;
      case 'reward':
        return <Gift className="h-4 w-4 text-purple-300" />;
      case 'education':
        return <BookOpen className="h-4 w-4 text-emerald-300" />;
      case 'system':
        return <CheckCircle className="h-4 w-4 text-white/70" />;
      default:
        return <Bell className="h-4 w-4 text-white/70" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 md:p-6 shadow-xl ${className}`}>
      <div className="mb-4 md:mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
              <Bell className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white">Notifikasi</h3>
          </div>
          {unreadCount > 0 && (
            <Badge className="ml-2 bg-red-500/30 text-red-200 border-red-400/30">
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>
      <div>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-white/70">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Belum ada notifikasi</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/20 ${
                  !notification.read ? 'opacity-100' : 'opacity-75'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        !notification.read ? 'text-white' : 'text-white/80'
                      }`}>
                        {notification.title}
                      </p>
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        )}
                        <Clock className="h-3 w-3 text-white/60" />
                      </div>
                    </div>
                    <p className="text-sm text-white/70 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {notifications.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <Button 
              className="
                w-full 
                bg-white/10 backdrop-blur-sm
                border border-white/30
                rounded-xl
                text-white hover:text-white
                hover:bg-white/20
                transition-all duration-300
              "
              variant="ghost" 
              size="sm"
              onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))}
            >
              Tandai semua sudah dibaca
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;