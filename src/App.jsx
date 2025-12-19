import { useState } from 'react';

export default function App() {
  const [formData, setFormData] = useState({
    department: '',
    item: '',
    amount: '',
    category: '',
    justification: ''
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });

      if (!response.ok) {
        throw new Error('Error validating purchase');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (type) => {
    const examples = {
      approved: {
        department: 'IT',
        item: 'MacBook Pro',
        amount: '3000',
        category: 'Hardware',
        justification: 'Need for software development work'
      },
      rejected: {
        department: 'Marketing',
        item: 'Ferrari F8 Tributo',
        amount: '280000',
        category: 'Vehicle',
        justification: 'Need a car for meetings'
      },
      review: {
        department: 'HR',
        item: '50 PlayStation 5 consoles',
        amount: '25000',
        category: 'Entertainment',
        justification: 'For employee wellness'
      }
    };
    setFormData(examples[type]);
    setResult(null);
    setError(null);
  };

  const getDecisionColor = (decision) => {
    switch(decision) {
      case 'APPROVED': return 'bg-green-100 border-green-500 text-green-800';
      case 'REJECTED': return 'bg-red-100 border-red-500 text-red-800';
      case 'NEEDS_REVIEW': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🤖 Smart Purchase Validator
          </h1>
          <p className="text-gray-600">
            AI-powered procurement requisition validation system
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6 flex gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-700 mr-2">Quick examples:</span>
            <button
              onClick={() => loadExample('approved')}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition"
            >
              ✅ Approved
            </button>
            <button
              onClick={() => loadExample('rejected')}
              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition"
            >
              ❌ Rejected
            </button>
            <button
              onClick={() => loadExample('review')}
              className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition"
            >
              ⚠️ Needs Review
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., IT, Marketing, HR"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Software, Hardware"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item
              </label>
              <input
                type="text"
                name="item"
                value={formData.item}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What are you purchasing?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (USD)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Justification
              </label>
              <textarea
                name="justification"
                value={formData.justification}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Why is this purchase necessary?"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '🔄 Analyzing...' : '🚀 Validate Purchase'}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700">
                <strong>Error:</strong> {error}
              </p>
              <p className="text-sm text-red-600 mt-1">
                Make sure the backend is running on http://127.0.0.1:8000
              </p>
            </div>
          )}

          {result && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                📊 Validation Result
              </h3>
              
              <div className={`p-4 border-l-4 rounded-lg ${getDecisionColor(result.decision)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {result.decision === 'APPROVED' && '✅ APPROVED'}
                      {result.decision === 'REJECTED' && '❌ REJECTED'}
                      {result.decision === 'NEEDS_REVIEW' && '⚠️ NEEDS REVIEW'}
                    </p>
                    <p className="text-sm mt-1">{result.reasoning}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Risk Level:</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getRiskColor(result.risk_level)}`}>
                        {result.risk_level.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs mt-1 opacity-75">
                      {result.processing_time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-sm text-gray-600">
          <p>Built with FastAPI + LangChain + Ollama (Llama 3.2)</p>
          <p className="mt-1">AI Agents Developer Demo Project</p>
        </div>
      </div>
    </div>
  );
}