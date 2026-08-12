'use client';

import { Shield, Link, Wifi, Globe, Lock, Cpu, LogOut, User as UserIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { useUser, useAuth } from '@/firebase';
import { getAuth } from 'firebase/auth';
import LinkComponent from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

type Sections = {
  [key: string]: React.RefObject<HTMLDivElement>;
};

type Props = {
  sections: Sections;
};

export function Header({ sections }: Props) {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/');
    }
  };

  return (
    <header className="flex items-center justify-between gap-4 border-b bg-card p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-headline text-foreground">
          WebSense Toolkit
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {user && (
          <nav className="hidden md:flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => scrollToSection(sections.url)}>
                  <Link className="mr-2 h-4 w-4" />
                  URL Analyzer
              </Button>
              <Button variant="ghost" size="sm" onClick={() => scrollToSection(sections.speed)}>
                  <Wifi className="mr-2 h-4 w-4" />
                  Speed Test
              </Button>
              <Button variant="ghost" size="sm" onClick={() => scrollToSection(sections.ip)}>
                  <Globe className="mr-2 h-4 w-4" />
                  IP Analysis
              </Button>
              <Button variant="ghost" size="sm" onClick={() => scrollToSection(sections.password)}>
                  <Lock className="mr-2 h-4 w-4" />
                  Password Toolkit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => scrollToSection(sections.image)}>
                  <Cpu className="mr-2 h-4 w-4" />
                  AI Image Check
              </Button>
          </nav>
        )}
        <ThemeToggle />
        {isUserLoading ? null : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? user.email ?? ''} />
                  <AvatarFallback>
                    {user.email ? user.email.charAt(0).toUpperCase() : <UserIcon />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>{user.email}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <LinkComponent href="/login">Log In</LinkComponent>
            </Button>
            <Button asChild size="sm">
              <LinkComponent href="/signup">Sign Up</LinkComponent>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
