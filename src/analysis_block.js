/* ---------- analysis (administrator) ---------- */
const DIMS={fin:"Financial responsibility",emo:"Emotional maturity",ind:"Independent thinking",dec:"Decision-making",cri:"Crisis management",amb:"Career ambition",ada:"Adaptability",com:"Commitment",acc:"Accountability",pra:"Practical intelligence"};
const OBS={
 fin:["Tends to protect financial stability: clears costly debt, sets limits and plans before spending.","Balances money with relationships and goals; some choices accept financial cost for other priorities.","Several choices accept debt, loose lending or delayed money decisions."],
 emo:["Usually pauses, listens and raises issues privately before reacting.","Handles most interpersonal tension calmly, with some direct or avoidant reactions.","Often reacts sharply or avoids emotional conversations."],
 ind:["Forms own view and acts on it, while still communicating with others.","Mixes own judgement with deference depending on the stakes.","Frequently hands major decisions to family, partners or groups."],
 dec:["Defines criteria, sets deadlines and decides rather than drifting.","Decides reasonably, occasionally deferring or splitting the difference.","Often postpones, splits evenly or lets circumstances decide."],
 cri:["Prioritises safety and recovery steps quickly under pressure.","Responds adequately to emergencies, with some less effective first moves.","First reactions in emergencies are often risky or slow."],
 amb:["Willing to invest time and comfort for long-term career growth.","Pursues growth when the cost is manageable.","Tends to choose comfort or stability over growth opportunities."],
 ada:["Finds workable alternatives when plans break.","Adapts in some situations, holds to plans in others.","Prefers keeping things as they are when circumstances change."],
 com:["Keeps promises and works on problems rather than exiting.","Usually honours commitments, but weighs them against other gains.","Leans towards stepping away when commitments become costly."],
 acc:["Owns mistakes and communicates openly about them.","Takes responsibility in most cases, less so in personal conflict.","Several choices avoid owning a mistake or its consequences."],
 pra:["Uses information, comparisons and direct fixes to solve everyday problems.","Practical in most situations, sometimes reactive.","Approaches everyday problems reactively or without weighing options."]
};
const DISCUSS={
 fin:"Ask how they would handle a month where expenses exceed income, and how they decide when to lend money.",
 emo:"Ask about the last argument they had and how it was resolved.",
 ind:"Ask about a major decision they made against others' advice, and one where they deferred.",
 dec:"Ask how they make decisions when two options seem equally good.",
 cri:"Walk through a real emergency they faced and what they did first.",
 amb:"Ask where they want to be in five years and what they are willing to give up for it.",
 ada:"Ask about a time plans fell apart and what they did next.",
 com:"Ask about a commitment they kept when it became inconvenient, and one they left.",
 acc:"Ask about a recent mistake that affected someone else and how they handled it.",
 pra:"Give a household or work problem and ask how they would solve it step by step."
};
const PATTERNS={P:["Deliberate planner","Gathers facts, sets conditions or deadlines, then acts."],S:["Self-reliant","Solves things personally and directly, without involving others."],C:["Consultative","Brings in other people, information or shared decisions."],A:["Accommodating","Puts others' needs or harmony first, sometimes at own cost."],V:["Cautious / deferring","Waits, withdraws or keeps the status quo."],B:["Bold / direct","Acts quickly, confronts, or takes the riskier path."]};

