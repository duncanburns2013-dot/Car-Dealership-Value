import { useState, useEffect } from "react";

const $$ = (n) => Math.round(n).toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});
const $d = (n) => n.toLocaleString("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2});
const pc = (n) => n.toFixed(2)+"%";

function calcPmt(p,r,m){
  if(!r)return p/m;
  const mo=r/100/12;
  return p*(mo*Math.pow(1+mo,m))/(Math.pow(1+mo,m)-1);
}

function Bar({value,max,color,delay=0}){
  const[w,setW]=useState(0);
  useEffect(()=>{const t=setTimeout(()=>setW(Math.min(100,Math.round((value/max)*100))),delay+100);return()=>clearTimeout(t);},[value,max,delay]);
  return(
    <div style={{height:4,background:"var(--surface-alt)",borderRadius:99,overflow:"hidden"}}>
      <div style={{height:"100%",width:w+"%",background:color,borderRadius:99,transition:"width .75s cubic-bezier(.4,0,.2,1)"}}/>
    </div>
  );
}

function Ring({score}){
  const r=36,c=2*Math.PI*r;
  const[off,setOff]=useState(c);
  useEffect(()=>{const t=setTimeout(()=>setOff(c-(score/100)*c),200);return()=>clearTimeout(t);},[score,c]);
  const col=score>=75?"#34d399":score>=50?"#f59e0b":"#f87171";
  const bg=score>=75?"rgba(52,211,153,0.12)":score>=50?"rgba(245,158,11,0.12)":"rgba(248,113,113,0.12)";
  const lbl=score>=75?"Strong deal":score>=50?"Proceed carefully":"Walk away";
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
      <div style={{width:86,height:86,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
        <svg width="86" height="86" style={{position:"absolute",inset:0}}>
          <circle cx="43" cy="43" r={r} fill="none" stroke="var(--border-md)" strokeWidth="6"/>
          <circle cx="43" cy="43" r={r} fill="none" stroke={col} strokeWidth="6"
            strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
            transform="rotate(-90 43 43)" style={{transition:"stroke-dashoffset .9s cubic-bezier(.4,0,.2,1)"}}/>
        </svg>
        <div style={{textAlign:"center",position:"relative"}}>
          <div style={{fontSize:19,fontWeight:600,color:col,lineHeight:1}}>{score}</div>
          <div style={{fontSize:9,color:col,opacity:.7}}>/100</div>
        </div>
      </div>
      <div style={{fontSize:11,fontWeight:500,color:col,letterSpacing:".03em"}}>{lbl}</div>
    </div>
  );
}

function Pill({tone,children}){
  const map={
    red:  ["var(--red-glow)","var(--red-tx)"],
    amber:["var(--amber-glow)","var(--amber-tx)"],
    green:["var(--green-glow)","var(--green-tx)"],
    blue: ["var(--blue-glow)","var(--blue-tx)"],
    gray: ["var(--surface)","var(--tx-2)"],
  };
  const[bg,fg]=map[tone]||map.gray;
  return <span style={{background:bg,color:fg,fontSize:10,fontWeight:500,padding:"2px 8px",borderRadius:99,letterSpacing:".03em",whiteSpace:"nowrap"}}>{children}</span>;
}

function Card({children,accent,style:extra}){
  return(
    <div style={{background:"var(--card-bg)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",borderTop:accent?`2px solid ${accent}`:undefined,padding:"1.1rem 1.25rem",display:"flex",flexDirection:"column",gap:14,...extra}}>
      {children}
    </div>
  );
}

function CardHead({title,subtitle}){
  return(
    <div>
      <p style={{margin:0,fontSize:14,fontWeight:500,color:"var(--tx)"}}>{title}</p>
      {subtitle&&<p style={{margin:"2px 0 0",fontSize:12,color:"var(--tx-2)"}}>{subtitle}</p>}
    </div>
  );
}

function Alert({tone,children}){
  const map={
    red:  ["var(--red-glow)","var(--red-border)","var(--red-tx)"],
    amber:["var(--amber-glow)","var(--amber-border)","var(--amber-tx)"],
    green:["var(--green-glow)","var(--green-border)","var(--green-tx)"],
  };
  const[bg,bd,fg]=map[tone]||map.amber;
  return(
    <div style={{background:bg,border:`1px solid ${bd}`,borderRadius:"var(--radius-md)",padding:"10px 14px"}}>
      <p style={{margin:0,fontSize:13,color:fg,lineHeight:1.6}}>{children}</p>
    </div>
  );
}

function Stat({label,value,sub,tone}){
  const cols={red:"var(--red-tx)",amber:"var(--amber-tx)",green:"var(--green-tx)"};
  return(
    <div style={{background:"var(--surface)",borderRadius:"var(--radius-md)",padding:"12px 14px",border:"1px solid var(--border)"}}>
      <div style={{fontSize:10,color:"var(--tx-2)",letterSpacing:".06em",marginBottom:4,textTransform:"uppercase"}}>{label}</div>
      <div style={{fontSize:22,fontWeight:600,color:cols[tone]||"var(--tx)",fontVariantNumeric:"tabular-nums",lineHeight:1.1}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:"var(--tx-2)",marginTop:3}}>{sub}</div>}
    </div>
  );
}

