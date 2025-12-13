import React from 'react';
import { ArrowRight, ChefHat, Sparkles } from 'lucide-react';
 

const Hero = ({ onBrowse }) => {
     return (
          <div className="relative overflow-hidden bg-white">
               <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1543339308-43e59d6b73a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center" />

               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                         <div>
                              <div className="flex justify-center mb-6">
                                   <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-primary">
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Personalized Nutrition Plans
                                   </span>
                              </div>
                              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                                   Your Journey to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Healthy Eating</span> Starts Here
                              </h1>
                              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                                   Generate custom meal plans rooted in science and traditional flavors.
                                   Discover recipes tailored to your goals.
                              </p>
                              <div className="flex justify-center gap-4">
                                   <button
                                        onClick={onBrowse}
                                        className="inline-flex items-center px-8 py-4 border border-gray-200 text-lg font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                                   >
                                        Browse Recipes
                                        <ChefHat className="ml-2 h-5 w-5" />
                                   </button>
                                   <a
                                        href="/advanced-recipes.html"
                                        className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl shadow-lg text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
                                   >
                                        Advanced Recipes
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                   </a>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
};

export default Hero;
