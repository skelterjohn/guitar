\version "2.20.0"
\header {
  title = "Inversion study"
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
  \key a \minor
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \time 9/8
      a8 e' c'' c' a' e'' e' c'' a'' |
      e b g' g e' b' b g' e'' |
      f c' a' a f' c'' c' a' f'' |
      c' g' e'' e' c'' g'' g' e'' c''' |
      \time 3/8
      e b gis' | \break
      
      \time 9/8
      a8 e' b' c' a' d'' e' c'' g'' |
      e b f' g e' a' b g' d'' |
      f c' g' a f' b' c' a' e'' |
      c' g' d'' e' c'' f'' g' e'' b'' |
      \time 3/8
      e b <g' d''> | \break
      
      \time 9/8
      a8 e' d'' c' a' f'' e' c'' b'' |
      e b a' g e' c'' b g' f'' |
      f c' b' a f' d'' c' a' g'' |
      c' g' f'' e' c'' a'' g' e'' d''' |
      \time 3/8
      e b <gis' b'> | \break
      
      \time 9/8
      <e' a' c''>4.~<e' a' c''>~<e' a' c''> |
      <b e' g'>~<b e' g'>~<b e' g'> | 
      <c' f' a'>~<c' f' a'>~<c' f' a'> |
      <c' e' g'>~<c' e' g'>~<c' e' g'> |
      \time 3/8
      <b e' gis'>4. |
      \break
      
      
      \time 9/8
      c''8 e' a e'' a' c' a'' c'' e' |
      g' b e b' e' g e'' g' b |
      a' c' f c'' f' a f'' a' c' |
      e'' g' c' g'' c'' e' c''' e'' g' |
      \time 3/8
      e b gis' | \break
      
      \time 9/8
      b'8 e' a d'' a' c' g'' c'' e' |
      f' b e a' e' g d'' g' b |
      g' c' f b' f' a e'' a' c' |
      d'' g' c' f'' c'' e' b'' e'' g' |
      \time 3/8
      e b <g' d''> | \break
      
      \time 9/8
      d''8 e' a f'' a' c' b'' c'' e' |
      a' b e c'' e' g f'' g' b |
      b' c' f d'' f' a g'' a' c' |
      f'' g' c' a'' c'' e' d''' e'' g' |
      \time 3/8
      e b <gis' b'> | \break
      
      \time 9/8
      <a e' a' c''>4.~<a e' a' c''>~<a e' a' c''> |
      <b e' g' b'>~<b e' g' b'>~<b e' g' b'> | 
      <c' f' a' c''>~<c' f' a' c''>~<c' f' a' c''> |
      <c' e' g' c''>~<c' e' g' c''>~<c' e' g' c''> |
      \time 3/8
      <b e' gis' b'>4. |
      \break
      
      \time 9/8
      <a e' a' c'' e''>4.~<a e' a' c'' e''>~<a e' a' c'' e''> |
      <b e' g' b' e''>~<b e' g' b' e''>~<b e' g' b' e''> | 
      <c' f' a' c'' e''>~<c' f' a' c'' e''>~<c' f' a' c'' e''> |
      <c' e' g' c'' e''>~<c' e' g' c'' e''>~<c' e' g' c'' e''> |
      \time 3/8
      <b e' gis' b' e''>4. |
      
      \time 4/4
      <a e' a' cis''>1\arpeggio
      
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)

      
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