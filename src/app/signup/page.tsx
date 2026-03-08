'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Palette, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { signup } from '../auth/actions';
import { useFormStatus } from 'react-dom';

function SignupButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Signing up...' : 'Sign Up'}
    </Button>
  );
}

export default function SignupPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-4">
            <Palette className="h-10 w-10 text-primary mx-auto" />
          </Link>
          <CardTitle className="text-2xl font-headline">Create an Artist Account</CardTitle>
          <CardDescription>
            Join our community of talented artists.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signup} className="grid gap-4">
            {message && (
              <Alert variant={message.includes("Check your email") ? "default" : "destructive"}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{message.includes("Check your email") ? "Success" : "Signup Failed"}</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
             <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
              />
            </div>
            <SignupButton />
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
