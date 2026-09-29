import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { AdminLogin } from '@/admin/AdminLogin';
import { AdminLayout, type AdminTab } from '@/admin/AdminLayout';
import { AdminOverview } from '@/admin/AdminOverview';
import { AdminProjects } from '@/admin/AdminProjects';
import { AdminServices } from '@/admin/AdminServices';
import { AdminContent } from '@/admin/AdminContent';
import { AdminMessages } from '@/admin/AdminMessages';
import { AdminMembers } from '@/admin/AdminMembers';

export function Admin() {
  const { session, loading } = useAuth();
  const [tab, setTab] = useState<AdminTab>('overview');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <AdminLogin />;

  return (
    <AdminLayout tab={tab} setTab={setTab}>
      {tab === 'overview' && <AdminOverview setTab={setTab} />}
      {tab === 'projects' && <AdminProjects />}
      {tab === 'services' && <AdminServices />}
      {tab === 'content' && <AdminContent />}
      {tab === 'messages' && <AdminMessages />}
      {tab === 'members' && <AdminMembers />}
    </AdminLayout>
  );
}
