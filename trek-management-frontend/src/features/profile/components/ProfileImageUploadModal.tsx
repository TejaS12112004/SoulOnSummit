import { useState, useRef, useEffect } from 'react';
import { X, Upload, Camera, Loader2 } from 'lucide-react';
import userService from '@/services/userService';
import { useAuth } from '@/hooks/useAuth';

interface ProfileImageUploadModalProps {
  onClose: () => void;
}

export function ProfileImageUploadModal({ onClose }: ProfileImageUploadModalProps) {
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'options' | 'camera' | 'preview'>('options');
  
  // File upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Camera state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // Preview state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Stop camera stream when component unmounts or mode changes
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, [stream]);

  // Attach stream to video element when it becomes available
  useEffect(() => {
    if (mode === 'camera' && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [mode, stream]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 400, height: 400 } 
      });
      setStream(mediaStream);
      setMode('camera');
      // The video element will receive the stream in the useEffect above 
      // once it mounts after the mode state updates.
    } catch (err) {
      console.error('Failed to start camera', err);
      setError('Could not access the camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        // Draw the current video frame onto the canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to blob and file
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `avatar_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(blob));
            stopCamera();
            setMode('preview');
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File is too large. Please select an image under 5MB.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMode('preview');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await userService.updateProfileImage(selectedFile);
      await refreshUser();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to upload profile image.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '450px',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #E5E7EB',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C2B3A', margin: 0, fontFamily: 'inherit' }}>
            Profile Picture
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6B7280' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {error && (
            <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '12px 16px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '24px', fontWeight: 600, width: '100%', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {mode === 'options' && (
            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
              <button 
                onClick={() => fileInputRef.current?.click()}
                style={{
                  flex: 1, padding: '32px 16px', borderRadius: '16px', border: '2px dashed #E5E7EB',
                  background: '#F9FAFB', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '12px', transition: 'all 0.2s', color: '#4B5563', fontFamily: 'inherit'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#1F4D3A'; e.currentTarget.style.color = '#1F4D3A'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#4B5563'; }}
              >
                <Upload size={32} />
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Upload Photo</span>
              </button>
              
              <button 
                onClick={startCamera}
                style={{
                  flex: 1, padding: '32px 16px', borderRadius: '16px', border: '2px dashed #E5E7EB',
                  background: '#F9FAFB', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '12px', transition: 'all 0.2s', color: '#4B5563', fontFamily: 'inherit'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#1F4D3A'; e.currentTarget.style.color = '#1F4D3A'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#4B5563'; }}
              >
                <Camera size={32} />
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Take Photo</span>
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/webp" 
                style={{ display: 'none' }} 
              />
            </div>
          )}

          {mode === 'camera' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ 
                width: '300px', height: '300px', borderRadius: '50%', overflow: 'hidden', 
                background: '#000', marginBottom: '24px', border: '4px solid #1F4D3A' 
              }}>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} 
                />
              </div>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              
              <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                <button
                  onClick={() => { stopCamera(); setMode('options'); }}
                  style={{ flex: 1, padding: '12px', background: '#F3F4F6', color: '#4B5563', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Cancel
                </button>
                <button
                  onClick={capturePhoto}
                  style={{ flex: 2, padding: '12px', background: '#1F4D3A', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Capture
                </button>
              </div>
            </div>
          )}

          {mode === 'preview' && previewUrl && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ 
                width: '250px', height: '250px', borderRadius: '50%', overflow: 'hidden', 
                marginBottom: '24px', border: '4px solid #1F4D3A', background: '#F3F4F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                <button
                  onClick={() => { setPreviewUrl(null); setSelectedFile(null); setMode('options'); }}
                  disabled={loading}
                  style={{ flex: 1, padding: '12px', background: '#F3F4F6', color: '#4B5563', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
                >
                  Retake
                </button>
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  style={{ 
                    flex: 2, padding: '12px', background: '#1F4D3A', color: '#fff', border: 'none', 
                    borderRadius: '12px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit'
                  }}
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  Save Picture
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
