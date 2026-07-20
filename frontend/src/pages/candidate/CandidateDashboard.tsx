import React, { useState } from 'react';
import { useGetJobsQuery, useUploadResumeMutation, useGetMyApplicationsQuery, useApplyForJobMutation, useGetProfileQuery } from '../../store/api/apiSlice';
import { Button } from '../../components/ui/Button';
import { Search, Briefcase, CheckCircle, UploadCloud, AlertCircle, Sparkles, FileText, Check, X } from 'lucide-react';

export const CandidateDashboard = () => {
  const { data: jobs, isLoading: isJobsLoading } = useGetJobsQuery();
  const { data: applications } = useGetMyApplicationsQuery();
  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();
  const [uploadResume, { isLoading: isUploading }] = useUploadResumeMutation();
  const [applyForJob, { isLoading: isApplying }] = useApplyForJobMutation();
  
  const [file, setFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state for apply-on-the-fly
  const [applyingJob, setApplyingJob] = useState<any>(null);
  const [applyFile, setApplyFile] = useState<File | null>(null);

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

  const handleApplyWithUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyFile || !applyingJob) return;
    const formData = new FormData();
    formData.append('file', applyFile);
    try {
      // 1. Upload & parse
      await uploadResume(formData).unwrap();
      // 2. Apply
      await applyForJob(applyingJob.id).unwrap();
      alert(`Resume uploaded and successfully applied for ${applyingJob.title}!`);
      setApplyingJob(null);
      setApplyFile(null);
    } catch (err) {
      alert('Failed to upload resume and apply.');
    }
  };

  const appliedJobIds = new Set(applications?.map((app: any) => app.jobId));
  const hasResume = !!profile?.resumeUrl;

  const filteredJobs = jobs?.filter((job: any) => {
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      (job.requirements && job.requirements.toLowerCase().includes(query)) ||
      (job.companyName && job.companyName.toLowerCase().includes(query))
    );
  });

  const getMatchColor = (score: number) => {
    if (score >= 70) return 'text-green-400 bg-green-400/10 border-green-500/30';
    if (score >= 40) return 'text-yellow-400 bg-yellow-400/10 border-yellow-500/30';
    return 'text-red-400 bg-red-400/10 border-red-500/30';
  };

  return (
    <div className="flex-grow bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Warning Banner if No Resume */}
        {!isProfileLoading && !hasResume && (
          <div className="glass-panel p-4 border-yellow-500/30 bg-yellow-500/5 flex items-start gap-3 animate-pulse">
            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-yellow-500 font-bold text-sm">Resume Profile Incomplete</h4>
              <p className="text-gray-400 text-xs mt-0.5">Please upload your resume to enable accurate AI skill matching, see matching scores, and simplify your application process.</p>
            </div>
          </div>
        )}

        {/* Header & Resume Upload */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-panel p-8">
            <h1 className="text-3xl font-bold text-white mb-2">Candidate Dashboard</h1>
            <p className="text-gray-400 mb-6 font-medium">Find roles tailored to your skills using our AI matching engine.</p>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Search jobs by title, company, or skill..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-surfaceLight border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary transition-colors placeholder:text-gray-500"
              />
            </div>
          </div>
          
          <div className="glass-panel p-8 flex flex-col justify-center items-center text-center border-primary/20">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Resume Profile</h2>
            
            {hasResume ? (
              <div className="w-full space-y-3">
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg p-2 flex items-center justify-center gap-2 text-xs font-semibold">
                  <Check className="h-4 w-4" /> Resume Uploaded & Active
                </div>
                
                {/* Parsed Profile Info Preview */}
                <div className="text-left bg-surfaceLight border border-gray-700 rounded-lg p-3 max-h-28 overflow-y-auto text-xs space-y-2">
                  <div>
                    <span className="text-gray-500 font-bold uppercase tracking-wider block mb-0.5">Parsed Skills</span>
                    <span className="text-gray-300">{profile.parsedSkills || "No parsed skills found."}</span>
                  </div>
                </div>

                <div className="w-full">
                  <input type="file" id="resume-update" className="hidden" accept=".pdf" onChange={handleFileChange} />
                  <label htmlFor="resume-update" className="btn-outline w-full cursor-pointer mb-2 block text-center py-2 text-xs font-semibold">
                    {file ? file.name : "Replace PDF"}
                  </label>
                  {file && (
                    <Button onClick={handleUpload} isLoading={isUploading} className="w-full text-xs">
                      Update Resume
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full">
                <p className="text-sm text-gray-400 mb-4">Upload your resume (PDF) to improve AI matching.</p>
                <input type="file" id="resume" className="hidden" accept=".pdf" onChange={handleFileChange} />
                <label htmlFor="resume" className="btn-outline w-full cursor-pointer mb-2 block text-center py-2 text-xs font-semibold">
                  {file ? file.name : "Choose PDF"}
                </label>
                {file && (
                  <Button onClick={handleUpload} isLoading={isUploading} className="w-full text-xs">
                    Upload & Parse
                  </Button>
                )}
              </div>
            )}
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
              {filteredJobs?.map((job: any) => {
                const isMatchAvailable = hasResume && job.matchScore !== undefined && job.matchScore !== null;
                const matchScore = isMatchAvailable ? Math.round(job.matchScore) : 0;
                
                return (
                  <div key={job.id} className="glass-panel p-6 flex flex-col transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(79,70,229,0.15)]">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white leading-snug">{job.title}</h3>
                        <p className="text-sm text-accent font-semibold">{job.companyName || 'Unknown Company'}</p>
                        <p className="text-xs text-gray-400">{job.location}</p>
                      </div>
                      
                      {/* Dynamic Match Score Badge */}
                      {isMatchAvailable ? (
                        <div className={`border text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${getMatchColor(matchScore)}`}>
                          <Sparkles className="h-3 w-3" /> {matchScore}% Match
                        </div>
                      ) : (
                        <div className="bg-gray-500/10 border border-gray-500/30 text-gray-400 text-xs font-bold px-2 py-1 rounded-full">
                          No Match Score
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-300 text-sm my-4 line-clamp-3 flex-grow">
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
                    ) : hasResume ? (
                      <Button onClick={() => handleApply(job.id)} className="w-full shadow-lg shadow-primary/20">
                        Apply Now
                      </Button>
                    ) : (
                      <Button onClick={() => setApplyingJob(job)} variant="outline" className="w-full text-primary border-primary/30 hover:bg-primary/10">
                        Upload Resume to Apply
                      </Button>
                    )}
                  </div>
                );
              })}
              {!filteredJobs?.length && (
                <div className="col-span-full text-center py-12 text-gray-500 italic">No job postings found matching your query.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Apply-on-the-fly Uploader Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-6 border-primary/30 animate-slide-up relative">
            <button 
              onClick={() => { setApplyingJob(null); setApplyFile(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold text-white">Apply to {applyingJob.title}</h3>
            </div>
            
            <p className="text-sm text-gray-400 mb-6">
              You're applying at <span className="text-accent font-semibold">{applyingJob.companyName}</span>. Please upload your latest resume (PDF) to build your profile, calculate your match score, and complete the application.
            </p>

            <form onSubmit={handleApplyWithUpload} className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 hover:border-primary/50 rounded-xl p-6 transition-colors">
                <input 
                  type="file" 
                  id="apply-resume" 
                  className="hidden" 
                  accept=".pdf" 
                  required
                  onChange={e => e.target.files && setApplyFile(e.target.files[0])} 
                />
                <label htmlFor="apply-resume" className="cursor-pointer flex flex-col items-center text-center">
                  <UploadCloud className="h-8 w-8 text-primary mb-2" />
                  <span className="text-sm text-white font-medium">
                    {applyFile ? applyFile.name : "Select Resume PDF"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">Only PDF format accepted</span>
                </label>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <Button type="button" variant="ghost" onClick={() => { setApplyingJob(null); setApplyFile(null); }}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isUploading || isApplying} disabled={!applyFile}>
                  Upload & Apply
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
