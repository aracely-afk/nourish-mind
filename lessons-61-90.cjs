const fs = require('fs')

const NEW_LESSONS = `,
  {
    id: 61, day: 61,
    title: 'When You Slip, You Don\'t Start Over',
    subtitle: 'Setbacks are not failures — they\'re data',
    readTimeMin: 7,
    theme: 'identity',
    prayer: 'Lord, when I fall, remind me that You are not disappointed — You are reaching down. Teach me to rise with grace, not shame. Amen.',
    scripture: { verse: 'For a righteous man falls seven times and rises again.', reference: 'Proverbs 24:16 (ESV)' },
    content: \`You had a rough week. Maybe a rough few days. You ate past fullness, skipped your walks, and stared at your phone at 11pm eating chips you don't even like. And now you're here, reading this, telling yourself you have to "start over."

Stop right there.

**There is no starting over in a lifestyle — only continuing.**

Think about a toddler learning to walk. They fall. A lot. Nobody tells a toddler, "You fell yesterday, so you have to go back to Day 1 of walking." That's absurd. They fall, they get back up, maybe they cry for a second, and then they try again. Every single fall is teaching their body something.

Your "slip" taught you something too. Let's find out what.

**The CBT Lens: Behavior Is Information, Not Evidence**

When you eat in a way you regret, your brain will try to use it as evidence — evidence that you're weak, that you can't do this, that this program isn't working. This is a cognitive distortion called "overgeneralization." You took one event and made it a law about your character.

Here's the reframe: that event is data, not a verdict.

Ask yourself: What happened right before? What was I feeling emotionally? Was I tired, lonely, overwhelmed, bored? Was there an environmental trigger — a certain food in the house, a social situation, a stressful work call?

Write it down. Get curious about it. Don't punish yourself for it.

**The Bible on Falling**

Proverbs doesn't say "a righteous person never falls." It says they fall seven times. Seven. And they rise. That's the whole story — not the falling, the rising.

God's grace is not contingent on your perfect consistency. It was established before you even tried. So the question isn't whether you'll stumble — it's whether you'll let the stumble become the story.

**The 24-Hour Reset**

When a setback happens, give yourself exactly one meal to recalibrate. Not one week. Not one month. One meal. Your very next meal is the beginning of returning. Not starting over — returning.

This shifts your language from "I blew it, I'll try again Monday" to "I ate a heavy dinner. Breakfast tomorrow is green and protein-forward, and I'll take a walk."

That's not perfection. That's wisdom.\`,
    quiz: [
      { question: 'A setback should be treated as:', options: ['Evidence that the plan isn\'t working', 'A reason to restart from Day 1', 'Data to learn from and continue forward', 'A character flaw to address'], correctIndex: 2, explanation: 'Setbacks are information, not indictments. CBT teaches us to examine triggers, not punish ourselves.' },
      { question: 'What does Proverbs 24:16 emphasize?', options: ['That righteous people never fall', 'That falling defines us', 'That rising after falling is the mark of character', 'That we should prevent all failures'], correctIndex: 2, explanation: 'The verse celebrates the rising, not the falling. Failure is expected; how we respond is what matters.' },
      { question: 'The "24-hour reset" means:', options: ['Rest for a full day before trying again', 'Your very next meal is a chance to return', 'Wait until the weekend to reset your habits', 'Start a new 90-day program'], correctIndex: 1, explanation: 'You don\'t need a Monday or a new week. The very next meal is your chance to return to yourself.' }
    ],
    challenge: 'Write about your last setback without judgment. What happened before it? What were you feeling? What does it tell you about a need that wasn\'t being met? Then plan your very next green-light meal.'
  },
  {
    id: 62, day: 62,
    title: 'Holiday Tables and High-Stakes Meals',
    subtitle: 'Navigating food in social and celebratory settings',
    readTimeMin: 8,
    theme: 'habits',
    prayer: 'Father, help me enjoy every table I sit at as a gift — not a trap. Give me freedom to celebrate without fear, and wisdom without rigidity. Amen.',
    scripture: { verse: 'So whether you eat or drink or whatever you do, do it all for the glory of God.', reference: '1 Corinthians 10:31 (NIV)' },
    content: \`Thanksgiving. Christmas. A birthday dinner. A baby shower. A Sunday brunch with family that stretches four hours. These are the moments that wellness culture tries to turn into minefields — and they were never meant to be.

Tables are meant for celebration. They always have been, in every culture and every scripture. Jesus didn't skip the wedding at Cana because there was wine. He showed up. He engaged. He even made more wine.

Your relationship with holiday eating doesn't have to be white-knuckled survival. It can be peaceful participation.

**The All-or-Nothing Trap at the Holiday Table**

The most common holiday eating mistake isn't the extra slice of pie. It's the thought that one slice means the whole day is ruined — and then eating past satisfaction because "I already blew it."

Sound familiar?

That's the all-or-nothing distortion we talked about in earlier lessons. Holidays are high-risk environments for this thinking because there's external pressure, emotional significance, and an abundance of off-plan foods all in the same place.

**A Framework for Holiday Eating**

Before the event:
- Eat a small protein-forward meal beforehand so you arrive satisfied, not starving
- Give yourself full permission to enjoy two or three favorite dishes
- Pick one indulgence and savor it completely instead of sampling everything mindlessly

During the meal:
- Pause halfway through your plate and check in with your hunger (1-10 scale)
- Eat slowly — conversation helps with this naturally
- Drink water between courses

After the meal:
- Do not calculate or punish. It's one meal.
- Take a 15-minute walk if possible — it helps digestion and mood

**The Glory Framework (1 Corinthians 10:31)**

This verse isn't about guilt. It's about presence and intentionality. Eating to the glory of God at a holiday table means being fully there — grateful, joyful, connected to the people around you. It means not letting food anxiety steal your attention from your grandmother's laugh or your nephew's excitement.

Mindful eating at a celebration looks like: choosing intentionally, tasting fully, and being grateful sincerely.\`,
    quiz: [
      { question: 'What is the most common holiday eating mistake?', options: ['Eating too many vegetables', 'Letting one indulgence trigger an all-or-nothing spiral', 'Not trying enough new foods', 'Skipping breakfast before a big meal'], correctIndex: 1, explanation: 'The mental spiral after one off-plan choice causes more damage than the choice itself. Recognizing this is key.' },
      { question: 'Eating "to the glory of God" at a celebration means:', options: ['Only eating "clean" foods', 'Being grateful, present, and intentional', 'Avoiding all desserts out of discipline', 'Eating as little as possible'], correctIndex: 1, explanation: '1 Corinthians 10:31 is about presence and gratitude, not guilt or restriction.' },
      { question: 'The pre-event strategy recommended is:', options: ['Fast all day so you can eat more', 'Eat a small protein-forward meal beforehand', 'Bring your own food', 'Skip the meal entirely'], correctIndex: 1, explanation: 'Arriving satisfied prevents the starvation-driven overeating that leads to regret.' }
    ],
    challenge: 'Think of an upcoming holiday or social meal. Plan your "before, during, after" strategy using today\'s framework. Write it down and then commit to being fully present at the table.'
  },
  {
    id: 63, day: 63,
    title: 'Visualization: See It Before You Live It',
    subtitle: 'Using mental rehearsal to build new behaviors',
    readTimeMin: 7,
    theme: 'awareness',
    prayer: 'Lord, let me see myself the way You see me — whole, capable, and becoming. Help me rehearse the life You\'ve already made possible. Amen.',
    scripture: { verse: 'For as he thinks in his heart, so is he.', reference: 'Proverbs 23:7 (NKJV)' },
    content: \`Elite athletes do it before every competition. Surgeons do it before complex procedures. And now, neuroscience confirms what scripture said 3,000 years ago: what you think in your heart becomes your reality.

Visualization isn't wishful thinking. It's mental rehearsal — and it's one of the most underused tools in behavior change.

**Why Visualization Works**

When you vividly imagine performing a behavior, your brain activates many of the same neural pathways as actually doing it. This is called "functional equivalence." You're essentially pre-wiring your nervous system for success.

Researchers have found that athletes who combine physical practice with visualization improve significantly more than those who only practice physically. The brain doesn't clearly distinguish between a vividly imagined experience and a real one.

For us, this means: you can rehearse making a healthy choice at a restaurant, pausing before emotional eating, or starting a morning walk — before you ever have to do it in real life.

**How to Use Visualization for Food Freedom**

Step 1 — Choose a scenario. Pick a moment you normally struggle: the afternoon snack trap, eating after a hard phone call, the cereal-at-midnight pattern.

Step 2 — Close your eyes and enter the scene. See the room, the time of day, the emotional state leading up to it.

Step 3 — Now see yourself pausing. Feel the urge. Don't suppress it — notice it. See yourself asking: "Am I hungry, or am I hurting?"

Step 4 — See yourself making a different choice. Maybe you pour a glass of water. Maybe you step outside for two minutes. Maybe you journal three sentences. See the satisfaction in making that choice.

Step 5 — Feel the feeling at the end. The pride, the peace, the sense of self-respect.

Do this daily for the next week. Your brain is practicing.\`,
    quiz: [
      { question: 'What does neuroscience say about visualization?', options: ['It\'s only useful for athletes', 'It activates similar neural pathways as real behavior', 'It has no proven effect on habit change', 'It works only if you believe in it'], correctIndex: 1, explanation: 'Research on functional equivalence shows the brain rehearses behavior through vivid mental imagery.' },
      { question: 'According to Proverbs 23:7, our reality is shaped by:', options: ['Our environment', 'What we think in our heart', 'What others tell us', 'Our past failures'], correctIndex: 1, explanation: 'Scripture anticipates neuroscience here — our inner narrative shapes our outer life.' },
      { question: 'The best scenario to visualize is:', options: ['A future vacation where you look thin', 'A perfect week of eating', 'A specific struggle moment, rehearsed with a better response', 'A version of yourself 10 years from now'], correctIndex: 2, explanation: 'Visualization is most effective when it targets a specific, realistic scenario with an emotional component.' }
    ],
    challenge: 'Spend 5 minutes today doing a full visualization exercise for your most common eating struggle. Close your eyes, enter the scene, feel the pause, and see yourself making the aligned choice. Write one sentence about how it felt.'
  },
  {
    id: 64, day: 64,
    title: 'The Long Game: Why Slow Is Sustainable',
    subtitle: 'Building for permanence, not performance',
    readTimeMin: 7,
    theme: 'habits',
    prayer: 'God, free me from urgency that steals my peace. Teach me to trust the slow, steady work — knowing that what You build in me will last. Amen.',
    scripture: { verse: 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.', reference: 'Galatians 6:9 (NIV)' },
    content: \`We live in a world of before-and-after photos taken 30 days apart. Of 10-day detoxes and 21-day transformations. Of "drop 20 lbs in 6 weeks" promises that set you up for a rebound in week 7.

Speed has been sold to you as a value. It's not. In the context of body change and healing, speed is often the enemy of permanence.

**The Biology of Slow Change**

When you lose weight rapidly (more than 1-2 lbs per week), your body interprets it as a threat. It slows your metabolism, breaks down muscle for fuel, and increases hunger hormones like ghrelin. This is why crash diets produce a metabolic rebound — your body fights back.

Slow, steady fat loss preserves muscle mass, keeps metabolism stable, and allows hormones to recalibrate gradually. It also gives you time to build the habits that will carry the weight off permanently.

The same is true for muscle gain. Building lean mass takes months, not weeks. The 0.5-1 lb of actual muscle per month that your body can synthesize doesn't look dramatic on a scale, but it compounds into a genuinely different body over a year.

**The CBT Frame: Tolerating Discomfort Without Urgency**

One of the core skills in CBT is distress tolerance — the ability to sit with discomfort without demanding immediate relief. Diet culture feeds urgency because urgency is profitable. "This isn't working fast enough" is a thought — not a fact.

Challenge that thought: Is this actually not working? Or am I just uncomfortable with how long lasting change takes?

**The Biblical Long Game**

Galatians 6:9 is one of the most practically wise verses in the entire Bible. "Do not grow weary in doing good." Not because it's easy. Not because you'll see results tomorrow. But because the harvest comes — at the proper time.

You are farming yourself. Tend the soil. Water it daily. Show up even when nothing looks different above ground. The roots are going deep.\`,
    quiz: [
      { question: 'Why does rapid weight loss often backfire?', options: ['People celebrate too early', 'The body interprets it as a threat and slows metabolism', 'Exercise becomes too easy', 'It isn\'t sustainable because of cost'], correctIndex: 1, explanation: 'Rapid loss triggers metabolic adaptation, muscle breakdown, and increased hunger hormones — setting up the rebound.' },
      { question: 'What CBT skill is most important for tolerating slow progress?', options: ['Thought challenging', 'Distress tolerance', 'Journaling', 'Visualization'], correctIndex: 1, explanation: 'Distress tolerance allows you to sit with the discomfort of slow progress without abandoning the process.' },
      { question: 'Galatians 6:9 promises:', options: ['Immediate results for hard work', 'A harvest at the proper time for those who don\'t give up', 'That giving up is sometimes the right choice', 'That God will do the work for you'], correctIndex: 1, explanation: 'The verse frames persistence as the key — the harvest comes at the right time, not necessarily our preferred time.' }
    ],
    challenge: 'Write a "one year from now" letter to yourself. Not describing how you look — describing how you feel, what you do differently, how you relate to food. Post it somewhere you\'ll see it monthly.'
  },
  {
    id: 65, day: 65,
    title: 'Weekly Reflection: Week Nine',
    subtitle: 'Progress review and recalibration',
    readTimeMin: 5,
    theme: 'review',
    prayer: 'Lord, as I reflect on this week, help me see it with Your eyes — not with harsh judgment or false perfection, but with honest, gracious clarity. Amen.',
    scripture: { verse: 'Search me, God, and know my heart; test me and know my anxious thoughts.', reference: 'Psalm 139:23 (NIV)' },
    content: \`Week nine. If you\'ve been consistent, you\'ve built real momentum. If you\'ve had gaps and stumbles, you\'ve built real wisdom. Both are progress.

This week, the reflection goes deeper than food.

**The Honest Inventory**

Take 10 minutes to write answers to these questions — no editing, no self-censorship, just truth:

1. What belief about food or my body shifted for me this month?
2. What old habit did I choose differently, even once?
3. What is one thing I said to myself this week that I wouldn't say to a friend?
4. What part of this journey feels lighter than it did on Day 1?
5. What part still feels heavy — and what does it need?

**The Invitation**

Psalm 139:23 is David inviting God into the honest audit — not the performance, not the surface level, but the anxious thoughts. That's where the healing happens. Not in the pretty answers, but in the real ones.

This program isn't about perfection. It never was. It's about becoming someone who relates to food — and to themselves — differently. Slowly, imperfectly, durably.

You are different today than you were on Day 1. Acknowledge that.\`,
    quiz: [
      { question: 'What is the primary purpose of a weekly reflection?', options: ['To calculate the week\'s calories', 'To audit progress and recalibrate with honesty', 'To plan the following week\'s meals exactly', 'To compare yourself to others'], correctIndex: 1, explanation: 'Reflection is a tool for honest self-examination and recalibration, not performance review.' },
      { question: 'Psalm 139:23 models:', options: ['Asking God to fix your eating', 'Inviting honest self-examination with God\'s help', 'Avoiding anxious thoughts through prayer', 'Praising God for past results'], correctIndex: 1, explanation: 'David invites God into the honest audit of his inner life — the anxious thoughts, not just the victories.' },
      { question: 'The truest sign of progress in this program is:', options: ['A specific number on the scale', 'Never having a bad eating day', 'Relating to food and yourself differently than on Day 1', 'Completing every single lesson without missing one'], correctIndex: 2, explanation: 'The goal is a changed relationship with food — that happens gradually, imperfectly, and durably.' }
    ],
    challenge: 'Complete the five-question honest inventory in writing. Then find one thing from your answers to celebrate, and one thing to bring to God in prayer. No fixing required today — just honesty.'
  },
  {
    id: 66, day: 66,
    title: 'The Comparison Trap: You Are Not Their Journey',
    subtitle: 'Breaking free from measuring yourself against others',
    readTimeMin: 7,
    theme: 'identity',
    prayer: 'Lord, when I look at others and feel small, redirect my eyes to You. Remind me that my path was designed specifically for me. Amen.',
    scripture: { verse: 'Each one should test their own actions. Then they can take pride in themselves alone, without comparing themselves to someone else.', reference: 'Galatians 6:4 (NIV)' },
    content: \`She lost 40 lbs in six months and posts before-and-after photos. He runs ultramarathons and meals preps on Sunday. Your coworker just went gluten-free and "feels amazing." And here you are, trying to drink eight cups of water and not eat cereal at midnight.

Comparison is one of the most insidious forms of emotional eating fuel. It creates shame. Shame creates the urge to self-soothe. Self-soothing often looks like food.

And so the cycle begins.

**The Problem with Comparison**

When we compare, we almost always compare our insides to someone else's outsides. We see their result, their photo, their energy — not their 3am struggles, their emotional eating history, their hormonal challenges, or the ten years of failed attempts before this one.

You are comparing an unedited view of your life to a highlight reel of theirs.

Galatians 6:4 breaks this with remarkable clarity: test your own actions, take pride in your own progress. Not theirs. Yours.

**Your Metabolic Blueprint Is Unique**

No two bodies are identical. Your resting metabolic rate, insulin sensitivity, gut microbiome, cortisol response, thyroid function, sleep architecture — all of it is as unique as your fingerprint. What works remarkably well for one person may require full modification for another.

This isn't an excuse. It's an invitation to become a scientist of your own body — curious, observant, and patient — rather than a judge comparing your results to a template designed for someone else.

**The Redirect Practice**

Next time you feel comparison creeping in, try this:
1. Notice the feeling (this is the awareness step)
2. Name it: "That's comparison. It's not useful here."
3. Ask: "What is one thing I've done this week that is genuinely good?"
4. Celebrate that. Even silently. Even just to yourself.\`,
    quiz: [
      { question: 'What makes comparison harmful in a wellness journey?', options: ['It motivates people too much', 'We compare our insides to others\' outsides', 'It leads to eating more vegetables', 'It has no real impact on behavior'], correctIndex: 1, explanation: 'We see others\' results without knowing their full story — which creates shame that can fuel emotional eating.' },
      { question: 'Galatians 6:4 directs us to:', options: ['Find inspiration in others\' success', 'Take pride in our own progress, not compare to others', 'Ignore our own actions and focus on community', 'Set goals based on what others have achieved'], correctIndex: 1, explanation: 'Paul explicitly redirects attention to our own actions and growth — not external benchmarks.' },
      { question: 'The redirect practice when comparison arises includes:', options: ['Logging off social media permanently', 'Naming the feeling, then identifying your own genuine win', 'Finding someone doing worse than you', 'Journaling about the comparison for 20 minutes'], correctIndex: 1, explanation: 'Naming the distortion breaks its power. Following it with a genuine self-acknowledgment recalibrates your thinking.' }
    ],
    challenge: 'Go 24 hours without comparing your body, your progress, or your eating to anyone else\'s. If it happens, use the redirect practice. At the end of the day, write three things that are genuinely good about your journey right now.'
  },
  {
    id: 67, day: 67,
    title: 'Your Body Was Always on Your Side',
    subtitle: 'Learning to trust the body you\'ve been at war with',
    readTimeMin: 8,
    theme: 'identity',
    prayer: 'Father, I confess that I\'ve sometimes treated my body like an enemy. Teach me to see it as a gift — a partner in this life You\'ve given me. Amen.',
    scripture: { verse: 'I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.', reference: 'Psalm 139:14 (NIV)' },
    content: \`For a lot of people, the relationship with their body has been adversarial for years. Maybe decades.

Too big. Too slow. Too undisciplined. The thing that betrays you in photos, the thing that won't cooperate, the thing you're constantly trying to override, control, or punish into a different shape.

But here's a reframe that might change everything: your body has been working for you, not against you. The whole time.

**What Your Body Has Been Doing**

Right now, your body is:
- Regulating your blood sugar to the milligram
- Beating your heart 100,000 times today without your input
- Converting oxygen into energy at a cellular level
- Healing a paper cut you forgot about
- Filtering toxins through your liver and kidneys
- Producing 25 million new cells per second

Your body isn't broken. It's brilliant. And it has been working around the clock, without a break, since the day you were born.

The weight gain, the food cravings, the fatigue — these are often your body communicating that a need isn't being met. Chronic stress, sleep deprivation, nutritional deficiency, emotional pain. Your body isn't malfunctioning. It's adapting.

**Shifting from Control to Collaboration**

Dieting culture frames your body as a problem to be solved. This program frames it as a partner to be understood.

Collaboration sounds like:
- "My body is craving sugar. What has it not gotten enough of today — sleep, protein, water?"
- "I\'m exhausted. That\'s a signal, not a character flaw."
- "I feel hungry two hours after eating. Let me check what I had and whether it was balanced."

Control sounds like: "I shouldn't be hungry. I just ate."

**Psalm 139:14: The Theological Truth**

David wrote this from a place of awe. "Fearfully and wonderfully made" isn't a platitude — it's a recognition that the human body reflects the artistry of God. When we despise our bodies, we are, in a very real sense, critiquing God's craftsmanship.

That isn't guilt — it's an invitation. To look at yourself with the same wonder with which you were made.\`,
    quiz: [
      { question: 'How does this lesson reframe body symptoms like cravings and fatigue?', options: ['As character weaknesses to overcome', 'As signals from a body communicating unmet needs', 'As evidence that the plan isn\'t working', 'As purely biological events with no meaning'], correctIndex: 1, explanation: 'Cravings and fatigue are often communication — the body signaling a need for sleep, nutrition, or emotional care.' },
      { question: 'What does it mean to "collaborate" with your body?', options: ['Never eating foods you crave', 'Getting curious about what your body is communicating', 'Tracking every calorie', 'Following a strict meal plan without deviation'], correctIndex: 1, explanation: 'Collaboration means asking what a symptom is communicating, not overriding or punishing it.' },
      { question: 'Psalm 139:14 suggests that criticizing our bodies is:', options: ['A healthy form of motivation', 'A normal part of the wellness journey', 'A critique of God\'s craftsmanship', 'An unrelated spiritual matter'], correctIndex: 2, explanation: 'If we are "fearfully and wonderfully made," despising our bodies contradicts the truth of how we were created.' }
    ],
    challenge: 'Write a short letter to your body. Apologize for anything you\'ve said or done out of contempt. Thank it for what it has been doing all along. Then read it out loud. This is healing work.'
  },
  {
    id: 68, day: 68,
    title: 'Cooking as an Act of Love',
    subtitle: 'Turning the kitchen into a sanctuary',
    readTimeMin: 7,
    theme: 'habits',
    prayer: 'Lord, help me see the kitchen not as a source of anxiety but as a place of nourishment — for myself and for those I love. Amen.',
    scripture: { verse: 'She watches over the affairs of her household and does not eat the bread of idleness.', reference: 'Proverbs 31:27 (NIV)' },
    content: \`Somewhere along the way, cooking got rebranded as a chore. Too time-consuming, too complicated, too much cleanup. We outsourced our nourishment to factories and drive-throughs and apps, and we lost something in the exchange.

Today is a reclamation.

**The Data on Cooking at Home**

Studies consistently show that people who cook at home more frequently:
- Consume fewer calories per meal on average
- Eat more vegetables and fiber
- Have lower rates of metabolic syndrome
- Report higher satisfaction with their food
- Spend significantly less money on food

Cooking isn't just a skill — it's a protective behavior.

**Cooking as a Spiritual Act**

Proverbs 31 honors the person who tends to the nourishment of their household. This isn't about gender roles — it's about the sanctity of provision. When you prepare food for yourself or others, you are participating in one of the most ancient and meaningful human activities.

Every great religion in history has rituals around food. The Jewish Shabbat meal. The Eucharist. The Ethiopian coffee ceremony. The Korean ancestral offering table. Food prepared with intention carries meaning that delivered food simply cannot replicate.

**Getting Started Without Overwhelm**

You don't need to be a chef. You need three to four recipes you can make from memory. That's it. Build your confidence with simple, repeatable wins:
- Sheet pan roasted chicken and vegetables (one pan, 35 minutes, done)
- Stovetop rice and beans with salsa
- Scrambled eggs with spinach and toast
- Pasta with olive oil, garlic, and any protein

Once you have your core four, you have a food foundation. Everything else is bonus.\`,
    quiz: [
      { question: 'Research on home cooking shows:', options: ['It is too time-consuming to be practical', 'Lower calorie intake, more vegetables, lower cost, and higher satisfaction', 'It has no measurable impact on health outcomes', 'People who cook are generally less social'], correctIndex: 1, explanation: 'Multiple studies confirm home cooking improves dietary quality and metabolic health while reducing food costs.' },
      { question: 'The "core four" approach to cooking means:', options: ['Cooking four times per week', 'Having four kitchen tools you rely on', 'Mastering three to four simple repeatable recipes', 'Eating four small meals a day'], correctIndex: 2, explanation: 'Knowing a handful of go-to meals from memory removes the decision fatigue that leads to drive-through defaults.' },
      { question: 'Proverbs 31:27 frames home cooking as:', options: ['A burden for the disciplined', 'A form of meaningful care and provision', 'Primarily a woman\'s role', 'An optional lifestyle choice'], correctIndex: 1, explanation: 'The verse honors intentional care for one\'s household — a meaningful, dignified act, not a chore.' }
    ],
    challenge: 'This week, cook one meal completely from scratch that you\'ve never made before. Look up a simple recipe, buy the ingredients, and make it. Notice how you feel before, during, and after the process.'
  },
  {
    id: 69, day: 69,
    title: 'Weekly Reflection: Week Ten',
    subtitle: 'Checking in on the identity shift',
    readTimeMin: 5,
    theme: 'review',
    prayer: 'Father, show me who I\'m becoming. Not just in my habits, but in my heart. I invite Your honest, loving gaze. Amen.',
    scripture: { verse: 'And we all, who with unveiled faces contemplate the Lord\'s glory, are being transformed into his image with ever-increasing glory.', reference: '2 Corinthians 3:18 (NIV)' },
    content: \`Ten weeks in. Let that land for a moment.

If you\'ve shown up even imperfectly to this program, you have been doing sustained transformation work for over two months. That is not small. That is significant.

**The Identity Shift Question**

Today's reflection isn't about food. It's about who you're becoming.

On Day 1, you had one set of beliefs about yourself and your relationship with food. Take a moment to articulate that — even if it was unconscious. Then answer these questions:

1. What would Day 1 You have believed you were capable of?
2. What has surprised you about yourself in these ten weeks?
3. Who are you becoming in this process?

**2 Corinthians 3:18 on Transformation**

This verse doesn't describe a single moment of change. It describes an ongoing, progressive transformation — "with ever-increasing glory." This is a process language. You are not a finished product. You are becoming.

The mirror you look into every day reflects a person in the process of transformation. Not the starting point. Not the destination. The becoming.

Celebrate the becoming.\`,
    quiz: [
      { question: 'What does "ever-increasing glory" in 2 Corinthians 3:18 describe?', options: ['A single dramatic transformation event', 'An ongoing, progressive process of change', 'Only spiritual transformation', 'God\'s glory, not human change'], correctIndex: 1, explanation: 'The verse uses process language — transformation is ongoing, not a one-time event.' },
      { question: 'The identity shift question is asking you to reflect on:', options: ['Your calorie numbers', 'Who you are becoming through this process', 'Whether the program is the right fit', 'Your meal prep skills'], correctIndex: 1, explanation: 'Food habits are the surface. Identity change is the goal. This reflection tracks the deeper work.' },
      { question: 'Ten weeks of imperfect engagement means:', options: ['You should have done better', 'You have been doing sustained transformation work', 'You\'re only 11% through the program', 'It\'s time to find a more effective program'], correctIndex: 1, explanation: 'Sustained effort — even messy, inconsistent effort — creates real neurological and behavioral change over time.' }
    ],
    challenge: 'Answer all three identity shift questions in your journal. Then write one sentence that describes the person you are becoming: "I am someone who ___." Keep it present tense, true, and specific.'
  },
  {
    id: 70, day: 70,
    title: 'Rest Is Not a Reward — It\'s a Requirement',
    subtitle: 'The forgotten pillar of physical and emotional health',
    readTimeMin: 7,
    theme: 'biology',
    prayer: 'God of rest, teach me to stop striving as an act of faith. Help me trust that what I cannot accomplish in wakefulness, You sustain in my sleep. Amen.',
    scripture: { verse: 'He grants sleep to those he loves.', reference: 'Psalm 127:2 (NIV)' },
    content: \`We live in a culture that glorifies exhaustion. "I'll sleep when I'm dead." "Hustle harder." Four-hour nights and productivity gurus and the badge of busyness.

Meanwhile, your body is quietly falling apart.

**Sleep and Food: The Invisible Connection**

Sleep deprivation is one of the least discussed causes of weight gain, emotional eating, and food cravings. Here's why:

- Ghrelin (the hunger hormone) increases by 24% after one night of poor sleep
- Leptin (the fullness hormone) decreases by 18%
- The prefrontal cortex — your decision-making center — is impaired, making you reach for high-calorie, high-sugar foods
- Cortisol spikes with sleep deprivation, increasing fat storage especially around the belly

Poor sleep is not just a tired feeling. It is a metabolic event.

**The 7-9 Hour Standard**

Adults who sleep 7-9 hours per night have lower rates of obesity, diabetes, cardiovascular disease, depression, and anxiety. They also make better food choices, exercise more consistently, and recover faster from setbacks.

Sleep hygiene basics:
- Same wake time every day (even weekends)
- No bright screens 60 minutes before bed
- Cool, dark room (65-68°F is optimal)
- No caffeine after 1pm
- A wind-down routine (prayer, reading, stretching — not doomscrolling)

**Psalm 127:2: Sleep as Spiritual Act**

"He grants sleep to those he loves." This is profound. Sleep is a gift from God — not a luxury or a reward for productivity. It is not something you earn by finishing your to-do list. It is given. Which means receiving it fully is an act of faith.\`,
    quiz: [
      { question: 'What happens to ghrelin and leptin after poor sleep?', options: ['Both increase, causing cravings', 'Ghrelin increases and leptin decreases — driving hunger', 'Both decrease, reducing appetite', 'They are unaffected by sleep'], correctIndex: 1, explanation: 'Poor sleep disrupts hunger hormones in the direction of increased appetite and reduced satiety signals.' },
      { question: 'The ideal sleep duration for adults is:', options: ['5-6 hours', '6-7 hours', '7-9 hours', '10+ hours'], correctIndex: 2, explanation: 'Research consistently shows 7-9 hours optimizes metabolic health, decision-making, and emotional regulation.' },
      { question: 'Psalm 127:2 frames sleep as:', options: ['Something earned through hard work', 'A gift given by God — received through faith', 'Optional for the disciplined person', 'Only relevant to spiritual healing'], correctIndex: 1, explanation: 'The verse explicitly positions sleep as something God grants, not something we earn. Receiving rest is an act of trust.' }
    ],
    challenge: 'Audit your sleep this week. Track your actual sleep hours for 7 days. If you\'re averaging under 7, identify one thing to change — bedtime, screens, caffeine. Treat this like you\'d treat a nutrition change: with intention.'
  },
  {
    id: 71, day: 71,
    title: 'When Food Becomes a Conversation',
    subtitle: 'Understanding food as emotional language',
    readTimeMin: 7,
    theme: 'triggers',
    prayer: 'Lord, help me hear what I\'m really saying when I reach for food. Give me the courage to speak my needs with words instead of with eating. Amen.',
    scripture: { verse: 'Out of the abundance of the heart, the mouth speaks.', reference: 'Luke 6:45 (ESV)' },
    content: \`"I\'m not hungry. I just want something."

Sound familiar? That "something" is almost never food. It's connection, comfort, validation, stimulation, or relief. But because food is always available and socially acceptable, it becomes the default language for needs we don't know how to name.

**Food as Emotional Vocabulary**

Every food behavior communicates something:
- Eating alone in secret: shame, not wanting to be seen or judged
- Eating past fullness: trying to create a barrier, numbness, or protection
- Restriction and skipping meals: control in an out-of-control life
- Treating yourself after a hard day: "I deserve comfort" — a legitimate need with an unhealthy delivery
- Eating before a difficult conversation: nervous system soothing

These are not character flaws. They are needs seeking expression through the vocabulary your nervous system knows best.

**Luke 6:45: Speaking from the Heart**

"Out of the abundance of the heart, the mouth speaks." This verse is often applied to words — but the principle extends to behavior. What overflows from your heart doesn't just become words. It becomes actions. Patterns. Habits.

When your heart is lonely, it reaches. When your heart is anxious, it soothes. When your heart feels unworthy, it punishes or numbs.

The work of this program is learning to name what overflows from the heart — so you can meet it with the right response.

**The Translation Practice**

Next time you reach for food outside of hunger, pause and ask: "What am I trying to say right now?" Then translate it:
- "I'm exhausted and no one helped me today" → I need rest and acknowledgment
- "Everything feels out of control" → I need one area I can manage
- "I'm bored and under-stimulated" → I need engagement, creativity, or connection

The translation doesn't replace the craving immediately. But it builds the muscle of self-awareness that eventually gives you choice.\`,
    quiz: [
      { question: 'Eating alone in secret most often communicates:', options: ['A preference for solitude', 'Shame or not wanting to be judged', 'Simple convenience', 'Better portion control alone'], correctIndex: 1, explanation: 'Secret eating is almost always connected to shame — a fear of being seen and evaluated negatively.' },
      { question: 'The "translation practice" asks you to:', options: ['Convert calories into emotional weight', 'Name what emotional need is beneath the eating urge', 'Translate food labels into daily values', 'Replace food entirely with journaling'], correctIndex: 1, explanation: 'Translating the craving into an underlying need builds self-awareness and eventually creates space for real choice.' },
      { question: 'Luke 6:45 suggests our behaviors:', options: ['Are random and unrelated to our inner life', 'Overflow from what is abundant in our heart', 'Are primarily shaped by willpower', 'Can be changed by changing our diet first'], correctIndex: 1, explanation: 'Behavior — including eating — is an expression of the heart\'s abundance. Inner transformation produces behavioral change.' }
    ],
    challenge: 'For the next three days, every time you reach for food, ask: "What am I trying to say?" Write the translation. Don\'t judge it. Just name it. At the end of three days, look for the pattern.'
  },
  {
    id: 72, day: 72,
    title: 'Paying It Forward: Wellness as a Gift to Others',
    subtitle: 'How your healing changes the people around you',
    readTimeMin: 7,
    theme: 'community',
    prayer: 'God, let the work You\'re doing in me overflow to the people I love. Use my healing as a doorway for theirs. Amen.',
    scripture: { verse: 'Heal me, Lord, and I will be healed; save me and I will be saved, for you are the one I praise.', reference: 'Jeremiah 17:14 (NIV)' },
    content: \`Your healing is not only for you.

This might be the most important thing you hear in this entire program: the work you're doing on your relationship with food will ripple out to your children, your partner, your siblings, your community — whether you intend it to or not.

**The Modeling Effect**

Children learn more about food from watching their parents than from any school curriculum. Research shows that children of mothers with healthy body image are significantly less likely to develop disordered eating patterns. Children who see a parent handle stress without food learn a different neural pathway for self-regulation.

You are writing a curriculum just by living.

**The Conversation Effect**

When you change, the conversations around you change. Instead of "I shouldn't eat that," you say "I'm not hungry for that right now." Instead of "I'm so bad today," you say "I had a tough day and I'm working on it." These shifts in language are heard. They are modeled. They become permission for others to speak the same way.

**The Encouragement Invitation**

Today's lesson is an invitation to encourage one person in their own wellness journey. Not to preach to them. Not to send them this program unsolicited. Just to speak a word of encouragement — to notice their effort, celebrate a small win, or simply say "I see you working on yourself, and I'm proud of you."

That is the gift your healing gives to others.\`,
    quiz: [
      { question: 'Research on children and food shows:', options: ['Schools are the primary influence on eating habits', 'Children learn more from watching parents than any curriculum', 'Genetics determine food behavior more than modeling', 'What parents eat is irrelevant to children\'s habits'], correctIndex: 1, explanation: 'Children\'s relationships with food are profoundly shaped by observing their parents\' behavior and language around eating.' },
      { question: 'The "conversation effect" refers to:', options: ['Telling others about this program', 'How your changed language around food gives others permission to change too', 'Having food conversations at the dinner table', 'Talking to a therapist about food'], correctIndex: 1, explanation: 'Language shifts create permission. When you stop saying "I\'m so bad," others feel safer doing the same.' },
      { question: 'The encouragement invitation today asks you to:', options: ['Preach your method to someone else', 'Send this program to three friends', 'Speak one word of encouragement to someone working on their wellness', 'Host a group accountability session'], correctIndex: 2, explanation: 'Quiet, genuine encouragement is more powerful than unsolicited advice. Notice someone\'s effort and name it.' }
    ],
    challenge: 'Reach out to one person today with a genuine word of encouragement about their health or wellness journey. Make it specific, make it sincere, and ask nothing in return. Then journal about how it felt to give that.'
  },
  {
    id: 73, day: 73,
    title: 'The Power of One Consistent Thing',
    subtitle: 'Why a small daily non-negotiable changes everything',
    readTimeMin: 6,
    theme: 'habits',
    prayer: 'Lord, help me not despise small, consistent faithfulness. Show me the one thing that anchors everything else. Amen.',
    scripture: { verse: 'Whoever can be trusted with very little can also be trusted with much.', reference: 'Luke 16:10 (NIV)' },
    content: \`What if the whole system didn't need to be perfect? What if all you had to protect was one thing?

Behavior change research consistently shows that "keystone habits" — small, consistent behaviors that seem simple — have an outsized effect on everything else. Keystone habits create structure. They build self-efficacy. They crowd out competing behaviors and generate momentum.

Exercise is the most studied keystone habit. When people start exercising regularly, they spontaneously:
- Begin eating better
- Sleep more consistently
- Become more productive at work
- Spend less compulsively
- Report higher mood

The exercise didn't change those things directly. It changed the person's identity slightly — "I'm someone who takes care of myself" — and that identity radiated outward.

**Choosing Your One Thing**

Your keystone habit should be:
- Small enough that on your worst day, you can still do it
- Consistent enough to become a daily non-negotiable
- Tied to identity (not just an action, but who you're becoming)

Examples:
- A 10-minute morning walk (no matter what)
- One glass of water before every meal
- Five minutes of prayer and scripture before breakfast
- One green-light food at every meal

**Luke 16:10: Trustworthy in Small Things**

Jesus's principle here has direct application to habit building. The person who can be trusted with little — who does the small thing faithfully — is the one who gets trusted with more. Consistency in small things is the evidence of character, and character is what sustains transformation.\`,
    quiz: [
      { question: 'A "keystone habit" is:', options: ['The most difficult habit to build', 'A small consistent behavior that creates momentum across other areas', 'A daily calorie tracking system', 'The final habit to add after others are established'], correctIndex: 1, explanation: 'Keystone habits have disproportionate impact — they shift identity and create structure that supports other healthy behaviors.' },
      { question: 'Research shows that regular exercise spontaneously leads to:', options: ['Immediate weight loss', 'Improved eating, sleep, mood, and productivity', 'Increased food cravings', 'No significant changes outside physical fitness'], correctIndex: 1, explanation: 'Exercise is the best-studied keystone habit — it shifts identity and radiates improvements across multiple life domains.' },
      { question: 'Luke 16:10 teaches that faithfulness in small things:', options: ['Is less important than grand gestures', 'Prepares us to be trusted with greater things', 'Is only relevant to financial stewardship', 'Doesn\'t apply to habit building'], correctIndex: 1, explanation: 'Consistent small faithfulness is the evidence of character — the character that sustains long-term transformation.' }
    ],
    challenge: 'Identify your one keystone habit. It must be small enough to do on your worst day. Write it down, decide on the time and trigger, and commit to 21 consecutive days starting today. Track it with a simple checkmark.'
  },
  {
    id: 74, day: 74,
    title: 'Food, Faith, and the Body in Eternity',
    subtitle: 'Why caring for your body is a theological act',
    readTimeMin: 8,
    theme: 'theology',
    prayer: 'Lord, help me see my body as more than temporary. You chose to dwell in flesh. Teach me to honor what You have sanctified. Amen.',
    scripture: { verse: 'The body is not meant for sexual immorality but for the Lord, and the Lord for the body.', reference: '1 Corinthians 6:13 (NIV)' },
    content: \`Christianity has sometimes been accused of being anti-body — treating physical existence as something to escape from, a temporary container for the "real" spiritual self. But this is a misreading of scripture so significant that it has caused generational harm.

The Christian doctrine of the resurrection is one of the most body-affirming teachings in human history. God does not discard bodies. He redeems them.

**The Theology of Incarnation**

God chose to come to earth in a body. Not as a spirit, not as light, not as a concept — as a body. Jesus ate. He drank. He slept. He had a metabolism. He wept physically. He felt physical pain.

The Incarnation means the physical is not inferior to the spiritual. It means the body has been sanctified, literally, by God's choice to inhabit one.

**1 Corinthians 6:13: Body as Belonging**

"The body is not meant for [misuse] but for the Lord, and the Lord for the body." This verse isn't only about one type of behavior — it's about the entire orientation of how we relate to our physical selves. The body belongs to the Lord. Which means what we do with it matters.

Nourishing your body is a form of stewardship. Not obsession. Not punishment. Not performance. Stewardship: caring for something that doesn't ultimately belong to you.

This reframing changes everything about why you eat well. You're not doing it to look a certain way. You're not doing it to earn something. You're doing it because this body, this life, is a gift that has been entrusted to you — and you are saying thank you by tending it well.\`,
    quiz: [
      { question: 'The doctrine of the Incarnation affirms:', options: ['That physical existence is inferior to spiritual existence', 'That God sanctified the physical by choosing to inhabit a body', 'That the body will ultimately be discarded', 'That food is a purely secular concern'], correctIndex: 1, explanation: 'The Incarnation — God dwelling in human flesh — is the ultimate affirmation that the physical is not inferior or irrelevant.' },
      { question: 'In the context of this lesson, "stewardship" of the body means:', options: ['Trying to look as good as possible', 'Caring for something that belongs to God, not to us', 'Tracking every nutrient precisely', 'Avoiding all indulgent foods permanently'], correctIndex: 1, explanation: 'Stewardship is not ownership — it\'s caring for something entrusted to you. This is the framework for body care.' },
      { question: 'This lesson reframes why we eat well as:', options: ['To achieve a specific appearance goal', 'To prove our self-discipline', 'As an act of gratitude and stewardship of a gift', 'To feel better than others'], correctIndex: 2, explanation: 'Eating well from a place of gratitude and stewardship is more sustainable and spiritually grounded than appearance-driven motivation.' }
    ],
    challenge: 'Write a prayer or reflection where you formally offer your body back to God. Not as a performance, but as an act of gratitude. Then identify one way you will tend your body today as an act of worship, not obligation.'
  },
  {
    id: 75, day: 75,
    title: 'Milestone: You Have Made It Three-Quarters of the Way',
    subtitle: 'Day 75 celebration and rededication',
    readTimeMin: 6,
    theme: 'milestone',
    prayer: 'Lord, I am grateful. Not for perfection, but for persistence. Not for what I\'ve earned, but for what You\'ve sustained in me. I\'m still here. Thank You. Amen.',
    scripture: { verse: 'I have fought the good fight, I have finished the race, I have kept the faith.', reference: '2 Timothy 4:7 (NIV)' },
    content: \`Day 75.

You have shown up — imperfectly, honestly, probably some days more dragging than running — for 75 days. That is three-quarters of this journey. That is something to celebrate.

Take a moment before reading further. Breathe in. Let this land: you are still here.

**What 75 Days Builds**

In 75 days of even partially consistent effort, your brain has begun rewiring neural pathways. Your relationship with food has shifted — even if you can't fully articulate how. You've built awareness, vocabulary, and probably at least a few habits that are actually yours now, not temporary experiments.

You are not the same person who opened this app on Day 1. You are more yourself than you were then — because this work strips away the noise and leaves the person underneath.

**The 2 Timothy 4:7 Tradition**

Paul wrote this from prison, near the end of his life. He wasn't celebrating a perfect run. He was celebrating persistence — the refusal to quit. "I have fought the good fight" doesn't mean he won every battle. It means he stayed in the arena.

You have stayed in the arena.

**The Last 15 Days**

The home stretch is not the time to coast. It is the time to recommit — not with white-knuckle intensity, but with quiet, grounded intention. You know yourself better now than you did on Day 1. Use that knowledge. Go back to what worked. Drop what didn't. Keep your eyes forward.

The finish line is close. And what\'s on the other side isn\'t an endpoint — it\'s a lifestyle.\`,
    quiz: [
      { question: 'What does "75 days of even partially consistent effort" produce?', options: ['Complete physical transformation', 'Beginning of genuine neural rewiring and habit formation', 'Automatic healthy eating without effort', 'Guaranteed weight loss results'], correctIndex: 1, explanation: 'Neuroscience shows that consistent engagement over months begins rewiring the neural pathways that govern behavior.' },
      { question: 'Paul\'s declaration in 2 Timothy 4:7 celebrates:', options: ['Winning every battle', 'Perfect spiritual performance', 'Persistent faithfulness — staying in the fight', 'Physical achievement'], correctIndex: 2, explanation: 'Paul celebrates persistence and faithfulness, not perfection. He stayed in the arena — that\'s the victory.' },
      { question: 'The instruction for the final 15 days is:', options: ['Push harder than ever before', 'Rest and coast to the finish', 'Recommit with quiet, grounded intention', 'Add new ambitious goals'], correctIndex: 2, explanation: 'The final stretch calls for grounded recommitment, not frantic intensity. You\'ve built something real — protect it.' }
    ],
    challenge: 'Write yourself a Day 75 celebration entry. List five things that are genuinely different about you since Day 1 — not necessarily physical, but who you are becoming. Then write one sentence of intention for the next 15 days.'
  },
  {
    id: 76, day: 76,
    title: 'Building Your Personal Food Philosophy',
    subtitle: 'Articulating the principles that will guide you after Day 90',
    readTimeMin: 7,
    theme: 'identity',
    prayer: 'Lord, help me build a framework rooted in wisdom, not fear. Let my food philosophy reflect how You designed me to live — freely and well. Amen.',
    scripture: { verse: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.', reference: 'Proverbs 3:5-6 (NIV)' },
    content: \`This program ends on Day 90. The principles live as long as you do.

A personal food philosophy is not a diet. It's not a set of rules. It's a small collection of guiding principles — things you genuinely believe about food, your body, and yourself — that inform your choices even when no one is watching and no program is running.

**What a Food Philosophy Includes**

Good food philosophies are:
- Short (three to seven principles you can actually remember)
- True (things you have actually experienced, not aspirational rules)
- Yours (not copied from someone else's life or body type)
- Flexible (able to absorb holidays, hard weeks, and life transitions)

**Drafting Your Principles**

Spend time today with these prompts:

1. What have I learned about how my body feels when I nourish it well?
2. What do I now believe about emotional eating that I didn't before?
3. What's one thing I\'ve decided about my relationship with "bad" foods?
4. What does my body need consistently that I\'ve found I can actually provide?
5. What do I want food to mean in my life, going forward?

**A Sample Philosophy (Yours Will Differ)**

"I eat to nourish a body that works hard for me. I allow all foods but eat most things in their original form. I pause when I\'m not hungry. I don\'t use food to punish or reward myself — I\'ve found better ways for both. I enjoy celebrations fully, without keeping score."

That\'s a food philosophy. It\'s five sentences that can guide a lifetime.\`,
    quiz: [
      { question: 'A personal food philosophy differs from a diet because:', options: ['It allows more calories', 'It\'s a set of guiding principles, not rules to follow perfectly', 'It\'s only for people who have completed a program', 'It doesn\'t include vegetables'], correctIndex: 1, explanation: 'A philosophy is internal and principle-based. A diet is external and rule-based. The first sustains; the second cycles.' },
      { question: 'Good food philosophies are:', options: ['Detailed enough to cover every situation', 'Short, true, yours, and flexible', 'Copied from expert nutritionists', 'Changed every few months for variety'], correctIndex: 1, explanation: 'A philosophy you can remember and actually believe will guide you. A complex rulebook will overwhelm and be abandoned.' },
      { question: 'Proverbs 3:5-6 applies to building your food philosophy by:', options: ['Saying God will tell you exactly what to eat', 'Reminding you to lean on wisdom and trust rather than rigid self-understanding', 'Warning against eating too much', 'Promising straight paths for those who diet correctly'], correctIndex: 1, explanation: 'Submitting to wisdom rather than straining to control everything through rules is the posture Proverbs 3 commends.' }
    ],
    challenge: 'Draft your personal food philosophy. Aim for three to five principles. Write them in first person, present tense. Then put them somewhere you\'ll see them after Day 90.'
  },
  {
    id: 77, day: 77,
    title: 'Weekly Reflection: Week Eleven',
    subtitle: 'Looking back and leaning forward',
    readTimeMin: 5,
    theme: 'review',
    prayer: 'Lord, as I look back on this week, let me see it clearly and honestly — with neither rose-tinted gratitude nor harsh condemnation. Just truth. Amen.',
    scripture: { verse: 'Look carefully then how you walk, not as unwise but as wise, making the best use of the time.', reference: 'Ephesians 5:15-16 (ESV)' },
    content: \`Week eleven. Almost there.

This week\'s reflection has one focus: the gap between who you intend to be and who you actually showed up as. Not to create guilt — to create data.

**The Intention-Action Gap**

Most of us intend to eat well far more often than we actually do. The gap between intention and action isn't a moral failure. It's a system failure. Something in your environment, routine, or emotional state is working against your intention.

This week, find one specific moment where you intended something and did something different. Just one. Ask:
- What was the context? (time of day, location, who else was there)
- What was my emotional state immediately before?
- What would have needed to be true for me to follow through on my intention?

That last question is the most important. It names the actual gap — and points toward the actual solution.

**Ephesians 5:15-16: Walking Wisely**

"Making the best use of the time" doesn\'t mean perfect use. It means intentional use — paying attention, adjusting, walking with awareness. That\'s the whole definition of walking wisely.

You're walking more wisely than you were eleven weeks ago. That is the work.\`,
    quiz: [
      { question: 'An intention-action gap is best understood as:', options: ['A character flaw', 'A system failure pointing toward an unmet need or design gap', 'Evidence the program isn\'t working', 'A reason to lower your goals'], correctIndex: 1, explanation: 'CBT and habit science frame the gap between intention and action as a system design problem, not a moral one.' },
      { question: 'The most important question about a gap moment is:', options: ['How many calories were consumed', 'What would have needed to be true for me to follow through', 'Whether it broke my streak', 'Who else saw me do it'], correctIndex: 1, explanation: 'This question names the actual barrier and points toward a structural solution rather than shame or willpower.' },
      { question: 'Ephesians 5:15-16 calls us to:', options: ['Never make mistakes', 'Walk intentionally and make wise use of time', 'Plan every meal in advance', 'Focus only on spiritual growth'], correctIndex: 1, explanation: 'Walking wisely means intentional, aware engagement — not perfection. Adjusting as you go is wisdom, not failure.' }
    ],
    challenge: 'Identify one specific intention-action gap from this week. Map it fully: context, emotional state, what was missing. Then design one small change to the system that would have helped. That\'s your experiment for next week.'
  },
  {
    id: 78, day: 78,
    title: 'Your Support System Is a Health Intervention',
    subtitle: 'The biology of belonging and its effect on your body',
    readTimeMin: 7,
    theme: 'community',
    prayer: 'Lord, remind me that I was not made to do this alone. Give me the humility to receive support and the courage to offer it. Amen.',
    scripture: { verse: 'Two are better than one, because they have a good return for their labor: if either of them falls down, one can help the other up.', reference: 'Ecclesiastes 4:9-10 (NIV)' },
    content: \`Social connection is not a bonus feature of a healthy life. It is a biological necessity.

Research from Harvard's 75-year longitudinal study on adult development — one of the longest-running studies on human happiness ever conducted — reached one stunning conclusion: the quality of your relationships is the single greatest predictor of long-term health and longevity. More predictive than diet. More predictive than exercise.

**The Biology of Belonging**

Social isolation increases cortisol, elevates blood pressure, disrupts sleep, impairs immune function, and — relevant to this program — increases emotional eating.

Connection, by contrast, releases oxytocin, which reduces cortisol and suppresses the stress-driven food cravings that derail most eating behavior changes. Being with people you trust is literally a physiological intervention.

**What This Means Practically**

You are more likely to maintain healthy habits when you:
- Have at least one person who knows you're working on this journey
- Eat meals with others regularly (even virtually)
- Exercise with a friend or in a group setting
- Have someone to call when you're about to emotionally eat

If you don't have that community yet, this is the assignment: build it. Not all at once, not perfectly — one honest conversation with one person.

**Ecclesiastes 4:9-10**

"Two are better than one." This wisdom has been true since the beginning. The provision of community is not weakness — it\'s design. You were built for it. Use it.\`,
    quiz: [
      { question: 'What did Harvard\'s 75-year study find most predictive of health and longevity?', options: ['Diet quality', 'Exercise consistency', 'Relationship quality', 'Genetic inheritance'], correctIndex: 2, explanation: 'The longest-running study on adult development found relationship quality outpredicts diet and exercise for long-term health.' },
      { question: 'Oxytocin released through social connection:', options: ['Increases hunger', 'Reduces cortisol and suppresses stress-driven cravings', 'Has no effect on eating behavior', 'Only affects mood, not physical behavior'], correctIndex: 1, explanation: 'Oxytocin is a biological anti-stress agent that directly counters the cortisol-driven eating patterns many people struggle with.' },
      { question: 'Ecclesiastes 4:9-10 frames the need for community as:', options: ['A sign of spiritual weakness', 'Optional for the truly disciplined', 'Part of God\'s original design for human flourishing', 'Only relevant to married people'], correctIndex: 2, explanation: '"Two are better than one" is ancient wisdom affirming that mutual support is a feature of human design, not a crutch.' }
    ],
    challenge: 'Tell one person about this program today — not to recruit them, but to let them in. Share something specific you\'ve been working on. Notice how it feels to be known in this area of your life.'
  },
  {
    id: 79, day: 79,
    title: 'The New Normal: Life After Dieting',
    subtitle: 'What you\'re building is a lifestyle, not a finish line',
    readTimeMin: 7,
    theme: 'identity',
    prayer: 'Lord, help me release the diet mentality once and for all. Let me step into the new normal You\'ve been building in me — free, nourished, and whole. Amen.',
    scripture: { verse: 'See, I am doing a new thing! Now it springs up; do you not perceive it? I am making a way in the wilderness and streams in the wasteland.', reference: 'Isaiah 43:19 (NIV)' },
    content: \`There\'s a specific kind of anxiety that creeps in around the end of a program: "What happens when it's over?"

This is the moment where old patterns try to reassert themselves. The "I've been so good, now I can have a break" narrative. The "I'll just maintain this until the holidays" thinking. The quiet return to the baseline you were at on Day 1.

Let\'s address this directly.

**The Maintenance Mindset**

Maintenance doesn't mean "keeping score less." It means the habits have become normal enough that they don't require the same level of effort they once did.

In the early days of a new behavior, your brain uses conscious effort and willpower. It's effortful. Uncomfortable. With enough repetition, that behavior moves into the procedural memory — the automatic part of the brain that runs habits without you thinking about them.

You are crossing that threshold. The new normal is the place where healthy choices don't feel like sacrifice — they feel like who you are.

**What to Watch For**

The slippery slope back to old patterns usually starts with one of these:
- "I've earned a break." (From what? From being yourself?)
- "I'll relax my rules just for this week." (Which week never ends)
- "I just need to get through [event] and then I'll get back on track." (You are always on track — there is no off-track)

Catch these early. They are old software trying to reinstall.

**Isaiah 43:19: The New Thing**

God says "I am doing a new thing." Present tense. Ongoing. Not "I did a new thing" or "I will do a new thing someday." The new thing is happening — right now, in you. Do you perceive it?

The new normal is the miracle you sometimes forget to notice.\`,
    quiz: [
      { question: 'What does "maintenance" truly mean in behavior change?', options: ['Relaxing your habits after reaching a goal', 'Habits becoming automatic and normal rather than effortful', 'Maintaining your starting weight', 'Tracking more loosely but counting still'], correctIndex: 1, explanation: 'True maintenance is when behaviors shift from effortful to automatic — they become who you are, not what you\'re doing.' },
      { question: 'Which statement is a warning sign of slipping back to old patterns?', options: ['"I\'m going to keep eating this way because it\'s become normal"', '"I\'ve earned a break from being healthy"', '"My habits feel automatic now"', '"I can adjust my approach based on feedback"'], correctIndex: 1, explanation: '"I\'ve earned a break" is old software trying to reinstall. There is no break from being yourself.' },
      { question: 'Isaiah 43:19 uses the present tense "I am doing" to emphasize:', options: ['That the transformation has already been completed', 'That God\'s work in us is ongoing, not finished', 'That the future is more important than the present', 'That we need to wait for God to act'], correctIndex: 1, explanation: 'The present tense is intentional — the new thing is happening now, continuously. It invites us to perceive what\'s already in motion.' }
    ],
    challenge: 'Write a letter to your Day 1 self, from where you are now. Tell them what\'s different. Tell them what\'s become normal. Tell them that the new thing they were afraid to hope for has already started happening.'
  },
  {
    id: 80, day: 80,
    title: 'Grace Over Guilt: The Final Unlearning',
    subtitle: 'Releasing the shame that diet culture installed in you',
    readTimeMin: 8,
    theme: 'theology',
    prayer: 'Father, I release the guilt I\'ve carried about my body and my eating. Not because it didn\'t matter, but because Your grace is bigger, truer, and more powerful. Amen.',
    scripture: { verse: 'There is therefore now no condemnation for those who are in Christ Jesus.', reference: 'Romans 8:1 (ESV)' },
    content: \`Romans 8:1 is one of the most liberating verses in all of scripture. "No condemnation." Not "less condemnation." Not "condemnation when you deserve it." No condemnation.

This has everything to do with how you eat.

**The Guilt-Shame Spiral in Eating**

Diet culture runs on guilt. Every program, every app, every article about "clean eating" implicitly (and often explicitly) teaches that eating certain foods makes you bad, weak, or undisciplined. And when you eat those foods — which you will, because you\'re human — you feel guilty.

Guilt says: "I did something bad." Shame says: "I am something bad."

CBT has been helping people separate behaviors from identity for decades. What you ate last night does not define you. It is a behavior. It has consequences. It does not make you a bad person, a failed person, or an unworthy person.

**The Unlearning**

The work of these 80 days has been, in large part, an unlearning. Unlearning the food morality that equates eating habits with character. Unlearning the restriction-rebellion cycle that diet culture perpetuates. Unlearning the belief that your body is a problem to be solved.

You cannot solve yourself. You are not a problem.

**Romans 8:1 as Daily Practice**

What if, every time you felt food guilt, you whispered Romans 8:1? Not as a bypass of reflection, but as a grounding — a return to the truth of who you are before you analyze the behavior.

"No condemnation." Then get curious. Then adjust. Then move forward.

That is the cycle of grace. It is far more sustainable than the cycle of guilt.\`,
    quiz: [
      { question: 'What is the key difference between guilt and shame?', options: ['Guilt is worse than shame', 'Guilt says "I did something bad"; shame says "I am something bad"', 'Shame is healthier because it motivates change', 'They are the same thing with different names'], correctIndex: 1, explanation: 'CBT is precise about this distinction. Shame attacks identity; guilt addresses behavior. Only one of them promotes growth.' },
      { question: 'The "unlearning" of this program includes:', options: ['Forgetting everything about nutrition', 'Releasing food morality, restriction-rebellion cycles, and body shame', 'Unlearning to cook', 'Stopping all tracking and measurement'], correctIndex: 1, explanation: 'The deep work of this program is unlearning the damaging beliefs diet culture installed — not just learning new habits.' },
      { question: 'Using Romans 8:1 in response to food guilt means:', options: ['Ignoring the behavior that caused guilt', 'Grounding in identity first, then getting curious and adjusting', 'Never feeling guilty about eating again', 'Using scripture to avoid accountability'], correctIndex: 1, explanation: 'Romans 8:1 is a grounding truth, not a bypass. It restores your footing so you can reflect clearly without shame distorting everything.' }
    ],
    challenge: 'Write down one food behavior you\'ve felt shame about (not just guilt, but shame — "I am bad for this"). Then write Romans 8:1 next to it. Then separate the behavior from your identity in writing. You are not what you ate.'
  },
  {
    id: 81, day: 81,
    title: 'The Ripple Effect: How Your Health Changes Your World',
    subtitle: 'The unexpected social power of personal transformation',
    readTimeMin: 6,
    theme: 'community',
    prayer: 'Lord, let my transformation be not just for me but for everyone whose life touches mine. Use this work to bless beyond what I can see. Amen.',
    scripture: { verse: 'You are the light of the world. A city set on a hill cannot be hidden.', reference: 'Matthew 5:14 (ESV)' },
    content: \`Social scientists have documented something remarkable: healthy behaviors are contagious. When one person in a social network begins eating better and exercising, their immediate connections are 57% more likely to do the same. And their connections' connections are 20% more likely. The ripple goes three degrees out.

This means your transformation is not just yours.

**The Unspoken Permission**

When you change, you give people around you silent permission to believe change is possible. You don't have to say anything. You don't have to preach. You don't have to become a wellness influencer.

You just have to live differently.

A friend watches you order confidently at a restaurant. A coworker notices you take a walk at lunch. A family member sees you pause before reacting to stress instead of reaching for food. These things are witnessed. They become seeds.

**Matthew 5:14: You Are Already on the Hill**

Jesus says "you are the light" — not "try to be the light" or "become the light after you achieve perfection." You already are. The city on the hill cannot be hidden. Your transformation, happening in real time, is already visible to more people than you know.

The question isn\'t whether people are watching. The question is what they\'re seeing.\`,
    quiz: [
      { question: 'Research on social contagion shows:', options: ['Health behaviors only spread if you talk about them', 'Healthy changes in one person make their connections 57% more likely to change', 'The ripple effect only goes one degree of connection', 'Social pressure is the primary driver of behavior change'], correctIndex: 1, explanation: 'Christakis and Fowler\'s social network research showed health behaviors spread three degrees of connection without explicit communication.' },
      { question: 'The "unspoken permission" effect means:', options: ['Telling everyone about your program', 'Living differently gives others silent permission to believe change is possible', 'Permission to stop working on yourself', 'Only works if others already know your story'], correctIndex: 1, explanation: 'Witnessed behavior change is often more influential than taught behavior change. You don\'t have to say a word.' },
      { question: 'Matthew 5:14 says "you are the light" in:', options: ['Future tense — something to become', 'Present tense — something you already are', 'Conditional tense — if you achieve certain things', 'Past tense — based on who you were'], correctIndex: 1, explanation: 'Jesus uses the present tense deliberately. You are already the light — the transformation is already making you visible.' }
    ],
    challenge: 'Pay attention today to one way your changed behavior is being witnessed. Someone watching you eat, choose, or respond to stress. You don\'t have to say anything. Just be aware that you are already on the hill.'
  },
  {
    id: 82, day: 82,
    title: 'Planning for Hard Seasons',
    subtitle: 'Building resilience before you need it',
    readTimeMin: 7,
    theme: 'habits',
    prayer: 'Lord, prepare me for the hard seasons before they arrive. Let me not be caught off guard by difficulty, but rooted deeply enough to bend without breaking. Amen.',
    scripture: { verse: 'Therefore everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock.', reference: 'Matthew 7:24 (NIV)' },
    content: \`Life will get hard again. Guaranteed.

A job loss. A health scare. A relationship rupture. A season of depression. A family crisis. Grief. Burnout.

When these arrive — and they will — your wellness habits will either be your anchor or the first casualty. Building the anchor before the storm is the wisest thing you can do with your final ten days.

**The Hard Season Survival Kit**

Identify your four non-negotiables: the minimum baseline habits that you commit to maintaining even in your worst seasons. These are not aspirations. These are your floor.

Examples:
- I will sleep 6+ hours no matter what else is happening
- I will drink water before every meal
- I will take a 10-minute walk every day
- I will not eat alone while stressed for more than three days without reaching out to someone

**The Pre-Crisis Plan**

Write down:
1. What is my hardest food trigger environment? (job stress, family conflict, loneliness)
2. What does "slipping" look like for me specifically?
3. What has helped me return after a slip in the past?
4. Who can I call when I\'m in it?

This is your hard season plan. It is cheaper and more effective to build it now than to find yourself without it at 11pm during a hard week.

**Matthew 7:24: Build on Rock**

Jesus's parable about the wise builder has a practical message: the rock is preparation. Not eliminating the storms. Preparing for them. Storms come for everyone. The house that survives was built before the storm arrived.\`,
    quiz: [
      { question: 'The four non-negotiables are:', options: ['Your ideal daily habits when life is going well', 'The minimum baseline habits maintained even in hard seasons', 'Goals to work toward over the next year', 'Things you\'ve already achieved and don\'t need to think about'], correctIndex: 1, explanation: 'Non-negotiables are your floor, not your ceiling — the habits that form the anchor during hard seasons.' },
      { question: 'Why should you build a hard season plan now, not later?', options: ['Because planning is always better than acting', 'Because it\'s cheaper and more effective than finding yourself without one mid-crisis', 'Because hard seasons never happen if you\'re prepared', 'Because planning feels productive'], correctIndex: 1, explanation: 'Proactive planning is exponentially more effective than reactive coping. The time to build the house is before the storm.' },
      { question: 'The "rock" in Matthew 7:24 represents:', options: ['A specific diet plan', 'Preparation and putting wisdom into practice before the storm', 'Spiritual perfection', 'Physical health'], correctIndex: 1, explanation: 'The wise man built on rock — meaning he prepared before the storm. The storm came for him too. The foundation made the difference.' }
    ],
    challenge: 'Write your hard season survival kit today: your four non-negotiables, your hard season plan answers, and the name of one person to call. Put it somewhere you\'ll find it when you need it most.'
  },
  {
    id: 83, day: 83,
    title: 'Weekly Reflection: Week Twelve',
    subtitle: 'One week to graduation',
    readTimeMin: 5,
    theme: 'review',
    prayer: 'Lord, as I enter my final week, let me come in with gratitude, not urgency. What You\'ve started in me is not finished, but it is real. Thank You. Amen.',
    scripture: { verse: 'He who began a good work in you will carry it on to completion until the day of Christ Jesus.', reference: 'Philippians 1:6 (NIV)' },
    content: \`Final week.

Before you look forward, take a full look back.

**The Week Twelve Inventory**

Answer these slowly:

1. On Day 1, what did you believe about yourself and food that you no longer believe?
2. What is the biggest single shift in how you eat — not the "what" but the "why"?
3. What habit has become genuinely automatic for you?
4. What are you still working on — honestly?
5. What are you most proud of?

This isn\'t a performance review. It\'s a homecoming — a return to yourself to see who you\'ve become.

**Philippians 1:6: The Ongoing Work**

Paul\'s confidence is striking: "He who began a good work in you will carry it on to completion." Not "might carry it on." Will. The work is not done on Day 90. It continues. God is committed to your completion.

You get to keep going. Not because you have to. Because something has begun in you that has a trajectory.\`,
    quiz: [
      { question: 'The Week Twelve inventory is primarily designed to:', options: ['Measure weight loss results', 'Look back honestly at identity and habit shifts', 'Plan the next 90 days in detail', 'Assess whether to continue the program'], correctIndex: 1, explanation: 'This final reflection is a homecoming — tracking the inner change that may be invisible on a scale but is very real.' },
      { question: 'Philippians 1:6 provides confidence that:', options: ['The work is finished on Day 90', 'God will complete what He has begun in you, beyond Day 90', 'You will achieve every goal you set', 'Paul was confident in his own perfection'], correctIndex: 1, explanation: 'The verse is about God\'s faithfulness, not human achievement. The good work continues beyond any program endpoint.' },
      { question: 'Answering "what are you still working on — honestly?" is important because:', options: ['It identifies where to focus self-criticism', 'Honesty prevents the dangerous myth that you\'ve "arrived"', 'It lowers expectations for the final week', 'It gives you permission to stop trying'], correctIndex: 1, explanation: 'Honest acknowledgment of ongoing growth areas prevents the completion illusion that causes post-program relapse.' }
    ],
    challenge: 'Complete all five inventory questions in full. Then write three words that describe who you are becoming. Save them. They are the beginning of the story you\'ll tell someone else someday.'
  },
  {
    id: 84, day: 84,
    title: 'The Legacy of What You Eat',
    subtitle: 'Nourishment as an act of generational faithfulness',
    readTimeMin: 6,
    theme: 'theology',
    prayer: 'Lord, let the healing that has happened in me become inheritance for those who come after me. Break chains I\'ve carried and build something new. Amen.',
    scripture: { verse: 'A good person leaves an inheritance for their children\'s children.', reference: 'Proverbs 13:22 (NIV)' },
    content: \`The decisions you make today are not just yours.

The way you talk about your body in front of your children is data they will use to understand their own. The way you handle stress without food is a pattern their nervous systems will absorb. The way you approach a meal — with gratitude or guilt — becomes part of the emotional atmosphere of your home.

This is not pressure. This is meaning.

**Breaking Generational Patterns**

In many families, disordered relationships with food pass silently from parent to child. Not through genetics (though that plays a role), but through modeling, language, and emotional pattern. Children who grow up hearing "I'm so bad, I ate that" often grow up internalizing food morality. Children who see adults use food to cope learn it as a coping tool.

You have the power to be the turning point.

Not by being perfect. By being different. By doing the quiet, sustained work that you've been doing for 84 days.

**Proverbs 13:22: What You Leave Behind**

A good inheritance isn\'t just financial. It\'s emotional. Relational. Spiritual. The inheritance of someone who healed their relationship with food is children and grandchildren who don\'t have to fight the same war.

That is worth more than a number on a scale.

It is, perhaps, the most important reason to keep going.\`,
    quiz: [
      { question: 'Generational food patterns are primarily transmitted through:', options: ['Genetics only', 'Modeling, language, and emotional patterns within the home', 'Formal nutrition education', 'Food access and availability'], correctIndex: 1, explanation: 'Research shows food relationships are more socially transmitted than genetically — modeling is the primary mechanism.' },
      { question: 'Being a "turning point" in generational patterns requires:', options: ['Perfection in your eating habits', 'Being different — doing the sustained, quiet work of healing', 'Telling your family about their unhealthy patterns', 'A dramatic public declaration of change'], correctIndex: 1, explanation: 'The turning point is quiet and sustained, not dramatic. It\'s the daily choice to do things differently.' },
      { question: 'Proverbs 13:22\'s "good inheritance" applies here as:', options: ['Financial wisdom only', 'The emotional and relational legacy of a healed food relationship', 'Leaving behind healthy recipes', 'Donating to health charities'], correctIndex: 1, explanation: 'The inheritance you leave isn\'t just money. It\'s who you were — the patterns, language, and emotional health you modeled.' }
    ],
    challenge: 'Write about what inheritance you want to leave regarding food and body. Who in your life will be different because of the work you\'ve done? Name them. Write it as a dedication to them. It doesn\'t have to be shared — just written.'
  },
  {
    id: 85, day: 85,
    title: 'Honoring Your Body\'s Changing Seasons',
    subtitle: 'Adapting with grace to the body you have now',
    readTimeMin: 7,
    theme: 'awareness',
    prayer: 'Lord, help me be at peace with this body in this season of my life. Not resigned, but peaceful — trusting Your design in every stage. Amen.',
    scripture: { verse: 'There is a time for everything, and a season for every activity under the heavens.', reference: 'Ecclesiastes 3:1 (NIV)' },
    content: \`Your body at 25 is different from your body at 40. Your body postpartum is different from your body pre-pregnancy. Your body after a chronic illness is different from your body before it. Your body under high stress is different from your body at rest.

None of these is "broken." All of these are real.

**The Seasonal Body**

One of the most damaging myths in wellness culture is that your body should always perform at the same level and respond the same way to the same inputs. When it doesn\'t — when you gain weight during a stressful year, when you plateau after losing consistently, when exercise that worked at 30 doesn\'t work at 45 — you feel betrayed.

Your body is not betraying you. It is adapting.

Perimenopause changes metabolism. Injury changes exercise capacity. Chronic illness changes energy availability. Grief changes appetite and motivation. These are not failures of discipline — they are seasons, with their own logic and their own invitations.

**Responding to Your Current Season**

Ask yourself honestly: What season is my body in right now?

Then ask: What does this season need — not what did a different season need, but what does this one need?

Maybe this season needs gentler movement. More sleep. Less intensity and more nourishment. Or maybe it needs you to push a little harder than you\'ve been comfortable with. The season tells you — if you listen.

**Ecclesiastes 3:1**

"A time for everything." Not the same time forever. Not the same season for every body and every life stage. There is wisdom in seasonality.\`,
    quiz: [
      { question: 'What is the "seasonal body" concept challenging?', options: ['The idea that bodies change over decades', 'The myth that your body should always respond the same way to the same inputs', 'Seasonal eating based on available foods', 'The idea of resting during winter'], correctIndex: 1, explanation: 'The myth of consistent response causes shame when the body changes. Understanding seasons replaces that shame with curiosity.' },
      { question: 'When your body doesn\'t respond the way it used to, it is most likely:', options: ['Broken and in need of a dramatic intervention', 'Adapting to a new physiological season', 'A sign that your approach has fundamentally failed', 'Evidence that your genetics are working against you'], correctIndex: 1, explanation: 'Adaptation is the body\'s intelligence, not its failure. Metabolic changes with age, stress, and life events are real and normal.' },
      { question: 'The season-specific question to ask your body is:', options: ['How do I get back to how I was?', 'Why isn\'t this working anymore?', 'What does this season need?', 'When will this season end?'], correctIndex: 2, explanation: 'This question accepts the current season and seeks wisdom within it — rather than fighting it or mourning a past season.' }
    ],
    challenge: 'Name the season your body is in right now. Write two or three honest sentences about what this season is like. Then ask: what does this season need? Write that too. Then do one of those things today.'
  },
  {
    id: 86, day: 86,
    title: 'The Story You Tell About Food',
    subtitle: 'Rewriting your food narrative for the next chapter',
    readTimeMin: 7,
    theme: 'identity',
    prayer: 'Lord, let me speak about food and my body the way You speak about me — with truth, with hope, and with the authority of someone who knows how this story ends. Amen.',
    scripture: { verse: 'Death and life are in the power of the tongue, and those who love it will eat its fruit.', reference: 'Proverbs 18:21 (ESV)' },
    content: \`The words you use to describe your relationship with food are not just descriptions. They are prescriptions.

When you say "I'm a sugar addict," you strengthen the neural pathway that pulls you toward sugar. When you say "I'm someone who struggles with emotional eating," you anchor that identity. When you say "I can't help myself around [food]," you remove agency from yourself and hand it to the food.

Language shapes reality. This is not positive thinking woo — it\'s neurolinguistic fact.

**The Stories We Carry**

Most people have a food story they\'ve been telling themselves for years. It usually sounds like:
- "I have no willpower."
- "I\'m an all-or-nothing person."
- "I can\'t eat just one."
- "I\'ve always been an emotional eater."

These stories have an origin — usually something that was said to you, a pattern that felt true for a while, or a diet failure that got interpreted as a character flaw. But stories can be revised.

**Writing the New Chapter**

You are, right now, writing the next chapter of your food story. Not by pretending the old one didn\'t happen, but by choosing what the next lines will be.

New chapter language sounds like:
- "I\'m learning to recognize emotional hunger."
- "I\'m someone who pauses before eating when stressed."
- "I\'m building a relationship with food that feels free."

Notice: these are in progress, present tense, honest, and directional. They don\'t erase the past. They point forward.

**Proverbs 18:21: Eat the Fruit of Your Words**

"Those who love it will eat its fruit." You will eventually live into the story you keep telling. Which story do you want to eat the fruit of?\`,
    quiz: [
      { question: 'Saying "I\'m a sugar addict" does what neurologically?', options: ['Creates helpful awareness of a real problem', 'Strengthens the identity-behavior loop that pulls toward sugar', 'Has no real effect beyond description', 'Encourages others to be more understanding'], correctIndex: 1, explanation: 'Identity statements create neurological self-fulfilling prophecies. What we call ourselves, we tend to become.' },
      { question: 'The ideal new chapter language is:', options: ['Positive affirmations that pretend the past didn\'t happen', 'In-progress, present tense, honest, and directional', 'Perfect tense statements about who you\'ve become', 'Vague enough to avoid accountability'], correctIndex: 1, explanation: 'New chapter language acknowledges the journey without erasing the past — it\'s directional and honest, not performative.' },
      { question: 'Proverbs 18:21 teaches that:', options: ['Words have no real power', 'We will eventually live into the stories we keep telling', 'Only negative words have power', 'Biblical language rules don\'t apply to self-talk'], correctIndex: 1, explanation: 'The fruit of your tongue is your lived experience. This ancient wisdom anticipates modern neurolinguistics.' }
    ],
    challenge: 'Identify one food story you\'ve been telling yourself for years. Write it down. Then write the new chapter version — in-progress, present tense, honest, directional. Read the new chapter version out loud three times. This is rewiring in real time.'
  },
  {
    id: 87, day: 87,
    title: 'Move Your Body Because You Love It',
    subtitle: 'Reframing exercise from punishment to pleasure',
    readTimeMin: 6,
    theme: 'habits',
    prayer: 'Lord, help me move not to earn or burn, but to celebrate what this body can do. Let movement become joy. Amen.',
    scripture: { verse: 'For bodily training is of some value, godliness is of value in every way.', reference: '1 Timothy 4:8 (ESV)' },
    content: \`"I need to burn off what I ate last night."
"I should exercise more since I've been bad."
"I have to work out."

Sound familiar? This is exercise as punishment, and it is one of the most reliable ways to eventually hate exercise and stop doing it.

**The Punishment-Permission Cycle**

When exercise is framed as punishment for eating, and eating is framed as something you need permission to do, you create a cycle: guilt → punishment → relief → repeat. This cycle is exhausting. It turns both eating and movement into transactional, joyless events. And eventually, most people abandon the punishment because the guilt stops being motivating.

There\'s a better frame.

**Exercise as Celebration**

Movement is what your body is designed to do. Your muscles are built for it. Your circulatory system loves it. Your brain runs better on it. Your mood stabilizes with it.

When you move because you love your body — not despite it — exercise becomes a form of gratitude. It is saying "thank you" to a body that works.

Find the movement you actually enjoy. Not what burns the most calories. Not what other people say you should do. The one that makes you feel alive. For some people it\'s dancing. For others, hiking. Lifting weights. Swimming. Yoga. Walking a favorite neighborhood. Chasing grandchildren.

The best exercise is the one you\'ll actually do.

**1 Timothy 4:8**

Paul says bodily training has some value — not no value, not all the value, some value. He\'s naming something important: it\'s good, it matters, and it\'s not the whole picture. Move your body because it has value. Don\'t idolize it or avoid it. Value it.\`,
    quiz: [
      { question: 'Exercise as punishment eventually leads to:', options: ['Better long-term compliance', 'Hating exercise and stopping it', 'Faster results', 'Higher motivation'], correctIndex: 1, explanation: 'Punishment framing creates a joyless, exhausting cycle that most people eventually abandon — because no one sustains punishment indefinitely.' },
      { question: 'The "best exercise" according to this lesson is:', options: ['The one that burns the most calories', 'The one that other fitness experts recommend', 'The one you\'ll actually do and that makes you feel alive', 'The one your doctor prescribed'], correctIndex: 2, explanation: 'Adherence is the most important exercise variable. The best program is one you enjoy enough to maintain long-term.' },
      { question: 'Paul\'s statement that bodily training has "some value" is meant to:', options: ['Discourage exercise in favor of spiritual practice', 'Give exercise its appropriate place — good and valuable, not everything', 'Suggest exercise is barely worth doing', 'Contradict the rest of scripture on the body'], correctIndex: 1, explanation: 'Paul\'s framing honors exercise without idolizing it — a balanced view that keeps movement in its proper, beneficial place.' }
    ],
    challenge: 'List five physical activities that you find genuinely enjoyable (or at least tolerable and good for you). Pick one and do it today — not to burn anything, not to earn anything, but as a thank-you to your body. Notice how it feels.'
  },
  {
    id: 88, day: 88,
    title: 'A Letter to Your Body',
    subtitle: 'The healing act of speaking to yourself with kindness',
    readTimeMin: 6,
    theme: 'identity',
    prayer: 'Father, put kind words in my mouth when I speak about myself. Help me address my body the way You do — with love, not contempt. Amen.',
    scripture: { verse: 'Kind words are like honey — sweet to the soul and healthy for the body.', reference: 'Proverbs 16:24 (NLT)' },
    content: \`On Day 67, you wrote a letter to your body for the first time.

Today, you write it again — from 21 days further into this journey, with everything those days have added to who you are.

**Why This Exercise Matters**

Self-compassion research, pioneered by Dr. Kristin Neff, consistently shows that people with higher self-compassion:
- Are more likely to maintain healthy behaviors after a setback
- Have lower rates of depression and anxiety
- Recover faster from failure
- Are more motivated to change — not less

The myth is that being hard on yourself drives change. The data says self-compassion does. Kindness is not weakness. It is the architecture of sustainable change.

**The Letter Prompt**

Write to your body as if it were a dear friend who has been with you through everything — because it has. Include:
- An apology for any unkindness you've directed at it
- A genuine acknowledgment of what it has carried and survived
- An honest account of what you\'ve learned about it in 88 days
- A promise — not a performance goal, but a relational commitment

**Proverbs 16:24**

"Kind words are... healthy for the body." This is not metaphorical. Research on the psychoneuroimmunological effects of self-compassion shows that kind self-talk reduces inflammatory markers, improves immune function, and decreases cortisol. Kindness to yourself is literally medicine.\`,
    quiz: [
      { question: 'Dr. Kristin Neff\'s self-compassion research shows:', options: ['Being hard on yourself is more motivating', 'Self-compassion leads to lower motivation', 'Higher self-compassion leads to better maintenance and recovery', 'Kindness and health are unrelated'], correctIndex: 2, explanation: 'Self-compassion research consistently shows it predicts better health behaviors and resilience after setbacks.' },
      { question: 'The letter to your body includes:', options: ['Performance goals for the next 90 days', 'An apology, acknowledgment, what you\'ve learned, and a relational promise', 'Only positive things to avoid negative thinking', 'A weight loss plan going forward'], correctIndex: 1, explanation: 'The letter is relational, not transactional. It\'s about the relationship with your body, not expectations of it.' },
      { question: 'Proverbs 16:24 says kind words are "healthy for the body" — this is:', options: ['Only figuratively true', 'Supported by psychoneuroimmunological research showing real physical effects', 'An overstatement', 'Only true for kind words spoken to others'], correctIndex: 1, explanation: 'Self-compassionate self-talk has measurable anti-inflammatory and stress-reducing effects on the physical body.' }
    ],
    challenge: 'Write your second letter to your body. Take at least 15 minutes. Let it be longer and more honest than the first one. Then fold it up and keep it somewhere meaningful. It is a record of someone becoming whole.'
  },
  {
    id: 89, day: 89,
    title: 'What Comes After Day 90',
    subtitle: 'Planning your life with these principles, not just your next 90 days',
    readTimeMin: 7,
    theme: 'habits',
    prayer: 'Lord, as I approach the end of this program, remind me that this was always a beginning. What You\'ve started, You will complete. I walk forward in that faith. Amen.',
    scripture: { verse: 'Forget the former things; do not dwell on the past. See, I am doing a new thing!', reference: 'Isaiah 43:18-19 (NIV)' },
    content: \`Tomorrow is Day 90. Tonight, you stand at a threshold.

The question is not whether this program ends. It does. The question is what you carry forward.

**What You Are Taking With You**

You are leaving this program with:
- A new vocabulary for your emotional eating patterns
- A traffic light framework that makes food choices cleaner
- A biblical understanding of why your body matters and what it deserves
- A set of CBT tools for reframing distorted thoughts about food
- A practice of reflection that you can return to anytime
- A food philosophy that is yours — real, flexible, and grounded

These do not expire on Day 90.

**The Post-Program Plan**

Design your after:
- Which habits will you protect as non-negotiable going forward?
- What will you do when a hard season comes? (You wrote this on Day 82)
- Who knows your journey well enough to hold you accountable?
- When will you check in with yourself — weekly? Monthly?

**The New Thing That\'s Already Happening**

Isaiah 43:18-19 says: "Forget the former things. See, I am doing a new thing." This is not permission to forget what you\'ve learned — it\'s permission to stop letting the old story define you. The new thing is happening. It springs up.

You are the new thing.

Tomorrow you graduate. But the life you\'re entering — that started a long time before Day 1, and it goes a long way past Day 90.\`,
    quiz: [
      { question: 'The question Day 89 asks is:', options: ['Whether to start another program', 'What you carry forward from this one', 'Whether Day 90 is really the end', 'How to measure your results accurately'], correctIndex: 1, explanation: 'The threshold moment of Day 89 is about intentionally carrying the tools and identity forward, not just finishing.' },
      { question: 'Your post-program plan should include:', options: ['A full restart plan for Day 91', 'Non-negotiables, hard season plan, accountability, and check-in schedule', 'A new set of food rules to replace these', 'Only weight tracking going forward'], correctIndex: 1, explanation: 'A post-program plan protects the gains by designing the after intentionally, not hoping the habits survive on their own.' },
      { question: 'Isaiah 43:18-19\'s "forget the former things" means:', options: ['Ignore everything you learned in this program', 'Stop letting the old story define you — the new thing is already happening', 'Pretend difficult past experiences didn\'t happen', 'Focus only on future planning, not present practice'], correctIndex: 1, explanation: 'The invitation is to release the power of the old narrative over your identity — not to erase memory, but to stop being ruled by it.' }
    ],
    challenge: 'Write your post-program plan using the four questions from today\'s lesson. Make it specific. Then write one word that describes who you\'re stepping into tomorrow. That word is yours. You earned it.'
  },
  {
    id: 90, day: 90,
    title: 'Graduation Day: Living Free',
    subtitle: 'You did it. Now go live it.',
    readTimeMin: 8,
    theme: 'milestone',
    prayer: 'Lord, thank You for every day of this journey — the hard ones most of all. Thank You for not letting me do this alone. I walk out of this season changed, and I walk forward in faith. Amen.',
    scripture: { verse: 'So if the Son sets you free, you will be free indeed.', reference: 'John 8:36 (NIV)' },
    content: \`Day 90.

You made it.

And I want to say something to you very clearly: whatever your scale says, whatever your "before and after" looks like or doesn\'t look like — you have done something that most people never do. You showed up. For 90 days. Through hard weeks and good ones, through slips and recommitments, through seasons where this felt impossible and moments where it felt like exactly what you needed.

That is not nothing. That is extraordinary.

**What Has Actually Changed**

Ninety days ago, you had a relationship with food. Today, you have a different relationship with food. Not perfect. Not fixed forever. But different.

You have words now for things that used to happen silently inside you. You have tools for the moments that used to derail you completely. You have a biblical foundation for why your body matters and a CBT framework for when your thoughts lie to you.

You have a food philosophy. You have a hard season plan. You have a letter to your body and a sense of who you\'re becoming.

These things don\'t disappear at 11:59pm tonight.

**The Real Freedom**

John 8:36: "If the Son sets you free, you will be free indeed."

Food freedom isn\'t the absence of struggle. It\'s not a life where you never crave something unhealthy or never eat past fullness or never use food for comfort. That kind of freedom doesn\'t exist.

Real freedom is not being controlled. It\'s having a relationship with food that is not driven by fear, shame, guilt, or compulsion. It\'s being able to enjoy a slice of cake at a birthday without it becoming a spiral. It\'s being able to say "I\'m not hungry" and mean it. It\'s being able to look in the mirror without the first thought being contempt.

That is the freedom on offer. That is what you\'ve been building.

**Go Live It**

The program is over. The journey continues. You carry everything you\'ve learned into the rest of your life — into every meal, every hard day, every celebration, every season.

And when you need to come back to these lessons — because there will be days when you do — they\'ll be here.

This was never about 90 days. This was about the rest of your life.

Go live it. Free.\`,
    quiz: [
      { question: 'What the graduation lesson says has "actually changed" is:', options: ['Your weight and physical appearance', 'Your relationship with food — the words, tools, and framework you now have', 'Your diet plan and meal schedule', 'Nothing — real change takes longer than 90 days'], correctIndex: 1, explanation: 'The internal transformation — the vocabulary, tools, philosophy, and framework — is the real change that sustains everything else.' },
      { question: 'Real food freedom, according to this lesson, means:', options: ['Never craving unhealthy foods again', 'A relationship with food not driven by fear, shame, or compulsion', 'Achieving a specific body weight or shape', 'Eating only green-light foods permanently'], correctIndex: 1, explanation: 'Freedom isn\'t the absence of struggle — it\'s not being controlled by food through fear, shame, guilt, or compulsion.' },
      { question: 'John 8:36 says freedom through the Son is:', options: ['Conditional on continued perfect behavior', '"Free indeed" — complete and real', 'Only available after a long spiritual journey', 'A feeling, not a reality'], correctIndex: 1, explanation: '"Free indeed" is emphatic — not partially free, not situationally free, but genuinely, fully free. That is the theological ground of this entire program.' }
    ],
    challenge: 'Today\'s challenge is the whole rest of your life. Keep going. Be gentle. Be honest. Come back to these lessons when you need them. Tell your story to someone who needs to hear it. And remember: you are free indeed.'
  }`

let src = fs.readFileSync('./src/data/lessonData.js', 'utf8')
const lastEntry = src.lastIndexOf('  },\n]')
src = src.slice(0, lastEntry + 4) + NEW_LESSONS + '\n]'
fs.writeFileSync('./src/data/lessonData.js', src)
console.log('Days 61-90 appended successfully.')
