/** (جديد v3) جلسات دخول بتوكن (مفيش كلمة سر بتتخزن في المتصفح) · كوبونات من ورقة CouponDefs (إدارة من الداشبورد + تاريخ انتهاء + حد استخدام + إحصائيات) · تأكيد استلام التحويل · تقدير وقت الوصول · نسخ احتياطي يومي (شغّل setupBackup مرة واحدة) · تحقق من الأسعار والخصومات على السيرفر.
 *  (قديم) إيقاف الأصناف اللي نفدت: ورقة Soldout بتتعمل لوحدها — بتتحكم فيها من الداشبورد (تبويب الأصناف).
 *  بعد التعديل: Deploy ▸ Manage deployments ▸ Edit ▸ New version.
 *  Red Roosters — كوبون أول طلب + نقاط الولاء + حفظ الأوردرات وتتبعها + داشبورد (Google Sheets)
 *  الإعداد: الصق الكود ▸ غيّر ADMIN_PIN ▸ Deploy ▸ New deployment ▸ Web app (Execute as: Me / Who has access: Anyone)
 *  وكل ما تعدّل الكود اعمل Deploy ▸ Manage deployments ▸ Edit ▸ New version (نفس الرابط).
 *  ورقة Tickets بتتعمل لوحدها وفيها كل الأوردرات. تأكيد النقاط بقى أوتوماتيك لما الداشبورد يخلّي الأوردر "تم التسليم". */
var MANAGER_USER = 'manager';  // اسم دخول المدير
var ADMIN_PIN = PropertiesService.getScriptProperties().getProperty('ADMIN_PIN') || '';  // ✅ كلمة سر المدير بتتخزن في Project Settings ▸ Script properties (الاسم ADMIN_PIN) — مش في الكود. لو فاضية دخول المدير بيتقفل.      // ⚠️ كلمة سر المدير — غيّرها قبل الرفع. (المدير بيعمل حسابات الموظفين من الداشبورد، وبتتخزن في ورقة Staff بكلمات سر مشفّرة)
var EARN_PER_EGP = 0.5;     // 50% من إجمالي الطلب نقاط (طلب 1000 ج = 500 نقطة)
var POINTS_PER_EGP = 10;   // 10 نقطة = 1 جنيه خصم
var STEP = 2000;            // التبديل بمضاعفات 2000 نقطة (2000 = 200 ج)
var STATUSES = ['new','confirmed','preparing','out','delivered','cancelled'];
var TK_HEAD = ['orderId','time','name','phone','phone2','type','address','items','subtotal','discount','coupon','fee','total','payment','notes','status','updated','history','reason','log','payref','paid'];

var HOURS_ON=true;   // ⚠️ false = وقف مواعيد العمل (للتجربة). رجّعه true بعد التجربة
var OPEN_AT='11:00', CLOSE_AT='05:05';   // مواعيد العمل بتوقيت القاهرة (الإغلاق 5:00 + 5 دقايق سماح)
function open_(){if(!HOURS_ON)return true;var n=Utilities.formatDate(new Date(),'Africa/Cairo','HH:mm'),o=OPEN_AT,c=CLOSE_AT;return o<=c?(n>=o&&n<c):(n>=o||n<c);}
function norm_(p){p=String(p||'').replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/\D/g,'').replace(/^(0020|20)/,'0');return p.slice(-11);}
function sh_(n,h){var ss=SpreadsheetApp.getActiveSpreadsheet(),s=ss.getSheetByName(n);if(!s){s=ss.insertSheet(n);s.appendRow(h);}return s;}
function out_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
function rows_(s){return s.getDataRange().getValues().slice(1);}
/* ── الأصناف اللي نفدت (ورقة Soldout) ── */
function nm_(s){return String(s==null?'':s).replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).toLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim();}
function soSh_(){return sh_('Soldout',['name','by','time']);}
function soRows_(){var c=CacheService.getScriptCache(),j=c.get('so_v1');if(j){try{return JSON.parse(j);}catch(_){}}
  var l=rows_(soSh_()).filter(function(r){return r[0];}).map(function(r){return {name:String(r[0]),by:String(r[1]||''),time:r[2]?new Date(r[2]).getTime():0};});
  c.put('so_v1',JSON.stringify(l),120);return l;}
/* بيرجّع أسماء الأصناف (أو الاختيارات جوه العروض) اللي موقوفة ومطلوبة في الأوردر */
function soBad_(items){var m={};soRows_().forEach(function(x){m[nm_(x.name)]=1;});var bad=[];if(!Object.keys(m).length)return bad;
  items.forEach(function(i){var n=String(i.n||''),b=n.replace(/\s*\(.*\)\s*$/,''),hit=(m[nm_(n)]||m[nm_(b)])?n:'';
    (i.o||[]).forEach(function(x){var o=String(x).replace(/^➕\s*/,'').replace(/\s*\(\+\d+\)\s*$/,'').replace(/^[^:]*:\s*/,'');if(!hit&&m[nm_(o)])hit=o;});
    if(hit&&bad.indexOf(hit)<0)bad.push(hit);});
  return bad;}
function lastRows_(s,n){var last=s.getLastRow();if(last<2)return [];var st=Math.max(2,last-n+1);return s.getRange(st,1,last-st+1,s.getLastColumn()).getValues();}
function used_(key){var s=sh_('Coupons',['code','phone','time','key']);return rows_(s).some(function(r){return String(r[3])===key;});}
function balance_(phone){
  var ok=0,pend=0,spent=0;
  rows_(sh_('Orders',['time','orderId','phone','total','points','confirmed'])).forEach(function(r){ if(norm_(r[2])!==phone)return; if(r[5]===true)ok+=+r[4]; else pend+=+r[4]; });
  rows_(sh_('Redeem',['time','phone','points','value','code','used'])).forEach(function(r){ if(norm_(r[1])===phone)spent+=+r[2]; });
  return {points:ok-spent,pending:pend};
}

