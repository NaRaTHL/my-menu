document.addEventListener('DOMContentLoaded', () => {
  // Display today's date in a friendly format
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const todayDateStr = today.toLocaleDateString(undefined, options);
  document.getElementById('date').textContent = `Date: ${todayDateStr}`;

  // Fetch the menu JSON file
  fetch('menu.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      ['breakfast', 'lunch', 'dinner'].forEach(meal => {
        const ul = document.getElementById(meal);
        ul.innerHTML = ''; // Clear any existing items
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
});
