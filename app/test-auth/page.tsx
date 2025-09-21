"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function TestAuthPage() {
  const { data: session, status } = useSession();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Status:</strong> {status}
          </div>
          
          {session ? (
            <div className="space-y-2">
              <div><strong>User ID:</strong> {session.user?.id}</div>
              <div><strong>Email:</strong> {session.user?.email}</div>
              <div><strong>Name:</strong> {session.user?.name}</div>
              <div><strong>Current Org:</strong> {session.user?.currentOrgId}</div>
              <div><strong>Memberships:</strong> {JSON.stringify(session.user?.memberships, null, 2)}</div>
            </div>
          ) : (
            <div>No session found</div>
          )}
          
          <div className="flex gap-2">
            <Button onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
