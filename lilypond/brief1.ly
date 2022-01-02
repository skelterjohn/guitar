\version "2.20.0"
\header {
  title = "brief 1"
  composer = "skelterjohn"
}

\paper { ragged-last = ##t }

\include "bbarred.ly"
#(define RH rightHandFinger)

<<
\new Staff \with {
  \consists "Span_arpeggio_engraver"
}
{
  \set Staff.connectArpeggios = ##t
    
  \key a \minor
  
  \time 6/8
  \partial 4
  e'
  
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      dis''4 e'' c''8 e' |
      d''4 b' c'' |
      r4 b' g'8 gis' |
      r4 d'8 dis'' e'' g'' |
      
      \break
      
      gis''4 a'' e''8 c'' |
      c'''4 b'' e''8 c'' |
      dis''4 \grace{c''16( dis''} c''4) b' |
      r8-"rit." e' gis' dis''4 e''8 \bar "|."
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      a2. |
      r2. |
      f2. |
      e2. |
      a2. |
      b2. |
      f2. |
      e2. |
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