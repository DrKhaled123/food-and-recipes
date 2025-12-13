import React, { useState } from 'react';
 
import { User, Activity, Scale, Ruler, UtensilsCrossed } from 'lucide-react';

const PlanGenerator = ({ onGenerate }) => {
     const [formData, setFormData] = useState({
          age: '',
          gender: 'male',
          weight: '',
          height: '',
          activity: 'moderately_active',
          goal: 'weight_loss',
          cuisine: 'arabian_gulf'
     });

     const handleChange = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
     };

     const handleSubmit = (e) => {
          e.preventDefault();
          onGenerate(formData);
     };

     const inputClass = "mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4 bg-gray-50 hover:bg-white transition-colors";
     const labelClass = "block text-sm font-medium text-gray-700 mb-1";

     return (
          <div className="max-w-3xl mx-auto px-4 py-12">
               <div
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
               >
                    <div className="bg-primary px-6 py-4">
                         <h2 className="text-2xl font-bold text-white flex items-center">
                              <User className="mr-2" />
                              Build Your Personal Plan
                         </h2>
                         <p className="text-green-100 text-sm mt-1">Tell us about yourself to get a tailored nutrition guide.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                              {/* Personal Details */}
                              <div className="space-y-6">
                                   <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Body Metrics</h3>
                                   <div>
                                        <label className={labelClass}>Age</label>
                                        <input type="number" name="age" required value={formData.age} onChange={handleChange} className={inputClass} placeholder="e.g. 30" />
                                   </div>
                                   <div>
                                        <label className={labelClass}>Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                                             <option value="male">Male</option>
                                             <option value="female">Female</option>
                                        </select>
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                        <div>
                                             <label className={labelClass}>Weight (kg)</label>
                                             <div className="relative rounded-md shadow-sm">
                                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                       <Scale className="h-4 w-4 text-gray-400" />
                                                  </div>
                                                  <input type="number" name="weight" required value={formData.weight} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="80" />
                                             </div>
                                        </div>
                                        <div>
                                             <label className={labelClass}>Height (cm)</label>
                                             <div className="relative rounded-md shadow-sm">
                                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                       <Ruler className="h-4 w-4 text-gray-400" />
                                                  </div>
                                                  <input type="number" name="height" required value={formData.height} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="175" />
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              {/* Lifestyle & Goals */}
                              <div className="space-y-6">
                                   <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Lifestyle & Goals</h3>
                                   <div>
                                        <label className={labelClass}>Activity Level</label>
                                        <div className="relative">
                                             <Activity className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
                                             <select name="activity" value={formData.activity} onChange={handleChange} className={`${inputClass} pl-10`}>
                                                  <option value="sedentary">Sedentary (Little/no exercise)</option>
                                                  <option value="lightly_active">Lightly Active (1-3 days/week)</option>
                                                  <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                                                  <option value="very_active">Very Active (6-7 days/week)</option>
                                                  <option value="extremely_active">Extremely Active (Physical job)</option>
                                             </select>
                                        </div>
                                   </div>
                                   <div>
                                        <label className={labelClass}>Goal</label>
                                        <select name="goal" value={formData.goal} onChange={handleChange} className={inputClass}>
                                             <option value="weight_loss">Weight Loss</option>
                                             <option value="maintenance">Maintenance</option>
                                             <option value="muscle_gain">Muscle Gain / Bulking</option>
                                        </select>
                                   </div>
                                   <div>
                                        <label className={labelClass}>Preferred Cuisine</label>
                                        <div className="relative">
                                             <UtensilsCrossed className="absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
                                             <select name="cuisine" value={formData.cuisine} onChange={handleChange} className={`${inputClass} pl-10`}>
                                                  <option value="arabian_gulf">Arabian Gulf (Low Carb)</option>
                                                  <option value="north_african">North African / Keto</option>
                                                  <option value="egyptian">Egyptian (Balanced)</option>
                                             </select>
                                        </div>
                                   </div>
                              </div>
                         </div>

                         <div className="pt-4">
                              <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:-translate-y-1">
                                   Calculate Macros & Generate Plan
                              </button>
                         </div>
                    </form>
               </div>
          </div>
     );
};

export default PlanGenerator;
