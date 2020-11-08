\version "2.20.0"
\header {
  title = "Prelude No. 2"
  subtitle = "Nocturno"
  composer = "Francisco Burgos"
  arranger = "Arr. John Asmuth"
}

\include "bbarred.ly"
#(define RH rightHandFinger)

<<
  {
    \time 3/4
   
        \key a \major
    <<
      \new Voice { \voiceOne
    
        \repeat volta 2 {
        cis''4 e'8 a' cis'' e'' | d''4 fis'8 b' d'' e'' | cis''4 e'8 a' cis'' e'' | d''4 fis'2 |
        \fbarre #"IV" { e''4 gis'8 cis'' e'' gis'' | fis''4 fis'8 c'' fis'' gis'' |e''4 gis'8 cis'' e'' gis'' | fis''4 <fis' c''>2 } |
        \break
        
        gis''4 b'8 e'' gis'' b'' | a''4 a' dis'' | dis''4 fis'8 c'' dis'' fis'' | e''4 gis'2 |
        
        \key c \major     
        <g' c'' e''>4 e''8 d'' e'' f'' | g''2. | c''4 e'8 a' b' c'' \grace{ b'16( c'' } b'2) a'4 |        
        \break
        
        <a' c''>4 c''8 b' c'' d'' | d''4 a' c'' | d''4 d''8 c'' d'' e'' | } \alternative {
          { e''2. |}
          { e''4 b' d'' |}
        } 
        
        e''4 c''8 e''\2 e''\1 b'' | <b' e'' a''>2 d''4 |
        e''2. | s2. |
        
        
      }
      \new Voice { \voiceTwo
        a2. | b2. | a2. | b2. |
        cis'2. | dis'2. | cis'2. | dis'2. |
      
        e2. | fis2. | gis2. | cis'2. |
        c'2. | g4 b d' | a2. | r2. |
        
        f2. | fis2. | g2. | gis2. | gis2. |
        
        a2. | <a fis'>2. |
        a'2. | a2. |
        
      }
      \new Voice { \voiceThree
      
      }
      \new Voice { \voiceFour
      
      }
    >>
  }
>>