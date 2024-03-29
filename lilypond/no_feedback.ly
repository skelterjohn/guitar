\version "2.20.0"
\header {
  title = "No Feedback"
  composer = "John Asmuth"
}

\paper { ragged-last = ##t }

\include "bbarred.ly"
#(define RH rightHandFinger)

\markup { \italic "with sustain wherever possible" }

<<
\new Staff \with {
  \consists "Span_arpeggio_engraver"
}
{
  \set Staff.connectArpeggios = ##t
  % \partial 4
  \key a \minor
  \tempo 4 = 60
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \time 6/4
      
      r2. r2. |
      r2. r2 r8 e''~ |
      e''4 dis''2 e''2. |
      r4 dis'' e''~ e'' dis''2 |
      \bar ".|:"
      
      \break
      
      e''2. r4 <g''-4> <d''-3>~ |
      d''4 b'2 r4 dis''2 |
      \bar ":|."
      r2. r2. | 
      r2. r2 r8 b' |
      
      \break
      
      \bar ".|:"
      b'4 <c''> d'' e'' <g''> <b'> |
      b'4 fis'' e''~e'' d''2 |
      \bar ":|."
      e''2. r2. |
      r2. r2. |
      
      \break
      
      \bar ".|:"
      r4-\markup { \italic sweetly } cis''2 r4 d''2 |
      e''4 cis'' e''~ e'' d''2 |
      \bar ":|."
      r2 b'4 r2 b'4 |
      r2 b'4 r2 b'4 |
      
      \break
      
      r4 dis'' e'' r4 e'' d'' |
      r4 dis'' e'' r4 e'' d'' |
      r4 b'2 r2. |
      r4-"rit." dis''2\fermata r2. \bar "|."
      
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      a8~\mf <a e'>~ <a e' gis'>2 f8~ <f c'>~ <f c' g'>2 |
      a8-"sim." e' gis'2 f8 c' g'2 |
      a8 e' gis'2 f8 c' g'2 |
      a8 e' gis'2 f8 c' g'2 |
      
      a8 e' gis'2 f8 <c'-2> g'2 |
      a8 e' gis'2 f8 c' g'2 |
      a8 e' gis'2 f8 c' g'2 |
      a8 e' gis'2 f8 c' g'2 |
      
      a8 <e'-3> <gis'>2 f8 c' g'2 |
      a8 e' gis'2 f8 c' g'2 |
      a8 e' gis'2 f8 c' g'2 |
      a8 e' gis'2 f8 c' g'2 |
      
      a8\mp e' gis'2 f8 c' g'2 |
      a8 e' gis'2 f8 c' g'2 |
      a8 e' gis'2 f8 c' g'2 |
      a8 e' gis'2 f8 c' g'2 |
      a8\> e' gis'2 f8 c' g'2 |
      a8 e' gis'2 f8 c' g'2 |
      
      a8 e' gis'2 f8 c' g'2 |
      a8 e' gis'2 r2. \! |
    }
    \new Voice { \voiceThree
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    
    }
    \new Voice { \voiceFour
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    
    }
  >>
}

>>