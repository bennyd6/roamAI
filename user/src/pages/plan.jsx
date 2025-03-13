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
                setGeneratedPlan(data.plan);
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
    
        const previousPlan = localStorage.getItem('userPlan');  // ✅ Corrected key
    
        if (!previousPlan) {
            alert("No previous plan found! Generate and save a plan first.");
            return;
        }
    
        if (!suggestion.trim()) {
            alert("Please describe your mood for rescheduling.");
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
                    plan: previousPlan,  // ✅ Fetching the correct saved plan
                    suggestion,  // ✅ User's mood input
                }),
            });
    
            const data = await response.json();
            if (response.ok) {
                setGeneratedPlan(data.updatedPlan);
                localStorage.setItem('userPlan', data.updatedPlan); // ✅ Save updated plan
                alert("Plan rescheduled successfully!");
            } else {
                alert("Error rescheduling plan: " + data.error);
            }
        } catch (error) {
            alert("An error occurred while rescheduling the plan.");
        } finally {
            setLoading(false);
        }
    };
    
    // ✅ Also update handleSavePlan to store in `userPlan`
    const handleSavePlan = async () => {
        if (!generatedPlan) {
            alert("No plan to save!");
            return;
        }
    
        const authToken = localStorage.getItem('authToken');
    
        if (!authToken) {
            alert("User not logged in. Please log in first.");
            return;
        }
    
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/auth/addplan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': authToken
                },
                body: JSON.stringify({ plan: generatedPlan }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                localStorage.setItem('userPlan', generatedPlan); // ✅ Store in correct key
                alert("Plan saved successfully!");
            } else {
                alert("Error saving plan: " + data.error);
            }
        } catch (error) {
            alert("An error occurred while saving the plan.");
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
                {/* <h2>Your Generated Trip Plan</h2> */}
                {/* Render the generated plan as HTML with bullet points and headings */}
                <div dangerouslySetInnerHTML={{ __html: generatedPlan }} />
                <button onClick={handleSavePlan} disabled={!generatedPlan || loading}>
                    {loading ? 'Saving...' : 'Save Plan'}
                </button>
            </div>
        )
    )}
</div>



            {/* Suggestion for Reschedule */}
            <div className="reschedule-section">
                <h2>Mood check for Reschedule</h2>
                <textarea
                    value={suggestion}
                    onChange={handleSuggestionChange}
                    placeholder="Describe your mood for rescheduling"
                />
                <button onClick={handleReschedule}>Reschedule</button>
            </div>
        </div>
    </div>
</div>
    );
}
