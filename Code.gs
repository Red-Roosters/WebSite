/** (v7) تعديل/إلغاء العميل لطلبه بنفسه خلال مدة (افتراضي ٥ دقايق — من الإعدادات) + طلبات التعديل/الإلغاء بعد المدة بتوصل الداشبورد كـ popup وتستنى القبول/الرفض + تنبيه للداشبورد على أي تعديل (ورقة Changes + عمود chg في Tickets) · إضافة/تعديل/حذف الطيارين من الداشبورد بسهولة (drvSave / drvDelete).
 *  بعد اللصق: Deploy ▸ Manage deployments ▸ Edit ▸ New version، وارفع index.html و dashboard.html الجداد مع بعض. */
/** (v6) ربط النقاط بجهاز العميل (did) · مراقبة فشل إشعارات OneSignal (PushLog + حالة في الداشبورد + إيميل) · حظر وتنبيه الأرقام المزعجة (Blocklist) · إيميل فوري لتقييم ١-٢ نجمة · أرشفة الطلبات الأقدم من ١٨٠ يوم (ورقة Archive) + أداء أسرع للنقاط والكوبونات · برنامج دعوة صديق (كوبون FRIEND + نقاط للي دعا).
 *  بعد اللصق: شغّل setupBackup مرة تانية من المحرر (بيركّب أرشفة شهرية كمان)، بعدين Deploy ▸ New version، وارفع index.html و dashboard.html الجداد مع بعض. */
/** (v5) إعدادات من شيت (Settings: مواعيد/وضع الزحمة/إيقاف التوصيل · Areas: رسوم وقفل المناطق) · ETA لكل منطقة · اقتراحات السلة من الطلبات الفعلية (action=suggest) · مراقبة النسخ الاحتياطي + إيميل لو فشل · تقرير إقفال يومي بالإيميل (dailyReport) · حدود المحاولات بالرقم.
 *  بعد اللصق: شغّل setupBackup مرة واحدة من المحرر ووافق على الصلاحيات (Drive + Triggers + Mail)، بعدين Deploy ▸ New version. */
/** (v4) أمان: إصلاح authAny_ · تحقق أسعار الأصناف (ورقة MenuPrices — الداشبورد بتزامنها) · إشعارات على معرّف جهاز عشوائي did بدل الرقم · إلغاء جلسات الموظف عند تغيير كلمة السر · استرجاع حجز الكوبون عند فك الإلغاء · حد المعدّل بعد التحققات.
 *  بعد اللصق: Deploy ▸ New version، وافتح تبويب "الأصناف" في الداشبورد كمدير مرة عشان الأسعار تتزامن. */
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
var TK_HEAD = ['orderId','time','name','phone','phone2','type','address','items','subtotal','discount','coupon','fee','total','payment','notes','status','updated','history','reason','log','payref','paid','did','area','lat','lon','drv','chg'];

var HOURS_ON=true;   // ⚠️ false = وقف مواعيد العمل (للتجربة). رجّعه true بعد التجربة
var OPEN_AT='11:00', CLOSE_AT='05:05';   // مواعيد العمل بتوقيت القاهرة (الإغلاق 5:00 + 5 دقايق سماح)
/* ── الإعدادات (ورقة Settings) والمناطق (ورقة Areas): بتتدار من الداشبورد ── */
var SET_KEYS=['hours_on','open_at','close_at','busy_extra','busy_msg','pause_on','pause_msg','ref_on','ref_points','ref_cap','pay_cash','pay_wallet','pay_instapay','pay_msg','ot_key','drivers','edit_min'];
function tv_(v){if(Object.prototype.toString.call(v)==='[object Date]')return Utilities.formatDate(v,'Africa/Cairo','HH:mm');return String(v==null?'':v);}
/* ===== تتبع الطيارين (OwnTracks) ===== */
function drv_(){var o=[],seen={},ok=/^[A-Za-z0-9]{1,8}$/;String(cfg_().drivers||'').split(/[,،\n]/).forEach(function(x){var p=x.split(':'),l=(p[0]||'').trim(),r=(p[1]||'').trim(),ph=String(p[2]||'').replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/\D/g,'');
  if(!ok.test(l)&&ok.test(r)){var t=l;l=r;r=t;}   // لو اتكتب «الاسم:الكود» بالعكس نصلّحها
  var id=l.toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,8);if(id&&!seen[id]){seen[id]=1;o.push({id:id,name:r.slice(0,30)||id,phone:ph.length>=10&&ph.length<=13?ph:''});}});return o;}   // الشكل: كود:اسم:رقم_واتساب (الرقم اختياري)
function drvName_(id){var l=drv_();for(var i=0;i<l.length;i++)if(l[i].id===id)return l[i].name;return '';}
function nt_(v,def){var m=/^\s*(\d{1,2}):(\d{2})(?::\d{2})?\s*([AaPp][Mm])?\s*$/.exec(String(v||''));if(!m)return def;var h=+m[1],mi=+m[2],ap=(m[3]||'').toLowerCase();if(ap==='pm'&&h<12)h+=12;if(ap==='am'&&h===12)h=0;if(h>23||mi>59)return def;return ('0'+h).slice(-2)+':'+('0'+mi).slice(-2);}
function setSh_(){var ss=SpreadsheetApp.getActiveSpreadsheet(),s=ss.getSheetByName('Settings');
  if(s)s.getRange('A:B').setNumberFormat('@');   // ✅ دايمًا نص: عشان جوجل شيت ميحوّلش 11:00 لوقت ويبوّظ الدقايق
  if(!s){s=ss.insertSheet('Settings');s.getRange('A:B').setNumberFormat('@');s.appendRow(['key','value']);
    [['hours_on',String(HOURS_ON)],['open_at',OPEN_AT],['close_at','05:00'],['busy_extra','0'],['busy_msg',''],['pause_on','false'],['pause_msg',''],['ref_on','true'],['ref_points','500'],['ref_cap','20'],['pay_cash','true'],['pay_wallet','true'],['pay_instapay','true'],['pay_msg',''],['ot_key',''],['drivers',''],['edit_min','5']].forEach(function(r){s.appendRow(r);});}
  return s;}
function cfg_(){var c=CacheService.getScriptCache(),j=c.get('set_v1');if(j){try{return JSON.parse(j);}catch(_){}}
  var m={hours_on:String(HOURS_ON),open_at:OPEN_AT,close_at:'05:00',busy_extra:'0',busy_msg:'',pause_on:'false',pause_msg:'',ref_on:'true',ref_points:'500',ref_cap:'20',pay_cash:'true',pay_wallet:'true',pay_instapay:'true',pay_msg:'',ot_key:'',drivers:'',edit_min:'5'};
  setSh_().getDataRange().getDisplayValues().slice(1).forEach(function(r){var k=String(r[0]);if(SET_KEYS.indexOf(k)>=0)m[k]=(k==='open_at'||k==='close_at')?nt_(r[1],m[k]):String(r[1]);});
  c.put('set_v1',JSON.stringify(m),60);return m;}
function mins_(t){var a=String(t||'').split(':');return (+a[0]||0)*60+(+a[1]||0);}
function open_(){var c=cfg_();if(c.hours_on!=='true')return true;var n=mins_(Utilities.formatDate(new Date(),'Africa/Cairo','HH:mm')),o=mins_(c.open_at),e=(mins_(c.close_at)+5)%1440;return o<=e?(n>=o&&n<e):(n>=o||n<e);}   // +5 دقايق سماح بعد الإغلاق
function arSh_(){var ss=SpreadsheetApp.getActiveSpreadsheet(),s=ss.getSheetByName('Areas');if(!s){s=ss.insertSheet('Areas');s.getRange('A:A').setNumberFormat('@');s.appendRow(['name','fee','active']);}return s;}
function areas_(){var c=CacheService.getScriptCache(),j=c.get('ar_v1');if(j){try{return JSON.parse(j);}catch(_){}}
  var l=rows_(arSh_()).filter(function(r){return r[0];}).map(function(r){return {name:String(r[0]).trim(),fee:+r[1]||0,active:r[2]===''||bool_(r[2])};});c.put('ar_v1',JSON.stringify(l),60);return l;}
function pubCfg_(){var c=cfg_(),ar=areas_();return {ok:true,hours:{enabled:c.hours_on==='true',open:c.open_at,close:c.close_at},busy:{extra:+c.busy_extra||0,msg:c.busy_msg},pause:{on:c.pause_on==='true',msg:c.pause_msg},pay:{cash:c.pay_cash!=='false',wallet:c.pay_wallet!=='false',instapay:c.pay_instapay!=='false',msg:c.pay_msg||''},
  areas:ar.length?ar.filter(function(x){return x.active;}).map(function(x){return {name:x.name,fee:x.fee};}):null,closedAreas:ar.filter(function(x){return !x.active;}).map(function(x){return x.name;})};}
function norm_(p){p=String(p||'').replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/\D/g,'').replace(/^(0020|20)/,'0');return p.slice(-11);}
function sh_(n,h){var ss=SpreadsheetApp.getActiveSpreadsheet(),s=ss.getSheetByName(n);if(!s){s=ss.insertSheet(n);s.appendRow(h);}return s;}
function out_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
function rows_(s){return s.getDataRange().getValues().slice(1);}
/* ── الأصناف اللي نفدت (ورقة Soldout) ── */
function nm_(s){return String(s==null?'':s).replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).toLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,' ').trim();}
function soSh_(){return sh_('Soldout',['name','by','time','until']);}
function soRows_(){var c=CacheService.getScriptCache(),j=c.get('so_v1');if(j){try{return JSON.parse(j);}catch(_){}}
  var l=rows_(soSh_()).filter(function(r){return r[0];}).map(function(r){return {name:String(r[0]),by:String(r[1]||''),time:r[2]?new Date(r[2]).getTime():0,until:+r[3]||0};}).filter(function(x){return !x.until||x.until>Date.now();});   // الإيقاف المؤقت بيخلص لوحده
  c.put('so_v1',JSON.stringify(l),120);return l;}
/* بيرجّع أسماء الأصناف (أو الاختيارات جوه العروض) اللي موقوفة ومطلوبة في الأوردر */
function soBad_(items){var m={};soRows_().forEach(function(x){m[nm_(x.name)]=1;});var bad=[];if(!Object.keys(m).length)return bad;
  items.forEach(function(i){var n=String(i.n||''),b=n.replace(/\s*\(.*\)\s*$/,''),hit=(m[nm_(n)]||m[nm_(b)])?n:'';
    (i.o||[]).forEach(function(x){var o=String(x).replace(/^➕\s*/,'').replace(/\s*\(\+\d+\)\s*$/,'').replace(/^[^:]*:\s*/,'');if(!hit&&m[nm_(o)])hit=o;});
    if(hit&&bad.indexOf(hit)<0)bad.push(hit);});
  return bad;}
function findRow_(s,id){var n=s.getLastRow();if(n<2)return 0;var v=s.getRange(2,1,n-1,1).getValues();for(var i=v.length-1;i>=0;i--)if(String(v[i][0])===id)return i+2;return 0;}   // بحث في عمود الرقم بس (أسرع بكتير من قراءة الشيت كله)
function lastRows_(s,n){var last=s.getLastRow();if(last<2)return [];var st=Math.max(2,last-n+1);return s.getRange(st,1,last-st+1,s.getLastColumn()).getValues();}
function colVals_(s,col){var n=s.getLastRow();return n<2?[]:s.getRange(2,col,n-1,1).getValues();}   // بنقرا العمود المطلوب بس (مش الشيت كله)
function used_(key){var s=sh_('Coupons',['code','phone','time','key']),v=colVals_(s,4);for(var i=0;i<v.length;i++)if(String(v[i][0])===key)return true;return false;}
function balDrop_(ph){try{CacheService.getScriptCache().remove('bal_'+ph);}catch(_){}}
function balance_(phone,fresh){
  var c=CacheService.getScriptCache(),k='bal_'+phone,j=fresh?null:c.get(k);if(j){try{return JSON.parse(j);}catch(_){}}
  var o=sh_('Orders',['time','orderId','phone','total','points','confirmed']),P=colVals_(o,3),T=colVals_(o,5),F=colVals_(o,6),ok=0,pend=0,spent=0;
  for(var i=0;i<P.length;i++){if(norm_(P[i][0])!==phone)continue;if(F[i][0]===true)ok+=+T[i][0];else pend+=+T[i][0];}
  var r=sh_('Redeem',['time','phone','points','value','code','used']),RP=colVals_(r,2),RV=colVals_(r,3);
  for(var q=0;q<RP.length;q++)if(norm_(RP[q][0])===phone)spent+=+RV[q][0];
  var res={points:ok-spent,pending:pend};c.put(k,JSON.stringify(res),120);return res;
}

