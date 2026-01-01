from flask import Flask, request, jsonify
from flask_cors import CORS
import anthropic
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Initialize Anthropic client
client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY")
)

# Sample experiment data
EXPERIMENTS = {
    "customer_support_chatbot": {
        "name": "AI-Powered Support Chatbot",
        "description": "Testing automated responses vs. human-only support",
        "start_date": "2024-11-01",
        "experiment_group": {
            "size": 5000,
            "avg_resolution_time": 4.2,
            "satisfaction_score": 4.6,
            "escalation_rate": 0.12,
            "cost_per_interaction": 1.20
        },
        "control_group": {
            "size": 5000,
            "avg_resolution_time": 8.5,
            "satisfaction_score": 4.3,
            "escalation_rate": 0.08,
            "cost_per_interaction": 5.80
        },
        "metrics": ["avg_resolution_time", "satisfaction_score", "escalation_rate", "cost_per_interaction"]
    },
    "llm_customer_identification": {
        "name": "LLM-Enhanced Customer Matching",
        "description": "Using AI to improve customer record deduplication and matching",
        "start_date": "2024-10-15",
        "experiment_group": {
            "size": 10000,
            "match_accuracy": 0.94,
            "false_positive_rate": 0.03,
            "processing_time": 0.8,
            "manual_review_needed": 0.15
        },
        "control_group": {
            "size": 10000,
            "match_accuracy": 0.78,
            "false_positive_rate": 0.12,
            "processing_time": 1.2,
            "manual_review_needed": 0.35
        },
        "metrics": ["match_accuracy", "false_positive_rate", "processing_time", "manual_review_needed"]
    }
}

@app.route('/api/experiments', methods=['GET'])
def get_experiments():
    """Return all experiments"""
    return jsonify(EXPERIMENTS)

@app.route('/api/experiments/<experiment_id>', methods=['GET'])
def get_experiment(experiment_id):
    """Return specific experiment data"""
    if experiment_id not in EXPERIMENTS:
        return jsonify({"error": "Experiment not found"}), 404
    return jsonify(EXPERIMENTS[experiment_id])

@app.route('/api/analyze', methods=['POST'])
def analyze_experiment():
    """Use Claude to analyze experiment results"""
    data = request.json
    experiment_id = data.get('experiment_id')
    
    if experiment_id not in EXPERIMENTS:
        return jsonify({"error": "Experiment not found"}), 404
    
    experiment = EXPERIMENTS[experiment_id]
    
    prompt = f"""Analyze this A/B test experiment and provide actionable insights:

Experiment: {experiment['name']}
Description: {experiment['description']}
Start Date: {experiment['start_date']}

EXPERIMENT GROUP (n={experiment['experiment_group']['size']}):
{format_metrics(experiment['experiment_group'])}

CONTROL GROUP (n={experiment['control_group']['size']}):
{format_metrics(experiment['control_group'])}

Please provide:
1. Key findings - what are the most significant differences?
2. Statistical significance - are the results meaningful?
3. Business impact - what does this mean in practical terms?
4. Recommendations - should we roll out, iterate, or stop?
5. Risks - what should we watch out for?

Keep your analysis concise and actionable."""

    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        analysis = message.content[0].text
        
        return jsonify({
            "experiment_id": experiment_id,
            "analysis": analysis,
            "timestamp": datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """Get Claude's recommendations for next experiments"""
    data = request.json
    experiment_id = data.get('experiment_id')
    
    if experiment_id not in EXPERIMENTS:
        return jsonify({"error": "Experiment not found"}), 404
    
    experiment = EXPERIMENTS[experiment_id]
    
    prompt = f"""Based on this completed experiment, suggest 3 follow-up experiments:

Completed Experiment: {experiment['name']}
{experiment['description']}

Results:
Experiment Group: {format_metrics(experiment['experiment_group'])}
Control Group: {format_metrics(experiment['control_group'])}

Suggest 3 specific follow-up experiments that would:
1. Address any concerns from this test
2. Optimize the winning approach further
3. Explore related opportunities

For each, provide:
- Experiment name
- What you'd test
- Expected impact
- Resources needed"""

    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=800,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        recommendations = message.content[0].text
        
        return jsonify({
            "experiment_id": experiment_id,
            "recommendations": recommendations,
            "timestamp": datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def format_metrics(group_data):
    """Format metrics for display"""
    return "\n".join([f"  - {key}: {value}" for key, value in group_data.items()])

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
