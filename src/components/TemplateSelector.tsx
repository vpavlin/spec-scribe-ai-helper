
import React, { useState, useEffect } from 'react';
import { FileText, Check } from 'lucide-react';
import { Checkbox } from './ui/checkbox';

interface Template {
  id: string;
  name: string;
  content: string;
  description?: string;
}

interface TemplateSelectorProps {
  selectedTemplates: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplates,
  onSelectionChange
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      // Load the template index file that lists all available templates
      const response = await fetch('/templates/index.json');
      if (response.ok) {
        const templateList = await response.json();
        
        // Load content for each template
        const loadedTemplates = await Promise.all(
          templateList.map(async (template: any) => {
            try {
              const contentResponse = await fetch(`/templates/${template.file}`);
              const content = await contentResponse.text();
              return {
                id: template.id,
                name: template.name,
                description: template.description,
                content
              };
            } catch (error) {
              console.error(`Failed to load template ${template.file}:`, error);
              return null;
            }
          })
        );
        
        setTemplates(loadedTemplates.filter(Boolean));
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateToggle = (templateId: string) => {
    const newSelection = selectedTemplates.includes(templateId)
      ? selectedTemplates.filter(id => id !== templateId)
      : [...selectedTemplates, templateId];
    
    onSelectionChange(newSelection);
  };

  if (loading) {
    return (
      <div className="border-2 border-gray-400 p-4 text-center">
        <p>Loading templates...</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="border-2 border-gray-400 p-4 text-center text-gray-600">
        <FileText className="w-8 h-8 mx-auto mb-2" />
        <p className="text-sm">No templates available</p>
        <p className="text-xs mt-1">Add .md files to /public/templates/ folder</p>
      </div>
    );
  }

  return (
    <div className="border-2 border-gray-400 p-4">
      <h3 className="text-sm font-bold mb-3">AVAILABLE TEMPLATES ({templates.length})</h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {templates.map(template => (
          <div key={template.id} className="flex items-start space-x-2">
            <Checkbox
              id={template.id}
              checked={selectedTemplates.includes(template.id)}
              onCheckedChange={() => handleTemplateToggle(template.id)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <label 
                htmlFor={template.id}
                className="text-sm font-medium cursor-pointer"
              >
                {template.name}
              </label>
              {template.description && (
                <p className="text-xs text-gray-600 mt-1">{template.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedTemplates.length > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-300">
          <p className="text-xs text-gray-600">
            {selectedTemplates.length} template{selectedTemplates.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