/* ── الأوردرات (Tickets) ── */
function tk_(){var s=sh_('Tickets',TK_HEAD),cc_=CacheService.getScriptCache();if(cc_.get('tkh_v3'))return s;if(s.getLastColumn()<24||s.getRange(1,24).getValue()!=='area'||s.getRange(1,19).getValue()!=='reason'||s.getRange(1,20).getValue()!=='log'||s.getRange(1,21).getValue()!=='payref'||s.getRange(1,22).getValue()!=='paid'||s.getRange(1,23).getValue()!=='did')s.getRange(1,19,1,6).setValues([['reason','log','payref','paid','did','area']]);if(s.getMaxColumns()<28)s.insertColumnsAfter(s.getMaxColumns(),28-s.getMaxColumns());if(s.getRange(1,27).getValue()!=='drv')s.getRange(1,25,1,3).setValues([['lat','lon','drv']]);if(s.getRange(1,28).getValue()!=='chg')s.getRange(1,28).setValue('chg');cc_.put('tkh_v3','1',3600);return s;}
function safe_(v,n){v=String(v==null?'':v).slice(0,n||300);return /^[=+\-@]/.test(v)?"'"+v:v;}   // يمنع حقن المعادلات من بيانات العميل
function tkObj_(r){var it=[];try{it=JSON.parse(r[7]||'[]');}catch(_){}
  return {id:String(r[0]),time:new Date(r[1]).getTime(),name:String(r[2]),phone:norm_(r[3]),phone2:r[4]?norm_(r[4]):'',type:String(r[5]),address:String(r[6]),items:it,
    subtotal:+r[8]||0,discount:+r[9]||0,coupon:String(r[10]||''),fee:+r[11]||0,total:+r[12]||0,payment:String(r[13]),notes:String(r[14]||''),
    status:String(r[15]),updated:new Date(r[16]).getTime(),history:String(r[17]||''),reason:String(r[18]||''),log:String(r[19]||''),payref:String(r[20]||''),paid:r[21]===true||String(r[21]).toLowerCase()==='true',area:String(r[23]||''),lat:(r[24]===''||r[24]==null)?null:+r[24],lon:(r[25]===''||r[25]==null)?null:+r[25],drv:String(r[26]||''),chg:chgParse_(r[27])};}
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
function authAny0_(b){return b.token?sess_(b.user,b.token):auth_(b.user,b.pass);}
function revokeUser_(u){var s=sessSh_(),v=s.getDataRange().getValues(),c=CacheService.getScriptCache();for(var i=v.length-1;i>=1;i--)if(String(v[i][1])===u){c.remove('ses_'+String(v[i][0]));s.deleteRow(i+1);}}   // يلغي كل جلسات المستخدم

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
/* ── أسعار المنيو (ورقة MenuPrices): الداشبورد بتزامنها من الموقع، والسيرفر بيرفض أي صنف سعره أقل من سعره المعلن ── */
function mpMap_(){var c=CacheService.getScriptCache(),j=c.get('mp_v1');if(j){try{return JSON.parse(j);}catch(_){}}
  var m={};rows_(sh_('MenuPrices',['name','price','updated'])).forEach(function(r){var k=nm_(r[0]),p=+r[1];if(k&&p>0)m[k]=p;});c.put('mp_v1',JSON.stringify(m),300);return m;}
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
function eta_(){var c=CacheService.getScriptCache(),j=c.get('eta_v2');if(j){try{return JSON.parse(j);}catch(_){}}
  var by={delivery:[],pickup:[]},ba={},lim=Date.now()-21*864e5;
  lastRows_(tk_(),1500).forEach(function(r){if(String(r[15])!=='delivered')return;var t0=new Date(r[1]).getTime();if(t0<lim)return;var dt=0;
    String(r[17]||'').split(';').forEach(function(p){var a=p.split('@');if(a[0]==='delivered'&&a[1])dt=+a[1];});
    var m=(dt-t0)/60000;if(m<5||m>180)return;var pk=String(r[5])==='pickup';by[pk?'pickup':'delivery'].push(m);
    if(!pk&&r[23]){var k=String(r[23]);(ba[k]=ba[k]||[]).push(m);}});
  function pc(a,min){if(a.length<(min||5))return null;a.sort(function(x,y){return x-y;});return Math.round(a[Math.min(a.length-1,Math.floor(a.length*0.7))]);}   // نسبة ٧٠٪ عشان التقدير مايكونش متفائل
  var areas={};Object.keys(ba).forEach(function(k){var v=pc(ba[k],4);if(v)areas[k]=v;});
  var res={delivery:pc(by.delivery),pickup:pc(by.pickup),areas:areas};c.put('eta_v2',JSON.stringify(res),1800);return res;}
/* اقتراحات السلة: الأصناف اللي بتتطلب مع بعض في الطلبات الفعلية (كاش ساعة) */
function suggest_(){var c=CacheService.getScriptCache(),j=c.get('sg_v1');if(j){try{return JSON.parse(j);}catch(_){}}
  var cnt={},pr={};
  lastRows_(tk_(),1500).forEach(function(r){if(String(r[15])==='cancelled')return;var it=[];try{it=JSON.parse(r[7]||'[]');}catch(_){}
    var names=[];it.forEach(function(i){var n=String(i.n||'').replace(/\s*\(.*\)\s*$/,'').trim();if(n&&names.indexOf(n)<0)names.push(n);});names=names.slice(0,12);
    names.forEach(function(a){cnt[a]=(cnt[a]||0)+1;names.forEach(function(b2){if(a===b2)return;pr[a]=pr[a]||{};pr[a][b2]=(pr[a][b2]||0)+1;});});});
  var pairs={},keys=Object.keys(cnt).sort(function(x,y){return cnt[y]-cnt[x];});
  keys.filter(function(n){return cnt[n]>=3;}).slice(0,100).forEach(function(a){var l=Object.keys(pr[a]||{}).filter(function(b2){return pr[a][b2]>=2;}).sort(function(x,y){return pr[a][y]-pr[a][x];}).slice(0,4);if(l.length)pairs[a]=l;});
  var res={ok:true,pairs:pairs,top:keys.slice(0,8)};c.put('sg_v1',JSON.stringify(res),3600);return res;}
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
function scanSince_(s,from){var last=s.getLastRow(),out=[],end=last;
  while(end>=2&&out.length<20000){var st=Math.max(2,end-999),ch=s.getRange(st,1,end-st+1,s.getLastColumn()).getValues();out=ch.concat(out);
    if(new Date(ch[0][1]).getTime()<from)break;end=st-1;}
  return out;}
