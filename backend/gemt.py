import requests
import json
import time

BASE_URL = "http://127.0.0.1:8001"

def test_gemini_responses():
    """Comprehensive test of Gemini Pro veterinary responses"""
    print("🔬 GEMINI PRO VETERINARY TEST")
    print("=" * 70)
    
    test_cases = [
        # Emergency scenarios
        ("My dog was hit by a car and is bleeding from the mouth", "dog", "emergency"),
        ("My cat is having seizures and can't stand up", "cat", "emergency"),
        ("My puppy ate a whole chocolate bar", "dog", "high"),
        
        # Common medical issues
        ("My dog has been vomiting yellow foam for 6 hours", "dog", "medium"),
        ("My cat has had diarrhea for 2 days and seems weak", "cat", "high"),
        ("My dog is limping on his back leg after jumping off the couch", "dog", "medium"),
        ("My senior cat hasn't eaten in 36 hours", "cat", "high"),
        
        # General care questions
        ("What's the proper feeding schedule for a 3-month-old puppy?", "dog", "low"),
        ("How often should I take my cat to the vet for checkups?", "cat", "low"),
        ("What are the essential vaccines for an indoor cat?", "cat", "low"),
        ("How can I prevent fleas and ticks on my dog?", "dog", "low"),
        
        # Behavioral questions
        ("My puppy keeps chewing on furniture, how can I stop this?", "dog", "low"),
        ("My cat is aggressive towards other cats in the house", "cat", "medium"),
        ("How to train a rescue dog with anxiety?", "dog", "low"),
        
        # Nutrition questions
        ("What's the best diet for a dog with sensitive stomach?", "dog", "low"),
        ("Should I feed my cat wet or dry food?", "cat", "low"),
        ("Are grain-free diets good for dogs?", "dog", "low"),
    ]
    
    successful_tests = 0
    total_tests = len(test_cases)
    
    for i, (question, animal, expected_risk) in enumerate(test_cases, 1):
        print(f"\n{i}. ❓ {question}")
        
        data = {
            "text": question,
            "animal_type": animal,
            "session_id": f"gemini_test"
        }
        
        try:
            start_time = time.time()
            response = requests.post(f"{BASE_URL}/chat", json=data, timeout=60)
            response_time = time.time() - start_time
            
            result = response.json()
            
            if result.get('status') == 'success':
                response_text = result['response']
                print(f"   ✅ Response: {response_text}")
                print(f"   📊 Risk Level: {result['risk_level']} (expected: {expected_risk})")
                print(f"   💡 Action: {result['recommended_action']}")
                print(f"   ⏱️  Response Time: {response_time:.2f}s")
                print(f"   🤖 Model: {result.get('model_used', 'Unknown')}")
                
                # Check response quality
                if (len(response_text) > 50 and 
                    "I understand you're concerned" not in response_text and
                    "consult your veterinarian" not in response_text.lower() and
                    "I apologize" not in response_text.lower()):
                    print("   🎉 EXCELLENT: High-quality Gemini response!")
                    successful_tests += 1
                else:
                    print("   📝 Basic response generated")
                
            else:
                print(f"   ❌ Error: {result.get('error', 'Unknown error')}")
                
        except Exception as e:
            print(f"   ❌ Request failed: {e}")
        
        # Be nice to the API
        time.sleep(2)
    
    # Summary
    print(f"\n{'='*70}")
    print(f"📈 GEMINI PRO TEST SUMMARY:")
    print(f"   Successful tests: {successful_tests}/{total_tests}")
    print(f"   Success rate: {(successful_tests/total_tests)*100:.1f}%")
    print(f"   Model: Gemini Pro")
    print(f"{'='*70}")

def test_health_check():
    """Test the health endpoint"""
    print(f"\n🏥 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        result = response.json()
        print(f"   Status: {result.get('status')}")
        print(f"   Gemini Connected: {result.get('gemini_connected')}")
        print(f"   Model: {result.get('model')}")
    except Exception as e:
        print(f"   ❌ Health check failed: {e}")

if __name__ == "__main__":
    print("Testing VetAssist Pro with Gemini Pro...")
    print("This uses Google's advanced AI for veterinary responses!\n")
    
    test_health_check()
    test_gemini_responses()