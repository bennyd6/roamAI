import './plan.css';
import { useState } from 'react';

export default function Plan() {
    const [formData, setFormData] = useState({
        source: '',
        destination: '',
        days: '',
    });

    const [generatedPlan, setGeneratedPlan] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSuggestionChange = (e) => {
        setSuggestion(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setGeneratedPlan(data.plan); // Set the generated plan
            } else {
                setGeneratedPlan('Error generating plan: ' + data.error);
            }
        } catch (error) {
            setGeneratedPlan('An error occurred while generating the plan.');
        } finally {
            setLoading(false);
        }
    };

    const handleReschedule = async (e) => {
        e.preventDefault();
        if (!suggestion.trim()) {
            alert("Please enter a suggestion for rescheduling.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/reschedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    plan: generatedPlan,
                    suggestion,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setGeneratedPlan(data.updatedPlan); // Set the updated plan
            } else {
                setGeneratedPlan('Error rescheduling plan: ' + data.error);
            }
        } catch (error) {
            setGeneratedPlan('An error occurred while rescheduling the plan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="plan-main">
            <div className="plan-container">
                {/* Form Section */}
                <div className="plan-form">
                    <h1>Plan Your Trip</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="source">Source</label>
                            <input
                                type="text"
                                id="source"
                                name="source"
                                value={formData.source}
                                onChange={handleInputChange}
                                placeholder="Enter Source"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="destination">Destination</label>
                            <input
                                type="text"
                                id="destination"
                                name="destination"
                                value={formData.destination}
                                onChange={handleInputChange}
                                placeholder="Enter Destination"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="days">Number of Days</label>
                            <input
                                type="number"
                                id="days"
                                name="days"
                                value={formData.days}
                                onChange={handleInputChange}
                                placeholder="Enter number of days"
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Generating Plan...' : 'Generate Plan'}
                        </button>
                    </form>
                </div>

                {/* AI Generated Plan & Suggestion Section */}
                <div className="plan-area">
                    {/* AI Generated Plan */}
                    <div className={`generated-plan ${loading ? 'loading' : ''}`}>
                        {loading ? (
                            <div className="loader">Loading...</div>
                        ) : (
                            generatedPlan && (
                                <div className="generated-text">
                                    <h2>Your Generated Trip Plan</h2>
                                    <div dangerouslySetInnerHTML={{ __html: generatedPlan }} />
                                </div>
                            )
                        )}
                    </div>

                    {/* Suggestion for Reschedule */}
                    <div className="reschedule-section">
                        <h2>Suggest Reschedule</h2>
                        <textarea
                            value={suggestion}
                            onChange={handleSuggestionChange}
                            placeholder="Enter your suggestion for rescheduling"
                        />
                        <button onClick={handleReschedule}>Submit Suggestion</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
