// Source of truth for questions + hidden scoring key.
// Each option: [text, "dim:val,dim:val", patternLetter, optionalAdminNote]
// Patterns: P deliberate planner, S self-reliant, C consultative, A accommodating, V cautious/deferring, B bold/direct
// Dims: fin emo ind dec cri amb ada com acc pra

const Q = {
F1: ["Your salary has just come in. After rent you have ₹40,000 left. A close friend asks to borrow ₹25,000 for a hospital bill and says he will repay in three months. Your own course fee of ₹30,000 is due in four months.", [
  ["Lend him the full amount. The course can wait if it has to.", "com:1,fin:-1,emo:1", "A"],
  ["Lend ₹10,000 and help him find other sources for the rest.", "fin:2,emo:1,pra:1,dec:1", "C"],
  ["Lend the full amount, but agree on a written repayment schedule first.", "fin:1,acc:1,dec:1", "P"],
  ["Tell him you can't lend right now, without going into detail.", "fin:1,emo:-1,ind:1", "V"],
  ["Offer to pay part of the bill directly to the hospital instead of giving cash.", "pra:2,fin:1,cri:1", "P"],
  ["Lend it, and plan to borrow from your family if your course fee falls short.", "fin:-2,com:1,dec:-1", "A", "Would take on new borrowing to cover a loan made to someone else."]
]],
F2: ["You receive an unexpected bonus of ₹1,50,000. You owe ₹60,000 on a credit card at 36% yearly interest. Your parents have hinted that the house needs repairs, and you have wanted a better laptop for work.", [
  ["Clear the credit card in full first, then decide about the rest.", "fin:2,dec:1,acc:1", "P"],
  ["Give most of it to your parents for repairs and keep paying the card monthly.", "fin:-1,com:1,emo:1", "A"],
  ["Buy the laptop first. Better tools will raise your income.", "amb:2,fin:-1", "B"],
  ["Split it roughly three ways between the card, parents and laptop.", "ada:1,com:1,dec:-1", "C"],
  ["Invest most of it and keep paying the card's minimum due.", "fin:-2,amb:1,dec:-1", "B", "Chose to invest while carrying 36% interest debt. Discuss understanding of interest costs."],
  ["Leave it untouched in savings for a few months while you think it over.", "fin:1,dec:-1", "V"]
]],
F3: ["Eight months ago you lent ₹30,000 to a cousin. He has never mentioned it, and today he posted photos from a holiday abroad. You now need money for an urgent family expense.", [
  ["Message him directly, mention the trip, and ask for the full amount.", "ind:1,emo:-1,acc:1", "B"],
  ["Ask politely for whatever he can return now, without bringing up the trip.", "emo:2,fin:1,pra:1", "P"],
  ["Ask an elder in the family to raise it with him.", "ind:-1,emo:1", "C"],
  ["Say nothing and cover the expense from your savings or a loan.", "fin:-1,ind:1,emo:-1", "A"],
  ["Bring it up at the next family gathering so others know.", "emo:-2,acc:1", "B", "Would raise a private money matter publicly."],
  ["Write the money off in your mind and never lend to him again.", "ind:1,fin:-1", "V"]
]],
F4: ["You get a job offer from a 15-month-old startup paying ₹8,000 a month more than you earn now, but without PF or health insurance. Your current job is stable with slow growth.", [
  ["Take it. Higher pay and faster learning matter more right now.", "amb:2,fin:-1,ada:1", "B"],
  ["Take it, but only after buying a personal health policy and saving six months of expenses.", "fin:2,pra:2,dec:1", "P"],
  ["Use the offer to negotiate a raise in your current job.", "pra:1,amb:1,ind:1", "S"],
  ["Stay where you are. Stability matters more at this stage.", "fin:1,amb:-1,ada:-1", "V"],
  ["Ask your family and partner and go with what they prefer.", "ind:-2,com:1,dec:-1", "C"],
  ["Take it and keep freelancing on the side as a backup.", "amb:1,ada:1,fin:1", "S"]
]],
F5: ["Your partner wants to spend ₹45,000 on outfits and gifts for a family wedding. You think ₹20,000 is reasonable. Your joint savings are ₹1,20,000.", [
  ["Agree to ₹45,000. Family occasions matter and an argument isn't worth it.", "com:1,fin:-1,emo:1", "A"],
  ["Propose a limit of around ₹30,000 and walk through the numbers together.", "fin:1,emo:1,pra:1,dec:1", "C"],
  ["Hold firm at ₹20,000.", "fin:1,emo:-1,ind:1", "S"],
  ["Let them spend it and cut your own spending for the next two months to make up for it.", "com:2,fin:1,ada:1", "A"],
  ["Suggest they pay the extra from their personal money.", "ind:1,emo:-1,fin:1", "S"],
  ["Avoid the topic for now and decide closer to the date.", "dec:-2,fin:-1", "V", "Deferred a shared money decision."]
]],
E1: ["Your partner snaps at you after a long day over something small. You did nothing wrong.", [
  ["Give them space and talk about it later, once they are calm.", "emo:2,dec:1", "P"],
  ["Ask right away what is actually bothering them.", "emo:1,cri:1", "C"],
  ["Tell them it isn't fair to take it out on you.", "ind:1,acc:1", "S"],
  ["Snap back. You've had a long day too.", "emo:-2,acc:-1", "B", "Would respond to irritation with irritation."],
  ["Apologise even though it wasn't your fault, to keep the peace.", "emo:-1,com:1,ind:-1", "A"],
  ["Make them tea, say nothing about it, and let it pass.", "emo:1,com:1,acc:-1", "A"]
]],
E2: ["After a stressful day you snap at your partner over something small. They go quiet.", [
  ["Apologise as soon as you notice and explain what stressed you.", "acc:2,emo:2", "P"],
  ["Wait until the next morning, then talk about it.", "emo:1,acc:1", "V"],
  ["Act normal and hope it blows over.", "acc:-2,emo:-1", "V", "Would let a hurtful moment pass without acknowledgement."],
  ["Explain why you were stressed, without apologising. Your reaction was understandable.", "acc:-1,ind:1", "S"],
  ["Do something kind for them instead of talking about it.", "emo:1,com:1", "A"],
  ["Ask them why they have gone quiet.", "acc:-1,emo:-1", "B"]
]],
E3: ["A close friend tells you they may be fired. You honestly think they have been careless at work for months.", [
  ["Tell them directly that they've been careless and need to fix it.", "acc:1,emo:-1,ind:1", "B"],
  ["Listen first, then ask what they think went wrong.", "emo:2,dec:1", "P"],
  ["Reassure them it isn't their fault.", "emo:-1,com:1", "A"],
  ["Help them update their CV and start applying elsewhere.", "pra:2,ada:1", "S"],
  ["Share a time you failed yourself, so they feel less alone.", "emo:1,com:1", "C"],
  ["Change the subject. It isn't your place to judge.", "emo:-1,com:-1", "V"]
]],
E4: ["At a family dinner, a relative mocks your career choice in front of everyone.", [
  ["Laugh it off and change the subject.", "emo:1,ada:1", "V"],
  ["Reply calmly with facts about your work.", "ind:1,emo:1,cri:1", "S"],
  ["Reply with a sharp comeback.", "emo:-2,ind:1", "B"],
  ["Stay quiet now and talk to the relative privately later.", "emo:2,dec:1", "P"],
  ["Make an excuse and leave the dinner early.", "emo:-1,com:-1", "V"],
  ["Ask a parent to step in.", "ind:-1,emo:0", "C"]
]],
E5: ["You find out a close friend has been telling others about personal problems you shared in confidence.", [
  ["Confront them about it immediately.", "ind:1,emo:-1,cri:1", "B"],
  ["Wait a day, then tell them calmly how it affected you.", "emo:2,dec:1", "P"],
  ["Say nothing, but quietly stop sharing personal things with them.", "emo:-1,ind:1", "V"],
  ["End the friendship.", "emo:-1,com:-2,dec:1", "B"],
  ["First ask mutual friends what exactly was said.", "pra:1,dec:1", "C"],
  ["Let it go. They probably meant well.", "com:1,ind:-1", "A"]
]],
P1: ["Driving on a highway at night, you see the car ahead hit a two-wheeler and drive away. The rider is lying on the road, conscious, with a bleeding leg.", [
  ["Park safely with hazard lights on, call 112, then go to the rider.", "cri:2,pra:2,dec:1", "P"],
  ["Chase the car to get its number plate.", "cri:-2,dec:-1", "B", "Prioritised the offender over the injured person."],
  ["Drag the rider off the road immediately.", "cri:1,pra:-1", "B"],
  ["Call 112 from your car and wait there until help arrives.", "cri:1,pra:-1", "V"],
  ["Stop and record a video of the scene for evidence, then help.", "pra:1,cri:-1", "S"],
  ["Wave down other vehicles so you can help together.", "cri:1,pra:1", "C"]
]],
P2: ["Twenty minutes before an important client presentation, your laptop won't start. The final slides are on it.", [
  ["Pull the latest version from email or cloud and present from a colleague's laptop.", "cri:2,pra:2,ada:1", "P"],
  ["Tell the client honestly and ask to reschedule.", "acc:1,cri:-1", "V"],
  ["Present without slides, using a whiteboard and what you remember.", "ada:2,cri:1", "B"],
  ["Keep trying to fix the laptop until the last minute.", "cri:-1,dec:-1", "S"],
  ["Ask a teammate to open the meeting while you rebuild the key slides.", "cri:1,ada:1", "C"],
  ["Delay the start by fifteen minutes without explaining why.", "acc:-1,cri:-1", "V"]
]],
P3: ["At 2 a.m. you notice a strong smell of gas in the kitchen. Your family is asleep.", [
  ["Leave the switches alone, open the windows, shut the cylinder valve, wake everyone and step outside.", "cri:2,pra:2", "P"],
  ["Switch on the kitchen light to find where it's coming from.", "cri:-2,pra:-2", "B", "Chose an ignition risk in a gas leak. Check basic safety awareness."],
  ["Call the gas agency's emergency number first.", "cri:1,pra:1", "C"],
  ["Wake everyone and get out at once, without stopping for anything.", "cri:1,com:1", "V"],
  ["Shut the regulator, go back to sleep and call the agency in the morning.", "cri:-1,pra:-1", "S"]
]],
P4: ["At a crowded railway station you get separated from your elderly mother. Her phone is in your bag.", [
  ["Go straight to the enquiry counter and request an announcement.", "cri:2,pra:2", "P"],
  ["Go back to the exact spot where you lost her and wait.", "pra:1,cri:0", "V"],
  ["Search platform by platform yourself.", "ind:1,cri:-1", "S"],
  ["Phone relatives so they can help.", "cri:-1,ind:-1", "C"],
  ["Tell the railway police and give them her description.", "cri:1,pra:1", "C"],
  ["Run through the crowd calling her name.", "cri:-1,emo:-1", "B"]
]],
P5: ["In an important written test, with 15 minutes left, you realise you misread a question worth 20% of the marks and answered it wrong.", [
  ["Write a short, correct answer for it and leave the rest as it is.", "cri:2,dec:2", "P"],
  ["Leave it and use the time to finish the remaining questions properly.", "dec:1,pra:1", "S"],
  ["Ask the invigilator for extra time.", "cri:-1,ind:-1", "C"],
  ["Cross it out and add a note saying you misread the question.", "acc:1,cri:-1", "A"],
  ["Redo it in full, even if you can't finish the others.", "cri:-1,dec:-1", "B"]
]],
I1: ["Your parents want you to spend two years in government-exam coaching. You want to try building your own business.", [
  ["Follow their plan. They have sacrificed a lot for you.", "ind:-2,com:1", "A"],
  ["Start the business with a fixed deadline. If it fails, do the coaching.", "ind:1,pra:2,dec:1", "P"],
  ["Do both part-time.", "ada:1,dec:-1", "S"],
  ["Go ahead with the business. It's your life.", "ind:2,com:-1,emo:-1", "B"],
  ["Show them a written plan and ask for one year.", "ind:1,emo:1,pra:1", "C"],
  ["Put off the decision and keep things as they are.", "dec:-2,ind:-1", "V"]
]],
I2: ["Your team agrees on an approach in a meeting. You think it's wrong, but everyone seems confident, including your manager.", [
  ["Speak up in the meeting and give your reasons.", "ind:2,acc:1", "B"],
  ["Go along with it, but send your manager a short written note afterwards.", "ind:1,pra:1,dec:1", "P"],
  ["Go along with it. They may see something you don't.", "ind:-1,ada:1", "A"],
  ["Quietly do your own part your way.", "ind:1,acc:-1,com:-1", "S", "Would act against an agreed team decision without saying so."],
  ["Talk it over with one trusted colleague first.", "dec:1,ind:-1", "C"],
  ["Stay silent. If it fails, it isn't on you.", "acc:-2,ind:-1", "V", "Would withhold a concern and avoid ownership of the outcome."]
]],
I3: ["You have to choose between two cities for a new job. Your friends and partner have strong opinions about each.", [
  ["List the factors that matter to you and decide yourself.", "ind:2,dec:2", "P"],
  ["Go with the city your partner prefers.", "ind:-1,com:1", "A"],
  ["Pick the one with the better pay.", "amb:1,ind:1", "S"],
  ["Take a vote among the people closest to you.", "ind:-2,dec:-1", "C"],
  ["Visit both before deciding.", "pra:1,dec:1", "P"],
  ["Accept whichever offer letter arrives first.", "dec:-2,ada:1", "V"]
]],
I4: ["You are alone in a new city. Your rent deposit refund is stuck, and you have ₹3,000 to last two weeks.", [
  ["Call home and ask for money straight away.", "ind:-2,cri:1", "C"],
  ["Cut spending to essentials and pick up short-term gig work.", "ind:2,pra:2,ada:1", "S"],
  ["Borrow from a colleague you met recently.", "ind:-1,fin:-1", "C"],
  ["Use a credit card or an instant loan app.", "fin:-2,cri:1", "B", "Would turn to high-cost short-term credit."],
  ["Follow up with the landlord every day until the deposit is released.", "ind:1,cri:1,acc:1", "B"],
  ["Live on a tight budget, and ask family only if nothing changes by day ten.", "fin:1,pra:1,ind:1,dec:1", "P"]
]],
A1: ["You are offered a promotion with 40% more pay, but it means moving to another city for two years. Your parents are ageing and live alone near you.", [
  ["Accept. Arrange care for them and visit every month.", "amb:2,pra:1", "S"],
  ["Decline. Family comes first at this stage.", "amb:-2,com:2", "A"],
  ["Try to negotiate a later move or partly remote work.", "pra:2,amb:1,dec:1", "P"],
  ["Accept and move your parents with you.", "amb:1,com:1,ada:1", "B"],
  ["Ask your siblings to take over their care.", "com:-1,amb:1", "C"],
  ["Ask for more time and hope the situation changes.", "dec:-2,amb:-1", "V"]
]],
A2: ["A one-year certification costs ₹1,80,000 and needs three hours every evening. It would probably double your salary within three years.", [
  ["Enrol now and take an education loan if needed.", "amb:2,fin:-1", "B"],
  ["Save for six months, then enrol without a loan.", "fin:2,amb:1,dec:1", "P"],
  ["Look for a cheaper online alternative first.", "pra:1,fin:1", "S"],
  ["Skip it. Three hours every evening is too much right now.", "amb:-2,com:-1", "V"],
  ["Ask your employer to sponsor it in exchange for a service bond.", "pra:2,amb:1", "C"],
  ["Enrol, but drop out if it starts affecting work.", "amb:1,com:-1,ada:1", "V"]
]],
A3: ["Two years into a job, you are doing well but bored. A senior offers you a role on a new project that could easily fail.", [
  ["Take it. You will learn more either way.", "amb:2,ada:2", "B"],
  ["Stay. You are good at your current work and it's safe.", "amb:-1,ada:-1", "V"],
  ["First ask what happens to your role if the project fails.", "pra:1,dec:1", "P"],
  ["Take it only if your current role is held for you.", "pra:1,amb:1", "S"],
  ["Use the offer to ask for more interesting work in your current team.", "amb:1,pra:1,ind:1", "S"],
  ["Start looking for a new job outside instead.", "amb:1,com:-1", "B"]
]],
A4: ["Your business has made losses for eight months, and you have used half your savings to keep it going.", [
  ["Keep going. Most businesses take time.", "amb:1,fin:-2,com:1", "B"],
  ["Set a three-month deadline with specific targets, then decide.", "dec:2,fin:1,acc:1", "P"],
  ["Take a job and run the business part-time.", "ada:2,fin:1", "S"],
  ["Shut it down now and limit the losses.", "fin:1,com:-1,dec:1", "V"],
  ["Bring in a partner or investor, even if you lose some control.", "ada:1,ind:-1", "C"],
  ["Borrow from family to keep it running longer.", "fin:-2,ind:-1", "A", "Would extend a loss-making venture with family money."]
]],
C1: ["You promised to help a friend move house on Sunday. On Saturday night you are offered one day of paid work on Sunday, worth ₹8,000.", [
  ["Keep your promise to your friend.", "com:2,amb:-1", "A"],
  ["Take the work, explain honestly, and offer to pay for movers.", "amb:1,acc:1,com:-1", "S"],
  ["Help in the morning and try to do the work in the afternoon.", "ada:1,com:1", "C"],
  ["Take the work and tell your friend something came up.", "com:-2,acc:-2", "B", "Would break a commitment and give a vague reason."],
  ["Ask your friend whether they would mind before deciding.", "emo:1,com:1", "C"],
  ["Find someone else to help in your place.", "pra:1,com:1", "S"]
]],
C2: ["A friend promised to help you on an important day. At the last minute they cancel because they got paid work.", [
  ["Understand. Money matters.", "emo:1,ada:1", "A"],
  ["Tell them clearly that you feel let down.", "emo:1,ind:1", "S"],
  ["Say it's fine, but trust them a little less from now on.", "emo:-1", "V"],
  ["Ask them to at least arrange someone in their place.", "pra:1,cri:1", "C"],
  ["Stop relying on them for anything.", "com:-1,emo:-1", "B"]
]],
C3: ["Your relationship has hit a rough patch. You have been arguing frequently for three months.", [
  ["Suggest a serious conversation about what has changed and what each of you needs.", "com:2,emo:2", "P"],
  ["Suggest seeing a counsellor together.", "com:1,pra:1", "C"],
  ["Take a few weeks apart.", "com:-1,emo:0", "V"],
  ["Keep going. It will pass.", "com:1,dec:-1", "V"],
  ["Consider ending it. Three months is a long time.", "com:-2,dec:1", "B"],
  ["Be extra kind and avoid topics that cause fights.", "emo:0,com:1,acc:-1", "A"]
]],
C4: ["You committed to six months of weekend volunteering. After two months it is tiring and not what you expected.", [
  ["Complete the six months as promised.", "com:2,acc:1", "P"],
  ["Ask the coordinator to reduce your hours.", "pra:1,com:1,ada:1", "C"],
  ["Give two weeks' notice and leave.", "com:-1,acc:1", "S"],
  ["Gradually stop showing up.", "com:-2,acc:-2", "V", "Would withdraw from a commitment without communicating."],
  ["Find a replacement volunteer, then leave.", "pra:1,acc:1", "C"]
]],
R1: ["A plumber quotes ₹6,000 to fix a leak. You have watched a few videos and think you could do it yourself with a ₹600 part.", [
  ["Try it yourself and call the plumber if it goes wrong.", "pra:1,ind:1,ada:1", "B"],
  ["Get a second quote first.", "pra:2,fin:1,dec:1", "P"],
  ["Pay the plumber. It isn't worth the risk.", "fin:-1,pra:0", "V"],
  ["Ask the plumber to break down the quote, then negotiate.", "pra:1,fin:1", "S"],
  ["Ask a handy friend to help you do it.", "pra:1,ind:-1", "C"]
]],
R2: ["This week you have three urgent deadlines: one from your manager, one from a client, and your sibling's wedding paperwork.", [
  ["Rank them by the cost of missing each, then agree new dates with the others.", "pra:2,dec:2,acc:1", "P"],
  ["Work late every night and do all three.", "com:1,pra:-1", "A"],
  ["Ask for help with at least one of them.", "pra:1,ada:1", "C"],
  ["Do whichever is due first, then move to the next.", "pra:1,dec:1", "S"],
  ["Do the family task first. Work can wait.", "com:1,amb:-1", "A"],
  ["Start all three and switch whenever someone follows up.", "pra:-2,dec:-2", "V", "Reactive prioritisation under load."]
]],
R3: ["You are choosing between two flats. Flat A costs ₹14,000 a month with a 45-minute commute. Flat B costs ₹19,000 and is a 10-minute walk from work.", [
  ["Flat A. You save ₹60,000 a year.", "fin:2,pra:0", "S"],
  ["Flat B. Your time is worth more than the money.", "amb:1,fin:-1", "B"],
  ["Work out the real cost of commute time and fares first, then decide.", "pra:2,dec:2", "P"],
  ["Ask colleagues who live near each flat.", "pra:1,ind:-1", "C"],
  ["Choose whichever is in better condition with the better landlord.", "pra:1,dec:1", "S"],
  ["Flat A for now, and move after your next raise.", "ada:1,fin:1", "P"]
]]
};

