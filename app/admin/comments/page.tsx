
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Trash2, Search, MessageSquare, MapPin, User, Reply, ImageIcon, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

interface CommentUser {
  name: string | null
  email: string
}

interface CommentReply {
  id: string
  content: string
  imageUrl: string | null
  createdAt: string
  user: CommentUser
}

interface CommentParent {
  id: string
  content: string
  user: CommentUser
}

interface Comment {
  id: string
  parentId: string | null
  content: string
  imageUrl: string | null
  accessibilityDetails: string | null
  wheelchairAccess: boolean | null
  visualImpairment: boolean | null
  hearingImpairment: boolean | null
  mobilityIssues: boolean | null
  parkingAccess: boolean | null
  guideDogAccepted: boolean | null
  createdAt: string
  user: CommentUser
  place: {
    name: string
    city: string
  }
  parent?: CommentParent | null
  replies: CommentReply[]
  _count: {
    replies: number
  }
}

export default function CommentsAdmin() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredComments, setFilteredComments] = useState<Comment[]>([])
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchComments()
  }, [])

  useEffect(() => {
    const filtered = comments.filter(comment =>
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.place?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.place?.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.parent?.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredComments(filtered)
  }, [comments, searchTerm])

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/admin/comments')
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      } else {
        toast.error('Erreur lors du chargement des commentaires')
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
      toast.error('Erreur lors du chargement des commentaires')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (commentId: string, isReply: boolean = false) => {
    const message = isReply 
      ? 'Êtes-vous sûr de vouloir supprimer cette réponse ?' 
      : 'Êtes-vous sûr de vouloir supprimer ce commentaire et toutes ses réponses ?'
    
    if (!confirm(message)) return

    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const result = await response.json()
        setComments(comments.filter(comment => comment.id !== commentId))
        
        if (result.deletedReplies > 0) {
          toast.success(`Commentaire et ${result.deletedReplies} réponse(s) supprimé(s)`)
        } else {
          toast.success(isReply ? 'Réponse supprimée' : 'Commentaire supprimé')
        }
        
        // Rafraîchir la liste pour mettre à jour les compteurs
        fetchComments()
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const toggleExpanded = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }

  const getAccessibilityBadges = (comment: Comment | CommentReply) => {
    if (!('wheelchairAccess' in comment)) return []
    
    const badges = []
    if (comment.wheelchairAccess === true) badges.push({ label: 'Fauteuil roulant ✓', color: 'bg-green-100 text-green-800' })
    if (comment.wheelchairAccess === false) badges.push({ label: 'Fauteuil roulant ✗', color: 'bg-red-100 text-red-800' })
    if (comment.visualImpairment === true) badges.push({ label: 'Déficience visuelle ✓', color: 'bg-blue-100 text-blue-800' })
    if (comment.visualImpairment === false) badges.push({ label: 'Déficience visuelle ✗', color: 'bg-blue-100 text-blue-800' })
    if (comment.hearingImpairment === true) badges.push({ label: 'Déficience auditive ✓', color: 'bg-purple-100 text-purple-800' })
    if (comment.hearingImpairment === false) badges.push({ label: 'Déficience auditive ✗', color: 'bg-purple-100 text-purple-800' })
    if (comment.mobilityIssues === true) badges.push({ label: 'Mobilité réduite ✓', color: 'bg-orange-100 text-orange-800' })
    if (comment.mobilityIssues === false) badges.push({ label: 'Mobilité réduite ✗', color: 'bg-orange-100 text-orange-800' })
    if (comment.parkingAccess === true) badges.push({ label: 'Parking accessible ✓', color: 'bg-indigo-100 text-indigo-800' })
    if (comment.parkingAccess === false) badges.push({ label: 'Parking accessible ✗', color: 'bg-indigo-100 text-indigo-800' })
    if (comment.guideDogAccepted === true) badges.push({ label: 'Chiens guides ✓', color: 'bg-pink-100 text-pink-800' })
    if (comment.guideDogAccepted === false) badges.push({ label: 'Chiens guides ✗', color: 'bg-pink-100 text-pink-800' })
    return badges
  }

  // Séparer les commentaires parents des réponses
  const parentComments = filteredComments.filter(comment => !comment.parentId)
  const totalComments = comments.length
  const totalReplies = comments.filter(comment => comment.parentId).length

  const renderReply = (reply: CommentReply) => (
    <div key={reply.id} className="ml-8 mt-4 border-l-2 border-gray-200 pl-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Reply className="h-4 w-4" />
            <User className="h-3 w-3" />
            <span className="font-medium">{reply.user.name || reply.user.email}</span>
            <span>•</span>
            <span>{new Date(reply.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleDelete(reply.id, true)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        
        <p className="text-gray-800 mb-3">"{reply.content}"</p>
        
        {reply.imageUrl && (
          <div className="mb-3">
            <div className="relative w-32 h-24 bg-gray-100 rounded overflow-hidden">
              <Image
                src={reply.imageUrl}
                alt="Image de la réponse"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des commentaires</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span>{totalComments - totalReplies} commentaires principaux</span>
            <span>•</span>
            <span>{totalReplies} réponses</span>
            <span>•</span>
            <span>{totalComments} au total</span>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Rechercher un commentaire, lieu, utilisateur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Liste des commentaires */}
      <div className="grid gap-6">
        {parentComments.map((comment) => (
          <Card key={comment.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div className="flex-1">
                  {/* En-tête du commentaire */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {comment.place?.name || 'Lieu supprimé'}
                      </h3>
                      {comment._count.replies > 0 && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {comment._count.replies} réponse{comment._count.replies > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(comment.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Informations du commentaire */}
                  <div className="flex items-center text-gray-600 space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{comment.place?.city || 'Ville inconnue'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{comment.user.name || comment.user.email}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {/* Si c'est une réponse, afficher le commentaire parent */}
                  {comment.parent && (
                    <div className="mb-3 p-3 bg-blue-50 border-l-4 border-blue-200 rounded">
                      <p className="text-sm text-blue-800">
                        <strong>En réponse à :</strong> "{comment.parent.content.substring(0, 100)}..."
                      </p>
                      <p className="text-xs text-blue-600">
                        par {comment.parent.user.name || comment.parent.user.email}
                      </p>
                    </div>
                  )}

                  {/* Contenu du commentaire */}
                  <div className="mb-3">
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">"{comment.content}"</p>
                  </div>

                  {/* Image partagée */}
                  {comment.imageUrl && (
                    <div className="mb-3">
                      <div className="relative w-48 h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={comment.imageUrl}
                          alt="Image partagée"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Détails d'accessibilité */}
                  {comment.accessibilityDetails && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Détails d'accessibilité :</strong> {comment.accessibilityDetails}
                      </p>
                    </div>
                  )}

                  {/* Badges d'accessibilité */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {getAccessibilityBadges(comment).map((badge, index) => (
                      <Badge key={index} className={badge.color}>
                        {badge.label}
                      </Badge>
                    ))}
                  </div>

                  {/* Bouton pour afficher/masquer les réponses */}
                  {comment._count.replies > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(comment.id)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {expandedComments.has(comment.id) 
                        ? `Masquer les ${comment._count.replies} réponse${comment._count.replies > 1 ? 's' : ''}` 
                        : `Voir les ${comment._count.replies} réponse${comment._count.replies > 1 ? 's' : ''}`
                      }
                    </Button>
                  )}

                  {/* Réponses */}
                  {expandedComments.has(comment.id) && comment.replies.map(renderReply)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Messages d'état vide */}
      {parentComments.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun commentaire trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Aucun commentaire ne correspond à votre recherche.' : 'Aucun commentaire disponible.'}
          </p>
        </div>
      )}
    </div>
  )
}
