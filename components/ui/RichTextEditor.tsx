'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef, useState, useTransition } from 'react'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextAlign from '@tiptap/extension-text-align'
import { FontSize, TextStyle } from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Palette,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Table as TableIcon,
  Underline as UnderlineIcon,
  Undo2,
  Highlighter
} from 'lucide-react'
import { uploadAnnouncementEditorImage } from '@/app/actions/announcement-editor'
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
  disabled?: boolean
  active?: boolean
  children: ReactNode
  title: string
  onClick: () => void
}

function ToolbarButton({ active, children, disabled, title, onClick }: ToolbarButtonProps) {
  return (
    <button
      aria-label={title}
      className={cn(
        'relative inline-flex h-8 w-8 items-center justify-center rounded p-1.5 transition',
        active
          ? 'bg-green-100 text-[#1D9E75]'
          : 'text-[#04342C] hover:bg-gray-200',
        disabled && 'cursor-not-allowed opacity-45 hover:bg-transparent'
      )}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      title={title}
      type="button"
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="mx-1 h-5 w-px bg-gray-300" />
}

const FONT_SIZE_OPTIONS = [
  { label: 'Small', value: '14px' },
  { label: 'Normal', value: '16px' },
  { label: 'Large', value: '18px' },
  { label: 'Huge', value: '24px' }
] as const

const HEADING_OPTIONS = [
  { label: 'Paragraph', value: 'paragraph' },
  { label: 'H2', value: 'h2' },
  { label: 'H3', value: 'h3' }
] as const

export function RichTextEditor({
  label,
  name,
  onChange,
  placeholder,
  required,
  value
}: RichTextEditorProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const textColorInputRef = useRef<HTMLInputElement | null>(null)
  const highlightColorInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploadingImage, startImageUpload] = useTransition()
  const [toolbarKey, setToolbarKey] = useState(0)
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3]
        }
      }),
      Underline,
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({
        multicolor: true
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        protocols: ['http', 'https', 'mailto']
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Image.configure({
        inline: false
      }),
      Table.configure({
        resizable: true
      }),
      TableRow,
      TableHeader,
      TableCell
    ],
    editorProps: {
      attributes: {
        class:
          'rich-editor__content prose prose-neutral max-w-none min-h-[220px] px-4 py-4 text-base leading-8 text-neutral-700 focus:outline-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-xl prose-h3:text-lg prose-p:text-neutral-700 prose-li:text-neutral-700 prose-blockquote:border-l-4 prose-blockquote:border-brand-200 prose-blockquote:text-neutral-600 prose-strong:text-neutral-900 prose-a:text-[#1D9E75] prose-table:w-full prose-table:border-collapse prose-td:border prose-td:border-[#d7d2c6] prose-td:p-2 prose-th:border prose-th:border-[#d7d2c6] prose-th:bg-[#f1ede4] prose-th:p-2'
      }
    },
    content: normalizeRichTextInput(value),
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML())
      setToolbarKey((currentKey) => currentKey + 1)
    },
    onSelectionUpdate: () => {
      setToolbarKey((currentKey) => currentKey + 1)
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

  const currentHeading = !editor
    ? 'paragraph'
    : editor.isActive('heading', { level: 2 })
      ? 'h2'
      : editor.isActive('heading', { level: 3 })
        ? 'h3'
        : 'paragraph'

  const currentFontSize = (editor?.getAttributes('textStyle').fontSize as string | undefined) ?? '16px'
  const currentTextColor = (editor?.getAttributes('textStyle').color as string | undefined) ?? '#04342C'
  const currentHighlightColor = (editor?.getAttributes('highlight').color as string | undefined) ?? '#FFF59D'

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

  function handleHeadingChange(value: string) {
    if (!editor) {
      return
    }

    const chain = editor.chain().focus()

    if (value === 'paragraph') {
      chain.setParagraph().run()
      return
    }

    chain.toggleHeading({ level: value === 'h2' ? 2 : 3 }).run()
  }

  function handleFontSizeChange(nextSize: string) {
    if (!editor) {
      return
    }

    editor.chain().focus().setFontSize(nextSize).run()
  }

  function handleTextColorChange(nextColor: string) {
    if (!editor) {
      return
    }

    editor.chain().focus().setColor(nextColor).run()
  }

  function handleHighlightColorChange(nextColor: string) {
    if (!editor) {
      return
    }

    editor.chain().focus().setHighlight({ color: nextColor }).run()
  }

  function handleImageSelection(file: File | null) {
    if (!file || !editor) {
      return
    }

    startImageUpload(async () => {
      const formData = new FormData()
      formData.set('image', file)
      const result = await uploadAnnouncementEditorImage(formData)

      if (!result.success || !result.url) {
        window.alert(result.error ?? "Echec de l'upload de l'image")
        return
      }

      editor.chain().focus().setImage({ src: result.url, alt: file.name }).run()
      imageInputRef.current!.value = ''
    })
  }

  return (
    <div className="grid gap-2 text-sm">
      <div className="font-medium tracking-wide text-neutral-900">{label}</div>
      <input name={name} readOnly type="hidden" value={value} />
      <div className="overflow-hidden rounded-2xl border border-[#d7d2c6] bg-[#F8F8F6]">
        <div className="flex flex-wrap items-center gap-1 border-b border-[#E0DED7] bg-[#F8F8F6] px-3 py-2">
          <ToolbarButton
            disabled={!editor?.can().chain().focus().undo().run()}
            title="Undo"
            onClick={() => editor?.chain().focus().undo().run()}
          >
            <Undo2 size={16} />
          </ToolbarButton>
          <ToolbarButton
            disabled={!editor?.can().chain().focus().redo().run()}
            title="Redo"
            onClick={() => editor?.chain().focus().redo().run()}
          >
            <Redo2 size={16} />
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton
            active={editor?.isActive('bold')}
            title="Bold"
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('italic')}
            title="Italic"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('underline')}
            title="Underline"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon size={16} />
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('strike')}
            title="Strikethrough"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          >
            <Strikethrough size={16} />
          </ToolbarButton>
          <ToolbarDivider />
          <select
            aria-label="Heading level"
            className="rounded border border-gray-200 bg-white px-2 py-1 text-sm text-[#04342C]"
            onChange={(event) => handleHeadingChange(event.target.value)}
            value={currentHeading}
          >
            {HEADING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ToolbarButton
            title="Clear formatting"
            onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
          >
            <RemoveFormatting size={16} />
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton
            active={editor?.isActive('bulletList')}
            title="Bullet list"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('orderedList')}
            title="Ordered list"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={16} />
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('blockquote')}
            title="Blockquote"
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            <Quote size={16} />
          </ToolbarButton>
          <ToolbarButton
            title="Horizontal rule"
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          >
            <Minus size={16} />
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton
            active={editor?.isActive({ textAlign: 'left' })}
            title="Align left"
            onClick={() => editor?.chain().focus().setTextAlign('left').run()}
          >
            <AlignLeft size={16} />
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive({ textAlign: 'center' })}
            title="Align center"
            onClick={() => editor?.chain().focus().setTextAlign('center').run()}
          >
            <AlignCenter size={16} />
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive({ textAlign: 'right' })}
            title="Align right"
            onClick={() => editor?.chain().focus().setTextAlign('right').run()}
          >
            <AlignRight size={16} />
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive({ textAlign: 'justify' })}
            title="Align justify"
            onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
          >
            <AlignJustify size={16} />
          </ToolbarButton>
          <ToolbarDivider />
          <select
            aria-label="Text size"
            className="rounded border border-gray-200 bg-white px-2 py-1 text-sm text-[#04342C]"
            onChange={(event) => handleFontSizeChange(event.target.value)}
            value={currentFontSize}
          >
            {FONT_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ToolbarDivider />
          <div className="relative">
            <ToolbarButton
              active={!!editor?.isActive('textStyle', { color: currentTextColor })}
              title="Text color"
              onClick={() => textColorInputRef.current?.click()}
            >
              <Palette size={16} />
              <span
                className="absolute bottom-0.5 h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: currentTextColor }}
              />
            </ToolbarButton>
            <input
              className="sr-only"
              onChange={(event) => handleTextColorChange(event.target.value)}
              ref={textColorInputRef}
              type="color"
              value={currentTextColor}
            />
          </div>
          <div className="relative">
            <ToolbarButton
              active={editor?.isActive('highlight')}
              title="Highlight color"
              onClick={() => highlightColorInputRef.current?.click()}
            >
              <Highlighter size={16} />
              <span
                className="absolute bottom-0.5 h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: currentHighlightColor }}
              />
            </ToolbarButton>
            <input
              className="sr-only"
              onChange={(event) => handleHighlightColorChange(event.target.value)}
              ref={highlightColorInputRef}
              type="color"
              value={currentHighlightColor}
            />
          </div>
          <ToolbarDivider />
          <ToolbarButton
            active={editor?.isActive('link')}
            title="Link"
            onClick={setLink}
          >
            <Link2 size={16} />
          </ToolbarButton>
          <ToolbarButton
            disabled={isUploadingImage}
            title="Image"
            onClick={() => imageInputRef.current?.click()}
          >
            <ImageIcon size={16} />
          </ToolbarButton>
          <ToolbarButton
            active={editor?.isActive('table')}
            title="Table"
            onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          >
            <TableIcon size={16} />
          </ToolbarButton>
          <input
            accept="image/*"
            className="sr-only"
            onChange={(event) => handleImageSelection(event.target.files?.[0] ?? null)}
            ref={imageInputRef}
            type="file"
          />
        </div>
        <EditorContent editor={editor} />
      </div>
      {placeholder ? <span className="text-xs text-neutral-500">{placeholder}</span> : null}
      {required ? <span className="sr-only">Champ requis</span> : null}
    </div>
  )
}
