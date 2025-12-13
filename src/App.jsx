import React, { useState, Suspense } from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
const PatientWizard = React.lazy(() => import('./components/PatientWizard'));
const PlanDisplay = React.lazy(() => import('./components/PlanDisplay'));
const RecipeGallery = React.lazy(() => import('./components/RecipeGallery'));
import { calculatePlan } from './utils/calculator';
// Import JSON data directly
import nutritionData from './data/nutrition.json';

function App() {
  const [view, setView] = useState('hero'); // hero, generator, display, gallery
  const [planResult, setPlanResult] = useState(null);

  const handleStart = () => {
    setView('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerate = (formData) => {
    // Process data
    const result = calculatePlan(formData, nutritionData);
    setPlanResult(result);
    setView('display');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setPlanResult(null);
    setView('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      {view === 'hero' && (
        <Hero
          onStart={handleStart}
          onBrowse={() => setView('gallery')}
        />
      )}

      {view === 'generator' && (
        <div className="animate-fade-in">
          <button
            onClick={() => setView('hero')}
            className="max-w-3xl mx-auto px-4 mt-8 mb-4 text-gray-500 hover:text-gray-900 flex items-center"
          >
            ← Back
          </button>
          <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8 text-gray-500">Loading…</div>}>
            <PatientWizard onGenerate={handleGenerate} />
          </Suspense>
        </div>
      )}

      {view === 'display' && (
        <div className="animate-fade-in">
          <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8 text-gray-500">Loading…</div>}>
            <PlanDisplay result={planResult} onReset={handleReset} />
          </Suspense>
        </div>
      )}

      {view === 'gallery' && (
        <div className="animate-fade-in">
          <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-8 text-gray-500">Loading…</div>}>
            <RecipeGallery nutritionData={nutritionData} onBack={() => setView('hero')} />
          </Suspense>
        </div>
      )}
    </Layout>
  );
}

export default App;
