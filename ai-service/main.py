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
                
        # Basic parsing logic (Placeholder for actual NLP models)
        skills_keywords = ["java", "python", "react", "spring boot", "docker", "kubernetes", "aws", "sql", "javascript", "typescript"]
        extracted_skills = []
        text_lower = text.lower()
        
        for skill in skills_keywords:
            if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
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
