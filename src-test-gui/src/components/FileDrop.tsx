import React, { useRef, useState } from 'react';

type FileDropProps = {
    onFiles: (files: string) => void;
    multiple?: boolean;
    className?: string;
    children: React.ReactNode;
};

export const FileDrop: React.FC<FileDropProps> = ({ onFiles, multiple = false, className, children }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const ref = useRef<HTMLInputElement | null>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    const prevent = (e: React.DragEvent): void => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e: React.DragEvent): Promise<void> => {
        prevent(e);
        setIsDragging(false);
        const dt = e.dataTransfer;
        if (!dt) {
            return;
        }
        const files = Array.from(dt.files);
        setError('');
        if (!files || files.length === 0) {
            return;
        }
        const file = files[0];
        // Optional: nur .json akzeptieren
        if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
            setError('Not a valid json file');
            setTimeout(() => setError(''), 5000);
            return;
        }
        try {
            onFiles(await file.text());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Fehler beim Einlesen der Datei.');
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleInput = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setError('');
        if (!files || files.length === 0) {
            return;
        }
        const file = files[0];
        // Optional: nur .json akzeptieren
        if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
            setError('Not a valid json file');
            setTimeout(() => setError(''), 5000);
            return;
        }
        try {
            onFiles(await file.text());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Fehler beim Einlesen der Datei.');
            setTimeout(() => setError(''), 5000);
        }
        // reset so gleiche Datei erneut gewählt werden kann
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div
            ref={ref}
            className={className}
            onDragEnter={e => {
                prevent(e);
                setSize({
                    width: (ref.current?.clientWidth || 100) - 10,
                    height: (ref.current?.clientHeight || 100) - 10,
                });
                setIsDragging(true);
            }}
            onDragOver={e => prevent(e)}
            onDragLeave={e => {
                prevent(e);
                setIsDragging(false);
            }}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            style={{
                border: '1px dashed #888',
                padding: 5,
                textAlign: 'center' as const,
                background: isDragging ? '#f0f8ff' : 'transparent',
                position: 'relative',
                width: isDragging ? size.width : undefined,
                height: isDragging ? size.height : undefined,
            }}
        >
            <input
                ref={inputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleInput}
                accept="application/json"
                multiple={multiple}
            />
            <div
                style={{
                    fontSize: isDragging ? 24 : 14,
                    color: error ? 'red' : '#222',
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: isDragging ? 0 : 5,
                    right: 0,
                    bottom: isDragging ? 0 : undefined,
                    width: '100%',
                    textAlign: 'center',
                    cursor: 'pointer',
                }}
                onClick={() => inputRef.current?.click()}
            >
                {error || (isDragging ? 'Drop file here ...' : 'Drag & Drop file here')}
            </div>
            {isDragging ? null : children}
        </div>
    );
};
