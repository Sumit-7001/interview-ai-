import os
import sys
import json
import requests

# Set base URL
BASE_URL = "http://localhost:8000"

def test_workflow():
    print("=== Start Backend API Verification ===")
    
    # 1. Health check
    print("\n1. Health Check...")
    try:
        r = requests.get(f"{BASE_URL}/")
        print(f"Status: {r.status_code}, Response: {r.json()}")
        if r.status_code != 200:
            print("Health check failed!")
            return False
    except Exception as e:
        print(f"Connection failed: {e}")
        print("Make sure backend is running on port 8000.")
        return False

    # Unique test email
    test_email = f"tester_{int(requests.get(f'{BASE_URL}/').headers.get('date', '0').split()[-2].replace(':', ''))}@example.com"
    test_password = "password123"
    
    # 2. Register
    print("\n2. User Registration...")
    reg_data = {
        "email": test_email,
        "password": test_password,
        "first_name": "QA",
        "last_name": "Tester"
    }
    r = requests.post(f"{BASE_URL}/api/auth/register", json=reg_data)
    print(f"Status: {r.status_code}")
    if r.status_code != 201:
        print("Registration failed!")
        return False
    print("Registration successful.")

    # 3. Login
    print("\n3. User Login...")
    login_data = {
        "email": test_email,
        "password": test_password
    }
    r = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print(f"Status: {r.status_code}")
    if r.status_code != 200:
        print("Login failed!")
        return False
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful, token retrieved.")

    # 4. User Profile check
    print("\n4. Get Current User Profile...")
    r = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
    print(f"Status: {r.status_code}, User: {r.json()['email']}")
    if r.status_code != 200:
        print("Me endpoint failed!")
        return False

    # 5. Create Interview Session
    print("\n5. Create Interview Session...")
    session_data = {
        "role": "Python Developer",
        "experience_level": "Mid",
        "interview_type": "Technical"
    }
    r = requests.post(f"{BASE_URL}/api/interviews", json=session_data, headers=headers)
    print(f"Status: {r.status_code}")
    if r.status_code != 201:
        print("Create interview failed!")
        return False
    interview = r.json()
    interview_id = interview["id"]
    print(f"Interview created: ID={interview_id}")
    print(f"First Question: \"{interview['questions'][0]['question_text']}\"")

    # 6. Answer Question 1
    print("\n6. Submit Response for Question 1...")
    # Create fake audio file data
    fake_audio = b"RIFF....WAVEfmt ...." # dummy header
    
    files = {
        "audio": ("response.wav", fake_audio, "audio/wav")
    }
    data = {
        "question_id": 1,
        "eye_contact_score": 88.5,
        "emotion_summary_json": json.dumps({"neutral": 80.0, "happy": 20.0})
    }
    
    r = requests.post(
        f"{BASE_URL}/api/interviews/{interview_id}/answer", 
        data=data, 
        files=files, 
        headers=headers
    )
    print(f"Status: {r.status_code}")
    if r.status_code != 200:
        print("Answer submit failed!")
        print(r.text)
        return False
    result = r.json()
    print(f"Transcription: \"{result['answer_text']}\"")
    print(f"AI Score: {result['evaluation']['score']}/100")
    print(f"Filler Words count: {result['voice_metrics']['filler_words_count']}")

    # 7. Complete Session
    print("\n7. Completing Interview Session...")
    r = requests.post(f"{BASE_URL}/api/interviews/{interview_id}/complete", headers=headers)
    print(f"Status: {r.status_code}")
    if r.status_code != 200:
        print("Complete interview failed!")
        return False
    completed = r.json()
    print(f"Overall Score: {completed['overall_score']}")
    breakdown = completed.get('scores_breakdown', {})
    print(f"Technical Knowledge: {breakdown.get('technical_knowledge', breakdown.get('technical', 'N/A'))}")
    print(f"Answer Quality:      {breakdown.get('answer_quality', 'N/A')}")
    print(f"Semantic Relevance:  {breakdown.get('semantic_relevance', 'N/A')}")
    print(f"Communication:       {breakdown.get('communication', 'N/A')}")
    print(f"Eye Contact:         {breakdown.get('eye_contact', 'N/A')}")
    recommendations = completed.get('feedback', {}).get('recommendations', '')
    print(f"Recommendations: {str(recommendations)[:120]}...")

    # 8. Check PDF download
    print("\n8. Downloading PDF evaluation report...")
    r = requests.get(f"{BASE_URL}/api/reports/{interview_id}/pdf", headers=headers)
    print(f"Status: {r.status_code}, Content-Type: {r.headers.get('content-type')}")
    if r.status_code != 200 or r.headers.get('content-type') != 'application/pdf':
        print("PDF download failed!")
        return False
    print(f"Successfully downloaded {len(r.content)} bytes of PDF report.")

    print("\n=== Backend API Verification SUCCESS ===")
    return True

if __name__ == "__main__":
    test_workflow()
