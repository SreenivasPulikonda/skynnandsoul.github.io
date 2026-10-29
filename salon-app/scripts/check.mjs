import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {CSP} from '../worker/csp.js';
for(const file of ['public/index.html','dist/Skynn-Soul-Interactive-Demo.html']){const html=await readFile(file,'utf8');assert.ok(html.startsWith('<!doctype html>'));const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);assert.ok(!script.includes('__DEMO__'));assert.ok(!/<script[^>]+src=/.test(html));if(file.startsWith('public')){const hash=createHash('sha256').update(script).digest('base64');assert.ok(CSP.includes('sha256-'+hash),'CSP must match the actual built JavaScript');assert.ok(script.includes('const DEMO=false'));assert.ok(!script.includes('function demoState()'));}else assert.ok(script.includes('const DEMO=true'));}
const ui=await readFile('src/ui.js','utf8');assert.ok(ui.includes('data-action="nav" data-target="${id}"'));assert.ok(ui.includes("el.id==='list-search'"));
console.log('Built scripts parse, CSP matches, production excludes seed data, and both HTML files are self-contained.');
