\version "2.20.0"
\header {
  title = "Fantasy 1"
  composer = "John Asmuth"
}

\paper { ragged-last = ##t }

\include "bbarred.ly"
#(define RH rightHandFinger)


\new Staff \with {
  \consists "Span_arpeggio_engraver"
}
{
  \set Staff.connectArpeggios = ##t
  \key a \minor
  \time 4/8
  \partial 8
  
  
  fis'''8
  
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      e'''8 e'' g'' b'' d''' b' d'' b''
      \time 1/4
      cis''' a''
      
      \time 4/8
      g''8 d'' e'' \glissando g'' a'' g' cis''' b''
      \time 1/4
      cis''' a''
      
      \time 4/8
      b''8 a'' e'' fis'' g'' bes'' fis'' e''
      \time 1/4
      b'' d'''
      
      \time 4/8
      cis'''8 b' e'' e''' d'''4 c'''
      fis'' e''
      
      
      e'''8 e'' g'' b'' d''' b' d'' b''
      cis''' fis'' d'' \glissando a'
      
      <b' fis''>8 cis'' <g' d''> e'' <a' cis'' fis''>4 a''
      \time 1/4
      b''4
      
      \time 4/8
      cis'''8 b' d'' e'' b'' g' g'' d'''
      \time 1/4
      e''' d'''
      
      \time 4/8
      fis''8 e'' d'' \glissando e'' fis'' d' d'' d'''
      \time 1/4
      b'' a''
      
      \time 4/8
      <fis' g' b'> cis'' <g' d''> e'' a''4 \glissando d'''
      <fis' a' d'' e''>2
      
      
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      s2 s2 s4
      s2 s2 s4
      c'2 cis' s4
      s2 a2 s2
      s2 s2 d'2
      a4 e4 d'2 s4
      s2 s2 s4
      s2 s2 s4
      d'4 <a d'> <g g' b'>2 d'
      
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