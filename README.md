[README.md](https://github.com/user-attachments/files/24402788/README.md)
# Mark Corrigan - AI Experimentation & Monitoring Dashboard

A full-stack application showcasing AI Operations capabilities through experiment monitoring, cohort analysis, and AI-powered insights.

## Overview

Mark Corrigan demonstrates practical AI Operations implementation with:
- **Real-time experiment monitoring** across multiple use cases
- **Cohort performance comparison** (experiment vs control groups)
- **AI-powered analysis** using Claude API for automated insights
- **Smart recommendations** for follow-up experiments

## Tech Stack

### Backend
- **Flask** - Python web framework
- **Anthropic Claude API** - AI analysis and recommendations
- **Flask-CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI framework
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling

## Features

### 1. AI-Powered Support Chatbot Experiment
Tracks performance of automated support responses vs human-only support:
- Resolution time reduction: **50.6%** improvement
- Customer satisfaction: **7.0%** improvement  
- Cost per interaction: **79.3%** reduction
- Escalation rate monitoring

### 2. LLM-Enhanced Customer Matching
Monitors AI-driven customer record deduplication:
- Match accuracy: **20.5%** improvement
- False positive reduction: **75.0%** improvement
- Processing time: **33.3%** faster
- Manual review reduction: **57.1%** improvement

### 3. AI Analysis Integration
- **Automated insights** - Claude analyzes experiment results and highlights key findings
- **Statistical significance** assessment
- **Business impact** quantification
- **Risk identification** and recommendations
- **Next experiment suggestions** based on current results

## Project Structure

```
mark-corrigan/
├── backend/
│   ├── app.py              # Flask API with Claude integration
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── Dashboard.jsx   # Main dashboard component
│   │   ├── App.jsx         # App wrapper
│   │   ├── index.jsx       # Entry point
│   │   └── *.css           # Styles
│   ├── public/
│   │   └── index.html      # HTML template
│   └── package.json        # npm dependencies
└── README.md
```

## Setup & Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- Anthropic API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment:
```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

5. Run the server:
```bash
python app.py
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment (optional):
```bash
cp .env.example .env
# Default API URL is http://localhost:5000
```

4. Start development server:
```bash
npm start
```

Frontend runs on `http://localhost:3000`

## API Endpoints

### GET `/api/experiments`
Returns all experiments with their data.

### GET `/api/experiments/<experiment_id>`
Returns specific experiment details.

### POST `/api/analyze`
Analyzes experiment results using Claude AI.

**Request body:**
```json
{
  "experiment_id": "customer_support_chatbot"
}
```

### POST `/api/recommendations`
Gets AI-generated recommendations for follow-up experiments.

**Request body:**
```json
{
  "experiment_id": "llm_customer_identification"
}
```

### GET `/health`
Health check endpoint.

## Usage

1. **Start both servers** (backend on :5000, frontend on :3000)
2. **Select an experiment** from the dropdown
3. **Review metrics** in the chart and table
4. **Click "Analyze with AI"** to get Claude's insights on the results
5. **Click "Get Recommendations"** for suggested follow-up experiments

## Key Metrics Tracked

### Support Chatbot
- Average resolution time (minutes)
- Customer satisfaction score (1-5)
- Escalation rate (%)
- Cost per interaction ($)

### Customer Matching
- Match accuracy (0-1)
- False positive rate (%)
- Processing time (seconds)
- Manual review rate (%)

## Deployment Options

### Local Development
Covered in Setup section above.

### Production Deployment

#### Backend (Flask)
Deploy to:
- **Heroku** - `git push heroku main`
- **Railway** - Connect GitHub repo
- **Render** - Connect GitHub repo
- **AWS/GCP/Azure** - Use Docker or direct deployment

#### Frontend (React)
Deploy to:
- **Vercel** - `vercel deploy`
- **Netlify** - Connect GitHub repo
- **GitHub Pages** - `npm run build` + gh-pages
- **AWS S3 + CloudFront**

### Environment Variables for Production

**Backend:**
- `ANTHROPIC_API_KEY` - Your Anthropic API key
- `FLASK_ENV` - Set to `production`

**Frontend:**
- `REACT_APP_API_URL` - Your deployed backend URL

## Portfolio Highlights

This project demonstrates:

✅ **AI Operations expertise** - Practical implementation of AI monitoring  
✅ **Full-stack development** - React frontend + Flask backend  
✅ **API integration** - Anthropic Claude API for intelligent analysis  
✅ **Data visualization** - Clear presentation of experiment results  
✅ **Product thinking** - Metrics that matter for business decisions  
✅ **Technical implementation** - Clean, deployable code  

## Future Enhancements

- [ ] Add database for persistent experiment data
- [ ] Implement user authentication
- [ ] Add experiment creation UI
- [ ] Real-time data streaming for live experiments
- [ ] Export reports as PDF
- [ ] A/B test calculator for sample size determination
- [ ] Integration with analytics platforms (Mixpanel, Amplitude)

## Author

**Charlotte** - Senior Product Manager with AI Operations expertise

- E.ON Next: Led AI experimentation program
- Currencycloud/VISA: API integration at scale
- Deliveroo: Customer identification improvements
- Stanford ML Certificate

---

## License

This project is for portfolio demonstration purposes.
# mark-corrigan
