\version "2.20.0"
\header {
  title = "Prelude in E minor"
  composer = "John Asmuth"
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
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \time 4/4
      
      \repeat volta 2 {
        s16\2^"x2" e''8\1 8 8 8 8 8 8 16~ |
        e''16\2^"x2" e''8 8 8 8 8 8 8 16~ |
      }
      
      \repeat volta 2 {
        e''16 e''8 8 8 8 8 8 8 16~ | 
      }
      
      
      \repeat volta 2 {
        e''16 e''8 8 8 8 8 8 8 16~ | 
        e''16 e''8 8 8 8 8 8 8 16~ | 
        e''16^"x2" e''8 8 8 8 8 8 8 16~ |
      }
      
      e''16^"x2" e''8 8 8 8 8 8 8 16~ | 
      
      e''16^"x2" e''8 8 8 8 8 8 8 16~ | 
      e''16^"x2" e''8 8 8 8 8 8 8 16~ | 
      e''16^"x2" e''8 8 8 8 8 8 8 16~ | 
      e''16^"x2" e''8 8 8 8 8 8 8 16~ | 
      e''16 <e a e' g' e''>8 8 8 8 8 8 8 16~ | 
      
      e''16^"x2" e''8 8 8 8 8 8 8 16~ |
      
      e''16 e''8 8 8 8 8 8 8 16~ |
      e''16 e''8 8 8 8 8 8 8 16~ |
      e''16 e''8 8 8 8 8 8 8 16~ |
      
      e''16 e''8\1 8\1 8\1 8\1 8 8 8 16~ |
      e''16 e''8 8 8 8 8 8 8 16~ |
      e''16 e''8 8 8 8 8 8 8 16~ |
      e''16 e''8 8 8 8 8 8 8 16~ |
      
      e''16 e''8 8 8 8 8 8 8 16~ |
      e''16 e''8 8 8 8 8 8 8 16~ |
      e''16 e''8 8 8 8 8 8 8 16~ |
      e''16^"x2" e''8 8 8 8 8 8 8 16 |
      
      \tuplet 3/2 {r16 e''\1 e''\2 } \repeat unfold 7 {\tuplet 3/2 {r16 e'' e'' }}
      \repeat unfold 8 {\tuplet 3/2 {r16 e'' e'' }}
      \repeat unfold 8 {\tuplet 3/2 {r16 e'' e'' }}
      \repeat unfold 8 {\tuplet 3/2 {r16 e'' e'' }}
      
      \repeat unfold 8 {\tuplet 3/2 {r16 e'' e'' }}
      \repeat unfold 8 {\tuplet 3/2 {r16 e'' e'' }}
      \repeat unfold 8 {\tuplet 3/2 {r16 e'' e'' }}
      \repeat unfold 8 {\tuplet 3/2 {r16 e'' e'' }}
      
      \repeat unfold 8 {\tuplet 3/2 {r16 e'' fis'' }}
      \repeat unfold 8 {\tuplet 3/2 {r16 e'' g'' }}
      \repeat unfold 8 {\tuplet 3/2 {r16 e'' a'' }}
      
      \repeat unfold 8 {\tuplet 3/2 {r16 e'' fis'' }}
      \repeat unfold 8 {\tuplet 3/2 {r16 e'' g'' }}
      \repeat unfold 8 {\tuplet 3/2 {r16 e'' a'' }}
      
      \repeat unfold 8 {\tuplet 3/2 {r16 e'' b'' }}
      
      e'1\harmonic |
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
     
      e''8 8 8 8 8 8 8 8 |
      d''8 fis'' d'' fis'' d'' fis'' d'' fis''  |
      
      e''8\2^"x2" 8 8 8 8 8 8 8 |
      
      <c'' e''>8 8 8 8 8 8 8 8 |
      <b' e''>8 8 8 8 8 8 8 8 |
      <a' e''>8 8 8 8 8 8 8 8 |
      
      e''8\2 8 8 8 8 8 8 8 |
      
      <e' g' e''>8 8 8 8 8 8 8 8 |
      <d' g' e''>8 8 8 8 8 8 8 8 |
      <c' c'' e''>8 8 8 8 8 8 8 8 |
      <a e' g' e''>8 8 8 8 8 8 8 8 |
      <e a e' g' e''>8 8 8 8 8 8 8 8 |
      
      e''8 8 8 8 8 8 8 8 |
      
      d''8 fis'' d'' fis'' d'' fis'' d'' fis''  |
      c''8 g'' c'' g'' c'' g'' c'' g''  |
      d''8 a'' d'' a'' d'' a'' d'' a''  |
      
      e''8\3 8\2 8\3 8\2 8 8 8 8 |
      d''8 e'' d'' e'' d'' e'' d'' e'' |
      b'8 e'' b' e'' b' e'' b' e'' |
      c''8 e'' c'' e'' c'' e'' c'' e'' |
      
      e''8 8 8 8 8 8 8 8 |
      d''8 e'' d'' e'' d'' e'' d'' e'' |
      b'8 e'' b' e'' b' e'' b' e'' |
      b'8 e'' b' e'' b' e'' b' e'' |
      
      e'8 b' e' b' e' b' e' b' |
      d'8 b' d' b' d' b' d' b' |
      b8 b' b b' b b' b b' |
      a8 b' a b' a b' a b' |
      
      e'8 b' e' b' e' b' e' b' |
      d'8 b' d' b' d' b' d' b' |
      b8 b' b b' b b' b b' |
      c'8 b' c' b' c' b' c' b' |
      
      a8 b' a b' a b' a b' |
      a8 b' a b' a b' a b' |
      a8 c'' a c'' a c'' a c'' |
      
      a8 b' a b' a b' a b' |
      a8 b' a b' a b' a b' |
      a8 d'' a d'' a d'' a d'' |
      
      e8 e'' e e'' e e'' e e'' |
      
      s1 |
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