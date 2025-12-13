import React, { useState } from 'react';
import { User, ArrowRight, Check, Sparkles } from 'lucide-react';

const Step = ({ children, title, subtitle, isActive }) => {
     return (
          <div className={`transition-opacity duration-300 ${isActive ? 'block' : 'hidden'}`}>
               <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    <p className="text-gray-500">{subtitle}</p>
               </div>
               {children}
          </div>
     );
};

const PatientWizard = ({ onGenerate }) => {
     const [step, setStep] = useState(1);
     const [formData, setFormData] = useState({
          age: 30,
          gender: 'male',
          weight: 80,
          height: 175,
          activity: 'moderate',
          condition: 'none',
          goal: 'weight_loss',
          cuisine: 'arabian',
          dietType: 'balanced'
     });

     const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData(prev => ({ ...prev, [name]: value }));
     };

     const handleSelect = (name, value) => {
          setFormData(prev => ({ ...prev, [name]: value }));
     };

     const nextStep = () => setStep(s => s + 1);
     const prevStep = () => setStep(s => s - 1);

     const handleSubmit = () => {
          onGenerate(formData);
     };

     return (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
               {/* Progress Bar */}
               <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex space-x-2">
                         {[1, 2, 3, 4].map(s => (
                              <div key={s} className={`h-2 w-12 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-gray-200'}`} />
                         ))}
                    </div>
                    <span className="text-sm font-medium text-gray-500">Step {step} of 4</span>
               </div>

               <div className="p-8 flex-1 relative">
                    <Step title="Patient Profile" subtitle="Enter basic physiological metrics" isActive={step === 1}>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                   <label className="block text-sm font-medium text-gray-700">Gender</label>
                                   <div className="flex space-x-4">
                                        <button
                                             onClick={() => handleSelect('gender', 'male')}
                                             className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center space-x-2 transition-all ${formData.gender === 'male' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 hover:border-gray-200'}`}
                                        >
                                             <User className="h-5 w-5" /> <span>Male</span>
                                        </button>
                                        <button
                                             onClick={() => handleSelect('gender', 'female')}
                                             className={`flex-1 py-3 px-4 rounded-xl border-2 flex items-center justify-center space-x-2 transition-all ${formData.gender === 'female' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 hover:border-gray-200'}`}
                                        >
                                             <User className="h-5 w-5" /> <span>Female</span>
                                        </button>
                                   </div>
                              </div>

                              <div className="space-y-2">
                                   <label className="text-sm font-medium text-gray-700">Age</label>
                                   <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary" />
                              </div>
                              <div className="space-y-2">
                                   <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
                                   <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary" />
                              </div>
                              <div className="space-y-2">
                                   <label className="text-sm font-medium text-gray-700">Height (cm)</label>
                                   <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary" />
                              </div>
                         </div>
                    </Step>

                    <Step title="Clinical Factors" subtitle="Health conditions and activity level" isActive={step === 2}>
                         <div className="space-y-6">
                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-3">Health Condition</label>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {['None', 'Diabetes (Type 2)', 'Hypertension', 'Digestive Sensitivities (IBS)'].map(opt => {
                                             const val = opt.split(' ')[0].toLowerCase();
                                             return (
                                                  <button
                                                       key={val}
                                                       onClick={() => handleSelect('condition', val)}
                                                       className={`p-4 rounded-xl border text-left transition-all ${formData.condition === val ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 hover:border-gray-300'}`}
                                                  >
                                                       <div className="flex items-center justify-between">
                                                            <span className="font-medium text-gray-900">{opt}</span>
                                                            {formData.condition === val && <Check className="h-5 w-5 text-primary" />}
                                                       </div>
                                                  </button>
                                             )
                                        })}
                                   </div>
                              </div>

                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-3">Activity Level</label>
                                   <select name="activity" value={formData.activity} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary">
                                        <option value="sedentary">Sedentary (Office job)</option>
                                        <option value="lightly_active">Lightly Active</option>
                                        <option value="moderate">Moderate Exercise</option>
                                        <option value="very_active">Very Active</option>
                                   </select>
                              </div>
                         </div>
                    </Step>

                    <Step title="Preferences & Goals" subtitle="Cuisine and diet strategy" isActive={step === 3}>
                         <div className="space-y-6">
                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-3">Goal</label>
                                   <div className="flex space-x-2 p-1 bg-gray-100 rounded-xl">
                                        {['Weight Loss', 'Maintenance', 'Muscle Gain'].map(g => {
                                             const val = g.toLowerCase().replace(' ', '_');
                                             return (
                                                  <button
                                                       key={val}
                                                       onClick={() => handleSelect('goal', val)}
                                                       className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${formData.goal === val ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-900'}`}
                                                  >
                                                       {g}
                                                  </button>
                                             )
                                        })}
                                   </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
                                        <select name="cuisine" value={formData.cuisine} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary">
                                             <option value="arabian">Arabian Gulf</option>
                                             <option value="egyptian">Egyptian</option>
                                             <option value="north_african">North African (Maghreb)</option>
                                             <option value="iraqi">Iraqi</option>
                                        </select>
                                   </div>
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Diet Protocol</label>
                                        <select name="dietType" value={formData.dietType} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary">
                                             <option value="balanced">Balanced</option>
                                             <option value="low_carb">Low Carb</option>
                                             <option value="keto">Keto</option>
                                             <option value="fasting">Intermittent Fasting</option>
                                        </select>
                                   </div>
                              </div>
                         </div>
                    </Step>

                    <Step title="Review" subtitle="Confirm your profile settings" isActive={step === 4}>
                         <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                              <div className="flex justify-between border-b pb-2">
                                   <span className="text-gray-500">Demographics</span>
                                   <span className="font-medium">{formData.gender}, {formData.age}y, {formData.weight}kg</span>
                              </div>
                              <div className="flex justify-between border-b pb-2">
                                   <span className="text-gray-500">Condition</span>
                                   <span className="font-medium text-red-500 capitalize">{formData.condition}</span>
                              </div>
                              <div className="flex justify-between border-b pb-2">
                                   <span className="text-gray-500">Target</span>
                                   <span className="font-medium capitalize">{formData.goal.replace('_', ' ')}</span>
                              </div>
                              <div className="flex justify-between">
                                   <span className="text-gray-500">Protocol</span>
                                   <span className="font-medium capitalize">{formData.cuisine} ({formData.dietType})</span>
                              </div>
                         </div>
                    </Step>
               </div>

               <div className="p-8 border-t bg-gray-50/50 flex justify-between">
                    {step > 1 ? (
                         <button onClick={prevStep} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-100 transition-colors">
                              Back
                         </button>
                    ) : <div />}

                    {step < 4 ? (
                         <button onClick={nextStep} className="px-8 py-3 rounded-xl bg-primary text-white font-medium shadow-lg shadow-primary/30 hover:bg-secondary transition-all flex items-center">
                              Next Step <ArrowRight className="ml-2 h-4 w-4" />
                         </button>
                    ) : (
                         <button onClick={handleSubmit} className="px-8 py-3 rounded-xl bg-gray-900 text-white font-medium shadow-lg hover:bg-black transition-all flex items-center">
                              Generate Plan <Sparkles className="ml-2 h-4 w-4 text-yellow-400" />
                         </button>
                    )}
               </div>
          </div>
     );
};

export default PatientWizard;
