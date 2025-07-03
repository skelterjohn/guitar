\version "2.20.0"
\header {
  title = "Seeking Never Finding II: Cancion in B minor"
  composer = "John Asmuth"
  tagline = ""
}

\paper { ragged-last = ##t }

\include "../bbarred.ly"
#(define RH rightHandFinger)

<<
\new Staff \with {
  \consists "Span_arpeggio_engraver"
}
{
  \set Staff.connectArpeggios = ##t
  % \partial 4
  \key b \minor
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      \time 3/4
      
      \repeat volta 2 {
        <b''-4>2 a''8 b'' |
        cis'''2~ 8 \acciaccatura{<d'''-4>\glissando(} <b''-4>) |
        b''2 a''8 b'' |
        \acciaccatura{cis'''(} <e''>2.) |
        
        g''4 a'' b'' |
        cis'''4 d''' e''' |
        e'''2. |
        e'''2. |
      }
      
      <d'' g''>2. |
      <b' cis'' e''>2. |
      b'4 cis'' e'' |
      d''4 e'' f'' |
      
      fis''4 gis'' c''' |
      c'''4 b'' <bes' d''> |
      <a' b' d'' e''>2.\arpeggio |
      cis''2 g''8 a'' |
      
      b''2 \acciaccatura{ g''8( a''} b''4) |
      cis'''4 d'''2 |
      d'''4 e'''2 |
      e'''2. |
      
      cis''4 b'8 cis'' d''4 |
      d''4 c''2 |
      <a' c''>2 4~ |
      <a' c''>4 2 | 
      
      <b' e''>2.\fermata \bar "|."
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
      
      <g' d''-1>2. |
      <g' e''>2. |
      <g' e''>2. |
      b'2. |
      
      d'2. |
      s2. |
      g'2. |
      r2. |
      
      e'2 fis'8 g' |
      a'2~ 8 \acciaccatura{b'(} a'8) |
      b'2 s4 |
      <f a' d'>2. |
      
      <a e' c''>2. |
      e2. |
      a2.\arpeggio |
      r2. |
      
      <g' d''>2. |
      <g' e''>2. |
      <b' fis''>2. |
      g'2. |
      
      e'2. |
      <c' a'>2. |
      a2  g4~ |
      g4 f2 |
      
      <e a> 2.\fermata |
    }
    \new Voice { \voiceThree
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    
    
    }
    \new Voice { \voiceFour
      \set fingeringOrientations = #'(left)
      \set stringNumberOrientations = #'(up)
    
      s2. |
      s2. |
      s2. |
      <d''-1>4 <cis''-1> <b'-1> |
      
      <b'-0>4. a'8 g'4 |
      <a' e''>4. b'8 cis''4 |
      s2. |
      s2. |
      
      s2. |
      s2. |
      g'4. e'4 a8 |
      s2. |
      
      s2. |
      g'4. aes'8 bes'4 |
    }
  >>
}

>>