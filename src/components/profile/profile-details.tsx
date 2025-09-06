import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarIcon, Mail, User, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale'; // Import Indonesian locale
import type { CurrentSessionProps } from '@/lib/session'; // Adjust import path if needed
import { Separator } from '../ui/separator';

interface ProfileDetailsProps {
  user: CurrentSessionProps; // Use the type returned by getCurrentUser
}

export function ProfileDetails({ user }: ProfileDetailsProps) {
  // Get initials for avatar fallback
  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-16 w-16">
            {/* <AvatarImage src={user.avatarUrl} alt={user.fullName} /> */}
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <h4 className="text-xl font-semibold">{user.fullName}</h4>
          <p className="text-sm text-muted-foreground">{user.role}</p>
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Username:</span>
            <span className="ml-2">{user.username}</span>
          </div>
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Email:</span>
            <span className="ml-2">{user.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <Hash className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="font-medium">User ID:</span>
            <span className="ml-2">{user.id}</span>
          </div>
          {user.createdAt && (
            <div className="flex items-center text-sm">
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Member since:</span>
              <span className="ml-2">
                {format(new Date(user.createdAt), 'PPP', { locale: idLocale })} {/* Use Indonesian format */}
              </span>
            </div>
          )}
          {/* Add last login if tracked */}
        </div>
      </CardContent>
    </Card>
  );
}
