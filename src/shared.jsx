import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {collection,onSnapshot,orderBy,query} from 'firebase/firestore';
import {db} from './firebase';
import {useApp,money} from './store';
// Public album docs: {title,description,price,videos:[{id,title}],videoCount,createdAt}. No URLs here.
export function useAlbums(){const [a,setA]=useState(null);
  useEffect(()=>onSnapshot(query(collection(db,'albums'),orderBy('title')),s=>setA(s.docs.map(d=>({id:d.id,...d.data()})))),[]);return a;}
export const ytId=u=>{const m=String(u||'').match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/|live\/)([A-Za-z0-9_-]{11})/);return m?m[1]:null};
const hue=t=>Math.abs([...String(t)].reduce((h,c)=>(h*31+c.charCodeAt(0))|0,7))%360;
export function AlbumCard({a}){const {addToCart,owns,cart}=useApp();const inCart=cart.some(c=>c.id===a.id),own=owns(a.id);
  return <div className="pc"><Link to={`/albums/${a.id}`} className="pimg" style={{'--h':hue(a.title)}}><span>▶</span><i className={'pbadge '+(own?'f':'p')}>{own?'Owned':'Paid'}</i></Link>
    <div className="pbody"><Link to={`/albums/${a.id}`} className="ptitle">{a.title}</Link>
      <p className="pmeta">{a.videoCount||0} {a.videoCount===1?'video':'videos'}</p><p className="pinst">Stream instantly after purchase</p>
      <div className="pfoot"><b className="price">{money(a.price)}</b>
        {own?<Link className="btn sm" to={`/watch/${a.id}`}>Watch</Link>:<button className="btn sm" disabled={inCart} onClick={()=>addToCart(a)}>{inCart?'In cart':'Add to cart'}</button>}</div></div></div>;}

// Two-sided auth screen: photo/brand panel on the left, form on the right. Drop a picture at public/login-photo.jpg to use it as the left background.
export function AuthShell({admin,title,text,points,children}){
  return <div className={'as'+(admin?' admin':'')}>
    <aside className="as-photo"><a href={admin?'/admin':'/'} className="logo"><span className="mark">V</span>VideoVault{admin&&<span style={{opacity:.7,fontWeight:600}}> Admin</span>}</a>
      <div className="as-copy"><h2>{title}</h2><p>{text}</p>{points&&<ul>{points.map(x=><li key={x}>{x}</li>)}</ul>}</div>
      <small>© {new Date().getFullYear()} VideoVault</small></aside>
    <main className="as-form"><div className="as-box">{children}</div></main></div>;}
