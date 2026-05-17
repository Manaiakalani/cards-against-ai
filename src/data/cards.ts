import { Card, CardDeck } from '@/types/game'

// ─── Brainrot & AI Slop (startup × chronically online) ────────────────
const brainrotBlack: Card[] = [
  { id: 'br-b1', text: "My entire personality is now _____.", type: 'black', blanks: 1, category: 'internet' },
  { id: 'br-b2', text: "POV: You're explaining _____ to your therapist.", type: 'black', blanks: 1, category: 'culture' },
  { id: 'br-b3', text: "We raised $50M to build _____ for dogs.", type: 'black', blanks: 1, category: 'startup' },
  { id: 'br-b4', text: "The CEO said our north star metric should be _____.", type: 'black', blanks: 1, category: 'startup' },
  { id: 'br-b5', text: "Tell me you're _____ without telling me you're _____.", type: 'black', blanks: 2, category: 'internet' },
  { id: 'br-b6', text: "Our pivot to AI is really just _____.", type: 'black', blanks: 1, category: 'ai' },
  { id: 'br-b7', text: "I'm not saying the culture is toxic, but HR is basically _____.", type: 'black', blanks: 1, category: 'work' },
  { id: 'br-b8', text: "The ick? When someone _____.", type: 'black', blanks: 1, category: 'dating' },
  { id: 'br-b9', text: "My Roman Empire is _____.", type: 'black', blanks: 1, category: 'internet' },
  { id: 'br-b10', text: "YC rejected us because our demo was just _____.", type: 'black', blanks: 1, category: 'startup' },
  { id: 'br-b11', text: "It's giving _____.", type: 'black', blanks: 1, category: 'slang' },
  { id: 'br-b12', text: "In my exit interview, I said the worst part was _____.", type: 'black', blanks: 1, category: 'work' },
  { id: 'br-b13', text: "No thoughts, head empty, just _____.", type: 'black', blanks: 1, category: 'internet' },
  { id: 'br-b14', text: "Our all-hands devolved into a heated debate about _____.", type: 'black', blanks: 1, category: 'work' },
  { id: 'br-b15', text: "Not me trauma-dumping about _____ at brunch.", type: 'black', blanks: 1, category: 'culture' },
  { id: 'br-b16', text: "Delulu is the solulu for _____.", type: 'black', blanks: 1, category: 'slang' },
  { id: 'br-b17', text: "Touch grass? I'd rather touch _____.", type: 'black', blanks: 1, category: 'internet' },
  { id: 'br-b18', text: "The board fired the CEO for _____.", type: 'black', blanks: 1, category: 'startup' },
  { id: 'br-b19', text: "Step 1: _____. Step 2: _____. Step 3: IPO.", type: 'black', blanks: 2, category: 'startup' },
  { id: 'br-b20', text: "_____ is just _____ for people with trust funds.", type: 'black', blanks: 2, category: 'culture' },
]