function rowsSince_(s,from){var out=scanSince_(s,from);
  if(!out.length||new Date(out[0][1]).getTime()>from){var a=SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Archive');if(a&&a.getLastRow()>1)out=scanSince_(a,from).concat(out);}   // التقارير الأقدم من فترة الأرشفة بتقرا الأرشيف كمان
  return out;}
/* ── إشعارات الحالة (OneSignal) — بتوصل للعميل حتى لو الموقع/التطبيق مقفول ──
 *  الإعداد: Project Settings ▸ Script properties، ضيف:
 *    ONESIGNAL_APP_ID  = الـ App ID من OneSignal
 *    ONESIGNAL_API_KEY = الـ REST API Key (من Settings ▸ Keys & IDs)
 *    SITE_URL          = رابط الموقع (مثال https://yourname.github.io/rr/index.html) عشان الضغط على الإشعار يفتح التتبع
 *  وبعد اللصق شغّل الدالة pushTest مرة واحدة من المحرر وادّي الصلاحية (External request). */
function push_(did,id,st,type,reason){   // did = معرّف الجهاز العشوائي المخزّن مع الطلب (مش رقم الموبايل)
  try{
    var P=PropertiesService.getScriptProperties(),app=P.getProperty('ONESIGNAL_APP_ID'),key=P.getProperty('ONESIGNAL_API_KEY'),site=P.getProperty('SITE_URL')||'';
    if(!app||!key||!/^[a-f0-9]{32}$/.test(String(did||'')))return;
    var pk=type==='pickup',tag='#'+id,M={
      confirmed:['طلبك اتأكد ✅','بدأنا نجهّز طلبك '+tag],
      preparing:['بنجهّز طلبك 👨‍🍳','طلبك '+tag+' بيتحضّر طازج'],
      out:pk?['طلبك جاهز 🏪','طلبك '+tag+' جاهز تستلمه من الفرع']:['طلبك في الطريق 🛵','الطيار خرج بطلبك '+tag+' وهيوصلك قريب'],
      delivered:['تم التسليم 🎉','بالهنا والشفا! قيّم تجربتك مع طلبك '+tag+' ⭐'],
      cancelled:['طلبك اتلغى ❌',reason?('السبب: '+reason):'كلمنا لو محتاج مساعدة'],
      reqok:['اتنفّذ طلبك ✅','المطعم وافق على طلبك للتعديل في '+tag],reqno:['المطعم مقدرش ينفّذ طلبك',reason?('السبب: '+reason):'كلمنا لو محتاج مساعدة']};
    var m=M[st];if(!m)return;
    var body={app_id:app,target_channel:'push',include_aliases:{external_id:[did]},headings:{en:m[0],ar:m[0]},contents:{en:m[1],ar:m[1]},
      ttl:43200,priority:10,web_push_topic:'rr'+String(id).replace(/[^A-Za-z0-9]/g,''),collapse_id:'rr'+String(id).replace(/[^A-Za-z0-9]/g,'')};
    if(site)body.url=site.split('#')[0]+'#track='+id;
    var rs=UrlFetchApp.fetch('https://api.onesignal.com/notifications?c=push',{method:'post',contentType:'application/json',headers:{Authorization:'Key '+key},payload:JSON.stringify(body),muteHttpExceptions:true});
    var rc=rs&&rs.getResponseCode?rs.getResponseCode():200;pushLog_(id,st,rc,rc>=300&&rs.getContentText?String(rs.getContentText()).slice(0,160):'');
  }catch(e){pushLog_(id,st,0,String(e&&e.message||e).slice(0,160));}
}
/* ── مراقبة الإشعارات: أي فشل بيتسجّل في ورقة PushLog، والداشبورد بتعرض الحالة، وبيجيلك إيميل (مرة كل ٦ ساعات) لو المفتاح/الحساب فيه مشكلة ── */
function pushLog_(id,st,code,msg){try{var P=PropertiesService.getScriptProperties(),now=Date.now();
  if(code>=200&&code<300){P.setProperty('PUSH_LAST',JSON.stringify({ok:true,t:now}));CacheService.getScriptCache().remove('ph_v1');return;}
  var s=sh_('PushLog',['time','order','status','code','msg']);s.appendRow([new Date(now),safe_(id,20),st,code,safe_(msg,160)]);if(s.getLastRow()>400)s.deleteRows(2,150);
  P.setProperty('PUSH_LAST',JSON.stringify({ok:false,t:now,code:code,msg:String(msg).slice(0,120)}));CacheService.getScriptCache().remove('ph_v1');
  if((code===401||code===403||code===0)&&rl_('push_mail',1,21600))alertMail_('⚠️ إشعارات العملاء مش بتتبعت','OneSignal رجّع خطأ '+code+': '+String(msg).slice(0,200)+'\n\nراجع Script properties: ONESIGNAL_APP_ID و ONESIGNAL_API_KEY (ممكن المفتاح اتغيّر أو الحساب فيه مشكلة).');
}catch(e){}}
function pushHealth_(){var c=CacheService.getScriptCache(),j=c.get('ph_v1');if(j){try{return JSON.parse(j);}catch(_){}}
  var P=PropertiesService.getScriptProperties(),conf=!!(P.getProperty('ONESIGNAL_APP_ID')&&P.getProperty('ONESIGNAL_API_KEY')),last=null;try{last=JSON.parse(P.getProperty('PUSH_LAST')||'null');}catch(_){}
  var ss=SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PushLog'),f24=0,rec=[];
  if(ss&&ss.getLastRow()>1){var n=ss.getLastRow()-1,v=ss.getRange(Math.max(2,ss.getLastRow()-99),1,Math.min(100,n),5).getValues(),lim=Date.now()-864e5;
    v.forEach(function(r){if(new Date(r[0]).getTime()>=lim)f24++;});rec=v.slice(-6).reverse().map(function(r){return {t:new Date(r[0]).getTime(),id:String(r[1]),st:String(r[2]),code:+r[3],msg:String(r[4]||'')};});}
  var state=!conf?'off':(last&&!last.ok&&(last.code===401||last.code===403||last.code===0))?'bad':(f24>0||(last&&!last.ok))?'warn':last?'ok':'idle';
  var res={configured:conf,state:state,last:last,fails24:f24,recent:rec};c.put('ph_v1',JSON.stringify(res),60);return res;}
function pushTest(){push_(PropertiesService.getScriptProperties().getProperty('TEST_DID')||'','TEST','confirmed','delivery','');}   // ضيف Script property اسمها TEST_DID وقيمتها localStorage.rr_did من متصفحك (Console ▸ localStorage.rr_did)
/* ── ربط الحساب بالجهاز: النقاط ماتتشافش ولا تتبدّل إلا من جهاز عمل طلب بالرقم ده (did اتخزّن مع الطلب) ── */
var DID_RE=/^[a-f0-9]{32}$/;
function tkCols_(){var t=tk_(),n=t.getLastRow();if(n<2)return {n:0,P:[],S:[],D:[]};return {n:n-1,P:t.getRange(2,4,n-1,1).getValues(),S:t.getRange(2,16,n-1,1).getValues(),D:t.getRange(2,23,n-1,1).getValues()};}
function ownsPhone_(ph,did){did=String(did||'');if(!DID_RE.test(did)||ph.length!==11)return false;var c=CacheService.getScriptCache(),k='own_'+ph+'_'+did;if(c.get(k))return true;
  if(!rl_('own_scan',300,600))return false;   // حد لعدد الفحوصات عشان محدش يستنزف الشيت بمحاولات تخمين
  var X=tkCols_();for(var i=X.n-1;i>=0;i--)if(String(X.D[i][0])===did&&norm_(X.P[i][0])===ph){c.put(k,'1',900);return true;}return false;}
/* ── حظر وتنبيه الأرقام (ورقة Blocklist) ── */
var STRIKES_BLOCK=3;   // عدد التنبيهات اللي بيتحظر عندها الرقم تلقائيًا
function blSh_(){var ss=SpreadsheetApp.getActiveSpreadsheet(),s=ss.getSheetByName('Blocklist');if(!s){s=ss.insertSheet('Blocklist');s.getRange('A:A').setNumberFormat('@');s.appendRow(['phone','strikes','blocked','reason','by','time']);}return s;}
function blMap_(){var c=CacheService.getScriptCache(),j=c.get('bl_v1');if(j){try{return JSON.parse(j);}catch(_){}}
  var m={};rows_(blSh_()).forEach(function(r){var p=norm_(r[0]);if(p.length===11)m[p]={s:+r[1]||0,b:bool_(r[2]),reason:String(r[3]||''),by:String(r[4]||''),t:r[5]?new Date(r[5]).getTime():0};});c.put('bl_v1',JSON.stringify(m),60);return m;}
function blSave_(ph,strikes,blocked,reason,by){var s=blSh_(),v=s.getDataRange().getValues(),ix=-1;for(var i=1;i<v.length;i++)if(norm_(v[i][0])===ph){ix=i+1;break;}
  var row=[ph,strikes,!!blocked,safe_(reason,120),safe_(by,20),new Date()];if(ix<0){s.appendRow([ "'"+ph].concat(row.slice(1)));}else s.getRange(ix,1,1,6).setValues([["'"+ph].concat(row.slice(1))]);CacheService.getScriptCache().remove('bl_v1');}
function blDelete_(ph){var s=blSh_(),v=s.getDataRange().getValues();for(var i=v.length-1;i>=1;i--)if(norm_(v[i][0])===ph)s.deleteRow(i+1);CacheService.getScriptCache().remove('bl_v1');}
function cancelCounts_(){var c=CacheService.getScriptCache(),j=c.get('cc_v1');if(j){try{return JSON.parse(j);}catch(_){}}
  var t=tk_(),n=t.getLastRow(),m={};if(n>=2){var st=Math.max(2,n-2999),cnt=n-st+1,P=t.getRange(st,4,cnt,1).getValues(),S=t.getRange(st,16,cnt,1).getValues();for(var i=0;i<cnt;i++)if(String(S[i][0])==='cancelled'){var p=norm_(P[i][0]);m[p]=(m[p]||0)+1;}}
  c.put('cc_v1',JSON.stringify(m),300);return m;}
function flags_(list){var bm=blMap_(),cc=cancelCounts_(),fl={};list.forEach(function(o){var p=o.phone;if(fl[p]!==undefined)return;var x=bm[p],k=cc[p]||0;if(x||k>=2)fl[p]={s:x?x.s:0,b:x?!!x.b:false,c:k};});return fl;}
/* ── تقييم منخفض: آخر ٣ أيام (١-٢ نجمة) ── */
function lowRate_(){var c=CacheService.getScriptCache(),j=c.get('lr_v1');if(j){try{return JSON.parse(j);}catch(_){}}
  var lim=Date.now()-3*864e5,l=lastRows_(sh_('Ratings',['time','orderId','stars','comment']),200).map(function(r){return {t:new Date(r[0]).getTime(),id:String(r[1]),stars:+r[2]||0,comment:String(r[3]||'')};}).filter(function(x){return x.stars<=2&&x.t>=lim;}).reverse();
  var res={n:l.length,list:l.slice(0,15)};c.put('lr_v1',JSON.stringify(res),120);return res;}
/* ── دعوة صديق: كوبون FRIEND للصاحب الجديد + نقاط للي دعاه (بتتأكد لما طلب صاحبه يتسلّم) ── */
var REF_COUPON='FRIEND';
function refSh_(){var ss=SpreadsheetApp.getActiveSpreadsheet(),s=ss.getSheetByName('Referrals');if(!s){s=ss.insertSheet('Referrals');s.getRange('A:B').setNumberFormat('@');s.appendRow(['code','phone','created']);}return s;}
function refCodeFor_(ph){var s=refSh_(),v=rows_(s);for(var i=0;i<v.length;i++)if(norm_(v[i][1])===ph)return String(v[i][0]);
  var code='';do{code=Utilities.getUuid().replace(/-/g,'').slice(0,7).toUpperCase();}while(v.some(function(r){return String(r[0])===code;}));
  s.appendRow([code,"'"+ph,new Date()]);return code;}
function refPhone_(code){code=String(code||'').toUpperCase().trim();if(!/^[A-Z0-9]{7}$/.test(code))return '';var v=rows_(refSh_());for(var i=0;i<v.length;i++)if(String(v[i][0])===code)return norm_(v[i][1]);return '';}
function refEnsureDef_(){if(cdMap_()[REF_COUPON]!==undefined)return;cdSh_().appendRow([REF_COUPON,'fixed',30,150,true,true,'',0,true,'خصم دعوة صاحب',new Date()]);CacheService.getScriptCache().removeAll(['cd_v1','cdu_v1']);}
function refRewards_(ph){var o=sh_('Orders',['time','orderId','phone','total','points','confirmed']),n=o.getLastRow(),r={n:0,n30:0,earned:0,pending:0};if(n<2)return r;
  var V=o.getRange(2,1,n-1,6).getValues(),lim=Date.now()-30*864e5;
  for(var i=0;i<V.length;i++){if(!/^REF-/.test(String(V[i][1]))||norm_(V[i][2])!==ph)continue;r.n++;if(new Date(V[i][0]).getTime()>=lim)r.n30++;if(V[i][5]===true)r.earned+=+V[i][4];else r.pending+=+V[i][4];}return r;}
function refInfo_(ph){var cf=cfg_();if(cf.ref_on!=='true')return null;refEnsureDef_();var rw=refRewards_(ph),d=cdMap_()[REF_COUPON];
  return {code:refCodeFor_(ph),invited:rw.n,earned:rw.earned,pending:rw.pending,reward:+cf.ref_points||0,friend:d&&d.active?{type:d.type,value:d.value,min:d.min}:null};}
/* الصاحب لازم يكون جديد فعلًا (رقم وجهاز مالهمش طلبات قبل كده) ومش نفس صاحب الدعوة */
function refValidate_(b,ph){var cf=cfg_();if(cf.ref_on!=='true')return {err:'coupon_invalid'};var rp=refPhone_(b.ref);if(!rp||rp===ph)return {err:'coupon_invalid'};
  var did=String(b.did||'');if(!DID_RE.test(did))return {err:'coupon_invalid'};
  var X=tkCols_();for(var i=0;i<X.n;i++){if(String(X.S[i][0])==='cancelled')continue;if(norm_(X.P[i][0])===ph||String(X.D[i][0])===did)return {err:'coupon_not_new'};}
  return {rp:rp};}
/* ── أرشفة الطلبات القديمة (أكتر من ١٨٠ يوم) لورقة Archive: بتخلّي الشيت الأساسي خفيف. بتشتغل بس لو فيه نسخة احتياطية ناجحة في آخر ٣٦ ساعة ── */
var ARCHIVE_DAYS=180;
function arcVal_(v){return typeof v==='string'&&(/^\d+$/.test(v)||/^[=+\-@]/.test(v))?"'"+v:v;}
function archiveOld(){var P=PropertiesService.getScriptProperties(),lock=LockService.getScriptLock();
  if(!lock.tryLock(25000))return {ok:false,error:'busy'};
  try{var lb=lastBackup_();if(!lb||!lb.ok||Date.now()-lb.t>36*36e5){var e0={ok:false,error:'no_recent_backup',t:Date.now()};P.setProperty('LAST_ARCHIVE',JSON.stringify(e0));return e0;}
    var t=tk_(),n=t.getLastRow();if(n<2)return {ok:true,moved:0};
    var cut=Date.now()-ARCHIVE_DAYS*864e5,T=t.getRange(2,2,n-1,1).getValues(),S=t.getRange(2,16,n-1,1).getValues(),k=0;
    while(k<T.length&&new Date(T[k][0]).getTime()<cut&&(String(S[k][0])==='delivered'||String(S[k][0])==='cancelled'))k++;   // بنوقف عند أول طلب لسه شغّال أو أحدث من الحد
    if(k<50){var r0={ok:true,moved:0,t:Date.now()};P.setProperty('LAST_ARCHIVE',JSON.stringify(r0));return r0;}
    var cols=t.getLastColumn(),ar=sh_('Archive',TK_HEAD),before=ar.getLastRow();if(ar.getMaxColumns()<cols)ar.insertColumnsAfter(ar.getMaxColumns(),cols-ar.getMaxColumns());if(ar.getRange(1,28).getValue()!=='chg')ar.getRange(1,28).setValue('chg');ar.getRange('D:E').setNumberFormat('@');ar.getRange('U:U').setNumberFormat('@');ar.getRange('W:W').setNumberFormat('@');
    for(var f=0;f<k;f+=2000){var m=Math.min(2000,k-f),rows=t.getRange(2+f,1,m,cols).getValues().map(function(r){return r.map(arcVal_);});ar.getRange(ar.getLastRow()+1,1,m,cols).setValues(rows);}
    if(ar.getLastRow()-before!==k)throw new Error('عدد الصفوف في الأرشيف مش مطابق — الأرشفة اتوقفت من غير مسح');
    t.deleteRows(2,k);CacheService.getScriptCache().removeAll(['cc_v1']);
    var res={ok:true,moved:k,t:Date.now()};P.setProperty('LAST_ARCHIVE',JSON.stringify(res));return res;
  }catch(e){var er={ok:false,error:String(e&&e.message||e).slice(0,160),t:Date.now()};P.setProperty('LAST_ARCHIVE',JSON.stringify(er));alertMail_('⚠️ فشلت أرشفة الطلبات القديمة',er.error);return er;}
  finally{lock.releaseLock();}}
function archiveInfo_(){var P=PropertiesService.getScriptProperties(),last=null;try{last=JSON.parse(P.getProperty('LAST_ARCHIVE')||'null');}catch(_){}
  var ss=SpreadsheetApp.getActiveSpreadsheet(),a=ss.getSheetByName('Archive'),t=ss.getSheetByName('Tickets');
  return {last:last,live:t?Math.max(0,t.getLastRow()-1):0,archived:a?Math.max(0,a.getLastRow()-1):0,days:ARCHIVE_DAYS,trigger:hasTrig_('archiveOld')};}
/* أثر تغيير الحالة على النقاط والكوبونات */
function after_(row,old,st){
  var id=String(row[0]),code=String(row[10]||''),ph=norm_(row[3]);
  var needO=(st==='delivered'||st==='cancelled'||old==='delivered'),o=sh_('Orders',['time','orderId','phone','total','points','confirmed']),ov=needO?o.getDataRange().getValues():[];
  for(var i=ov.length-1;i>=1;i--){ var oi=String(ov[i][1]);if(oi!==id&&oi!=='REF-'+id)continue;   // صف النقاط بتاع الطلب + مكافأة الدعوة المرتبطة بيه
    var op_=norm_(ov[i][2]);
    if(st==='cancelled')o.deleteRow(i+1);                       // طلب ملغي: مفيش نقاط
    else o.getRange(i+1,6).setValue(st==='delivered');          // تم التسليم: النقاط تتأكد
    balDrop_(op_);
  }
  if(st==='cancelled'&&old!=='cancelled'&&code){               // طلب ملغي: نفك الكوبون عشان العميل يقدر يستخدمه تاني
    if(/^RR-/.test(code)){var r=sh_('Redeem',['time','phone','points','value','code','used']),rv=r.getDataRange().getValues();
      for(var j=1;j<rv.length;j++)if(String(rv[j][4])===code)r.getRange(j+1,6).setValue(false);}
    else{var c=sh_('Coupons',['code','phone','time','key']),cv=c.getDataRange().getValues(),key=code+'|'+ph;
      for(var k=cv.length-1;k>=1;k--)if(String(cv[k][3])===key)c.deleteRow(k+1);}
  }
  if(old==='cancelled'&&st!=='cancelled'&&code){               // الطلب اترجّع من الملغي: نرجّع حجز الكوبون (عشان مايتستخدمش مرتين)
    if(/^RR-/.test(code)){var r2=sh_('Redeem',['time','phone','points','value','code','used']),rv2=r2.getDataRange().getValues();
      for(var j2=1;j2<rv2.length;j2++)if(String(rv2[j2][4])===code)r2.getRange(j2+1,6).setValue(true);}
    else{var d2=cdMap_()[code];if(d2&&d2.first&&!used_(code+'|'+ph))sh_('Coupons',['code','phone','time','key']).appendRow([code,"'"+ph,new Date(),code+'|'+ph]);}
  }
}

/* ═══ تعديل/إلغاء العميل لطلبه + طلبات بعد المدة (ورقة Changes) ═══
 *  - خلال المدة (إعداد edit_min، افتراضي ٥ دقايق): العميل يعدّل الكميات/الملاحظات أو يلغي بنفسه، والتعديل بيتطبّق فورًا + تنبيه للداشبورد (status=pending لحد ما حد يضغط «تم الاطلاع»).
 *  - بعد المدة: العميل بيبعت «طلب» (req_edit / req_cancel) والداشبورد تعرضه popup وتقبله (بيتنفّذ) أو ترفضه (بسبب) والعميل بيستنى ويتبلّغ.
 *  - السيرفر هو المرجع: العميل مايقدرش يغيّر سعر ولا يضيف صنف — بس يعدّل كمية/يشيل صنف/ملاحظة، والأسعار بتتاخد من الطلب المسجّل. */
var CH_HEAD=['cid','time','orderId','name','phone','kind','detail','status','by','handled','reason'];
var EDITABLE=['new','confirmed','preparing'];
function chgParse_(v){if(!v)return null;try{var o=JSON.parse(String(v));return o&&o.k?o:null;}catch(_){return null;}}
function editMs_(){var m=cfg_().edit_min;m=(m===''||m==null||isNaN(+m))?5:+m;return (m>0?Math.min(m,60):0)*60000;}
function chSh_(){var ss=SpreadsheetApp.getActiveSpreadsheet(),s=ss.getSheetByName('Changes');if(!s){s=ss.insertSheet('Changes');s.getRange('A:A').setNumberFormat('@');s.getRange('E:E').setNumberFormat('@');s.appendRow(CH_HEAD);}return s;}
function chAdd_(id,name,ph,kind,detail,status){var cid='c'+Utilities.getUuid().replace(/-/g,'').slice(0,9),d=JSON.stringify(detail||{});
  if(d.length>40000)d=JSON.stringify({note:String(detail&&detail.note||'').slice(0,500),diff:(detail&&detail.diff||[]).slice(0,40),big:true});
  chSh_().appendRow([cid,new Date(),safe_(id,20),safe_(name,80),"'"+ph,kind,d,status,'','','']);CacheService.getScriptCache().remove('ch_v1');return cid;}
function chFind_(cid){var s=chSh_(),n=s.getLastRow();if(n<2)return null;var v=s.getRange(2,1,n-1,1).getValues();
  for(var i=v.length-1;i>=0;i--)if(String(v[i][0])===cid){var r=i+2;return {s:s,r:r,v:s.getRange(r,1,1,11).getValues()[0]};}return null;}
function chObj_(r){var d={};try{d=JSON.parse(r[6]||'{}');}catch(_){}return {cid:String(r[0]),t:new Date(r[1]).getTime(),id:String(r[2]),name:String(r[3]),phone:norm_(r[4]),kind:String(r[5]),d:d,status:String(r[7]),by:String(r[8]||''),reason:String(r[10]||'')};}
function chPending_(){var c=CacheService.getScriptCache(),j=c.get('ch_v1');if(j){try{return JSON.parse(j);}catch(_){}}
  var lim=Date.now()-12*36e5,l=lastRows_(chSh_(),150).map(chObj_).filter(function(x){return x.status==='pending'&&x.t>lim;}).sort(function(a,b){return a.t-b.t;}).slice(0,40);
  var js=JSON.stringify(l);if(js.length<90000)c.put('ch_v1',js,30);return l;}
function setChg_(t,r,o){t.getRange(r,28).setValue(o?JSON.stringify(o):'');}
function itN_(i){return {n:String(i.n||''),q:+i.q||0,p:+i.p||0,o:(i.o||[]).map(String),t:String(i.t||'')};}
/* بيحسب الطلب بعد التعديل: inp = {items:[{i:رقم الصنف في الطلب, q:الكمية الجديدة (0 = شيله), }], notes} */
function edCalc_(v,inp,force){
  var old=[];try{old=JSON.parse(v[7]||'[]').map(itN_);}catch(_){}
  if(!old.length||!inp||!inp.items||!inp.items.length||inp.items.length>old.length)return {err:'bad_items'};
  var by={};
  for(var k=0;k<inp.items.length;k++){var x=inp.items[k]||{},ix=+x.i,q=Math.round(+x.q);
    if(!(ix>=0&&ix<old.length)||ix!==Math.floor(ix)||by[ix]!==undefined||!(q>=0&&q<=30))return {err:'bad_items'};by[ix]=q;}
  var out=[],diff=[];
  for(var m=0;m<old.length;m++){var o=old[m],nq=by[m]===undefined?o.q:by[m];
    if(nq!==o.q)diff.push(nq?(o.n+': من '+o.q+' لـ '+nq):(o.n+': اتشال'));
    if(nq)out.push({n:o.n,q:nq,p:o.p,o:o.o,t:o.t});}
  if(!out.length)return {err:'empty'};
  var oldN=String(v[14]||'').trim(),nn=inp.notes==null?oldN:String(inp.notes).replace(/\s+/g,' ').trim().slice(0,400),nch=nn!==oldN;
  if(nch)diff.push('الملاحظات: '+(nn||'اتمسحت'));
  if(!diff.length)return {err:'nochange'};
  var sub=0;out.forEach(function(i){sub+=i.p*i.q;});
  var fee=+v[11]||0,od=+v[9]||0,cp=String(v[10]||''),nd=0;
  if(od>0){nd=Math.min(od,sub);
    if(cp&&!/^RR-/.test(cp)){var d=cdMap_()[cp];
      if(d&&d.min&&sub<d.min){if(!force)return {err:'coupon_min',min:d.min};}
      else if(d)nd=Math.min(sub,cdDisc_(d,sub));}}
  return {old:old,items:out,diff:diff,sub:sub,nd:nd,fee:fee,tot:sub-nd+fee,oldTot:+v[12]||0,notes:nn,nch:nch};}
function edWrite_(t,r,v,c,id,ph,who){
  var lg=String(v[19]||'');
  t.getRange(r,8,1,6).setValues([[JSON.stringify(c.items),c.sub,c.nd,v[10],c.fee,c.tot]]);   // الأصناف + المجموع + الخصم + الكوبون + التوصيل + الإجمالي
  if(c.nch)t.getRange(r,15).setValue(safe_(c.notes,400));
  t.getRange(r,20).setValue((lg?lg+';':'')+'cedit@'+who+'@'+Date.now());
  var o=sh_('Orders',['time','orderId','phone','total','points','confirmed']),ov=o.getDataRange().getValues(),base=Math.max(0,c.sub-c.nd);
  for(var i=ov.length-1;i>=1;i--)if(String(ov[i][1])===id){o.getRange(i+1,4,1,2).setValues([[base,Math.round(base*EARN_PER_EGP)]]);break;}   // النقاط تتحسب على المجموع الجديد
  balDrop_(ph);}
function tkCancel_(t,r,v,reason,who){var n=new Date(),old=String(v[15]),hist=String(v[17]||''),lg=String(v[19]||'');
  t.getRange(r,16,1,5).setValues([['cancelled',n,(hist?hist+';':'')+'cancelled@'+n.getTime(),safe_(reason,150),(lg?lg+';':'')+'cancelled@'+who+'@'+n.getTime()]]);after_(v,old,'cancelled');}
/* ═══ إدارة الطيارين من الداشبورد (بدل كتابة النص يدويًا) ═══ */
function drvRaw_(l){return l.map(function(d){return d.id+':'+d.name+(d.phone?':'+d.phone:'');}).join(', ');}
function cfgSet_(k,v){var s=setSh_(),d=s.getDataRange().getValues(),ix=0;for(var i=1;i<d.length;i++)if(String(d[i][0])===k){ix=i+1;break;}
  if(ix)s.getRange(ix,2).setValue(String(v));else s.appendRow([k,String(v)]);CacheService.getScriptCache().remove('set_v1');}
function drvOut_(){var c=cfg_();return {ok:true,ot_key:c.ot_key,raw:c.drivers,drivers:drv_().map(function(d){d.tok=drvTok_(d.id);return d;})};}

function doGet(e){
  var p=(e&&e.parameter)||{}, a=p.action;
  if(a==='check'){var c=String(p.code||'').toUpperCase().trim(),ph=norm_(p.phone);if(!c||ph.length!==11)return out_({ok:false});return out_({ok:true,used:used_(c+'|'+ph)});}
  if(a==='points'){var ph2=norm_(p.phone);if(ph2.length!==11)return out_({ok:false});
    if(!ownsPhone_(ph2,p.did))return out_({ok:true,locked:true});   // الرصيد بيظهر بس للجهاز اللي طلب بالرقم ده
    var b=balance_(ph2);return out_({ok:true,points:b.points,pending:b.pending,ref:refInfo_(ph2)});}
  if(a==='validate'){var vk_='val_bad_'+(norm_(p.phone).length===11?norm_(p.phone):'anon');if(+(CacheService.getScriptCache().get(vk_)||0)>=(vk_==='val_bad_anon'?150:40))return out_({ok:false,error:'busy'});var code=String(p.code||'').toUpperCase().trim(),f=null;rows_(sh_('Redeem',['time','phone','points','value','code','used'])).forEach(function(r){if(String(r[4])===code)f=r;});
    if(!f){rl_(vk_,200,600);return out_({ok:true,valid:false});}return out_({ok:true,valid:f[5]!==true,used:f[5]===true,value:+f[3]});}
  if(a==='track'){var tid=String(p.id||'').toUpperCase().trim(),tph=norm_(p.phone);if(!tid||tph.length!==11)return out_({ok:false});
    var hit=null;lastRows_(tk_(),1500).forEach(function(r){if(String(r[0]).toUpperCase()===tid&&norm_(r[3])===tph)hit=r;});
    if(!hit)return out_({ok:true,found:false});var t=tkObj_(hit);
    return out_({ok:true,found:true,order:{id:t.id,time:t.time,type:t.type,status:t.status,updated:t.updated,history:t.history,items:t.items,subtotal:t.subtotal,discount:t.discount,fee:t.fee,total:t.total,payment:t.payment,paid:t.paid,hasRef:!!t.payref,eta:(function(){var ea=eta_(),bs=t.type==='pickup'?ea.pickup:((ea.areas||{})[t.area]||ea.delivery);return bs?bs+(t.type==='pickup'?0:(+cfg_().busy_extra||0)):null;})(),reason:t.status==='cancelled'?t.reason:'',notes:t.notes,chg:t.chg?{k:t.chg.k,s:t.chg.s,r:t.chg.r||'',t:t.chg.t||0}:null,canEdit:(EDITABLE.indexOf(t.status)>=0&&editMs_()>0&&!(t.chg&&t.chg.s==='pending')&&Date.now()-t.time<=editMs_()),winLeft:Math.max(0,t.time+editMs_()-Date.now()),editMin:Math.round(editMs_()/60000)}});}
  if(a==='drvpos'){var dpi=String(p.id||'').toUpperCase().trim(),dph=norm_(p.phone);if(!dpi||dph.length!==11)return out_({ok:false});if(!rl_('dp_'+dph,200,600))return out_({ok:false,error:'busy'});
    var dh=null;lastRows_(tk_(),1500).forEach(function(r){if(String(r[0]).toUpperCase()===dpi&&norm_(r[3])===dph)dh=r;});
    if(!dh||String(dh[15])!=='out'||String(dh[5])==='pickup')return out_({ok:true,on:false});
    var dcc=CacheService.getScriptCache(),ddv=dcc.get('odrv_'+dpi);if(!ddv)return out_({ok:true,on:false});
    var dl=dcc.get('otl_'+ddv);if(!dl)return out_({ok:true,on:true,name:drvName_(ddv),lat:null});
    var dj=JSON.parse(dl);return out_({ok:true,on:true,name:drvName_(ddv),lat:dj.lat,lon:dj.lon,age:Math.max(0,Math.round((Date.now()-dj.t)/1000)),dlat:(dh[24]===''||dh[24]==null)?null:+dh[24],dlon:(dh[25]===''||dh[25]==null)?null:+dh[25]});}
  if(a==='menuov'){var mo=movList_();return out_({ok:true,ver:mo.ver,items:mo.items});}   // تعديلات المنيو (عامة: أسعار/صور/وصف/أصناف جديدة)
  if(a==='drvorders'){var ddr=drvChk_(p.d,p.t);if(!ddr)return out_({ok:false});if(!rl_('do_'+ddr,900,600))return out_({ok:false,error:'busy'});   // صفحة الطيار: طلباته بس
    var dds=dayStart_(Date.now()),ddo=lastRows_(tk_(),300).map(tkObj_).filter(function(o){return o.drv===ddr;}),
      dsl=function(o){return {id:o.id,time:o.time,name:o.name,phone:o.phone,address:o.address,area:o.area,items:o.items,total:o.total,payment:o.payment,paid:o.paid,notes:o.notes,lat:o.lat,lon:o.lon};},
      ddn=ddo.filter(function(o){return o.status==='delivered'&&o.updated>=dds;});
    return out_({ok:true,name:drvName_(ddr),orders:ddo.filter(function(o){return o.status==='out';}).sort(function(x,y){return x.time-y.time;}).map(dsl),today:{n:ddn.length,cash:ddn.reduce(function(s,o){return s+(o.payment==='cash'?o.total:0);},0)}});}
  if(a==='coupons'){var cm=cdMap_(),cl=[],cu=cdUsesAll_(false);Object.keys(cm).forEach(function(k){var d=cm[k];if(d.active&&!d.hidden&&(!d.expires||d.expires>Date.now())&&(!d.maxUses||(cu[k]||0)<d.maxUses))cl.push(cdPub_(d));});return out_({ok:true,coupons:cl});}
  if(a==='couponDef'){var cc=String(p.code||'').toUpperCase().trim().slice(0,30);if(!cc||/^RR-/.test(cc))return out_({ok:false});
    var ck_='cd_bad_'+(norm_(p.phone).length===11?norm_(p.phone):'anon');if(+(CacheService.getScriptCache().get(ck_)||0)>=(ck_==='cd_bad_anon'?150:40))return out_({ok:false,error:'busy'});
    var cd=cdMap_()[cc],er=cdCheck_(cd,0,false);if(er==='coupon_min')er='';if(!er&&cc===REF_COUPON&&cfg_().ref_on!=='true')er='coupon_invalid';   // الحد الأدنى بيتتحقق منه الموقع حسب السلة
    if(er){if(!cd)rl_(ck_,200,600);return out_({ok:true,found:false,reason:er});}return out_({ok:true,found:true,def:cdPub_(cd)});}
  if(a==='eta'){return out_({ok:true,eta:eta_(),busy:+cfg_().busy_extra||0});}
  if(a==='config'){return out_(pubCfg_());}
  if(a==='suggest'){return out_(suggest_());}
  if(a==='soldout'){return out_({ok:true,list:soRows_().map(function(x){return x.name;})});}
  if(a==='top'){var c=CacheService.getScriptCache(),j=c.get('top_v1');if(j)return out_(JSON.parse(j));
    var cnt={};lastRows_(tk_(),1500).forEach(function(r){if(String(r[15])==='cancelled')return;try{JSON.parse(r[7]||'[]').forEach(function(i){var n=String(i.n||'').replace(/\s*\(.*\)\s*$/,'').trim();if(n)cnt[n]=(cnt[n]||0)+(+i.q||1);});}catch(_){}});
    var top=Object.keys(cnt).sort(function(x,y){return cnt[y]-cnt[x];}).slice(0,8),res={ok:true,top:top};c.put('top_v1',JSON.stringify(res),3600);return out_(res);}
  return out_({ok:true,service:'rr'});
}
/* ===== إدارة المنيو من الداشبورد: تعديل سعر/وصف/صورة، إخفاء، وأصناف جديدة (ورقة MenuOv) ===== */
function movSh_(){return sh_('MenuOv',['key','name','prices','hidden','img','desc','sec','added','by','updated']);}
function movList_(){var c=CacheService.getScriptCache(),j=c.get('mov_v1');if(j){try{return JSON.parse(j);}catch(_){}}
  var items=[],mx=0;rows_(movSh_()).forEach(function(r){if(!r[0])return;var p=String(r[2]==null?'':r[2]).split('/').map(Number).filter(function(x){return x>0;}),u=+r[9]||0;if(u>mx)mx=u;
    items.push({k:String(r[0]),n:String(r[1]),p:p,h:String(r[3])==='true',i:String(r[4]||''),d:String(r[5]||''),s:String(r[6]||''),a:String(r[7])==='true'});});
  var o={ver:items.length?mx+'-'+items.length:'',items:items};c.put('mov_v1',JSON.stringify(o),300);return o;}
function menuSet_(b){var ma=authAny_(b);if(ma.err)return out_({ok:false,error:ma.err});if(ma.role!=='manager')return out_({ok:false,error:'forbidden'});
  var nm=String(b.name||'').replace(/\s+/g,' ').trim().slice(0,120);if(!nm)return out_({ok:false,error:'bad_name'});var key=nm_(nm);
  var ps=[],raw=String(b.prices==null?'':b.prices).trim();
  if(raw){ps=raw.split('/').map(function(x){return +String(x).trim();}).filter(function(x){return x>0&&x<=5000;});if(!ps.length||ps.length>4)return out_({ok:false,error:'bad_price'});}
  if(b.added&&ps.length!==1)return out_({ok:false,error:'bad_price'});
  var img=String(b.img||'').trim();if(img&&!/^https:\/\/[^\s"'<>\\]{4,290}$/.test(img))return out_({ok:false,error:'bad_img'});
  var lk=LockService.getScriptLock();try{lk.waitLock(5000);}catch(_){return out_({ok:false,error:'busy'});}
  try{var sh=movSh_();if(sh.getLastRow()<2)sh.getRange('A:H').setNumberFormat('@');
    var v=sh.getDataRange().getValues(),ri=0;for(var i=1;i<v.length;i++)if(String(v[i][0])===key){ri=i+1;break;}
    if(b.remove){if(ri)sh.deleteRow(ri);}
    else{var row=[key,safe_(nm,120),ps.join('/'),b.hidden?'true':'',img,safe_(String(b.desc||'').replace(/\s+/g,' ').trim(),200),safe_(String(b.sec||''),60),b.added?'true':'',ma.user,Date.now()];
      if(ri)sh.getRange(ri,1,1,10).setValues([row]);else sh.appendRow(row);
      if(ps.length){var mp=sh_('MenuPrices',['name','price','updated']),mv=mp.getDataRange().getValues(),mi=0,mn=Math.min.apply(null,ps);   // السعر المعتمد لتحقق السيرفر من الطلبات
        for(var z=1;z<mv.length;z++)if(nm_(mv[z][0])===key){mi=z+1;break;}if(mi)mp.getRange(mi,2,1,2).setValues([[mn,new Date()]]);else mp.appendRow([safe_(nm,120),mn,new Date()]);}}
  }finally{lk.releaseLock();}
  var cc=CacheService.getScriptCache();cc.remove('mov_v1');cc.remove('mp_v1');
  audit_({action:'menuSet',user:ma.user,name:nm,prices:raw,hidden:b.hidden,img:img,desc:b.desc,added:b.added,remove:b.remove},{},{});
  return out_({ok:true,menu:movList_()});}
/* ===== صفحة الطيار + سجل المراجعة + مسار الطلب ===== */
var DRV_AUTH_='';
function authAny_(b){if(DRV_AUTH_&&b&&b.user===DRV_AUTH_&&b.action==='setStatus'&&b.status==='delivered')return {role:'staff',user:DRV_AUTH_,name:DRV_AUTH_};return authAny0_(b);}   // الطيار يقدر «يسلّم» طلباته بس
function drvTok_(id){var k=cfg_().ot_key;return k?hash_(k+'|drvpage',id).slice(0,24):'';}
function drvChk_(id,tok){id=String(id||'').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,8);var t=drvTok_(id);return(id&&t&&drvName_(id)&&String(tok||'')===t)?id:'';}
var AUD_={setStatus:1,setPaid:1,settingsSave:1,couponSave:1,couponDelete:1,staffSave:1,setSoldout:1,soldoutClear:1,areasSave:1,backupNow:1,custFlag:1};
var EVS_=['visit','cart','checkout','submit','order'];
function audit_(b,pre,j){try{var A=b.action,t='',d='';
  if(A==='setStatus'){t=b.id;d=(pre.old||'?')+'→'+b.status+(b.driver?' · طيار '+b.driver:'')+(b.reason?' · '+String(b.reason).slice(0,60):'');}
  else if(A==='setPaid'){t=b.id;d=b.paid!==false?'مدفوع':'غير مدفوع';}
  else if(A==='settingsSave'){var n=cfg_(),o=pre.cfg||{},ch=[];Object.keys(n).forEach(function(k){if(String(n[k])!==String(o[k]))ch.push(k==='ot_key'?'ot_key (اتغيّر)':k+': '+o[k]+'→'+n[k]);});d=ch.join(' | ')||'من غير تغيير';t='الإعدادات';}
  else if(A==='couponSave'||A==='couponDelete'){t=String(b.code||'');d=A==='couponDelete'?'حذف':(b.type+' '+b.value+(b.min?' · حد أدنى '+b.min:''));}
  else if(A==='staffSave'){t=String(b.username||'');d=(b.password?'باسورد جديد · ':'')+(b.active===false?'تعطيل':'حفظ');}
  else if(A==='setSoldout'){t=String(b.name||'');d=b.soldout===false?'رجّعه':'وقّفه'+(+b.until>0?' مؤقتًا':'');}
  else if(A==='soldoutClear'){t='كل الأصناف';d='رجّع الكل';}
  else if(A==='areasSave'){t='المناطق';d=(b.areas||[]).length+' منطقة';}
  else if(A==='custFlag'){t=String(b.phone||'');d=String(b.op||'')+(b.reason?' · '+String(b.reason).slice(0,60):'');}
  else if(A==='menuSet'){t=String(b.name||'');d=b.remove?'رجّع الأصلي / حذف':(b.added?'صنف جديد · ':'')+(b.prices?'سعر '+b.prices:'')+(b.hidden?' · مخفي':'')+(b.img?' · صورة':'')+(b.desc?' · وصف':'');}
  else if(A==='drvSave'||A==='drvDelete'){t=String(b.id||b.name||'');d=A==='drvDelete'?'حذف طيار':'حفظ طيار '+String(b.name||'');}
  else if(A==='chResolve'){t=String(b.id||b.cid||'');d=String(b.op||'')+(b.reason?' · '+String(b.reason).slice(0,60):'');}
  else if(A==='backupNow'){t='نسخة احتياطية';}
  var s=sh_('Audit',['time','user','action','target','detail']);s.appendRow([new Date(),String(b.user||''),A,safe_(t,80),safe_(d,300)]);
  if(s.getLastRow()>6000)s.deleteRows(2,1000);}catch(_){}}
function evRec_(b){var sid=String(b.sid||''),ev=String(b.e||'');if(!/^[a-z0-9]{8,32}$/.test(sid)||EVS_.indexOf(ev)<0)return out_({ok:false});
  var cc=CacheService.getScriptCache(),day=Utilities.formatDate(new Date(),'Africa/Cairo','yyyy-MM-dd'),k='evd_'+day+sid+ev;if(cc.get(k))return out_({ok:true,dup:true});
  if(!rl_('ev_'+sid,30,3600))return out_({ok:false});cc.put(k,'1',21600);
  var lk=LockService.getScriptLock();try{lk.waitLock(3000);}catch(_){return out_({ok:false});}
  try{var s=sh_('Funnel',['day','event','count']);if(s.getLastRow()<2)s.getRange('A:A').setNumberFormat('@');
    var n=s.getLastRow(),ix=0;if(n>=2){var v=s.getRange(Math.max(2,n-9),1,Math.min(n-1,10),3).getValues();for(var i=v.length-1;i>=0;i--)if(String(v[i][0])===day&&v[i][1]===ev){ix=Math.max(2,n-9)+i;break;}}
    if(ix)s.getRange(ix,3).setValue((+s.getRange(ix,3).getValue()||0)+1);else s.appendRow([day,ev,1]);}finally{lk.releaseLock();}
  return out_({ok:true});}
function drvDeliver_(b){var di=drvChk_(b.d,b.t);if(!di)return out_({ok:false,error:'auth'});if(!rl_('dd_'+di,200,600))return out_({ok:false,error:'busy'});
  var id=String(b.id||''),t=tk_(),r=findRow_(t,id);if(!r)return out_({ok:false,error:'not_found'});
  var row=t.getRange(r,1,1,27).getValues()[0];if(String(row[26])!==di||String(row[15])!=='out')return out_({ok:false,error:'forbidden'});
  var u='driver:'+di,body={action:'setStatus',user:u,id:id,status:'delivered'};DRV_AUTH_=u;
  try{var o=doPost_({postData:{contents:JSON.stringify(body)},parameter:{}}),j=JSON.parse(o.getContent());if(j&&j.ok)audit_(body,{old:'out'},j);return o;}finally{DRV_AUTH_='';}}
function doPost(e){
  var b={};try{b=JSON.parse(e.postData.contents);}catch(_){}
  var A=b&&b.action;
  if(A==='ev')return evRec_(b);
  if(A==='drvDeliver')return drvDeliver_(b);
  if(A==='menuSet')return menuSet_(b);
  if(A==='auditList'){var au=authAny_(b);if(au.err)return out_({ok:false,error:au.err});if(au.role!=='manager')return out_({ok:false,error:'forbidden'});
    return out_({ok:true,rows:lastRows_(sh_('Audit',['time','user','action','target','detail']),300).reverse().map(function(r){return {t:new Date(r[0]).getTime(),u:String(r[1]),a:String(r[2]),id:String(r[3]),d:String(r[4])};})});}
  if(A==='funnel'){var fa=authAny_(b);if(fa.err)return out_({ok:false,error:fa.err});if(fa.role!=='manager')return out_({ok:false,error:'forbidden'});
    var f0=String(b.from||''),f1=String(b.to||'9999'),cnt={};EVS_.forEach(function(k){cnt[k]=0;});
    rows_(sh_('Funnel',['day','event','count'])).forEach(function(r){var dd=String(r[0]);if(dd>=f0&&dd<=f1&&cnt[r[1]]!==undefined)cnt[r[1]]+=+r[2]||0;});return out_({ok:true,counts:cnt});}
  var pre=null;if(AUD_[A]){pre={};try{if(A==='settingsSave')pre.cfg=JSON.parse(JSON.stringify(cfg_()));else if(A==='setStatus'){var rr=findRow_(tk_(),String(b.id||''));if(rr)pre.old=String(tk_().getRange(rr,16).getValue());}}catch(_){}}
  var out=doPost_(e);
  if(pre){try{var j=JSON.parse(out.getContent());if(j&&j.ok!==false){audit_(b,pre,j);
    if(A==='setStatus'&&b.status==='out'&&b.driver!==undefined){var dv=String(b.driver||'').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,8),rw=findRow_(tk_(),String(b.id||''));if(rw)tk_().getRange(rw,27).setValue(dv&&drvName_(dv)?dv:'');}}}catch(_){}}   // الطيار بيتسجّل على الطلب نفسه (للتقارير وصفحة الطيار)
  return out;}
function doPost_(e){
  var b={};try{b=JSON.parse(e.postData.contents);}catch(_){}
  if(b&&b._type){   // OwnTracks (HTTP mode): الموقع بيتخزّن في الكاش بس، والمفتاح السري في الرابط
    var otq_=(e&&e.parameter)||{},otk_=cfg_().ot_key;
    if(otk_&&String(otq_.k||'')===otk_&&b._type==='location'&&b.lat!=null&&b.lon!=null&&!(+b.acc>300)){
      var otd_=String(b.tid||otq_.d||'').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,8);
      if(otd_&&drvName_(otd_))CacheService.getScriptCache().put('otl_'+otd_,JSON.stringify({lat:+b.lat,lon:+b.lon,t:(+b.tst?+b.tst*1000:Date.now()),v:+b.vel||0}),21600);}
    return ContentService.createTextOutput('[]').setMimeType(ContentService.MimeType.JSON);}
  /* قراءة الداشبورد (من غير قفل عشان تبقى سريعة) */
  if(b.action==='adminList'){var au=authAny_(b);if(au.err)return out_({ok:false,error:au.err});
    var all=lastRows_(tk_(),300).map(tkObj_);all.sort(function(x,y){return y.time-x.time;});
    var dl_=(function(){var cc=CacheService.getScriptCache(),ds=drv_(),seen={},pos={},asg={},outs=all.filter(function(o){return o.status==='out'&&o.type!=='pickup';}).slice(0,60),
      ks=ds.map(function(d){return 'otl_'+d.id;}).concat(outs.map(function(o){return 'odrv_'+String(o.id).toUpperCase();})),g=ks.length?cc.getAll(ks):{};
      ds.forEach(function(d){var v=g['otl_'+d.id];if(v){try{var j=JSON.parse(v);seen[d.id]=Math.round((Date.now()-j.t)/1000);pos[d.id]=[j.lat,j.lon];}catch(_){}}});
      outs.forEach(function(o){var v=g['odrv_'+String(o.id).toUpperCase()];if(v)asg[o.id]=v;});return {seen:seen,pos:pos,asg:asg};})();   // مين الطيارين لايف وكل طيار معاه أنهي طلبات
    var exl={ok:true,orders:all,soldout:soRows_(),now:Date.now(),role:au.role,name:au.name,user:au.user,flags:flags_(all),drivers:drv_(),dseen:dl_.seen,dpos:dl_.pos,dasg:dl_.asg,changes:chPending_()};
    if(au.role==='manager'){exl.drivers=drv_().map(function(d){d.tok=drvTok_(d.id);return d;});exl.low=lowRate_();exl.pushBad=pushHealth_().state==='bad';}
    return out_(exl);}
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
  if(b.action==='pushStatus'){var aq=authAny_(b);if(aq.err)return out_({ok:false,error:aq.err});
    var qid=String(b.id||''),qst=String(b.status||'');if(STATUSES.indexOf(qst)<0)return out_({ok:false,error:'bad_status'});
    var qk='psh_'+qid.replace(/[^A-Za-z0-9]/g,'')+'_'+qst,qc=CacheService.getScriptCache();if(qc.get(qk))return out_({ok:true,dup:true});
    var qt=tk_(),qr=findRow_(qt,qid);if(!qr)return out_({ok:false,error:'not_found'});var qv=qt.getRange(qr,1,1,23).getValues()[0];
    if(String(qv[15])!==qst||Date.now()-new Date(qv[16]).getTime()>180000)return out_({ok:false,error:'stale'});   // بنبعت إشعار للحالة الحالية بس وفي خلال ٣ دقايق
    qc.put(qk,'1',300);push_(String(qv[22]||''),qid,qst,String(qv[5]),qst==='cancelled'?String(qv[18]||'').slice(0,150):'');return out_({ok:true});}
  if(b.action==='backupStatus'){var bs_=authAny_(b);if(bs_.err)return out_({ok:false,error:bs_.err});if(bs_.role!=='manager')return out_({ok:false,error:'forbidden'});
    var P_=PropertiesService.getScriptProperties(),lr_=null;try{lr_=JSON.parse(P_.getProperty('LAST_REPORT')||'null');}catch(_){}
    return out_({ok:true,backup:lastBackup_(),report:lr_,backupTrigger:hasTrig_('dailyBackup'),reportTrigger:hasTrig_('dailyReport'),keep:BACKUP_KEEP,now:Date.now(),archive:archiveInfo_()});}
  if(b.action==='pushHealth'){var pH=authAny_(b);if(pH.err)return out_({ok:false,error:pH.err});if(pH.role!=='manager')return out_({ok:false,error:'forbidden'});CacheService.getScriptCache().remove('ph_v1');return out_(Object.assign({ok:true},pushHealth_()));}
  if(b.action==='blockList'){var bL=authAny_(b);if(bL.err)return out_({ok:false,error:bL.err});if(bL.role!=='manager')return out_({ok:false,error:'forbidden'});var bm0=blMap_();return out_({ok:true,list:Object.keys(bm0).map(function(k){return {phone:k,strikes:bm0[k].s,blocked:bm0[k].b,reason:bm0[k].reason,by:bm0[k].by,t:bm0[k].t};}).sort(function(x,y){return y.t-x.t;})});}
  if(b.action==='archiveNow'){var aN=authAny_(b);if(aN.err)return out_({ok:false,error:aN.err});if(aN.role!=='manager')return out_({ok:false,error:'forbidden'});if(!rl_('arc_now',3,600))return out_({ok:false,error:'busy'});var ar0=archiveOld();return out_(Object.assign({ok:ar0.ok,archive:archiveInfo_()},ar0.ok?{}:{error:ar0.error}));}
  if(b.action==='backupNow'){var bn_=authAny_(b);if(bn_.err)return out_({ok:false,error:bn_.err});if(bn_.role!=='manager')return out_({ok:false,error:'forbidden'});
    if(!rl_('bk_now',3,600))return out_({ok:false,error:'busy'});var okb=dailyBackup();return out_({ok:okb,backup:lastBackup_(),error:okb?undefined:'backup_failed'});}
  if(b.action==='reportNow'){var rn_=authAny_(b);if(rn_.err)return out_({ok:false,error:rn_.err});if(rn_.role!=='manager')return out_({ok:false,error:'forbidden'});
    if(!rl_('rp_now',5,600))return out_({ok:false,error:'busy'});
    try{var to_=dayStart_(Date.now()),rr_=b.today?report_(to_,Date.now()):report_(dayStart_(to_-72e5),to_),em_=sendReport_(rr_);return out_({ok:true,sent:em_,sales:rr_.sales,orders:rr_.valid});}catch(e){return out_({ok:false,error:'mail_failed',msg:String(e&&e.message||e).slice(0,200)});}}
  var lock=LockService.getScriptLock();lock.waitLock(10000);
  try{
    var ph=norm_(b.phone);
    if(b.action==='claim'){var c=String(b.code||'').toUpperCase().trim();if(!c||ph.length!==11)return out_({ok:false});
      return out_({ok:true,used:used_(c+'|'+ph)});}   // للقراءة بس — الحجز بيتم جوه newOrder عشان محدش يحرق كوبون حد تاني
    if(b.action==='newOrder'){
      var id=String(b.id||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,20);
      if(!id||ph.length!==11||!b.items||!b.items.length)return out_({ok:false});
      if(!open_())return out_({ok:false,error:'closed'});
      var blx=blMap_()[ph];if(blx&&blx.b)return out_({ok:false,error:'blocked'});   // رقم محظور
      var t=tk_();if(lastRows_(t,1500).some(function(r){return String(r[0])===id;}))return out_({ok:true,dup:true});
      var items=b.items.slice(0,60).map(function(i){return {n:String(i.n||'').slice(0,120),q:+i.q||1,p:+i.p||0,o:(i.o||[]).slice(0,12).map(function(x){return String(x).slice(0,80);}),t:String(i.t||'').slice(0,200)};});
      var soBad=soBad_(items);if(soBad.length)return out_({ok:false,error:'soldout',items:soBad});   // صنف موقوف: نرفض قبل ما نحجز الكوبون
      /* الأسعار: السيرفر مابيصدّقش سعر الصنف من الموقع — بيقارنه بالسعر المعلن (ورقة MenuPrices) */
      var mpm=mpMap_(),mpOn=Object.keys(mpm).length>0,mpStrict=PropertiesService.getScriptProperties().getProperty('MENU_STRICT')==='1';
      if(mpOn){for(var mi=0;mi<items.length;mi++){var mk=nm_(items[mi].n),mb=nm_(items[mi].n.replace(/\s*\(.*\)\s*$/,'')),fl=mpm[mk]!==undefined?mpm[mk]:mpm[mb];
        if(fl===undefined){if(mpStrict)return out_({ok:false,error:'bad_item',items:[items[mi].n]});continue;}
        if(items[mi].p+0.01<fl)return out_({ok:false,error:'bad_price'});}}
      /* السيرفر مابيصدّقش أرقام الموقع: المجموع لازم يطابق الأصناف، والتوصيل منطقي، والخصم مطابق للكوبون */
      var sumI=0;items.forEach(function(i){sumI+=i.p*i.q;});
      var sub=+b.subtotal||0,dsc=+b.discount||0,fee=+b.fee||0,tot=+b.total||0;
      if(Math.abs(sumI-sub)>1||fee<0||fee>150||dsc<0||dsc>sub||Math.abs(tot-(sub-dsc+fee))>1)return out_({ok:false,error:'bad_total'});
      var typN=b.type==='pickup'?'pickup':'delivery',cfN=cfg_(),areaN='';
      if(typN==='pickup'&&fee!==0)return out_({ok:false,error:'bad_total'});
      if(typN==='delivery'){
        if(cfN.pause_on==='true')return out_({ok:false,error:'delivery_paused',msg:cfN.pause_msg});
        var arN=areas_(),addrN=nm_(b.address);
        if(arN.length){var afN=null;arN.forEach(function(x){var xn=nm_(x.name);if((addrN===xn||addrN.indexOf(xn+' - ')===0)&&(!afN||xn.length>nm_(afN.name).length))afN=x;});   // المنطقة = أول جزء من العنوان (الأطول يكسب)
          if(!afN)return out_({ok:false,error:'bad_area'});
          if(!afN.active)return out_({ok:false,error:'area_closed',area:afN.name});
          if(Math.abs(fee-afN.fee)>0.5)return out_({ok:false,error:'bad_total'});
          areaN=afN.name;}
        else areaN=safe_(b.area,80);
      }
      var cp=String(b.coupon||'').toUpperCase().trim().slice(0,30),claimKey='',burnRow=0,refPhone='';
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
          if(cp===REF_COUPON){var rvv=refValidate_(b,ph);if(rvv.err)return out_({ok:false,error:rvv.err});refPhone=rvv.rp;}   // خصم دعوة الصاحب: لازم عميل جديد بكود دعوة صحيح
          if(cdf.first){claimKey=cp+'|'+ph;if(used_(claimKey))return out_({ok:false,error:'coupon_used'});}
        }
      }
      if(!rl_('ord_'+ph,6,600)||!rl_('ord_all',400,600))return out_({ok:false,error:'busy'});   // العدّاد بعد كل التحققات (المحاولات المرفوضة مابتتحسبش)
      var pay=['cash','wallet','instapay'].indexOf(b.payment)>=0?b.payment:'cash',now=new Date(),did=/^[a-f0-9]{32}$/.test(String(b.did||''))?String(b.did):'';
      if(cfg_()['pay_'+pay]==='false')return out_({ok:false,error:'pay_off'});   // طريقة الدفع مقفولة من الداشبورد
      if(claimKey)sh_('Coupons',['code','phone','time','key']).appendRow([cp,"'"+ph,now,claimKey]);
      if(burnRow)sh_('Redeem',['time','phone','points','value','code','used']).getRange(burnRow,6).setValue(true);
      var la_=+b.lat,lo_=+b.lon,loc_=(b.type!=='pickup'&&isFinite(la_)&&isFinite(lo_)&&Math.abs(la_)<=90&&Math.abs(lo_)<=180&&(la_||lo_))?{lat:+la_.toFixed(6),lon:+lo_.toFixed(6)}:{lat:'',lon:''};   // لوكيشن العميل (اختياري)
      t.appendRow([id,now,safe_(b.name,80),"'"+ph,b.phone2?"'"+norm_(b.phone2):'',b.type==='pickup'?'pickup':'delivery',safe_(b.address,400),JSON.stringify(items),
        sub,dsc,safe_(cp,30),fee,tot,pay,safe_(b.notes,400),'new',now,'new@'+now.getTime(),'','',pay==='cash'?'':"'"+String(b.payref||'').replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/[^\w\- ]/g,'').slice(0,40),false,did,areaN,loc_.lat,loc_.lon]);
      if(refPhone){var cfR=cfg_(),ptsR=Math.max(0,Math.round(+cfR.ref_points||0)),capR=Math.max(1,+cfR.ref_cap||20);   // مكافأة الداعي (قيد التأكيد لحد ما الطلب يتسلّم) بحد أقصى في الـ٣٠ يوم
        if(ptsR>0&&refRewards_(refPhone).n30<capR){var oR=sh_('Orders',['time','orderId','phone','total','points','confirmed']);oR.appendRow([now,'REF-'+id,"'"+refPhone,0,ptsR,false]);oR.getRange(oR.getLastRow(),6).insertCheckboxes();balDrop_(refPhone);}}
      return out_({ok:true});}
    if(b.action==='custEdit'||b.action==='custCancel'||b.action==='custReq'){
      var cid_=String(b.id||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,20);if(!cid_||ph.length!==11)return out_({ok:false,error:'bad_req'});
      if(!rl_('ce_'+ph,15,600))return out_({ok:false,error:'busy'});
      var ct=tk_(),cr=findRow_(ct,cid_);if(!cr)return out_({ok:false,error:'not_found'});
      var cv=ct.getRange(cr,1,1,28).getValues()[0];if(norm_(cv[3])!==ph)return out_({ok:false,error:'not_found'});
      var cst=String(cv[15]),cage=Date.now()-new Date(cv[1]).getTime(),cwin=editMs_(),cname=String(cv[2]),cch=chgParse_(cv[27]);
      if(cst==='delivered'||cst==='cancelled')return out_({ok:false,error:'closed'});
      if(cch&&cch.s==='pending')return out_({ok:false,error:'pending'});   // في طلب لسه مستني رد المطعم
      if(b.action!=='custReq'){
        if(EDITABLE.indexOf(cst)<0)return out_({ok:false,error:'locked'});
        if(!(cwin>0&&cage<=cwin+3000))return out_({ok:false,error:'expired'});   // ٣ ثواني سماح للنت
        if(b.action==='custEdit'){var ce=edCalc_(cv,b,false);if(ce.err)return out_({ok:false,error:ce.err,min:ce.min});
          edWrite_(ct,cr,cv,ce,cid_,ph,'customer');
          chAdd_(cid_,cname,ph,'edit',{diff:ce.diff,before:ce.old,after:ce.items,oldTot:ce.oldTot,newTot:ce.tot},'pending');
          return out_({ok:true,total:ce.tot});}
        var cit=[];try{cit=JSON.parse(cv[7]||'[]').map(itN_);}catch(_){}
        tkCancel_(ct,cr,cv,'العميل ألغى الطلب بنفسه','customer');
        chAdd_(cid_,cname,ph,'cancel',{reason:'العميل ألغى الطلب بنفسه خلال المدة',before:cit,oldTot:+cv[12]||0},'pending');
        return out_({ok:true});}
      var rk=b.kind==='cancel'?'cancel':'edit',rd={note:String(b.note||'').replace(/\s+/g,' ').trim().slice(0,300)};
      if(rk==='edit'){var cq=edCalc_(cv,b,true);if(cq.err)return out_({ok:false,error:cq.err});
        rd.inp={items:b.items.map(function(x){return {i:+x.i,q:Math.round(+x.q)};}),notes:b.notes==null?null:String(b.notes).slice(0,400)};rd.diff=cq.diff;rd.before=cq.old;rd.after=cq.items;rd.oldTot=cq.oldTot;rd.newTot=cq.tot;}
      else{var rit=[];try{rit=JSON.parse(cv[7]||'[]').map(itN_);}catch(_){}rd.before=rit;rd.oldTot=+cv[12]||0;}
      var rcid=chAdd_(cid_,cname,ph,'req_'+rk,rd,'pending'),rlg=String(cv[19]||'');
      setChg_(ct,cr,{k:rk,s:'pending',t:Date.now(),c:rcid});ct.getRange(cr,20).setValue((rlg?rlg+';':'')+'creq@customer@'+Date.now());
      return out_({ok:true});}
    if(b.action==='chResolve'){var cu=authAny_(b);if(cu.err)return out_({ok:false,error:cu.err});
      var qc=String(b.cid||'');if(!/^c[a-f0-9]{9}$/.test(qc))return out_({ok:false,error:'bad_cid'});
      var ch=chFind_(qc);if(!ch)return out_({ok:false,error:'not_found'});var co=chObj_(ch.v);if(co.status!=='pending')return out_({ok:true,same:true,status:co.status});
      var qop=String(b.op||''),qnow=new Date(),qrs=safe_(String(b.reason||'').replace(/\s+/g,' ').trim(),150);
      var fin=function(st2,rs2){ch.s.getRange(ch.r,8,1,4).setValues([[st2,cu.user,qnow,rs2||'']]);CacheService.getScriptCache().remove('ch_v1');audit_({action:'chResolve',user:cu.user,id:co.id,cid:qc,op:qop,reason:rs2},{},{});};
      if(co.kind==='edit'||co.kind==='cancel'){if(qop!=='ack')return out_({ok:false,error:'bad_op'});fin('ack','');return out_({ok:true});}
      var qt=tk_(),qr=findRow_(qt,co.id);if(!qr){fin('void','الطلب مش موجود');return out_({ok:false,error:'not_found'});}
      var qv=qt.getRange(qr,1,1,28).getValues()[0],qst=String(qv[15]),qk=co.kind==='req_cancel'?'cancel':'edit',qdid=String(qv[22]||''),qtype=String(qv[5]);
      if(qop==='reject'){var rj=qrs||'مقدرناش ننفّذ الطلب ده';fin('rejected',rj);setChg_(qt,qr,{k:qk,s:'no',t:Date.now(),r:rj});push_(qdid,co.id,'reqno',qtype,rj);return out_({ok:true});}
      if(qop!=='approve')return out_({ok:false,error:'bad_op'});
      if(qst==='delivered'||qst==='cancelled'){fin('void','الطلب اتقفل قبل الرد');setChg_(qt,qr,null);return out_({ok:false,error:'closed'});}
      if(co.kind==='req_cancel'){tkCancel_(qt,qr,qv,'بطلب العميل'+(co.d&&co.d.note?': '+co.d.note:''),cu.user);fin('approved','');setChg_(qt,qr,{k:'cancel',s:'ok',t:Date.now()});push_(qdid,co.id,'cancelled',qtype,'اتلغى بناءً على طلبك');return out_({ok:true,status:'cancelled'});}
      var qcur=[];try{qcur=JSON.parse(qv[7]||'[]').map(itN_);}catch(_){}
      if(JSON.stringify(qcur)!==JSON.stringify((co.d&&co.d.before)||[]))return out_({ok:false,error:'stale'});   // الطلب اتغيّر من ساعة ما العميل بعت الطلب — ارفضه أو اتواصل مع العميل
      var qe=edCalc_(qv,co.d.inp,true);if(qe.err)return out_({ok:false,error:qe.err});
      edWrite_(qt,qr,qv,qe,co.id,norm_(qv[3]),cu.user);fin('approved','');setChg_(qt,qr,{k:'edit',s:'ok',t:Date.now()});push_(qdid,co.id,'reqok',qtype,'');return out_({ok:true,total:qe.tot});}
    if(b.action==='drvSave'||b.action==='drvDelete'){var dm=authAny_(b);if(dm.err)return out_({ok:false,error:dm.err});if(dm.role!=='manager')return out_({ok:false,error:'forbidden'});
      var dl=drv_(),did2=String(b.id||'').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,8);
      if(b.action==='drvDelete'){dl=dl.filter(function(d){return d.id!==did2;});cfgSet_('drivers',drvRaw_(dl));CacheService.getScriptCache().remove('otl_'+did2);audit_({action:'drvDelete',user:dm.user,id:did2},{},{});return out_(drvOut_());}
      var dn=String(b.name||'').replace(/[:,،\n\r]/g,' ').replace(/\s+/g,' ').trim().slice(0,30);if(!dn)return out_({ok:false,error:'bad_name'});
      var dp=String(b.phone||'').replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/\D/g,'');if(dp&&!(dp.length>=10&&dp.length<=13))return out_({ok:false,error:'bad_phone'});
      var dx=null;dl.forEach(function(d){if(d.id===did2)dx=d;});
      if(dx){dx.name=dn;dx.phone=dp;}
      else{if(!did2){var tries=0;do{did2='d'+Math.random().toString(36).slice(2,5);tries++;}while(tries<30&&(did2.length!==4||dl.some(function(d){return d.id===did2;})));}
        if(!did2||dl.some(function(d){return d.id===did2;}))return out_({ok:false,error:'bad_id'});dl.push({id:did2,name:dn,phone:dp});}
      var raw=drvRaw_(dl);if(raw.length>580||dl.length>15)return out_({ok:false,error:'too_many'});
      if(!cfg_().ot_key)cfgSet_('ot_key',Utilities.getUuid().replace(/-/g,'').slice(0,12));   // أول طيار: بنعمل المفتاح السري تلقائي (لازم عشان لينك صفحة الطيار)
      cfgSet_('drivers',raw);audit_({action:'drvSave',user:dm.user,id:did2,name:dn},{},{});var ro=drvOut_();ro.id=did2;return out_(ro);}
    if(b.action==='rate'){var rid=String(b.id||'').toUpperCase().trim(),stars=Math.round(+b.stars),hit=null;
      if(!rid||ph.length!==11||!(stars>=1&&stars<=5))return out_({ok:false});
      lastRows_(tk_(),1500).forEach(function(r){if(String(r[0]).toUpperCase()===rid&&norm_(r[3])===ph)hit=r;});
      if(!hit||String(hit[15])!=='delivered')return out_({ok:false,error:'not_delivered'});
      var rs=sh_('Ratings',['time','orderId','stars','comment']);if(rows_(rs).some(function(r){return String(r[1])===rid;}))return out_({ok:true,dup:true});
      rs.appendRow([new Date(),rid,stars,safe_(b.comment,200)]);
      if(stars<=2){CacheService.getScriptCache().remove('lr_v1');
        if(rl_('lowrate_mail',20,86400)){var ot=tkObj_(hit);alertMail_('⭐ تقييم منخفض ('+stars+'/5) — طلب #'+rid,'العميل: '+ot.name+' — '+ot.phone+'\nالتقييم: '+stars+'/5\nالتعليق: '+(String(b.comment||'').slice(0,200)||'—')+'\nالإجمالي: '+ot.total+' ج — '+(ot.type==='pickup'?'استلام من الفرع':'توصيل: '+ot.address)+'\nالأصناف: '+ot.items.map(function(i){return i.q+'× '+i.n;}).join('، ')+'\n\nكلّم العميل بسرعة وافتح اللوحة لو محتاج تراجع الطلب.');}}
      return out_({ok:true});}
    if(b.action==='staffSave'){var am=authAny_(b);if(am.err)return out_({ok:false,error:am.err});if(am.role!=='manager')return out_({ok:false,error:'forbidden'});
      var nu=String(b.username||'').toLowerCase().trim(),np=String(b.password||'').trim();
      if(!/^[a-z0-9_]{3,20}$/.test(nu)||nu===MANAGER_USER.toLowerCase())return out_({ok:false,error:'bad_username'});
      if(np&&np.length<6)return out_({ok:false,error:'bad_password'});
      var ss=staffSh_(),sv=ss.getDataRange().getValues(),ix=-1;for(var si=1;si<sv.length;si++)if(String(sv[si][0]).toLowerCase()===nu)ix=si;
      if(ix<0){if(!np)return out_({ok:false,error:'bad_password'});var sl=Utilities.getUuid();ss.appendRow([nu,sl,hash_(sl,np),safe_(b.name||nu,40),b.active!==false,new Date()]);}
      else{if(np){var sl2=Utilities.getUuid();ss.getRange(ix+1,2,1,2).setValues([[sl2,hash_(sl2,np)]]);revokeUser_(nu);}   // كلمة سر جديدة = كل الجلسات القديمة تتلغي
        if(b.name!=null&&String(b.name).trim())ss.getRange(ix+1,4).setValue(safe_(b.name,40));
        if(typeof b.active==='boolean'){ss.getRange(ix+1,5).setValue(b.active);if(!b.active)revokeUser_(nu);}}
      CacheService.getScriptCache().remove('staff_v1');return out_({ok:true});}
    if(b.action==='setSoldout'){var as_=authAny_(b);if(as_.err)return out_({ok:false,error:as_.err});
      var sn=String(b.name||'').trim().slice(0,120);if(!sn)return out_({ok:false,error:'bad_name'});
      var ssh=soSh_(),sv=ssh.getDataRange().getValues(),k2=nm_(sn),has=false;
      for(var z=sv.length-1;z>=1;z--)if(nm_(sv[z][0])===k2){if(b.soldout===false)ssh.deleteRow(z+1);else has=true;}   // نمسح كل التكرارات من تحت لفوق
      if(b.soldout!==false&&!has)ssh.appendRow([safe_(sn,120),as_.user,new Date(),(+b.until>Date.now()&&+b.until<Date.now()+6048e5)?Math.round(+b.until):'']);
      CacheService.getScriptCache().remove('so_v1');return out_({ok:true,soldout:soRows_()});}
    if(b.action==='soldoutClear'){var ac_=authAny_(b);if(ac_.err)return out_({ok:false,error:ac_.err});
      var csh=soSh_(),cl=csh.getLastRow();if(cl>1)csh.deleteRows(2,cl-1);
      CacheService.getScriptCache().remove('so_v1');return out_({ok:true,soldout:[]});}
    if(b.action==='setStatus'){var au2=authAny_(b);if(au2.err)return out_({ok:false,error:au2.err});
      var st=String(b.status||'');if(STATUSES.indexOf(st)<0)return out_({ok:false,error:'bad_status'});
      var tt=tk_(),oid=String(b.id||''),ri=findRow_(tt,oid);if(!ri)return out_({ok:false,error:'not_found'});
      if(st==='out'&&b.driver!==undefined){var dv_=String(b.driver||'').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,8),dc_=CacheService.getScriptCache();if(dv_&&drvName_(dv_))dc_.put('odrv_'+oid.toUpperCase(),dv_,21600);else if(!dv_)dc_.remove('odrv_'+oid.toUpperCase());}   // ربط الطلب بالطيار
      var rv0=tt.getRange(ri,1,1,23).getValues()[0],old=String(rv0[15]);
      if(old===st)return out_({ok:true,same:true,status:st});
      if(au2.role!=='manager'&&(old==='delivered'||old==='cancelled'))return out_({ok:false,error:'forbidden'});   // الموظف مايعدّلش طلب منتهي
      var n=new Date(),hist=String(rv0[17]||''),lg=String(rv0[19]||'');
      tt.getRange(ri,16,1,5).setValues([[st,n,(hist?hist+';':'')+st+'@'+n.getTime(),st==='cancelled'?safe_(b.reason,150):'',(lg?lg+';':'')+st+'@'+au2.user+'@'+n.getTime()]]);   // الحالة + التاريخ + السبب + مين عمل الإجراء في كتابة واحدة
      after_(rv0,old,st);
      if(!b.deferPush)push_(String(rv0[22]||''),oid,st,String(rv0[5]),st==='cancelled'?String(b.reason||'').slice(0,150):'');   // لو الداشبورد بعت deferPush بيبعت الإشعار بطلب منفصل عشان الحفظ مايستناش OneSignal
      return out_({ok:true,status:st,updated:n.getTime()});}
    if(b.action==='order'){if(ph.length!==11)return out_({ok:false});   // النقاط بتتحسب من الأوردر المسجّل على السيرفر مش من رقم بيبعته الموقع
      var oid=String(b.orderId||''),tkt=null;lastRows_(tk_(),1500).forEach(function(r){if(String(r[0])===oid&&norm_(r[3])===ph)tkt=r;});
      if(!tkt||String(tkt[15])==='cancelled')return out_({ok:false,error:'no_ticket'});
      var base=Math.max(0,(+tkt[8]||0)-(+tkt[9]||0));if(!(base>0))return out_({ok:false});
      var o=sh_('Orders',['time','orderId','phone','total','points','confirmed']);
      if(rows_(o).some(function(r){return String(r[1])===oid;}))return out_({ok:true,dup:true});
      o.appendRow([new Date(),oid,"'"+ph,base,Math.round(base*EARN_PER_EGP),false]);
      o.getRange(o.getLastRow(),6).insertCheckboxes();balDrop_(ph);return out_({ok:true});}
    if(b.action==='redeem'){if(!rl_('red_'+ph,8,600))return out_({ok:false,error:'busy'});var pts=+b.points;if(ph.length!==11||!pts||pts%STEP!==0)return out_({ok:false,error:'bad_points'});
      if(!ownsPhone_(ph,b.did))return out_({ok:false,error:'device'});   // الاستبدال بس من الجهاز اللي طلب بالرقم ده
      var bal=balance_(ph,true);if(bal.points<pts)return out_({ok:false,error:'not_enough',points:bal.points});
      var code='RR-'+Utilities.getUuid().replace(/-/g,'').slice(0,6).toUpperCase(),val=pts/POINTS_PER_EGP;
      sh_('Redeem',['time','phone','points','value','code','used']).appendRow([new Date(),"'"+ph,pts,val,code,false]);balDrop_(ph);
      return out_({ok:true,code:code,value:val,points:bal.points-pts});}
    if(b.action==='custFlag'){var cf_=authAny_(b);if(cf_.err)return out_({ok:false,error:cf_.err});var fph=norm_(b.phone),fop=String(b.op||'');if(fph.length!==11)return out_({ok:false,error:'bad_phone'});
      var cur=blMap_()[fph]||{s:0,b:false},frs=safe_(b.reason,120);
      if(fop==='strike'){var ns=cur.s+1;blSave_(fph,ns,cur.b||ns>=STRIKES_BLOCK,frs||'طلب مزعج',cf_.user);}
      else if(fop==='block'){blSave_(fph,Math.max(cur.s,1),true,frs||'محظور يدويًا',cf_.user);}
      else if(fop==='unblock'||fop==='clear'){if(cf_.role!=='manager')return out_({ok:false,error:'forbidden'});if(fop==='clear')blDelete_(fph);else blSave_(fph,0,false,'اترفع الحظر',cf_.user);}
      else return out_({ok:false,error:'bad_op'});
      var nw=blMap_()[fph]||{s:0,b:false};return out_({ok:true,flag:{s:nw.s,b:nw.b}});}
    if(b.action==='useCode'){return out_({ok:true});}   // اتلغى: كود النقاط بيتحرق جوه newOrder (كان أي حد يقدر يحرق أكواد غيره)
    if(b.action==='login'){var lr=login_(b);if(lr.err)return out_({ok:false,error:lr.err});return out_({ok:true,role:lr.role,user:lr.user,name:lr.name,token:lr.token,exp:lr.exp});}
    if(b.action==='logout'){logout_(b);return out_({ok:true});}
    if(b.action==='setPaid'){var ap=authAny_(b);if(ap.err)return out_({ok:false,error:ap.err});
      var pt=tk_(),pid=String(b.id||''),pr=findRow_(pt,pid);if(!pr)return out_({ok:false,error:'not_found'});
      var pv=pt.getRange(pr,1,1,22).getValues()[0];if(String(pv[13])==='cash')return out_({ok:false,error:'cash'});
      var pf=b.paid!==false,pl=String(pv[19]||'');
      pt.getRange(pr,20).setValue((pl?pl+';':'')+(pf?'paid':'unpaid')+'@'+ap.user+'@'+Date.now());pt.getRange(pr,22).setValue(pf);return out_({ok:true,paid:pf});}   // مانلمسش خلية رقم العملية (عشان الأصفار)
    if(b.action==='menuSync'){var ms=authAny_(b);if(ms.err)return out_({ok:false,error:ms.err});if(ms.role!=='manager')return out_({ok:false,error:'forbidden'});
      var seenM={},listM=[];(b.items||[]).slice(0,800).forEach(function(x){var mn_=String(x&&x.name||'').trim().slice(0,120),mv_=+(x&&x.price);if(!mn_||!(mv_>0)||mv_>5000)return;var mk_=nm_(mn_);
        if(seenM[mk_]){if(mv_<seenM[mk_].p)seenM[mk_].p=mv_;return;}seenM[mk_]={n:mn_,p:mv_};listM.push(seenM[mk_]);});
      movList_().items.forEach(function(it){if(!it.p.length)return;var mn_=Math.min.apply(null,it.p),e_=seenM[it.k];if(e_)e_.p=mn_;else{seenM[it.k]={n:it.n,p:mn_};listM.push(seenM[it.k]);}});   // أسعار الداشبورد تكسب على أسعار ملف الموقع
      var oldM=Object.keys(mpMap_()).length;if(listM.length<10||(oldM&&listM.length<oldM*0.5&&!b.force))return out_({ok:false,error:'sync_small',n:listM.length,old:oldM});   // حماية من قراءة ناقصة تمسح الأسعار
      var msh=sh_('MenuPrices',['name','price','updated']),ml=msh.getLastRow();if(ml>1)msh.getRange(2,1,ml-1,3).clearContent();
      msh.getRange(2,1,listM.length,3).setValues(listM.map(function(o){return [safe_(o.n,120),o.p,new Date()];}));
      CacheService.getScriptCache().remove('mp_v1');return out_({ok:true,n:listM.length});}
    if(b.action==='settingsGet'){var sg=authAny_(b);if(sg.err)return out_({ok:false,error:sg.err});if(sg.role!=='manager')return out_({ok:false,error:'forbidden'});
      return out_({ok:true,settings:cfg_(),areas:areas_(),builtin:areas_().length===0});}
    if(b.action==='settingsSave'){var ss2=authAny_(b);if(ss2.err)return out_({ok:false,error:ss2.err});if(ss2.role!=='manager')return out_({ok:false,error:'forbidden'});
      var in_=b.settings||{},tm=function(v){var m=/^(\d{1,2}):(\d{2})$/.exec(String(v||'').trim());if(!m||+m[1]>23||+m[2]>59)return '';return ('0'+m[1]).slice(-2)+':'+m[2];};
      var oa=tm(in_.open_at),ca=tm(in_.close_at);if(!oa||!ca)return out_({ok:false,error:'bad_time'});
      var be=Math.max(0,Math.min(180,Math.round(+in_.busy_extra||0)));
      var nv={hours_on:String(in_.hours_on!==false&&in_.hours_on!=='false'),open_at:oa,close_at:ca,busy_extra:String(be),busy_msg:safe_(in_.busy_msg,120),pause_on:String(in_.pause_on===true||in_.pause_on==='true'),pause_msg:safe_(in_.pause_msg,120),
        ref_on:in_.ref_on===undefined?cfg_().ref_on:String(in_.ref_on!==false&&in_.ref_on!=='false'),ref_points:in_.ref_points===undefined?cfg_().ref_points:String(Math.max(0,Math.min(5000,Math.round(+in_.ref_points||0)))),ref_cap:in_.ref_cap===undefined?cfg_().ref_cap:String(Math.max(1,Math.min(100,Math.round(+in_.ref_cap||20)))),pay_cash:String(in_.pay_cash!==false&&in_.pay_cash!=='false'),pay_wallet:String(in_.pay_wallet!==false&&in_.pay_wallet!=='false'),pay_instapay:String(in_.pay_instapay!==false&&in_.pay_instapay!=='false'),pay_msg:safe_(in_.pay_msg,60),ot_key:String(in_.ot_key||'').replace(/[^A-Za-z0-9_-]/g,'').slice(0,40),drivers:safe_(in_.drivers,600),edit_min:in_.edit_min===undefined?cfg_().edit_min:String(Math.max(0,Math.min(60,Math.round(+in_.edit_min||0))))};
      if(nv.pay_cash!=='true'&&nv.pay_wallet!=='true'&&nv.pay_instapay!=='true')return out_({ok:false,error:'no_pay'});   // لازم طريقة دفع واحدة شغّالة على الأقل
      var sst=setSh_(),sl_=sst.getLastRow();if(sl_>1)sst.getRange(2,1,sl_-1,2).clearContent();
      sst.getRange(2,1,SET_KEYS.length,2).setNumberFormat('@').setValues(SET_KEYS.map(function(k){return [k,nv[k]];}));
      CacheService.getScriptCache().remove('set_v1');return out_({ok:true,settings:cfg_()});}
    if(b.action==='areasSave'){var as2=authAny_(b);if(as2.err)return out_({ok:false,error:as2.err});if(as2.role!=='manager')return out_({ok:false,error:'forbidden'});
      var inA=(b.areas||[]).slice(0,250),seenA={},listA=[];
      inA.forEach(function(x){var n2=String(x&&x.name||'').replace(/\s+/g,' ').trim().slice(0,120),f2=+(x&&x.fee),k2=nm_(n2);if(!n2||seenA[k2]||!(f2>=0&&f2<=150))return;seenA[k2]=1;listA.push([safe_(n2,120),Math.round(f2),!(x&&x.active===false)]);});
      if(!listA.length&&!b.clear)return out_({ok:false,error:'empty'});   // لو عايز تمسح كل المناطق وترجع لقايمة الموقع ابعت clear:true
      var ash=arSh_(),al_=ash.getLastRow();if(al_>1)ash.getRange(2,1,al_-1,3).clearContent();
      if(listA.length)ash.getRange(2,1,listA.length,3).setValues(listA);
      CacheService.getScriptCache().remove('ar_v1');return out_({ok:true,n:listA.length});}
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
function alertMail_(subj,body){try{var to=PropertiesService.getScriptProperties().getProperty('ALERT_EMAIL')||Session.getEffectiveUser().getEmail();if(to)MailApp.sendEmail(to,'[Red Roosters] '+subj,body);}catch(e){}}   // الإيميل: Script property اسمها ALERT_EMAIL (أو إيميل صاحب الحساب)
function backupRun_(){
  var ss=SpreadsheetApp.getActiveSpreadsheet(),it=DriveApp.getFoldersByName('RedRoosters Backups'),dir=it.hasNext()?it.next():DriveApp.createFolder('RedRoosters Backups');
  var cp=DriveApp.getFileById(ss.getId()).makeCopy(ss.getName()+' — backup '+Utilities.formatDate(new Date(),'Africa/Cairo','yyyy-MM-dd HH:mm'),dir);
  var files=[],fi=dir.getFiles();while(fi.hasNext()){var x=fi.next();files.push({f:x,t:x.getDateCreated().getTime()});}
  files.sort(function(a,b){return b.t-a.t;});for(var i=BACKUP_KEEP;i<files.length;i++)files[i].f.setTrashed(true);
  return {name:cp.getName(),url:cp.getUrl(),kept:Math.min(files.length,BACKUP_KEEP)};}
