
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ConfigModalProps {
  config: {
    apiToken: string;
    model: string;
    systemPrompt: string;
  };
  setConfig: (config: any) => void;
  onClose: () => void;
}

const AVAILABLE_MODELS = [
  'Meta-Llama-3-1-8B-Instruct-FP8',
  'Meta-Llama-3-1-70B-Instruct-FP8',
  'Meta-Llama-3-1-405B-Instruct-FP8',
];

const ConfigModal: React.FC<ConfigModalProps> = ({ config, setConfig, onClose }) => {
  const [formData, setFormData] = useState(config);

  const handleSave = () => {
    setConfig(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-4 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="border-b-2 border-black p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">CONFIGURATION</h2>
          <button
            onClick={onClose}
            className="border-2 border-black p-2 hover:bg-black hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* API Token */}
          <div>
            <label className="block text-sm font-bold mb-2">
              AKASH CHAT API TOKEN
            </label>
            <input
              type="password"
              value={formData.apiToken}
              onChange={(e) => setFormData({ ...formData, apiToken: e.target.value })}
              placeholder="sk-xxxxxxxx"
              className="w-full border-2 border-black p-3 font-mono"
            />
            <p className="text-xs mt-1">Enter your Akash Chat API bearer token</p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-bold mb-2">
              MODEL
            </label>
            <select
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full border-2 border-black p-3 font-mono bg-white"
            >
              {AVAILABLE_MODELS.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-sm font-bold mb-2">
              SYSTEM PROMPT
            </label>
            <textarea
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              rows={8}
              className="w-full border-2 border-black p-3 font-mono resize-none"
            />
            <p className="text-xs mt-1">Instructions for the AI on how to write specifications</p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 border-2 border-black py-3 hover:bg-black hover:text-white transition-colors font-bold"
            >
              SAVE CONFIG
            </button>
            <button
              onClick={onClose}
              className="flex-1 border-2 border-black py-3 hover:bg-gray-200 transition-colors"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;
