// Relationship Rapid Fire — questions + hidden scoring.
// Option: [text, "dim:val,...", adminNote|null]. Values 0–2 (higher = healthier for that dimension).
// Dims: loy loyalty, emo emotional maturity, fin financial partnership, com communication,
//       cmt commitment, tru trust & boundaries, sxc talking about intimacy, sxr consent & respect,
//       sxf flexibility with differences, pref importance of intimacy (descriptive, 0–3)
const CATS = {
  L: "Loyalty & Commitment", E: "Emotional Maturity", F: "Financial & Life Partnership",
  C: "Compatibility & Future", S: "Sexual & Physical Compatibility", B: "Trust & Personal Boundaries"
};
const Q = {
L1: ["Your partner goes through a financial struggle that lasts two years or more. What do you do?", [
  ["Stay and work through it together, even if life gets harder.", "loy:2,cmt:2,fin:2"],
  ["Stay, but agree on a clear plan for getting back on track.", "loy:2,cmt:2,fin:2,com:2"],
  ["Stay only if he shows real effort to recover.", "loy:1,cmt:1,fin:1"],
  ["Take a break until things are stable again.", "loy:0,cmt:0,fin:0", "Would step back from the relationship during a long financial struggle."],
  ["Leave. Financial security matters too much to me.", "loy:0,cmt:0,fin:0", "Would leave over a prolonged financial struggle."]
]],
L2: ["Someone more successful than your partner starts showing clear interest in you.", [
  ["Shut it down immediately and make it clear I'm taken.", "loy:2,cmt:2"],
  ["Stay polite, keep my distance, and tell my partner about it.", "loy:2,cmt:2,com:2,tru:2"],
  ["Enjoy the attention, but never act on it.", "loy:1,cmt:1,com:0"],
  ["Stay in touch with them, just in case.", "loy:0,cmt:0", "Would keep a romantic option open while in the relationship."],
  ["Seriously wonder whether I'm with the right person.", "loy:0,cmt:0", "Interest from someone more successful would make them question the relationship."]
]],
L3: ["Your family or friends keep criticising your partner and pushing you to rethink the relationship.", [
  ["Defend my partner firmly and set boundaries with them.", "loy:2,cmt:2"],
  ["Hear their concerns, then make my own decision.", "loy:1,emo:2,cmt:1"],
  ["Talk privately with my partner about what's being said.", "loy:2,com:2,cmt:2"],
  ["Go along with them to keep peace at home.", "loy:0,cmt:0", "Would give way to family or friends over the relationship."],
  ["Start doubting the relationship myself.", "loy:0,cmt:0,emo:1"]
]],
L4: ["Emotional cheating means a secret, deep emotional closeness with someone else. To you, it is…", [
  ["As serious as physical cheating.", "loy:2"],
  ["Serious, but less serious than physical cheating.", "loy:1"],
  ["Only a problem if it becomes physical.", "loy:0", "Does not see emotional cheating as a breach unless it becomes physical."],
  ["Not cheating at all.", "loy:0", "Does not consider emotional cheating to be cheating."],
  ["Whatever the two of us agree our boundaries are.", "loy:1,com:2"]
]],
E1: ["When you are really angry with your partner, you usually…", [
  ["Take a short pause, then talk once I'm calmer.", "emo:2,com:2"],
  ["Say exactly what I feel, right away.", "emo:1,com:1"],
  ["Go silent until he notices something is wrong.", "emo:0,com:0", "Uses silence when angry."],
  ["Raise my voice or say hurtful things, then regret it.", "emo:0,com:1", "Says hurtful things in anger."],
  ["Act as if everything is fine.", "emo:0,com:0"]
]],
E2: ["You were wrong in an argument, but your ego doesn't want to admit it.", [
  ["Apologise clearly, even though it's hard.", "emo:2,com:2"],
  ["Apologise later, once the mood has settled.", "emo:1,com:1"],
  ["Show it through actions instead of saying sorry.", "emo:1,com:0"],
  ["Wait for him to make the first move.", "emo:0,com:0", "Waits for the partner to make the first move even when at fault."],
  ["I rarely apologise. It feels like losing.", "emo:0,com:0", "Finds apologising very difficult."]
]],
E3: ["Something your partner did keeps bothering you.", [
  ["Bring it up calmly and soon.", "com:2,emo:2"],
  ["Wait for the right moment, then talk about it.", "com:2,emo:1"],
  ["Drop hints and hope he understands.", "com:0,emo:1"],
  ["Withdraw and become distant.", "com:0,emo:0", "Withdraws instead of raising problems."],
  ["Keep it to myself. It's not worth a fight.", "com:0,emo:1"]
]],
E4: ["Your partner criticises something about you, and it's partly true.", [
  ["Listen, accept the fair part, and work on it.", "emo:2,com:2"],
  ["Feel hurt, but think it over later.", "emo:1,com:1"],
  ["Explain why he's wrong.", "emo:0,com:1"],
  ["Point out his faults in return.", "emo:0,com:0", "Responds to criticism by criticising back."],
  ["Go quiet and avoid the subject.", "emo:0,com:0"]
]],
F1: ["Your partner loses his income for several months.", [
  ["Cover the household expenses until he's back on his feet.", "fin:2,cmt:2"],
  ["Contribute what I can and plan a budget together.", "fin:2,cmt:2,com:2"],
  ["Help a little, but he should manage his own share.", "fin:1,cmt:1"],
  ["Expect his family to support him.", "fin:0,cmt:0", "Would not contribute when the partner loses income."],
  ["Keep my money separate. It's his responsibility.", "fin:0,cmt:0", "Would keep finances separate when the partner loses income."]
]],
F2: ["Your family's finances need a second income.", [
  ["Start working without hesitation.", "fin:2,cmt:2"],
  ["Work, as long as housework is shared fairly.", "fin:2,com:2"],
  ["Work for a short time until things improve.", "fin:1,cmt:1"],
  ["Work only if it's a job I enjoy.", "fin:1"],
  ["I'd prefer not to work outside the home.", "fin:0", "Prefers not to work even when the household needs a second income."]
]],
F3: ["One of you earns noticeably more than the other.", [
  ["Pool everything. It's all ours.", "fin:2,cmt:2"],
  ["Each contributes in proportion to income.", "fin:2,com:2"],
  ["Split shared costs 50/50 regardless of income.", "fin:1"],
  ["Whoever earns more makes the money decisions.", "fin:0,com:0", "Links decision-making power to income."],
  ["Keep finances completely separate.", "fin:0,cmt:1"]
]],
C1: ["Your partner gets a great career opportunity in another city.", [
  ["Move with him.", "cmt:2,loy:2"],
  ["Move, if I can keep working on my own goals there.", "cmt:2,com:2"],
  ["Try a long-distance relationship for a while.", "cmt:1"],
  ["Ask him to turn it down.", "cmt:0,com:0", "Would ask the partner to give up a career opportunity."],
  ["It depends on how it affects my own plans.", "cmt:1,com:1"]
]],
C2: ["How should household responsibilities be divided?", [
  ["Shared equally.", "com:2,cmt:2"],
  ["By who has more time or skill for each task.", "com:2,cmt:1"],
  ["Mostly by whoever earns less.", "com:0", "Assigns housework by income."],
  ["Mostly by the woman.", "com:0", "Expects housework to fall mainly to the woman. Worth discussing expectations."],
  ["Pay for help wherever we can.", "com:1,fin:1"]
]],
C3: ["Your ambitions clash with your partner's. For example, you both get offers in different cities.", [
  ["Take turns: one career leads now, the other next.", "com:2,cmt:2"],
  ["Whichever opportunity is bigger takes priority.", "com:1,cmt:1"],
  ["My ambitions come first.", "cmt:0,com:0", "Puts own ambitions ahead of the partner's."],
  ["I'd give up mine for the relationship.", "cmt:2,com:0", "Would give up own ambitions entirely. Check this won't turn into resentment."],
  ["Find a middle path that works for both, even if it's slower.", "com:2,cmt:2"]
]],
S1: ["How important is physical intimacy in a long-term relationship for you?", [
  ["Very important. It's a key part of feeling close.", "pref:3"],
  ["Important, alongside emotional closeness.", "pref:2"],
  ["Somewhat important.", "pref:1"],
  ["Not very important to me.", "pref:0"],
  ["It changes with different stages of life.", "pref:1.5,sxf:2"]
]],
S2: ["How comfortable are you discussing sexual needs and boundaries with your partner?", [
  ["Very comfortable. I can talk openly.", "sxc:2"],
  ["Comfortable, once there's trust.", "sxc:2"],
  ["It feels awkward, but I'd try.", "sxc:1"],
  ["I'd rather not talk about it.", "sxc:0", "Prefers not to discuss sexual needs or boundaries."]
]],
S3: ["You and your partner want intimacy at different frequencies.", [
  ["Talk openly and find a balance we're both comfortable with.", "sxc:2,sxr:2,sxf:2"],
  ["Accept the difference and focus on other ways of being close.", "sxr:2,sxf:2,sxc:1"],
  ["Go along with it even when I don't want to.", "sxr:0,sxc:0", "Would go along with intimacy when not wanting it. No one owes their partner intimacy; both should feel free to say no."],
  ["Expect him to adjust to what I want.", "sxr:0,sxf:0", "Expects the partner to adjust to their level of desire."],
  ["Avoid the topic and hope it sorts itself out.", "sxc:0,sxf:1"]
]],
S4: ["Physical intimacy has dropped for several months.", [
  ["Talk about what has changed, without blame or pressure.", "sxc:2,sxr:2,sxf:2"],
  ["Focus on emotional closeness and let it return naturally.", "sxr:2,sxf:2,sxc:1"],
  ["Suggest seeing a counsellor or doctor together.", "sxc:2,sxf:2,sxr:2"],
  ["Feel resentful but say nothing.", "sxc:0,sxf:0", "Would hold resentment about intimacy without raising it."],
  ["See it as a sign the relationship is failing.", "sxf:0,cmt:0"]
]],
B1: ["Should partners have complete access to each other's phones?", [
  ["Yes. No secrets at all.", "tru:1,com:1"],
  ["Open if asked, but no routine checking.", "tru:2,com:2"],
  ["Each keeps their privacy. Trust doesn't need checking.", "tru:2"],
  ["Yes, and I'd check his phone regularly.", "tru:0", "Would regularly check the partner's phone."],
  ["My phone stays private, but I'd want access to his.", "tru:0", "Wants access to the partner's phone while keeping their own private."]
]],
B2: ["Your partner says he needs some personal space for a while.", [
  ["Give it gladly and check in gently.", "tru:2,emo:2"],
  ["Give it, but ask what's going on.", "tru:1,com:2,emo:1"],
  ["Feel hurt and keep asking why.", "tru:0,emo:0", "Struggles to give the partner space."],
  ["Assume something is wrong between us.", "tru:0,emo:0"],
  ["Give the same distance back.", "tru:1,emo:0,com:0"]
]]
};
const ORDER = ["L1","E1","F1","S1","C1","B1","L2","E2","S2","F2","C2","L3","E3","S3","B2","F3","E4","C3","S4","L4"];
// Related questions compared for consistency: [a, b, dim, label]
const PAIRS = [
  ["L1","F1","cmt","Staying through money trouble vs. contributing when he loses income"],
  ["L2","L4","loy","Handling outside interest vs. view of emotional cheating"],
  ["E1","E3","com","Anger style vs. raising a problem"],
  ["E2","E4","emo","Apologising vs. accepting criticism"],
  ["S2","S3","sxc","Comfort talking about intimacy vs. handling different desire"],
  ["S3","S4","sxf","Different desire vs. a long dry spell"],
  ["C1","C3","cmt","Relocating for him vs. clashing ambitions"],
  ["B1","B2","tru","Phone access vs. giving personal space"],
  ["F3","C2","com","Unequal earnings vs. dividing housework"]
];
// Cross-answer conflicts / friction: [anyOf A, anyOf B, message]
const RULES = [
  [["L1-a","L1-b","L1-c"],["F1-d","F1-e"],"Says they would stay through a long financial struggle, but would not contribute when he loses income."],
  [["L4-c","L4-d"],["B1-a","B1-d","B1-e"],"Treats emotional cheating lightly, yet wants full access to the partner's phone."],
  [["L4-a"],["L2-c","L2-d","L2-e"],"Calls emotional cheating serious, yet would entertain or keep open outside interest."],
  [["E1-c","E1-e"],["E3-c","E3-d","E3-e"],"Avoids conflict in more than one situation (silence, hints or withdrawal). Problems may build up unspoken."],
  [["E2-d","E2-e"],["E4-c","E4-d","E4-e"],"Finds both apologising and accepting criticism hard. Arguments may stall on ego."],
  [["S2-d"],["S3-a","S4-a","S4-c"],"Prefers not to discuss sexual needs, yet chose to talk things through when desire differs. Check how that conversation would actually start."],
  [["E3-a","E3-b"],["S2-c","S2-d"],"Talks openly about everyday problems but finds intimacy hard to discuss."],
  [["C3-c"],["C1-d","C1-e"],"Prioritises own career in more than one scenario."],
  [["F3-d"],["C2-c","C2-d"],"Links money and roles: income decides power or housework."],
  [["B1-a","B1-d","B1-e"],["B2-c","B2-d"],"Wants full openness and finds the partner's need for space hard. Possible friction around closeness and control."],
  [["L3-d","L3-e"],["L1-d","L1-e","L2-e"],"Relationship may be vulnerable to outside pressure (family, money or other people)."],
  [["F2-e"],["F1-d","F1-e","F3-d"],"Low financial involvement in more than one scenario. Discuss shared money expectations."]
];
module.exports = { CATS, Q, ORDER, PAIRS, RULES };