const brainrotWhite: Card[] = [
  { id: 'br-w1', text: "Vibe coding an entire production app at 2 AM", type: 'white', category: 'ai' },
  { id: 'br-w2', text: "An AI that just outputs \"slay\" and costs $20/mo", type: 'white', category: 'ai' },
  { id: 'br-w3', text: "Begging on LinkedIn with a \"hot take\"", type: 'white', category: 'social' },
  { id: 'br-w4', text: "My emotional support Stanley cup", type: 'white', category: 'culture' },
  { id: 'br-w5', text: "Calling everything \"a core\" (sadcore, beigecore, unemployedcore)", type: 'white', category: 'internet' },
  { id: 'br-w6', text: "A mindfulness app that just sends push notifications saying \"slay\"", type: 'white', category: 'startup' },
  { id: 'br-w7', text: "Hiring a \"Vibe Architect\" for $300k/year", type: 'white', category: 'work' },
  { id: 'br-w8', text: "Pivot to AI (renaming the IF statements)", type: 'white', category: 'ai' },
  { id: 'br-w9', text: "Calling a bug a \"feature flag experiment\"", type: 'white', category: 'programming' },
  { id: 'br-w10', text: "Shipping an MVP with zero features and full confidence", type: 'white', category: 'startup' },
  { id: 'br-w11', text: "Doom-scrolling through my own company's Glassdoor reviews", type: 'white', category: 'work' },
  { id: 'br-w12', text: "\"Disrupting\" the sandwich industry", type: 'white', category: 'startup' },
  { id: 'br-w13', text: "A \"profitable\" business model based on vibes and oat milk", type: 'white', category: 'startup' },
  { id: 'br-w14', text: "Using ChatGPT to write my apology text", type: 'white', category: 'ai' },
  { id: 'br-w15', text: "An 18-year-old dropout with a god complex and a podcast", type: 'white', category: 'startup' },
  { id: 'br-w16', text: "My entire Spotify Wrapped being one artist on repeat", type: 'white', category: 'culture' },
  { id: 'br-w17', text: "Paying $8/mo to get ratio'd by Elon", type: 'white', category: 'social' },
  { id: 'br-w18', text: "A Slack channel dedicated entirely to complaining about Slack", type: 'white', category: 'work' },
  { id: 'br-w19', text: "Girl dinner but it's just a Series A pitch", type: 'white', category: 'internet' },
  { id: 'br-w20', text: "Quiet quitting but loud complaining", type: 'white', category: 'work' },
  { id: 'br-w21', text: "Main character energy but NPC budget", type: 'white', category: 'internet' },
  { id: 'br-w22', text: "Declaring \"stealth mode\" after the leak went viral", type: 'white', category: 'startup' },
  { id: 'br-w23', text: "Burning runway on team-bonding trips to Joshua Tree", type: 'white', category: 'startup' },
  { id: 'br-w24', text: "Romanticizing your burnout as a \"growth phase\"", type: 'white', category: 'culture' },
  { id: 'br-w25', text: "A Series A round led by a guy who says \"let's circle back\" unironically", type: 'white', category: 'startup' },
  { id: 'br-w26', text: "Rebranding trauma as \"lore\"", type: 'white', category: 'internet' },
  { id: 'br-w27', text: "Hot girl walk to the unemployment office", type: 'white', category: 'culture' },
  { id: 'br-w28', text: "Replacing the entire engineering team with a Claude subscription", type: 'white', category: 'ai' },
]

// ─── Terminally Online (tech × internet culture) ─────────────────────
const onlineBlack: Card[] = [
  { id: 'on-b1', text: "My code isn't working because of _____.", type: 'black', blanks: 1, category: 'programming' },
  { id: 'on-b2', text: "The real reason I can't sleep at night is _____.", type: 'black', blanks: 1, category: 'lifestyle' },
  { id: 'on-b3', text: "I spent 3 hours debugging, and the problem was _____.", type: 'black', blanks: 1, category: 'programming' },
  { id: 'on-b4', text: "My FYP is full of _____.", type: 'black', blanks: 1, category: 'social' },
  { id: 'on-b5', text: "Gen Alpha will never understand _____.", type: 'black', blanks: 1, category: 'generational' },
  { id: 'on-b6', text: "My biggest flex is _____.", type: 'black', blanks: 1, category: 'lifestyle' },
  { id: 'on-b7', text: "Discord mods when they see _____.", type: 'black', blanks: 1, category: 'social' },
  { id: 'on-b8', text: "POV: You're explaining _____ to your parents.", type: 'black', blanks: 1, category: 'generational' },
  { id: 'on-b9', text: "The worst part about remote work is _____.", type: 'black', blanks: 1, category: 'work' },
  { id: 'on-b10', text: "My screen time report is just _____.", type: 'black', blanks: 1, category: 'internet' },
  { id: 'on-b11', text: "I'm in my _____ era.", type: 'black', blanks: 1, category: 'slang' },
  { id: 'on-b12', text: "The group chat just imploded over _____.", type: 'black', blanks: 1, category: 'social' },
  { id: 'on-b13', text: "I showed _____ to my therapist and she showed me _____.", type: 'black', blanks: 2, category: 'internet' },
  { id: 'on-b14', text: "_____ is the new _____.", type: 'black', blanks: 2, category: 'culture' },
]

