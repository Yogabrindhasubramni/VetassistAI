================================================================================
                        VetAssist Pro - Setup Instructions
                    AI Veterinary Assistant with Gemini Pro
================================================================================

📋 REQUIREMENTS:
- Python 3.10 or higher (3.13 recommended)
- Google Gemini API Key (free from Google AI Studio)
- Internet connection

================================================================================
🚀 INSTALLATION STEPS:
================================================================================

STEP 1: Install Python
-----------------------
- Download from: https://www.python.org/downloads/
- During installation, CHECK "Add Python to PATH"
- Verify: Open terminal/cmd and type: python --version

STEP 2: Get Your Gemini API Key
-----------------------
- Visit: https://aistudio.google.com/app/apikey
- Sign in with your Google account
- Click "Create API Key"
- Copy your API key (starts with "AIza...")

STEP 3: Configure the API Key
-----------------------
- Open "gemini.py" in any text editor (Notepad, VS Code, etc.)
- Find line 45: GEMINI_API_KEY = "..."
- Replace the existing key with YOUR API key
- Save the file

STEP 4: Install Dependencies
-----------------------
Open terminal/command prompt in the project folder and run:

    pip install fastapi uvicorn pillow python-multipart pydantic google-generativeai

(This will install all required Python packages)

STEP 5: Run the Application
-----------------------
In the same terminal, run:

    python gemini.py

You should see:
- "Gemini Pro configured successfully!"
- "Uvicorn running on http://127.0.0.1:8001"

STEP 6: Open the Web Interface
-----------------------
- Double-click "index.html"
- OR open your browser and go to: file:///[path-to-folder]/index.html
- The page should show "Connected to Gemini AI"

================================================================================
✅ VERIFICATION:
================================================================================

1. Backend running? → Check terminal shows "Uvicorn running on..."
2. Frontend loaded? → Open index.html in browser
3. API connected? → Green dot shows "Connected to Gemini AI"
4. Test it! → Ask: "What should I feed my puppy?"

================================================================================
🎯 USAGE:
================================================================================

1. Select your pet type (Dog, Cat, Bird, Rabbit, Other)
2. Type your question about pet health or care
3. (Optional) Upload a photo of your pet
4. Click "Send" and wait for AI response
5. Review the risk assessment and recommendations

================================================================================
⚠️ TROUBLESHOOTING:
================================================================================

Problem: "Module not found" error
Solution: Run: pip install [module-name]

Problem: Can't connect to API
Solution: Make sure the backend (python gemini.py) is running

Problem: "API key invalid"
Solution: Get a new API key from Google AI Studio

Problem: Port 8001 already in use
Solution: Change port in gemini.py (line 506): port=8001 → port=8002

Problem: Browser shows "Connection Error"
Solution:
1. Check backend is running (python gemini.py)
2. Check the backend URL in index.html matches (line 312): const API_URL = 'http://127.0.0.1:8001'

================================================================================
📝 IMPORTANT NOTES:
================================================================================

- This is for personal/educational use only
- The AI provides general guidance, NOT professional veterinary diagnosis
- For emergencies, always contact a real veterinarian immediately
- Keep your API key private (don't share it publicly)
- Google Gemini API has free tier limits (check your usage)

================================================================================
🔒 SECURITY:
================================================================================

- Never commit your API key to public repositories
- Don't share your configured gemini.py with others (they need their own key)
- The API runs locally on your computer (http://127.0.0.1:8001)
- Only accessible from your own machine unless you change settings

================================================================================
📞 SUPPORT:
================================================================================

For issues with:
- Python installation: https://www.python.org/about/help/
- Gemini API: https://ai.google.dev/docs
- This application: Check the code comments or online forums

================================================================================
🎉 ENJOY VETASSIST PRO!
================================================================================

Made with ❤️ using Google Gemini Pro AI
