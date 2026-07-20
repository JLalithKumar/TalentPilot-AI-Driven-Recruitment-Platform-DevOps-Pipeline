from fastapi import FastAPI, UploadFile, File
import uvicorn
import fitz
import re

app = FastAPI(
    title="TalentPilot AI Service",
    description="AI Microservice for Resume Parsing and Candidate Ranking",
    version="1.0.0"
)

@app.get("/")
def read_root():
    return {"message": "Welcome to TalentPilot AI Service API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    try:
        content = await file.read()
        
        # Extract text using PyMuPDF
        text = ""
        with fitz.open(stream=content, filetype="pdf") as doc:
            for page in doc:
                text += page.get_text()
                
        # Basic parsing logic with expanded keyword dictionary for accurate matches
        skills_keywords = [
            "java", "spring boot", "springboot", "spring", "node.js", "nodejs", "express", "python", "django", "flask", "fastapi", "c++", "c#", ".net", "dotnet", "go", "golang", "ruby", "rails", "php", "laravel", "rust",
            "react", "angular", "vue", "javascript", "typescript", "html", "css", "bootstrap", "tailwind", "sass",
            "sql", "mysql", "postgresql", "postgres", "mongodb", "redis", "elasticsearch", "oracle",
            "docker", "kubernetes", "k8s", "aws", "gcp", "azure", "jenkins", "terraform", "ansible", "git", "github", "gitlab", "ci/cd", "cicd", "devops", "linux", "bash", "shell", "prometheus", "grafana", "nginx", "apache"
        ]
        extracted_skills = []
        text_lower = text.lower()
        
        for skill in skills_keywords:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if skill in ["c++", "c#", ".net"]:
                # Custom boundary matching for special char skills
                if skill in text_lower:
                    extracted_skills.append(skill)
            elif re.search(pattern, text_lower):
                extracted_skills.append(skill)
        return {
            "status": "success",
            "skills": ", ".join(extracted_skills),
            "experience": "Experience extraction pending model integration",
            "raw_text_length": len(text)
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
