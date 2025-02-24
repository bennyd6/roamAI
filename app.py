from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

# Configure the API key for the Gemini model
API_KEY = "AIzaSyCtA9BxuFvKvqgnEeT38gjtUH6MsGajCKI"
genai.configure(api_key=API_KEY)

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

def chat_with_gemini(source, destination, days):
    prompt = f"Generate a well-formatted trip plan for a user with the following details:\n" \
             f"Source: {source}\n" \
             f"Destination: {destination}\n" \
             f"Number of Days: {days}\n" \
             f"The plan should include daily activities, locations, and recommendations.\n" \
             f"Can also recommend places nearby\n" \
             f"Each day should be well-organized, and clearly separated with headings for each day. Include meal suggestions where applicable."

    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    return response.text

@app.route("/plan", methods=["POST"])
def plan_trip():
    # Get the data from the front-end request
    data = request.json
    source = data.get("source")
    destination = data.get("destination")
    days = data.get("days")

    # Check if required fields are provided
    if not source or not destination or not days:
        return jsonify({"error": "Source, destination, and number of days are required!"}), 400

    # Generate trip plan using Gemini AI
    plan = chat_with_gemini(source, destination, days)

    # Format the plan in a structured way to be more readable
    plan_formatted = plan.replace("\n", "<br />").replace("**", "").replace("*", "").strip()

    # Return the generated trip plan to the front-end
    return jsonify({"plan": plan_formatted})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
