export function deathYear(era: string): number | null {
  if (/asr|century|世纪/i.test(era)) return null;
  const match = era.match(/(?:\d{1,4}|\?)\s*(?:mil\.\s*av\.)?\s*[–—-]\s*(\d{1,4})(.*)$/i);
  if (!match) return null;
  const year=Number(match[1]);
  const suffix=match[2];
  const bce=/mil\.\s*av|e\.a\.|miloddan.*avval/i.test(suffix) || /^e\.a\./i.test(era);
  return bce ? -year : year;
}
export function eligibleEra(era:string){return deathYear(era)!==null;}
export function recentEra(era:string){const year=deathYear(era);return year!==null && year>2010;}
export function roundRobin<T extends {category:string}>(rows:T[]):T[]{const order=["ruler","science","philosophy","writer","spiritual","modern","explorer","uzbek","artist","inventor","jadid"];const groups=new Map<string,T[]>();for(const row of rows){const group=groups.get(row.category)??[];group.push(row);groups.set(row.category,group);}const result:T[]=[];while(result.length<rows.length){for(const key of [...order,...[...groups.keys()].filter(k=>!order.includes(k))]){const row=groups.get(key)?.shift();if(row)result.push(row);}}return result;}
