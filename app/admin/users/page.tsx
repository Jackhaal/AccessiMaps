
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Ban, Search, Users, Mail, Shield, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  name: string | null
  email: string
  isAdmin: boolean
  isBanned: boolean
  createdAt: string
  _count: {
    ratings: number
    comments: number
  }
}

export default function UsersAdmin() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [bannedUsers, setBannedUsers] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Erreur lors du chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  const handleBanUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir bannir cet utilisateur ?')) return

    try {
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'POST',
      })

      if (response.ok) {
        setBannedUsers(prev => new Set([...prev, userId]))
        toast.success('Utilisateur banni avec succès')
      } else {
        toast.error('Erreur lors du bannissement')
      }
    } catch (error) {
      console.error('Error banning user:', error)
      toast.error('Erreur lors du bannissement')
    }
  }

  const handleUnbanUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/unban`, {
        method: 'POST',
      })

      if (response.ok) {
        setBannedUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(userId)
          return newSet
        })
        toast.success('Utilisateur débanni avec succès')
      } else {
        toast.error('Erreur lors du débannissement')
      }
    } catch (error) {
      console.error('Error unbanning user:', error)
      toast.error('Erreur lors du débannissement')
    }
  }

  const handlePromoteUser = async (userId: string, userName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir promouvoir ${userName || 'cet utilisateur'} en tant qu'administrateur ?`)) return

    try {
      const response = await fetch(`/api/admin/users/${userId}/promote`, {
        method: 'POST',
      })

      if (response.ok) {
        toast.success('Utilisateur promu administrateur avec succès')
        fetchUsers() // Recharger la liste pour retirer l'utilisateur promu
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de la promotion')
      }
    } catch (error) {
      console.error('Error promoting user:', error)
      toast.error('Erreur lors de la promotion')
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-gray-600">{users.length} utilisateurs au total</p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Rechercher un utilisateur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Liste des utilisateurs */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.name || 'Utilisateur sans nom'}
                    </h3>
                    {(user.isBanned || bannedUsers.has(user.id)) && (
                      <Badge variant="destructive">Banni</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center text-gray-600 space-x-2 mb-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{user._count.ratings} évaluations</span>
                    <span>{user._count.comments} commentaires</span>
                    <span>Inscrit le: {new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePromoteUser(user.id, user.name || 'Utilisateur')}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    Promouvoir admin
                  </Button>
                  
                  {(user.isBanned || bannedUsers.has(user.id)) ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleUnbanUser(user.id)}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      Débannir
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleBanUser(user.id)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Ban className="h-4 w-4 mr-1" />
                      Bannir
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Aucun utilisateur ne correspond à votre recherche.' : 'Aucun utilisateur inscrit.'}
          </p>
        </div>
      )}
    </div>
  )
}
