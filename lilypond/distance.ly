\version "2.20.0"
\header {
  title = "Distance"
  composer = "John Asmuth"
  tagline = ""
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
  % \partial 4
  \key e \minor
  \tempo 8=100
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \time 6/8
      
      e''8 d'' g'' b'~ b' a' |
      e''8 d'' g'' b'~ b' a' |
      e''8 d'' g'' b'~ b' a' |
      e''8 d'' g'' b'~ b' a' |
      
      e''8 d'' g'' b'~ b' a' |
      e''8 d'' g'' b'~ b' a' |
      e''8 d'' g'' b'~ b' a' |
      e''8 d'' g'' b'~ b' a' |
      
      s2. |
      s2. |
      s2. |
      s2. |
      
      c''16([ b') a'8~] a' e''~ e'' fis'' |
      e''8 <g' d''> <g''> b' a' d'' |
      e''8 <g' d''> <g''> b' a' d'' |
      e''8 <g' d''> <g''> e'' d'' fis'' |
      
      e''8 d'' g'' b'~ b' a' |
      e''8 d'' g'' b'~ b' a' |
      e''8 d'' g'' b'~ b' a' |
      e''8 d'' g'' b'~ b' a' |
      
      \break
      
      c''16( b') a'8~a' b' a' fis'' |
      g''16( fis'') e''8 d'' b' g' a' |
      b'8 g' e'' b' g' a' |
      b'8 a' f'' b' a' d'' |
      
      e''8 d'' g'' b'~ b' a' |
      e''8 d'' g'' b'~ b' a' |
      e''8 d'' g'' b'~ b' a' |
      e''8 d'' g'' b'~ b' a' |
      
      e''8 d''16( e'') fis''8 g''16( fis'') e''8 d'' |
      c''8 b'16( c'') d''8 a'~ a' b' |
      e''8 d''16( e'') fis''8 g''16( fis'') a''8 g''16( fis'') |
      e''16( d'') c''( b') a'( b') c''8~ c'' <d''>8 |
      
      \break
      
      <e''>8 d'' g' b' a' d' |
      <e''>8 d'' g' b' a' d' |
      e''8 d'' g' b' a' fis'' |
            
      s2. |
      e''16[( d'') c''8] g' a' fis'' b' |
      
      s2. |
      s2. |
      s2. |
      s2 s8 s8\fermata |
      
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      s2. |
      s2. |
      s2. |
      s2. |
      
      e'8 fis'~ fis' c'4. |
      a8 b~ b c'~ c' d' |
      g'8 fis' d' c' a4 |
      c'8 b e fis a d' |
      
      e'8 d'16( e') fis'8 g'16( fis') e'8 d' |
      c'8 b16( c') d'8 a~ a b |
      e'8 d'16( e') fis'8 g'16( fis') a'8 g'16( fis') |
      e'16( d') c'( b) a( b) c'8~ c' <d'-0>8 |
      
      e'4 d'8 c'16( b) d'8~ d' |
      a8 b c' d'4. |
      a8 b c' d'4. |
      a8 c'~ c' d'4. |
      
      s2. |
      s2. |
      s2. |
      s2. |
      
      fis'4 eis'8 dis'4. |
      e'4 c'8 g4. |
      f2. |
      fis2. |
      
      s2. |
      s2. |
      s2. |
      s2. |
      
      e'4. c' |
      a4. <e dis'> |
      fis'4 d'8 d' <a d'>4 |
      c'4 r4 r4 |
      
      <e d''>4. fis |
      <g b'>4. <a c''> |
      <c' d''>4. <d' d''> |
      
      e'8 d'16( e') fis'8 g'16( fis') e'8 d' |
      c'4. d' |
      
      e'8 <d'-4> g' b~ b <a-4> |
      e'8 <d'-4> g' b~ b <a-4> |
      e'8 <d'-4> g' b~ b <a-4> |
      e'8 <d'-4> g' b~^"rit." b <a-4> \bar"|."
      
      
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