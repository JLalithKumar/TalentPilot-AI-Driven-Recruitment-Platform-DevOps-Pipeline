import React, { useState } from 'react';
import { useGetJobsQuery, useUploadResumeMutation, useGetMyApplicationsQuery, useApplyForJobMutation } from '../../store/api/apiSlice';
import { Button } from '../../components/ui/Button';
import { Search, Briefcase, CheckCircle, UploadCloud } from 'lucide-react';

export const CandidateDashboard = () => {
  const { data: jobs, isLoading: isJobsLoading } = useGetJobsQuery();
  const { data: applications } = useGetMyApplicationsQuery();
  const [uploadResume, { isLoading: isUploading }] = useUploadResumeMutation();
  const [applyForJob] = useApplyForJobMutation();
  
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await uploadResume(formData).unwrap();
      alert('Resume uploaded and parsed successfully!');
      setFile(null);
    } catch (err) {
      alert('Failed to upload resume.');
    }
  };

  const handleApply = async (jobId: number) => {
    try {
      await applyForJob(jobId).unwrap();
      alert('Successfully applied!');
    } catch (err) {
      alert('Failed to apply.');
    }
  };

  const appliedJobIds = new Set(applications?.map((app: any) => app.jobId));

  return (
    <div className="flex-grow bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Resume Upload */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-panel p-8">
            <h1 className="text-3xl font-bold text-white mb-2">Candidate Dashboard</h1>
            <p className="text-gray-400 mb-6">Find roles tailored to your skills using our AI matching engine.</p>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Search jobs by title or skill..." 
                className="w-full bg-surfaceLight border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          
          <div className="glass-panel p-8 flex flex-col justify-center items-center text-center border-primary/20">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Update Profile</h2>
            <p className="text-sm text-gray-400 mb-4">Upload your latest resume (PDF) to improve AI matching.</p>
            
            <div className="w-full">
              <input type="file" id="resume" className="hidden" accept=".pdf" onChange={handleFileChange} />
              <label htmlFor="resume" className="btn-outline w-full cursor-pointer mb-2 block text-center">
                {file ? file.name : "Choose PDF"}
              </label>
              {file && (
                <Button onClick={handleUpload} isLoading={isUploading} className="w-full text-sm">
                  Upload & Parse
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-accent" /> Recommended For You
          </h2>
          
          {isJobsLoading ? (
            <div className="text-center py-12 text-gray-400">Loading jobs...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs?.map((job: any) => (
                <div key={job.id} className="glass-panel p-6 flex flex-col transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(79,70,229,0.15)]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{job.title}</h3>
                      <p className="text-sm text-gray-400">{job.location}</p>
                    </div>
                    {/* Simulated Match Score Badge */}
                    <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-2 py-1 rounded-full">
                      85% Match
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-6 line-clamp-3 flex-grow">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.requirements?.split(',').slice(0,3).map((req: string, i: number) => (
                      <span key={i} className="text-xs bg-surfaceLight border border-gray-700 text-gray-300 px-2 py-1 rounded">
                        {req.trim()}
                      </span>
                    ))}
                  </div>
                  
                  {appliedJobIds.has(job.id) ? (
                    <Button variant="outline" disabled className="w-full text-green-400 border-green-500/30">
                      <CheckCircle className="h-4 w-4 mr-2" /> Applied
                    </Button>
                  ) : (
                    <Button onClick={() => handleApply(job.id)} className="w-full shadow-lg shadow-primary/20">
                      Apply Now
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
