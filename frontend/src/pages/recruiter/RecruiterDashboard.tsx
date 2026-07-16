import React, { useState } from 'react';
import { useGetJobsQuery, useCreateJobMutation, useGetApplicationsForJobQuery, useUpdateApplicationStatusMutation } from '../../store/api/apiSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Briefcase, Plus, Users } from 'lucide-react';

export const RecruiterDashboard = () => {
  const { data: jobs, isLoading: isJobsLoading } = useGetJobsQuery();
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const [showNewJobForm, setShowNewJobForm] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', description: '', requirements: '', location: '' });

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJob(newJob).unwrap();
      setShowNewJobForm(false);
      setNewJob({ title: '', description: '', requirements: '', location: '' });
      alert('Job created successfully!');
    } catch (err) {
      alert('Failed to create job.');
    }
  };

  return (
    <div className="flex-grow bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center glass-panel p-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Recruiter Dashboard</h1>
            <p className="text-gray-400">Manage your job postings and applicants.</p>
          </div>
          <Button onClick={() => setShowNewJobForm(!showNewJobForm)}>
            <Plus className="h-5 w-5 mr-2" /> Post New Job
          </Button>
        </div>

        {showNewJobForm && (
          <div className="glass-panel p-6 animate-slide-up border-primary/30">
            <h2 className="text-xl font-bold text-white mb-4">Post a New Job</h2>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input id="title" label="Job Title" required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} placeholder="e.g. Senior Frontend Engineer" />
                <Input id="location" label="Location" required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} placeholder="e.g. Remote, San Francisco" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea 
                  required
                  className="bg-surfaceLight border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-full h-24 transition-all duration-200"
                  value={newJob.description}
                  onChange={e => setNewJob({...newJob, description: e.target.value})}
                ></textarea>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Requirements (comma separated)</label>
                <input 
                  type="text"
                  required
                  className="bg-surfaceLight border border-gray-700 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-full transition-all duration-200"
                  value={newJob.requirements}
                  onChange={e => setNewJob({...newJob, requirements: e.target.value})}
                  placeholder="e.g. React, TypeScript, 5+ years experience"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="ghost" onClick={() => setShowNewJobForm(false)}>Cancel</Button>
                <Button type="submit" isLoading={isCreating}>Post Job</Button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Jobs List */}
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
              </div>
            )}
          </div>

          {/* Kanban Board */}
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

  return (
    <div className="glass-panel p-6 flex-grow overflow-hidden">
      <h2 className="text-xl font-bold text-white mb-6">Applicant Tracking Pipeline</h2>
      
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {statuses.map(status => (
          <div key={status} className="bg-surfaceLight rounded-xl p-4 min-w-[280px] border border-white/5">
            <h3 className="font-bold text-sm text-gray-300 mb-4 tracking-wider">{status}</h3>
            <div className="space-y-3">
              {applications?.filter((app: any) => app.status === status).map((app: any) => (
                <div key={app.id} className="bg-surface rounded-lg p-4 border border-gray-700 hover:border-primary/50 transition-colors shadow-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white truncate max-w-[150px]">{app.candidateProfile?.user?.firstName || 'Candidate'} {app.candidateProfile?.user?.lastName || ''}</h4>
                    <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded">
                      {Math.round(app.matchScore || 0)}% Match
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-4">
                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
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
              ))}
              
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