function Slider({label,min,max,step,value,onChange,display}){
  return(
    <div style={{display:"grid",gridTemplateColumns:"110px 1fr 76px",alignItems:"center",gap:12}}>
      <label style={{fontSize:12,color:"var(--tx-2)"}}>{label}</label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(+e.target.value)}/>
      <div style={{background:"var(--surface)",border:"1px solid var(--border-md)",borderRadius:"var(--radius-md)",padding:"4px 8px",fontSize:12,fontWeight:500,textAlign:"center",color:"var(--amber)",fontFamily:"var(--font-mono)"}}>{display}</div>
    </div>
  );
}

const ADDONS=[
  {id:"ext_warranty",label:"Extended warranty",cost:2800,skip:false,tip:"Can be worth it — but mark-ups are 50–100%. Get the cash price, then compare with third-party providers like Endurance or CARCHEX."},
  {id:"gap",label:"GAP coverage",cost:900,skip:false,tip:"Useful if putting less than 20% down or on a 72–84 month loan. Your own insurer typically sells GAP for ~$30–60/yr — far cheaper."},
  {id:"paint",label:"Paint protection / sealant",cost:1200,skip:true,tip:"Usually a basic sealant worth under $50 in materials. Almost entirely markup."},
  {id:"tire_wheel",label:"Tire & wheel protection",cost:800,skip:true,tip:"Claims are frequently denied. A credit card with roadside assistance often provides equivalent coverage for free."},
  {id:"dent",label:"Dent protection (PDR)",cost:600,skip:true,tip:"Independent PDR techs charge $75–$150 per dent. Far less than the lifetime cost of this plan."},
  {id:"maint",label:"Prepaid maintenance plan",cost:1400,skip:true,tip:"Often non-transferable, locks you into dealer service, and rarely saves money vs. independent shops."},
  {id:"etch",label:"VIN etching",cost:350,skip:true,tip:"DIY kits cost $20. Manufacturers already stamp VINs in multiple locations — the 'theft deterrent' claim is marketing."},
];

const CREDIT_TIERS=[
  {label:"Exceptional",range:"800–850",aprNew:5.2,aprUsed:7.1,color:"#34d399"},
  {label:"Very good",  range:"740–799",aprNew:6.1,aprUsed:8.5,color:"#6ee7b7"},
  {label:"Good",       range:"670–739",aprNew:7.2,aprUsed:10.9,color:"#f59e0b"},
  {label:"Fair",       range:"580–669",aprNew:10.5,aprUsed:14.2,color:"#f87171"},
  {label:"Poor",       range:"300–579",aprNew:15.8,aprUsed:21.4,color:"#ef4444"},
];

