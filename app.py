from flask import Flask, render_template, request, jsonify
import json
import os
import logging
from datetime import datetime

app = Flask(__name__, template_folder='templates', static_folder='static')

# Enable debugging logs
logging.basicConfig(level=logging.DEBUG)

# Load menu data from JSON file
def load_menu():
    if not os.path.exists('menu.json'):
        return {"breakfast": [], "lunch": [], "dinner": [], "suggested": []}  # Default empty menu

    try:
        with open('menu.json', 'r') as f:
            data = json.load(f)
        return data.get("meals", {"breakfast": [], "lunch": [], "dinner": [], "suggested": []})  
    except json.JSONDecodeError:
        logging.error("Error decoding menu.json, using empty menu.")
        return {"breakfast": [], "lunch": [], "dinner": [], "suggested": []}  # If JSON is corrupted

@app.route('/')
def home():
    menu = load_menu()
    now = datetime.now().strftime('%B %d, %Y')
    return render_template('menu.html', menu=menu, now=now)

# Suggest a new meal dynamically
@app.route('/suggest', methods=['POST'])
def suggest():
    try:
        data = request.json
        new_meal = data.get('suggestedMeal')

        if not new_meal:
            return jsonify({'status': 'error', 'message': 'Invalid input'})

        menu = load_menu()
        menu["suggested"].append(new_meal)

        # Save updated menu back to JSON file
        with open('menu.json', 'w') as f:
            json.dump({'meals': menu}, f, indent=2)

        return jsonify({'status': 'success', 'message': 'Meal suggested successfully'})
    except Exception as e:
        logging.error(f"Error in /suggest: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Server error'})

# Remove a suggested meal
@app.route('/remove', methods=['POST'])
def remove():
    try:
        data = request.json
        meal_to_remove = data.get('mealToRemove')

        if not meal_to_remove:
            return jsonify({'status': 'error', 'message': 'Invalid input'})

        menu = load_menu()

        if meal_to_remove in menu["suggested"]:
            menu["suggested"].remove(meal_to_remove)

            # Save updated menu back to JSON file
            with open('menu.json', 'w') as f:
                json.dump({'meals': menu}, f, indent=2)

            return jsonify({'status': 'success', 'message': 'Meal removed successfully'})
        
        return jsonify({'status': 'error', 'message': 'Meal not found in suggestions'})
    except Exception as e:
        logging.error(f"Error in /remove: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Server error'})

# Run app
if __name__ == '__main__':
    app.run(debug=True)
