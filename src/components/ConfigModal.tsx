
import React, { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { fetchAvailableModels, AkashModel } from '../services/akashApi';

interface ConfigModalProps {
  config: {
    apiToken: string;
    model: string;
    systemPrompt: string;
  };
  setConfig: (config: any) => void;
  onClose: () => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ config, setConfig, onClose }) => {
  const [formData, setFormData] = useState(config);
  const [availableModels, setAvailableModels] = useState<AkashModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelsError, setModelsError] = useState('');

  const loadModels = async () => {
    if (!formData.apiToken.trim()) {
      setModelsError('API token is required to load models');
      return;
    }

    setLoadingModels(true);
    setModelsError('');
    
    try {
      const models = await fetchAvailableModels(formData.apiToken);
      setAvailableModels(models);
      
      // If current model is not in the list and we have models, select the first one
      if (models.length > 0 && !models.find(m => m.id === formData.model)) {
        setFormData({ ...formData, model: models[0].id });
      }
    } catch (error: any) {
      console.error('Error loading models:', error);
      setModelsError(error.response?.data?.error?.message || 'Failed to load models. Please check your API token.');
    } finally {
      setLoadingModels(false);
    }
  };

  // Auto-load models when API token changes
  useEffect(() => {
    if (formData.apiToken && formData.apiToken !== config.apiToken) {
      loadModels();
    }
  }, [formData.apiToken]);

  // Load models on mount if we have an API token
  useEffect(() => {
    if (formData.apiToken) {
      loadModels();
    }
  }, []);

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
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold">MODEL</label>
              <button
                onClick={loadModels}
                disabled={loadingModels || !formData.apiToken}
                className="border-2 border-black px-3 py-1 text-xs hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingModels ? (
                  <>
                    <RefreshCw className="inline w-3 h-3 mr-1 animate-spin" />
                    LOADING...
                  </>
                ) : (
                  <>
                    <RefreshCw className="inline w-3 h-3 mr-1" />
                    REFRESH MODELS
                  </>
                )}
              </button>
            </div>
            
            {modelsError && (
              <div className="border-2 border-red-600 bg-red-100 p-2 mb-2">
                <p className="text-red-600 text-xs font-bold">{modelsError}</p>
              </div>
            )}
            
            <select
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full border-2 border-black p-3 font-mono bg-white"
              disabled={availableModels.length === 0}
            >
              {availableModels.length === 0 ? (
                <option value="">No models available - check API token</option>
              ) : (
                availableModels.map(model => (
                  <option key={model.id} value={model.id}>{model.id}</option>
                ))
              )}
            </select>
            <p className="text-xs mt-1">
              {availableModels.length > 0 
                ? `${availableModels.length} models loaded` 
                : 'Enter API token and click "REFRESH MODELS" to load available models'
              }
            </p>
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
