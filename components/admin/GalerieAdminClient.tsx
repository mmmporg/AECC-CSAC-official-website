'use client'

import Image from 'next/image'
import { useState, useTransition, type FormEvent } from 'react'
import { deleteGalleryPhoto, uploadGalleryPhoto } from '@/app/actions/gallery'
import type { GalleryPhoto } from '@/lib/supabase/types'

interface GalerieAdminClientProps {
  initialImages: GalleryPhoto[]
}

export function GalerieAdminClient({ initialImages }: GalerieAdminClientProps) {
  const [images, setImages] = useState<GalleryPhoto[]>(initialImages)
  const [deleteTarget, setDeleteTarget] = useState<GalleryPhoto | null>(null)
  const [isPending, startTransition] = useTransition()
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  function handleCancelDelete() {
    setDeleteTarget(null)
  }

  function handleConfirmDelete() {
    if (!deleteTarget) {
      return
    }

    const currentTarget = deleteTarget
    setDeleteTarget(null)

    startTransition(async () => {
      const result = await deleteGalleryPhoto(currentTarget.id, currentTarget.image_url)

      if (result.success) {
        setImages((currentImages) => currentImages.filter((image) => image.id !== currentTarget.id))
      }
    })
  }

  function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setUploadError(null)
    setUploadSuccess(false)

    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await uploadGalleryPhoto(formData)

      if (result.success) {
        setUploadSuccess(true)
        window.location.reload()
        return
      }

      setUploadError(result.error ?? 'Erreur inconnue')
    })
  }

  return (
    <div className="space-y-10">
      <div className="admin-card p-6">
        <h2 className="mb-4 text-xl font-bold text-neutral-800">Ajouter une photo</h2>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleUpload}>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-neutral-700" htmlFor="image">
              Fichier image <span className="text-error">*</span>
            </label>
            <input
              accept="image/*"
              className="w-full rounded-lg border border-[#ece7dd] px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-brand-700"
              id="image"
              name="image"
              required
              type="file"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-neutral-700" htmlFor="title_fr">
              Titre (FR)
            </label>
            <input
              className="w-full rounded-lg border border-[#ece7dd] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              id="title_fr"
              name="title_fr"
              placeholder="Ex. Reunion annuelle 2024"
              type="text"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-neutral-700" htmlFor="year">
              Annee <span className="text-error">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-[#ece7dd] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              defaultValue={new Date().getFullYear()}
              id="year"
              max={new Date().getFullYear() + 1}
              min={1997}
              name="year"
              required
              type="number"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-neutral-700" htmlFor="event_name">
              Nom de l&apos;evenement
            </label>
            <input
              className="w-full rounded-lg border border-[#ece7dd] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              id="event_name"
              name="event_name"
              placeholder="Ex. Soiree de fin d'annee"
              type="text"
            />
          </div>

          {uploadError ? (
            <p className="sm:col-span-2 rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
              {uploadError}
            </p>
          ) : null}

          {uploadSuccess ? (
            <p className="sm:col-span-2 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700">
              Photo ajoutee avec succes.
            </p>
          ) : null}

          <div className="sm:col-span-2">
            <button
              className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-50"
              disabled={isPending}
              type="submit"
            >
              {isPending ? 'Envoi en cours...' : 'Uploader la photo'}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card overflow-hidden">
        <table className="min-w-full divide-y divide-[#ece7dd] text-sm">
          <thead className="bg-[#f0ece4] text-left text-neutral-600">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">Apercu</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">Titre</th>
              <th className="px-6 py-4 font-semibold uppercase tracking-[0.08em]">Date</th>
              <th className="px-6 py-4 text-right font-semibold uppercase tracking-[0.08em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ece7dd] bg-white">
            {images.map((image) => (
              <tr className="group hover:bg-[#faf7f1]" key={image.id}>
                <td className="px-6 py-4">
                  <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-neutral-100">
                    <Image
                      alt={image.title_fr ?? image.event_name ?? 'Photo galerie'}
                      className="object-cover"
                      fill
                      sizes="96px"
                      src={image.image_url}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-neutral-900">
                  {image.title_fr ?? image.event_name ?? (
                    <span className="italic text-neutral-400">Sans titre</span>
                  )}
                </td>
                <td className="px-6 py-4 text-neutral-500">{image.year}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    className="rounded-lg px-3 py-2 text-sm font-medium text-error transition hover:bg-error/10 disabled:opacity-50"
                    disabled={isPending}
                    onClick={() => setDeleteTarget(image)}
                    type="button"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}

            {images.length === 0 ? (
              <tr>
                <td className="py-12 text-center text-neutral-500" colSpan={4}>
                  Aucune photo dans la galerie.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <h3 className="mb-2 text-xl font-bold text-neutral-900">Confirmer la suppression</h3>
            <p className="mb-6 text-neutral-600">
              Etes-vous sur de vouloir supprimer cette photo ? Cette action est irreversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="rounded-xl border border-[#ece7dd] px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                onClick={handleCancelDelete}
                type="button"
              >
                Annuler
              </button>
              <button
                className="rounded-xl bg-error px-5 py-2.5 text-sm font-bold text-white transition hover:bg-error/90"
                onClick={handleConfirmDelete}
                type="button"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