/* ── الأوردرات (Tickets) ── */
function tk_(){var s=sh_('Tickets',TK_HEAD);if(s.getLastColumn()<22||s.getRange(1,19).getValue()!=='reason'||s.getRange(1,20).getValue()!=='log'||s.getRange(1,21).getValue()!=='payref'||s.getRange(1,22).getValue()!=='paid')s.getRange(1,19,1,4).setValues([['reason','log','payref','paid']]);return s;}
function safe_(v,n){v=String(v==null?'':v).slice(0,n||300);return /^[=+\-@]/.test(v)?"'"+v:v;}   // يمنع حقن المعادلات من بيانات العميل
function tkObj_(r){var it=[];try{it=JSON.parse(r[7]||'[]');}catch(_){}
  return {id:String(r[0]),time:new Date(r[1]).getTime(),name:String(r[2]),phone:norm_(r[3]),phone2:r[4]?norm_(r[4]):'',type:String(r[5]),address:String(r[6]),items:it,
    subtotal:+r[8]||0,discount:+r[9]||0,coupon:String(r[10]||''),fee:+r[11]||0,total:+r[12]||0,payment:String(r[13]),notes:String(r[14]||''),
    status:String(r[15]),updated:new Date(r[16]).getTime(),history:String(r[17]||''),reason:String(r[18]||''),log:String(r[19]||''),payref:String(r[20]||''),paid:r[21]===true||String(r[21]).toLowerCase()==='true'};}
/* ── الحسابات: المدير (من الكود) + موظفين (ورقة Staff) ── */
function hash_(salt,pass){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,salt+'|'+pass).map(function(x){return ('0'+(x&255).toString(16)).slice(-2);}).join('');}
function staffSh_(){var ss=SpreadsheetApp.getActiveSpreadsheet(),s=ss.getSheetByName('Staff');
  if(!s){s=ss.insertSheet('Staff');s.getRange('A:D').setNumberFormat('@');s.appendRow(['username','salt','hash','name','active','created']);}return s;}
function staffMap_(){var c=CacheService.getScriptCache(),j=c.get('staff_v1');if(j){try{return JSON.parse(j);}catch(_){}}
  var m={};rows_(staffSh_()).forEach(function(r){var u=String(r[0]).toLowerCase();if(u)m[u]={salt:String(r[1]),hash:String(r[2]),name:String(r[3]||u),active:r[4]===true||String(r[4]).toLowerCase()==='true'};});
  c.put('staff_v1',JSON.stringify(m),300);return m;}
/* ── أدوات أمان ── */
function eq_(a,b){a=String(a);b=String(b);var r=a.length^b.length,n=Math.max(a.length,b.length);for(var i=0;i<n;i++)r|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return r===0;}   // مقارنة بزمن ثابت
function rl_(key,max,sec){var c=CacheService.getScriptCache(),n=+(c.get(key)||0);if(n>=max)return false;c.put(key,String(n+1),sec);return true;}   // حد معدّل بسيط
function bool_(v){return v===true||String(v).toLowerCase()==='true';}
function ymd_(v){if(v===''||v==null)return '';if(Object.prototype.toString.call(v)==='[object Date]')return Utilities.formatDate(v,'Africa/Cairo','yyyy-MM-dd');var x=String(v).trim();return /^\d{4}-\d{2}-\d{2}$/.test(x)?x:'';}
/* ── جلسات الداشبورد: التوكن بيتخزن مشفّر (SHA-256) في ورقة Sessions، والمتصفح مابيحتفظش بكلمة السر ── */
function sessSh_(){return sh_('Sessions',['hash','user','role','name','exp']);}
function login_(b){var au=auth_(b.user,b.pass);if(au.err)return au;
  var tok=Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,''),ttl=b.remember?30*864e5:12*36e5,exp=Date.now()+ttl,h=hash_('tok',tok),s=sessSh_();
  var v=s.getDataRange().getValues();for(var i=v.length-1;i>=1;i--)if(+v[i][4]<Date.now())s.deleteRow(i+1);   // تنضيف الجلسات المنتهية
  s.appendRow([h,au.user,au.role,au.name,exp]);
  CacheService.getScriptCache().put('ses_'+h,JSON.stringify({user:au.user,role:au.role,name:au.name,exp:exp}),Math.min(21600,Math.floor(ttl/1000)));
  return {role:au.role,user:au.user,name:au.name,token:tok,exp:exp};}
function sess_(user,token){var h=hash_('tok',String(token)),c=CacheService.getScriptCache(),j=c.get('ses_'+h),o=null;
  if(j){try{o=JSON.parse(j);}catch(_){}}
  if(!o){var v=sessSh_().getDataRange().getValues();for(var i=1;i<v.length;i++)if(String(v[i][0])===h){o={user:String(v[i][1]),role:String(v[i][2]),name:String(v[i][3]),exp:+v[i][4]};break;}
    if(o&&o.exp>Date.now())c.put('ses_'+h,JSON.stringify(o),Math.min(21600,Math.floor((o.exp-Date.now())/1000)));}
  if(!o||o.exp<Date.now()||o.user!==String(user||'').toLowerCase().trim())return {err:'bad_token'};
  if(o.role==='staff'){var m=staffMap_()[o.user];if(!m||!m.active)return {err:'disabled'};o.name=m.name;}   // الموظف المتوقّف بيتفصل فورًا
  return {role:o.role,user:o.user,name:o.name};}
