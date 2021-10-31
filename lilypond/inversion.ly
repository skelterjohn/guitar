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
      a8 <e'-2> <c''-1> <c'-3> <a'-2> e'' <e'-1> <c''-3\3> <a''-4> |
      e <b-1> g' <g-3> <e'-2> b' b g' e'' |
      \break
      <f-1> <c'-3> <a'-2> a <f'-3> <c''-1> <c'-3> <a'-2> <f''-1> |
      <c'-3> g' e'' <e'-2> <c''-1> <g''-4> g' <e''-1\2> <c'''-4> |
      \time 3/8
      e b gis' | \break
      
      \time 9/8
      a8 <e'-2> b' <c'-3> <a'-2> <d''-4> <e'-2> <c''-1> <g''-4> |
      e <b-2> <f'-4> <g-3> <e'-1> <a'-2> <b-1> g' <d''-4> |
      \break
      <f-1> <c'-3> g' a <f'-4> b' <c'-3> <a'-2> e'' |
      <c'-3> g' <d''-4> <e'-2> <c''-1> <f''-1> g' <e''-1\2> <b''-3> |
      \time 3/8
      e b <g' d''> | \break
      
      \time 9/8
      <a-1\6>8-V <e'-2\5> <d''-3\3> <c'-4\6> <a'-3\4> <f''-2\2> <e'-3\5> <c''-1\3> <b''-4\1> |
      <e>-I <b-2> <a'-3> <g-4> <e'-2> <c''-1> <b-2> g' <f''-1> |
      \break
      <f-1> <c'-3> b' a <f'-3> <d''-4> <c'-3> <a'-2> <g''-4> |
      <c'-1>-III g' <f''-4\2> <e'-3>-V <c''-1> <a''-1> <g'-3\5>-VIII <e''-2\3> <d'''-4> |
      \time 3/8
      e b <gis' b'> | \break
      
      \time 9/8
      <a e' a'>4.~<a e' a'>~<a e' a'> |
      <b e' g'>~<b e' g'>~<b e' g'> | 
      <c' f' a'>~<c' f' a'>~<c' f' a'> |
      <c' e' g'>~<c' e' g'>~<c' e' g'> |
      \time 3/8
      <b e' gis'>4. |
      \break
      
      
      \time 9/8
      <c''-1>8 <e'-2> a e'' <a'-1> <c'-2> <a''-4> <c''-3> <e'-1> |
      g' <b-1> e b' <e'-2> <g-3> e'' g' b |
      \break
      a' c' f c'' f' a f'' a' c' |
      e'' g' c' g'' c'' e' c''' e'' g' |
      \time 3/8
      e b gis' | \break
      
      \time 9/8
      b'8 e' a d'' a' c' g'' c'' e' |
      f' b e a' e' g d'' g' b |
      \break
      g' c' f b' f' a e'' a' c' |
      d'' g' c' f'' c'' e' b'' e'' g' |
      \time 3/8
      e b <g' d''> | \break
      
      \time 9/8
      d''8 e' a f'' a' c' b'' c'' e' |
      a' b e c'' e' g f'' g' b |
      \break
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