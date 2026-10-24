// Public storefront configuration. Paste the deployed Apps Script Web App URL here before publishing.
const ORDER_ENDPOINT = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
// Replace the sample product names, descriptions, prices and imagery with your real catalog.
const products = [
 {id:1,name:"Éclorege Contrôle de l’Acné",subtitle:"Oil & Skin Balance",description:"A skincare product from the Éclorege collection. Refer to the official packaging and instructions to confirm suitable use.",price:400,tag:"Skin care",type:"image",image:"assets/acne-control.jpeg",details:"Label name: Contrôle de l’Acné — Oil & Skin Balance. Confirm the official ingredients and instructions before publishing final product claims."},
 {id:2,name:"Éclorege Amber",subtitle:"Revitalization & Radiance",description:"A product from the Amber collection. The product artwork uses the phrase “Revitalization & Radiance”; this is not a guarantee of a treatment outcome.",price:450,tag:"Radiance",type:"image",image:"assets/amber-radiance.jpeg",details:"Label name: AMBER — Revitalization & Radiance. Please confirm the official ingredients, size, and directions for use."},
 {id:3,name:"Éclorege Booster",subtitle:"Hydration & Skin Barrier",description:"A product labelled Hydration & Skin Barrier. Ingredient information should be verified against the official ingredient list.",price:750,tag:"Hydration",type:"image",image:"assets/booster-hydration.jpeg",details:"Label name: BOOSTER — Hydration & Skin Barrier. Match any ingredient information to the official INCI list before publication."},
 {id:4,name:"Éclorege Exosomes",subtitle:"Hair Renewal & Skin Rejuvenation",description:"A product labelled Exosomes. Intended use and professional-use requirements must be confirmed with the manufacturer.",price:450,tag:"Advanced care",type:"image",image:"assets/exosomes-rejuvenation.jpeg",details:"Image label: EXOSOMES — Hair Renewal & Skin Rejuvenation. Confirm intended use, regulatory classification, and instructions with the manufacturer."},
 {id:5,name:"Éclorege Revitalisation Capillaire",subtitle:"Strengthening & Hair Growth",description:"A hair-care product. Confirm the intended use, directions, and warnings from the official packaging before use.",price:550,tag:"Hair care",type:"image",image:"assets/hair-revitalisation.jpeg",details:"Image label: REVITALISATION CAPILLAIRE — Strengthening & Hair Growth. Final product claims and instructions should be checked against official documentation."},
 {id:6,name:"Product Six",subtitle:"Éclorege Mesotherapy",description:"Product details and pricing will be added once confirmed.",price:0,tag:"Coming soon",type:"image",image:"assets/amber-radiance.jpeg",details:"The official name, image, price, and specifications have not been provided yet. This product is not available for purchase."},
 {id:7,name:"Product Seven",subtitle:"Éclorege Mesotherapy",description:"Product details and pricing will be added once confirmed.",price:0,tag:"Coming soon",type:"image",image:"assets/booster-hydration.jpeg",details:"The official name, image, price, and specifications have not been provided yet. This product is not available for purchase."}
];
const $ = s => document.querySelector(s);
const money = n => n > 0 ? `EGP ${Math.round(n).toLocaleString("en-US")}` : "Price to be confirmed";
let cart = {};
let toastTimer;
function visual(type="bottle",p=null){if(p?.image)return `<img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy">`;return `<div class="bottle ${type==="jar"?"bottle-jar":""}"><span class="bottle-cap"></span><span class="bottle-brand">Éclorege</span><span class="bottle-label">MESOTHERAPY<br>COLLECTION</span></div>`}
function renderProducts(){
 $("#productGrid").innerHTML=products.map(p=>`<article class="product-card"><div class="product-visual" data-view="${p.id}">${p.tag?`<span class="product-tag">${p.tag}</span>`:""}${visual(p.type,p)}</div><div class="product-info"><h3>${p.name}</h3><p>${p.description}</p><button class="details-button" data-details="${p.id}">View details</button><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-button" data-add="${p.id}">Add to cart +</button></div></div></article>`).join("");
}
function count(){return Object.values(cart).reduce((a,b)=>a+b,0)}
function subtotal(){return Object.entries(cart).reduce((sum,[id,q])=>sum+products.find(p=>p.id===Number(id)).price*q,0)}
function shipping(region){const s=subtotal();if(s===0||s>=5000)return 0;if(region==="greater-cairo")return 100;if(region==="outside")return 150;return null}
function renderCart(){
 const n=count(),sub=subtotal(),region=$("#region")?.value||"",ship=shipping(region);
 $("#cartCount").textContent=n;$("#drawerCount").textContent=`(${n})`;
 $("#cartItems").innerHTML=n?Object.entries(cart).map(([id,q])=>{const p=products.find(x=>x.id===Number(id));return `<div class="cart-item"><div class="mini-visual">A.</div><div><h4>${p.name}</h4><p>${money(p.price)}</p><div class="quantity"><button data-qty="${id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${q}</span><button data-qty="${id}" data-delta="1" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-remove="${id}">Remove</button></div>`}).join(""):`<div class="empty-cart">Your cart is empty.<br>Explore the collection and add your favourites.</div>`;
 $("#subtotal").textContent=money(sub);$("#shippingCost").textContent=ship===null?(sub?"Calculated after selecting your area":"—"):(ship===0?"Free":money(ship));$("#total").textContent=money(sub+(ship||0));
 $("#shippingHint").textContent=sub===0?"Add products to your cart to get started.":sub>=5000?"You qualify for free shipping!":`Add products worth ${money(5000-sub)} more to unlock free shipping.`;
 $("#checkoutButton").disabled=n===0;$("#checkoutButton").style.opacity=n===0?".45":"1";
 $("#checkoutTotal").textContent=money(sub+(ship||0));
}
function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2600)}
function openCart(){$("#cartDrawer").classList.add("open");$("#overlay").classList.add("visible");$("#cartDrawer").setAttribute("aria-hidden","false")}
function closeAll(){$("#cartDrawer").classList.remove("open");$("#checkoutModal").classList.remove("open");$("#overlay").classList.remove("visible");$("#cartDrawer").setAttribute("aria-hidden","true")}
 $("#productGrid").addEventListener("click",e=>{const d=e.target.closest("[data-details]");if(d){const p=products.find(x=>x.id===Number(d.dataset.details));showToast(p.details);return;}const b=e.target.closest("[data-add]");if(b){const id=Number(b.dataset.add);const p=products.find(x=>x.id===id);if(!p.price){showToast("Product price must be set before purchase is enabled");return;}cart[id]=(cart[id]||0)+1;renderCart();showToast("Added to cart");}});
