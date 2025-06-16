
import React from 'react';
import { Download, Copy, Brain } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  );
};

export default SpecOutputDisplay;