function logout_(b){var h=hash_('tok',String(b.token||'')),s=sessSh_(),v=s.getDataRange().getValues();CacheService.getScriptCache().remove('ses_'+h);
  for(var i=v.length-1;i>=1;i--)if(String(v[i][0])===h)s.deleteRow(i+1);}
function authAny_(b){return b.token?sess_(b.user,b.token):authAny_(b);}

/* ── الكوبونات (ورقة CouponDefs): بتتدار من الداشبورد، والسيرفر هو المرجع في الصلاحية والخصم ── */
var CD_HEAD=['code','type','value','min','firstOrderOnly','active','expires','maxUses','hidden','label','created'];
function cdSh_(){var ss=SpreadsheetApp.getActiveSpreadsheet(),s=ss.getSheetByName('CouponDefs');
  if(!s){s=ss.insertSheet('CouponDefs');s.appendRow(CD_HEAD);s.getRange('A:A').setNumberFormat('@');s.getRange('G:G').setNumberFormat('@');
    s.appendRow(['RED20','percent',20,0,true,true,'',0,false,'خصم 20% لأول طلب',new Date()]);
    s.appendRow(['WELCOME','fixed',20,150,true,true,'',0,true,'',new Date()]);}
  return s;}
function cdMap_(){var c=CacheService.getScriptCache(),j=c.get('cd_v1');if(j){try{return JSON.parse(j);}catch(_){}}
  var m={};rows_(cdSh_()).forEach(function(r){var code=String(r[0]).toUpperCase().trim();if(!code)return;var ex=ymd_(r[6]);
    m[code]={code:code,type:String(r[1])==='percent'?'percent':'fixed',value:+r[2]||0,min:+r[3]||0,first:bool_(r[4]),active:bool_(r[5]),exp:ex,
      expires:ex?Utilities.parseDate(ex+' 23:59:59','Africa/Cairo','yyyy-MM-dd HH:mm:ss').getTime():0,maxUses:+r[7]||0,hidden:bool_(r[8]),label:String(r[9]||'')};});
  c.put('cd_v1',JSON.stringify(m),60);return m;}
function cdUsesAll_(fresh){var c=CacheService.getScriptCache(),j=fresh?null:c.get('cdu_v1');if(j){try{return JSON.parse(j);}catch(_){}}
  var t=tk_(),n=t.getLastRow(),m={};
  if(n>=2){var cp=t.getRange(2,11,n-1,1).getValues(),st=t.getRange(2,16,n-1,1).getValues();
    for(var i=0;i<cp.length;i++){var k=String(cp[i][0]).toUpperCase();if(k&&String(st[i][0])!=='cancelled')m[k]=(m[k]||0)+1;}}
  c.put('cdu_v1',JSON.stringify(m),60);return m;}
function cdCheck_(d,sub,fresh){if(!d||!d.active)return 'coupon_invalid';if(d.expires&&d.expires<Date.now())return 'coupon_expired';
  if(d.maxUses&&(cdUsesAll_(fresh)[d.code]||0)>=d.maxUses)return 'coupon_limit';if(d.min&&sub<d.min)return 'coupon_min';return '';}
function cdDisc_(d,sub){var v=d.type==='percent'?Math.round(sub*d.value/100):d.value;return Math.min(v,sub);}
function cdPub_(d){return {code:d.code,type:d.type,value:d.value,min:d.min,firstOrderOnly:d.first,expires:d.exp,label:d.label,hidden:d.hidden};}
/* إحصائيات الكوبونات: الاستخدام + تكلفة الخصم + مين رجع يطلب تاني من غير الكود ده */
function cdStats_(){var t=tk_(),n=t.getLastRow(),rows=n>=2?t.getRange(Math.max(2,n-4999),1,Math.min(n-1,5000),t.getLastColumn()).getValues():[];
  var ok=rows.map(tkObj_).filter(function(o){return o.status!=='cancelled';}),byPh={};
  ok.forEach(function(o){(byPh[o.phone]=byPh[o.phone]||[]).push(o);});
  var plain=ok.filter(function(o){return !o.coupon;}),aovPlain=plain.length?plain.reduce(function(s,o){return s+o.total;},0)/plain.length:0,st={};
  ok.forEach(function(o){if(!o.coupon||/^RR-/.test(o.coupon))return;
    var s=st[o.coupon]=st[o.coupon]||{code:o.coupon,uses:0,discount:0,revenue:0,phones:{},ret:{}};
    s.uses++;s.discount+=o.discount;s.revenue+=o.total;s.phones[o.phone]=1;
    if((byPh[o.phone]||[]).some(function(x){return x.time>o.time&&x.coupon!==o.coupon;}))s.ret[o.phone]=1;});
  return {aovPlain:Math.round(aovPlain),stats:Object.keys(st).map(function(k){var s=st[k],cu=Object.keys(s.phones).length,rt=Object.keys(s.ret).length;
    return {code:k,uses:s.uses,discount:Math.round(s.discount),revenue:Math.round(s.revenue),customers:cu,returned:rt,returnRate:cu?rt/cu:0,aov:s.uses?Math.round(s.revenue/s.uses):0};})};}
/* ── تقدير وقت الوصول من الطلبات اللي اتسلّمت فعلًا (آخر ٢١ يوم، النسبة ٧٠٪ عشان التقدير متفائلش) ── */
function eta_(){var c=CacheService.getScriptCache(),j=c.get('eta_v1');if(j){try{return JSON.parse(j);}catch(_){}}
  var by={delivery:[],pickup:[]},lim=Date.now()-21*864e5;
  lastRows_(tk_(),1500).forEach(function(r){if(String(r[15])!=='delivered')return;var t0=new Date(r[1]).getTime();if(t0<lim)return;var dt=0;
    String(r[17]||'').split(';').forEach(function(p){var a=p.split('@');if(a[0]==='delivered'&&a[1])dt=+a[1];});
    var m=(dt-t0)/60000;if(m>=5&&m<=180)by[String(r[5])==='pickup'?'pickup':'delivery'].push(m);});
  function pc(a){if(a.length<5)return null;a.sort(function(x,y){return x-y;});return Math.round(a[Math.min(a.length-1,Math.floor(a.length*0.7))]);}
  var res={delivery:pc(by.delivery),pickup:pc(by.pickup)};c.put('eta_v1',JSON.stringify(res),1800);return res;}