function analyse(ex){
  const K=key(), map=K.k, sel={};
  if(!ex||!/^human-decision-project\/[12]$/.test(ex.schema||"")||!Array.isArray(ex.responses)) throw new Error("This doesn't look like a Human Decision Project response file.");
  let unknown=0;
  ex.responses.forEach(r=>{ if(r.selectedOptionId){ if(map[r.questionId]&&map[r.questionId][r.selectedOptionId]) sel[r.questionId]=r.selectedOptionId; else if(!key().ik[r.questionId]) unknown++; } });
  // per-question normalised value for a dimension (0..1), or null if q doesn't measure it
  const norm=(qid,dim)=>{const opts=map[qid];if(!opts)return null;const vals=Object.values(opts).map(o=>o[0][dim]||0);if(!Object.values(opts).some(o=>dim in o[0]))return null;const mn=Math.min(...vals),mx=Math.max(...vals);if(mx===mn)return null;if(!sel[qid])return undefined;return ((map[qid][sel[qid]][0][dim]||0)-mn)/(mx-mn)};
  const dims={};
  for(const d in DIMS){let sum=0,n=0,cov=0;for(const qid in map){const v=norm(qid,d);if(v===null)continue;cov++;if(v===undefined)continue;sum+=v;n++}dims[d]={score:n?Math.round(sum/n*100):null,n,cov}}
  const pats={P:0,S:0,C:0,A:0,V:0,B:0}; Object.entries(sel).forEach(([q,o])=>pats[map[q][o][1]]++);
  const pairs=K.pairs.map(([a,b,d,label])=>{const va=norm(a,d),vb=norm(b,d);let status="Incomplete",diff=null;if(typeof va==="number"&&typeof vb==="number"){diff=Math.abs(va-vb);status=diff>=0.6?"Inconsistent":diff>=0.34?"Some variation":"Consistent"}return {a,b,d,label,status,diff,oa:sel[a]||null,ob:sel[b]||null}});
  const rules=K.rules.filter(([xs,ys])=>xs.some(x=>Object.values(sel).includes(x))&&ys.some(y=>Object.values(sel).includes(y))).map(r=>({msg:r[2],hit:[...r[0],...r[1]].filter(x=>Object.values(sel).includes(x))}));
  const notes=Object.entries(sel).filter(([q,o])=>map[q][o][2]).map(([q,o])=>({q,o,note:map[q][o][2]}));
  const fast=ex.responses.filter(r=>r.selectedOptionId&&r.secondsOnQuestion>0&&r.secondsOnQuestion<6).map(r=>r.questionId);
  const changed=ex.responses.filter(r=>r.answerChanges>=2).map(r=>r.questionId+" ("+r.answerChanges+"×)");
  const ranked=Object.entries(dims).filter(([,v])=>v.score!==null).sort((x,y)=>y[1].score-x[1].score);
  return {dims,pats,pairs,rules,notes,fast,changed,ranked,unknown,answered:Object.keys(sel).length};
}
function band(s){return s===null?null:s>=67?0:s>=45?1:2}
function bandLabel(s){return ["Strong","Moderate","Discuss"][band(s)]}
function bandColor(s){return ["var(--ok)","var(--accent)","var(--warn)"][band(s)]}