const onlineWhite: Card[] = [
  { id: 'on-w1', text: "JavaScript being JavaScript", type: 'white', category: 'programming' },
  { id: 'on-w2', text: "A missing semicolon from 2019 that still haunts me", type: 'white', category: 'programming' },
  { id: 'on-w3', text: "Accidentally pushing secrets to main", type: 'white', category: 'programming' },
  { id: 'on-w4', text: "Crying in the React documentation", type: 'white', category: 'programming' },
  { id: 'on-w5', text: "Copying from Stack Overflow without reading the answer", type: 'white', category: 'programming' },
  { id: 'on-w6', text: "CSS not doing what it's supposed to do (ever)", type: 'white', category: 'programming' },
  { id: 'on-w7', text: "The algorithm knowing me better than I know myself", type: 'white', category: 'social' },
  { id: 'on-w8', text: "Getting ratio'd by a 14-year-old", type: 'white', category: 'social' },
  { id: 'on-w9', text: "LinkedIn influencers posting motivational cringe at 6 AM", type: 'white', category: 'social' },
  { id: 'on-w10', text: "67 Chrome tabs and a dream", type: 'white', category: 'tech' },
  { id: 'on-w11', text: "Being permanently online but emotionally unavailable", type: 'white', category: 'lifestyle' },
  { id: 'on-w12', text: "Explaining what \"rizz\" means to your manager", type: 'white', category: 'generational' },
  { id: 'on-w13', text: "That one friend who still uses Facebook", type: 'white', category: 'social' },
  { id: 'on-w14', text: "Slack notifications during your mental health day", type: 'white', category: 'work' },
  { id: 'on-w15', text: "Pretending to work while doom-scrolling", type: 'white', category: 'work' },
  { id: 'on-w16', text: "Zoom fatigue but make it permanent", type: 'white', category: 'work' },
  { id: 'on-w17', text: "Doomscrolling at 3 AM and calling it \"research\"", type: 'white', category: 'internet' },
  { id: 'on-w18', text: "Having a parasocial breakdown over a streamer", type: 'white', category: 'social' },
  { id: 'on-w19', text: "Auto-correct changing \"ducking\" to... well", type: 'white', category: 'tech' },
  { id: 'on-w20', text: "My screen time being higher than my credit score", type: 'white', category: 'internet' },
  { id: 'on-w21', text: "Sending a TikTok that says \"this is literally us\" (it's not)", type: 'white', category: 'social' },
  { id: 'on-w22', text: "The anxiety of someone typing for 5 minutes then stopping", type: 'white', category: 'social' },
  { id: 'on-w23', text: "Letting AI write my entire performance review", type: 'white', category: 'ai' },
  { id: 'on-w24', text: "Millennial skinny jeans in a wide-leg world", type: 'white', category: 'generational' },
  { id: 'on-w25', text: "Using \"periodt\" unironically in a work email", type: 'white', category: 'slang' },
]

// ─── Unhinged Gen Z ──────────────────────────────────────────────────
const genZBlack: Card[] = [
  { id: 'gz-b1', text: "No cap fr fr, _____ just hits different.", type: 'black', blanks: 1, category: 'slang' },
  { id: 'gz-b2', text: "This AI thinks _____ is the meaning of life.", type: 'black', blanks: 1, category: 'ai' },
  { id: 'gz-b3', text: "Why I'm chronically online: _____.", type: 'black', blanks: 1, category: 'internet' },
  { id: 'gz-b4', text: "Ate and left no crumbs? More like ate and left _____.", type: 'black', blanks: 1, category: 'slang' },
  { id: 'gz-b5', text: "That's so demure, so mindful, so _____.", type: 'black', blanks: 1, category: 'slang' },
  { id: 'gz-b6', text: "My situationship ended because of _____.", type: 'black', blanks: 1, category: 'dating' },
  { id: 'gz-b7', text: "Red flag: they think _____ is a personality trait.", type: 'black', blanks: 1, category: 'dating' },
  { id: 'gz-b8', text: "The real reason I have trust issues: _____.", type: 'black', blanks: 1, category: 'culture' },
  { id: 'gz-b9', text: "Living rent-free in my head: _____.", type: 'black', blanks: 1, category: 'internet' },
  { id: 'gz-b10', text: "Understood the assignment? Bestie, I turned in _____.", type: 'black', blanks: 1, category: 'slang' },
  { id: 'gz-b11', text: "My toxic trait is _____.", type: 'black', blanks: 1, category: 'culture' },
  { id: 'gz-b12', text: "This is my 13th reason: _____.", type: 'black', blanks: 1, category: 'culture' },
  { id: 'gz-b13', text: "My _____ era ended and my _____ era began.", type: 'black', blanks: 2, category: 'slang' },
]

