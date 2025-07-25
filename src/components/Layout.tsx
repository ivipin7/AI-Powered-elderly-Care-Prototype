import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Pill, Heart, Users, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { userProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl">
                <Pill className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PillBridge</h1>
                <p className="text-sm text-gray-600">Medication Care Made Simple</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">{userProfile?.full_name}</p>
                <p className="text-sm text-gray-600 capitalize">
                  {userProfile?.role === 'caregiver' ? (
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Caregiver
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      Patient
                    </span>
                  )}
                </p>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}