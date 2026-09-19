import { useMemo, useState } from 'react'

const PRODUCTS = [
  {
    code: 'WP-4410',
    brand: 'Northline',
    name: 'Nitrile exam gloves, powder-free',
    pack: '100 / box',
    list: 8.1,
    contract: 6.4,
    stock: 842,
    swatch: '#dbe7f5',
  },
  {
    code: 'WP-1182',
    brand: 'Clearview',
    name: 'Sterile gauze pads, 4×4',
    pack: '200 / pack',
    list: 14.25,
    contract: 11.9,
    stock: 126,
    swatch: '#f3efe6',
  },
  {
    code: 'WP-9031',
    brand: 'Harbor',
    name: 'Surface disinfectant, concentrate',
    pack: '4 L jug',
    list: 22.0,
    contract: 17.6,
    stock: 54,
    swatch: '#e4f0ea',
  },
  {
    code: 'WP-2204',
    brand: 'Apex',
    name: 'Stainless utility bowl, 3 qt',
    pack: 'Each',
    list: 9.8,
    contract: 7.45,
    stock: 31,
    swatch: '#eceff3',
  },
  {
    code: 'WP-5518',
    brand: 'Fieldpack',
    name: 'Exam table paper, crepe',
    pack: '12 / case',
    list: 28.4,
    contract: 21.15,
    stock: 0,
    swatch: '#f6ead8',
  },
  {
    code: 'WP-3309',
    brand: 'Polar',
    name: 'Instant cold pack',
    pack: '24 / case',
    list: 19.5,
    contract: 15.2,
    stock: 210,
    swatch: '#e7eef8',
  },
]

function money(value) {
  return `$${value.toFixed(2)}`
}

function stockLabel(qty) {
  if (qty <= 0) return { text: 'Out', tone: 'text-[#b42318] bg-[#fef3f2]' }
  if (qty < 40) return { text: 'Low', tone: 'text-[#b54708] bg-[#fffaeb]' }
  return { text: 'In stock', tone: 'text-[#027a48] bg-[#ecfdf3]' }
}

