
const signForm = document.getElementById('loginForm');


signForm.addEventListener('submit', async function (event) {
    event.preventDefault(); 

    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    
    const loginData = {
        login: username,
        password: password
    };

    try {
        
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        
        if (response.ok) {
            const responseData = await response.json();
            
            if (responseData.success) {
                
                window.location.href = '/game-library'; 
            } else {
                
                alert('Login failed: ' + responseData.message);
            }
        } else {
            
            const errorText = await response.text();
            alert('Error: ' + errorText); 
        }
    } catch (error) {
        
        alert('Error: ' + error.message);
    }
});
