"""
VetAssist Pro - Using Google Gemini Pro API
"""
import google.generativeai as genai
print(f"Running google-generativeai version: {genai.__version__}")
import os
import base64
import json
import time
import logging
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import io
import asyncio
from contextlib import asynccontextmanager

# FastAPI and web components
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

# Pydantic for validation
from pydantic import BaseModel, validator

# Image processing
from PIL import Image, ImageFile, UnidentifiedImageError
import numpy as np

# Google Gemini Pro
import google.generativeai as genai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vetassist")

# Allow truncated images
ImageFile.LOAD_TRUNCATED_IMAGES = True

# =============================================================================
# GEMINI PRO CONFIGURATION
# =============================================================================

# Configure Gemini Pro - REPLACE WITH YOUR ACTUAL API KEY
GEMINI_API_KEY = "AIzaSyA664LRHP7koz_qMz43cUQF8AhGzFTIy58"  # Replace with your actual Gemini API key from https://aistudio.google.com/app/apikey

try:
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("Gemini Pro configured successfully!")
except Exception as e:
    logger.error(f"Gemini Pro configuration failed: {e}")

# =============================================================================
# LIFESPAN MANAGEMENT
# =============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("VetAssist Pro API starting up...")
    try:
        # Test Gemini connection
        global gemini_model
        gemini_model = genai.GenerativeModel('gemini-2.5-flash')
        test_response = gemini_model.generate_content("Test connection")
        logger.info("Gemini Pro connection successful!")
    except Exception as e:
        logger.error(f"Gemini Pro connection failed: {e}")
        gemini_model = None
    yield
    # Shutdown
    logger.info("VetAssist Pro API shutting down...")

