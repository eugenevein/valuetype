
"use client";

import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { LogOut, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function AppHeader() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await auth.signOut();
  };

  const getInitials = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return '?';
  };

  return (
    <header className="py-4 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Zap className="h-7 w-7 text-primary mr-2" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Value Type Generator
          </h1>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? user.email ?? 'User'} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