const EXPLAINERS=[
  {id:"apr",    pill:["blue","Core concept"],  title:"What is APR — and why 1% matters more than you think",       body:"APR is the true yearly cost of borrowing. On a $41,700 loan over 60 months, a single 1-point rate drop saves over $1,170 — roughly the cost of an extended warranty. Your credit score is the biggest lever. Shop multiple lenders before visiting any dealer.",                                                         s1:["Avg new car loan (2025)","$41,700"],       s2:["1pt APR drop saves","≈ $1,200 over 60 mo"]},
  {id:"terms",  pill:["amber","Watch out"],    title:"Why shorter loan terms almost always win",                    body:"Longer terms lower monthly payments but cost substantially more in total interest — and leave you underwater (owing more than the car is worth) longer. The average new loan term hit 68 months in Q1 2025. Aim for 60 months or less.",                                                                            s1:["Avg new loan term (Q1 2025)","68 months"], s2:["72–84 mo vs 60 mo","Costs significantly more"]},
  {id:"preapp", pill:["green","Power move"],   title:"Get pre-approved before visiting any dealership",            body:"A pre-approval letter from your bank or credit union locks in a rate before you step foot in the dealership. It becomes a negotiating tool — the dealer must beat it to earn your financing business. Credit unions typically offer lower rates than dealer lenders.",                                              s1:["Pre-approval is binding","For the lender"], s2:["You are","Never obligated to use it"]},
  {id:"down",   pill:["blue","Strategy"],      title:"How a bigger down payment changes everything",               body:"A larger down payment lowers the amount financed, reducing both monthly payments and total interest. Lenders see it as commitment and may offer better rates. More importantly, it protects against negative equity. Aim for 10–20% of the vehicle price.",                                                   s1:["Recommended down payment","10–20% of price"],s2:["Helps avoid","Negative equity"]},
  {id:"lease",  pill:["gray","Know the diff"], title:"Financing vs. leasing — what you're actually signing",       body:"With financing, you own the car at the end and build equity. With leasing, you're renting. Monthly payments are lower but you face mileage limits (typically 15,000/yr), wear-and-tear fees, and heavy early termination penalties. Leasing makes sense for business use but rarely builds wealth.",              s1:["New cars leased (2025)","~25%"],            s2:["New cars financed (2025)","~80%"]},
  {id:"equity", pill:["red","Risk"],           title:"Negative equity — owing more than your car is worth",        body:"Cars lose value the moment you drive off the lot. With a long loan or small down payment you can quickly owe more than the car is worth — called being underwater. In Q2 2025, more than 1 in 4 trade-ins carried negative equity. GAP coverage bridges the gap if the car is totaled while you're underwater.", s1:["Trade-ins underwater (Q2 2025)","> 1 in 4"],s2:["Best protection","Short term + 20% down"]},
];