const ORDER = ["F1","E1","P1","I1","A1","C1","R1","F2","E3","P2","I2","A2","F4","E4","P3","C3","R2","F3","I3","E2","A3","P4","F5","C4","E5","I4","P5","A4","C2","R3"];

// Related scenario pairs for consistency checks: [qA, qB, dimension, label]
const PAIRS = [
  ["F1","F3","fin","Lending to someone close vs. recovering money you lent"],
  ["E1","E2","emo","Partner snaps at you vs. you snap at your partner"],
  ["C1","C2","com","Breaking a promise for paid work vs. being let down the same way"],
  ["I1","I3","ind","Family pressure on career vs. others' opinions on relocation"],
  ["A2","A4","fin","Funding a long-term investment vs. funding a struggling venture"],
  ["P2","P5","cri","Work emergency vs. test-time mistake"],
  ["C3","C4","com","Commitment in a relationship vs. a formal commitment"]
];

// Specific cross-answer rules: [optA, optB(any of), message]
const RULES = [
  [["C1-d","C1-b"],["C2-b","C2-e","C2-c"],"Chose to step back from a promise for paid work, but responds with hurt or reduced trust when someone does the same. Discuss expectations of self versus others."],
  [["E1-c","E1-d"],["E2-c","E2-d","E2-f"],"Expects a partner to own an outburst, but did not choose to apologise for their own. Discuss accountability in conflict."],
  [["F1-a","F1-f"],["F3-a","F3-e"],"Lends generously, then recovers money in a confrontational or public way. Discuss boundaries before lending."],
  [["I1-a","I3-d","I3-b","F4-e"],["I2-a","I2-f"],"Several choices defer to others on major decisions. Discuss how decisions are made when opinions differ."],
  [["A4-a","A4-f"],["F2-e","I4-d"],"Willing to carry debt or keep funding losses in more than one scenario. Discuss risk tolerance with money."],
  [["C3-e","C4-d","C4-c"],["E5-d","C2-e"],"Tends to exit when things become difficult across separate situations. Discuss what makes a commitment worth continuing."]
];

