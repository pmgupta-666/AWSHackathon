import { NextRequest, NextResponse } from 'next/server'

// Attempt to fetch public Luma event page and extract attendee info
// Luma's public pages show limited guest info - this gets what's visible
export async function POST(req: NextRequest) {
  const { url } = await req.json()

  if (!url) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
  }

  // Normalize URL
  let eventUrl = url.trim()
  if (!eventUrl.startsWith('http')) {
    eventUrl = 'https://' + eventUrl
  }
  if (!eventUrl.includes('lu.ma') && !eventUrl.includes('luma')) {
    return NextResponse.json({ error: 'Please enter a lu.ma event URL' }, { status: 400 })
  }

  try {
    // Try fetching the Luma event page
    const res = await fetch(eventUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Meetr/1.0)',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`)
    }

    const html = await res.text()

    // Extract event name from title tag
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/)
    const eventName = titleMatch
      ? titleMatch[1].replace(' | Luma', '').replace(' - Luma', '').trim()
      : 'Luma Event'

    // Try to extract __NEXT_DATA__ JSON (Luma is Next.js)
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)

    let attendees: any[] = []

    if (nextDataMatch) {
      try {
        const nextData = JSON.parse(nextDataMatch[1])
        // Walk the props tree to find guest/attendee data
        const str = JSON.stringify(nextData)

        // Try to find guest array patterns in the JSON
        const guestMatches = str.match(/"name":"([^"]+)","[^}]*"api_id":"([^"]+)"/g) || []
        const seen = new Set<string>()

        guestMatches.forEach((match, i) => {
          const nameMatch = match.match(/"name":"([^"]+)"/)
          const idMatch = match.match(/"api_id":"([^"]+)"/)
          if (nameMatch && idMatch && !seen.has(idMatch[1])) {
            seen.add(idMatch[1])
            attendees.push({
              id: idMatch[1],
              name: nameMatch[1],
              role: 'Attendee',
              company: '',
              avatarUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(nameMatch[1])}&backgroundColor=b6e3f4,d1d4f9,c0aede,ffd5dc`,
              linkedinUrl: '',
              intent: pickIntent(i),
              sharedEvents: Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0,
            })
          }
        })
      } catch {
        // JSON parse failed, fall through to fallback
      }
    }

    // If we couldn't extract real attendees, return a helpful error
    // so the user knows to use the demo
    if (attendees.length === 0) {
      return NextResponse.json({
        error: `Loaded "${eventName}" but couldn't extract public attendees — Luma restricts this. Use the demo event to see the full experience!`,
        eventName,
        attendees: [],
      })
    }

    return NextResponse.json({ attendees: attendees.slice(0, 30), eventName })

  } catch (err: any) {
    if (err.name === 'TimeoutError') {
      return NextResponse.json({ error: 'Request timed out. Try the demo event!' }, { status: 504 })
    }
    return NextResponse.json({
      error: "Couldn't load that event (Luma may block scraping). Use the demo event to see the full experience!"
    }, { status: 500 })
  }
}

const INTENTS = ['co-founder', 'investor', 'hiring', 'be-hired', 'customers', 'just-vibing']
function pickIntent(i: number) {
  return INTENTS[i % INTENTS.length] as any
}
