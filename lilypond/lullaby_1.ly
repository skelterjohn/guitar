\version "2.20.0"
\header {
  title = "Lullaby No. 1"
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
  <<
    \time 3/4
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \mark "Intro"
      \repeat unfold 4 {
        r2. |
      }
      \break \bar ".|:"
      
      \mark \markup { \circle A }
      e''2. | a''2. | b''2. | c'''2. |
      \break \bar "||"
      
      e''2. | a''2. | d''2.~ | d''2. |
      \break \bar "||"
      
      d''2. | e''2. | gis''2. | e''2. \mark \markup { \musicglyph "scripts.coda" } |
      \break \bar "||"
      
      a''2. | a''2. | a''2.~ | a''2. |
      \break \bar ":|.|:"
      
      \mark \markup { \circle B }
      g''2 f''4 | e''2. | f''2 e''4 | d''2.^\markup { \circle A "to" \musicglyph "scripts.coda" "then" \circle C } |
      \break \bar ":|."
      
      
      \mark \markup { \circle C }
      c''2. | b'2. | a'2.~ | a'2. |
      r2. | e''4 gis''2\fermata |
      
      \bar "|."
      
    }
  >>
}
\new TabStaff {
  \set Staff.stringTunings = \stringTuning <e a d' g' b' e''>
  << 
    {
      \repeat unfold 4 {
        r2. |
      }
      
      e''2. | a''2. | b''2. | c'''2. |
      
      e''2. | a''2. | d''2.~ | d''2. |
      
      d''2. | e''2. | gis''2. | e''2. |
      
      a''2. | a''2. | a''2.~ | a''2. |
      
      g''2 f''4 | e''2. | f''2 e''4 | d''2. |
      
      c''2. | b'2. | a'2.~ | a'2. |
      r2. | e''4 gis''2\fermata |
    }
  >>
}
\new Staff \with {
  \consists "Span_arpeggio_engraver"
}
{
  \set Staff.connectArpeggios = ##t
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \repeat unfold 4 {
        a8 e' <a' c''> e' <a' c''>4 |
      }
      
      \repeat unfold 4 {
        a8 e' <a' c''> e' <a' c''> e' |
      }
      
      \repeat unfold 2 {
        a8 e' <a' c''> e' <a' c''> e' |
      }
      \repeat unfold 2 {
        e8 b <gis' b'> b <gis' b'> b |
      }
      
      \repeat unfold 4 {
        e8 b <gis' b'> b <gis' b'> b |
      }
      \repeat unfold 2 {
        e8 b <gis' b'> b <gis' b'> b |
      }
      \repeat unfold 2 {
        a8 e' <a' c''> e' <a' c''> e' |
      }
      
      \repeat unfold 2 {
        a8 e' <a' cis''> e' <a' cis''> e' |
      }
      \repeat unfold 2 {
        d'8 a' <d'' f''> a' <d'' f''> a' |
      }
      
      a8 e' <a' c''> e' <a' c''> e' |
      e8 b <e' gis'> b <e' gis'> b |
      a8 e' <a' c''> e' <a' c''> e' |
      e8 b <e' gis'> b <e' gis'> b |
      a4^"rit." c' e' | r2. |
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \repeat unfold 4 {
        a4 s2 |
      }
      
      \repeat unfold 4 {
        a4 s2 |
      }
      
      \repeat unfold 2 {
        a4 s2 |
      }
      \repeat unfold 2 {
        e4 s2 |
      }
      
      \repeat unfold 4 {
        e4 s2 |
      }
      
      \repeat unfold 2 {
        e4 s2 |
      }
      \repeat unfold 2 {
        a4 s2 |
      }
      
      \repeat unfold 2 {
        a4 s2 |
      }
      \repeat unfold 2 {
        d'4 s2 |
      }
      
      a4 s2 | e4 s2 |
      a4 s2 | e4 s2 |
      
      s2. | s2. |
    }
  >>
}

>>