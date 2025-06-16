
import React from 'react';
import { Download, Copy, Brain } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import AIThinkingProcess from './AIThinkingProcess';

interface SpecOutputDisplayProps {
  specData: {
    title: string;
    generatedSpec: string;
  };
  thinkingProcess: string;
  showThinking: boolean;
  onToggleThinking: () => void;
  onCopy: () => void;
  onDownload: () => void;
}

const SpecOutputDisplay: React.FC<SpecOutputDisplayProps> = ({
  specData,
  thinkingProcess,
  showThinking,
  onToggleThinking,
  onCopy,
  onDownload
}) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="border-2 border-black p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">GENERATED SPECIFICATION</h2>
          {specData.generatedSpec && (
            <div className="flex gap-2">
              {thinkingProcess && (
                <button
                  onClick={onToggleThinking}
                  className={`border-2 border-black p-2 transition-colors ${
                    showThinking ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
                  }`}
                  title="Toggle AI thinking process"
                >
                  <Brain className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onCopy}
                className="border-2 border-black p-2 hover:bg-black hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={onDownload}
                className="border-2 border-black p-2 hover:bg-black hover:text-white transition-colors"
                title="Download as text file"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <AIThinkingProcess 
          thinkingProcess={thinkingProcess}
          isVisible={showThinking}
        />
        
        {specData.generatedSpec ? (
          <div className="flex-1 overflow-hidden mt-2">
            <div className="border-2 border-gray-400 p-4 bg-gray-50 h-full overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {specData.generatedSpec}
              </pre>
            </div>
          </div>
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
  );
};

export default SpecOutputDisplay;
