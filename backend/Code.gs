/**
 * Éclorege order backend — Google Apps Script
 * Run setup() once, then deploy this project as a Web App.
 * Store WhatsApp credentials in Script Properties only. Never commit them to GitHub.
 */
const SHEET_NAME = "Orders";
const HEADERS = ["Order ID","Created At","Status","Customer Name","Phone","Email","Delivery Area","Full Address","Order Notes","Items JSON","Subtotal EGP","Shipping EGP","Total EGP","Payment Method","Privacy Consent"];
const CATALOG = {
  1:{name:"Éclorege Contrôle de l’Acné",price:400},
  2:{name:"Éclorege Amber",price:450},
  3:{name:"Éclorege Booster",price:750},
  4:{name:"Éclorege Exosomes",price:450},
  5:{name:"Éclorege Revitalisation Capillaire",price:550}
};
const FREE_SHIPPING_THRESHOLD = 5000;

function setup() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty("SPREADSHEET_ID");
  let ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.create("Éclorege — Store Orders");
  props.setProperty("SPREADSHEET_ID", ss.getId());
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1,1,1,HEADERS.length).setFontWeight("bold");
    sheet.autoResizeColumns(1,HEADERS.length);
  }
  Logger.log("Private order spreadsheet: " + ss.getUrl());
}

function doGet() {
  return HtmlService.createHtmlOutput("<!doctype html><meta charset='utf-8'><p>Éclorege order service is online. Orders are accepted by POST only.</p>");
}

function doPost(e) {
  let result;
  try {
    const raw = e && e.parameter && e.parameter.payload;
    if (!raw || raw.length > 20000) throw new Error("Invalid order payload.");
    result = processOrder_(JSON.parse(raw));
  } catch (err) {
    result = {ok:false, message:safeMessage_(err)};
  }
  const response = JSON.stringify({type:"ECLOREGE_ORDER_RESULT",ok:!!result.ok,reference:result.reference||"",message:result.message||""}).replace(/</g,"\\u003c");
  return HtmlService.createHtmlOutput("<!doctype html><meta charset='utf-8'><script>window.parent.postMessage("+response+", '*');</script><p>Order request processed.</p>");
}

function processOrder_(payload) {
  if (!payload || typeof payload !== "object") throw new Error("Invalid order.");
  const c = payload.customer || {};
  if (String(payload.website || "").trim()) throw new Error("Invalid submission.");
  const name=clean_(c.name,100), phone=normalizePhone_(c.phone), email=clean_(c.email,150);
  const address=clean_(c.address,500), notes=clean_(c.notes,500), region=String(c.region||"");
  if (!name || !phone || !address) throw new Error("Please check your name, phone, and address.");
  if (!/^[0-9]{8,15}$/.test(phone)) throw new Error("Please enter a valid phone number.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please check your email address.");
  if (region!=="greater-cairo" && region!=="outside") throw new Error("Please select your delivery area.");
  if (c.consent!==true) throw new Error("Order processing consent is required.");
  const items=Array.isArray(payload.items)?payload.items:[];
  if (!items.length || items.length>20) throw new Error("Your cart is empty or invalid.");
  let subtotal=0;
  const verifiedItems=[];
  items.forEach(item=>{
    const id=Number(item.id), quantity=Number(item.quantity), product=CATALOG[id];
    if (!product || !Number.isInteger(quantity) || quantity<1 || quantity>10) throw new Error("One or more products are unavailable.");
    subtotal += product.price*quantity;
    verifiedItems.push({id:id,name:product.name,quantity:quantity,unitPrice:product.price,lineTotal:product.price*quantity});
  });
  const shipping=subtotal>=FREE_SHIPPING_THRESHOLD?0:(region==="greater-cairo"?100:150);
  const total=subtotal+shipping;
  const cache=CacheService.getScriptCache();
  const key="order_phone_"+Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,phone)).slice(0,32);
  if (cache.get(key)) throw new Error("An order was just submitted from this phone. Please wait before retrying.");
  const lock=LockService.getScriptLock();
  lock.waitLock(10000);
  let orderId;
  try {
    const id=PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
    if (!id) throw new Error("Order storage is not configured.");
    const ss=SpreadsheetApp.openById(id);
    let sheet=ss.getSheetByName(SHEET_NAME)||ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow()===0) { sheet.appendRow(HEADERS); sheet.setFrozenRows(1); }
    orderId="ECL-"+Utilities.formatDate(new Date(),"Africa/Cairo","yyyyMMdd-HHmmss")+"-"+Math.floor(100+Math.random()*900);
    sheet.appendRow([orderId,new Date(),"New",name,phone,email,region,address,notes,JSON.stringify(verifiedItems),subtotal,shipping,total,"Cash on Delivery","Yes"]);
    cache.put(key,orderId,45);
  } finally { lock.releaseLock(); }
  try { sendWhatsAppNotification_(orderId,name,phone,region,total); }
  catch(err) { console.error("WhatsApp notification failed: "+String(err)); }
  return {ok:true,reference:orderId};
}

function sendWhatsAppNotification_(orderId,name,phone,region,total) {
  const p=PropertiesService.getScriptProperties();
  const token=p.getProperty("WHATSAPP_TOKEN"), phoneId=p.getProperty("WHATSAPP_PHONE_NUMBER_ID");
  const to=p.getProperty("WHATSAPP_NOTIFY_TO"), version=p.getProperty("WHATSAPP_GRAPH_VERSION");
  const template=p.getProperty("WHATSAPP_TEMPLATE_NAME")||"new_order_alert";
  const language=p.getProperty("WHATSAPP_TEMPLATE_LANGUAGE")||"en_US";
  if (!token||!phoneId||!to||!version) { console.warn("WhatsApp not configured; order was saved to Sheets."); return; }
  const body={messaging_product:"whatsapp",to:to.replace(/\\D/g,""),type:"template",template:{
    name:template,language:{code:language},components:[{type:"body",parameters:[
      {type:"text",text:orderId},{type:"text",text:name},{type:"text",text:phone},
      {type:"text",text:region==="greater-cairo"?"Greater Cairo":"Outside Greater Cairo"},
      {type:"text",text:"EGP "+Number(total).toLocaleString("en-US")}
    ]}]
  }};
  const response=UrlFetchApp.fetch("https://graph.facebook.com/"+version+"/"+phoneId+"/messages",{
    method:"post",contentType:"application/json",headers:{Authorization:"Bearer "+token},
    payload:JSON.stringify(body),muteHttpExceptions:true
  });
  const code=response.getResponseCode();
  if(code<200||code>=300) throw new Error("WhatsApp API returned HTTP "+code+": "+response.getContentText().slice(0,500));
}
function clean_(value,max){return String(value==null?"":value).replace(/[<>]/g,"").trim().slice(0,max);}
function normalizePhone_(value){
  let phone=String(value||"").replace(/[\s()+.-]/g,"");
  if(phone.startsWith("00"))phone=phone.slice(2);
  if(phone.startsWith("0")&&phone.length===11)phone="20"+phone.slice(1);
  return phone;
}
function safeMessage_(err){
  const m=String(err&&err.message||"Unable to process order.");
  if(/not configured/i.test(m))return "The order service is not fully configured. Please try again later.";
  return m.slice(0,180);
}
