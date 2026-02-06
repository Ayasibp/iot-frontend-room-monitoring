import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/register')({
  beforeLoad: ({ context }) => {
    // If already authenticated, redirect to dashboard
    if (context.auth.isAuthenticated()) {
      throw redirect({ to: '/' })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Registration Unavailable
          </CardTitle>
          <CardDescription className="text-center">
            Self-registration is currently disabled
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-muted bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Contact Administrator</h4>
                <p className="text-sm text-muted-foreground">
                  To create an account, please contact your system administrator.
                  Only authorized personnel can create new accounts through the admin panel.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link to="/login" className="w-full">
            <Button variant="outline" className="w-full">
              Back to Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
