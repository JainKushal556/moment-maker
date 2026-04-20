import { useState, useContext, useEffect } from 'react'
import EditorHeader from './EditorHeader'
import ExperienceBuilder from './ExperienceBuilder'
import LivePreviewer from './LivePreviewer'
import { ViewContext } from '../../context/NavContext'
import './editor.css'

export default function EditorView() {
  const [currentView, , selectedTemplate, , templateCustomization, setTemplateCustomization] = useContext(ViewContext)
  const [refreshKey, setRefreshKey] = useState(0)
  const [customization, setCustomization] = useState({
    recipientName: '',
    message: '',
    letterTitle: '',
    letterBody: ''
  })

  // Synchronize with selected template defaults or global saved data
  useEffect(() => {
    if (selectedTemplate) {
      if (templateCustomization && templateCustomization[selectedTemplate.id]) {
        // Load saved customizations
        setCustomization(templateCustomization[selectedTemplate.id])
      } else if (selectedTemplate.id === 'romantic-proposal') {
        // Load proposal-specific defaults
        setCustomization({
          images: selectedTemplate.defaults?.images || [null, null, null, null],
          letterContent: selectedTemplate.defaults?.letterContent || ''
        })
      } else {
        // Load generic defaults
        setCustomization({
          recipientName: '',
          message: selectedTemplate.desc || '',
          letterTitle: 'For you,',
          letterBody: 'I wanted to make something a little different for you, just to remind you how much you mean to me. Thank you for being my person. Thank you for the laughs, the patience, and for sharing your world with me. You are genuinely wonderful, and I hope this little surprise made you smile today.'
        })
      }
    }
  }, [selectedTemplate, templateCustomization])

  const handleUpdate = (key, value) => {
    setCustomization(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    if (selectedTemplate && setTemplateCustomization) {
      setTemplateCustomization(prev => ({ ...prev, [selectedTemplate.id]: customization }))
    }
    // Force a re-render of the LivePreviewer by updating the key
    setRefreshKey(prev => prev + 1)
  }

  // Pre-rendering safety check
  if (currentView !== 'editor') return null

  return (
    <div className="editor-container animate-in fade-in duration-700">
      <EditorHeader />
      
      <main className="editor-main">
        <ExperienceBuilder 
          template={selectedTemplate}
          customization={customization} 
          onUpdate={handleUpdate} 
          onSave={handleSave}
        />
        
        <LivePreviewer 
          template={selectedTemplate} 
          customization={customization} 
          refreshKey={refreshKey}
        />
      </main>
    </div>
  )
}