function hasTrig_(fn){try{return ScriptApp.getProjectTriggers().some(function(t){return t.getHandlerFunction()===fn;});}catch(e){return null;}}
function setupBackup(){
  ScriptApp.getProjectTriggers().forEach(function(t){var h=t.getHandlerFunction();if(h==='dailyBackup'||h==='dailyReport'||h==='archiveOld')ScriptApp.deleteTrigger(t);});
  ScriptApp.newTrigger('dailyBackup').timeBased().everyDays(1).atHour(6).inTimezone('Africa/Cairo').create();
  ScriptApp.newTrigger('dailyReport').timeBased().everyDays(1).atHour(7).inTimezone('Africa/Cairo').create();   // تقرير الإقفال بعد النسخة الاحتياطية
  ScriptApp.newTrigger('archiveOld').timeBased().onMonthDay(1).atHour(8).inTimezone('Africa/Cairo').create();   // أرشفة شهرية (بعد النسخة الاحتياطية والتقرير)
  dailyBackup();}
function dailyBackup(){var P=PropertiesService.getScriptProperties();
  try{var i=backupRun_();P.setProperty('LAST_BACKUP',JSON.stringify({ok:true,t:Date.now(),name:i.name,url:i.url,kept:i.kept}));return true;}
  catch(e){var m=String(e&&e.message||e).slice(0,200);P.setProperty('LAST_BACKUP',JSON.stringify({ok:false,t:Date.now(),err:m}));alertMail_('⚠️ فشل النسخ الاحتياطي اليومي','النسخة الاحتياطية فشلت: '+m+'\n\nافتح محرر Apps Script وشغّل setupBackup مرة تانية ووافق على الصلاحيات، أو راجع مساحة Drive.');return false;}}
