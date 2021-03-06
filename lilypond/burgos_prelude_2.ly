% Copyright Francisco Burgos. No license granted.

\version "2.20.0"
\header {
  title = "Prelude No. 2"
  subtitle = "Nocturno"
  composer = "Francisco Burgos"
  tagline = "Transcription by John Asmuth, copyright Francisco Burgos. No license granted."
}

\paper { ragged-last = ##t }

\include "bbarred.ly"
#(define RH rightHandFinger)

\new Staff \with {
  \consists "Span_arpeggio_engraver"
}
<<
  {
    \set Staff.connectArpeggios = ##t
    \time 3/4
    \key a \major
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(up)
                   
        % A
        \repeat volta 2 {
        \bbarre #"II" { <cis''-2>4 <e'-1>8 <a'-1> cis'' } e'' | d''4 fis'8 b' d'' e'' | cis''4 e'8 a' cis'' e'' | d''4 fis'2 |
        \fbarre #"IV" { e''4 gis'8 cis'' e'' gis'' | fis''4 fis'8 c'' fis'' gis'' |e''4 gis'8 cis'' e'' gis'' | fis''4 <fis' c''>2 } |
        \break
        
        gis''4 b'8 e'' gis'' b'' | \fbarre #"II" { a''4 a' dis'' } | \fbarre #"IV" { dis''4 fis'8 c'' dis'' fis'' | e''4 gis'2 } |
        \mark \markup { \musicglyph #"scripts.coda" }
        \key c \major
        <g' c'' e''>4-"ponticello" e''8 d'' e'' f'' | g''2. | c''4 e'8 a' b' c'' \grace{ b'16( c'' } b'4) a'2 |        
        \break
        
        <a'-3 c''-2>4-"crescendo" c''8 b' c'' <d''-4> | d''4 a' c'' | d''4 d''8 c'' d'' <e''-4> | } \alternative {
          { e''2. |}
          { <e''-4>4 <b'-3> d'' |}
        } 
        
        <e''-0>4\f c''8 e''\2 e''\1 b'' | <b' e'' a''>2-> d''4\p | <e'' a' f'>2.~ | <e'' a' f'>2. |
        
        \bar "||"
        
        \break
        
        \key c \major
        
        % B
        \fbarre #"III" { e''4 g'8 c'' e'' g'' | <b' dis'' a''>2 <b' dis''>4 } | <g'-0 c''-1 e''-0>2. | <e'-2 gis'-1 d''-3>2. |
        <f''-1>8( e'') <dis''-4> <e''-0> \fbarre "#VII" { <gis''-3> b'' } | <g' c'' a'' d'''>2\arpeggio-"X" <g''-4>4 | \fbarre #"VI" { g''4 d''16( cis'') bes'8 a'( bes') } | f''4 e''2 |
        
        \break
        
        \fbarre #"IV" { f''4 c''16( b') aes'8 g'( aes') } | <g' c'' f''>4->-"crescendo" <g' c'' e''>2-> | <a' cis'' f''>4-> <g' cis'' e''>2-> | <g' cis'' g''>4-> <g' cis'' f''>2-> |
        <fis' b' e'' a''>4-> <e' a' d'' g''>2-> | \fbarre #"IV" { <fis' b' e'' b''-4>4-> <fis' b' dis'' a''-2>2-> |<e' gis' b' e'' gis''>2.\arpeggio } | \key  d \major r2 b''4 |
        
        
        \break
        
        cis'''4 e''8 a'' a'' e''' | \fbarre #"IX" { e'''4 <f'' gis'' d'''> d''\staccato }  | <cis''-1>8 cis' f' b' <d''-1> \glissando  \fbarre #"II" { cis''| a'8 fis cis' fis' a' cis'' }
        <b'>4 d'' g'' | cis''4 e' a' | b'8 b' <d''-1\3> d'' <g''-2> g'' | \fbarre #"VII" { <b''>4 <fis'-3 cis''-4 d'' fis''>2 } |
        
        \break
        
        <b'-1\3>8 <b'-0> \bbarre #"VII" { d'' fis'' b'' d''' } | cis'''8 a'' dis'' e'' b'' g'' | a''8 fis'' cis'' g' g'' e' | d'2. |
        <a' dis''>2.~ | <a' dis''>2. | <gis' d'' e''>2.\arpeggio~ | <gis' d'' e''>2.-\markup  { D.C. al \musicglyph #"scripts.coda" }|
        
        \bar "||"
        
        \break
        
        \fbarre #"IV" { e'4 dis' cis' | b4 <g' cis'' dis''>2 | <cis' gis' e''>2.~ | <cis' gis' e''>2. } |
        
        \bar "|."
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        
        % A
        a2. | b2. | a2. | b2. |
        cis'2. | dis'2. | cis'2. | dis'2. |
      
        e2. | fis2. | gis2. | cis'2. |
        c'2. | g4 b d' | a2.~ | a2. |
        
        <f-1>2. | <fis-2>2. | g2. | <gis-2>2. | <gis-2>2. |
        
        a2. | <a fis'>2. | s2. | a2. 
        
        % B
        c'2. | c'2. | <c'-3>2 a4~ | a2 <gis-4>4 |
        e2 b4 | a2.\arpeggio | bes2. | s2. |
        
        gis2. | <c'-1>2. | a2. | bes2.
        s2. | cis'4 <dis'-3>2 | <e >2.\arpeggio | s2. |
        
        a2. | cis'2. | s2. | s2. |
        <fis' g'>2. | a2. | <fis' g'>2. | <b>2. |
        
        s2. | s2. | s4. a | d'2. |
        b2.~ | b2. | <e b e'>2.\arpeggio~ | <e b e'>2. |
        
        s2. | s4 cis'2 | <cis'>2.~ | <cis'>2.
        
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