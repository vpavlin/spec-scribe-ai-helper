
import React, { useState } from 'react';
import { X, Upload, Trash2, Download } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  content: string;
  uploadDate: string;
}

interface DocumentManagerProps {
  documents: Document[];
  setDocuments: (documents: Document[]) => void;
  onClose: () => void;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ documents, setDocuments, onClose }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type === 'text/plain' || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newDocument: Document = {
            id: Date.now().toString(),
            name: file.name,
            content: e.target?.result as string,
            uploadDate: new Date().toISOString().split('T')[0]
          };
          setDocuments([...documents, newDocument]);
        };
        reader.readAsText(file);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const downloadDocument = (doc: Document) => {
    const blob = new Blob([doc.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-4 border-black max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b-2 border-black p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">DOCUMENT MANAGER</h2>
          <button
            onClick={onClose}
            className="border-2 border-black p-2 hover:bg-black hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Upload Area */}
          <div
            className={`border-4 border-dashed ${dragOver ? 'border-black bg-gray-100' : 'border-gray-400'} p-8 text-center mb-6`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">DRAG & DROP FILES</h3>
            <p className="mb-4">Drop .txt or .md files here, or click to browse</p>
            <input
              type="file"
              multiple
              accept=".txt,.md"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="border-2 border-black px-6 py-2 hover:bg-black hover:text-white transition-colors cursor-pointer inline-block"
            >
              BROWSE FILES
            </label>
          </div>

          {/* Document List */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold mb-4">UPLOADED DOCUMENTS ({documents.length})</h3>
            {documents.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No documents uploaded yet</p>
            ) : (
              documents.map(doc => (
                <div key={doc.id} className="border-2 border-black p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-bold">{doc.name}</h4>
                    <p className="text-sm text-gray-600">
                      Uploaded: {doc.uploadDate} | Size: {Math.round(doc.content.length / 1024)}KB
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadDocument(doc)}
                      className="border-2 border-black p-2 hover:bg-black hover:text-white transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="border-2 border-black p-2 hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentManager;
