
import React from 'react';
import { Send } from 'lucide-react';
import TemplateSelector from './TemplateSelector';

interface SpecInputFormProps {
  specData: {
    title: string;
    description: string;
    examples: string;
    selectedTemplates?: string[];
  };
  setSpecData: (data: any) => void;
  documents: Array<{
    id: string;
    name: string;
    content: string;
    uploadDate: string;
  }>;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string;
}

const SpecInputForm: React.FC<SpecInputFormProps> = ({
  specData,
  setSpecData,
  documents,
  onGenerate,
  isGenerating,
  error
}) => {
  const handleTemplateSelectionChange = (selectedTemplates: string[]) => {
    setSpecData({ ...specData, selectedTemplates });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="border-2 border-black p-4 flex flex-col h-full">
        <h2 className="text-xl font-bold mb-4">SPECIFICATION INPUT</h2>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">TITLE</label>
            <input
              type="text"
              value={specData.title}
              onChange={(e) => setSpecData({ ...specData, title: e.target.value })}
              placeholder="e.g., HTTP/2 Protocol Specification"
              className="w-full border-2 border-black p-3 font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">DESCRIPTION</label>
            <textarea
              value={specData.description}
              onChange={(e) => setSpecData({ ...specData, description: e.target.value })}
              placeholder="Describe what this specification covers, its purpose, and key requirements..."
              rows={6}
              className="w-full border-2 border-black p-3 font-mono resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">EXAMPLES / DATA STRUCTURES (OPTIONAL)</label>
            <textarea
              value={specData.examples}
              onChange={(e) => setSpecData({ ...specData, examples: e.target.value })}
              placeholder="Provide example data structures, API calls, or implementation examples..."
              rows={4}
              className="w-full border-2 border-black p-3 font-mono resize-none"
            />
          </div>

          <TemplateSelector
            selectedTemplates={specData.selectedTemplates || []}
            onSelectionChange={handleTemplateSelectionChange}
          />

          {documents.length > 0 && (
            <div className="border-2 border-gray-400 p-3">
              <p className="text-sm font-bold">UPLOADED DOCUMENTS: {documents.length}</p>
              <p className="text-xs text-gray-600">
                {documents.map(doc => doc.name).join(', ')}
              </p>
            </div>
          )}

          {error && (
            <div className="border-2 border-red-600 bg-red-100 p-3">
              <p className="text-red-600 font-bold">ERROR: {error}</p>
            </div>
          )}
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full border-2 border-black py-3 hover:bg-black hover:text-white transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isGenerating ? (
            'GENERATING...'
          ) : (
            <>
              <Send className="inline w-4 h-4 mr-2" />
              GENERATE SPECIFICATION
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SpecInputForm;
