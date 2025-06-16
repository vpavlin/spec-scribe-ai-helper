import React, { useState } from 'react';
import { Send, Download, Copy, Brain } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  const [thinkingProcess, setThinkingProcess] = useState('');
  const [showThinking, setShowThinking] = useState(false);

  const parseAIResponse = (response: string) => {
    // Extract thinking process from <think></think> blocks
    const thinkRegex = /<think>([\s\S]*?)<\/think>/gi;
    const thinkMatches = response.match(thinkRegex);
    
    let thinking = '';
    if (thinkMatches) {
      thinking = thinkMatches
        .map(match => match.replace(/<\/?think>/gi, '').trim())
        .join('\n\n---\n\n');
    }
    
    // Remove thinking blocks from the main response
    const cleanedResponse = response.replace(thinkRegex, '').trim();
    
    return { cleanedResponse, thinking };
  };

  const generateSpec = async () => {
    if (!specData.title.trim() || !specData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setIsGenerating(true);
    setError('');
    setThinkingProcess('');

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

Format the output as a clear, professional specification document in Markdown format.`;

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

      const rawResponse = response.data.choices[0].message.content;
      const { cleanedResponse, thinking } = parseAIResponse(rawResponse);
      
      setSpecData({ ...specData, generatedSpec: cleanedResponse });
      setThinkingProcess(thinking);
      
      // Auto-show thinking if it exists
      if (thinking) {
        setShowThinking(true);
      }
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-screen overflow-hidden">
      {/* Input Section */}
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
          </div>

          <button
            onClick={generateSpec}
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

      {/* Output Section */}
      <div className="flex flex-col h-full overflow-hidden">
        <div className="border-2 border-black p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">GENERATED SPECIFICATION</h2>
            {specData.generatedSpec && (
              <div className="flex gap-2">
                {thinkingProcess && (
                  <button
                    onClick={() => setShowThinking(!showThinking)}
                    className={`border-2 border-black p-2 transition-colors ${
                      showThinking ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
                    }`}
                    title="Toggle AI thinking process"
                  >
                    <Brain className="w-4 h-4" />
                  </button>
                )}
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

          {showThinking && thinkingProcess && (
            <div className="mb-4">
              <div className="border-2 border-gray-400 p-4 bg-gray-50 max-h-[200px] overflow-y-auto">
                <h3 className="text-sm font-bold mb-2">AI THINKING PROCESS:</h3>
                <pre className="whitespace-pre-wrap text-xs font-mono text-gray-700">
                  {thinkingProcess}
                </pre>
              </div>
            </div>
          )}
          
          {specData.generatedSpec ? (
            <Tabs defaultValue="rendered" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="border-2 border-black bg-white">
                <TabsTrigger value="rendered" className="data-[state=active]:bg-black data-[state=active]:text-white">
                  RENDERED
                </TabsTrigger>
                <TabsTrigger value="raw" className="data-[state=active]:bg-black data-[state=active]:text-white">
                  RAW MARKDOWN
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="rendered" className="flex-1 overflow-hidden mt-2">
                <div className="border-2 border-gray-400 p-4 bg-gray-50 h-full overflow-y-auto">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    className="prose prose-sm max-w-none font-mono text-sm"
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-3 border-b pb-2" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2 mt-4" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-2 mt-3" {...props} />,
                      code: ({node, inline, ...props}) => 
                        inline ? 
                          <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono" {...props} /> :
                          <code className="block bg-gray-200 p-2 rounded text-xs font-mono overflow-x-auto" {...props} />,
                      pre: ({node, ...props}) => <pre className="bg-gray-200 p-2 rounded overflow-x-auto" {...props} />,
                      table: ({node, ...props}) => <table className="border-collapse border border-gray-300 w-full text-xs" {...props} />,
                      th: ({node, ...props}) => <th className="border border-gray-300 px-2 py-1 bg-gray-100 font-bold" {...props} />,
                      td: ({node, ...props}) => <td className="border border-gray-300 px-2 py-1" {...props} />,
                    }}
                  >
                    {specData.generatedSpec}
                  </ReactMarkdown>
                </div>
              </TabsContent>
              
              <TabsContent value="raw" className="flex-1 overflow-hidden mt-2">
                <div className="border-2 border-gray-400 p-4 bg-gray-50 h-full overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {specData.generatedSpec}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="border-2 border-gray-400 p-8 text-center text-gray-600 flex-1 flex items-center justify-center">
              <div>
                <p>Generated specification will appear here</p>
                <p className="text-sm mt-2">Fill in the input fields and click "GENERATE SPECIFICATION"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecEditor;
