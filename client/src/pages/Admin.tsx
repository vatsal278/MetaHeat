import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Home as HomeIcon, RefreshCw } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";

interface EarlyAccessUser {
  id: number;
  walletAddress: string;
  joinedAt: string;
  hasRequestedAccess: boolean;
  email: string;
}

interface AdminResponse {
  success: boolean;
  count: number;
  users: EarlyAccessUser[];
}

export default function Admin() {
  const { isConnected } = useWallet();
  const { data, isLoading, error, refetch } = useQuery<AdminResponse>({
    queryKey: ['/api/admin/early-access-users'],
    queryFn: () => apiRequest<AdminResponse>({ 
      url: '/api/admin/early-access-users',
      method: 'GET'
    })
  });

  // Common layout wrapper for all states
  const AdminLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-24"> {/* Padding top to account for navbar */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold font-display">Admin Dashboard</h1>
              <Badge variant="secondary" className="ml-4 py-1 px-3">
                {isConnected ? 'Connected' : 'Not Connected'}
              </Badge>
            </div>
            <Link href="/" className="flex items-center text-foreground/70 hover:text-foreground transition-colors">
              <HomeIcon size={16} className="mr-2" />
              Back to Home
            </Link>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="bg-card/40 backdrop-blur-sm border border-primary/20 rounded-lg p-8">
          <div className="flex justify-center items-center h-40">
            <div className="text-center">
              <RefreshCw size={32} className="animate-spin mx-auto text-primary mb-4" />
              <p className="text-foreground/70">Loading early access users...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-card/40 backdrop-blur-sm border border-destructive/30 rounded-lg p-8">
          <p className="text-center text-destructive mb-4">Error loading data. Please try again.</p>
          <div className="flex justify-center">
            <button 
              onClick={() => refetch()}
              className="bg-primary/80 hover:bg-primary text-foreground px-4 py-2 rounded-md flex items-center"
            >
              <RefreshCw size={16} className="mr-2" />
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-card/40 backdrop-blur-sm border border-primary/20 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">Early Access Users</h2>
            <Badge variant="secondary" className="ml-3">{data?.count || 0} users</Badge>
          </div>
          
          <button 
            onClick={() => refetch()}
            className="flex items-center bg-primary/80 hover:bg-primary text-foreground px-3 py-2 rounded-md text-sm"
          >
            <RefreshCw size={14} className="mr-2" />
            Refresh Data
          </button>
        </div>
        
        {data?.users && data.users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="py-2 px-4 text-left">ID</th>
                  <th className="py-2 px-4 text-left">Wallet Address</th>
                  <th className="py-2 px-4 text-left">Joined At</th>
                  <th className="py-2 px-4 text-left">Requested Access</th>
                  <th className="py-2 px-4 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr key={user.id} className="border-b border-primary/10 hover:bg-primary/5">
                    <td className="py-3 px-4">{user.id}</td>
                    <td className="py-3 px-4 font-mono text-xs truncate max-w-[150px]">
                      {user.walletAddress}
                    </td>
                    <td className="py-3 px-4">{new Date(user.joinedAt).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      {user.hasRequestedAccess ? (
                        <Badge variant="success">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">{user.email || "Not provided"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-foreground/60 border border-dashed border-primary/20 rounded-md">
            <p>No early access users registered yet.</p>
            <p className="text-xs mt-2">Connect your wallet and request early access to see data here.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}