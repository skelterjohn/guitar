\version "2.18.2"
\header {
  title = "Ditto"
  composer = "John Asmuth"
}

\include "bbarred.ly"
#(define RH rightHandFinger)

#(set-global-staff-size 24)

<<
  {
    \time 3/4
    \key c \major
    \tempo "Adagio"
   
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        
        
        <e''-0>8 <f''\3> <a'' cis'''>4 <b''-4>8 <d'''-2> | \bbarre #"IX" { <e'' b'' cis'''>4 a'' g'' } |
        b''8\harmonic f'' d'''4 a'' | gis''8\2 f''\3 <e''-0> cis''\4 gis'\5 <b'-0> |
        
        
        <g' b' d''\harmonic>8 a'\harmonic b' cis'' <fis' d''> e'' | <e' gis' cis''>4 gis'\glissando b' |
        <g' b'>8 e'' fis'' a'' <e'' b''>4 | <e'' b''>2. |
        
        <e''-0>8 <f''\3> <a'' cis'''>4 <b''-4>8 <d'''-2> | \bbarre #"IX" { <e'' b'' cis'''>4 a'' g'' } |
        b''8\harmonic f'' d'''4 a'' | gis''8\2 f''\3 <e''-0> cis''\4 gis'\5 <b'-0> |
        
        
        <g' b' d''\harmonic>8 a'\harmonic b' cis'' <fis' d''> e'' | <e' gis' cis''>4 gis'\glissando b' |
        <g' b'>8 e'' fis'' a'' <e'' b''>4 | <e'' b''>2. |
        
        
        \key cis \major
        
        r8 gis' <eis'' b''>8 (bis'') g''4 | r8 <g'-3> <cis''-2 g''>4 <dis''-2>4 |
        eis''8 dis'' gis'' ais'' <cis'''-4> \glissando <bis''-4> | <g''-3>4 <dis''-2> \glissando eis'' | 
        
        \key c \major
    
        eis''8 dis'' a'' gis'' \fbarre #"IX" {  d''' cis'''  | <e'' gis'' e'''>2 d'''8 cis''' } |
        a'' eis'' <e''-0> d''\harmonic a'\harmonic <b'-0> | r8 e' <gis' b'> e' <gis' b'> e' | 

        r8 fis' <a' cis''> fis' <a' cis''> fis' | r8 e' <gis' cis''> e' <gis' cis''> e' | 
        r8 f' <a' cis''> f' <a' b'> e'' | <gis''\3>8 b''\harmonic e'''2\harmonic |
        
        <e''-0>8 <f''\3> <a'' cis'''>4 <b''-4>8 <d'''-2> | \bbarre #"IX" { <e'' b'' cis'''>4 a'' g'' } |
        b''8\harmonic f'' d'''4 a'' | gis''8\2 f''\3 <e''-0> cis''\4 gis'\5 <b'-0> |
        
        
        <g' b' d''\harmonic>8 a'\harmonic b' cis'' <fis' d''> e'' | <e' gis' cis''>4 gis'\glissando b' |
        <g' b'>8 <e''-0> fis'' <a''-2\2> <cis'' b''>4 | <b''\harmonic e'''\harmonic>2. |
      }
      \new Voice { \voiceTwo
        d'2. | a2. |
        d'2. | a2. |
        
        s2. | e2. |
        <d' g'>2. | <a cis''>2. |
        
        d'2. | a2. |
        d'2. | a2. |
        
        s2. | e2. |
        <d' g'>2. | <a cis''>2. |
        
        cis'2. | <gis-2>2. |
        cis'2. | gis'2 r4 |
        
        d'2. | cis'2. |
        d'2. | cis'2. |
        
        d'2. | a2. |
        d'2. | a2. |
        
        d'2. | a2. |
        d'2. | a2. |
        
        s2. | e2. |
        <d' g'>2. | <a cis''>2. |
      }
    >>
    
    
   
    
  }
>>