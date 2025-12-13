import React from 'react';
import { Utensils, Heart } from 'lucide-react';

const Layout = ({ children }) => {
     return (
          <div className="min-h-screen flex flex-col font-sans">
               <header className="bg-white shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                         <div className="flex items-center space-x-2">
                              <div className="bg-primary p-2 rounded-lg">
                                   <Utensils className="h-6 w-6 text-white" />
                              </div>
                              <span className="text-xl font-bold text-gray-900 tracking-tight">Food & Recipes</span>
                         </div>
                         <nav className="flex items-center space-x-4">
                              {/* Add nav links if needed */}
                              <div className="flex items-center text-sm font-medium text-gray-500">
                                   <Heart className="h-4 w-4 mr-1 text-red-500" />
                                   <span>Doctor Healthy</span>
                              </div>
                         </nav>
                    </div>
               </header>

               <main className="flex-grow bg-gray-50">
                    {children}
               </main>

               <footer className="bg-white border-t border-gray-100 mt-auto">
                    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
                         <p>&copy; {new Date().getFullYear()} Doctor Healthy. All rights reserved.</p>
                    </div>
               </footer>
          </div>
     );
};

export default Layout;
