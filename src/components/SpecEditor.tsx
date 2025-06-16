
import React, { useState } from 'react';
import axios from 'axios';
import SpecInputForm from './SpecInputForm';
import SpecOutputDisplay from './SpecOutputDisplay';
import { parseAIResponse } from '../utils/aiResponseParser';

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
      <SpecInputForm
        specData={specData}
        setSpecData={setSpecData}
        documents={documents}
        onGenerate={generateSpec}
        isGenerating={isGenerating}
        error={error}
      />
      
      <SpecOutputDisplay
        specData={specData}
        thinkingProcess={thinkingProcess}
        showThinking={showThinking}
        onToggleThinking={() => setShowThinking(!showThinking)}
        onCopy={copyToClipboard}
        onDownload={downloadSpec}
      />
    </div>
  );
};

export default SpecEditor;
