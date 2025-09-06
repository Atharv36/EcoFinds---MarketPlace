import React from 'react'

export default function MobileNav({ navTo }){
  return (
    <div className="nav-mobile">
      <button className="btn secondary" onClick={()=>navTo('feed')}>Feed</button>
      <button className="btn" onClick={()=>navTo('add')}>+</button>
      <button className="btn secondary" onClick={()=>navTo('mine')}>My</button>
      <button className="btn secondary" onClick={()=>navTo('cart')}>Cart</button>
    </div>
  )
}