export default function DealerPortalMini() {
  const [query, setQuery] = useState('')
  const [qtyByCode, setQtyByCode] = useState(() =>
    Object.fromEntries(PRODUCTS.map((item) => [item.code, 1])),
  )
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [quickCode, setQuickCode] = useState('')
  const [notice, setNotice] = useState('')

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return PRODUCTS
    return PRODUCTS.filter((item) =>
      `${item.code} ${item.brand} ${item.name} ${item.pack}`.toLowerCase().includes(needle),
    )
  }, [query])

  const count = cart.reduce((sum, line) => sum + line.qty, 0)
  const subtotal = cart.reduce((sum, line) => sum + line.qty * line.contract, 0)

  function flash(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 1800)
  }

  function addToCart(item, qty) {
    const amount = Math.max(1, Number(qty) || 1)
    if (item.stock <= 0) {
      flash('That item is out of stock.')
      return
    }
    setCart((lines) => {
      const existing = lines.find((line) => line.code === item.code)
      if (existing) {
        return lines.map((line) =>
          line.code === item.code ? { ...line, qty: line.qty + amount } : line,
        )
      }
      return [...lines, { ...item, qty: amount }]
    })
    setCartOpen(true)
    flash(`${item.code} added`)
  }

  function setLineQty(code, qty) {
    const amount = Math.max(1, Number(qty) || 1)
    setCart((lines) => lines.map((line) => (line.code === code ? { ...line, qty: amount } : line)))
  }

  function removeLine(code) {
    setCart((lines) => lines.filter((line) => line.code !== code))
  }

  function quickAdd() {
    const code = quickCode.trim().toUpperCase()
    const item = PRODUCTS.find((row) => row.code === code)
    if (!item) {
      flash('No match for that item code.')
      return
    }
    addToCart(item, 1)
    setQuickCode('')
  }

  function checkout() {
    if (!cart.length) return
    flash('Order sent to the ERP')
    setCart([])
    setCartOpen(false)
  }

  return (
    <div
      className="relative h-[min(38rem,78svh)] sm:h-[min(34rem,72vh)] bg-[#f4efe6] text-[#1c2a44] overflow-hidden select-none flex flex-col touch-manipulation"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="h-8 flex items-center justify-between px-3 bg-[#1c2a44] text-[#f4efe6] shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#c45c26]" />
          <span className="w-2 h-2 rounded-full bg-[#d4b483]" />
          <span className="w-2 h-2 rounded-full bg-[#7d8f6e]" />
          <span className="ml-2 text-[9px] tracking-widest uppercase truncate">
            Ordering Portal
          </span>
        </div>
        <span className="text-[9px] text-[#d4c7b2] hidden sm:block">Signed in · Northside Clinic</span>
      </div>

      <div className="h-12 px-3 flex items-center gap-2 border-b border-[#e4d9c8] bg-[#fffdf8] shrink-0">
        <form
          className="flex-1 min-w-0 flex items-center gap-0 rounded-lg border border-[#d4c7b2] overflow-hidden bg-[#f4efe6]"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search SKU or product"
            className="flex-1 min-w-0 bg-transparent px-3 py-2 text-base sm:text-[12px] text-[#1c2a44] placeholder:text-[#a89880] outline-none"
          />
        </form>
        <button
          type="button"
          onClick={() => setCartOpen((open) => !open)}
          className="relative shrink-0 rounded-lg bg-[#1c2a44] min-h-10 px-3 text-[12px] font-semibold text-[#f4efe6]"
        >
          Cart
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-[#c45c26] text-white text-[9px] leading-4">
              {count}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3">
        <p className="text-[11px] text-[#7a6e5d] mb-2">
          {matches.length} products · contract price on every SKU
        </p>
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {matches.map((item) => {
            const stock = stockLabel(item.stock)
            const inCart = cart.some((line) => line.code === item.code)
            return (
              <article
                key={item.code}
                className="rounded-xl border border-[#e4d9c8] bg-[#fffdf8] p-2.5 flex flex-col shadow-[0_8px_20px_rgba(28,42,68,0.06)]"
              >
                <div
                  className="relative h-16 rounded-lg mb-2"
                  style={{ background: item.swatch }}
                >
                  <span className={`absolute top-1.5 right-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${stock.tone}`}>
                    {stock.text}
                  </span>
                </div>
                <p className="text-[9px] font-bold uppercase tracking-wide text-[#c45c26]">{item.brand}</p>
                <h4 className="text-[12px] font-semibold leading-snug mt-0.5 min-h-0 sm:min-h-[2.4em]">{item.name}</h4>
                <p className="text-[10px] text-[#7a6e5d]">{item.pack}</p>
                <p className="text-[10px] font-semibold text-[#7a6e5d] mt-1">{item.code}</p>
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#efe6d8]">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-wide text-[#a89880]">List</p>
                    <p className="text-[12px] font-semibold line-through text-[#a89880]">{money(item.list)}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-wide text-[#a89880]">Your price</p>
                    <p className="text-[13px] font-extrabold text-[#9a3412]">{money(item.contract)}</p>
                  </div>
                </div>
                <div className="mt-2 flex gap-1.5">
                  <input
                    type="number"
                    min="1"
                    value={qtyByCode[item.code]}
                    onChange={(event) =>
                      setQtyByCode((current) => ({
                        ...current,
                        [item.code]: Math.max(1, Number(event.target.value) || 1),
                      }))
                    }
                    className="w-14 sm:w-12 h-10 sm:h-8 rounded-lg border border-[#d4c7b2] bg-[#fffdf8] text-center text-base sm:text-[12px]"
                  />
                  <button
                    type="button"
                    disabled={item.stock <= 0}
                    onClick={() => addToCart(item, qtyByCode[item.code])}
                    className="flex-1 h-10 sm:h-8 rounded-lg text-[12px] sm:text-[11px] font-semibold text-white bg-[#1c2a44] disabled:bg-[#d4c7b2] disabled:text-white"
                  >
                    {inCart ? 'Add more' : 'Quick add'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
        {matches.length === 0 && (
          <p className="text-[12px] text-[#7a6e5d] py-8 text-center">No products match that search.</p>
        )}
      </div>

      {cartOpen && (
        <div className="absolute inset-0 sm:inset-y-8 sm:left-auto sm:right-0 w-full sm:w-[min(100%,20rem)] bg-[#fffdf8] sm:border-l border-[#e4d9c8] shadow-[-12px_0_24px_rgba(28,42,68,0.12)] z-10 flex flex-col">
          <div className="h-11 px-3 flex items-center justify-between border-b border-[#e4d9c8] bg-[#1c2a44] text-[#f4efe6]">
            <p className="text-[12px] font-semibold">Cart</p>
            <button type="button" className="text-[12px] text-[#d4c7b2] min-h-8 px-1" onClick={() => setCartOpen(false)}>
              Close
            </button>
          </div>
          <div className="px-3 py-2 border-b border-[#e4d9c8] flex gap-1.5">
            <input
              value={quickCode}
              onChange={(event) => setQuickCode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') quickAdd()
              }}
              placeholder="Item code"
              className="flex-1 min-w-0 h-10 sm:h-8 rounded-lg border border-[#d4c7b2] bg-[#f4efe6] px-2 text-base sm:text-[11px]"
            />
            <button
              type="button"
              onClick={quickAdd}
              className="h-10 sm:h-8 px-3 rounded-lg bg-[#c45c26] text-white text-[12px] font-semibold"
            >
              Add
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2">
            {cart.length === 0 && <p className="text-[12px] text-[#7a6e5d]">Cart is empty.</p>}
            {cart.map((line) => (
              <div key={line.code} className="rounded-lg border border-[#e4d9c8] bg-white p-2">
                <div className="flex justify-between gap-2">
                  <p className="text-[11px] font-semibold leading-snug">{line.name}</p>
                  <button type="button" className="text-[10px] text-[#9a3412]" onClick={() => removeLine(line.code)}>
                    Remove
                  </button>
                </div>
                <p className="text-[10px] text-[#7a6e5d] mt-0.5">{line.code}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <input
                    type="number"
                    min="1"
                    value={line.qty}
                    onChange={(event) => setLineQty(line.code, event.target.value)}
                    className="w-14 h-10 sm:w-12 sm:h-7 rounded-md border border-[#d4c7b2] text-center text-base sm:text-[11px]"
                  />
                  <p className="text-[12px] font-bold">{money(line.qty * line.contract)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-[#e4d9c8]">
            <div className="flex justify-between text-[12px] mb-2">
              <span className="text-[#7a6e5d]">Subtotal</span>
              <span className="font-bold">{money(subtotal)}</span>
            </div>
            <button
              type="button"
              disabled={!cart.length}
              onClick={checkout}
              className="w-full h-11 sm:h-9 rounded-lg bg-[#c45c26] text-white text-[12px] font-semibold disabled:bg-[#d4c7b2]"
            >
              Review & submit
            </button>
          </div>
        </div>
      )}

      {notice && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1c2a44] text-[#f4efe6] text-[11px] px-3 py-1.5 z-20">
          {notice}
        </div>
      )}
    </div>
  )
}
