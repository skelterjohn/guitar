\version "2.20.0"
\header {
  title = "Resonance"
  composer = "John Asmuth"
}

\include "bbarred.ly"
#(define RH rightHandFinger)

\new Staff \with {
  \consists "Span_arpeggio_engraver"
}
<<
  {
    \set Staff.connectArpeggios = ##t
    \time 4/4
    \key g \major
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        <bes' e''>4 cis''8 d'' e''4 f'' | <cis'' e''>2 d''4 cis'' |
        <bes' d''>8( e''16 d'' cis''8  d''8) cis''4 bes' | a'2 a' |
        
        \break
        
        <bes' e'' g''>2 c''8 bes'' c''4 | <c'' e'' a'' b''>2 g''4 fis'' |
        <b' f''>2 d''8 g'' f''4 | <c'' e''>2 <c'' e''> |
        
        \break
        
        <bes' d''>4 c'' ees'' d'' | <gis' c''>2 <fis' c''> |
        <f' b'>4 g' ais'  bes' | <dis' a'>2 <dis' a'> |

        \break

        <dis' a'>2 <dis' a'> | <dis' a'>2 <dis' a'> |
        <dis' a'>2 <dis' a'> | <dis' a'>2 <dis' a'> |
        
        \break
        
        <e' a'>2 <e' a'> | <e' a'>2 <e' a'> |
        <e' a'>2 <e' a'> | <e' a'>2 <e' a'>4 e'' |
        
        \break
        
        <f' bes' d'' g''>4 |
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        
        <e a>1 | <e a>1 |
        <e a>1 | <e a>1 |
        
        <e a>1 | <e a>1 |
        <e a>1 | <e a>1 |
        
        <e a>1 | <e a>1 |
        <e a>1 | <e a>1 |
        
        <e a>1 | <e a>1 |
        <e a>1 | <e a>1 |
        
        <e a>1 | <e a>1 |
        <e a>1 | <e a>1 |
        
        <e a>1 | <e a>1 |
        <e a>1 | <e a>1 |
        
      }
      \new Voice { \voiceThree
        \set fingeringOrientations = #'(left)
        
      }
      \new Voice { \voiceFour
        \set fingeringOrientations = #'(left)
      
      }
    >>
  }
>>