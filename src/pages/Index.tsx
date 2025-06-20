
import React, { useState, useEffect } from 'react';
import { Settings, FileText, Send, Download } from 'lucide-react';
import ConfigModal from '../components/ConfigModal';
import DocumentManager from '../components/DocumentManager';
import SpecEditor from '../components/SpecEditor';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Index = () => {
  const [showConfig, setShowConfig] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [config, setConfig] = useLocalStorage('spec-config', {
    apiToken: '',
    model: '',
    systemPrompt: 'You are a technical specification writer. Help create clear, comprehensive, and well-structured specifications based on the provided information. Follow standard RFC format and include all necessary sections like Introduction, Specification, Implementation, Security Considerations, and References.'
  });
  const [documents, setDocuments] = useLocalStorage('spec-documents', []);
  const [specData, setSpecData] = useLocalStorage('current-spec', {
    title: '',
    description: '',
    examples: '',
    generatedSpec: '',
    selectedTemplates: []
  });

  // Check if config is set up
  const isConfigured = config.apiToken && config.model;

  return (
    <div className="h-screen bg-white text-black font-mono flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b-2 border-black p-4 flex-shrink-0">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold">RFC/SPEC GENERATOR</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowDocuments(true)}
              className="border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
            >
              <FileText className="inline w-4 h-4 mr-2" />
              DOCUMENTS
            </button>
            <button
              onClick={() => setShowConfig(true)}
              className="border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
            >
              <Settings className="inline w-4 h-4 mr-2" />
              CONFIG
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 w-full overflow-hidden">
        {!isConfigured ? (
          <div className="border-2 border-black p-8 text-center h-full flex items-center justify-center">
            <div>
              <h2 className="text-xl font-bold mb-4">CONFIGURATION REQUIRED</h2>
              <p className="mb-4">Please configure your Akash Chat API settings to get started.</p>
              <button
                onClick={() => setShowConfig(true)}
                className="border-2 border-black px-6 py-3 hover:bg-black hover:text-white transition-colors"
              >
                OPEN CONFIG
              </button>
            </div>
          </div>
        ) : (
          <SpecEditor 
            config={config}
            documents={documents}
            specData={specData}
            setSpecData={setSpecData}
          />
        )}
      </main>

      {/* Modals */}
      {showConfig && (
        <ConfigModal
          config={config}
          setConfig={setConfig}
          onClose={() => setShowConfig(false)}
        />
      )}

      {showDocuments && (
        <DocumentManager
          documents={documents}
          setDocuments={setDocuments}
          onClose={() => setShowDocuments(false)}
        />
      )}
    </div>
  );
};

export default Index;
