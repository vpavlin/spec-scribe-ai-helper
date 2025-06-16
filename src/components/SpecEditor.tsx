
import React, { useState } from 'react';
import { Send, Download, Copy } from 'lucide-react';
import axios from 'axios';

interface SpecEditorProps {
  config: {
    apiToken: string;
    model: string;
    systemPrompt: string;
  };
  documents: Array<{
    id: string;
    name: string;
    content: string;
    uploadDate: string;
  }>;
  specData: {
    title: string;
    description: string;
    examples: string;
    generatedSpec: string;
  };
  setSpecData: (data: any) => void;
}

const SpecEditor: React.FC<SpecEditorProps> = ({ config, documents, specData, setSpecData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const generateSpec = async () => {
    if (!specData.title.trim() || !specData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const client = axios.create({
        baseURL: 'https://chatapi.akash.network/api/v1',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiToken}`
        }
      });

      // Prepare context from uploaded documents
      const documentContext = documents.length > 0 
        ? `\n\nReference Documents:\n${documents.map(doc => `--- ${doc.name} ---\n${doc.content}`).join('\n\n')}`
        : '';

      const userPrompt = `Please generate a comprehensive technical specification based on the following information:

Title: ${specData.title}

Description:
${specData.description}

${specData.examples ? `Examples/Data Structures:\n${specData.examples}` : ''}
${documentContext}

Please create a well-structured specification document that includes appropriate sections such as:
- Introduction/Overview
- Specification Details
- Implementation Guidelines
- Security Considerations (if applicable)
- References (if applicable)

Format the output as a clear, professional specification document.`;

      const response = await client.post('/chat/completions', {
        model: config.model,
        messages: [
          {
            role: 'system',
            content: config.systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      const generatedSpec = response.data.choices[0].message.content;
      setSpecData({ ...specData, generatedSpec });
    } catch (err: any) {
      console.error('Error generating spec:', err);
      setError(err.response?.data?.error?.message || 'Failed to generate specification. Please check your API token and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSpec = () => {
    if (!specData.generatedSpec) return;
    
    const blob = new Blob([specData.generatedSpec], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${specData.title.replace(/[^a-zA-Z0-9]/g, '_')}_spec.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(specData.generatedSpec);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Input Section */}
      <div className="space-y-6">
        <div className="border-2 border-black p-4">
          <h2 className="text-xl font-bold mb-4">SPECIFICATION INPUT</h2>
          
          <div className="space-y-4">
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
                rows={8}
                className="w-full border-2 border-black p-3 font-mono resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">EXAMPLES / DATA STRUCTURES (OPTIONAL)</label>
              <textarea
                value={specData.examples}
                onChange={(e) => setSpecData({ ...specData, examples: e.target.value })}
                placeholder="Provide example data structures, API calls, or implementation examples..."
                rows={6}
                className="w-full border-2 border-black p-3 font-mono resize-none"
              />
            </div>

            {documents.length > 0 && (
              <div className="border-2 border-gray-400 p-3">
                <p className="text-sm font-bold">ATTACHED DOCUMENTS: {documents.length}</p>
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

            <button
              onClick={generateSpec}
              disabled={isGenerating}
              className="w-full border-2 border-black py-3 hover:bg-black hover:text-white transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>

      {/* Output Section */}
      <div className="space-y-6">
        <div className="border-2 border-black p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">GENERATED SPECIFICATION</h2>
            {specData.generatedSpec && (
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="border-2 border-black p-2 hover:bg-black hover:text-white transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={downloadSpec}
                  className="border-2 border-black p-2 hover:bg-black hover:text-white transition-colors"
                  title="Download as text file"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          {specData.generatedSpec ? (
            <div className="border-2 border-gray-400 p-4 bg-gray-50 max-h-[600px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {specData.generatedSpec}
              </pre>
            </div>
          ) : (
            <div className="border-2 border-gray-400 p-8 text-center text-gray-600">
              <p>Generated specification will appear here</p>
              <p className="text-sm mt-2">Fill in the input fields and click "GENERATE SPECIFICATION"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecEditor;