/* بيرجّع {role,user,name} أو {err:'bad'|'locked'|'disabled'} */
function auth_(user,pass){
  var c=CacheService.getScriptCache(),u=String(user||'').toLowerCase().trim().replace(/[^a-z0-9_]/g,'').slice(0,20);
  if(!u)return {err:'bad'};
  var k='fail_'+u,f=+(c.get(k)||0),g=+(c.get('adm_fail')||0);
  if(f>=8||g>=60)return {err:'locked'};
  pass=String(pass||'');var r=null;
  if(u===MANAGER_USER.toLowerCase()){if(ADMIN_PIN&&eq_(pass,ADMIN_PIN))r={role:'manager',user:u,name:'المدير'};}
  else{var m=staffMap_()[u];if(m&&eq_(hash_(m.salt,pass),m.hash)){if(!m.active)return {err:'disabled'};r={role:'staff',user:u,name:m.name};}}
  if(!r){c.put(k,String(f+1),600);c.put('adm_fail',String(g+1),600);return {err:'bad'};}
  if(f)c.remove(k);return r;}
function rowsSince_(s,from){var last=s.getLastRow(),out=[],end=last;
  while(end>=2&&out.length<20000){var st=Math.max(2,end-999),ch=s.getRange(st,1,end-st+1,s.getLastColumn()).getValues();out=ch.concat(out);
    if(new Date(ch[0][1]).getTime()<from)break;end=st-1;}
  return out;}
/* ── إشعارات الحالة (OneSignal) — بتوصل للعميل حتى لو الموقع/التطبيق مقفول ──
 *  الإعداد: Project Settings ▸ Script properties، ضيف:
 *    ONESIGNAL_APP_ID  = الـ App ID من OneSignal
 *    ONESIGNAL_API_KEY = الـ REST API Key (من Settings ▸ Keys & IDs)
 *    SITE_URL          = رابط الموقع (مثال https://yourname.github.io/rr/index.html) عشان الضغط على الإشعار يفتح التتبع
 *  وبعد اللصق شغّل الدالة pushTest مرة واحدة من المحرر وادّي الصلاحية (External request). */
function push_(phone,id,st,type,reason){
  try{
    var P=PropertiesService.getScriptProperties(),app=P.getProperty('ONESIGNAL_APP_ID'),key=P.getProperty('ONESIGNAL_API_KEY'),site=P.getProperty('SITE_URL')||'';
    if(!app||!key||!phone)return;
    var pk=type==='pickup',tag='#'+id,M={
      confirmed:['طلبك اتأكد ✅','بدأنا نجهّز طلبك '+tag],
      preparing:['بنجهّز طلبك 👨‍🍳','طلبك '+tag+' بيتحضّر طازج'],
      out:pk?['طلبك جاهز 🏪','طلبك '+tag+' جاهز تستلمه من الفرع']:['طلبك في الطريق 🛵','الطيار خرج بطلبك '+tag+' وهيوصلك قريب'],
      delivered:['تم التسليم 🎉','بالهنا والشفا! قيّم تجربتك مع طلبك '+tag+' ⭐'],
      cancelled:['طلبك اتلغى ❌',reason?('السبب: '+reason):'كلمنا لو محتاج مساعدة']};
    var m=M[st];if(!m)return;
    var body={app_id:app,target_channel:'push',include_aliases:{external_id:[phone]},headings:{en:m[0],ar:m[0]},contents:{en:m[1],ar:m[1]},
      ttl:43200,priority:10,web_push_topic:'rr'+String(id).replace(/[^A-Za-z0-9]/g,''),collapse_id:'rr'+String(id).replace(/[^A-Za-z0-9]/g,'')};
    if(site)body.url=site.split('#')[0]+'#track='+id;
    UrlFetchApp.fetch('https://api.onesignal.com/notifications?c=push',{method:'post',contentType:'application/json',headers:{Authorization:'Key '+key},payload:JSON.stringify(body),muteHttpExceptions:true});
  }catch(e){}
}
function pushTest(){push_('01000000000','TEST','confirmed','delivery','');}   // غيّر الرقم لرقمك بعد ما تفعّل الإشعارات من الموقع وتجرّب
/* أثر تغيير الحالة على النقاط والكوبونات */
function after_(row,old,st){
  var id=String(row[0]),code=String(row[10]||''),ph=norm_(row[3]);
  var o=sh_('Orders',['time','orderId','phone','total','points','confirmed']),ov=o.getDataRange().getValues();
  for(var i=ov.length-1;i>=1;i--){ if(String(ov[i][1])!==id)continue;
    if(st==='cancelled')o.deleteRow(i+1);                       // طلب ملغي: مفيش نقاط
    else o.getRange(i+1,6).setValue(st==='delivered');          // تم التسليم: النقاط تتأكد
  }
  if(st==='cancelled'&&old!=='cancelled'&&code){               // طلب ملغي: نفك الكوبون عشان العميل يقدر يستخدمه تاني
    if(/^RR-/.test(code)){var r=sh_('Redeem',['time','phone','points','value','code','used']),rv=r.getDataRange().getValues();
      for(var j=1;j<rv.length;j++)if(String(rv[j][4])===code)r.getRange(j+1,6).setValue(false);}
    else{var c=sh_('Coupons',['code','phone','time','key']),cv=c.getDataRange().getValues(),key=code+'|'+ph;
      for(var k=cv.length-1;k>=1;k--)if(String(cv[k][3])===key)c.deleteRow(k+1);}
  }
}

