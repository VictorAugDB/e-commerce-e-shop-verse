import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  if (!searchParams.get('from') && !searchParams.get('from')) {
    return NextResponse.redirect(new URL('/', request.url))
  } else {
    return NextResponse.next()
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/checkout',
}
