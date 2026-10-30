import { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, ShoppingCart, Menu, ChevronDown, Heart, Star, Plus, Minus, X, ArrowLeft, Check, Package, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { products } from './data/products';
const money = n => '₹' + Number(n).toLocaleString('en-IN');
const categories = ['All','Fresh','Electronics','Fashion','Home','Beauty','Grocery'];

function Header({query,setQuery,category,setCategory,cartCount,onCart,onHome,onNavigate,onAccount,onOrders,onLanguage,onLocation,language,deliveryPin}) {
 const [draft,setDraft]=useState(query);
 useEffect(()=>setDraft(query),[query]);
 return <><header className="top-header">
  <button className="brand" onClick={onHome}><span className="brand-main">amazon</span><span className="brand-smile">⌣</span><small>.in</small></button>
  <button className="location header-box" onClick={onLocation}><MapPin size={18}/><span><small>Deliver to</small><b>Jaipur {deliveryPin}</b></span></button>
  <form className="searchbar" onSubmit={e=>{e.preventDefault();setQuery(draft);onHome();}}>
   <select aria-label="Category" value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select>
   <input value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Search Amazon.in" aria-label="Search products"/>
   <button aria-label="Search"><Search size={22}/></button>
  </form>
  <button className="language header-box" onClick={onLanguage}><span>🇮🇳</span><b>{language}</b><ChevronDown size={12}/></button>
  <button className="account header-box" onClick={onAccount}><small>Hello, sign in</small><b>Account & Lists <ChevronDown size={12}/></b></button>
  <button className="returns header-box" onClick={onOrders}><small>Returns</small><b>& Orders</b></button>
  <button className="cart-button" onClick={onCart}><span className="cart-count">{cartCount}</span><ShoppingCart size={32}/><b>Cart</b></button>
 </header><nav className="subnav"><button className="nav-all" onClick={()=>onNavigate('All')}><Menu size={19}/><b>All</b></button>{['Best Sellers','Electronics','Fashion','Home & Kitchen'].map(x=><button key={x} onClick={()=>onNavigate(x)}>{x}</button>)}<span className="nav-promo">Great Shopping Festival · Shop deals</span></nav></>;
}
function Stars({rating}) { return <span className="stars" aria-label={`${rating} out of 5 stars`}>{'★'.repeat(Math.floor(rating))}<span>{'★'.repeat(5-Math.floor(rating))}</span><small>{rating}</small></span>; }
function ProductCard({product,onOpen,onAdd,wished,onWish}) {
 const discount=Math.round((1-product.price/product.mrp)*100);
 return <article className="product-card">{product.badge&&<div className="deal-badge">{product.badge}</div>}
  <button className={`wish ${wished?'wished':''}`} onClick={()=>onWish(product.id)} aria-label="Toggle wishlist"><Heart size={18} fill={wished?'currentColor':'none'}/></button>
  <button className="product-image" onClick={()=>onOpen(product)}><img src={product.image} alt={product.title} loading="lazy"/></button>
  <button className="product-title" onClick={()=>onOpen(product)}>{product.title}</button><Stars rating={product.rating}/>
  <div className="price-line"><span className="discount">-{discount}%</span><span className="price"><sup>₹</sup>{product.price.toLocaleString('en-IN')}</span></div>
  <div className="mrp">M.R.P.: <s>{money(product.mrp)}</s></div><div className="delivery">FREE delivery <b>Tomorrow</b></div>
  <button className="add-button" onClick={()=>onAdd(product)}>Add to Cart</button>
 </article>;
}
function ProductModal({product,onClose,onAdd}) {
 if(!product)return null;
 return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><section className="product-modal"><button className="modal-close" onClick={onClose}><X/></button>
  <img src={product.image} alt={product.title}/><div className="modal-info"><span className="eyebrow">{product.category}</span><h2>{product.title}</h2><Stars rating={product.rating}/><p className="modal-price">{money(product.price)} <del>{money(product.mrp)}</del></p><p className="modal-desc">{product.description}</p><p className="stock"><Check size={17}/> In stock</p><p className="delivery">FREE delivery <b>Tomorrow</b></p><button className="add-button wide" onClick={()=>{onAdd(product);onClose();}}>Add to Cart</button><button className="buy-button wide" onClick={()=>{onAdd(product);onClose();}}>Buy Now</button></div>
 </section></div>;
}
function CartDrawer({cart,onClose,onQty,onRemove,onCheckout}) {
 const entries=Object.values(cart),subtotal=entries.reduce((s,i)=>s+i.product.price*i.qty,0);
 return <div className="overlay cart-overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><aside className="cart-drawer">
  <div className="drawer-head"><h2>Shopping Cart</h2><button onClick={onClose}><X/></button></div>
  {!entries.length?<div className="empty-cart"><ShoppingCart size={46}/><h3>Your Amazon.in Cart is empty</h3><p>Explore products and add something you love.</p><button className="add-button" onClick={onClose}>Continue shopping</button></div>:<>
   <p className="subtotal">Subtotal ({entries.reduce((s,i)=>s+i.qty,0)} items): <b>{money(subtotal)}</b></p><p className="free-delivery"><Check size={16}/> Your order qualifies for FREE delivery.</p>
   <div className="cart-items">{entries.map(({product,qty})=><div className="cart-item" key={product.id}><img src={product.image} alt={product.title}/><div className="cart-item-info"><b>{product.title}</b><strong>{money(product.price)}</strong><div className="qty"><button onClick={()=>onQty(product.id,-1)}><Minus size={14}/></button><span>{qty}</span><button onClick={()=>onQty(product.id,1)}><Plus size={14}/></button><button className="remove" onClick={()=>onRemove(product.id)}>Delete</button></div></div></div>)}</div>
   <div className="cart-bottom"><div className="subtotal">Subtotal: <b>{money(subtotal)}</b></div><button className="buy-button wide" onClick={onCheckout}>Proceed to Buy</button><small>Demo checkout only — no real payment will be taken.</small></div>
  </>}
 </aside></div>;
}
function Checkout({cart,onBack,onPlace}) {
 const [name,setName]=useState(''),[address,setAddress]=useState(''),[pin,setPin]=useState('');
 const total=Object.values(cart).reduce((s,i)=>s+i.product.price*i.qty,0);
 return <main className="checkout-page"><button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Back to cart</button><h1>Checkout</h1><div className="checkout-layout">
  <form className="checkout-form" onSubmit={e=>{e.preventDefault();if(name.trim()&&address.trim()&&/^\d{6}$/.test(pin))onPlace({name,address,pin});}}>
   <h2>1. Delivery address</h2><label>Full name<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Recipient name"/></label><label>Address<textarea required value={address} onChange={e=>setAddress(e.target.value)} placeholder="House no., street, area" rows="3"/></label><label>PIN code<input required inputMode="numeric" maxLength="6" value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,''))} placeholder="6-digit PIN code"/></label><h2>2. Payment method</h2><p className="payment-note">Demo mode: no real payment processing.</p><button className="buy-button wide" type="submit">Place your order</button>
  </form><aside className="order-summary"><h3>Order Summary</h3><p>Items subtotal <span>{money(total)}</span></p><p>Delivery <span className="green">FREE</span></p><hr/><h3>Order total <span>{money(total)}</span></h3></aside>
 </div></main>;
}
export default function App(){
 const [query,setQuery]=useState(''),[category,setCategory]=useState('All'),[sort,setSort]=useState('featured');
 const [cart,setCart]=useState(()=>{try{return JSON.parse(localStorage.getItem('amazon-in-cart')||'{}')}catch{return {}}});
 const [wishes,setWishes]=useState([]),[selected,setSelected]=useState(null),[cartOpen,setCartOpen]=useState(false),[checkout,setCheckout]=useState(false),[notice,setNotice]=useState(''),[order,setOrder]=useState(null);
 const [panel,setPanel]=useState(()=>localStorage.getItem('amazon-demo-user')?'':'account'),[authMode,setAuthMode]=useState('signin'),[signedIn,setSignedIn]=useState(()=>localStorage.getItem('amazon-demo-user')||''),[language,setLanguage]=useState('EN'),[deliveryPin,setDeliveryPin]=useState('302017'),[pastOrders,setPastOrders]=useState([]);
 useEffect(()=>localStorage.setItem('amazon-in-cart',JSON.stringify(cart)),[cart]);
 useEffect(()=>{if(!notice)return;const t=setTimeout(()=>setNotice(''),2500);return()=>clearTimeout(t)},[notice]);
 const visible=useMemo(()=>{let list=products.filter(p=>(category==='All'||p.category===category)&&p.title.toLowerCase().includes(query.trim().toLowerCase()));if(sort==='price-low')list.sort((a,b)=>a.price-b.price);if(sort==='price-high')list.sort((a,b)=>b.price-a.price);if(sort==='rating')list.sort((a,b)=>b.rating-a.rating);return list;},[query,category,sort]);
 const cartCount=Object.values(cart).reduce((s,i)=>s+i.qty,0);
 function add(product){setCart(prev=>({...prev,[product.id]:{product,qty:(prev[product.id]?.qty||0)+1}}));setNotice('Added to Cart');}
 function qty(id,d){setCart(prev=>{const n={...prev};if(!n[id])return prev;const q=n[id].qty+d;if(q<=0)delete n[id];else n[id]={...n[id],qty:q};return n;});}
 function remove(id){setCart(prev=>{const n={...prev};delete n[id];return n;});}
 function home(){setCheckout(false);setOrder(null);window.scrollTo({top:0,behavior:'smooth'});}
 function navigateNav(label){
  setCheckout(false);setOrder(null);setQuery('');
  if(label==='All'){setCategory('All');setSort('featured');}
  else if(label==='Fresh'){setCategory('Fresh');setSort('featured');}
  else if(label==="Today's Deals"){setCategory('All');setSort('price-low');}
  else if(label==='Electronics'||label==='Mobiles'){setCategory('Electronics');}
  else if(label==='Fashion'){setCategory('Fashion');}
  else if(label==='Home & Kitchen'){setCategory('Home');}
  else if(label==='Best Sellers'){setCategory('All');setSort('rating');}
  else {setNotice(`${label} is a demo navigation item; this section isn't available yet.`);return;}
  setTimeout(()=>document.getElementById('products')?.scrollIntoView({behavior:'smooth',block:'start'}),0);
 }
 function placeOrder(address){const id='AMZ'+Math.random().toString(36).slice(2,8).toUpperCase();const placed={id,address,total:Object.values(cart).reduce((s,i)=>s+i.product.price*i.qty,0),date:new Date().toLocaleDateString('en-IN')};setOrder(placed);setPastOrders(prev=>[placed,...prev]);setCart({});setCheckout(false);}
 return <div className="app-shell"><Header query={query} setQuery={setQuery} category={category} setCategory={setCategory} cartCount={cartCount} onCart={()=>setCartOpen(true)} onHome={home} onNavigate={navigateNav} onAccount={()=>setPanel('account')} onOrders={()=>setPanel('orders')} onLanguage={()=>setPanel('language')} onLocation={()=>setPanel('location')} language={language} deliveryPin={deliveryPin}/>
  {order?<main className="confirmation"><div className="confirm-icon"><Check size={38}/></div><h1>Order placed successfully!</h1><p>This test order was created locally in the demo.</p><div className="confirm-box"><p>Order number <b>{order.id}</b></p><p>Delivering to <b>{order.address.name}</b></p><p>{order.address.address}, {order.address.pin}</p><h2>Order total: {money(order.total)}</h2></div><button className="add-button" onClick={home}>Continue shopping</button></main>:checkout?<Checkout cart={cart} onBack={()=>setCheckout(false)} onPlace={placeOrder}/>:<>
   <div className="announcement"><span>Shop deals across top categories</span><b>Festival offers · Limited-time prices</b></div>
   <section className="hero"><img src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1800&q=85" alt="Shopping deals banner"/><div className="hero-copy"><span>THE BIG SHOPPING EVENT</span><h1>Deals you'll<br/>love to discover.</h1><p>Find something great for every day.</p><button onClick={()=>{setCategory('All');setQuery('');document.getElementById('products')?.scrollIntoView({behavior:'smooth'})}}>Explore deals <span>→</span></button></div><div className="hero-caption">Offers shown for demonstration.</div></section>
   <main className="main-content" id="products"><div className="welcome-strip"><div><h2>Shop what you love</h2><p>Discover everyday essentials and great finds.</p></div><div className="trust-points"><span><Package size={18}/> Wide selection</span><span><RotateCcw size={18}/> Easy returns*</span><span><Check size={18}/> Demo store</span></div></div>
    <div className="section-heading"><div><h2>{query?`Results for "${query}"`:category==='All'?"Today's top picks":category}</h2><p>{visible.length} products to explore</p></div><label className="sort-control"><SlidersHorizontal size={16}/><span>Sort by</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Customer rating</option></select></label></div>
    {visible.length?<div className="product-grid">{visible.map(p=><ProductCard key={p.id} product={p} onOpen={setSelected} onAdd={add} wished={wishes.includes(p.id)} onWish={id=>setWishes(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id])}/>)}</div>:<div className="no-results"><Search size={36}/><h2>No products found</h2><p>Try another search or category.</p><button className="add-button" onClick={()=>{setQuery('');setCategory('All')}}>Clear filters</button></div>}
    <section className="promo-row"><div><span>HOME & LIVING</span><h2>Small updates.<br/>Big difference.</h2><p>Thoughtful finds for your space.</p><button onClick={()=>setCategory('Home')}>Shop home →</button></div><div className="promo-image"><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85" alt="Modern home interior"/></div></section>
   </main></>}
  <footer className="footer"><button className="back-top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>Back to top</button><div className="footer-columns"><div><h3>Get to Know Us</h3><a>About Amazon.in</a><a>Careers</a><a>Press releases</a></div><div><h3>Make Money with Us</h3><a>Sell on Amazon.in</a><a>Advertise products</a><a>Affiliate programme</a></div><div><h3>Let Us Help You</h3><a>Your account</a><a>Returns centre</a><a>Help</a></div><div><h3>Amazon.in India</h3><p>Everyday shopping, made simple.</p><p className="footer-disclaimer">Independent demo project; not affiliated with Amazon.</p></div></div><div className="footer-bottom"><b className="footer-logo">amazon.in</b><span>India · English · ₹ INR</span><small>© 2026 Amazon.in demo</small></div></footer>
  {selected&&<ProductModal product={selected} onClose={()=>setSelected(null)} onAdd={add}/>}
  {cartOpen&&<CartDrawer cart={cart} onClose={()=>setCartOpen(false)} onQty={qty} onRemove={remove} onCheckout={()=>{setCartOpen(false);setCheckout(true)}}/>}
  {panel&&<div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&signedIn&&setPanel('')}><section className="account-panel">{(signedIn||panel!=='account')&&<button className="modal-close" onClick={()=>setPanel('')}><X/></button>}
   {panel==='account'&&<><h2>{signedIn?`Hello, ${signedIn}`:authMode==='signup'?'Create your account':'Sign in'}</h2>{signedIn?<><p>You are signed in to this local demo as <b>{signedIn}</b>.</p><button className="add-button wide" onClick={()=>{localStorage.removeItem('amazon-demo-user');setSignedIn('');setNotice('Signed out');setPanel('')}}>Sign out</button><button className="buy-button wide" onClick={()=>setPanel('orders')}>Your Orders</button></>:authMode==='signin'?<><form onSubmit={e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const n=String(fd.get('name')||'').trim();if(n){setSignedIn(n);localStorage.setItem('amazon-demo-user',n);setNotice(`Welcome, ${n}`);setPanel('')}}}><p>Sign in to continue shopping in this demo.</p><label>Your name<input name="name" required placeholder="Enter your name" autoComplete="name"/></label><label>Email or mobile (demo)<input name="email" required placeholder="Email or mobile number"/></label><button className="buy-button wide" type="submit">Continue</button></form><div className="auth-divider"><span>New to Amazon.in?</span></div><button className="add-button wide" onClick={()=>setAuthMode('signup')}>Create your Amazon.in account</button></>:<><form onSubmit={e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const n=String(fd.get('name')||'').trim();const email=String(fd.get('email')||'').trim();const password=String(fd.get('password')||'');if(n&&email&&password.length>=6){setSignedIn(n);localStorage.setItem('amazon-demo-user',n);setNotice(`Account created. Welcome, ${n}`);setPanel('')}}}><p>Create a demo account to enter the store.</p><label>Your name<input name="name" required placeholder="First and last name" autoComplete="name"/></label><label>Email or mobile number<input name="email" required placeholder="Email or mobile number" autoComplete="email"/></label><label>Create password<input name="password" type="password" minLength="6" required placeholder="At least 6 characters" autoComplete="new-password"/></label><button className="buy-button wide" type="submit">Create your account</button></form><p className="panel-footnote">Already have an account? <button className="text-link" onClick={()=>setAuthMode('signin')}>Sign in</button></p></>}<p className="panel-footnote">Demo account only. Credentials are not sent to a server and this is not real Amazon authentication.</p></>}
   {panel==='orders'&&<><h2>Your Orders</h2>{pastOrders.length?pastOrders.map(o=><div className="panel-order" key={o.id}><b>Order {o.id}</b><span>{o.date} · {money(o.total)}</span><small>Delivering to {o.address.name} · PIN {o.address.pin}</small></div>):<div className="panel-empty"><Package size={36}/><p>You haven't placed any demo orders yet.</p><button className="add-button" onClick={()=>{setPanel('');home()}}>Start shopping</button></div>}</>}
   {panel==='language'&&<><h2>Choose your language</h2>{[['EN','English'],['HI','हिन्दी']].map(([code,label])=><button className={`panel-option ${language===code?'chosen':''}`} key={code} onClick={()=>{setLanguage(code);setNotice(`Language set to ${label} for this demo`);setPanel('')}}>{label}{language===code?' ✓':''}</button>)}<p className="panel-footnote">Language preference is for demo display only; product descriptions remain in English.</p></>}
   {panel==='location'&&<><h2>Choose your location</h2><p>Enter your 6-digit PIN code to update the delivery location shown in the header.</p><form onSubmit={e=>{e.preventDefault();setNotice(`Delivery PIN updated to ${deliveryPin}`);setPanel('')}}><label>PIN code<input value={deliveryPin} onChange={e=>setDeliveryPin(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" pattern="[0-9]{6}" required/></label><button className="buy-button wide" type="submit">Apply location</button></form></>}
  </section></div>}
  {notice&&<div className="toast"><Check size={18}/>{notice}</div>}
 </div>;
}