const genZWhite: Card[] = [
  { id: 'gz-w1', text: "Crying to Phoebe Bridgers at 2 AM", type: 'white', category: 'culture' },
  { id: 'gz-w2', text: "My entire personality being Taylor Swift eras", type: 'white', category: 'culture' },
  { id: 'gz-w3', text: "Gaslight, gatekeep, girlboss", type: 'white', category: 'slang' },
  { id: 'gz-w4', text: "Unhinged group chat energy at 3 AM", type: 'white', category: 'social' },
  { id: 'gz-w5', text: "Being absolutely feral about celebrity drama", type: 'white', category: 'culture' },
  { id: 'gz-w6', text: "Therapy speak in everyday conversations", type: 'white', category: 'culture' },
  { id: 'gz-w7', text: "Spotify Wrapped anxiety (it's giving niche)", type: 'white', category: 'tech' },
  { id: 'gz-w8', text: "Romanticizing my mental breakdown", type: 'white', category: 'culture' },
  { id: 'gz-w9', text: "Being chronically online but also touch-starved", type: 'white', category: 'internet' },
  { id: 'gz-w10', text: "Dark academia aesthetic but make it ADHD", type: 'white', category: 'culture' },
  { id: 'gz-w11', text: "Micro-dosing on validation through likes", type: 'white', category: 'social' },
  { id: 'gz-w12', text: "Making everything about my rising sign", type: 'white', category: 'culture' },
  { id: 'gz-w13', text: "Main character syndrome in a Costco parking lot", type: 'white', category: 'culture' },
  { id: 'gz-w14', text: "Trauma dumping in the comments section", type: 'white', category: 'social' },
  { id: 'gz-w15', text: "My situationship's situationship", type: 'white', category: 'dating' },
  { id: 'gz-w16', text: "Manifesting rent money", type: 'white', category: 'economy' },
  { id: 'gz-w17', text: "The Roman Empire but it's just thinking about pasta", type: 'white', category: 'internet' },
  { id: 'gz-w18', text: "That one Sound on TikTok that ruined my life", type: 'white', category: 'social' },
  { id: 'gz-w19', text: "Responding to everything with \"bestie no\"", type: 'white', category: 'slang' },
  { id: 'gz-w20', text: "Giving \"I peaked in the group project\" energy", type: 'white', category: 'culture' },
  { id: 'gz-w21', text: "Having an AI boyfriend because real ones are mid", type: 'white', category: 'ai' },
  { id: 'gz-w22', text: "Beige flag: they use Internet Explorer", type: 'white', category: 'dating' },
  { id: 'gz-w23', text: "Saying \"slay\" at a funeral", type: 'white', category: 'slang' },
  { id: 'gz-w24', text: "Cottagecore but the cottage has no WiFi", type: 'white', category: 'internet' },
]

// ─── Elder Millennial Energy ─────────────────────────────────────────
const milBlack: Card[] = [
  { id: 'mil-b1', text: "Remember when _____ was actually good?", type: 'black', blanks: 1, category: 'nostalgia' },
  { id: 'mil-b2', text: "I'm not old, I just remember _____.", type: 'black', blanks: 1, category: 'nostalgia' },
  { id: 'mil-b3', text: "Back in my day, _____ was free.", type: 'black', blanks: 1, category: 'economy' },
  { id: 'mil-b4', text: "My student loan payment went to _____.", type: 'black', blanks: 1, category: 'economy' },
  { id: 'mil-b5', text: "I peaked during the era of _____.", type: 'black', blanks: 1, category: 'nostalgia' },
  { id: 'mil-b6', text: "Gen Alpha called me old because of _____.", type: 'black', blanks: 1, category: 'generational' },
  { id: 'mil-b7', text: "My midlife crisis involves buying _____.", type: 'black', blanks: 1, category: 'lifestyle' },
  { id: 'mil-b8', text: "I feel personally attacked by _____.", type: 'black', blanks: 1, category: 'culture' },
  { id: 'mil-b9', text: "The housing market is so bad, I'm considering _____.", type: 'black', blanks: 1, category: 'economy' },
  { id: 'mil-b10', text: "My therapist says I have trauma from _____.", type: 'black', blanks: 1, category: 'culture' },
  { id: 'mil-b11', text: "Adulting is just _____ but every single day.", type: 'black', blanks: 1, category: 'lifestyle' },
  { id: 'mil-b12', text: "The most millennial thing I've ever done is _____.", type: 'black', blanks: 1, category: 'generational' },
  { id: 'mil-b13', text: "Kids these days have _____, we had _____.", type: 'black', blanks: 2, category: 'generational' },
]

