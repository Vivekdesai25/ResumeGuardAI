# ResumeGuardAI – AI Resume Screening Assistant

## Overview
ResumeGuardAI is an AI-based resume screening assistant developed to help job seekers improve resume quality and Applicant Tracking System (ATS) compatibility. The system analyzes resumes to detect common ATS issues, identify AI-generated content, and provide structured suggestions for improvement.

Modern recruitment processes rely heavily on automated screening tools. As a result, many qualified candidates face rejection due to formatting errors, missing keywords, or excessive AI-generated content. ResumeGuardAI addresses these challenges by offering an intelligent and automated resume evaluation solution.

---

## Objectives
- To analyze resumes for ATS compatibility
- To detect AI-generated or low-authenticity content
- To provide actionable suggestions for resume improvement
- To assist students and job seekers in creating professional resumes

---

## Key Features
- ATS compatibility analysis based on structure and keywords
- AI-generated content detection using NLP models
- Resume quality improvement suggestions
- Consistent performance across different resume formats
- Simple and user-friendly interface

---

## Technologies Used
- Programming Language: Python
- Machine Learning:
  - Natural Language Processing (NLP)
  - Transformer-based DistilBERT model for text analysis
- Libraries and Tools:
  - TensorFlow / PyTorch
  - NLP processing libraries
  - OpenCV (used during experimentation and testing)

---

## System Architecture
- Input: Resume text or document
- Processing:
  - Text preprocessing and normalization
  - ATS compatibility evaluation
  - AI-content detection
  - Suggestion generation
- Output: Analysis report with improvement recommendations

---

## Testing and Results
- The system successfully analyzed resume text in real time
- AI-generated content detection provided consistent confidence scores
- Resume feedback improved structure, readability, and ATS compliance
- The system remained stable under varying input sizes and formats

---

## Use Cases
- Students and fresh graduates applying for jobs
- Job seekers facing frequent resume rejections
- Recruiters for initial resume screening support
- Academic mini-project and learning demonstration

---
## Project Structure

ResumeGuardAI/
│
├──   models/            # Machine learning and NLP models
├──   dataset/           # Training and testing datasets
├──   scripts/           # Resume analysis and processing scripts
├──   app.py             # Main application file
├──   requirements.txt  # Project dependencies
└──   README.md          # Project documentation


---
### Installation and Execution 

1. Clone the repository:
   git clone https://github.com/vivekdesai25/ResumeGuardAI.git

2. Install Python dependencies:
   pip install -r requirements.txt

3. Install Node.js dependencies:
   npm install

4. Run the application:
   npm run dev

5. Provide resume text for analysis.


## Future Enhancements
- Support for PDF and DOCX resume parsing
- Job-role-based keyword optimization
- Web-based deployment
- Multi-language resume analysis

---

## Academic Context
This project was developed as a mini project as part of the Master of Computer Applications (MCA) program. It demonstrates the application of Artificial Intelligence and Natural Language Processing techniques in real-world recruitment systems.

---

## Declaration
This project is an original academic work developed for educational purposes. All models, datasets, and implementations are used ethically and solely for learning and research objectives.
