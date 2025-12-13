import React, { useState } from 'react';
 
import { CheckCircle, Clock, ChefHat, Flame, Droplet, Wheat, PieChart, UtensilsCrossed } from 'lucide-react';
import ShoppingList from './ShoppingList';

const MacroBox = ({ label, value, unit, color, icon }) => {
     const IconComp = icon;
     return (
          <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 ${color}`}>
               <div className="p-3 rounded-full bg-opacity-20 bg-current">
                    {IconComp && <IconComp className="h-6 w-6" />}
               </div>
               <div>
                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}<span className="text-sm font-normal text-gray-400 ml-1">{unit}</span></p>
               </div>
          </div>
     );
};

const IngredientList = ({ ingredients }) => {
     // Determine format: array of objects or strings?
     // The data has varied formats.
     // e.g. [{ item: {en: "Chicken"}, amount: "200g" }]
     // or { "chicken": { amount: 100 } }

     let items = [];
     if (Array.isArray(ingredients)) {
          items = ingredients;
     } else if (typeof ingredients === 'object') {
          items = Object.entries(ingredients).map(([key, value]) => ({
               name: key.replace(/_/g, ' '),
               ...value
          }));
     }

     return (
          <ul className="space-y-2 mt-4">
               {items.map((ing, idx) => {
                    const name = ing.item?.en || ing.name || ing.item; // Fallback
                    const amount = ing.amount || ing.amount_g;
                    const unit = ing.unit || '';

                    return (
                         <li key={idx} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                              <span className="text-gray-700">
                                   <span className="font-medium capitalize">{name}</span>
                                   {amount && <span className="text-gray-400 text-sm ml-2">({amount}{unit})</span>}
                              </span>
                         </li>
                    );
               })}
          </ul>
     );
};

const MealCard = ({ meal }) => {
     const [isExpanded, setIsExpanded] = useState(false);

     // Extract Basic Info
     const name = meal.meal_name?.en || meal.name?.en || meal.meal_name || "Untitled Meal";
     const prepTime = meal.prep_time_minutes || 20;
     const difficulty = meal.difficulty_level?.en || meal.difficulty || "Easy";

     // Method/Instruction
     const methodRaw = meal.preparation_method?.en || meal.preparation?.method?.en || "No instructions provided.";
     // Split into steps if it's a long string
     const steps = methodRaw.split(/\d+\.\s/).filter(Boolean);

     return (
          <div
               className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
          >
               <div className="p-6">
                    <div className="flex justify-between items-start">
                         <div>
                              <div className="flex items-center space-x-2 mb-2">
                                   <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                                        {difficulty}
                                   </span>
                                   <span className="flex items-center text-gray-500 text-xs">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {prepTime} mins
                                   </span>
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
                         </div>
                    </div>

                    {/* Ingredients Preview */}
                    <div className="mt-4 bg-gray-50 rounded-xl p-4">
                         <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                              <UtensilsCrossed className="h-4 w-4 mr-2" /> Ingredients
                         </h4>
                         <IngredientList ingredients={meal.ingredients} />
                    </div>

                    <button
                         onClick={() => setIsExpanded(!isExpanded)}
                         className="mt-4 w-full text-center text-sm font-medium text-primary hover:text-secondary py-2 border border-blue-100 rounded-lg bg-blue-50/50"
                    >
                         {isExpanded ? 'Hide Instructions' : 'View Preparation Steps'}
                    </button>

                    {isExpanded && (
                         <div
                              className="mt-6 border-t pt-4"
                         >
                              <h4 className="text-sm font-semibold text-gray-900 mb-3">Preparation</h4>
                              <ol className="list-decimal list-inside space-y-3 text-gray-600">
                                   {steps.length > 0 ? steps.map((step, i) => (
                                        <li key={i} className="leading-relaxed">{step.trim()}</li>
                                   )) : <p>{methodRaw}</p>}
                              </ol>
                         </div>
                     )}
               </div>
          </div>
     );
};

const PlanDisplay = ({ result, onReset }) => {
     if (!result) return null;

     const { bmr, targetCalories, macros, meals, moduleName, planDescription } = result;

     return (
          <div className="max-w-7xl mx-auto px-4 py-12">
               <button onClick={onReset} className="mb-8 text-gray-500 hover:text-gray-900 flex items-center">
                    ← Start Over
               </button>

               <div className="mb-10 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Your Personalized Plan</h2>
                    <div className="flex flex-col items-center mt-2 space-y-1">
                         <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                              {planDescription}
                         </span>
                         <p className="text-gray-500">Based on {moduleName} Strategy</p>
                    </div>
               </div>

               {/* Macro Summary */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <MacroBox label="Daily Target" value={targetCalories} unit="kcal" color="text-blue-600" icon={Flame} />
                    <MacroBox label="Protein" value={macros.protein} unit="g" color="text-red-600" icon={Droplet} /> {/* Muscle/Blood -> Red */}
                    <MacroBox label="Carbs" value={macros.carbs} unit="g" color="text-yellow-600" icon={Wheat} />
                    <MacroBox label="Fats" value={macros.fat} unit="g" color="text-green-600" icon={PieChart} />
               </div>

               {/* Daily Legend / Info */}
               <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 mb-12 text-white shadow-xl">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                         <div>
                              <h3 className="text-2xl font-bold mb-4">Why this plan?</h3>
                              <p className="opacity-90 leading-relaxed mb-4">
                                   This plan is tailored to your BMR of <strong>{bmr} kcal</strong> and activity level.
                                   We've adjusted for your goal to hit <strong>{targetCalories} kcal</strong> daily.
                              </p>
                         </div>
                         <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                              <ul className="space-y-3">
                                   <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-3 text-green-300" /> High Protein for satiety</li>
                                   <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-3 text-green-300" /> Controlled Carbs for energy stability</li>
                                   <li className="flex items-center"><CheckCircle className="h-5 w-5 mr-3 text-green-300" /> Healthy Fats for hormonal health</li>
                              </ul>
                         </div>
                    </div>
               </div>

               {/* Meals Grid */}
               <h3 className="text-2xl font-bold text-gray-900 mb-6 px-2">Recommended Meals</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {meals && meals.map((meal, idx) => (
                         <MealCard key={idx} meal={meal} />
                    ))}

                    {(!meals || meals.length === 0) && (
                         <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                              <p className="text-gray-500">No specific meals found for this criteria in the database.</p>
                         </div>
                    )}
               </div>

               <ShoppingList meals={meals || []} />
          </div>
     );
};

export default PlanDisplay;
