Ce projet permet de transcrire des fichiers audio en texte en utilisant l'intelligence artificielle. Il est composé d'un backend Flask et d'un frontend Next.js.

## Prérequis

- Python 3.9+
- Node.js 18+
- npm ou pnpm (recommandé)

## Structure du projet

```
transcription-project/
├── backend.py             # API Flask pour la transcription
├── requirements.txt       # Dépendances Python
├── audio mp3/             # Dossier pour les exemples audio (optionnel)
├── front/                 # Application frontend Next.js
```

## Installation et démarrage

### Backend (Flask)

1. Créez un environnement virtuel Python (recommandé) :

   ```bash
   python -m venv venv
   ```

2. Activez l'environnement virtuel :

   - Windows :
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux :
     ```bash
     source venv/bin/activate
     ```

3. Installez les dépendances :

   ```bash
   pip install -r requirements.txt
   ```

4. Lancez le serveur Flask :
   ```bash
   python backend.py
   ```
   Le backend sera accessible sur http://localhost:5000

### Frontend (Next.js)

1. Accédez au dossier du frontend :

   ```bash
   cd front
   ```

2. Installez les dépendances :

   ```bash
   npm install
   # ou
   pnpm install
   ```

3. Lancez le serveur de développement Next.js :
   ```bash
   npm run dev
   # ou
   pnpm dev
   ```
   Le frontend sera accessible sur http://localhost:3000

## Utilisation

1. Ouvrez votre navigateur à l'adresse http://localhost:3000
2. Vous pouvez :
   - Uploader un fichier audio (MP3, WAV)
   - Enregistrer un audio directement depuis votre microphone
3. Cliquez sur "Transcrire" pour obtenir le texte transcrit

## Dépannage

- Assurez-vous que le backend et le frontend sont en cours d'exécution simultanément
- Vérifiez que les ports 3000 et 5000 sont disponibles sur votre machine
- Si vous rencontrez des erreurs lors de l'installation des dépendances Python, essayez d'installer PyTorch séparément en suivant les instructions sur [pytorch.org](https://pytorch.org/get-started/locally/)
- Pour l'enregistrement audio, assurez-vous que votre navigateur a accès à votre microphone
