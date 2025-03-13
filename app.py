from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

# Configure the API key for the Gemini model
API_KEY = "AIzaSyCktPqlZlknJAV_BcJzwtyzWbNFcxHcbqw"
genai.configure(api_key=API_KEY)

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

def chat_with_gemini(source, destination, days):
    prompt = f"Generate a well-formatted trip plan for a user with the following details:\n" \
             f"Source: {source}\n" \
             f"Destination: {destination}\n" \
             f"Number of Days: {days}\n" \
             f"The plan should include daily activities, locations, and recommendations.\n" \
             f"Please format the plan with the following specifications:\n" \
             f"1. Each day should be a heading (e.g., 'Day 1: ...').\n" \
             f"2. Activities for each day should be in bullet points, wrapped in <ul> and <li> tags.\n" \
             f"3. Include meal suggestions where applicable.\n" \
             f"4. Recommend places nearby.\n" \
             f"5. Keep the plan easy to read with clear separations between days.\n" \
             f"Please ensure that the content is rendered with proper HTML tags like <ul>, <li>, and <h2>."

    model = genai.GenerativeModel("gemini-1.5-pro")
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


@app.route("/reschedule", methods=["POST"])
def reschedule_plan():
    data = request.json
    previous_plan = data.get("plan")
    mood_description = data.get("suggestion")

    if not previous_plan or not mood_description:
        return jsonify({"error": "Previous plan and mood description are required!"}), 400

    # Modify the plan based on mood
    prompt = f"""
        Here's the current trip plan:
        {previous_plan}

        The user wants to reschedule based on the following mood description:
        {mood_description}

        Please adjust the trip plan accordingly, ensuring a smooth itinerary while maintaining key attractions. Make changes where necessary, but do not remove essential locations unless required.

        Please format the plan with the following specifications:
        1. Each day should be a heading (e.g., 'Day 1: ...').
        2. Activities for each day should be listed in bullet points, wrapped in <ul> and <li> tags.
        3. Include meal suggestions where applicable.
        4. Recommend places nearby.
        5. Keep the plan easy to read with clear separations between days.
        6. Ensure that the content is rendered with proper HTML tags like <ul>, <li>, and <h2>.
        """

    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(prompt)

    updated_plan = response.text.replace("\n", "<br />").strip()

    return jsonify({"updatedPlan": updated_plan})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