export default function App(){
  const[tab,setTab]=useState(0);
  const[price,setPrice]=useState(32000);
  const[dn,setDn]=useState(3000);
  const[rt,setRt]=useState(7);
  const[tgt,setTgt]=useState(550);
  const[trades,setTrades]=useState([{label:"CarMax",v:""},{label:"Carvana",v:""},{label:"Dealer A",v:""},{label:"Dealer B",v:""}]);
  const[dtrade,setDtrade]=useState("");
  const[addons,setAddons]=useState([]);
  const[adMo,setAdMo]=useState(60);
  const[adRt,setAdRt]=useState(7);
  const[cs,setCs]=useState(720);
  const[openEx,setOpenEx]=useState(null);

  const prin=price-dn;
  const p60=calcPmt(prin,rt,60),p72=calcPmt(prin,rt,72),p84=calcPmt(prin,rt,84);
  const i60=p60*60-prin,i72=p72*72-prin,i84=p84*84-prin;
  const maxP=Math.max(p60,p72,p84);

  let strMo=null;
  for(const m of[60,72,84]){if(calcPmt(prin,rt,m)<=tgt){strMo=m;break;}}
  const strPay=strMo?calcPmt(prin,rt,strMo):null;
  const leg=strPay!=null?Math.max(0,tgt-strPay):0;
  const legLife=leg*(strMo||60);
  const xInt=strMo&&strMo>60?(calcPmt(prin,rt,strMo)*strMo-prin)-i60:0;

  const vTrades=trades.map(o=>parseFloat(o.v)).filter(v=>!isNaN(v)&&v>0);
  const bestT=vTrades.length?Math.max(...vTrades):0;
  const avgT=vTrades.length?vTrades.reduce((a,b)=>a+b,0)/vTrades.length:0;
  const dtV=parseFloat(dtrade);
  const tGap=!isNaN(dtV)&&dtV>0&&bestT>0?bestT-dtV:null;

  const adTotal=addons.reduce((s,id)=>s+(ADDONS.find(a=>a.id===id)?.cost||0),0);
  const adMonthly=adTotal>0?adTotal/adMo:0;
  const adInt=adTotal>0?calcPmt(adTotal,adRt,adMo)*adMo-adTotal:0;
  const badAd=addons.filter(id=>ADDONS.find(a=>a.id===id)?.skip);

  const cTier=CREDIT_TIERS.find(t=>{const[lo,hi]=t.range.split("–").map(Number);return cs>=lo&&cs<=hi;})||CREDIT_TIERS[2];

  let score=100,flags=[];
  if(strMo&&strMo>60){score-=20;flags.push({t:"red",msg:`Loan stretched to ${strMo} months — ${$$(xInt)} more in interest vs 60 months`});}
  if(leg>30){score-=15;flags.push({t:"amber",msg:`${$d(leg)}/mo dealer "leg" — ${$$(legLife)} of room to load add-ons`});}
  if(tGap!==null&&tGap>500){score-=15;flags.push({t:"red",msg:`Trade offer is ${$$(tGap)} below your best outside appraisal`});}
  if(badAd.length>0){score-=badAd.length*8;flags.push({t:"red",msg:`${badAd.length} low-value add-on${badAd.length>1?"s":""} — ${$$(badAd.reduce((s,id)=>s+(ADDONS.find(a=>a.id===id)?.cost||0),0))} in questionable products`});}
  score=Math.max(0,Math.min(100,score));

  const TABS=["Loan stretch","Trade-in","Finance office","Deal score","Learn"];
  const ACCENTS=["#f59e0b","#34d399","#f87171",score>=75?"#34d399":score>=50?"#f59e0b":"#f87171","#a78bfa"];

  return(
    <div style={{paddingBottom:"2rem",fontFamily:"var(--font-sans)"}}>
      <h2 className="sr-only">Car deal analyzer</h2>

      {/* Header */}
      <div style={{paddingTop:"1.5rem",paddingBottom:"1rem",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:16}}>
        <div style={{flex:1}}>
          <p style={{margin:0,fontSize:22,fontWeight:600,color:"var(--tx)",letterSpacing:"-.02em",lineHeight:1.2}}>Car Deal Analyzer</p>
          <p style={{margin:"4px 0 12px",fontSize:13,color:"var(--tx-2)"}}>Know what the dealership knows — before you sign</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {["Focus on out-the-door price","Separate your trade","Pre-approve your own loan"].map((h,i)=><Pill key={i} tone="gray">{h}</Pill>)}
          </div>
        </div>
        <Ring score={score}/>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:"1px solid var(--border)",marginBottom:18,overflowX:"auto",scrollbarWidth:"none"}}>
        {TABS.map((t,i)=>(
          <button key={i} onClick={()=>setTab(i)} style={{
            background:"none",border:"none",
            borderBottom:`2px solid ${i===tab?ACCENTS[i]:"transparent"}`,
            padding:"8px 14px",fontSize:13,
            fontWeight:i===tab?600:400,
            color:i===tab?"var(--tx)":"var(--tx-2)",
            marginBottom:-1,whiteSpace:"nowrap",transition:"color .15s"
          }}>
            {t}
            {i===4&&<span style={{marginLeft:5,fontSize:9,background:"var(--blue-glow)",color:"var(--blue-tx)",padding:"2px 6px",borderRadius:99}}>6</span>}
          </button>
        ))}
      </div>

      {/* ── TAB 0: Loan Stretch ── */}
      {tab===0&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card accent="#f59e0b">
            <CardHead title="Your deal inputs" subtitle="Adjust to match your actual numbers"/>
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              <Slider label="Car price"      min={10000} max={100000} step={500}  value={price} onChange={setPrice} display={$$(price)}/>
              <Slider label="Down payment"   min={0}     max={25000}  step={500}  value={dn}    onChange={setDn}    display={$$(dn)}/>
              <Slider label="Interest rate"  min={1}     max={22}     step={0.25} value={rt}    onChange={setRt}    display={pc(rt)}/>
              <Slider label="Target payment" min={200}   max={1500}   step={25}   value={tgt}   onChange={setTgt}   display={$d(tgt)+"/mo"}/>
            </div>
          </Card>

          <Card>
            <CardHead title="Payment by loan term" subtitle="What the dealer calculates the moment you say a payment number"/>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[{m:60,p:p60,i:i60,label:"60 months"},{m:72,p:p72,i:i72,label:"72 months",warn:true},{m:84,p:p84,i:i84,label:"84 months",danger:true}].map(({m,p,i,label,warn,danger})=>{
                const isS=strMo===m,is60=m===60;
                return(
                  <div key={m} style={{border:`1px solid ${isS?(is60?"var(--green-border)":"var(--amber-border)"):"var(--border)"}`,background:isS?(is60?"var(--green-glow)":"var(--amber-glow)"):"var(--card-bg)",borderRadius:"var(--radius-md)",padding:"12px 14px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <span style={{fontSize:13,fontWeight:500,color:"var(--tx)"}}>{label}</span>
                        {isS&&<Pill tone={is60?"green":"amber"}>{is60?"fits your target":"dealer stretches here"}</Pill>}
                      </div>
                      <span style={{fontSize:18,fontWeight:600,fontVariantNumeric:"tabular-nums",color:danger?"var(--red-tx)":warn?"var(--amber-tx)":"var(--tx)"}}>
                        {$d(p)}<span style={{fontSize:11,fontWeight:400,color:"var(--tx-2)"}}>/mo</span>
                      </span>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10,alignItems:"center"}}>
                      <Bar value={p} max={maxP} color={danger?"#f87171":warn?"#f59e0b":"#34d399"}/>
                      <span style={{fontSize:12,color:"var(--tx-2)",fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap"}}>{$$(i)} interest</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {strMo&&strMo>60&&(
            <Card accent="#f87171">
              <CardHead title={`Hidden dealer room at ${strMo} months`} subtitle="The buffer created by stretching your loan"/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10}}>
                <Stat label="Monthly leg"    value={$d(leg)+"/mo"}  sub="Room to add products"    tone={leg>50?"red":"amber"}/>
                <Stat label="Lifetime leg"   value={$$(legLife)}    sub={`Over ${strMo} months`}  tone="amber"/>
                <Stat label="Extra interest" value={$$(xInt)}       sub="vs 60-month loan"        tone="red"/>
              </div>
              <Alert tone="amber">
                Stretching to {strMo} months created <strong style={{fontWeight:600}}>{$d(leg)}/mo of breathing room</strong> — not for you. The finance office will use it to bump your payment back up with add-ons. <strong style={{fontWeight:600}}>Negotiate the out-the-door price. Never the payment.</strong>
              </Alert>
            </Card>
          )}
          {!strMo&&<Alert tone="green">Even at 84 months the payment exceeds your target. The dealer has no room to stretch — strong position.</Alert>}
          {strMo===60&&<Alert tone="green">Your target works at 60 months — the shortest standard term. The dealer has no incentive to stretch further.</Alert>}
        </div>
      )}

      {/* ── TAB 1: Trade-in ── */}
      {tab===1&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card accent="#34d399">
            <CardHead title="Collect outside appraisals first" subtitle="Do this before visiting any dealership — even from home by phone"/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
              {trades.map((o,i)=>(
                <div key={i}>
                  <label style={{fontSize:11,color:"var(--tx-2)",letterSpacing:".06em",display:"block",marginBottom:5,textTransform:"uppercase"}}>{o.label}</label>
                  <input type="number" placeholder="Enter offer $" value={o.v} onChange={e=>setTrades(p=>p.map((x,j)=>j===i?{...x,v:e.target.value}:x))} style={{width:"100%",boxSizing:"border-box"}}/>
                </div>
              ))}
            </div>
          </Card>

          {bestT>0&&(
            <Card>
              <CardHead title="Appraisal summary"/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:10}}>
                <Stat label="Best offer"       value={$$(bestT)} sub="Your negotiating floor"                          tone="green"/>
                <Stat label="Average offer"    value={$$(avgT)}  sub="Market consensus"/>
                <Stat label="Quotes collected" value={vTrades.length} sub={vTrades.length>=3?"Ideal — use all 4":"Aim for 3–4"} tone={vTrades.length>=3?"green":"amber"}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {trades.map((o,i)=>{const v=parseFloat(o.v);if(isNaN(v)||v<=0)return null;return(
                  <div key={i}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:13,color:"var(--tx-2)"}}>{o.label}</span>
                      <span style={{fontSize:13,fontWeight:500,fontVariantNumeric:"tabular-nums",color:v===bestT?"var(--green-tx)":"var(--tx)"}}>{$$(v)}{v===bestT&&<span style={{marginLeft:6}}><Pill tone="green">best</Pill></span>}</span>
                    </div>
                    <Bar value={v} max={bestT} color={v===bestT?"#34d399":"#60a5fa"} delay={i*60}/>
                  </div>
                );})}
              </div>
            </Card>
          )}

          <Card accent={tGap!==null&&tGap>500?"#f87171":"#34d399"}>
            <CardHead title="Dealer's trade offer" subtitle="Only reveal your trade after the purchase price is locked in writing"/>
            <div>
              <label style={{fontSize:11,color:"var(--tx-2)",letterSpacing:".06em",display:"block",marginBottom:5,textTransform:"uppercase"}}>Dealer offer</label>
              <input type="number" placeholder="Enter offer $" value={dtrade} onChange={e=>setDtrade(e.target.value)} style={{maxWidth:200}}/>
            </div>
            {tGap!==null&&(tGap>500
              ?<Alert tone="red">Dealer is <strong style={{fontWeight:600}}>{$$(tGap)} below</strong> your best appraisal. Show all four written offers — competition raises value when you're selling.</Alert>
              :<Alert tone="green">Within {$$( Math.abs(tGap))} of your best appraisal. Present your competing quotes to push for full market value.</Alert>
            )}
          </Card>

          <Card>
            <CardHead title="Trade-in playbook"/>
            {[
              ["Say you're keeping your car","Don't reveal a trade until the purchase price is agreed and in writing. Every variable the dealer can combine gives them more room to obscure profit."],
              ["Bring 4 written competing offers","CarMax, Carvana, and two local dealers. Four written numbers = real leverage. Competition raises value when you're selling."],
              ["Use your state's tax credit","In most states your trade reduces the taxable purchase amount. On a $30k car with a $15k trade, you only pay tax on $15k — real money."],
            ].map(([h,b],i)=>(
              <div key={i} style={{display:"flex",gap:12}}>
                <div style={{width:22,height:22,minWidth:22,borderRadius:"50%",background:"var(--green-glow)",color:"var(--green-tx)",border:"1px solid var(--green-border)",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>{i+1}</div>
                <div><p style={{margin:0,fontSize:13,fontWeight:500,color:"var(--tx)"}}>{h}</p><p style={{margin:"3px 0 0",fontSize:13,color:"var(--tx-2)",lineHeight:1.5}}>{b}</p></div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── TAB 2: Finance Office ── */}
      {tab===2&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Alert tone="amber">The finance office is a <strong style={{fontWeight:600}}>separate profit center</strong>. Dealers average $2,500–$3,500 per car here. Your guard is down after the price fight — and they know it. Always ask: <em>"What's my base payment with zero add-ons?"</em> first.</Alert>

          <Card accent="#f87171">
            <CardHead title="Select add-ons you're being offered" subtitle="Tap each to see the real cost and verdict"/>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {ADDONS.map(a=>{
                const chk=addons.includes(a.id);
                return(
                  <div key={a.id} onClick={()=>setAddons(p=>chk?p.filter(x=>x!==a.id):[...p,a.id])}
                    style={{border:`1px solid ${chk?(a.skip?"var(--red-border)":"var(--green-border)"):"var(--border)"}`,borderRadius:"var(--radius-md)",padding:"11px 14px",cursor:"pointer",background:chk?(a.skip?"var(--red-glow)":"var(--green-glow)"):"var(--card-bg)",transition:"background .15s,border-color .15s"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:16,height:16,minWidth:16,borderRadius:4,border:`1.5px solid ${chk?(a.skip?"var(--red-tx)":"var(--green-tx)"):"var(--border-md)"}`,background:chk?(a.skip?"var(--red-tx)":"var(--green-tx)"):"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                          {chk&&<svg width="10" height="10" viewBox="0 0 10 10"><polyline points="2,5.5 4.5,8 9,2.5" fill="none" stroke="var(--card-bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <span style={{fontSize:13,fontWeight:500,color:"var(--tx)"}}>{a.label}</span>
                        <Pill tone={a.skip?"red":"green"}>{a.skip?"usually skip":"can be worth it"}</Pill>
                      </div>
                      <span style={{fontSize:14,fontWeight:600,fontVariantNumeric:"tabular-nums",color:"var(--tx)"}}>{$$(a.cost)}</span>
                    </div>
                    {chk&&<p style={{margin:"8px 0 0 24px",fontSize:12,color:a.skip?"var(--red-tx)":"var(--green-tx)",lineHeight:1.55}}>{a.tip}</p>}
                  </div>
                );
              })}
            </div>
          </Card>

          {addons.length>0&&(
            <>
              <Card>
                <CardHead title="Loan settings for this estimate"/>
                <Slider label="Loan term"     min={24} max={84} step={12}   value={adMo} onChange={setAdMo} display={`${adMo} mo`}/>
                <Slider label="Interest rate" min={1}  max={22} step={0.25} value={adRt} onChange={setAdRt} display={pc(adRt)}/>
              </Card>
              <Card accent="#f87171">
                <CardHead title="True cost of selected add-ons" subtitle="The finance office only quotes monthly — never the real number"/>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(115px,1fr))",gap:10}}>
                  <Stat label="Sticker total"      value={$$(adTotal)}                sub="Combined list price"      tone="red"/>
                  <Stat label="Added to payment"   value={$d(adMonthly)+"/mo"}        sub="Monthly impact"          tone="amber"/>
                  <Stat label="Interest on add-ons"value={$$(adInt)}                  sub="You're financing them too"tone="red"/>
                  <Stat label="All-in real cost"   value={$$(adTotal+adInt)}           sub="Over full loan term"     tone="red"/>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {addons.map(id=>{
                    const a=ADDONS.find(x=>x.id===id);
                    const ai=calcPmt(a.cost,adRt,adMo)*adMo-a.cost;
                    return(
                      <div key={id}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                          <span style={{fontSize:13,color:"var(--tx-2)"}}>{a.label}</span>
                          <span style={{fontSize:13,fontWeight:500,fontVariantNumeric:"tabular-nums",color:a.skip?"var(--red-tx)":"var(--tx)"}}>{$$(a.cost+ai)} <span style={{fontSize:11,fontWeight:400,color:"var(--tx-2)"}}>({$$(a.cost)} + {$$(ai)} interest)</span></span>
                        </div>
                        <Bar value={a.cost+ai} max={adTotal+adInt} color={a.skip?"#f87171":"#34d399"}/>
                      </div>
                    );
                  })}
                </div>
                <Alert tone="amber">Two legally required disclosures: <strong style={{fontWeight:600}}>"What is the cash price of this today?"</strong> and <strong style={{fontWeight:600}}>"What is my base payment with zero add-ons?"</strong></Alert>
              </Card>
            </>
          )}
        </div>
      )}

      {/* ── TAB 3: Deal Score ── */}
      {tab===3&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <CardHead title="Your deal score" subtitle="Updates live as you fill in the other sections"/>
            <div style={{display:"flex",justifyContent:"center",padding:"1rem 0"}}><Ring score={score}/></div>
            {flags.length===0
              ?<Alert tone="green">No red flags detected. Fill in your deal details across the other tabs for a full analysis.</Alert>
              :<div style={{display:"flex",flexDirection:"column",gap:8}}>
                {flags.map((f,i)=>(
                  <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",background:f.t==="red"?"var(--red-glow)":"var(--amber-glow)",border:`1px solid ${f.t==="red"?"var(--red-border)":"var(--amber-border)"}`,borderRadius:"var(--radius-md)",padding:"10px 12px"}}>
                    <Pill tone={f.t}>{f.t==="red"?"red flag":"caution"}</Pill>
                    <p style={{margin:0,fontSize:13,color:f.t==="red"?"var(--red-tx)":"var(--amber-tx)",lineHeight:1.5}}>{f.msg}</p>
                  </div>
                ))}
              </div>
            }
          </Card>

          <Card accent="#60a5fa">
            <CardHead title="Credit score and APR" subtitle="See how your score affects the rate you'll be offered"/>
            <Slider label="Credit score" min={300} max={850} step={10} value={cs} onChange={setCs} display={cs}/>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {CREDIT_TIERS.map((t,i)=>{
                const act=t===cTier;
                const bars=[100,83,63,42,20][i];
                return(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"90px 1fr 80px 80px",gap:10,alignItems:"center",padding:"7px 10px",borderRadius:"var(--radius-md)",background:act?`${t.color}15`:"transparent",border:act?`1px solid ${t.color}40`:"1px solid transparent"}}>
                    <span style={{fontSize:12,fontWeight:act?600:400,color:act?t.color:"var(--tx-2)"}}>{t.label}</span>
                    <div style={{height:4,background:"var(--surface-alt)",borderRadius:99}}><div style={{height:"100%",width:bars+"%",background:t.color,borderRadius:99}}/></div>
                    <span style={{fontSize:12,textAlign:"right",fontVariantNumeric:"tabular-nums",color:act?t.color:"var(--tx-2)"}}>{pc(t.aprNew)} new</span>
                    <span style={{fontSize:12,textAlign:"right",fontVariantNumeric:"tabular-nums",color:act?t.color:"var(--tx-2)"}}>{pc(t.aprUsed)} used</span>
                  </div>
                );
              })}
            </div>
            <Alert tone={cTier.label==="Exceptional"||cTier.label==="Very good"?"green":cTier.label==="Good"?"amber":"red"}>
              At {cs} ({cTier.label}), expect roughly <strong style={{fontWeight:600}}>{pc(cTier.aprNew)} APR on a new car</strong> and {pc(cTier.aprUsed)} on used. Get pre-approved at your bank or credit union first — then challenge the dealer to beat it.
            </Alert>
          </Card>

          <Card>
            <CardHead title="The five power moves" subtitle="From a 26-year dealership veteran"/>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[
                {done:false,title:"Never give a monthly payment target",detail:"Say 'I'm focused on out-the-door price' every single time they ask. A payment number gives them room to build profit."},
                {done:tGap!==null&&tGap<=500,title:"Negotiate the trade separately",detail:"Lock the purchase price in writing first. Then reveal your trade with 4 competing written appraisals."},
                {done:badAd.length===0&&addons.length>0,title:"Decline low-value finance office add-ons",detail:"Ask for your base payment first. Only accept products you researched before walking in."},
                {done:false,title:"Recognize the exhaustion tactic",detail:"They wait for you to get worn down. 'I need to think about it' + standing up instantly shifts the room."},
                {done:false,title:"Use silence as a weapon",detail:"After any offer, look at the numbers and slowly shake your head. Say nothing. First person to talk loses."},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:12,padding:"10px 12px",background:item.done?"var(--green-glow)":"var(--surface)",borderRadius:"var(--radius-md)",border:`1px solid ${item.done?"var(--green-border)":"var(--border)"}`}}>
                  <div style={{width:22,height:22,minWidth:22,borderRadius:"50%",background:item.done?"var(--green-tx)":"var(--surface-alt)",border:`1.5px solid ${item.done?"var(--green-tx)":"var(--border-md)"}`,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>
                    {item.done
                      ?<svg width="12" height="12" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" fill="none" stroke="var(--card-bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      :<span style={{fontSize:10,fontWeight:600,color:"var(--tx-2)"}}>{i+1}</span>}
                  </div>
                  <div>
                    <p style={{margin:0,fontSize:13,fontWeight:500,color:item.done?"var(--green-tx)":"var(--tx)"}}>{item.title}</p>
                    <p style={{margin:"3px 0 0",fontSize:12,color:"var(--tx-2)",lineHeight:1.5}}>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB 4: Learn ── */}
      {tab===4&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:12}}>
            {EXPLAINERS.map(e=>{
              const isOpen=openEx===e.id;
              const ac=e.pill[0]==="red"?"#f87171":e.pill[0]==="amber"?"#f59e0b":e.pill[0]==="green"?"#34d399":e.pill[0]==="blue"?"#60a5fa":"#6b6f7e";
              return(
                <div key={e.id} onClick={()=>setOpenEx(isOpen?null:e.id)}
                  style={{background:"var(--card-bg)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",borderTop:`2px solid ${ac}`,padding:"1.1rem 1.25rem",cursor:"pointer"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <Pill tone={e.pill[0]}>{e.pill[1]}</Pill>
                    <svg width="14" height="14" viewBox="0 0 14 14" style={{flexShrink:0,transform:isOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform .25s"}}>
                      <polyline points="3,4.5 7,9 11,4.5" fill="none" stroke="var(--tx-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p style={{margin:"0 0 6px",fontSize:14,fontWeight:500,lineHeight:1.4,color:"var(--tx)"}}>{e.title}</p>
                  {!isOpen&&<p style={{margin:0,fontSize:13,color:"var(--tx-2)",lineHeight:1.5,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{e.body}</p>}
                  {isOpen&&(
                    <>
                      <p style={{margin:"8px 0 14px",fontSize:13,color:"var(--tx-2)",lineHeight:1.65}}>{e.body}</p>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                        {[e.s1,e.s2].map(([label,value],i)=>(
                          <div key={i} style={{background:"var(--surface)",borderRadius:"var(--radius-md)",padding:"10px 12px",border:"1px solid var(--border)"}}>
                            <div style={{fontSize:10,color:"var(--tx-2)",letterSpacing:".05em",marginBottom:4,textTransform:"uppercase"}}>{label}</div>
                            <div style={{fontSize:15,fontWeight:600,color:"var(--tx)",fontVariantNumeric:"tabular-nums"}}>{value}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <Card accent="#a78bfa">
            <CardHead title="APR savings by credit tier" subtitle="$41,700 loan · 60 months · right column = extra vs exceptional credit"/>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {CREDIT_TIERS.map((t,i)=>{
                const loan=41700,monthly=calcPmt(loan,t.aprNew,60),totalInt=monthly*60-loan;
                const bestInt=calcPmt(loan,CREDIT_TIERS[0].aprNew,60)*60-loan;
                const extra=totalInt-bestInt;
                const maxInt=calcPmt(loan,CREDIT_TIERS[4].aprNew,60)*60-loan;
                return(
                  <div key={i}>
                    <div style={{display:"grid",gridTemplateColumns:"90px 1fr 85px 80px",gap:10,alignItems:"center",marginBottom:5}}>
                      <span style={{fontSize:12,color:"var(--tx-2)"}}>{t.label}</span>
                      <span style={{fontSize:11,color:"var(--tx-3)"}}>{t.range}</span>
                      <span style={{fontSize:13,fontWeight:500,textAlign:"right",fontVariantNumeric:"tabular-nums",color:"var(--tx)"}}>{$d(monthly)}/mo</span>
                      <span style={{fontSize:12,textAlign:"right",fontVariantNumeric:"tabular-nums",color:i===0?"var(--green-tx)":"var(--red-tx)"}}>{i===0?"baseline":"+"+$$(extra)}</span>
                    </div>
                    <Bar value={totalInt} max={maxInt} color={t.color} delay={i*70}/>
                  </div>
                );
              })}
              <p style={{margin:"4px 0 0",fontSize:11,color:"var(--tx-3)"}}>Based on 2025 average rate estimates per credit tier. Actual rates vary by lender.</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
