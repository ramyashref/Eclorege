document.addEventListener('DOMContentLoaded',()=>{
const KEY='eclorege_cart_v1',WA='201080080203';
const parse=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return []}};
let cart=parse();
const money=n=>'EGP '+Number(n||0).toLocaleString('en-US');
const save=()=>{localStorage.setItem(KEY,JSON.stringify(cart));render()};
const open=()=>{document.body.classList.add('cart-open');document.querySelector('.cart-drawer')?.setAttribute('aria-hidden','false')};
const close=()=>{document.body.classList.remove('cart-open');document.querySelector('.cart-drawer')?.setAttribute('aria-hidden','true')};
const modal=document.querySelector('[data-checkout-modal]');
const render=()=>{
document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=cart.reduce((s,p)=>s+p.qty,0));
const holder=document.querySelector('[data-cart-items]'); if(!holder)return;
if(!cart.length) holder.innerHTML='<div class="cart-empty">Your selection will appear here.<br><span>Add a product to begin.</span></div>';
else holder.innerHTML=cart.map(p=>`<div class="cart-line"><img src="${p.image}" alt=""><div><h3>${p.name}</h3><div class="cart-line-price">${p.price==null?'Price to be confirmed':money(p.price)+' each'}</div><div class="cart-qty"><button type="button" data-qty="-1" data-id="${p.id}" aria-label="Decrease quantity">−</button><span>${p.qty}</span><button type="button" data-qty="1" data-id="${p.id}" aria-label="Increase quantity">+</button></div><button class="cart-remove" type="button" data-remove="${p.id}">Remove</button></div><strong class="cart-line-total">${p.price==null?'On request':money(p.price*p.qty)}</strong></div>`).join('');
const total=cart.reduce((s,p)=>s+(p.price==null?0:p.price*p.qty),0);
document.querySelectorAll('[data-cart-total],[data-checkout-total]').forEach(el=>el.textContent=money(total));
};
document.querySelectorAll('[data-cart-open]').forEach(b=>b.addEventListener('click',open));
document.querySelectorAll('[data-cart-close]').forEach(b=>b.addEventListener('click',close));
document.querySelectorAll('[data-add-cart]').forEach(b=>b.addEventListener('click',()=>{
const id=b.dataset.id,price=b.dataset.price===''?null:Number(b.dataset.price);
const found=cart.find(p=>p.id===id);
if(found)found.qty++;else cart.push({id,name:b.dataset.name,price,image:b.dataset.image,qty:1});
save();open();
}));
document.addEventListener('click',e=>{
const q=e.target.closest('[data-qty]');if(q){const p=cart.find(x=>x.id===q.dataset.id);if(p){p.qty+=Number(q.dataset.qty);if(p.qty<1)cart=cart.filter(x=>x.id!==p.id);save()}return}
const r=e.target.closest('[data-remove]');if(r){cart=cart.filter(x=>x.id!==r.dataset.remove);save()}
});
document.querySelector('[data-cart-checkout]')?.addEventListener('click',()=>{
if(!cart.length){alert('Your cart is empty. Please add a product first.');return}
close();modal?.classList.add('checkout-visible');modal?.setAttribute('aria-hidden','false');
const total=cart.reduce((s,p)=>s+(p.price==null?0:p.price*p.qty),0);
const out=document.querySelector('[data-checkout-total]');if(out)out.textContent=money(total);
});
document.querySelectorAll('[data-checkout-close]').forEach(b=>b.addEventListener('click',()=>{modal?.classList.remove('checkout-visible');modal?.setAttribute('aria-hidden','true')}));
modal?.addEventListener('click',e=>{if(e.target===modal){modal.classList.remove('checkout-visible');modal.setAttribute('aria-hidden','true')}});
document.querySelector('[data-checkout-form]')?.addEventListener('submit',e=>{
e.preventDefault();if(!cart.length)return;
const d=new FormData(e.currentTarget),total=cart.reduce((s,p)=>s+(p.price==null?0:p.price*p.qty),0);
const lines=cart.map(p=>`• ${p.name} × ${p.qty} — ${p.price==null?'Price to be confirmed':money(p.price*p.qty)}`);
const unknown=cart.some(p=>p.price==null);
const msg=['Bonjour Éclorege, I would like to place an order:','',...lines,'',`Subtotal: ${money(total)}${unknown?' (excluding products whose prices are to be confirmed)':''}`,'Delivery fee: please confirm on WhatsApp.','','Customer details:',`Name: ${d.get('name')}`,`Mobile: ${d.get('phone')}`,`Governorate: ${d.get('governorate')}`,`Area: ${d.get('area')}`,`Address: ${d.get('address')}`,`Additional notes: ${d.get('notes')||'None'}`].join('\n');
window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(msg),'_blank','noopener');
});
render();
});