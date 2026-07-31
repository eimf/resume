import { useState, useEffect } from 'react';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../store/api/apiSlice';

export function AdminProfile() {
  const { data: profile, isLoading } = useGetProfileQuery(undefined);
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const [form, setForm] = useState({
    name: '',
    headline: '',
    summary: '',
    location: '',
    email: '',
    website: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        headline: profile.headline || '',
        summary: profile.summary || '',
        location: profile.location || '',
        email: profile.email || '',
        website: profile.website || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile(form).unwrap();
      alert('Profile updated');
    } catch (err: any) {
      alert(`Failed: ${err?.data?.error || 'Unknown error'}`);
    }
  };

  if (isLoading) {
    return <div className="text-text-muted text-sm font-mono">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Profile</h1>

      <div className="glass-card p-6 max-w-xl space-y-4">
        {(['name', 'headline', 'location', 'email', 'website'] as const).map((field) => (
          <div key={field}>
            <label className="block text-xs font-mono text-text-muted mb-1.5 capitalize">
              {field}
            </label>
            <input
              type="text"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-text-primary text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
            />
          </div>
        ))}

        <div>
          <label className="block text-xs font-mono text-text-muted mb-1.5">Summary</label>
          <textarea
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 rounded-lg bg-surface border border-surface-border text-text-primary text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors resize-y"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 rounded-lg bg-accent text-surface text-sm font-medium hover:bg-accent-hover disabled:opacity-50 transition-colors"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
