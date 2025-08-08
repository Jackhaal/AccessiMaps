
'use client'

import { Button } from '@/components/ui/button'
import { LogOut, Settings, User } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export function AdminHeader() {
  const { data: session } = useSession()

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-indigo-600">AccessiMaps</h1>
          <span className="text-sm text-gray-500">Administration</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {session?.user && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{session.user.name || session.user.email}</span>
            </div>
          )}
          
          <Link href="/admin/settings">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
          </Link>
          
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Se déconnecter
          </Button>
        </div>
      </div>
    </header>
  )
}
