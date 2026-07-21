import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetJobsQuery, useCreateJobMutation, useGetApplicationsForJobQuery, useUpdateApplicationStatusMutation } from '../../store/api/apiSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Briefcase, Plus, Users, Building2, Globe, Pencil, Check, X } from 'lucide-react';
import { RootState } from '../../store';

const useCompany = (token: string | null) => {
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!token) return;
    fetch(`/api/v1/company/my`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { setCompany(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const updateCompany = async (data: any) => {
    const res = await fetch(`/api/v1/company/my`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      const result = await res.json();
      setCompany((prev: any) => ({ ...prev, ...result, name: data.name || prev?.name, description: data.description, website: data.website }));
    }
    return res.ok;
  };

  return { company, loading, updateCompany, setCompany };
};

export const RecruiterDashboard = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const { data: jobs, isLoading: isJobsLoading } = useGetJobsQuery();
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [showNewJobForm, setShowNewJobForm] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', description: '', requirements: '', location: '' });

  const { company, loading: companyLoading, updateCompany } = useCompany(token);
  const [editingCompany, setEditingCompany] = useState(false);
  const [companyDraft, setCompanyDraft] = useState({ name: '', description: '', website: '' });

  const startEdit = () => {
    setCompanyDraft({ name: company?.name || '', description: company?.description || '', website: company?.website || '' });
    setEditingCompany(true);
  };

  const saveCompany = async () => {
    await updateCompany(companyDraft);
    setEditingCompany(false);
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJob(newJob).unwrap();
      setShowNewJobForm(false);
      setNewJob({ title: '', description: '', requirements: '', location: '' });
    } catch (err) {
      alert('Failed to create job.');
    }
  };

  return (
    <div className="flex-grow bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center glass-panel p-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Recruiter Dashboard</h1>
            <p className="text-gray-400">Manage your job postings and applicants.</p>
          </div>
          <Button onClick={() => setShowNewJobForm(!showNewJobForm)}>
            <Plus className="h-5 w-5 mr-2" /> Post New Job
          </Button>
        </div>

        {/* Company Info Panel */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-accent" /> Company Profile
            </h2>
            {!editingCompany && (
              <button onClick={startEdit} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
                <Pencil className="h-4 w-4" /> Edit
              </button>
            )}
          </div>

          {companyLoading ? (
            <p className="text-gray-400 text-sm">Loading company info...</p>
          ) : editingCompany ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input id="co-name" label="Company Name" value={companyDraft.name} onChange={e => setCompanyDraft({ ...companyDraft, name: e.target.value })} />
                <Input id="co-website" label="Website" value={companyDraft.website} onChange={e => setCompanyDraft({ ...companyDraft, website: e.target.value })} placeholder="https://company.com" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">About the Company</label>
                <textarea
                  className="bg-surfaceLight border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-full h-20 transition-all duration-200"
                  value={companyDraft.description}
                  onChange={e => setCompanyDraft({ ...companyDraft, description: e.target.value })}
                  placeholder="Describe your company..."
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveCompany} className="flex items-center gap-1"><Check className="h-4 w-4" /> Save</Button>
                <Button variant="ghost" onClick={() => setEditingCompany(false)} className="flex items-center gap-1"><X className="h-4 w-4" /> Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Company Name</p>
                <p className="text-white font-semibold">{company?.name || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Website</p>
                {company?.website ? (
                  <a href={company.website} target="_blank" rel="noreferrer" className="text-accent hover:underline flex items-center gap-1">
                    <Globe className="h-3 w-3" />{company.website}
                  </a>
                ) : (
                  <p className="text-gray-400 text-sm italic">Not set — click Edit to add</p>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">About</p>
                <p className="text-gray-300 text-sm">{company?.description || <span className="text-gray-500 italic">No description yet.</span>}</p>
              </div>
            </div>
          )}
        </div>

        {/* New Job Form */}
        {showNewJobForm && (
          <div className="glass-panel p-6 animate-slide-up border-primary/30">
            <h2 className="text-xl font-bold text-white mb-4">Post a New Job</h2>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input id="title" label="Job Title" required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} placeholder="e.g. Senior Frontend Engineer" />
                <Input id="location" label="Location" required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} placeholder="e.g. Remote, Chennai" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea
                  required
                  className="bg-surfaceLight border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-full h-24 transition-all duration-200"
                  value={newJob.description}
                  onChange={e => setNewJob({...newJob, description: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Requirements (comma separated)</label>
                <input
                  type="text"
                  required
                  className="bg-surfaceLight border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-full transition-all duration-200"
                  value={newJob.requirements}
                  onChange={e => setNewJob({...newJob, requirements: e.target.value})}
                  placeholder="e.g. React, TypeScript, 5+ years"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="ghost" onClick={() => setShowNewJobForm(false)}>Cancel</Button>
                <Button type="submit" isLoading={isCreating}>Post Job</Button>
              </div>
            </form>
          </div>
        )}

        {/* Jobs + Kanban */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="glass-panel p-6 lg:col-span-1 h-fit">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-accent" /> Your Active Jobs
            </h2>
            {isJobsLoading ? (
              <p className="text-gray-400">Loading jobs...</p>
            ) : (
              <div className="space-y-4">
                {jobs?.map((job: any) => (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all border ${selectedJobId === job.id ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(79,70,229,0.2)]' : 'bg-surfaceLight border-gray-700 hover:border-gray-500'}`}
                  >
                    <h3 className="font-bold text-white text-lg">{job.title}</h3>
                    <p className="text-sm text-gray-400">{job.location}</p>
                  </div>
                ))}
                {!jobs?.length && <p className="text-gray-500 text-sm italic">No jobs posted yet.</p>}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {selectedJobId ? (
              <JobApplicantBoard jobId={selectedJobId} />
            ) : (
              <div className="glass-panel p-12 flex flex-col items-center justify-center text-center text-gray-400 h-full min-h-[400px]">
                <Users className="h-12 w-12 mb-4 opacity-50" />
                <p>Select a job from the list to view its applicants.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

const JobApplicantBoard = ({ jobId }: { jobId: number }) => {
  const { data: applications, isLoading } = useGetApplicationsForJobQuery(jobId);
  const [updateStatus] = useUpdateApplicationStatusMutation();

  if (isLoading) return <div className="glass-panel p-6 text-center text-gray-400 min-h-[400px] flex items-center justify-center">Loading applicants...</div>;

  const statuses = ['APPLIED', 'REVIEWING', 'SHORTLISTED', 'REJECTED'];

  const handleStatusChange = async (appId: number, status: string) => {
    try {
      await updateStatus({ id: appId, status }).unwrap();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Recently';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'Recently' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getMatchColor = (score: number) => {
    if (score >= 70) return 'text-green-400 bg-green-400/10';
    if (score >= 40) return 'text-yellow-400 bg-yellow-400/10';
    return 'text-red-400 bg-red-400/10';
  };

  return (
    <div className="glass-panel p-6 flex-grow overflow-hidden">
      <h2 className="text-xl font-bold text-white mb-6">Applicant Tracking Pipeline</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {statuses.map(status => (
          <div key={status} className="bg-surfaceLight rounded-xl p-4 min-w-[280px] border border-white/5">
            <h3 className="font-bold text-sm text-gray-300 mb-4 tracking-wider">{status}</h3>
            <div className="space-y-3">
              {applications?.filter((app: any) => app.status === status).map((app: any) => {
                const score = Math.round(app.matchScore || 0);
                const name = [app.candidateFirstName, app.candidateLastName].filter(Boolean).join(' ') || 'Candidate';
                return (
                  <div key={app.id} className="bg-surface rounded-lg p-4 border border-gray-700 hover:border-primary/50 transition-colors shadow-lg">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-white truncate max-w-[150px]">{name}</h4>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${getMatchColor(score)}`}>
                        {score}% Match
                      </span>
                    </div>
                    {app.candidateEmail && (
                      <p className="text-xs text-gray-500 mb-1 truncate">{app.candidateEmail}</p>
                    )}
                    <div className="text-xs text-gray-400 mb-3">
                      Applied: {formatDate(app.appliedAt)}
                    </div>
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="w-full bg-background border border-gray-700 text-gray-300 text-xs rounded px-2 py-1.5 focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
              {!applications?.some((app: any) => app.status === status) && (
                <div className="text-center p-4 border border-dashed border-gray-700 rounded-lg text-sm text-gray-500">
                  No candidates
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
