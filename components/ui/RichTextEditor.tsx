'use client'

import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { normalizeRichTextInput } from '@/lib/rich-text'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  label: string
  name: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  value: string
}

interface ToolbarButtonProps {
  active?: boolean
  label: string
  onClick: () => void
}

function ToolbarButton({ active, label, onClick }: ToolbarButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition',
        active
          ? 'border-[#1D9E75] bg-[#1D9E75] text-white shadow-[0_10px_22px_-14px_rgba(29,158,117,0.8)]'
          : 'border-[#d8d2c6] bg-white text-neutral-700 hover:border-[#1D9E75] hover:text-[#1D9E75]'
      )}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}

export function RichTextEditor({
  label,
  name,
  onChange,
  placeholder,
  required,
  value
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [3]
        }
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        protocols: ['http', 'https', 'mailto']
      })
    ],
    editorProps: {
      attributes: {
        class:
          'rich-editor__content prose prose-neutral max-w-none min-h-[220px] px-4 py-4 text-base leading-8 text-neutral-700 focus:outline-none'
      }
    },
    content: normalizeRichTextInput(value),
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML())
    }
  })

  useEffect(() => {
    if (!editor) {
      return
    }

    const normalized = normalizeRichTextInput(value)
    if (editor.getHTML() !== normalized) {
      editor.commands.setContent(normalized)
    }
  }, [editor, value])

  function setLink() {
    if (!editor) {
      return
    }

    const previousUrl = editor.getAttributes('link').href as string | undefined
    const nextUrl = window.prompt('Entrer le lien', previousUrl ?? 'https://')

    if (nextUrl === null) {
      return
    }

    if (!nextUrl.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: nextUrl.trim() }).run()
  }

  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium tracking-wide text-neutral-900">{label}</span>
      <input name={name} readOnly type="hidden" value={value} />
      <div className="overflow-hidden rounded-2xl border border-[#d7d2c6] bg-[#f5f1e8]">
        <div className="flex flex-wrap gap-2 border-b border-[#ded8ca] px-3 py-3">
          <ToolbarButton
            active={editor?.isActive('bold')}
            label="Gras"
            onClick={() => editor?.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            active={editor?.isActive('italic')}
            label="Italique"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            active={editor?.isActive('bulletList')}
            label="Puces"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            active={editor?.isActive('orderedList')}
            label="1. 2. 3."
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          />
          <ToolbarButton
            active={editor?.isActive('link')}
            label="Lien"
            onClick={setLink}
          />
          <ToolbarButton
            active={editor?.isActive('heading', { level: 3 })}
            label="Titre H3"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          />
        </div>
        <EditorContent editor={editor} />
      </div>
      {placeholder ? <span className="text-xs text-neutral-500">{placeholder}</span> : null}
      {required ? <span className="sr-only">Champ requis</span> : null}
    </label>
  )
}
