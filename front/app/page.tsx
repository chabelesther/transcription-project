"use client";

import React, { useState, useRef } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Gestion de l'upload de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Démarrer l'enregistrement
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioFile = new File([audioBlob], "recording.wav", {
          type: "audio/wav",
        });
        setFile(audioFile);

        // Libérer les ressources du microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      setError("Impossible d'accéder au microphone");
      console.error(err);
    }
  };

  // Arrêter l'enregistrement
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Envoyer le fichier audio au backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError(
        "Veuillez sélectionner un fichier audio ou enregistrer un audio"
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:5000/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la transcription");
      }

      setTranscription(data.transcription);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="bg-white shadow-xl rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Transcription Audio
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block font-medium text-gray-700">
              Uploader un fichier audio
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </label>

            <div className="text-center">
              <p className="text-gray-500 my-2">OU</p>
            </div>

            <div className="flex justify-center space-x-4">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Enregistrer Audio
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Arrêter l'enregistrement
                </button>
              )}
            </div>

            {file && (
              <p className="text-sm text-gray-500">
                Fichier sélectionné: {file.name}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading || !file}
              className={`px-6 py-2 rounded-md text-white ${
                isLoading || !file
                  ? "bg-blue-300"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              }`}
            >
              {isLoading ? "Transcription en cours..." : "Transcrire"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {transcription && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">
              Résultat de la transcription
            </h2>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
              <p>{transcription}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