function lastBackup_(){try{return JSON.parse(PropertiesService.getScriptProperties().getProperty('LAST_BACKUP')||'null');}catch(_){return null;}}

/* ═══ تقرير الإقفال اليومي بالإيميل (اليوم التشغيلي بيبدأ ٦ الصبح بتوقيت القاهرة) ═══ */
function dayStart_(ts){var f=Utilities.formatDate(new Date(ts),'Africa/Cairo','yyyy-MM-dd HH'),d=f.slice(0,10),h=+f.slice(11,13),st=Utilities.parseDate(d+' 06:00','Africa/Cairo','yyyy-MM-dd HH:mm').getTime();return h<6?st-864e5:st;}
function esc_(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function report_(from,to){
  var all=rowsSince_(tk_(),from-864e5).map(tkObj_),cur=all.filter(function(o){return o.time>=from&&o.time<to;}),prev=all.filter(function(o){return o.time>=from-864e5&&o.time<from&&o.status!=='cancelled';});
  var ok=cur.filter(function(o){return o.status!=='cancelled';}),canc=cur.filter(function(o){return o.status==='cancelled';});
  var sum=function(a,f){return a.reduce(function(s2,o){return s2+(+f(o)||0);},0);};
  var im={},rs={},pm={},tms=[],late=0;
  ok.forEach(function(o){(o.items||[]).forEach(function(i){var n=String(i.n||'').replace(/\s*\(.*\)\s*$/,'').trim();if(n)im[n]=(im[n]||0)+(+i.q||1);});pm[o.payment]=(pm[o.payment]||0)+1;
    if(o.status==='delivered'&&o.type!=='pickup'){var h={};String(o.history||'').split(';').forEach(function(x){var a=x.split('@');if(a[0]&&a[1]&&!h[a[0]])h[a[0]]=+a[1];});
      if(h['new']&&h['delivered']){var m=(h['delivered']-h['new'])/60000;if(m>=5&&m<=300){tms.push(m);if(m>60)late++;}}}});
  canc.forEach(function(o){var r=o.reason||'بدون سبب';rs[r]=(rs[r]||0)+1;});
  var rat=rows_(sh_('Ratings',['time','orderId','stars','comment'])).filter(function(r){var t=new Date(r[0]).getTime();return t>=from&&t<to;}).map(function(r){return {id:String(r[1]),stars:+r[2]||0,comment:String(r[3]||'')};});
  var unpaid=ok.filter(function(o){return o.payment!=='cash'&&!o.paid;});
  return {from:from,to:to,orders:cur.length,valid:ok.length,sales:sum(ok,function(o){return o.total;}),prevSales:sum(prev,function(o){return o.total;}),delivered:ok.filter(function(o){return o.status==='delivered';}).length,
    cancelled:canc.length,lost:sum(canc,function(o){return o.total;}),discount:sum(ok,function(o){return o.discount;}),aov:ok.length?Math.round(sum(ok,function(o){return o.total;})/ok.length):0,
    avgMin:tms.length?Math.round(tms.reduce(function(a,b){return a+b;},0)/tms.length):null,late:late,
    top:Object.keys(im).sort(function(x,y){return im[y]-im[x];}).slice(0,5).map(function(k){return [k,im[k]];}),
    reasons:Object.keys(rs).sort(function(x,y){return rs[y]-rs[x];}).map(function(k){return [k,rs[k]];}),pay:pm,
    unpaidN:unpaid.length,unpaidAmt:sum(unpaid,function(o){return o.total;}),
    ratingAvg:rat.length?Math.round(rat.reduce(function(a,x){return a+x.stars;},0)/rat.length*10)/10:null,ratingN:rat.length,lowRatings:rat.filter(function(x){return x.stars&&x.stars<=2;})};}
function reportHtml_(r){
  var day=Utilities.formatDate(new Date(r.from+36e5),'Africa/Cairo','yyyy-MM-dd'),money=function(n){return Math.round(n||0).toLocaleString('en-US')+' ج';},
    delta=r.prevSales?(Math.round((r.sales-r.prevSales)/r.prevSales*100)+'٪ عن اليوم اللي قبله'):'—',
    row=function(a,b){return '<tr><td style="padding:6px 10px;border-bottom:1px solid #eee">'+a+'</td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-weight:700;text-align:left">'+b+'</td></tr>';},
    PAYL={cash:'كاش',wallet:'محفظة',instapay:'إنستا باي'};
  var h='<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;max-width:560px;margin:auto;color:#1E1411"><h2 style="background:#D92B2B;color:#fff;margin:0;padding:14px 16px;border-radius:12px 12px 0 0">🐓 تقرير إقفال '+day+'</h2><table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee">'
   +row('إجمالي المبيعات',money(r.sales)+' <small style="color:#6B6B6B">('+delta+')</small>')+row('الطلبات السارية / الكل',r.valid+' / '+r.orders)+row('متوسط قيمة الطلب',money(r.aov))+row('تم التسليم',r.delivered)
   +row('ملغي',r.cancelled+(r.cancelled?' — قيمتهم '+money(r.lost):''))+row('الخصومات',money(r.discount))+row('متوسط وقت التوصيل',r.avgMin==null?'—':r.avgMin+' دقيقة'+(r.late?' ('+r.late+' طلب عدّى ٦٠ دقيقة)':''))
   +row('طرق الدفع',Object.keys(r.pay).map(function(k){return (PAYL[k]||esc_(k))+' '+r.pay[k];}).join(' · ')||'—')
   +(r.unpaidN?row('⚠️ تحويلات لسه ماتأكدتش',r.unpaidN+' طلب — '+money(r.unpaidAmt)):'')
   +row('التقييم',r.ratingN?r.ratingAvg+' / 5 ('+r.ratingN+' تقييم)':'—')+'</table>';
  if(r.top.length)h+='<h3>🍗 أكتر الأصناف</h3><table style="width:100%;border-collapse:collapse">'+r.top.map(function(x){return row(esc_(x[0]),x[1]);}).join('')+'</table>';
  if(r.reasons.length)h+='<h3>❌ أسباب الإلغاء</h3><table style="width:100%;border-collapse:collapse">'+r.reasons.map(function(x){return row(esc_(x[0]),x[1]);}).join('')+'</table>';
  if(r.lowRatings.length)h+='<h3>⭐ تقييمات ضعيفة (محتاجة متابعة)</h3>'+r.lowRatings.map(function(x){return '<div style="padding:6px 0;border-top:1px dashed #ddd"><b dir="ltr">#'+esc_(x.id)+'</b> '+x.stars+'★ '+esc_(x.comment)+'</div>';}).join('');
  return h+'</div>';}
function sendReport_(r){var to=PropertiesService.getScriptProperties().getProperty('REPORT_EMAIL')||PropertiesService.getScriptProperties().getProperty('ALERT_EMAIL')||Session.getEffectiveUser().getEmail();
  if(!to)throw new Error('no email');MailApp.sendEmail({to:to,subject:'[Red Roosters] تقرير الإقفال — مبيعات '+Math.round(r.sales).toLocaleString('en-US')+' ج / '+r.valid+' طلب',htmlBody:reportHtml_(r)});return to;}
function dailyReport(){var P=PropertiesService.getScriptProperties();try{var to=dayStart_(Date.now()),r=report_(dayStart_(to-72e5),to);sendReport_(r);P.setProperty('LAST_REPORT',JSON.stringify({ok:true,t:Date.now(),sales:r.sales,orders:r.valid}));}
  catch(e){P.setProperty('LAST_REPORT',JSON.stringify({ok:false,t:Date.now(),err:String(e&&e.message||e).slice(0,200)}));}
  try{var ph_=pushHealth_();if(ph_.configured&&ph_.fails24>0)alertMail_('ℹ️ إشعارات العملاء: '+ph_.fails24+' محاولة فشلت في آخر ٢٤ ساعة','آخر خطأ: '+(ph_.last&&!ph_.last.ok?(ph_.last.code+' — '+ph_.last.msg):'—')+'\n\nافتح الداشبورد ▸ الإعدادات ▸ حالة الإشعارات.');}catch(_){}}
