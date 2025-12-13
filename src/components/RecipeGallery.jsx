import React, { useMemo } from 'react';
import { Clock, ChevronDown, ChevronUp, UtensilsCrossed } from 'lucide-react';
 
import RecipeModal from './RecipeModal';

const GalleryItem = ({ meal }) => {
     const titleEn = meal.meal_name?.en || meal.name?.en || meal.meal_name || meal.name || "Untitled";
     const titleAr = meal.meal_name?.ar || meal.name?.ar || '';
     const prep = meal.prep_time_minutes || 15;
     // Handle both old and new tag structures
    const primaryTag = meal.tags?.[0];
    const type = primaryTag?.text?.en || primaryTag?.en || meal.difficulty_level?.en || "Easy";
    const color = primaryTag?.color || "gray";

    const colorClassMap = {
         emerald: 'bg-emerald-100 text-emerald-800',
         purple: 'bg-purple-100 text-purple-800',
         teal: 'bg-teal-100 text-teal-800',
         pink: 'bg-pink-100 text-pink-800',
         orange: 'bg-orange-100 text-orange-800',
         yellow: 'bg-yellow-100 text-yellow-800',
         blue: 'bg-blue-100 text-blue-800',
         sky: 'bg-sky-100 text-sky-800',
         red: 'bg-red-100 text-red-800',
         green: 'bg-green-100 text-green-800',
         indigo: 'bg-indigo-100 text-indigo-800',
         gray: 'bg-gray-100 text-gray-800',
    };
    const typeColorClass = colorClassMap[color] || colorClassMap.gray;

    const [expanded, setExpanded] = React.useState(false);

    const cardBgMap = {
         white: 'bg-white',
         yellow: 'bg-yellow-50',
         green: 'bg-green-50',
    };
    const cardBgClass = cardBgMap[meal.card_color] || 'bg-white';

    return (
         <div className={`${cardBgClass} rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group h-full flex flex-col recipe-card`}>
              <div className="p-6 flex flex-col h-full">
                   <div className="flex items-start justify-between mb-3">
                        <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${typeColorClass}`}>
                             {type}
                             {primaryTag?.text?.ar && <span className="ml-1">({primaryTag.text.ar})</span>}
                        </span>
                        <button
                             className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                             onClick={(e) => { e.stopPropagation(); setExpanded(v => !v); }}
                             aria-label={expanded ? 'Collapse recipe' : 'Expand recipe'}
                        >
                             {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                   </div>

                   <h3 className="text-xl font-bold text-[#7b3f00] mb-1 text-right dir-rtl truncate">{titleAr}</h3>
                   <p className="text-sm font-medium text-gray-700 mb-3 text-left">{titleEn}</p>

                   <div className="pt-3 mt-auto border-t border-gray-100 flex justify-between items-center text-gray-500 text-xs">
                        <div className="flex items-center">
                             <Clock className="h-3 w-3 mr-1.5" />
                             <span>{prep} min</span>
                        </div>
                        {meal.macros_serving && (
                             <div className="font-bold text-gray-700">
                                  {meal.macros_serving.calories} kcal
                             </div>
                        )}
                   </div>

                   {expanded && (
                             <div className="mt-4">
                                  {meal.ingredients && Array.isArray(meal.ingredients) && (
                                       <div className="bg-gray-50 rounded-lg p-3">
                                            <h4 className="text-xs font-semibold text-gray-900 mb-2 flex items-center">
                                                 <UtensilsCrossed className="h-3 w-3 mr-2" /> Ingredients | المكونات
                                            </h4>
                                            <ul className="space-y-1">
                                                 {meal.ingredients.slice(0, 4).map((ing, i) => (
                                                      <li key={i} className="text-xs text-gray-700">
                                                           <span>{(ing.item?.en || ing.item || '').trim()}</span>
                                                           {ing.item?.ar && (
                                                                <span dir="rtl" className="ml-1 text-gray-500">({ing.item.ar.trim()})</span>
                                                           )}
                                                      </li>
                                                 ))}
                                            </ul>
                                       </div>
                                  )}

                                  {meal.preparation_steps && Array.isArray(meal.preparation_steps) && (
                                       <div className="mt-3">
                                            <h4 className="text-xs font-semibold text-gray-900 mb-1">Preparation | طريقة التحضير</h4>
                                            <ol className="list-decimal list-inside space-y-1 text-xs text-gray-600">
                                                 {meal.preparation_steps.slice(0, 2).map((s, i) => (
                                                      <li key={i}>
                                                           <div>{(s.step?.en || s.step || s.en || '').trim()}</div>
                                                           {s.step?.ar && (
                                                                <div dir="rtl" className="text-gray-500">{s.step.ar.trim()}</div>
                                                           )}
                                                      </li>
                                                 ))}
                                            </ol>
                                       </div>
                                  )}
                             </div>
                        )}
              </div>
         </div>
    );
};

const RecipeGallery = ({ nutritionData, onBack }) => {
     // Extract categorized meals
    const { lowCarb, highCarb } = useMemo(() => {
        let lowCarbMeals = [];
        let highCarbMeals = [];
        // Check for new structure in curated recipes
        const curated = nutritionData[0]?.curated_meal_plan_recipes;
        if (curated) {
            if (curated.low_carb_keto) lowCarbMeals.push(...curated.low_carb_keto);
            if (curated.high_carb_traditional) highCarbMeals.push(...curated.high_carb_traditional);
            // No fallback listing for miscellaneous recipes
        }
        return { lowCarb: lowCarbMeals, highCarb: highCarbMeals };
    }, [nutritionData]);

     const [selectedRecipe, setSelectedRecipe] = React.useState(null);

     // Build diverse recipes from provided data
     const diverseRecipes = useMemo(() => {
          const toSteps = (en, ar) => {
               const enSteps = (en || '').split(/\d+\.\s/).filter(Boolean);
               const arSteps = (ar || '').split(/\d+\.\s/).filter(Boolean);
               return enSteps.map((e, i) => ({
                    step: { en: e.trim(), ar: (arSteps[i] || '').trim() }
               }));
          };
          const toIngredients = (en, ar) => {
               const enList = (en || '').split(/,\s*/).filter(Boolean);
               const arList = (ar || '').split(/,\s*/).filter(Boolean);
               return enList.map((txt, i) => ({
                    item: { en: txt.trim(), ar: arList[i] ? arList[i].trim() : undefined }
               }));
          };

          const r29 = {
               meal_name: {
                    en: 'Low-Carb Lamb Kofta with Yogurt-Mint Sauce',
                    ar: 'كفتة الضأن منخفضة الكربوهيدرات بصلصة الزبادي والنعناع'
               },
               prep_time_minutes: 20,
               tags: [
                    { text: { en: 'Low-Carb Diet', ar: 'نظام قليل الكربوهيدرات' }, color: 'emerald' }
               ],
               macros_serving: { calories: 590 },
               ingredients: toIngredients(
                    '180g Ground lamb (moderate fat), 50g Full-fat yogurt/Labneh, 10ml Olive oil, Spices (Cumin, coriander, onion powder), Fresh mint, 100g Grilled eggplant slices.',
                    '180 جرام لحم ضأن مفروم (دهون معتدلة)، 50 جرام زبادي كامل الدسم/لبنة، 10 مل زيت زيتون، بهارات (كمون، كزبرة، مسحوق بصل)، نعناع طازج، 100 جرام شرائح باذنجان مشوية.'
               ),
               preparation_steps: toSteps(
                    '1. Mix lamb with spices, form into kofta, and grill until cooked. 2. Sauce: Mix yogurt/Labneh with chopped fresh mint and a pinch of salt. 3. Grill the eggplant slices. 4. Serve the kofta over the eggplant, topped with the yogurt-mint sauce. This dish is rich in flavor and keto-compliant.',
                    '1. خلط لحم الضأن بالبهارات، وتشكيله ككفتة، وشويه حتى ينضج. 2. الصلصة: خلط الزبادي/اللبنة مع النعناع الطازج المفروم ورشة ملح. 3. شواء شرائح الباذنجان. 4. تقديم الكفتة فوق الباذنجان، وتغطيتها بصلصة الزبادي والنعناع. هذا الطبق غني بالنكهة ومتوافق مع الكيتو.'
               )
          };

          const r30 = {
               meal_name: {
                    en: 'Arabic Bread, Tahini, and Date Sandwich (Bulking)',
                    ar: 'ساندويتش الخبز العربي، الطحينة، والتمر (تضخيم)'
               },
               prep_time_minutes: 10,
               tags: [
                    { text: { en: 'High-Calorie Bulking', ar: 'تضخيم عالي السعرات' }, color: 'orange' }
               ],
               macros_serving: { calories: 550 },
               ingredients: toIngredients(
                    '80g Traditional Arabian Bread (e.g., half Baladi), 30g Tahini (approx. 3 tbsp), 3 Medjool Dates (mashed), 5g Nuts (pistachios/almonds).',
                    '80 جرام خبز عربي تقليدي (نصف رغيف بلدي)، 30 جرام طحينة (حوالي 3 ملاعق كبيرة)، 3 تمور مجهول (مهروسة)، 5 جرام مكسرات (فستق/لوز).'
               ),
               preparation_steps: toSteps(
                    '1. Mash the dates into a paste. 2. Spread the Tahini evenly over the bread. 3. Spread the mashed date paste over the Tahini. 4. Sprinkle with chopped nuts. This is a highly dense, rapid energy snack perfect for bulking or post-workout.',
                    '1. هرس التمر ليصبح عجينة. 2. فرد الطحينة بالتساوي على الخبز. 3. فرد عجينة التمر المهروسة فوق الطحينة. 4. رش المكسرات المفرومة. وجبة خفيفة عالية الكثافة وسريعة الطاقة مناسبة للتضخيم أو بعد التمرين.'
               )
          };

          const r31 = {
               meal_name: {
                    en: 'Meal Prep: Lean Fish and Bulgur Bowl with Spices',
                    ar: 'تحضير الوجبات: وعاء السمك الهبر والبرغل بالبهارات'
               },
               prep_time_minutes: 25,
               tags: [
                    { text: { en: 'High-Protein Meal Prep', ar: 'تحضير وجبات عالية البروتين' }, color: 'blue' }
               ],
               macros_serving: { calories: 400 },
               ingredients: toIngredients(
                    '150g White fish fillet (cod/snapper), 80g Cooked bulgur wheat (from batch), 10ml Lemon-dill sauce (low-fat), 100g Steamed green beans.',
                    '150 جرام سمك فيليه أبيض (القد/القاروس)، 80 جرام برغل مطبوخ (من الدفعة)، 10 مل صلصة ليمون وشبت (قليلة الدسم)، 100 جرام فاصوليا خضراء مطهوة بالبخار.'
               ),
               preparation_steps: toSteps(
                    '1. Season fish and bake or steam (for low-fat protein prep). 2. Combine the pre-cooked bulgur (Grain Preparation) with the steamed green beans. 3. Top with the lean fish and low-fat lemon-dill sauce. This is a perfect cold or reheated meal prep option.',
                    '1. تتبيل السمك وخبزه أو طهيه بالبخار (لتحضير بروتين قليل الدهون). 2. خلط البرغل المطبوخ مسبقاً (تحضير الحبوب) مع الفاصوليا الخضراء المطهوة بالبخار. 3. وضع السمك الخالي من الدهون وصلصة الليمون والشبت قليلة الدسم في الأعلى. هذا خيار مثالي لتحضير الوجبات بارداً أو معاد تسخينه.'
               )
          };

          const r32 = {
               meal_name: {
                    en: 'Low-Carb Halloumi and Za\'atar Skewers',
                    ar: 'أسياخ الحلوم والزعتر منخفضة الكربوهيدرات'
               },
               prep_time_minutes: 15,
               tags: [
                    { text: { en: 'Low-Carb Diet', ar: 'نظام قليل الكربوهيدرات' }, color: 'emerald' }
               ],
               macros_serving: { calories: 450 },
               ingredients: toIngredients(
                    '100g Halloumi cheese (diced), 15ml Olive oil, Za\'atar spice blend, 100g Cherry tomatoes and green bell peppers (for skewers).',
                    '100 جرام جبنة حلوم (مقطعة مكعبات)، 15 مل زيت زيتون، خلطة بهارات الزعتر، 100 جرام طماطم كرزية وفلفل حلو أخضر (للأسياخ).'
               ),
               preparation_steps: toSteps(
                    '1. Toss the Halloumi, peppers, and tomatoes with olive oil and Za\'atar. 2. Thread onto skewers. 3. Grill or pan-fry the skewers until the Halloumi is golden brown and softened. 4. Serve warm. Halloumi is an excellent low-carb, high-fat/protein traditional cheese option.',
                    '1. خلط الحلوم والفلفل والطماطم بزيت الزيتون والزعتر. 2. تثبيتها في الأسياخ. 3. شويها أو قليها حتى يصبح لون الحلوم ذهبياً وبها طراوة. 4. تقدم دافئة. الحلوم خيار جبن تقليدي ممتاز قليل الكربوهيدرات وعالي الدهون/البروتين.'
               )
          };

          const r33 = {
               meal_name: {
                    en: 'Oven-Baked Spiced Chicken Drumsticks (Meal Prep Protein)',
                    ar: 'أفخاذ الدجاج المتبلة بالفرن (بروتين للتحضير المسبق)'
               },
               prep_time_minutes: 45,
               tags: [
                    { text: { en: 'High-Protein Meal Prep', ar: 'تحضير وجبات عالية البروتين' }, color: 'blue' }
               ],
               macros_serving: { calories: 420 },
               ingredients: toIngredients(
                    '220g Chicken drumsticks (skin-on, optional), 15ml Olive oil, Arabian spice blend (Baharat, Cumin, Turmeric), Garlic powder, Salt, 100g Onion and bell pepper wedges.',
                    '220 جرام أفخاذ دجاج (بالجلد اختياري)، 15 مل زيت زيتون، خلطة بهارات عربية (بهارات، كمون، كركم)، مسحوق ثوم، ملح، 100 جرام أسافين بصل وفلفل حلو.'
               ),
               preparation_steps: toSteps(
                    '1. Pat chicken dry. Mix olive oil and all spices to create a marinade. 2. Marinate the drumsticks (and vegetable wedges) for at least 30 minutes, or overnight. 3. Preheat oven to 200°C (392°F). Place chicken and vegetables on a baking sheet. 4. Bake for 30-40 minutes until chicken is cooked through and skin is crispy.',
                    '1. تجفيف الدجاج بمنشفة ورقية. خلط زيت الزيتون وجميع البهارات لعمل التتبيلة. 2. تتبيل أفخاذ الدجاج (وأسافين الخضروات) لمدة 30 دقيقة على الأقل، أو ليلة كاملة. 3. تسخين الفرن مسبقاً إلى 200 درجة مئوية. وضع الدجاج والخضروات على صينية الخبز. 4. الخبز لمدة 30-40 دقيقة حتى ينضج الدجاج تماماً ويصبح الجلد مقرمشاً.'
               )
          };

          const r34 = {
               meal_name: {
                    en: 'Creamy Saffron Rice Pudding (High-Carb Dessert/Bulking)',
                    ar: 'حلوى الأرز بالزعفران الكريمية (تحلية عالية الكربوهيدرات)'
               },
               prep_time_minutes: 50,
               tags: [
                    { text: { en: 'High-Calorie Bulking', ar: 'تضخيم عالي السعرات' }, color: 'orange' }
               ],
               macros_serving: { calories: 500 },
               ingredients: toIngredients(
                    '80g Basmati rice, 200ml Full-fat milk, 15g Sugar/Honey, Pinch of saffron threads, 5g Pistachios (chopped) for garnish.',
                    '80 جرام أرز بسمتي، 200 مل حليب كامل الدسم، 15 جرام سكر/عسل، رشة خيوط زعفران، 5 جرام فستق (مقطع) للتزيين.'
               ),
               preparation_steps: toSteps(
                    '1. Wash rice. Boil the milk, then reduce heat to low. 2. Add rice, saffron, and sugar/honey to the milk. 3. Simmer slowly for 30-40 minutes, stirring frequently to prevent sticking, until the rice is creamy and the mixture has thickened. 4. Pour into bowls, cool, and garnish with chopped pistachios.',
                    '1. غسل الأرز. غلي الحليب، ثم تخفيض الحرارة. 2. إضافة الأرز والزعفران والسكر/العسل إلى الحليب. 3. الغليان ببطء لمدة 30-40 دقيقة، مع التحريك المتكرر لمنع الالتصاق، حتى يصبح الأرز كريمياً ويتكاثف الخليط. 4. صب المزيج في أوعية، وتبريده، وتزيينه بالفستق المقطع.'
               )
          };

         const r35 = {
              meal_name: {
                   en: 'Arabian Spice Shrimp Stir-Fry (Low-Carb, Quick Cook)',
                   ar: 'جمبري مقلي بالبهارات العربية (طبخ سريع قليل الكربوهيدرات)'
              },
              prep_time_minutes: 15,
              tags: [
                   { text: { en: 'Low-Carb Diet', ar: 'نظام قليل الكربوهيدرات' }, color: 'emerald' }
              ],
              macros_serving: { calories: 390 },
              ingredients: toIngredients(
                   '150g Shrimp (peeled/deveined), 15ml Olive oil, 150g Low-carb vegetables (broccoli florets, zucchini chunks), 5g Minced garlic, Lemon zest, Spices (Cumin, Red Pepper Flakes, Salt).',
                   '150 جرام جمبري (مقشر/منظف)، 15 مل زيت زيتون، 150 جرام خضروات قليلة الكربوهيدرات (زهور البروكلي، قطع الكوسة)، 5 جرام ثوم مفروم، قشر ليمون مبشور، بهارات (كمون، فلفل أحمر مجروش، ملح).'
              ),
              preparation_steps: toSteps(
                   '1. Heat olive oil in a wide pan or wok. 2. Add garlic and vegetables; stir-fry until slightly tender. 3. Increase heat, add shrimp and spices. Sear quickly for 3-4 minutes until shrimp is pink and opaque. Do not overcook. 4. Finish with lemon zest.',
                   '1. تسخين زيت الزيتون في مقلاة واسعة أو ووك. 2. إضافة الثوم والخضروات؛ القلي السريع حتى تلين قليلاً. 3. زيادة الحرارة، إضافة الجمبري والبهارات. تحمير سريع لمدة 3-4 دقيقة حتى يصبح الجمبري وردياً ومعتماً. 4. الإنهاء بقشر الليمون المبشور.'
              )
         };

          const r36 = {
               meal_name: {
                    en: 'Date and Tahini Smoothie (Post-Workout/Energy Drink)',
                    ar: 'سموثي التمر والطحينة (بعد التمرين/مشروب طاقة)'
               },
               prep_time_minutes: 5,
               tags: [
                    { text: { en: 'Post-Workout Recovery', ar: 'استعادة بعد التمرين' }, color: 'purple' }
               ],
               macros_serving: { calories: 480 },
               ingredients: toIngredients(
                    '3 Medjool Dates, 20g Tahini (approx. 2 tbsp), 1 Scoop protein powder (Vanilla), 200ml Water/Skim milk, 5g Chia seeds (optional fiber).',
                    '3 تمور مجهول، 20 جرام طحينة (حوالي 2 ملعقة كبيرة)، 1 مغرفة مسحوق بروتين (فانيليا)، 200 مل ماء/حليب خالي الدسم، 5 جرام بذور الشيا (ألياف اختيارية).'
               ),
               preparation_steps: toSteps(
                    '1. Pit and roughly chop the dates. 2. Place all ingredients (dates, Tahini, protein powder, liquid, chia seeds) into a blender. 3. Blend on high until completely smooth and emulsified. 4. Consume immediately or pre-portion into containers for refrigeration.',
                    '1. نزع النوى وتقطيع التمر تقريباً. 2. وضع جميع المكونات (التمر، الطحينة، مسحوق البروتين، السائل، بذور الشيا) في الخلاط. 3. الخلط على سرعة عالية حتى يصبح المزيج ناعماً ومستحلباً تماماً. 4. يُستهلك فوراً أو يُقسم إلى حصص مسبقة في أوعية للتبريد.'
               )
          };

         const r37 = {
               meal_name: {
                    en: 'Traditional Sayadiyah Fish Rice Bowl',
                    ar: 'طبق أرز صيادية السمك التقليدي'
               },
               prep_time_minutes: 40,
               tags: [
                    { text: { en: 'High-Carb Day', ar: 'يوم عالي الكربوهيدرات' }, color: 'yellow' }
               ],
               macros_serving: { calories: 680 },
               ingredients: toIngredients(
                    '150g White fish fillet (snapper/cod), 100g Basmati rice, 20ml Olive oil, 1 large Onion (caramelized), Fish broth, Cumin, Turmeric, Salt.',
                    '150 جرام فيليه سمك أبيض (هامور/قاروص)، 100 جرام أرز بسمتي، 20 مل زيت زيتون، 1 بصلة كبيرة (مكرملة)، مرق سمك، كمون، كركم، ملح.'
               ),
               preparation_steps: toSteps(
                    '1. Caramelize the sliced onion in olive oil until very dark brown. 2. Remove onion, add rice and spices to the oil and toast briefly. 3. Add fish broth and cook rice until tender. 4. Season and sear the fish fillet separately. 5. Serve fish over the spiced dark rice.',
                    '1. تكرمل شرائح البصل في زيت الزيتون حتى يصبح لونها بنياً داكناً جداً. 2. إزالة البصل، إضافة الأرز والبهارات إلى الزيت وتحميصها لفترة وجيزة. 3. إضافة مرق السمك وطهي الأرز حتى ينضج. 4. تتبيل وتحمير فيليه السمك بشكل منفصل. 5. تقديم السمك فوق الأرز المتبل والداكن.'
               ),
               card_color: 'yellow',
         };

         const r38 = {
               meal_name: {
                    en: 'Keto Spiced Ghee-Seared Beef',
                    ar: 'لحم بقري مقلي بالسمن والبهارات (كيتو)'
               },
               prep_time_minutes: 20,
               tags: [
                    { text: { en: 'Keto Diet', ar: 'نظام الكيتو' }, color: 'emerald' }
               ],
               macros_serving: { calories: 610 },
               ingredients: toIngredients(
                    '150g Ground beef (80/20 mix), 30g Ghee (clarified butter), 100g Sautéed cauliflower rice, Spices (Baharat, Cinnamon, Black pepper).',
                    '150 جرام لحم بقري مفروم (مزيج 80/20)، 30 جرام سمن بلدي، 100 جرام أرز قرنبيط مقلي، بهارات (بهارات عربية، قرفة، فلفل أسود).'
               ),
               preparation_steps: toSteps(
                    '1. Render fat and heat ghee in a pan. 2. Sear spiced ground beef until browned. 3. Sauté cauliflower rice with remaining spices. 4. Plate beef over cauliflower rice.',
                    '1. إذابة الدهون وتسخين السمن في مقلاة. 2. تحمير اللحم البقري المفروم المتبل حتى يكتسب لوناً بنياً. 3. قلي أرز القرنبيط مع البهارات المتبقية. 4. تقديم اللحم فوق أرز القرنبيط.'
               ),
               card_color: 'green',
         };

         const r41 = {
               meal_name: {
                    en: 'Moroccan Chickpea and Vegetable Tagine (High-Carb)',
                    ar: 'طاجين الحمص والخضروات بالبهارات المغربية (عالي الكربوهيدرات)'
               },
               prep_time_minutes: 25,
               tags: [
                    { text: { en: 'High-Carb Day', ar: 'يوم عالي الكربوهيدرات' }, color: 'yellow' }
               ],
               macros_serving: { calories: 510 },
               ingredients: toIngredients(
                    '150g Cooked chickpeas, 100g Basmati rice, 150g Mixed vegetables (carrots, tomatoes, zucchini), 10ml Olive oil, Moroccan spices (ginger, cinnamon, turmeric, cumin), Vegetable broth.',
                    '150 جرام حمص مطبوخ، 100 جرام أرز بسمتي، 150 جرام خضروات مشكلة (جزر، طماطم، كوسة)، 10 مل زيت زيتون، بهارات مغربية (زنجبيل، قرفة، كركم، كمون)، مرق خضروات.'
               ),
               preparation_steps: toSteps(
                    '1. Sauté spices and vegetables in olive oil. 2. Add chickpeas and vegetable broth; simmer for 15 minutes. 3. Serve the tagine mixture over a portion of cooked basmati rice.',
                    '1. قلي البهارات والخضروات في زيت الزيتون. 2. إضافة الحمص ومرق الخضروات؛ غليه لمدة 15 دقيقة. 3. تقديم خليط الطاجين فوق حصة الأرز البسمتي المطبوخ.'
               ),
               card_color: 'yellow',
         };

         const r42 = {
               meal_name: {
                    en: 'High-Fat Tahini and Egg Salad (Keto)',
                    ar: 'سلطة الطحينة والبيض عالية الدهون (وجبة كيتو)'
               },
               prep_time_minutes: 10,
               tags: [
                    { text: { en: 'Keto Diet', ar: 'نظام الكيتو' }, color: 'emerald' }
               ],
               macros_serving: { calories: 560 },
               ingredients: toIngredients(
                    '3 Large hard-boiled eggs, 30g Tahini (approx. 3 tbsp), 15ml Olive oil, Lemon juice, Salt, 100g Mixed greens and radish slices.',
                    '3 بيضات كبيرة مسلوقة، 30 جرام طحينة (حوالي 3 ملاعق كبيرة)، 15 مل زيت زيتون، عصير ليمون، ملح، 100 جرام خضروات ورقية مشكلة وشرائح فجل.'
               ),
               preparation_steps: toSteps(
                    '1. Tahini Dressing: Mix Tahini with lemon juice, water, and salt until smooth; add olive oil. 2. Slice hard-boiled eggs. 3. Arrange eggs and greens in a bowl. 4. Drizzle generously with high-fat Tahini dressing.',
                    '1. تتبيلة الطحينة: خلط الطحينة مع عصير الليمون وقليل من الماء والملح حتى يصبح قوامها ناعماً، ثم إضافة زيت الزيتون. 2. تقطيع البيض المسلوق. 3. ترتيب البيض والخضروات الورقية في وعاء. 4. تزيينها بسخاء بصلصة الطحينة عالية الدهون.'
               ),
               card_color: 'white',
         };

         const r43 = {
               meal_name: {
                    en: 'Spicy Arabian Foul Medames (High-Carb)',
                    ar: 'طبق الفول المدمس العربي الحار (عالي الكربوهيدرات)'
               },
               prep_time_minutes: 20,
               tags: [
                    { text: { en: 'High-Carb Day', ar: 'يوم عالي الكربوهيدرات' }, color: 'yellow' }
               ],
               macros_serving: { calories: 450 },
               ingredients: toIngredients(
                    '250g Cooked fava beans (medames), 15ml Olive oil, 10ml Lemon juice, Garlic, Cumin, Chili, Salt, Fresh parsley, Optional tahini.',
                    '250 جرام فول مدمس مطبوخ، 15 مل زيت زيتون، 10 مل عصير ليمون، ثوم، كمون، شطة، ملح، بقدونس طازج، طحينة اختيارية.'
               ),
               preparation_steps: toSteps(
                    '1. Warm fava beans gently with olive oil and spices (garlic, cumin, chili, salt). 2. Mash partially for a rustic texture. 3. Finish with lemon juice and parsley; drizzle tahini if desired.',
                    '1. تسخين الفول المدمس بلطف مع زيت الزيتون والبهارات (ثوم، كمون، شطة، ملح). 2. هرس جزئي للحصول على قوام تقليدي. 3. الإنهاء بعصير الليمون والبقدونس؛ إضافة الطحينة إذا رغبت.'
               ),
               card_color: 'yellow',
         };

         return [r29, r30, r31, r32, r33, r34, r35, r36, r37, r38, r41, r42, r43];
     }, []);

     // Helper to render a grid section
     const renderSection = (title, subtitle, recipes, headerColorClass, borderColorClass) => (
          <section className="mb-16">
               <h2 className={`text-3xl font-bold mb-8 text-center ${headerColorClass} border-b-2 ${borderColorClass} pb-3`}>
                    {title}
                    <span className="text-xl font-medium block mt-1 text-gray-500 font-sans">{subtitle}</span>
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10">
                    {recipes.map((meal, idx) => (
                         <div key={idx} onClick={() => setSelectedRecipe(meal)} className="cursor-pointer h-full">
                              <GalleryItem meal={meal} />
                         </div>
                    ))}
               </div>
          </section>
     );

     return (
          <div className="max-w-7xl mx-auto px-4 py-8">
               <button onClick={onBack} className="mb-6 text-gray-500 hover:text-gray-900">← Back to Home</button>

               <header className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-[#7b3f00] mb-2 tracking-tight">
                         Curated Meal Plan Recipes
                    </h1>
                    <p className="text-3xl font-light text-gray-600 mb-6">(متصفح وصفات الوجبات المنسقة)</p>
                    <p className="text-lg text-gray-700 max-w-4xl mx-auto italic">
                         ثمانية وصفات كاملة المحتوى ومُفصلة، مصنفة حسب الأنظمة الغذائية المختلفة لتناسب أهدافك.
                         <span className="text-base block mt-2 not-italic text-gray-500">(Eight full-content recipes, categorized by diet type to suit your goals.)</span>
                    </p>
               </header>

               {/* Part 1: Low-Carb & Keto */}
               {lowCarb.length > 0 && renderSection(
                    "الجزء الأول: وصفات قليلة الكربوهيدرات والكيتو",
                    "(Part 1: Low-Carb & Keto Recipes)",
                    lowCarb,
                    "text-green-700",
                    "border-green-200"
               )}

               {/* Part 2: High-Carb & Traditional */}
               {highCarb.length > 0 && renderSection(
                    "الجزء الثاني: وصفات عالية الكربوهيدرات والتقليدية",
                    "(Part 2: High-Carb & Traditional Recipes)",
                    highCarb,
                    "text-red-700",
                    "border-red-200"
               )}

               {/* Part 8: Final Diverse Recipe Set */}
               {diverseRecipes.length > 0 && renderSection(
                    "المجموعة المتنوعة النهائية للوصفات",
                    "(Part 8: Final Diverse Recipe Set)",
                    diverseRecipes,
                    "text-emerald-700",
                    "border-emerald-200"
               )}

               

               <RecipeModal
                    isOpen={!!selectedRecipe}
                    onClose={() => setSelectedRecipe(null)}
                    recipe={selectedRecipe}
               />
          </div>
     );
};

export default RecipeGallery;
