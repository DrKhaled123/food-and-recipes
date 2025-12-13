
/**
 * Advanced Nutrition Calculator
 * Parses the complex JSON structure to find the best fit plan for the patient.
 */

// Helper: safe eval for math from JSON strings
const parseFormula = (formula, { weight, height, age }) => {
     // formula e.g. "88.362 + (13.397 × weight_kg) + (4.799 × height_cm) - (5.677 × age)"
     let expr = formula
          .replace(/×/g, '*')
          .replace(/weight_kg/g, weight)
          .replace(/height_cm/g, height)
          .replace(/age/g, age);
     try {
          // Evaluate safely-ish (data is trusted local)
          return eval(expr);
     } catch (e) {
          console.error("Formula parse error:", e);
          return 2000; // Fallback BMR
     }
};

export const calculatePlan = (formData, nutritionData) => {
     const { age, weight, height, gender, activity, goal, cuisine, condition, dietType } = formData;

     // 1. Find best matching module
     // Prioritize modules that match "cuisine" AND "dietType" (or condition)
     let selectedModule = null;
     let moduleName = "General";

     // Scoring system to find best module
     let bestScore = -1;

     nutritionData.forEach(modWrapper => {
          const key = Object.keys(modWrapper)[0];
          const mod = modWrapper[key];

          let score = 0;

          // Check cuisine support
          if (key.includes(cuisine) ||
               (mod.supported_regions && mod.supported_regions.some(r => r.includes(cuisine))) ||
               (mod.supported_cuisines && mod.supported_cuisines.some(c => c.includes(cuisine)))) {
               score += 10;
          }

          // Check diet type / purpose
          if (key.includes(dietType)) score += 5; // e.g. "keto" or "low_carb"
          if (condition === 'diabetes' && key.includes('low_carb')) score += 3;
          if (dietType === 'fasting' && key.includes('fasting')) score += 5;

          if (score > bestScore) {
               bestScore = score;
               selectedModule = mod;
               moduleName = key.replace(/_/g, ' ').toUpperCase();
          }
     });

     if (!selectedModule) {
          // Fallback to first available if no match
          selectedModule = Object.values(nutritionData[0])[0];
          moduleName = Object.keys(nutritionData[0])[0];
     }

     // 2. Calculate BMR / TDEE
     // Try to find formula in module, or use standard Mifflin-St Jeor
     let bmr = 0;
     if (selectedModule.calculation_engine?.bmr_formulas?.[gender]) {
          bmr = parseFormula(selectedModule.calculation_engine.bmr_formulas[gender], { weight, height, age });
     } else {
          // Standard fallback
          if (gender === 'male') bmr = 10 * weight + 6.25 * height - 5 * age + 5;
          else bmr = 10 * weight + 6.25 * height - 5 * age - 161;
     }

     // Activity Multiplier
     let multiplier = selectedModule.calculation_engine?.activity_multipliers?.[activity] || 1.375; // Default light
     // specific overrides sometimes use 'moderately_active' vs 'moderate'
     if (!selectedModule.calculation_engine?.activity_multipliers?.[activity]) {
          // Map simple keys to likely JSON keys
          const map = { 'moderate': 'moderately_active', 'sedentary': 'sedentary' };
          if (map[activity]) multiplier = selectedModule.calculation_engine.activity_multipliers[map[activity]] || 1.375;
     }

     const tdee = Math.round(bmr * multiplier);

     // 3. Goal Adjustment
     let targetCalories = tdee;
     if (goal === 'weight_loss') targetCalories = Math.round(tdee * 0.8); // 20% deficit default
     else if (goal === 'muscle_gain') targetCalories = Math.round(tdee * 1.15); // 15% surplus

     // Check specific module rules for goals
     if (selectedModule.personalization_engine?.health_goals?.[goal]) {
          const rules = selectedModule.personalization_engine.health_goals[goal];
          if (rules.calorie_deficit) targetCalories = Math.round(tdee * (1 - rules.calorie_deficit));
          if (rules.calorie_surplus) targetCalories = Math.round(tdee * (1 + rules.calorie_surplus));
     }

     // 4. Macro Calculation
     let macros = { protein: 150, carbs: 150, fat: 70 }; // Default
     if (selectedModule.calculation_engine?.low_carb_macro_targets) {
          const t = selectedModule.calculation_engine.low_carb_macro_targets;
          macros.protein = Math.round((targetCalories * t.protein_percent) / 4);
          macros.carbs = Math.round((targetCalories * t.carb_percent) / 4);
          macros.fat = Math.round((targetCalories * t.fat_percent) / 9);
     } else if (selectedModule.calculation_engine?.keto_macro_targets) {
          const t = selectedModule.calculation_engine.keto_macro_targets;
          macros.protein = Math.round((targetCalories * t.protein_percent) / 4);
          // Keto specific: often net carbs limit rather than percent
          macros.carbs = t.max_daily_carbs_g || Math.round((targetCalories * 0.05) / 4);
          macros.fat = Math.round((targetCalories * t.fat_percent) / 9);
     }

     // Condition Overrides (Diabetes)
     if (condition === 'diabetes') {
          // Cap carbs explicitly if needed
          if (macros.carbs > 100) macros.carbs = 75; // Safe upper limit heuristic
     }

     // 5. Meal Extraction
     /* 
        We need to find meals that fit. 
        Strategy: 
        - Look in 'weekly_meal_plans' of the selected module.
        - If there's a specific 'country' or 'cuisine' key (e.g. saudi_arabia_low_carb), pick that.
        - Otherwise, pick any available day.
     */
     let meals = [];
     let plans = selectedModule.weekly_meal_plans || selectedModule.meal_plans;
     if (plans) {
          // Try to match cuisine key
          let planKey = Object.keys(plans).find(k => k.includes(cuisine)) || Object.keys(plans)[0];
          let planData = plans[planKey];

          // Often plans are nested like "day_1", "16_8_schedule" -> "day_1"
          // Let's traverse down to find an array of meals

          const findMeals = (obj) => {
               if (obj.meals && Array.isArray(obj.meals)) return obj.meals;
               // recursive search
               for (let k of Object.keys(obj)) {
                    if (typeof obj[k] === 'object' && obj[k] !== null) {
                         const found = findMeals(obj[k]);
                         if (found) return found;
                    }
               }
               return null;
          };

          const extracted = findMeals(planData);
          if (extracted) meals = extracted;
     }

     return {
          bmr: Math.round(bmr),
          tdee,
          targetCalories,
          macros,
          meals,
          moduleName,
          planDescription: condition !== 'none' ? `Tailored for ${condition} & ${goal.replace('_', ' ')}` : `Optimized for ${goal.replace('_', ' ')}`
     };
};
