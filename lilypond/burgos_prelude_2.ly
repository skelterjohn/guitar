\version "2.20.0"
\header {
  title = "Prelude No. 2"
  subtitle = "Nocturno"
  composer = "Francisco Burgos"
  arranger = "Arr. John Asmuth"
}

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
                   
        % A
        \repeat volta 2 {
        cis''4 e'8 a' cis'' e'' | d''4 fis'8 b' d'' e'' | cis''4 e'8 a' cis'' e'' | d''4 fis'2 |
        \fbarre #"IV" { e''4 gis'8 cis'' e'' gis'' | fis''4 fis'8 c'' fis'' gis'' |e''4 gis'8 cis'' e'' gis'' | fis''4 <fis' c''>2 } |
        \break
        
        \bbarre #"IV" { gis''4 b'8 e'' gis'' b'' } | \fbarre #"II" { a''4 a' dis'' } | \fbarre #"IV" { dis''4 fis'8 c'' dis'' fis'' | e''4 gis'2-\coda } |
        
        \key c \major     
        <g' c'' e''>4 e''8 d'' e'' f'' | g''2. | c''4 e'8 a' b' c'' \grace{ b'16( c'' } b'2) a'4 |        
        \break
        
        \fbarre #"I" { <a' c''>4 c''8 b' c'' d'' } | \fbarre #"II" { d''4 a' c'' } | \fbarre #"III" { d''4 d''8 c'' d'' e'' } | } \alternative {
          { e''2. |}
          { \fbarre #"IV" { e''4 b' d'' } |}
        } 
        
        e''4 c''8 e''\2 e''\1 b'' | <b' e'' a''>2 d''4 | e''2. | s2. |
        
        \bar "||"
        
        \break
        
        \key c \major
        
        % B
        e''4 g'8 c'' e'' g'' | <b' dis'' a''>2 <b' dis''>4 | <g' c'' e''>2. | <gis' a' d''>2. |
        <f''-4\3>8( e'') dis''( e'') \fbarre #"VII" { gis'' b'' } | <c'' g'' d'''>2\arpeggio g''4 | \fbarre #"VI" { g''4 d''16( cis'') bes'8 a'( bes') } | f''4 e''2 |
        
        \break
        
        \fbarre #"IV" { f''4 c''16( b') aes'8 g'( aes') } | \fbarre #"III" { <g' c'' f''>4 <g' c'' e''>2 } | <a' cis'' f''>4 <g' cis'' e''>2 | <g' cis'' g''>4 <g' cis'' f''>2 |
        <fis' b' e'' a''>4 <e' a' d'' g''>2 | \fbarre #"IV" { <fis' b' b''-4>4 <fis' b' a''-2>2 } | <e' gis' b' gis''>2.\arpeggio | r2 b''4 |
        
        \key  d \major
        
        \break
        
        cis'''4 e''8 a'' a'' e''' | \fbarre #"IX" { e'''4 <f'' gis'' d'''> d''\harmonic }  | cis''8 cis' f' gis' d''  \fbarre #"II" { cis''| a'8 fis cis' fis' a' cis'' }
        <b'\3>4 d'' g'' | cis''4 e' a' | <b'\3>8 b' d'' d'' g'' g'' | <b''-1>4 <fis'-3 b'-4 cis''-2 fis''-1>2 |
        
        \break
        
        <b'-1\3>8 <b'-0> \bbarre #"VII" { d'' fis'' b'' d''' } | cis'''8 a'' dis'' e'' b'' g'' | \fbarre #"V" { a''8 fis'' cis'' g' g'' e' } | d'2. |
        <a' dis''>2.~ | <a' dis''>2. | <gis' b' e''>2.~ | <gis' b' e''>2.-\markup  { D.C. al \musicglyph #"scripts.coda" }|
        
        \bar "||"
        
        \break
        
        e'4 dis' cis' | b4 <g' cis'' dis''>2 | <gis' cis' e''>2.~ | <gis' cis' e''>2. |
        
        \bar "|."
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        
        % A
        a2. | b2. | a2. | b2. |
        cis'2. | dis'2. | cis'2. | dis'2. |
      
        e2. | fis2. | gis2. | cis'2. |
        c'2. | g4 b d' | a2. | r2. |
        
        f2. | fis2. | g2. | gis2. | gis2. |
        
        a2. | <a fis'>2. | a'2. | a2. 
        
        % B
        c'2. | c'2. | c'2 a4~ | a2 gis4 |
        e2 b4 | a2.\arpeggio | bes2. | s2. |
        
        gis2. | c'2. | a2. | bes2.
        s2. | cis'4 <dis'-3>2 | e2.\arpeggio | s2. |
        
        a2. | cis'2. | s2. | s2. |
        fis'2. | a2. | fis'2. | <b-1>2. |
        
        s2. | s2. | s4. a | d'2. |
        b2.~ | b2. | <e b e'>2.~ | <e b e'>2. |
        
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