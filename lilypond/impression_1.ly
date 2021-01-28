\version "2.20.0"
\header {
  title = "Impression 1"
  composer = "John Asmuth"
}

\paper { ragged-last = ##t }

\include "bbarred.ly"
#(define RH rightHandFinger)

\markup {
  "… means repeat to taste"
}

\new Staff \with {
  \consists "Span_arpeggio_engraver"
}
{
  \set Staff.connectArpeggios = ##t
  \key a \minor
  \time 4/4
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      <e''\3-2>16 <a''-3> <e''\3> <e''\1>
      \set Score.repeatCommands = #'((volta "…") end-repeat)
      \bar ".|:" e'' a'' e'' e'' e'' a'' e'' e'' \bar ":|."
      \set Score.repeatCommands = #'((volta #f) )
      e'' a'' e'' e''
      \arpeggioArrowDown <e a b'-1 e''-2 a''-3 e''-0>1 \fermata \arpeggio
      
       <e''\3-2>16 <g''-1> <e''\3> <e''\1>
      \set Score.repeatCommands = #'((volta "…") end-repeat)
      \bar ".|:" e'' g'' e'' e'' e'' g'' e'' e'' \bar ":|."
      \set Score.repeatCommands = #'((volta #f) )
      e'' g'' e'' e''
      \arpeggioArrowDown <d'-3 a d'-0 f''-4 g''-1 e''-0>1 \fermata \arpeggio
      
      \break 
      
      <b'-2>16 <e''-3> <b'> <e''-0>
      \set Score.repeatCommands = #'((volta "…") end-repeat)
      \bar ".|:" b' e'' b' e'' b' e'' b' e'' \bar ":|."
      \set Score.repeatCommands = #'((volta #f) )
      b' e'' b' e''
      \arpeggioArrowDown <e a f' b' e'' e''>1 \fermata \arpeggio
      
      <gis'>16 b' gis' e'' 
      \set Score.repeatCommands = #'((volta "…") end-repeat)
      \bar ".|:" gis' b' gis' e'' gis' b' gis' e'' \bar ":|."
      \set Score.repeatCommands = #'((volta #f) )
      gis' b' gis' e''
      \arpeggioArrowDown <e b d' gis' b' e''>1 \fermata \arpeggio
      
      
      \break
      
      <gis'>16 ( a' ) b' e'' a' c'' e'' gis'' b' d'' f'' d''' e'' gis'' b'' e''' \harmonic
      <gis'>16 ( a' ) b' e'' a' c'' e'' a'' b' d'' f'' e'' a' c'' e'' c''
      
      \break
      
      r8 e''4 e'' e'' e''8~
      e''8 e''4 e'' e'' e''8~
      \set Score.repeatCommands = #'((volta "…") end-repeat)
      \bar ".|:" e''8 e''4 e'' e'' e''8~ \bar ":|."
      \set Score.repeatCommands = #'((volta #f) )
      
      \time 6/4
      
      e''8 e''4 e'' e'' e'' e'' e''8~
      e''8 e''4 e'' e'' e'' e'' e''8~
      e''8 e''4 e'' e'' e'' e'' e''8~
      e''8 e''4 e'' e'' e'' e'' e''8~
      
      
      
      
      
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      s1 s s s s s s s s s 
      
      e'4 f' fis' gis'
      a'1
      r1
      e'4 d' e' b a c'
      r1.
      b4 d' c' fis gis b
      r1.
      
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