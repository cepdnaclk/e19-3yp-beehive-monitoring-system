import subprocess
import os
import requests
from datetime import datetime

def get_credentials():
    with open('credentials_and_beehive_id.txt', 'r') as file:
        lines = file.readlines()
        email = lines[0].strip().split(": ")[1]
        password = lines[1].strip().split(": ")[1]
        beehive_id = lines[2].strip().split(": ")[1]
    return email, password, beehive_id

def get_access_token(email, password):
    login_url = 'http://beehive-backend.eba-xkm8nww8.us-west-2.elasticbeanstalk.com/api/user/login'
    response = requests.post(login_url, json={'email': email, 'password': password})
    if response.status_code == 200:
        return response.json().get('access_token')
    else:
        print("Failed to login and get access token")
        return None

def get_folder_size(directory):
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(directory):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            total_size += os.path.getsize(fp)
    return total_size

def capture_video_and_notify():
    email, password, beehive_id = get_credentials()
    access_token = get_access_token(email, password)
    if access_token is None:
        return

    # Create a new directory based on the current date and time
    current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
    directory = f"./{current_time}"
    os.makedirs(directory, exist_ok=True)

    # Command to capture video
    command = [
        'rpicam-vid', '-t', '10000',
        '--tuning-file', '/usr/share/libcamera/ipa/rpi/vc4/imx219_noir.json',
        '--codec', 'mjpeg', '--segment', '1',
        '-o', f'{directory}/test%05d.jpeg'
    ]

    try:
        subprocess.run(command, check=True)
        folder_size = get_folder_size(directory)

        # Prepare data for the multipart request
        files = {'file': open(f'{directory}/test00001.jpeg', 'rb')}
        data = {
            'beehive_id': beehive_id,
            'folder_name': directory,
            'folder_size': str(folder_size) + ' bytes',
        }

        # Send an HTTP POST request to /api/camera
        camera_api_endpoint = 'http://beehive-backend.eba-xkm8nww8.us-west-2.elasticbeanstalk.com/api/camera'
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.post(camera_api_endpoint, headers=headers, files=files, data=data)
        print("Video captured and notification sent. Status:", response.status_code)
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")

# Run the function
capture_video_and_notify()
