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
  \tempo 4 = 60
  
  
  fis'''8
  
  <<
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(down)
      
      \bar ".|:"
      e'''8 e''\3 g'' b'' d''' b'\2 d''\3 b''
      \time 1/4
      cis'''-"rit" a''
      \bar ":|.|:"
      
      \time 4/8
      g''8\2 d''\3 e'' \glissando g'' a'' g'\3 cis''' b''
      \time 1/4
      cis'''-"rit" a''
      \bar ":|."
      
      \time 4/8
      <b''-1>8 <a''-4> <e''-3> <fis''-1> <g''-1> bes'' <fis''-1> <e''-3>
      \time 1/4
      b''-"rit" d'''
      
      \time 4/8
      cis'''8 b'\2 e''\3 e''' d'''4 a''
      \time 1/4
      fis''8-"rit" e''
      
      \time 4/8
      e'''8 e'' g'' b'' d''' b' d'' b''
      cis''' fis'' d'' \glissando a'
      
      <b' fis''>8 cis'' <g' d''> e'' <a' cis'' fis''>4 a''
      \time 1/4
      b''4-"rit"
      
      \bar ".|:"
      \time 4/8
      cis'''8 b'\2 d''\3 e''\1 b''\2 g' g'' d'''
      \time 1/4
      e'''-"rit" d'''
      \bar ":|.|:"
      
      \time 4/8
      fis''8\1 e'' d''\2 \glissando e'' fis'' d' d'' d'''
      \time 1/4
      b''-"rit" a''
      \bar ":|."
      
      \time 4/8
      s s s s s2
      s s 
      <d' a' d'' e''>2
      
      \bar "|."
      
    }
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      e'''4 s4 d'''4 s4 s4
      g''4 s4 a''4 s4 s4
      b''4 s4 g''4 s4 s4
      cis'''4 s4 d'''4 s4 s4
      e'''4 s4 d'''4 s4 cis'''4 s4
      s4 s4 s2 s4
      cis'''4 s4 b''4 s4 s4
      fis''4 s4 fis''4 s4 s4
      b'8 cis'' d'' e'' a''4 \glissando d'''
      e''8 fis'' g'' a'' \glissando e'''2 \fermata-"—"
      
    }
    \new Voice { \voiceThree
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
    
    }
    \new Voice { \voiceFour
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      s2 s2 s4
      s2 s2 s4
      c'2 cis' s4
      s2 a2 s4
      s2 s2 d'2
      a4 e4 d'2 s4
      s2 s2 s4
      s2 s2 s4
      <d' fis' g'>4 <a d' g'> <g g' b'>2 
      <d' g' cis''>4 <a g' b'>
    }
  >>
}