$("#cartItems").addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q){const id=q.dataset.qty;cart[id]=(cart[id]||0)+Number(q.dataset.delta);if(cart[id]<=0)delete cart[id];renderCart()}if(r){delete cart[r.dataset.remove];renderCart()}});
$("#openCart").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeAll);$("#overlay").addEventListener("click",closeAll);$("#closeCheckout").addEventListener("click",()=>$("#checkoutModal").classList.remove("open"));
$("#checkoutButton").addEventListener("click",()=>{if(!count())return;$("#checkoutModal").classList.add("open");renderCart();});
$("#region").addEventListener("change",renderCart);
let orderPending = false;
window.addEventListener("message", event => {
  const frame = document.getElementById("orderSubmitFrame");
  if (!frame || event.source !== frame.contentWindow || event.data?.type !== "ECLOREGE_ORDER_RESULT") return;
  orderPending = false;
  const button = $("#checkoutForm button[type='submit']");
  button.disabled = false;
  button.textContent = "Place order — Cash on Delivery ←";
  if (event.data.ok) {
    const reference = event.data.reference || "received";
    $("#checkoutModal").classList.remove("open");
    closeAll();
    cart = {};
    renderCart();
    $("#checkoutForm").reset();
    showToast(`Order ${reference} received. We will contact you to confirm delivery.`);
  } else {
    showToast(event.data.message || "We could not submit your order. Please try again.");
  }
});

$("#checkoutForm").addEventListener("submit", e => {
  e.preventDefault();
  if (orderPending) return;
  if (!ORDER_ENDPOINT || ORDER_ENDPOINT.includes("PASTE_YOUR_")) {
    showToast("Store setup incomplete: add the Google Apps Script Web App URL first.");
    return;
  }
  if (!count()) { showToast("Your cart is empty."); return; }
  const data = Object.fromEntries(new FormData(e.target).entries());
  if (!data.region) { showToast("Please select your delivery area."); return; }
  const items = Object.entries(cart).map(([id, quantity]) => ({ id: Number(id), quantity: Number(quantity) }));
  if (items.some(item => !products.some(p => p.id === item.id && p.price > 0))) {
    showToast("One or more products are not available for purchase yet."); return;
  }
  const payload = {
    customer: {
      name: data.name, phone: data.phone, email: data.email || "",
      region: data.region, address: data.address, notes: data.notes || "",
      consent: data.privacyConsent === "yes"
    },
    items,
    website: data.website || ""
  };
  if (!payload.customer.consent) { showToast("Please agree to the order processing notice."); return; }

  orderPending = true;
  const button = $("#checkoutForm button[type='submit']");
  button.disabled = true;
  button.textContent = "Submitting order…";
  let frame = document.getElementById("orderSubmitFrame");
  if (!frame) {
    frame = document.createElement("iframe");
    frame.id = "orderSubmitFrame";
    frame.name = "orderSubmitFrame";
    frame.title = "Order submission";
    frame.style.display = "none";
    document.body.appendChild(frame);
  }
  const form = document.createElement("form");
  form.method = "POST";
  form.action = ORDER_ENDPOINT;
  form.target = "orderSubmitFrame";
  form.style.display = "none";
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "payload";
  input.value = JSON.stringify(payload);
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  form.remove();
  window.setTimeout(() => {
    if (!orderPending) return;
    orderPending = false;
    button.disabled = false;
    button.textContent = "Place order — Cash on Delivery ←";
    showToast("No confirmation received. Check the Apps Script deployment and try again.");
  }, 25000);
});
$("#menuToggle").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));
$("#mainNav").querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("open")));
$("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();