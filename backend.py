from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
from transformers import pipeline
from pydub import AudioSegment

app = Flask(__name__)
CORS(app)

# Charger le modèle
pipe = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-small",
    framework="pt",
    generate_kwargs={"language": "fr"}
)

@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({"error": "Aucun fichier audio trouvé"}), 400
    
    audio_file = request.files['file']
    
    # Créer un fichier temporaire
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
        temp_path = temp_audio.name
        
        # Si c'est un MP3, on le convertit en WAV
        if audio_file.filename.endswith('.mp3'):
            mp3_temp = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
            audio_file.save(mp3_temp.name)
            mp3_temp.close()
            
            audio = AudioSegment.from_mp3(mp3_temp.name)
            audio.export(temp_path, format="wav")
            os.unlink(mp3_temp.name)
        else:
            # Sinon on l'enregistre directement
            audio_file.save(temp_path)
    
    try:
        # Effectuer la transcription
        result = pipe(temp_path)
        transcription = result['text']
        
        # Supprimer le fichier temporaire
        os.unlink(temp_path)
        
        return jsonify({"transcription": transcription})
    except Exception as e:
        os.unlink(temp_path)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True) 