function adminReportInner(ex,A,forFile){
  const c=forFile?{ok:"#2e8a63",ac:"#6a52cf",warn:"#b07a14"}:null;
  const col=s=>forFile?[c.ok,c.ac,c.warn][band(s)]:bandColor(s);
  let h='';
  h+='<section class="rep-sec"><p class="eyebrow">Administrator report · confidential</p><h2 style="margin-top:6px">'+esc(ex.participant&&ex.participant.name||"Participant")+'</h2>';
  h+='<div class="tbl-wrap"><table><tr><th>Assessment ID</th><th>Answered</th><th>Time taken</th><th>Completed</th><th>Submission</th></tr><tr><td class="mono">'+esc(ex.assessmentId)+'</td><td class="mono">'+ex.totals.answered+' / '+ex.totals.questions+'</td><td class="mono">'+fmtDur(ex.timeTakenSeconds)+'</td><td>'+esc(new Date(ex.completedAt).toLocaleString())+'</td><td>'+(ex.submissionType==="manual"?"Manual":"Time expired")+'</td></tr></table></div>';
  if(ex.unansweredQuestionIds.length) h+='<p class="muted m">Unanswered: <span class="mono">'+ex.unansweredQuestionIds.map(esc).join(", ")+'</span></p>';
  if(A.unknown) h+='<p style="color:var(--crit)">'+A.unknown+' response(s) carried option IDs this version does not recognise and were skipped.</p>';
  h+='<p class="disclaimer note">These observations describe choices made in hypothetical situations under time pressure. They are prompts for conversation, not a diagnosis, a personality verdict or a measure of honesty. Read them alongside what you know of the person.</p></section>';

  // categories
  h+='<section class="rep-sec"><h3>Category-wise observations</h3><p class="muted m" style="font-size:.88rem">0–100 relative to the options available in each situation. 50 is the midpoint. Bands: 67+ strong, 45–66 moderate, below 45 worth discussing.</p><div class="dims">';
  for(const d in DIMS){const v=A.dims[d];const s=v.score;
    h+='<div class="dim"><span class="nm">'+DIMS[d]+'</span>'+(forFile?'<div class="bar"><span style="width:'+(s||0)+'%;background:'+col(s)+'"></span></div>':'<div class="meter"><span style="width:'+(s||0)+'%;background:'+(s===null?"var(--line)":col(s))+'"></span></div>')+'<span class="val mono">'+(s===null?"–":s)+'</span>';
    h+='<p class="obs m">'+(s===null?"No responses on this dimension.":'<b style="color:'+col(s)+'">'+bandLabel(s)+'.</b> '+OBS[d][band(s)])+' <span class="mono" style="opacity:.7">('+v.n+' of '+v.cov+' situations)</span></p></div>';}
  h+='</div></section>';

  // patterns
  const tot=Object.values(A.pats).reduce((a,b)=>a+b,0)||1;
  const pr=Object.entries(A.pats).sort((a,b)=>b[1]-a[1]);
  h+='<section class="rep-sec"><h3>Decision-making patterns</h3><div class="dims">';
  pr.forEach(([k,n])=>{h+='<div class="pat"><span><b>'+PATTERNS[k][0]+'</b><br><span class="muted m" style="font-size:.82rem">'+PATTERNS[k][1]+'</span></span>'+(forFile?'<div class="bar"><span style="width:'+(n/tot*100)+'%"></span></div>':'<div class="meter"><span style="width:'+(n/tot*100)+'%;background:var(--accent)"></span></div>')+'<span class="mono">'+n+'</span></div>'});
  h+='</div>';
  const top=pr[0], sec=pr[1];
  if(A.answered){h+='<p>Most frequent approach: <b>'+PATTERNS[top[0]][0].toLowerCase()+'</b> ('+top[1]+' of '+A.answered+')'+(sec[1]>=top[1]-1&&sec[1]>0?', closely followed by <b>'+PATTERNS[sec[0]][0].toLowerCase()+'</b> ('+sec[1]+')':'')+'. '+(top[1]/A.answered>=0.45?"A clear preferred style.":"No single style dominates; approach varies with the situation.")+'</p>'}
  const tm=[];
  if(A.fast.length) tm.push(A.fast.length+' situation(s) answered in under 6 seconds: <span class="mono">'+A.fast.join(", ")+'</span>.');
  if(A.changed.length) tm.push('Answer changed twice or more: <span class="mono">'+A.changed.join(", ")+'</span>.');
  if(ex.timeTakenSeconds<6*60) tm.push('Finished in '+fmtDur(ex.timeTakenSeconds)+', well within the limit; check whether situations were read fully.');
  if(tm.length) h+='<p class="muted m" style="font-size:.9rem">'+tm.join(" ")+'</p>';
  h+='</section>';

  // consistency
  h+='<section class="rep-sec"><h3>Consistency across related scenarios</h3><div class="tbl-wrap"><table><tr><th>Related situations</th><th>Dimension</th><th>Choices</th><th>Result</th></tr>';
  A.pairs.forEach(p=>{const cls=p.status==="Consistent"?"ok":p.status==="Inconsistent"?"crit":p.status==="Some variation"?"warn":"";h+='<tr><td>'+esc(p.label)+'<br><span class="mono muted m" style="font-size:.8rem">'+p.a+' ↔ '+p.b+'</span></td><td>'+DIMS[p.d]+'</td><td class="mono">'+(p.oa||"–")+' · '+(p.ob||"–")+'</td><td>'+(forFile?esc(p.status):'<span class="chip '+cls+'">'+esc(p.status)+'</span>')+'</td></tr>'});
  h+='</table></div></section>';

  // conflicts
  h+='<section class="rep-sec"><h3>Conflicting answers</h3>';
  const incons=A.pairs.filter(p=>p.status==="Inconsistent");
  if(!A.rules.length&&!incons.length) h+='<p class="muted m">No notable conflicts between answers.</p>';
  else{h+='<ul>';A.rules.forEach(r=>h+='<li>'+esc(r.msg)+' <span class="mono muted m" style="font-size:.8rem">['+r.hit.join(", ")+']</span></li>');incons.forEach(p=>h+='<li>'+esc(p.label)+': opposite ends of '+DIMS[p.d].toLowerCase()+' across the two situations. <span class="mono muted m" style="font-size:.8rem">['+p.oa+', '+p.ob+']</span></li>');h+='</ul>'}
  h+='</section>';

  // strengths / weaknesses
  const strengths=A.ranked.filter(([,v])=>v.score>=60).slice(0,3);
  const weak=A.ranked.slice().reverse().filter(([,v])=>v.score<50).slice(0,3);
  h+='<section class="rep-sec"><div class="two"><div class="card"><h3>Possible strengths</h3><ul>'+(strengths.length?strengths.map(([d,v])=>'<li><b>'+DIMS[d]+'</b> ('+v.score+'). '+OBS[d][0]+'</li>').join(""):'<li class="muted m">No dimension stood out clearly. Choices were balanced or mixed.</li>')+'</ul></div>';
  h+='<div class="card"><h3>Potential weaknesses</h3><ul>'+(weak.length?weak.map(([d,v])=>'<li><b>'+DIMS[d]+'</b> ('+v.score+'). '+OBS[d][2]+'</li>').join(""):'<li class="muted m">No dimension fell below the midpoint. Lowest relative area: <b>'+(A.ranked.length?DIMS[A.ranked[A.ranked.length-1][0]]:"–")+'</b>.</li>')+'</ul></div></div></section>';

  // discussion
  const disc=[];
  A.ranked.slice().reverse().filter(([,v])=>v.score<55).slice(0,4).forEach(([d])=>disc.push('<b>'+DIMS[d]+'.</b> '+DISCUSS[d]));
  A.notes.forEach(n=>disc.push('<span class="mono">'+n.o+'</span> · '+esc(n.note)+' <span class="muted m">(“'+esc(byId[n.q].opts.find(o=>o.id===n.o).text)+'”)</span>'));
  if(A.rules.length) disc.push('<b>Conflicting answers above.</b> Ask how they would see each situation if the roles were reversed.');
  if(ex.unansweredQuestionIds.length) disc.push('<b>Unanswered situations</b> (<span class="mono">'+ex.unansweredQuestionIds.join(", ")+'</span>). Ask what they would have chosen.');
  h+='<section class="rep-sec"><h3>Areas requiring real-life discussion</h3>'+(disc.length?'<ul>'+disc.map(x=>'<li>'+x+'</li>').join("")+'</ul>':'<p class="muted m">No specific areas flagged. Use the category observations as general conversation starters.</p>')+'</section>';

  h+=intimacySection(ex,forFile);
  // full responses
  h+='<section class="rep-sec"><details'+(forFile?' open':'')+'><summary>All responses ('+ex.responses.length+')</summary><div class="tbl-wrap" style="margin-top:10px"><table><tr><th>#</th><th>Situation</th><th>Selected</th><th>Time</th></tr>';
  ex.responses.forEach(r=>{const p=r.selectedOptionId&&key().k[r.questionId]&&key().k[r.questionId][r.selectedOptionId];h+='<tr><td class="mono">'+pad(r.n)+'</td><td>'+esc(r.question)+'</td><td>'+(r.selectedOptionId?'<span class="mono">'+esc(r.selectedOptionId)+'</span> · '+esc(r.selectedOptionText)+(p?'<br><span class="muted m" style="font-size:.8rem">'+PATTERNS[p[1]][0]+'</span>':''):'<span class="muted m">Unanswered</span>')+'</td><td class="mono">'+(r.secondsOnQuestion||0)+'s</td></tr>'});
  h+='</table></div></details></section>';
  return h;
}
const IXD={ic:"Communication about intimacy",cr:"Consent & respect for boundaries",fx:"Flexibility with differences"};
const IXOBS={ic:["Comfortable raising and discussing intimacy openly.","Can discuss intimacy with time and trust.","Tends to avoid or hold back discussion about intimacy."],cr:["Consistently respects a partner's no and protects their own limits.","Generally respects boundaries, with some mixed signals.","Some choices press on a partner's refusal or override own limits."],fx:["Willing to find middle ground when needs differ.","Adjusts in some areas, holds firm in others.","Expects the other person to adjust, or resists compromise."]};
function intimacySection(ex,forFile){
  const xr=(ex.responses||[]).filter(r=>key().ik[r.questionId]);
  const m={responses:xr}; let h='<section class="rep-sec"><h3>Intimacy &amp; sexual compatibility</h3>';
  if(!xr.some(r=>r.selectedOptionId)) return h+'<p class="muted m">No intimacy questions were answered. Leaving them unanswered was allowed and says nothing on its own.</p></section>';
  const map=key().ik, sel={}; (m.responses||[]).forEach(r=>{if(r.selectedOptionId&&map[r.questionId]&&map[r.questionId][r.selectedOptionId])sel[r.questionId]=r.selectedOptionId});
  const col=s=>forFile?["#2e8a63","#6a52cf","#b07a14"][band(s)]:bandColor(s);
  h+='<p class="muted m" style="font-size:.88rem">Self-reported preferences of one person. Compatibility depends on how these compare with a partner\'s answers, so read them side by side if both have taken it. Discuss privately and respectfully.</p><div class="dims">';
  for(const d in IXD){let sum=0,n=0,cov=0;for(const q in map){const opts=Object.values(map[q]);if(!opts.some(o=>d in o[0]))continue;const vals=opts.map(o=>o[0][d]||0),mn=Math.min(...vals),mx=Math.max(...vals);if(mx===mn)continue;cov++;if(!sel[q])continue;sum+=((map[q][sel[q]][0][d]||0)-mn)/(mx-mn);n++}
    const sc=n?Math.round(sum/n*100):null;
    h+='<div class="dim"><span class="nm">'+IXD[d]+'</span>'+(forFile?'<div class="bar"><span style="width:'+(sc||0)+'%;background:'+(sc===null?"#ccc":col(sc))+'"></span></div>':'<div class="meter"><span style="width:'+(sc||0)+'%;background:'+(sc===null?"var(--line)":col(sc))+'"></span></div>')+'<span class="val mono">'+(sc===null?"–":sc)+'</span><p class="obs m">'+(sc===null?"No responses.":'<b style="color:'+col(sc)+'">'+bandLabel(sc)+'.</b> '+IXOBS[d][band(sc)])+'</p></div>'}
  h+='</div>';
  const pref=q=>{const r=m.responses.find(x=>x.questionId===q);return r&&r.selectedOptionText?esc(r.selectedOptionText):'<span class="muted m">Not answered</span>'};
  h+='<div class="two"><div class="card"><b>Importance of physical intimacy</b><p style="margin-top:6px">'+pref("X1")+'</p></div><div class="card"><b>Emotional and physical closeness</b><p style="margin-top:6px">'+pref("X6")+'</p></div></div>';
  const notes=Object.entries(sel).filter(([q,o])=>map[q][o][2]).map(([q,o])=>'<li><span class="mono">'+o+'</span> · '+esc(map[q][o][2])+'</li>');
  h+='<div><b>For private discussion</b><ul>'+(notes.length?notes.join(""):'')+'<li>Compare expectations on frequency and importance with the partner\'s answers.</li><li>Ask how each person prefers to raise a need or say no.</li></ul></div>';
  return h+'</section>';
}
