import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const MEMBERS = [
  { name: 'Alex Brennan', role: 'Admin', city: 'Edmonton', initial: 'AB' },
  { name: 'Jordan Hale', role: 'Agent', city: 'Calgary', initial: 'JH' },
  { name: 'Sam Reid', role: 'Agent', city: 'Red Deer', initial: 'SR' },
  { name: 'Casey Nguyen', role: 'Assistant', city: 'Edmonton', initial: 'CN' },
  { name: 'Morgan Ellis', role: 'Lender', city: 'Vancouver', initial: 'ME' },
  { name: 'Riley Cho', role: 'Lender', city: 'Calgary', initial: 'RC' },
]

const LENDERS = [
  { name: 'Northshore Bank', meta: 'Rates · forms · BDM' },
  { name: 'Prairie Trust', meta: 'Comp grid · promo' },
  { name: 'Pacific Underwrite', meta: 'Policy files' },
]

const TRAINING = [
  { title: 'File Friday — deal prep pack', kind: 'Weekly file' },
  { title: 'New agent: lender onboarding', kind: 'Guide' },
  { title: 'Appraisal setup walkthrough', kind: 'Video' },
]

const EVENTS = [
  { title: 'Lender breakfast', when: 'Thu · Edmonton' },
  { title: 'Team huddle', when: 'Mon · Zoom' },
]

const ROLES = [
  { id: 'agent', label: 'Agent' },
  { id: 'lender', label: 'Lender' },
  { id: 'admin', label: 'Admin' },
]

const CITIES = [
  { label: 'Vancouver', lat: 49.2827, lng: -123.1207 },
  { label: 'Edmonton', lat: 53.5461, lng: -113.4938 },
  { label: 'Red Deer', lat: 52.2681, lng: -113.8112 },
  { label: 'Calgary', lat: 51.0447, lng: -114.0719 },
]

