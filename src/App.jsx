import React, { useState } from 'react';
import './App.css';

function App() {
  // const [apiKey, setApiKey] = useState(''); // Removed as per request
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [useMock, setUseMock] = useState(false);

  const [transcript, setTranscript] = useState(null); // { items: [], fullText: '' }
  const [translatedText, setTranslatedText] = useState('');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const extractVideoId = (inputUrl) => {
    try {
      const urlObj = new URL(inputUrl);
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      } else if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.slice(1);
      }
    } catch (e) { return null; }
    return null;
  };

  const handleProcess = async () => {
    setError('');
    setTranslatedText('');
    setStatus('');

    const vId = extractVideoId(url);
    if (!vId) {
      setError('Invalid YouTube URL');
      return;
    }
    setVideoId(vId);
    setLoading(true);

    try {
      // 1. Get Transcript
      setStatus('Fetching Transcript...');
      const transRes = await fetch(`http://localhost:3000/transcript?videoId=${vId}`);
      if (!transRes.ok) throw new Error('Failed to fetch transcript');
      const transData = await transRes.json();

      setTranscript(transData);

      // 2. Translate
      if (!transData.fullText) {
        throw new Error('Transcript empty, cannot translate.');
      }

      setStatus(`Translating to ${targetLang}...`);
      const translateRes = await fetch('http://localhost:3000/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: transData.fullText,
          targetLanguage: targetLang,
          useMock: useMock
        })
      });

      if (!translateRes.ok) {
        const err = await translateRes.json();
        throw new Error(err.error || 'Translation failed');
      }

      const transResult = await translateRes.json();
      setTranslatedText(transResult.translatedText);
      setStatus('Done!');

    } catch (err) {
      setError(err.message);
      setStatus('Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>YouTube Transcript Translator</h1>

      {/* Configuration Section */}
      <div style={{ background: '#eee', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>


        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="YouTube URL (e.g. https://www.youtube.com/watch?v=...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ flexGrow: 1, padding: '0.5rem' }}
          />
          <input
            type="text"
            placeholder="Target Language (e.g. French)"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            style={{ width: '150px', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>
            <input
              type="checkbox"
              checked={useMock}
              onChange={(e) => setUseMock(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Use Mock Translation (No OpenAI Cost)
          </label>
        </div>

        <button
          onClick={handleProcess}
          disabled={loading}
          style={{
            padding: '0.75rem 2rem',
            background: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Processing...' : 'Get Transcript & Translate'}
        </button>
      </div>

      {status && <div style={{ marginBottom: '1rem', fontStyle: 'italic' }}>Status: {status}</div>}
      {error && <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 'bold' }}>Error: {error}</div>}

      {/* Results Section */}
      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Original */}
        <div style={{ flex: 1 }}>
          <h3>Original Transcript</h3>
          <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '4px', height: '400px', overflowY: 'auto', border: '1px solid #ddd' }}>
            {transcript ? (
              transcript.items.map((item, i) => (
                <p key={i} style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                  <span style={{ color: '#888', marginRight: '0.5rem' }}>{Math.floor(item.offset / 1000)}s:</span>
                  {item.text}
                </p>
              ))
            ) : <p style={{ color: '#999' }}>No transcript yet.</p>}
          </div>
        </div>

        {/* Translated */}
        <div style={{ flex: 1 }}>
          <h3>Translated ({targetLang})</h3>
          <div style={{ background: '#f0f8ff', padding: '1rem', borderRadius: '4px', height: '400px', overflowY: 'auto', border: '1px solid #b0d4ff' }}>
            {translatedText ? (
              <div style={{ whiteSpace: 'pre-wrap' }}>{translatedText}</div>
            ) : <p style={{ color: '#999' }}>Translation will appear here.</p>}
          </div>
        </div>
      </div>

    </div>
  )
}

export default App
