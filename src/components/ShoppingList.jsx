import React, { useState } from 'react';
import { CheckSquare, Square, Trash2 } from 'lucide-react';

const ShoppingList = ({ meals }) => {
     const [items, setItems] = useState(() => {
          // Flatten all ingredients from all meals
          if (!meals || !Array.isArray(meals)) return [];

          const allIngredients = meals.flatMap(meal => {
               if (!meal) return [];

               let list = [];
               if (Array.isArray(meal.ingredients)) {
                    list = meal.ingredients;
               } else if (meal.ingredients && typeof meal.ingredients === 'object') {
                    list = Object.entries(meal.ingredients).map(([key, val]) => ({
                         name: key.replace(/_/g, ' '),
                         ...val
                    }));
               }

               return list.map(i => ({
                    ...i,
                    id: Math.random().toString(36).substr(2, 9),
                    checked: false
               }));
          });
          return allIngredients;
     });

     const toggleItem = (id) => {
          setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
     };

     const clearChecked = () => {
          setItems(items.filter(item => !item.checked));
     };

     if (items.length === 0) return null;

     return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-8">
               <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                         <CheckSquare className="h-5 w-5 mr-2 text-primary" />
                         Shopping List
                    </h3>
                    <button onClick={clearChecked} className="text-sm text-red-500 hover:text-red-700 flex items-center">
                         <Trash2 className="h-4 w-4 mr-1" /> Clear Checked
                    </button>
               </div>
               <div className="space-y-2">
                    {items.map(item => {
                         const name = item.item?.en || item.name || item.item;
                         const amount = item.amount || item.amount_g;
                         const unit = item.unit || '';

                         return (
                              <div
                                   key={item.id}
                                   onClick={() => toggleItem(item.id)}
                                   className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${item.checked ? 'bg-gray-50 text-gray-400 line-through' : 'hover:bg-gray-50 text-gray-700'}`}
                              >
                                   {item.checked ? <CheckSquare className="h-5 w-5 mr-3 text-green-500" /> : <Square className="h-5 w-5 mr-3 text-gray-300" />}
                                   <span>{name} <span className="text-xs ml-1 opacity-70">({amount}{unit})</span></span>
                              </div>
                         );
                    })}
               </div>
          </div>
     );
};

export default ShoppingList;