// Optional module: Intimacy & sexual compatibility (18+, opt-in, untimed).
// Dims: ic intimacy communication, cr consent & boundaries, fx flexibility with differences,
//       pr importance of physical intimacy (descriptive), ec emotional–physical link (descriptive)
const IX = {
X1: ["In a long-term relationship, how important is a regular physical relationship to you?", [
  ["Essential. It is a major part of how I feel connected.", "pr:2"],
  ["Important, but one part among many.", "pr:1"],
  ["It depends on the stage of life and the relationship.", "pr:0,fx:1"],
  ["Nice to have. Emotional closeness matters more to me.", "pr:-1"],
  ["Not very important to me.", "pr:-2"]
]],
X2: ["You and your partner want physical intimacy at quite different frequencies. What would you actually do?", [
  ["Talk about it openly and agree on a middle ground.", "ic:2,fx:2"],
  ["Go along with their preference to avoid tension.", "fx:1,ic:-1,cr:-1"],
  ["Expect them to adjust to what you want.", "fx:-2,cr:-1", "Expects the partner to adjust to their preference."],
  ["Avoid the topic and hope it settles on its own.", "ic:-2"],
  ["Suggest seeing a counsellor or doctor if it keeps causing stress.", "ic:1,fx:1"],
  ["Accept the difference and focus on other kinds of closeness.", "fx:1,ec:1"]
]],
X3: ["Your partner says no to intimacy one night when you were looking forward to it.", [
  ["Accept it without any pressure and stay affectionate.", "cr:2,ec:1"],
  ["Accept it, but feel hurt and go quiet.", "cr:1,ic:-1"],
  ["Ask gently whether something is wrong, without pushing.", "cr:2,ic:1"],
  ["Try to persuade them.", "cr:-2", "Would try to persuade after a no. Discuss consent and respect for refusal."],
  ["Feel rejected and bring it up later.", "ic:-1,ec:-1"]
]],
X4: ["How comfortable are you talking with a partner about likes, dislikes and boundaries in intimacy?", [
  ["Comfortable. I can discuss it openly.", "ic:2"],
  ["I can, but it takes time and trust.", "ic:1"],
  ["Only if my partner brings it up first.", "ic:-1"],
  ["I'd rather it be understood without talking about it.", "ic:-2"],
  ["I find it difficult and would want help, such as a book or a counsellor.", "ic:0,fx:1"]
]],
X5: ["Your partner wants to try something new in intimacy that you're unsure about.", [
  ["Discuss it, agree limits, and try it only if you're both comfortable.", "cr:2,fx:1,ic:1"],
  ["Say no clearly. Your boundaries come first.", "cr:1,fx:-1"],
  ["Agree to keep them happy, even if you're uncomfortable.", "cr:-1,ic:-1", "Would go along despite discomfort. Discuss personal boundaries."],
  ["Ask for time to think about it.", "cr:1"],
  ["Feel judged or upset that they asked.", "ic:-1,fx:-1"]
]],
X6: ["Which describes you best?", [
  ["I need to feel emotionally close before physical intimacy.", "ec:2"],
  ["Physical closeness helps me feel emotionally close.", "ec:1"],
  ["Both feed each other equally.", "ec:1,fx:1"],
  ["For me they are mostly separate.", "ec:-1"],
  ["I'm not sure. I haven't thought about it much.", "ec:0"]
]],
X7: ["After an argument with your partner, how do you feel about physical intimacy?", [
  ["The issue needs to be resolved first.", "ec:1,ic:1"],
  ["It can help us reconnect, and then we talk.", "ec:1,ic:1"],
  ["I'd avoid it for a few days.", "ic:-1"],
  ["I'd use it to smooth things over without discussing the issue.", "ic:-2", "May use intimacy in place of resolving conflict."],
  ["It depends on the argument.", "fx:1"]
]],
X8: ["Physical intimacy has dropped a lot for several months because of stress, health or family demands.", [
  ["Talk about it and make time for it deliberately.", "ic:2,fx:1"],
  ["Accept it as a phase and wait.", "fx:1,ic:-1"],
  ["Seek professional advice together.", "ic:1,fx:1"],
  ["Feel resentful but say nothing.", "ic:-2,ec:-1", "Would hold resentment without raising it."],
  ["Treat it as a serious problem in the relationship.", "pr:1,fx:-1"],
  ["Focus on emotional closeness instead.", "ec:1,fx:1"]
]]
};
const IX_ORDER = ["X1","X2","X3","X4","X5","X6","X7","X8"];

module.exports = { Q, ORDER, PAIRS, RULES, IX, IX_ORDER };
