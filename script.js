document.addEventListener('DOMContentLoaded', () => {
  // Display today's date
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const todayDateStr = today.toLocaleDateString(undefined, options);
  const dateElement = document.getElementById('date');
  dateElement.textContent = `Date: ${todayDateStr}`;
  dateElement.style.fontSize = '1.2rem'; // make date more visible

  // Fetch the menu JSON file
  fetch('/menu.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      ['breakfast', 'lunch', 'dinner'].forEach(meal => {
        const ul = document.getElementById(meal);
        ul.innerHTML = ''; // Clear existing items
        data.meals[meal].forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          ul.appendChild(li);
        });
      });
    })
    .catch(error => {
      console.error('Error fetching menu:', error);
      document.body.insertAdjacentHTML(
        'beforeend',
        `<p style="color:red; text-align:center;">Failed to load menu data.</p>`
      );
    });

  // Handle suggestion submit
  const suggestionInput = document.getElementById('suggestion');
  const submitButton = document.getElementById('submit-suggestion');

  submitButton.addEventListener('click', () => {
    const suggestion = suggestionInput.value.trim();

    if (suggestion) {
      fetch('/submit-suggestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ suggestion })
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        suggestionInput.value = '';
      })
      .catch(err => {
        console.error('Error sending suggestion:', err);
        alert('Failed to send suggestion.');
      });
    } else {
      alert('Please enter a suggestion.');
    }
  });
});