function doGet(e){
  var p=(e&&e.parameter)||{}, a=p.action;
  if(a==='check'){var c=String(p.code||'').toUpperCase().trim(),ph=norm_(p.phone);if(!c||ph.length!==11)return out_({ok:false});return out_({ok:true,used:used_(c+'|'+ph)});}
  if(a==='points'){var ph2=norm_(p.phone);if(ph2.length!==11)return out_({ok:false});var b=balance_(ph2);return out_({ok:true,points:b.points,pending:b.pending});}
  if(a==='validate'){if(+(CacheService.getScriptCache().get('val_bad')||0)>=60)return out_({ok:false,error:'busy'});var code=String(p.code||'').toUpperCase().trim(),f=null;rows_(sh_('Redeem',['time','phone','points','value','code','used'])).forEach(function(r){if(String(r[4])===code)f=r;});
    if(!f){rl_('val_bad',60,600);return out_({ok:true,valid:false});}return out_({ok:true,valid:f[5]!==true,used:f[5]===true,value:+f[3]});}
  if(a==='track'){var tid=String(p.id||'').toUpperCase().trim(),tph=norm_(p.phone);if(!tid||tph.length!==11)return out_({ok:false});
    var hit=null;lastRows_(tk_(),1500).forEach(function(r){if(String(r[0]).toUpperCase()===tid&&norm_(r[3])===tph)hit=r;});
    if(!hit)return out_({ok:true,found:false});var t=tkObj_(hit);
    return out_({ok:true,found:true,order:{id:t.id,time:t.time,type:t.type,status:t.status,updated:t.updated,history:t.history,items:t.items,subtotal:t.subtotal,discount:t.discount,fee:t.fee,total:t.total,payment:t.payment,paid:t.paid,hasRef:!!t.payref,eta:eta_()[t.type==='pickup'?'pickup':'delivery'],reason:t.status==='cancelled'?t.reason:''}});}
  if(a==='coupons'){var cm=cdMap_(),cl=[],cu=cdUsesAll_(false);Object.keys(cm).forEach(function(k){var d=cm[k];if(d.active&&!d.hidden&&(!d.expires||d.expires>Date.now())&&(!d.maxUses||(cu[k]||0)<d.maxUses))cl.push(cdPub_(d));});return out_({ok:true,coupons:cl});}
  if(a==='couponDef'){var cc=String(p.code||'').toUpperCase().trim().slice(0,30);if(!cc||/^RR-/.test(cc))return out_({ok:false});
    if(+(CacheService.getScriptCache().get('cd_bad')||0)>=80)return out_({ok:false,error:'busy'});
    var cd=cdMap_()[cc],er=cdCheck_(cd,0,false);if(er==='coupon_min')er='';   // الحد الأدنى بيتتحقق منه الموقع حسب السلة
    if(er){if(!cd)rl_('cd_bad',80,600);return out_({ok:true,found:false,reason:er});}return out_({ok:true,found:true,def:cdPub_(cd)});}
  if(a==='eta'){return out_({ok:true,eta:eta_()});}
  if(a==='soldout'){return out_({ok:true,list:soRows_().map(function(x){return x.name;})});}
  if(a==='top'){var c=CacheService.getScriptCache(),j=c.get('top_v1');if(j)return out_(JSON.parse(j));
    var cnt={};lastRows_(tk_(),1500).forEach(function(r){if(String(r[15])==='cancelled')return;try{JSON.parse(r[7]||'[]').forEach(function(i){var n=String(i.n||'').replace(/\s*\(.*\)\s*$/,'').trim();if(n)cnt[n]=(cnt[n]||0)+(+i.q||1);});}catch(_){}});
    var top=Object.keys(cnt).sort(function(x,y){return cnt[y]-cnt[x];}).slice(0,8),res={ok:true,top:top};c.put('top_v1',JSON.stringify(res),3600);return out_(res);}
  return out_({ok:true,service:'rr'});
}
function doPost(e){
  var b={};try{b=JSON.parse(e.postData.contents);}catch(_){}
  /* قراءة الداشبورد (من غير قفل عشان تبقى سريعة) */
  if(b.action==='adminList'){var au=authAny_(b);if(au.err)return out_({ok:false,error:au.err});
    var all=lastRows_(tk_(),300).map(tkObj_);all.sort(function(x,y){return y.time-x.time;});
    return out_({ok:true,orders:all,soldout:soRows_(),now:Date.now(),role:au.role,name:au.name,user:au.user});}
  /* تقرير الفترة (المدير بس) */
  if(b.action==='adminReport'){var ar=authAny_(b);if(ar.err)return out_({ok:false,error:ar.err});if(ar.role!=='manager')return out_({ok:false,error:'forbidden'});
    var f0=+b.from||0,t0=+b.to||Date.now(),rp=rowsSince_(tk_(),f0).map(tkObj_).filter(function(o){return o.time>=f0&&o.time<t0;});
    rp.sort(function(x,y){return y.time-x.time;});var trunc=rp.length>5000;if(trunc)rp=rp.slice(0,5000);
    return out_({ok:true,orders:rp,truncated:trunc});}
  if(b.action==='adminRatings'){var ra=authAny_(b);if(ra.err)return out_({ok:false,error:ra.err});if(ra.role!=='manager')return out_({ok:false,error:'forbidden'});
    return out_({ok:true,ratings:lastRows_(sh_('Ratings',['time','orderId','stars','comment']),300).map(function(r){return {time:new Date(r[0]).getTime(),id:String(r[1]),stars:+r[2]||0,comment:String(r[3]||'')};}).reverse()});}
  if(b.action==='staffList'){var al=authAny_(b);if(al.err)return out_({ok:false,error:al.err});if(al.role!=='manager')return out_({ok:false,error:'forbidden'});
    return out_({ok:true,staff:rows_(staffSh_()).filter(function(r){return r[0];}).map(function(r){return {username:String(r[0]),name:String(r[3]||r[0]),active:r[4]===true||String(r[4]).toLowerCase()==='true',created:r[5]?new Date(r[5]).getTime():0};})});}
  if(b.action==='couponList'){var cL=authAny_(b);if(cL.err)return out_({ok:false,error:cL.err});if(cL.role!=='manager')return out_({ok:false,error:'forbidden'});
    var cmL=cdMap_(),cuL=cdUsesAll_(true),csL=cdStats_();
    return out_({ok:true,defs:Object.keys(cmL).map(function(k){var d=cmL[k];return {code:d.code,type:d.type,value:d.value,min:d.min,firstOrderOnly:d.first,active:d.active,expires:d.exp,maxUses:d.maxUses,hidden:d.hidden,label:d.label,uses:cuL[k]||0};}),stats:csL.stats,aovPlain:csL.aovPlain});}
  var lock=LockService.getScriptLock();lock.waitLock(10000);
  try{
    var ph=norm_(b.phone);
    if(b.action==='claim'){var c=String(b.code||'').toUpperCase().trim();if(!c||ph.length!==11)return out_({ok:false});
      return out_({ok:true,used:used_(c+'|'+ph)});}   // للقراءة بس — الحجز بيتم جوه newOrder عشان محدش يحرق كوبون حد تاني
    if(b.action==='newOrder'){
      var id=String(b.id||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,20);
      if(!id||ph.length!==11||!b.items||!b.items.length)return out_({ok:false});
      if(!open_())return out_({ok:false,error:'closed'});
      var t=tk_();if(lastRows_(t,1500).some(function(r){return String(r[0])===id;}))return out_({ok:true,dup:true});
      if(!rl_('ord_'+ph,6,600)||!rl_('ord_all',400,600))return out_({ok:false,error:'busy'});
      var items=b.items.slice(0,60).map(function(i){return {n:String(i.n||'').slice(0,120),q:+i.q||1,p:+i.p||0,o:(i.o||[]).slice(0,12).map(function(x){return String(x).slice(0,80);}),t:String(i.t||'').slice(0,200)};});
      var soBad=soBad_(items);if(soBad.length)return out_({ok:false,error:'soldout',items:soBad});   // صنف موقوف: نرفض قبل ما نحجز الكوبون
      /* السيرفر مابيصدّقش أرقام الموقع: المجموع لازم يطابق الأصناف، والتوصيل منطقي، والخصم مطابق للكوبون */
      var sumI=0;items.forEach(function(i){sumI+=i.p*i.q;});
      var sub=+b.subtotal||0,dsc=+b.discount||0,fee=+b.fee||0,tot=+b.total||0;
      if(Math.abs(sumI-sub)>1||fee<0||fee>150||dsc<0||dsc>sub||Math.abs(tot-(sub-dsc+fee))>1)return out_({ok:false,error:'bad_total'});
      var cp=String(b.coupon||'').toUpperCase().trim().slice(0,30),claimKey='',burnRow=0;
      if(dsc>0&&!cp)return out_({ok:false,error:'bad_total'});
      if(!(dsc>0))cp='';
      if(cp){
        if(/^RR-/.test(cp)){   // كود نقاط الولاء: لازم موجود وماتستخدمش وقيمته تغطي الخصم — وبيتحرق هنا مش من الموقع
          var rsh=sh_('Redeem',['time','phone','points','value','code','used']),rv=rsh.getDataRange().getValues(),rrow=0;
          for(var q=1;q<rv.length;q++)if(String(rv[q][4])===cp){rrow=q;break;}
          if(!rrow)return out_({ok:false,error:'coupon_invalid'});
          if(rv[rrow][5]===true)return out_({ok:false,error:'coupon_used'});
          if(dsc>(+rv[rrow][3])+0.01)return out_({ok:false,error:'bad_total'});
          burnRow=rrow+1;
        }else{            // كوبون عادي: التعريف من ورقة CouponDefs (فعّال/تاريخ/حد استخدام/حد أدنى)
          var cdf=cdMap_()[cp],cer=cdCheck_(cdf,sub,true);if(cer)return out_({ok:false,error:cer});
          if(dsc>cdDisc_(cdf,sub)+1)return out_({ok:false,error:'bad_total'});
          if(cdf.first){claimKey=cp+'|'+ph;if(used_(claimKey))return out_({ok:false,error:'coupon_used'});}
        }
      }
      var pay=['cash','wallet','instapay'].indexOf(b.payment)>=0?b.payment:'cash',now=new Date();
      if(claimKey)sh_('Coupons',['code','phone','time','key']).appendRow([cp,"'"+ph,now,claimKey]);
      if(burnRow)sh_('Redeem',['time','phone','points','value','code','used']).getRange(burnRow,6).setValue(true);
      t.appendRow([id,now,safe_(b.name,80),"'"+ph,b.phone2?"'"+norm_(b.phone2):'',b.type==='pickup'?'pickup':'delivery',safe_(b.address,400),JSON.stringify(items),
        sub,dsc,safe_(cp,30),fee,tot,pay,safe_(b.notes,400),'new',now,'new@'+now.getTime(),'','',pay==='cash'?'':safe_(b.payref,40),false]);
      return out_({ok:true});}
    if(b.action==='rate'){var rid=String(b.id||'').toUpperCase().trim(),stars=Math.round(+b.stars),hit=null;
      if(!rid||ph.length!==11||!(stars>=1&&stars<=5))return out_({ok:false});
      lastRows_(tk_(),1500).forEach(function(r){if(String(r[0]).toUpperCase()===rid&&norm_(r[3])===ph)hit=r;});
      if(!hit||String(hit[15])!=='delivered')return out_({ok:false,error:'not_delivered'});
      var rs=sh_('Ratings',['time','orderId','stars','comment']);if(rows_(rs).some(function(r){return String(r[1])===rid;}))return out_({ok:true,dup:true});
      rs.appendRow([new Date(),rid,stars,safe_(b.comment,200)]);return out_({ok:true});}
    if(b.action==='staffSave'){var am=authAny_(b);if(am.err)return out_({ok:false,error:am.err});if(am.role!=='manager')return out_({ok:false,error:'forbidden'});
      var nu=String(b.username||'').toLowerCase().trim(),np=String(b.password||'').trim();
      if(!/^[a-z0-9_]{3,20}$/.test(nu)||nu===MANAGER_USER.toLowerCase())return out_({ok:false,error:'bad_username'});
      if(np&&np.length<4)return out_({ok:false,error:'bad_password'});
      var ss=staffSh_(),sv=ss.getDataRange().getValues(),ix=-1;for(var si=1;si<sv.length;si++)if(String(sv[si][0]).toLowerCase()===nu)ix=si;
      if(ix<0){if(!np)return out_({ok:false,error:'bad_password'});var sl=Utilities.getUuid();ss.appendRow([nu,sl,hash_(sl,np),safe_(b.name||nu,40),b.active!==false,new Date()]);}
      else{if(np){var sl2=Utilities.getUuid();ss.getRange(ix+1,2,1,2).setValues([[sl2,hash_(sl2,np)]]);}
        if(b.name!=null&&String(b.name).trim())ss.getRange(ix+1,4).setValue(safe_(b.name,40));
        if(typeof b.active==='boolean')ss.getRange(ix+1,5).setValue(b.active);}
      CacheService.getScriptCache().remove('staff_v1');return out_({ok:true});}
    if(b.action==='setSoldout'){var as_=authAny_(b);if(as_.err)return out_({ok:false,error:as_.err});
      var sn=String(b.name||'').trim().slice(0,120);if(!sn)return out_({ok:false,error:'bad_name'});
      var ssh=soSh_(),sv=ssh.getDataRange().getValues(),k2=nm_(sn),has=false;
      for(var z=sv.length-1;z>=1;z--)if(nm_(sv[z][0])===k2){if(b.soldout===false)ssh.deleteRow(z+1);else has=true;}   // نمسح كل التكرارات من تحت لفوق
      if(b.soldout!==false&&!has)ssh.appendRow([safe_(sn,120),as_.user,new Date()]);
      CacheService.getScriptCache().remove('so_v1');return out_({ok:true,soldout:soRows_()});}
    if(b.action==='soldoutClear'){var ac_=authAny_(b);if(ac_.err)return out_({ok:false,error:ac_.err});
      var csh=soSh_(),cl=csh.getLastRow();if(cl>1)csh.deleteRows(2,cl-1);
      CacheService.getScriptCache().remove('so_v1');return out_({ok:true,soldout:[]});}
    if(b.action==='setStatus'){var au2=authAny_(b);if(au2.err)return out_({ok:false,error:au2.err});
      var st=String(b.status||'');if(STATUSES.indexOf(st)<0)return out_({ok:false,error:'bad_status'});
      var tt=tk_(),v=tt.getDataRange().getValues(),oid=String(b.id||'');
      for(var i=1;i<v.length;i++)if(String(v[i][0])===oid){var old=String(v[i][15]);
        if(old===st)return out_({ok:true,same:true,status:st});
        if(au2.role!=='manager'&&(old==='delivered'||old==='cancelled'))return out_({ok:false,error:'forbidden'});   // الموظف مايعدّلش طلب منتهي
        var n=new Date(),hist=String(v[i][17]||''),lg=String(v[i][19]||'');
        tt.getRange(i+1,16,1,3).setValues([[st,n,(hist?hist+';':'')+st+'@'+n.getTime()]]);
        tt.getRange(i+1,19,1,2).setValues([[st==='cancelled'?safe_(b.reason,150):'',(lg?lg+';':'')+st+'@'+au2.user+'@'+n.getTime()]]);   // سبب الإلغاء + مين عمل الإجراء
        after_(v[i],old,st);
        push_(norm_(v[i][3]),oid,st,String(v[i][5]),st==='cancelled'?String(b.reason||'').slice(0,150):'');   // إشعار للعميل
        return out_({ok:true,status:st,updated:n.getTime()});}
      return out_({ok:false,error:'not_found'});}
    if(b.action==='order'){if(ph.length!==11)return out_({ok:false});   // النقاط بتتحسب من الأوردر المسجّل على السيرفر مش من رقم بيبعته الموقع
      var oid=String(b.orderId||''),tkt=null;lastRows_(tk_(),1500).forEach(function(r){if(String(r[0])===oid&&norm_(r[3])===ph)tkt=r;});
      if(!tkt||String(tkt[15])==='cancelled')return out_({ok:false,error:'no_ticket'});
      var base=Math.max(0,(+tkt[8]||0)-(+tkt[9]||0));if(!(base>0))return out_({ok:false});
      var o=sh_('Orders',['time','orderId','phone','total','points','confirmed']);
      if(rows_(o).some(function(r){return String(r[1])===oid;}))return out_({ok:true,dup:true});
      o.appendRow([new Date(),oid,"'"+ph,base,Math.round(base*EARN_PER_EGP),false]);
      o.getRange(o.getLastRow(),6).insertCheckboxes();return out_({ok:true});}
    if(b.action==='redeem'){if(!rl_('red_'+ph,8,600))return out_({ok:false,error:'busy'});var pts=+b.points;if(ph.length!==11||!pts||pts%STEP!==0)return out_({ok:false,error:'bad_points'});
      var bal=balance_(ph);if(bal.points<pts)return out_({ok:false,error:'not_enough',points:bal.points});
      var code='RR-'+Utilities.getUuid().replace(/-/g,'').slice(0,6).toUpperCase(),val=pts/POINTS_PER_EGP;
      sh_('Redeem',['time','phone','points','value','code','used']).appendRow([new Date(),"'"+ph,pts,val,code,false]);
      return out_({ok:true,code:code,value:val,points:bal.points-pts});}
    if(b.action==='useCode'){return out_({ok:true});}   // اتلغى: كود النقاط بيتحرق جوه newOrder (كان أي حد يقدر يحرق أكواد غيره)
    if(b.action==='login'){var lr=login_(b);if(lr.err)return out_({ok:false,error:lr.err});return out_({ok:true,role:lr.role,user:lr.user,name:lr.name,token:lr.token,exp:lr.exp});}
    if(b.action==='logout'){logout_(b);return out_({ok:true});}
    if(b.action==='setPaid'){var ap=authAny_(b);if(ap.err)return out_({ok:false,error:ap.err});
      var pt=tk_(),pv=pt.getDataRange().getValues(),pid=String(b.id||'');
      for(var pi=1;pi<pv.length;pi++)if(String(pv[pi][0])===pid){if(String(pv[pi][13])==='cash')return out_({ok:false,error:'cash'});
        var pf=b.paid!==false,pl=String(pv[pi][19]||'');pt.getRange(pi+1,22).setValue(pf);
        pt.getRange(pi+1,20).setValue((pl?pl+';':'')+(pf?'paid':'unpaid')+'@'+ap.user+'@'+Date.now());return out_({ok:true,paid:pf});}
      return out_({ok:false,error:'not_found'});}
    if(b.action==='couponSave'){var cS=authAny_(b);if(cS.err)return out_({ok:false,error:cS.err});if(cS.role!=='manager')return out_({ok:false,error:'forbidden'});
      var cc=String(b.code||'').toUpperCase().trim();if(!/^[A-Z0-9_-]{3,20}$/.test(cc)||/^RR-/.test(cc))return out_({ok:false,error:'bad_code'});
      var ty=b.type==='percent'?'percent':'fixed',vl=+b.value,mn=Math.max(0,+b.min||0),mx=Math.max(0,Math.floor(+b.maxUses||0)),ex=ymd_(b.expires);
      if(b.expires&&!ex)return out_({ok:false,error:'bad_date'});if(!(vl>0)||(ty==='percent'&&vl>100))return out_({ok:false,error:'bad_value'});
      var csh=cdSh_(),cv=csh.getDataRange().getValues(),ci=-1;for(var z=1;z<cv.length;z++)if(String(cv[z][0]).toUpperCase().trim()===cc)ci=z;
      var row=[cc,ty,vl,mn,b.firstOrderOnly!==false,b.active!==false,ex,mx,!!b.hidden,safe_(b.label,80)];
      if(ci<0)csh.appendRow(row.concat([new Date()]));else csh.getRange(ci+1,1,1,10).setValues([row]);
      CacheService.getScriptCache().removeAll(['cd_v1','cdu_v1']);return out_({ok:true});}
    if(b.action==='couponDelete'){var cX=authAny_(b);if(cX.err)return out_({ok:false,error:cX.err});if(cX.role!=='manager')return out_({ok:false,error:'forbidden'});
      var dc=String(b.code||'').toUpperCase().trim(),dsh=cdSh_(),dv=dsh.getDataRange().getValues();for(var dz=dv.length-1;dz>=1;dz--)if(String(dv[dz][0]).toUpperCase().trim()===dc)dsh.deleteRow(dz+1);
      CacheService.getScriptCache().removeAll(['cd_v1','cdu_v1']);return out_({ok:true});}
    return out_({ok:false,error:'bad_action'});
  }finally{lock.releaseLock();}
}

