import React, { useEffect } from 'react';
 
import { X, Clock, Flame, Utensils, CheckCircle } from 'lucide-react';

const RecipeModal = ({ isOpen, onClose, recipe }) => {
     useEffect(() => {
          if (isOpen) {
               document.body.style.overflow = 'hidden';
          } else {
               document.body.style.overflow = 'unset';
          }
          return () => {
               document.body.style.overflow = 'unset';
          };
     }, [isOpen]);

     if (!isOpen || !recipe) return null;

     

     const getSimpleTxt = (field) => {
          if (!field) return '';
          if (typeof field === 'string') return field;
          return `${field.en} (${field.ar})`;
     };

     // Extract Color for Tag
     const tagColor = recipe.tags?.[0]?.color || 'green';
     const tagColors = {
          green: 'bg-green-100 text-green-700',
          indigo: 'bg-indigo-100 text-indigo-700',
          pink: 'bg-pink-100 text-pink-700',
          yellow: 'bg-yellow-100 text-yellow-700',
     };
     const tagClass = tagColors[tagColor] || tagColors.green;

     return (
          <>
               {/* Backdrop */}
               <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
               />

               {/* Modal Container */}
               <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
               >
                              {/* Modal Content */}
                              <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto recipe-card`}>

                                   {/* Close Button */}
                                   <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
                                   >
                                        <X className="h-5 w-5 text-gray-500" />
                                   </button>

                                   <div className="p-6 md:p-8">
                                        {/* Header */}
                                        <div className="mb-6">
                                             {recipe.tags && recipe.tags.map((tag, idx) => (
                                                  <span key={idx} className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${tagClass}`}>
                                                       {tag.en} ({tag.ar})
                                                  </span>
                                             ))}

                                             <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                                  {recipe.meal_name?.en || recipe.name}
                                             </h2>
                                             <p className="text-xl font-medium text-gray-500 mb-4" dir="rtl">
                                                  {recipe.meal_name?.ar && `(${recipe.meal_name.ar})`}
                                             </p>

                                             <div className="text-sm text-gray-500 flex items-center gap-2">
                                                  <span>Cuisine: {getSimpleTxt(recipe.cuisine)}</span>
                                                  <span className="text-gray-300">|</span>
                                                  <span>Difficulty: {getSimpleTxt(recipe.difficulty_level)}</span>
                                             </div>
                                        </div>

                                        {/* Time & Macros Grid */}
                                        <div className="grid grid-cols-3 gap-4 text-center border-t border-b border-gray-100 py-4 mb-8">
                                             <div>
                                                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Prep | تحضير</p>
                                                  <p className="font-bold text-gray-900">{recipe.prep_time_minutes || 15} min</p>
                                             </div>
                                             <div>
                                                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Cook | طبخ</p>
                                                  <p className="font-bold text-gray-900">{recipe.cook_time_minutes > 0 ? `${recipe.cook_time_minutes} min` : 'N/A'}</p>
                                             </div>
                                             <div>
                                                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                                       {recipe.highlight_macro ? recipe.highlight_macro.label : 'Net Carbs | صافي الكربوهيدرات'}
                                                  </p>
                                                  <p className={`font-bold ${recipe.highlight_macro ? 'text-green-600' : 'text-red-600'}`}>
                                                       {recipe.highlight_macro ? recipe.highlight_macro.value : `${recipe.net_carbs_g || 0}g`}
                                                  </p>
                                             </div>
                                        </div>

                                        {/* Macros Detailed Box */}
                                        {recipe.total_macros && (
                                             <div className="bg-blue-50/50 rounded-xl p-5 mb-8 border border-blue-100">
                                                  <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
                                                       <Flame className="h-5 w-5 mr-2" />
                                                       Total Macros ({recipe.total_macros.calories} Cal)
                                                       <span className="ml-1 text-sm font-normal text-blue-700">| إجمالي المغذيات</span>
                                                  </h3>
                                                  <div className="space-y-2 text-sm">
                                                       {Object.entries(recipe.total_macros).map(([key, val]) => {
                                                            if (key === 'calories') return null;
                                                            const labelMap = {
                                                                 protein_g: { en: 'Protein', ar: 'بروتين' },
                                                                 fat_g: { en: 'Fat', ar: 'دهون' },
                                                                 carbs_g: { en: 'Carbs (Total)', ar: 'كربوهيدرات (إجمالي)' }
                                                            };
                                                            const label = labelMap[key];
                                                            if (!label) return null;
                                                            return (
                                                                 <div key={key} className="flex justify-between items-center border-b border-blue-100/50 last:border-0 pb-1 last:pb-0">
                                                                      <span className="text-gray-600">{label.en} | {label.ar}</span>
                                                                      <span className="font-bold text-blue-900">{val}g</span>
                                                                 </div>
                                                            );
                                                       })}
                                                  </div>
                                             </div>
                                        )}

                                        {/* Ingredients */}
                                        <div className="mb-8">
                                             <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b flex justify-between items-center">
                                                  Ingredients
                                                  <span className="text-lg font-medium text-gray-400">المكونات</span>
                                             </h3>
                                             <ul className="space-y-3">
                                                  {recipe.ingredients && recipe.ingredients.map((ing, i) => (
                                                       <li
                                                            key={i}
                                                            className={`p-3 rounded-lg ${ing.bg_color === 'yellow' ? 'bg-yellow-50 text-yellow-900' : 'bg-gray-50 text-gray-800'}`}
                                                       >
                                                            <div className="font-medium flex flex-wrap gap-1">
                                                                 <span>{ing.item?.en || ing.item}</span>
                                                                 {ing.item?.ar && <span dir="rtl" className="text-gray-600">({ing.item.ar})</span>}
                                                                 {ing.amount && <span className="text-gray-400">: {ing.amount}</span>}
                                                            </div>
                                                            {ing.note && (
                                                                 <p className="text-xs text-gray-500 mt-1">
                                                                      {ing.note.en}
                                                                      {ing.note.ar && <span dir="rtl" className="block mt-0.5">{ing.note.ar}</span>}
                                                                 </p>
                                                            )}
                                                       </li>
                                                  ))}
                                             </ul>
                                        </div>

                                        {/* Preparation */}
                                        <div>
                                             <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b flex justify-between items-center">
                                                  Preparation Method
                                                  <span className="text-lg font-medium text-gray-400">طريقة التحضير</span>
                                             </h3>

                                             {/* Split steps by newlines or numbers */}
                                             <div className="space-y-4">
                                                  {(() => {
                                                       const stepsEn = recipe.preparation_method?.en ? recipe.preparation_method.en.split(/\d+\.\s/).filter(Boolean) : [];
                                                       const stepsAr = recipe.preparation_method?.ar ? recipe.preparation_method.ar.split(/\d+\.\s/).filter(Boolean) : [];

                                                       return stepsEn.map((step, i) => (
                                                            <div key={i} className="flex gap-4">
                                                                 <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold mt-0.5">
                                                                      {i + 1}
                                                                 </div>
                                                                 <div className="text-gray-700 text-sm leading-relaxed flex-1">
                                                                      <p className="mb-1">{step.trim()}</p>
                                                                      {stepsAr[i] && <p dir="rtl" className="text-gray-500">{stepsAr[i].trim()}</p>}
                                                                 </div>
                                                            </div>
                                                       ));
                                                  })()}
                                             </div>
                                        </div>

                                        {/* Cooking Tip */}
                                        {recipe.cooking_tip && (
                                             <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                                                  <p className="text-yellow-800 text-sm font-semibold mb-1">
                                                       Cooking Tip: <span className="font-normal text-yellow-900">{recipe.cooking_tip.en}</span>
                                                  </p>
                                                  <p dir="rtl" className="text-yellow-800 text-sm mt-2">
                                                       نصيحة الطبخ: <span className="font-normal text-yellow-900">{recipe.cooking_tip.ar}</span>
                                                  </p>
                                             </div>
                                        )}

                                   </div>
                              </div>
               </div>
          </>
     );
};

export default RecipeModal;
