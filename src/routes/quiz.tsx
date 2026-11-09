import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Share2, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { addPoints, recordAnswer } from "@/lib/user";
import { createRound, localQuestion, answerPoints, bestScore, type RoundQuestion } from "@/lib/learning";
import { type Difficulty } from "@/lib/education-rules";
import { shareText } from "@/lib/share";
export const Route=createFileRoute("/quiz")({head:()=>({meta:[{title:"Tarixiy kviz — Smart-Sayohat: Ancients Speak"},{name:"description",content:"O‘zbekiston merosi haqida 10 savol, har to‘g‘ri javobga 10 ball. Uch qiyinlik darajasida bilimingizni sinang."},{property:"og:title",content:"Tarixiy kviz — Smart-Sayohat"},{property:"og:description",content:"Tarixiy bilimlaringizni sinang: 10 savol, 100 ball."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}),component:QuizPage});
function QuizPage(){
 const {lang,t}=useT();const [difficulty,setDifficulty]=useState<Difficulty>("easy");const [round,setRound]=useState<RoundQuestion[]>([]);const [index,setIndex]=useState(0);const [picked,setPicked]=useState<number|null>(null);const [score,setScore]=useState(0);const [done,setDone]=useState(false);const [best,setBest]=useState(0);const [share,setShare]=useState("");
 useEffect(()=>{try{setBest(Number(localStorage.getItem("ss_quiz_best"))||0);}catch{}},[]);
 function start(){setRound(createRound(difficulty));setIndex(0);setPicked(null);setScore(0);setDone(false);setShare("");}
 const current=round[index];const q=current ? localQuestion(current.question,lang) : null;
 function pick(option:number){if(picked!==null || !current || done)return;setPicked(option);const correct=option===current.question.correct;setScore(s=>s+answerPoints(correct));if(correct)addPoints(10);recordAnswer(correct);}
 function next(){if(index+1===round.length){setDone(true);const updated=bestScore(best,score);setBest(updated);try{localStorage.setItem("ss_quiz_best",String(updated));}catch{}}else{setIndex(index+1);setPicked(null);}}
 async function shareResult(){try{const result=await shareText(`Smart-Sayohat: Ancients Speak · ${t("quiz")} · ${score}/100\n${window.location.origin}/quiz`);if(result==="copied")setShare(t("copied"));}catch{setShare(t("share_error"));}}
 return <div className="min-h-screen bg-background text-foreground"><main className="mx-auto max-w-3xl px-4 py-10">
 <Button asChild variant="outline"><Link to="/">← {t("home")}</Link></Button>
 <p className="mt-10 text-sm text-gold">✦ {t("quiz")}</p><h1 className="mt-2 font-serif text-3xl font-bold">{t("quiz_title")}</h1><p className="mt-3 text-muted-foreground">{t("quiz_sub")}</p><p className="mt-2 text-sm text-gold">{t("best",{count:best})}</p>
 {!round.length ? <section className="mt-10 border-t border-border py-8"><h2 className="mb-4 font-serif text-xl">{t("difficulty")}</h2><div className="flex flex-wrap gap-3">{(["easy","medium","hard"] as const).map(level=><Button key={level} variant={difficulty===level?"default":"outline"} aria-pressed={difficulty===level} onClick={()=>setDifficulty(level)}>{t(level)}</Button>)}</div><Button onClick={start} className="mt-8"><ArrowRight/>{t("play")}</Button></section> : done ? <section className="mt-10 border-t border-border py-10 text-center"><h2 className="font-serif text-2xl">{t("result")}</h2><p className="my-6 font-serif text-6xl text-gold">{score} / 100</p><div className="flex flex-wrap justify-center gap-3"><Button onClick={start}><RotateCcw/>{t("again")}</Button><Button variant="outline" onClick={()=>{setRound([]);setDone(false);}}>{t("difficulty")}</Button><Button variant="outline" onClick={shareResult}><Share2/>{t("share")}</Button></div><p role="status" className="mt-3 text-sm">{share}</p></section> : current && q ? <section className="mt-8 border-t border-border py-8">
 <div className="flex flex-wrap justify-between gap-2 text-sm text-muted-foreground"><span>{t("question",{current:index+1,total:round.length})}</span><span>{t("score",{count:score})}</span></div><progress aria-label={t("question",{current:index+1,total:round.length})} value={index+(picked!==null?1:0)} max={10} className="mt-3 h-2 w-full"/>
 <h2 className="mt-8 font-serif text-2xl leading-relaxed">{q.prompt}</h2><div className="mt-6 grid gap-3">{current.optionOrder.map((option,position)=><Button key={option} variant="outline" disabled={picked!==null} onClick={()=>pick(option)} className={`h-auto min-h-14 justify-start whitespace-normal px-4 py-4 text-left ${picked!==null && option===current.question.correct ? "border-success bg-success/10 text-foreground" : picked===option ? "border-destructive bg-destructive/10" : ""}`}><span className="mr-3 text-gold">{"ABCD"[position]}</span>{q.options[option]}</Button>)}</div>
 {picked!==null && <div className="mt-6" aria-live="polite"><p className="text-sm font-semibold text-gold">{t("correct")}: {q.options[current.question.correct]}</p><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{q.explanation}</p>{current.question.figureId && <Button asChild variant="link" className="mt-2 whitespace-normal"><Link to="/figures/$id" params={{id:current.question.figureId}}>{t("talk")}</Link></Button>}<Button onClick={next} className="mt-5 w-full"><ArrowRight/>{index+1===round.length?t("result"):t("next")}</Button></div>}
 </section>:null}
 </main></div>;
}