/* ═══ نسخ احتياطي تلقائي ═══
 * شغّل setupBackup مرة واحدة من محرر الكود (Run ▸ setupBackup) ووافق على صلاحيات Drive.
 * بيعمل نسخة كاملة من الشيت كل يوم الساعة ٦ الصبح (بعد الإقفال) في فولدر "RedRoosters Backups" ويحتفظ بآخر ١٤ نسخة. */
var BACKUP_KEEP=14;
function dailyBackup(){
  var ss=SpreadsheetApp.getActiveSpreadsheet(),it=DriveApp.getFoldersByName('RedRoosters Backups'),dir=it.hasNext()?it.next():DriveApp.createFolder('RedRoosters Backups');
  DriveApp.getFileById(ss.getId()).makeCopy(ss.getName()+' — backup '+Utilities.formatDate(new Date(),'Africa/Cairo','yyyy-MM-dd HH:mm'),dir);
  var files=[],fi=dir.getFiles();while(fi.hasNext()){var x=fi.next();files.push({f:x,t:x.getDateCreated().getTime()});}
  files.sort(function(a,b){return b.t-a.t;});for(var i=BACKUP_KEEP;i<files.length;i++)files[i].f.setTrashed(true);}
function setupBackup(){
  ScriptApp.getProjectTriggers().forEach(function(t){if(t.getHandlerFunction()==='dailyBackup')ScriptApp.deleteTrigger(t);});
  ScriptApp.newTrigger('dailyBackup').timeBased().everyDays(1).atHour(6).inTimezone('Africa/Cairo').create();dailyBackup();}
