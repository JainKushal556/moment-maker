import { useState, useContext, useEffect } from 'react'
import EditorHeader from './EditorHeader'
import DynamicFormBuilder from './DynamicFormBuilder'
import LivePreviewer from './LivePreviewer'
import { ViewContext } from '../../context/NavContext'
import { useAuth } from '../../context/AuthContext'
import { saveMoment, updateMoment } from '../../services/api'
import { uploadImage, getFirebaseToken, base64ToFile } from '../../services/cloudinary'
import './editor.css'

export default function EditorView() {
  const [currentView, navigateTo, selectedTemplate, setSelectedTemplate, templateCustomization, setTemplateCustomization, transitionRef, sharedMomentId, setSharedMomentId, editingMomentId, setEditingMomentId] = useContext(ViewContext)
  const { currentUser, openAuthModal } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)
  const [customization, setCustomization] = useState({
    recipientName: '',
    message: '',
    letterTitle: '',
    letterBody: ''
  })
  const [saveStatus, setSaveStatus] = useState('idle')

  // Synchronize with selected template defaults or global saved data
  useEffect(() => {
    if (selectedTemplate) {
      if (templateCustomization && templateCustomization[selectedTemplate.id]) {
        // Load saved customizations
        setCustomization(templateCustomization[selectedTemplate.id])
        setSaveStatus('saved') // Mark as saved if loading existing data
      } else if (selectedTemplate.id === 'romantic-proposal') {
        // Load proposal-specific defaults
        setCustomization({
          images: selectedTemplate.defaults?.images || [null, null, null, null],
          letterContent: selectedTemplate.defaults?.letterContent || ''
        })
        setSaveStatus('idle')
      } else {
        // Load generic defaults based on schema or template desc
        const defaults = {}
        if (selectedTemplate.schema) {
          selectedTemplate.schema.forEach(field => {
            defaults[field.stateKey] = selectedTemplate.defaults?.[field.stateKey] || ''
          })
        }
        setCustomization(defaults)
        setSaveStatus('idle')
      }
    }
  }, [selectedTemplate, templateCustomization])

  const handleUpdate = (key, value) => {
    setCustomization(prev => ({ ...prev, [key]: value }))
    setSaveStatus('idle') // Any change resets the save status to allow re-saving
  }

  const handleSave = async () => {
    if (!currentUser) {
        openAuthModal()
        return
    }

    if (!selectedTemplate) return

    setSaveStatus('saving')
    try {
        // 1. Prepare customization (strictly following schema)
        const schemaKeys = selectedTemplate.schema.map(f => f.stateKey)
        const filteredCustomization = {}
        
        // Only keep keys that are in the schema
        schemaKeys.forEach(key => {
            if (customization[key] !== undefined) {
                filteredCustomization[key] = customization[key]
            }
        })

        const token = await getFirebaseToken()

        // Scan for base64 images and upload them in the filtered data
        for (const key in filteredCustomization) {
            const value = filteredCustomization[key]
            
            if (Array.isArray(value)) {
                const newArray = [...value]
                let changed = false
                for (let i = 0; i < newArray.length; i++) {
                    if (typeof newArray[i] === 'string' && newArray[i].startsWith('data:image')) {
                        const file = base64ToFile(newArray[i], `image_${i}.jpg`)
                        const url = await uploadImage(file, token)
                        newArray[i] = url
                        changed = true
                    }
                }
                if (changed) filteredCustomization[key] = newArray
            } 
            else if (typeof value === 'string' && value.startsWith('data:image')) {
                const file = base64ToFile(value, 'image.jpg')
                const url = await uploadImage(file, token)
                filteredCustomization[key] = url
            }
        }

        // 2. Prepare payload
        const momentData = {
            templateId: selectedTemplate.id,
            customization: filteredCustomization,
            status: 'draft',
            title: selectedTemplate.title
        }

        // 3. Save or Update in database
        let savedMoment
        if (editingMomentId) {
            savedMoment = await updateMoment(editingMomentId, momentData)
        } else {
            savedMoment = await saveMoment(momentData)
            if (savedMoment?.id) {
                setEditingMomentId(savedMoment.id)
            }
        }

        // 4. Update local state
        if (setTemplateCustomization) {
            setTemplateCustomization(prev => ({ ...prev, [selectedTemplate.id]: filteredCustomization }))
        }
        setCustomization(filteredCustomization)
        setSaveStatus('saved')
        
        // Force a re-render of the LivePreviewer
        setRefreshKey(prev => prev + 1)
        
        return true // Success
    } catch (error) {
        console.error("Failed to save moment:", error)
        setSaveStatus('idle')
        alert("Something went wrong! Save failed. Please try again.")
        return false // Failed
    }
  }

  // Pre-rendering safety check
  if (currentView !== 'editor') return null

  return (
    <div className="editor-container animate-in fade-in duration-700">
      <EditorHeader />
      
      <main className="editor-main">
        <DynamicFormBuilder 
          template={selectedTemplate}
          customization={customization} 
          onUpdate={handleUpdate} 
          onSave={handleSave}
          saveStatus={saveStatus}
          setSaveStatus={setSaveStatus}
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
