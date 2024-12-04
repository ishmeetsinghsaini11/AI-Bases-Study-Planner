document.getElementById('studyForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const subjects = document.getElementById('subjects').value.split(',').map(s => s.trim());
    const studyHours = document.getElementById('studyHours').value;
    const goals = document.getElementById('goals').value;

    // Show loading spinner
    document.getElementById('loadingSpinner').classList.remove('hidden');
    document.getElementById('studyPlan').classList.add('hidden');

    try {
        const response = await fetch('/api/plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subjects,
                studyHours,
                goals
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Display the study plan
            document.getElementById('planContent').innerHTML = data.schedule.replace(/\n/g, '<br>');
            document.getElementById('studyPlan').classList.remove('hidden');
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate study plan. Please try again.');
    } finally {
        document.getElementById('loadingSpinner').classList.add('hidden');
    }
});