function TeamMap({ city, onSelect, people }) {
  const hostRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef({})
  const onSelectRef = useRef(onSelect)
  const peopleRef = useRef(people)
  const atCity = city ? people.filter((row) => row.city === city) : []

  onSelectRef.current = onSelect
  peopleRef.current = people

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    const map = L.map(host, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    const bounds = []
    let skipMapClick = false
    CITIES.forEach((pin) => {
      const count = peopleRef.current.filter((row) => row.city === pin.label).length
      const marker = L.circleMarker([pin.lat, pin.lng], {
        radius: 8,
        color: '#ffffff',
        weight: 2,
        fillColor: '#0a3d52',
        fillOpacity: 1,
      }).addTo(map)

      marker.bindTooltip(`${pin.label} · ${count}`, {
        direction: 'top',
        offset: [0, -10],
        className: 'tp-map-label',
      })
      marker.on('click', (event) => {
        L.DomEvent.stopPropagation(event.originalEvent)
        skipMapClick = true
        onSelectRef.current((current) => (current === pin.label ? null : pin.label))
      })
      markersRef.current[pin.label] = marker
      bounds.push([pin.lat, pin.lng])
    })

    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 6 })
    map.on('click', () => {
      if (skipMapClick) {
        skipMapClick = false
        return
      }
      onSelectRef.current(null)
    })
    map.on('mouseover', () => map.scrollWheelZoom.enable())
    map.on('mouseout', () => map.scrollWheelZoom.disable())
    mapRef.current = map

    const resize = () => map.invalidateSize()
    const frame = window.requestAnimationFrame(resize)
    const timer = window.setTimeout(resize, 160)
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null
    observer?.observe(host)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      observer?.disconnect()
      map.remove()
      mapRef.current = null
      markersRef.current = {}
    }
  }, [])

  useEffect(() => {
    Object.entries(markersRef.current).forEach(([label, marker]) => {
      const active = city === label
      marker.setStyle({
        fillColor: active ? '#1aa3c7' : '#0a3d52',
        radius: active ? 10 : 8,
      })
      if (active) marker.openTooltip()
      else marker.closeTooltip()
    })
  }, [city])

  return (
    <div className="tp-map flex-1 min-h-[16rem] h-full rounded-xl border border-[#b7dbe6] relative overflow-hidden">
      <div ref={hostRef} className="absolute inset-0" />
      {city && (
        <div className="absolute top-2 right-2 z-[1000] max-w-[11rem] rounded-xl bg-white/95 border border-[#b7dbe6] p-2 shadow pointer-events-none">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#1aa3c7]">{city}</p>
          {atCity.map((row) => (
            <p key={row.name} className="text-[11px] font-semibold text-[#073042] mt-0.5">
              {row.name}
              <span className="text-[#3d6a7a] font-medium"> · {row.role}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

function canSee(role, area) {
  if (role === 'admin' || role === 'agent') return true
  if (area === 'directory' || area === 'events') return true
  return false
}

export default function TeamPortalMini() {
  const [role, setRole] = useState('agent')
  const [tab, setTab] = useState('directory')
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')
  const [city, setCity] = useState(null)

  const tabs = [
    { id: 'directory', label: 'Directory' },
    canSee(role, 'map') ? { id: 'map', label: 'Map' } : null,
    canSee(role, 'training') ? { id: 'training', label: 'Training' } : null,
    { id: 'events', label: 'Events' },
    role === 'admin' ? { id: 'admin', label: 'Admin' } : null,
  ].filter(Boolean)

  const visibleTab = tabs.some((item) => item.id === tab) ? tab : 'directory'

  const people = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const rows = role === 'lender' ? MEMBERS.filter((row) => row.role === 'Lender') : MEMBERS
    if (!needle) return rows
    return rows.filter((row) => `${row.name} ${row.role} ${row.city}`.toLowerCase().includes(needle))
  }, [query, role])

  function switchRole(next) {
    setRole(next)
    setQuery('')
    if (next === 'lender' && (tab === 'map' || tab === 'training' || tab === 'admin')) {
      setTab('directory')
    }
    setNotice(next === 'lender' ? 'Lender view — no training, tools, or map' : `${next} view`)
    window.setTimeout(() => setNotice(''), 1600)
  }

  return (
    <div
      className="relative h-[min(38rem,78svh)] sm:h-[min(34rem,72vh)] overflow-hidden select-none text-[#073042] bg-[#d7eef6] flex flex-col touch-manipulation"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-2 px-2.5 sm:px-3 py-1.5 bg-[#0a3d52] text-white shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#1aa3c7] shrink-0" />
          <span className="w-2 h-2 rounded-full bg-[#7ed4ea] hidden min-[380px]:block shrink-0" />
          <span className="w-2 h-2 rounded-full bg-[#c5e8f2] hidden min-[380px]:block shrink-0" />
          <span className="ml-1 sm:ml-2 text-[9px] tracking-widest uppercase truncate">
            Member portal
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {ROLES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => switchRole(item.id)}
              className={`h-7 px-2 rounded-full text-[10px] sm:text-[9px] font-semibold ${
                role === item.id ? 'bg-[#1aa3c7] text-white' : 'text-white/70 hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-12 px-3 flex items-center gap-2 bg-[#0e4a62] shrink-0">
        <p className="hidden sm:block text-[11px] font-semibold text-[#7ed4ea] shrink-0">Portal</p>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search team…"
          className="flex-1 min-w-0 h-9 sm:h-8 rounded-full border-0 bg-white px-3 text-base sm:text-[12px] text-[#073042] outline-none"
        />
        <span className="relative shrink-0 w-8 h-8 rounded-full bg-[#1aa3c7] text-white text-[11px] font-bold flex items-center justify-center">
          2
        </span>
      </div>

      <div className="h-10 px-3 flex items-center gap-1 border-b border-[#b7dbe6] bg-[#eaf7fb] overflow-x-auto shrink-0">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`h-8 px-3 rounded-full text-[12px] sm:text-[11px] font-semibold whitespace-nowrap ${
              visibleTab === item.id ? 'bg-[#1aa3c7] text-white' : 'text-[#3d6a7a]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        className={`flex-1 min-h-0 p-3 ${
          visibleTab === 'map' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto overscroll-contain'
        }`}
      >
        {visibleTab === 'directory' && (
          <div className="space-y-2">
            <p className="text-[11px] text-[#3d6a7a]">
              {role === 'lender' ? 'Your lender directory' : 'Team, lenders, and partners'}
            </p>
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2">
              {people.map((person) => (
                <article key={person.name} className="rounded-xl border border-[#b7dbe6] bg-white p-2.5 shadow-[0_8px_20px_rgba(10,61,82,0.08)]">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#0a3d52] text-[#7ed4ea] text-[10px] font-bold flex items-center justify-center">
                      {person.initial}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold truncate">{person.name}</p>
                      <p className="text-[10px] text-[#3d6a7a]">
                        {person.role} · {person.city}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {role !== 'lender' && (
              <div className="grid grid-cols-1 min-[420px]:grid-cols-3 gap-2 pt-1">
                {LENDERS.map((lender) => (
                  <article key={lender.name} className="rounded-xl border border-[#b7dbe6] bg-[#eaf7fb] p-2">
                    <p className="text-[11px] font-semibold leading-snug">{lender.name}</p>
                    <p className="text-[10px] text-[#3d6a7a] mt-0.5">{lender.meta}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {visibleTab === 'map' && (
          <TeamMap city={city} onSelect={setCity} people={MEMBERS} />
        )}

        {visibleTab === 'training' && (
          <div className="space-y-2">
            {TRAINING.filter((item) =>
              query.trim() ? item.title.toLowerCase().includes(query.toLowerCase()) : true,
            ).map((item) => (
              <article key={item.title} className="rounded-xl border border-[#b7dbe6] bg-white p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#1aa3c7]">{item.kind}</p>
                  <p className="text-[12px] font-semibold mt-0.5">{item.title}</p>
                </div>
                <span className="text-[10px] font-semibold text-[#1aa3c7]">Open</span>
              </article>
            ))}
          </div>
        )}

        {visibleTab === 'events' && (
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2">
            {EVENTS.map((item) => (
              <article key={item.title} className="rounded-xl border border-[#b7dbe6] bg-white p-3">
                <p className="text-[12px] font-semibold">{item.title}</p>
                <p className="text-[10px] text-[#3d6a7a] mt-1">{item.when}</p>
              </article>
            ))}
            <article className="rounded-xl border border-[#b7dbe6] bg-[#0a3d52] p-3 text-white">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#7ed4ea]">Perk</p>
              <p className="text-[12px] font-semibold mt-0.5 text-white">Partner rate on title search</p>
            </article>
          </div>
        )}

        {visibleTab === 'admin' && (
          <div className="rounded-xl border border-[#b7dbe6] bg-white overflow-hidden">
            <div className="px-3 py-2 border-b border-[#b7dbe6] bg-[#0a3d52] text-white text-[11px] font-semibold">Pending approval</div>
            {[
              { name: 'Pat Okonkwo', ask: 'Agent · waiting' },
              { name: 'Lee Park', ask: 'Assistant · waiting' },
            ].map((row) => (
              <div key={row.name} className="px-3 py-2.5 flex items-center justify-between border-b border-[#b7dbe6] last:border-0">
                <div>
                  <p className="text-[12px] font-semibold">{row.name}</p>
                  <p className="text-[10px] text-[#3d6a7a]">{row.ask}</p>
                </div>
                <span className="text-[10px] font-semibold text-[#1aa3c7]">Approve</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {notice && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0a3d52] text-white text-[11px] px-3 py-1.5 z-10">
          {notice}
        </div>
      )}
    </div>
  )
}
