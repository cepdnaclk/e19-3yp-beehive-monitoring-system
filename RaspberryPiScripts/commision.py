import requests
import getpass

def login_and_create_beehive(email, password):
    login_url = 'http://localhost:5001/api/user/login'
    beehive_url = 'http://localhost:5001/api/beehive'

    # JSON data to post for beehive
    beehive_data = {
        "name": "Test Beehive",
        "CO2": "400 ppm",
        "Temperature": "35°C",
        "Humidity": "60%",
        "Weight": "15kg"
    }

    # Send login request
    login_response = requests.post(login_url, json={'email': email, 'password': password})
    
    if login_response.status_code != 200:
        print("Login failed")
        return

    # Extract access token from login response
    access_token = login_response.json().get('accessToken')

    # Add access token to authorization header
    headers = {'Authorization': f'Bearer {access_token}'}

    # Send request to create a beehive with the JSON data
    beehive_response = requests.post(beehive_url, headers=headers, json=beehive_data)
    
    if beehive_response.status_code != 201:
        print("Beehive creation failed")
        return

    # Extract beehive_id
    beehive_id = beehive_response.json().get('_id')

    # Save credentials and beehive_id to a file
    with open('credentials_and_beehive_id.txt', 'w') as file:
        file.write(f"Email: {email}\n")
        file.write(f"Password: {password}\n")
        file.write(f"Beehive ID: {beehive_id}\n")

    print("Beehive created successfully. Details saved in credentials_and_beehive_id.txt")

# Prompt user for email and use getpass for password
user_email = input("Enter your email: ")
user_password = getpass.getpass("Enter your password: ")

login_and_create_beehive(user_email, user_password)