app = FastAPI(
    title="VetAssist Pro API",
    description="AI Veterinary Assistant Backend with Gemini Pro",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================================================================
# PHASE 1: INPUT VALIDATION & MODELS
# =============================================================================

class ChatRequest(BaseModel):
    text: Optional[str] = None
    image_base64: Optional[str] = None
    session_id: Optional[str] = None
    animal_type: Optional[str] = "unknown"
    
    @validator('text')
    def validate_text_length(cls, v):
        if v and len(v) > 4000:
            raise ValueError('Text must be less than 4000 characters')
        return v

class SessionData:
    def __init__(self):
        self.sessions = {}
    
    def create_session(self, session_id: str, animal_type: str = "unknown"):
        self.sessions[session_id] = {
            'messages': [],
            'animal_type': animal_type,
            'created_at': datetime.now(),
            'last_activity': datetime.now()
        }
        return self.sessions[session_id]
    
    def get_session(self, session_id: str):
        if session_id not in self.sessions:
            return self.create_session(session_id)
        session = self.sessions[session_id]
        session['last_activity'] = datetime.now()
        if len(session['messages']) > 6:
            session['messages'] = session['messages'][-6:]
        return session
    
    def add_message(self, session_id: str, role: str, content: str, image_analysis: str = ""):
        session = self.get_session(session_id)
        message = {
            'role': role,
            'content': content,
            'image_analysis': image_analysis,
            'timestamp': datetime.now()
        }
        session['messages'].append(message)
        return message

session_manager = SessionData()

# =============================================================================
# PHASE 2: GEMINI PRO INTEGRATION
# =============================================================================

class GeminiVeterinaryAssistant:
    @staticmethod
    def create_veterinary_prompt(animal_type: str, user_query: str, conversation_history: List[Dict], image_description: str = "") -> str:
        """Create a comprehensive veterinary prompt for Gemini Pro"""
        
        # Build conversation context
        history_context = ""
        for msg in conversation_history[-4:]:  # Last 4 messages for context
            role = "Pet Owner" if msg['role'] == 'user' else "Veterinary Assistant"
            history_context += f"{role}: {msg['content']}\n"
        
        prompt = f"""You are VetAssist Pro, an expert AI veterinary assistant with comprehensive knowledge of animal healthcare. Provide specific, accurate, and compassionate advice.

IMPORTANT MEDICAL GUIDELINES:
1. For EMERGENCY situations (trauma, difficulty breathing, seizures, poisoning, heavy bleeding): Clearly state it's an emergency and advise immediate veterinary care
2. For URGENT issues (vomiting/diarrhea >24h, not eating/drinking >24h, obvious pain): Recommend veterinary consultation within 24 hours
3. For MINOR issues: Provide specific home care advice with clear monitoring instructions
4. NEVER recommend specific medications or dosages
5. Always explain when professional veterinary care is necessary

CURRENT CONTEXT:
- Animal Species: {animal_type}
- Image Analysis: {image_description if image_description else "No image provided"}
- Current Query: "{user_query}"

CONVERSATION HISTORY:
{history_context if history_context else "No previous conversation in this session"}

RESPONSE REQUIREMENTS:
- Be SPECIFIC and DETAILED - avoid generic responses
- Provide actionable advice when appropriate
- Explain the rationale behind recommendations
- Use clear medical terminology but explain when needed
- Show compassion and understanding
- If it's an emergency, make that VERY clear upfront

Please provide a comprehensive veterinary response:"""
        
        return prompt
    
    @staticmethod
    async def generate_veterinary_response(prompt: str, image_data: Optional[bytes] = None) -> str:
        """Generate veterinary response using Gemini Pro with retry logic"""
        max_retries = 2
        retry_delay = 1
        
        for attempt in range(max_retries + 1):
            try:
                if gemini_model is None:
                    return "Veterinary service is currently unavailable. Please try again shortly."
                
                # Use the same model for both text and vision
                model = genai.GenerativeModel('gemini-2.5-flash')
                
                if image_data:
                    # Prepare image
                    img = Image.open(io.BytesIO(image_data))
                    
                    # Generate response with image
                    response = model.generate_content([prompt, img])
                else:
                    # Text-only generation with optimized settings
                    response = model.generate_content(
                        prompt,
                        generation_config=genai.types.GenerationConfig(
                            temperature=0.3,
                            top_p=0.8,
                            top_k=40,
                            max_output_tokens=1024,
                        )
                    )
                
                # Check if response is valid
                if response.text and len(response.text.strip()) > 10:
                    return response.text
                else:
                    logger.warning(f"Empty response from Gemini, attempt {attempt + 1}")
                    
            except Exception as e:
                logger.warning(f"Gemini API attempt {attempt + 1} failed: {e}")
                if attempt < max_retries:
                    logger.info(f"Retrying in {retry_delay} seconds...")
                    await asyncio.sleep(retry_delay)
                    retry_delay *= 2  # Exponential backoff
                else:
                    logger.error(f"All Gemini API attempts failed: {e}")
        
        # If all retries failed, return a helpful response instead of emergency message
        return "I'd be happy to provide veterinary advice. Could you please rephrase your question or provide more details about your pet's specific situation?"
    
    @staticmethod
    def get_emergency_fallback_response() -> str:
        """Fallback response when Gemini fails"""
        return "I'd be happy to provide veterinary advice. Could you please rephrase your question or provide more details about your pet's specific situation?"

class ImageProcessor:
    @staticmethod
    def validate_image(file_content: bytes) -> Image.Image:
        try:
            image = Image.open(io.BytesIO(file_content))
            if image.mode != 'RGB':
                image = image.convert('RGB')
            if max(image.size) > 2048:
                image.thumbnail((2048, 2048), Image.Resampling.LANCZOS)
            return image
        except UnidentifiedImageError:
            raise HTTPException(status_code=400, detail="Invalid image format")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Image processing error: {str(e)}")
    
    @staticmethod
    def base64_to_image(base64_string: str) -> Image.Image:
        try:
            if ',' in base64_string:
                base64_string = base64_string.split(',')[1]
            image_data = base64.b64decode(base64_string)
            return ImageProcessor.validate_image(image_data)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Base64 decoding error: {str(e)}")

# =============================================================================
# PHASE 3: MEDICAL RISK ASSESSMENT
# =============================================================================

class MedicalRiskAssessor:
    @staticmethod
    def assess_risk_level(user_query: str, gemini_response: str) -> str:
        """Assess medical risk based on query and response content"""
        combined_text = (user_query + " " + gemini_response).lower()
        
        # EMERGENCY indicators
        emergency_indicators = [
            'emergency', 'immediate veterinary care', '911', 'emergency vet',
            'hit by car', 'bleeding heavily', 'unconscious', 'seizure',
            'not breathing', 'choking', 'poison', 'trauma', 'electrocuted',
            'difficulty breathing', 'blue gums', 'collapse', 'heat stroke'
        ]
        
        # HIGH RISK indicators
        high_risk_indicators = [
            'urgent', 'veterinary consultation within 24 hours', 'see a vet immediately',
            'vomiting blood', 'bloody diarrhea', 'bloody urine', 'can\'t walk',
            'crying in pain', 'rat poison', 'antifreeze', 'chocolate',
            'grapes', 'xylitol', 'straining to urinate', 'bloated abdomen',
            'pale gums', 'not eating', 'not drinking', 'lethargic'
        ]
        
        # LOW RISK indicators
        low_risk_indicators = [
            'routine care', 'monitor at home', 'normal behavior',
            'how often', 'what food', 'bathing', 'grooming', 'training',
            'vaccine', 'prevention', 'routine', 'exercise', 'behavior',
            'best food', 'diet', 'nutrition', 'toys', 'bed', 'crate'
        ]
        
        if any(indicator in combined_text for indicator in emergency_indicators):
            return 'emergency'
        elif any(indicator in combined_text for indicator in high_risk_indicators):
            return 'high'
        elif any(indicator in combined_text for indicator in low_risk_indicators):
            return 'low'
        else:
            return 'medium'

class ResponseFormatter:
    @staticmethod
    def format_medical_response(gemini_response: str, image_analysis: str, animal_type: str, user_query: str) -> Dict[str, Any]:
        """Format the final medical response"""
        
        risk_level = MedicalRiskAssessor.assess_risk_level(user_query, gemini_response)
        
        # Set appropriate actions based on risk level
        if risk_level == "emergency":
            recommended_action = "EMERGENCY: SEEK IMMEDIATE VETERINARY CARE"
            vet_consultation = True
            emergency = True
        elif risk_level == "high":
            recommended_action = "URGENT: Veterinary consultation within 24 hours"
            vet_consultation = True
            emergency = False
        elif risk_level == "low":
            recommended_action = "Continue with routine care and monitoring"
            vet_consultation = False
            emergency = False
        else:
            recommended_action = "INFO: Monitor and consult veterinarian if symptoms persist"
            vet_consultation = True
            emergency = False
        
        return {
            "response": gemini_response,
            "risk_level": risk_level,
            "recommended_action": recommended_action,
            "vet_consultation": vet_consultation,
            "emergency": emergency,
            "image_analysis": image_analysis,
            "animal_type": animal_type,
            "timestamp": datetime.now().isoformat(),
            "status": "success",
            "model_used": "Gemini Pro"
        }

# =============================================================================
# PHASE 4: GEMINI PRO PROCESSING PIPELINE
# =============================================================================

class GeminiVetAssistPipeline:
    @staticmethod
    async def process_gemini_request(request_data: ChatRequest) -> Dict[str, Any]:
        """Main processing pipeline using Gemini Pro"""
        
        start_time = time.time()
        
        try:
            session_id = request_data.session_id or f"session_{int(time.time())}"
            session = session_manager.get_session(session_id)
            
            # Process image if provided
            image_data = None
            image_analysis = ""
            
            if request_data.image_base64:
                try:
                    image = ImageProcessor.base64_to_image(request_data.image_base64)
                    
                    # Convert image to bytes for Gemini
                    img_byte_arr = io.BytesIO()
                    image.save(img_byte_arr, format='JPEG')
                    image_data = img_byte_arr.getvalue()
                    
                    image_analysis = "Image provided for analysis"
                    
                except Exception as e:
                    logger.error(f"Image processing error: {e}")
                    image_analysis = "Image analysis unavailable"
            
            session['animal_type'] = request_data.animal_type
            conversation_history = session['messages']
            user_query = request_data.text or "Please analyze this image of my pet."
            
            # Create veterinary prompt for Gemini
            prompt = GeminiVeterinaryAssistant.create_veterinary_prompt(
                request_data.animal_type, 
                user_query, 
                conversation_history,
                image_analysis
            )
            
            # Generate response using Gemini Pro
            gemini_response = await GeminiVeterinaryAssistant.generate_veterinary_response(
                prompt, 
                image_data
            )
            
            # Format the final response
            formatted_response = ResponseFormatter.format_medical_response(
                gemini_response, 
                image_analysis, 
                request_data.animal_type, 
                user_query
            )
            
            # Store conversation
            session_manager.add_message(
                session_id=session_id,
                role="user",
                content=user_query,
                image_analysis=image_analysis
            )
            
            session_manager.add_message(
                session_id=session_id,
                role="assistant",
                content=gemini_response,
                image_analysis=""
            )
            
            # Add performance metrics
            processing_time = time.time() - start_time
            formatted_response["processing_time"] = round(processing_time, 2)
            formatted_response["session_id"] = session_id
            
            return formatted_response
            
        except Exception as e:
            logger.error(f"Gemini pipeline error: {e}")
            return {
                "response": "I apologize for the technical issue. For veterinary assistance, please contact your local veterinarian directly.",
                "error": str(e),
                "status": "error"
            }

# =============================================================================
# API ENDPOINTS
# =============================================================================

@app.get("/")
async def root():
    return {
        "message": "VetAssist Pro API with Gemini Pro", 
        "status": "healthy", 
        "timestamp": datetime.now().isoformat(),
        "model": "Gemini Pro"
    }

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """Main chat endpoint using Gemini Pro"""
    response = await GeminiVetAssistPipeline.process_gemini_request(request)
    return JSONResponse(content=response)

@app.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    animal_type: str = Form("unknown"),
    session_id: Optional[str] = Form(None)
):
    """Image analysis endpoint using Gemini Pro Vision"""
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        contents = await file.read()
        base64_image = base64.b64encode(contents).decode('utf-8')
        
        request = ChatRequest(
            text="Please analyze this image of my pet and provide veterinary insights.",
            image_base64=base64_image,
            animal_type=animal_type,
            session_id=session_id
        )
        
        response = await GeminiVetAssistPipeline.process_gemini_request(request)
        return JSONResponse(content=response)
        
    except Exception as e:
        return JSONResponse(
            content={"error": str(e), "status": "error"}, 
            status_code=500
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    gemini_working = gemini_model is not None
    
    return {
        "status": "healthy" if gemini_working else "degraded",
        "gemini_connected": gemini_working,
        "timestamp": datetime.now().isoformat(),
        "model": "Gemini 2.5 Flash"
    }

# =============================================================================
# MAIN EXECUTION
# =============================================================================

if __name__ == "__main__":
    uvicorn.run(
        "gemini:app",
        host="127.0.0.1",
        port=8001,
        reload=True,
        log_level="info"
    )