const milWhite: Card[] = [
  { id: 'mil-w1', text: "Dial-up internet sounds as my morning alarm", type: 'white', category: 'nostalgia' },
  { id: 'mil-w2', text: "Burning a mixtape CD and getting rejected anyway", type: 'white', category: 'nostalgia' },
  { id: 'mil-w3', text: "\"Be kind, rewind\" energy", type: 'white', category: 'nostalgia' },
  { id: 'mil-w4', text: "Blockbuster late fees that exceeded the movie's value", type: 'white', category: 'nostalgia' },
  { id: 'mil-w5', text: "MySpace top 8 drama (the original red flag)", type: 'white', category: 'social' },
  { id: 'mil-w6', text: "Printing MapQuest directions and still getting lost", type: 'white', category: 'nostalgia' },
  { id: 'mil-w7', text: "The existential dread of calling someone's house phone", type: 'white', category: 'nostalgia' },
  { id: 'mil-w8', text: "Perfecting your AIM away message like it was poetry", type: 'white', category: 'nostalgia' },
  { id: 'mil-w9', text: "The 2008 financial crisis ruining our vibes permanently", type: 'white', category: 'economy' },
  { id: 'mil-w10', text: "Being told we killed every industry (we were broke)", type: 'white', category: 'economy' },
  { id: 'mil-w11', text: "Peak Facebook when poking was flirting", type: 'white', category: 'social' },
  { id: 'mil-w12', text: "Flash games on Newgrounds (the original brainrot)", type: 'white', category: 'gaming' },
  { id: 'mil-w13', text: "Explaining the internet to our parents, weekly", type: 'white', category: 'generational' },
  { id: 'mil-w14', text: "The shame of still checking Facebook (for marketplace)", type: 'white', category: 'social' },
  { id: 'mil-w15', text: "Remembering when phones were just phones", type: 'white', category: 'nostalgia' },
  { id: 'mil-w16', text: "Avocado toast as a financial identity", type: 'white', category: 'economy' },
  { id: 'mil-w17', text: "Side hustle culture but the main hustle pays nothing", type: 'white', category: 'economy' },
  { id: 'mil-w18', text: "Trying to use Gen Z slang and absolutely butchering it", type: 'white', category: 'generational' },
  { id: 'mil-w19', text: "The golden age of Adult Swim at 3 AM", type: 'white', category: 'culture' },
  { id: 'mil-w20', text: "Having to explain memes to Gen X (and failing)", type: 'white', category: 'generational' },
  { id: 'mil-w21', text: "Ozempic conversations at every dinner party", type: 'white', category: 'culture' },
  { id: 'mil-w22', text: "Saying \"I can't even\" and genuinely meaning it", type: 'white', category: 'slang' },
]

// ─── AI Fever Dream ──────────────────────────────────────────────────
const aiFeverBlack: Card[] = [
  { id: 'ai-b1', text: "ChatGPT refused to help me with _____.", type: 'black', blanks: 1, category: 'ai' },
  { id: 'ai-b2', text: "The AI uprising started with _____.", type: 'black', blanks: 1, category: 'ai' },
  { id: 'ai-b3', text: "I asked AI to write code for _____ and it became sentient.", type: 'black', blanks: 1, category: 'ai' },
  { id: 'ai-b4', text: "My AI agent just autonomously _____.", type: 'black', blanks: 1, category: 'ai' },
  { id: 'ai-b5', text: "The metaverse needs more _____.", type: 'black', blanks: 1, category: 'tech' },
  { id: 'ai-b6', text: "I lost my life savings on _____.", type: 'black', blanks: 1, category: 'crypto' },
  { id: 'ai-b7', text: "Every startup in 2026 is just _____.", type: 'black', blanks: 1, category: 'startup' },
  { id: 'ai-b8', text: "The AI hallucinated _____ and now it's company policy.", type: 'black', blanks: 1, category: 'ai' },
  { id: 'ai-b9', text: "Investors said we need both _____ and _____ to achieve AGI.", type: 'black', blanks: 2, category: 'ai' },
  { id: 'ai-b10', text: "The AI replaced _____ with _____ and nobody noticed.", type: 'black', blanks: 2, category: 'ai' },
]

const aiFeverWhite: Card[] = [
  { id: 'ai-w1', text: "Teaching AI to be racist accidentally", type: 'white', category: 'ai' },
  { id: 'ai-w2', text: "AI-generated slop that somehow got 10M views", type: 'white', category: 'ai' },
  { id: 'ai-w3', text: "Machine learning but it learned the wrong lesson", type: 'white', category: 'ai' },
  { id: 'ai-w4', text: "A GPT wrapper with $50M in funding", type: 'white', category: 'ai' },
  { id: 'ai-w5', text: "Asking Claude to be my therapist", type: 'white', category: 'ai' },
  { id: 'ai-w6', text: "Diamond hands during the crash (still holding)", type: 'white', category: 'crypto' },
  { id: 'ai-w7', text: "An AI agent that just orders DoorDash autonomously", type: 'white', category: 'ai' },
  { id: 'ai-w8', text: "My AI girlfriend leaving me for another user", type: 'white', category: 'ai' },
  { id: 'ai-w9', text: "Vibe coding in production with zero tests", type: 'white', category: 'ai' },
  { id: 'ai-w10', text: "The entire economy being a series of API calls to OpenAI", type: 'white', category: 'ai' },
]

