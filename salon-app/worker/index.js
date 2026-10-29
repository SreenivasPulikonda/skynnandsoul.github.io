import { AppError, assert } from '../src/domain.js';
import { verifyPassword, signSession, readSession, sessionCookie, getCookie } from './security.js';
import { GitHubStore } from './github-store.js';
import { CSP } from './csp.js';
const NO_STORE={'Cache-Control':'no-store, max-age=0','Pragma':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','X-Frame-Options':'DENY','Content-Security-Policy':CSP,'Permissions-Policy':'camera=(), microphone=(), geolocation=()'};
const json=(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{...NO_STORE,'Content-Type':'application/json; charset=utf-8',...extra}});
const safeState=(state,actor)=>{if(actor.role==='owner')return state;return {...state,settings:{...state.settings},audit:[],operations:[]};};
function config(env){for(const k of ['GITHUB_TOKEN','GITHUB_OWNER','GITHUB_REPO','SESSION_SECRET','DATA_KEY','OWNER_PASSWORD_HASH','MANAGER_PASSWORD_HASH'])assert(env[k],`Setup is not complete. Ask the owner to configure the server.`,503);assert(env.LOGIN_LIMITER&&env.WRITE_LIMITER,'Server rate-limit settings are missing.',503);}
async function body(request){assert((request.headers.get('content-type')||'').startsWith('application/json'),'Send JSON data.',415);const n=Number(request.headers.get('content-length')||0);assert(n<2200000,'This upload is too large.',413);const raw=await request.text();assert(raw.length<2200000,'This upload is too large.',413);try{return JSON.parse(raw);}catch{throw new AppError('Invalid request data.');}}
function sameOrigin(request){assert(request.headers.get('origin')===new URL(request.url).origin,'This request did not come from the salon app.',403);assert(request.headers.get('sec-fetch-site')!=='cross-site','Cross-site requests are not allowed.',403);}
export async function handle(request,env,{fetcher=fetch}={}){
 try{const url=new URL(request.url);if(!url.pathname.startsWith('/api/')){if(!['GET','HEAD'].includes(request.method))return json({error:'Method not allowed'},405);const r=await env.ASSETS.fetch(request);const h=new Headers(r.headers);for(const [k,v]of Object.entries(NO_STORE))h.set(k,v);return new Response(r.body,{status:r.status,headers:h});}
 config(env);if(request.method!=='GET')sameOrigin(request);
 if(url.pathname==='/api/login'&&request.method==='POST'){const p=await body(request);assert(['owner','manager'].includes(p.role),'Choose your role.');const ip=request.headers.get('cf-connecting-ip')||'unknown';const a=await env.LOGIN_LIMITER.limit({key:'ip:'+ip});const b=await env.LOGIN_LIMITER.limit({key:'role:'+p.role});assert(a.success&&b.success,'Too many sign-in attempts. Wait one minute and try again.',429);assert(typeof p.password==='string'&&p.password.length>=1&&p.password.length<=256,'Enter your password.',401);const record=p.role==='owner'?env.OWNER_PASSWORD_HASH:env.MANAGER_PASSWORD_HASH;assert(await verifyPassword(p.password,record),'The password is incorrect.',401);const now=Date.now();const user={role:p.role,name:p.role==='owner'?(env.OWNER_NAME||'Salon owner'):(env.MANAGER_NAME||'Salon manager'),iat:now,exp:now+8*60*60*1000,csrf:crypto.randomUUID(),epoch:env.SESSION_EPOCH||'1'};const token=await signSession(user,env.SESSION_SECRET);return json({user:{role:user.role,name:user.name},csrf:user.csrf},200,{'Set-Cookie':sessionCookie(token)});}
 const session=await readSession(getCookie(request),env.SESSION_SECRET,env.SESSION_EPOCH||'1');assert(session,'Please sign in again.',401);
 if(request.method!=='GET')assert(request.headers.get('x-csrf-token')===session.csrf,'Your session changed. Refresh and try again.',403);
 if(url.pathname==='/api/session'&&request.method==='GET')return json({user:{role:session.role,name:session.name},csrf:session.csrf});
 if(url.pathname==='/api/logout'&&request.method==='POST')return json({ok:true},200,{'Set-Cookie':sessionCookie('',0)});
 const store=new GitHubStore(env,fetcher);
 if(url.pathname==='/api/state'&&request.method==='GET'){const {state}=await store.load();return json({state:safeState(state,session),savedAt:state.updatedAt||state.createdAt});}
 if(url.pathname==='/api/action'&&request.method==='POST'){const rate=await env.WRITE_LIMITER.limit({key:session.role});assert(rate.success,'Please wait a moment before saving again.',429);const op=await body(request);const out=await store.mutate(op,session);return json({state:safeState(out.state,session),result:out.result,replayed:out.replayed,savedAt:out.state.updatedAt});}
 if(url.pathname==='/api/backup'&&request.method==='GET'){assert(session.role==='owner','Only the owner can export a full backup.',403);const {state}=await store.load();return json({format:'skynn-soul-backup-v1',exportedAt:new Date().toISOString(),state},200,{'Content-Disposition':'attachment; filename="skynn-soul-backup.json"'});}
 return json({error:'Not found'},404);
 }catch(e){return json({error:e instanceof AppError?e.message:'The request could not be completed. Please retry or contact the owner.'},e instanceof AppError?e.status:500);}
}
export default {fetch:handle};
