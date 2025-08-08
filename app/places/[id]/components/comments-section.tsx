

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  MessageCircle, 
  Reply, 
  Upload, 
  X, 
  Accessibility, 
  Eye, 
  Ear, 
  Users, 
  Car, 
  Heart,
  ImageIcon
} from 'lucide-react'

interface CommentsSectionProps {
  placeId: string
  comments: any[]
}

export function CommentsSection({ placeId, comments }: CommentsSectionProps) {
  const { data: session } = useSession()
  const [showMainCommentForm, setShowMainCommentForm] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // États pour le formulaire principal
  const [mainComment, setMainComment] = useState('')
  const [mainAccessibilityDetails, setMainAccessibilityDetails] = useState('')
  const [mainImageUrl, setMainImageUrl] = useState('')
  const [mainAccessibilityFlags, setMainAccessibilityFlags] = useState({
    wheelchairAccess: false,
    visualImpairment: false,
    hearingImpairment: false,
    mobilityIssues: false,
    parkingAccess: false,
    guideDogAccepted: false
  })

  // États pour les réponses
  const [replyContent, setReplyContent] = useState('')
  const [replyImageUrl, setReplyImageUrl] = useState('')

  const handleImageUpload = async (file: File, isReply = false) => {
    if (!file) return

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        if (isReply) {
          setReplyImageUrl(data.imageUrl)
        } else {
          setMainImageUrl(data.imageUrl)
        }
      } else {
        alert('Erreur lors de l\'upload de l\'image')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'upload de l\'image')
    } finally {
      setUploadingImage(false)
    }
  }

  const submitComment = async () => {
    if (!session || !mainComment.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/places/${placeId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: mainComment,
          imageUrl: mainImageUrl || null,
          accessibilityDetails: mainAccessibilityDetails,
          wheelchairAccess: mainAccessibilityFlags.wheelchairAccess || null,
          visualImpairment: mainAccessibilityFlags.visualImpairment || null,
          hearingImpairment: mainAccessibilityFlags.hearingImpairment || null,
          mobilityIssues: mainAccessibilityFlags.mobilityIssues || null,
          parkingAccess: mainAccessibilityFlags.parkingAccess || null,
          guideDogAccepted: mainAccessibilityFlags.guideDogAccepted || null,
        }),
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitReply = async (parentId: string) => {
    if (!session || !replyContent.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/places/${placeId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: replyContent,
          parentId,
          imageUrl: replyImageUrl || null,
        }),
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réponse:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const CommentCard = ({ comment, isReply = false }: { comment: any; isReply?: boolean }) => (
    <Card className={`${isReply ? 'ml-12 border-l-4 border-l-blue-200' : ''}`}>
      <CardContent className="p-4">
        {/* En-tête du commentaire */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {comment.user.name?.charAt(0) || comment.user.email?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {comment.user.name || comment.user.email}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* Contenu du commentaire */}
        <div className="mb-3">
          <p className="text-gray-800 leading-relaxed">{comment.content}</p>
          
          {comment.accessibilityDetails && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Détails d'accessibilité :</p>
              <p className="text-sm text-blue-700 mt-1">{comment.accessibilityDetails}</p>
            </div>
          )}

          {/* Image partagée */}
          {comment.imageUrl && (
            <div className="mt-3">
              <div className="relative w-full max-w-md aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={comment.imageUrl}
                  alt="Image partagée"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Indicateurs d'accessibilité */}
          {!isReply && (
            <div className="flex flex-wrap gap-2 mt-3">
              {comment.wheelchairAccess && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full text-xs">
                  <Accessibility className="w-3 h-3" />
                  <span>Fauteuil roulant</span>
                </div>
              )}
              {comment.visualImpairment && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full text-xs">
                  <Eye className="w-3 h-3" />
                  <span>Déficience visuelle</span>
                </div>
              )}
              {comment.hearingImpairment && (
                <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded-full text-xs">
                  <Ear className="w-3 h-3" />
                  <span>Déficience auditive</span>
                </div>
              )}
              {comment.mobilityIssues && (
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-full text-xs">
                  <Users className="w-3 h-3" />
                  <span>Mobilité réduite</span>
                </div>
              )}
              {comment.parkingAccess && (
                <div className="flex items-center gap-1 px-2 py-1 bg-indigo-100 rounded-full text-xs">
                  <Car className="w-3 h-3" />
                  <span>Parking accessible</span>
                </div>
              )}
              {comment.guideDogAccepted && (
                <div className="flex items-center gap-1 px-2 py-1 bg-pink-100 rounded-full text-xs">
                  <Heart className="w-3 h-3" />
                  <span>Chiens guides acceptés</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        {session && !isReply && (
          <div className="flex items-center gap-2 pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
            >
              <Reply className="w-4 h-4" />
              <span>Répondre</span>
              {comment._count?.replies > 0 && (
                <span className="text-xs bg-gray-200 px-1 rounded">
                  {comment._count.replies}
                </span>
              )}
            </Button>
          </div>
        )}

        {/* Formulaire de réponse */}
        {replyingTo === comment.id && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-3">
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={2}
                placeholder="Votre réponse..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-blue-600">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <ImageIcon className="w-4 h-4" />
                  {uploadingImage ? 'Upload...' : 'Ajouter une image'}
                </label>
                
                {replyImageUrl && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-600">Image ajoutée</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyImageUrl('')}
                      className="p-1 h-auto"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null)
                    setReplyContent('')
                    setReplyImageUrl('')
                  }}
                >
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={() => submitReply(comment.id)}
                  disabled={!replyContent.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Publication...' : 'Publier'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Réponses */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-3">
            {comment.replies.map((reply: any) => (
              <CommentCard key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Bouton pour ajouter un commentaire */}
      {session && (
        <div className="flex justify-center">
          <Button
            onClick={() => setShowMainCommentForm(!showMainCommentForm)}
            className="flex items-center gap-2"
            variant="outline"
          >
            <MessageCircle className="w-4 h-4" />
            Ajouter un commentaire
          </Button>
        </div>
      )}

      {/* Formulaire de commentaire principal */}
      {showMainCommentForm && session && (
        <Card className="border-2 border-green-200 bg-green-50/30">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold">Ajouter un commentaire</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre expérience
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Partagez votre expérience d'accessibilité..."
                value={mainComment}
                onChange={(e) => setMainComment(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Détails sur l'accessibilité (optionnel)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Détails spécifiques sur l'accessibilité..."
                value={mainAccessibilityDetails}
                onChange={(e) => setMainAccessibilityDetails(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Types d'accessibilité concernés
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'wheelchairAccess', label: 'Fauteuil roulant', icon: Accessibility },
                  { key: 'visualImpairment', label: 'Déficience visuelle', icon: Eye },
                  { key: 'hearingImpairment', label: 'Déficience auditive', icon: Ear },
                  { key: 'mobilityIssues', label: 'Mobilité réduite', icon: Users },
                  { key: 'parkingAccess', label: 'Parking accessible', icon: Car },
                  { key: 'guideDogAccepted', label: 'Chiens guides acceptés', icon: Heart },
                ].map(({ key, label, icon: Icon }) => (
                  <label key={key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mainAccessibilityFlags[key as keyof typeof mainAccessibilityFlags]}
                      onChange={(e) => setMainAccessibilityFlags(prev => ({
                        ...prev,
                        [key]: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  className="hidden"
                  disabled={uploadingImage}
                />
                <ImageIcon className="w-4 h-4" />
                {uploadingImage ? 'Upload en cours...' : 'Ajouter une image (optionnel)'}
              </label>
              {mainImageUrl && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-green-600">Image ajoutée avec succès</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMainImageUrl('')}
                    className="p-1 h-auto"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowMainCommentForm(false)
                  setMainComment('')
                  setMainAccessibilityDetails('')
                  setMainImageUrl('')
                  setMainAccessibilityFlags({
                    wheelchairAccess: false,
                    visualImpairment: false,
                    hearingImpairment: false,
                    mobilityIssues: false,
                    parkingAccess: false,
                    guideDogAccepted: false
                  })
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={submitComment}
                disabled={!mainComment.trim() || isSubmitting}
              >
                {isSubmitting ? 'Publication...' : 'Publier'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des commentaires */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucun commentaire pour le moment</p>
            <p className="text-sm">Soyez le premier à partager votre expérience !</p>
            {!session && (
              <p className="text-sm text-blue-600 mt-2">
                <a href="/auth/signin" className="underline hover:no-underline">
                  Connectez-vous pour ajouter un commentaire
                </a>
              </p>
            )}
          </div>
        ) : (
          <>
            {!session && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <Reply className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    <a href="/auth/signin" className="font-medium underline hover:no-underline">
                      Connectez-vous
                    </a> pour répondre aux commentaires et partager votre expérience !
                  </p>
                </div>
              </div>
            )}
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