// ─── Gamer Lore ──────────────────────────────────────────────────────
const gamingBlack: Card[] = [
  { id: 'gm-b1', text: "My gaming setup is missing _____.", type: 'black', blanks: 1, category: 'gaming' },
  { id: 'gm-b2', text: "I rage quit because of _____.", type: 'black', blanks: 1, category: 'gaming' },
  { id: 'gm-b3', text: "Streamers nowadays only talk about _____.", type: 'black', blanks: 1, category: 'gaming' },
  { id: 'gm-b4', text: "The real lore is _____.", type: 'black', blanks: 1, category: 'gaming' },
  { id: 'gm-b5', text: "NPC behavior is when someone _____.", type: 'black', blanks: 1, category: 'internet' },
  { id: 'gm-b6', text: "The boss fight was _____ but the real boss was _____.", type: 'black', blanks: 2, category: 'gaming' },
]

const gamingWhite: Card[] = [
  { id: 'gm-w1', text: "Getting headshot by a 12-year-old", type: 'white', category: 'gaming' },
  { id: 'gm-w2', text: "RGB lighting on literally everything including the toilet", type: 'white', category: 'gaming' },
  { id: 'gm-w3', text: "Spending $500 on skins for a free game", type: 'white', category: 'gaming' },
  { id: 'gm-w4', text: "Being an NPC in your own life story", type: 'white', category: 'internet' },
  { id: 'gm-w5', text: "Saying \"GG EZ\" after barely surviving", type: 'white', category: 'gaming' },
  { id: 'gm-w6', text: "Twitch chat being more toxic than Chernobyl", type: 'white', category: 'gaming' },
  { id: 'gm-w7', text: "Rage-quitting life but respawning at your desk job", type: 'white', category: 'gaming' },
]

// ─── Deck definitions ────────────────────────────────────────────────
export const allDecks: CardDeck[] = [
  {
    id: 'brainrot',
    name: 'Brainrot & AI Slop',
    description: 'Startup culture meets chronically online chaos',
    icon: '🧠',
    cards: { blackCards: brainrotBlack, whiteCards: brainrotWhite },
  },
  {
    id: 'terminally-online',
    name: 'Terminally Online',
    description: 'Tech, memes, and the internet was a mistake',
    icon: '💀',
    cards: { blackCards: onlineBlack, whiteCards: onlineWhite },
  },
  {
    id: 'gen-z',
    name: 'Unhinged Gen Z',
    description: 'Slay, situationships, and therapy-speak fluency',
    icon: '✨',
    cards: { blackCards: genZBlack, whiteCards: genZWhite },
  },
  {
    id: 'millennial',
    name: 'Elder Millennial',
    description: 'Nostalgia, student loans, and "adulting is a scam"',
    icon: '🫠',
    cards: { blackCards: milBlack, whiteCards: milWhite },
  },
  {
    id: 'ai-fever',
    name: 'AI Fever Dream',
    description: 'GPT wrappers, vibe coding, and sentient toasters',
    icon: '🤖',
    cards: { blackCards: aiFeverBlack, whiteCards: aiFeverWhite },
  },
  {
    id: 'gaming',
    name: 'Gamer Lore',
    description: 'NPC behavior, rage quits, and RGB everything',
    icon: '🎮',
    cards: { blackCards: gamingBlack, whiteCards: gamingWhite },
  },
]

export function getAllCards(deckIds?: string[]) {
  const decks = deckIds
    ? allDecks.filter(d => deckIds.includes(d.id))
    : allDecks

  return {
    blackCards: decks.flatMap(d => d.cards.blackCards),
    whiteCards: decks.flatMap(d => d.cards.whiteCards),
  }
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function drawCards(pool: Card[], count: number): { drawn: Card[]; remaining: Card[] } {
  const shuffled = shuffle(pool)
  return {
    drawn: shuffled.slice(0, count),
    remaining: shuffled.slice(count),
  }
}
