'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const S = {
  navy: '#0a1628',
  navyMid: '#0f1e38',
  teal: '#2e86ab',
  tealBright: '#38a3cc',
  gold: '#c9a84c',
  white: '#f0f4f8',
  muted: '#8899aa',
  border: 'rgba(46,134,171,0.25)',
  error: '#ef4444',
} as const;

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Scanning your entries for IEEPA codes...');

  const loadingMessages = [
    'Scanning your entries for IEEPA codes...',
    'Checking HTS codes against IEEPA database...',
    'Calculating refund estimates...',
    'Validating entry dates against ruling window...',
    'Checking for duplicate entries...',
    'Almost done — preparing your results...',
  ];

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  function handleFileSelect(file: File) {
    setError(null);
    const ext = file.name.toLowerCase().split('.').pop();
    if (!['csv', 'xlsx', 'xls'].includes(ext ?? '')) {
      setError('Please upload a .csv or .xlsx file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB.');
      return;
    }
    setSelectedFile(file);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }

  async function handleSubmit() {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }
    setError(null);
    setLoading(true);
    setLoadingMessage(loadingMessages[0]);

    // Cycle through loading messages
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = Math.min(msgIdx + 1, loadingMessages.length - 1);
      setLoadingMessage(loadingMessages[msgIdx]);
    }, 1200);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? 'Upload failed. Please try again.');
      }

      router.push(`/results/${json.auditId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: S.navy }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          {/* Spinner */}
          <div style={{ width: 56, height: 56, border: `4px solid ${S.border}`, borderTopColor: S.tealBright, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 2rem' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: S.white, marginBottom: '0.75rem' }}>
            Analyzing your entries
          </h2>
          <p style={{ color: S.muted, fontSize: '0.95rem', lineHeight: 1.6 }}>{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: S.navy }}>
      {/* Header */}
      <nav style={{ backgroundColor: S.navyMid, borderBottom: `1px solid ${S.border}`, padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center' }}>
        <Link href="/" style={{ fontWeight: 700, color: S.white, textDecoration: 'none', fontSize: '1.1rem' }}>
          IEEPA<span style={{ color: S.tealBright }}>Refund</span>
        </Link>
      </nav>

      <main style={{ maxWidth: 700, margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: S.white, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            Upload your customs entry data
          </h1>
          <p style={{ color: S.muted, lineHeight: 1.7, fontSize: '1rem' }}>
            Upload your ACE Entry Summary Details Report (ES-003) or any CSV with entry number, HTS code, and duty amount columns. We will identify IEEPA duties and calculate your refund estimate instantly — free.
          </p>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragActive ? S.tealBright : selectedFile ? S.teal : S.border}`,
            borderRadius: 12,
            padding: '3rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: dragActive ? 'rgba(46,134,171,0.08)' : selectedFile ? 'rgba(46,134,171,0.05)' : 'transparent',
            transition: 'all 0.15s',
            marginBottom: '1.5rem',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />
          {selectedFile ? (
            <>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>&#128196;</div>
              <div style={{ fontWeight: 700, color: S.white, fontSize: '1.05rem', marginBottom: '0.35rem' }}>
                {selectedFile.name}
              </div>
              <div style={{ color: S.muted, fontSize: '0.85rem' }}>
                {(selectedFile.size / 1024).toFixed(0)} KB — click to change
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', color: S.teal }}>&#8679;</div>
              <div style={{ fontWeight: 600, color: S.white, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                Drag and drop your file here
              </div>
              <div style={{ color: S.muted, fontSize: '0.9rem' }}>
                or click to browse — .csv or .xlsx accepted
              </div>
            </>
          )}
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#fca5a5', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {/* Info boxes */}
        <div style={{ backgroundColor: S.navyMid, border: `1px solid ${S.border}`, borderRadius: 8, padding: '1.25rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: S.muted, lineHeight: 1.7 }}>
          <strong style={{ color: S.white, display: 'block', marginBottom: '0.5rem' }}>How to export from ACE</strong>
          Log in to ACE at <a href="https://ace.cbp.dhs.gov" target="_blank" rel="noopener noreferrer" style={{ color: S.tealBright }}>ace.cbp.dhs.gov</a> → Reports → Entry Summary → Entry Summary Details (ES-003). Export as CSV. Columns needed: Entry Summary Number, Entry Date, HTS Code, Duty Amount.{' '}
          <a href="https://www.cbp.gov/trade/automated/ace-help" target="_blank" rel="noopener noreferrer" style={{ color: S.tealBright }}>
            ACE help documentation
          </a>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {[
            'Entry number',
            'HTS code',
            'Duty amount',
            'Entry date',
          ].map((col) => (
            <div key={col} style={{ backgroundColor: 'rgba(46,134,171,0.1)', border: `1px solid ${S.border}`, borderRadius: 6, padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: S.tealBright }}>
              {col}
            </div>
          ))}
          <div style={{ fontSize: '0.8rem', color: S.muted, alignSelf: 'center' }}>
            + country of origin, port code, description (optional)
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedFile}
          style={{
            width: '100%',
            padding: '1.1rem',
            backgroundColor: selectedFile ? S.teal : S.border,
            color: S.white,
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: '1.05rem',
            cursor: selectedFile ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.15s',
          }}
        >
          Analyze My Entries →
        </button>

        <p style={{ textAlign: 'center', color: S.muted, marginTop: '1rem', fontSize: '0.8rem' }}>
          Your data is processed securely and never shared. Refund estimate is always free.
        </p>

        {/* Not sure you qualify? */}
        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <Link href="/guides/ior-check" style={{ color: S.teal, textDecoration: 'none', fontSize: '0.9rem' }}>
            Not sure if you qualify? Check your eligibility →
          </Link>
        </div>
      </main>
    </div>
  );
}
