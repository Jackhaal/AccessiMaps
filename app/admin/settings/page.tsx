
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Loader2, Eye, EyeOff, Shield } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminSettings() {
  const [loading, setLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [formData, setFormData] = useState({
    currentUsername: 'admin',
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (!formData.currentPassword) {
      toast.error('Veuillez saisir votre mot de passe actuel')
      setLoading(false)
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      toast.error('Le nouveau mot de passe doit contenir au moins 6 caractères')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentUsername: formData.currentUsername,
          currentPassword: formData.currentPassword,
          newUsername: formData.newUsername || formData.currentUsername,
          newPassword: formData.newPassword
        }),
      })

      if (response.ok) {
        toast.success('Paramètres mis à jour avec succès')
        // Réinitialiser les champs de mot de passe
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          currentUsername: formData.newUsername || formData.currentUsername
        }))
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres d'administration</h1>
        <p className="text-gray-600">Gérez vos identifiants administrateur</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Modification des identifiants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Identifiants administrateur</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom d'utilisateur actuel */}
              <div className="space-y-2">
                <Label htmlFor="currentUsername">Nom d'utilisateur actuel</Label>
                <Input
                  id="currentUsername"
                  value={formData.currentUsername}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Nouveau nom d'utilisateur */}
              <div className="space-y-2">
                <Label htmlFor="newUsername">Nouveau nom d'utilisateur (optionnel)</Label>
                <Input
                  id="newUsername"
                  value={formData.newUsername}
                  onChange={(e) => handleInputChange('newUsername', e.target.value)}
                  placeholder="Laisser vide pour conserver le nom actuel"
                />
              </div>

              {/* Mot de passe actuel */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel *</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Nouveau mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe (optionnel)</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className="pr-10"
                    placeholder="Laisser vide pour conserver le mot de passe actuel"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirmation nouveau mot de passe */}
              {formData.newPassword && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Mettre à jour
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Informations de sécurité */}
        <Card>
          <CardHeader>
            <CardTitle>Conseils de sécurité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-medium text-yellow-800 mb-2">Recommandations</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Utilisez un mot de passe fort (au moins 8 caractères)</li>
                <li>• Mélangez lettres, chiffres et caractères spéciaux</li>
                <li>• Changez régulièrement vos identifiants</li>
                <li>• Ne partagez jamais vos identifiants</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">Information</h3>
              <p className="text-sm text-blue-700">
                Les modifications des identifiants prennent effet immédiatement. 
                Vous devrez vous reconnecter avec les nouveaux identifiants.
              </p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-medium text-red-800 mb-2">Attention</h3>
              <p className="text-sm text-red-700">
                Assurez-vous de noter vos nouveaux identifiants dans un endroit sûr. 
                La perte de ces identifiants vous empêchera d'accéder à l'administration.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
