import { useState } from 'react';
import { uploadImage } from '@/lib/supabase/galerie';

export default function GalerieUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMsg('Veuillez sélectionner une image.');
      return;
    }
    setLoading(true);
    const result = await uploadImage(file, title, description);
    setLoading(false);
    if (result) {
      setMsg('✅ Image ajoutée avec succès !');
      // optional: reset form
      setFile(null);
      setTitle('');
      setDescription('');
    } else {
      setMsg('❌ Erreur lors de l’ajout de l’image.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-100 rounded-lg shadow-lg max-w-md mx-auto"
    >
      <input
        type="file"
        accept="image/*"
        onChange={e => setFile(e.target.files?.[0] ?? null)}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
        required
      />
      <input
        type="text"
        placeholder="Titre (optionnel)"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <textarea
        placeholder="Description (optionnelle)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition ${loading && 'opacity-60 cursor-not-allowed'}`}
      >
        {loading ? 'En cours…' : 'Envoyer'}
      </button>
      {msg && <p className="mt-2 text-center">{msg}</p>}
    </form>
  );
}
