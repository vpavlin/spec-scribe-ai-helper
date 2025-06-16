
import React from 'react';

interface AIThinkingProcessProps {
  thinkingProcess: string;
  isVisible: boolean;
}

const AIThinkingProcess: React.FC<AIThinkingProcessProps> = ({
  thinkingProcess,
  isVisible
}) => {
  if (!isVisible || !thinkingProcess) return null;

  return (
    <div className="mb-4">
      <div className="border-2 border-gray-400 p-4 bg-gray-50 max-h-[200px] overflow-y-auto">
        <h3 className="text-sm font-bold mb-2">AI THINKING PROCESS:</h3>
        <pre className="whitespace-pre-wrap text-xs font-mono text-gray-700">
          {thinkingProcess}
        </pre>
      </div>
    </div>
  );
};

export default AIThinkingProcess;
