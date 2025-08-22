\version "2.20.0"
\header {
  title = "Valseana"
  composer = "Sergio Assad"
  piece = \markup { \line { \circle 6 "= D" } }
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
  \time 3/4
  \key d \major
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      % intro
      
      \repeat volta 2 {
        e''4 fis'' <g''-2> |
        a''2. |
      }
      
      e''4 fis'' <g''> |
      a''2 8 8 |
      
      a''4 g''4. f''8 |
      
      e''4( 8[) d''] cis'' d'' |
      e''8[ fis''] g''[ a''] b''[ d'''] |
      
      % theme
      
      cis'''8 d''' cis'''4\mordent a'' |
      gis''4 e''2 |
      
      g''4 fis''4. d''8 |
      e''4 <b'-0 cis''-4 gis''-2>2 |
    }
    \new Voice { \voiceThree
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      % intro
      
      s2. |
      \tweak Y-offset #-1 r8 a cis''[( d'')] cis''4 |
      
      s2. |
      \tweak Y-offset #-1 r8 c' <e''-3>[( d'')] <c''-3>4 |
      
      s2 g'4 |
      s2. |
      
      s2. |
      
      % theme
      
      s2. |
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      % intro
    
      \tweak Y-offset #-1 r8 <g'-4> cis''[ <b'-3>] <a'-1> <g'-0> |
      s4 fis'4. a'8 |
      
      \tweak Y-offset #-1 r8 <g'> cis''[ <b'>] <a'> <g'> |
      s4 f'2 |
      
      \tweak Y-offset #-1 r8 g' d''[ a'] s4 |
      \tweak Y-offset #-1 r8 e' g'4 fis' |
      
      g'8[ b'] e'[ g'] a[ <b' g''>] |
      
      % theme
      
      \tweak Y-offset #0 r4 e''8 d'' cis''4 |
      \tweak Y-offset #-1 r8 c' b'[ a'] gis' c' |
      
      \tweak Y-offset #-1 r8 b a'[ fis'] s4 |
      \tweak Y-offset #-1 r8 <a fis'~> fis' fis' s4 |
    }
    \new Voice { \voiceFour
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      % intro
      
      a2. |
      d2. |
      
      a2. |
      f2. |
      
      dis2 dis'4 |
      a2. |
      a2. |
      
      % theme
      
      d2~8 a |
      fis2. |
      e2 <a g'-0>4 |
      d2 a4 |
    }
  >>
}

>>