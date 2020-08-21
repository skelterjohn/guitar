\version "2.18.2"
\header {
  title = "Ditto"
  composer = "John Asmuth"
}

\include "bbarred.ly"
#(define RH rightHandFinger)

#(set-global-staff-size 27)

<<
  {
    \time 3/4
    \key c \major
    \tempo "Adagio"
   
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        
        \bar ".|:"
        
        <e''-0>8 <f''\3> <a'' cis'''>4 <b''-4>8 <d'''-2> | \bbarre #"IX" { <e'' b'' cis'''>4 a'' g'' } |
        b''8\harmonic f'' d'''4 a'' | gis''8\2 f''\3 <e''-0> cis''\4 gis'\5 <b'-0> |
        
        \break
        
        <g'-0 b'-0 d''\harmonic>8 a'\harmonic <b'-1\4> <cis''-3> <fis'-1 d''-4> <e''-0> | <e' gis' cis''>4 gis'\glissando b' |
        <g' b'>8 e'' <fis''-4> <a''-2> <e'' b''>4 | <e'' b''>2. |
        
        
        \bar ":|."
        
        \break
        
        \key cis \major
        
        r8 \fbarre #"IV" { gis' <eis'' b''>8 (bis'') g''4 } | r8 <g'-3> <cis''-4 g''-1>4 <dis''-2>4 |
        \fbarre #"IV" { eis''8 dis'' gis'' ais'' <cis'''-4> \glissando <bis''-4> } | <g''-3\2>4 <dis''-2\3> \glissando eis'' | 
        
        \break
    
        \fbarre #"IX" { eis''8 fis'' gis'' a'' b'' cis'''  | <e'' gis'' e'''>2  \key a \major d'''8 cis''' |
        <fis'' d'''>8 e''' d''' cis''' b'' gis'' } | a'' f'' <e''-0> d''\harmonic a'\harmonic <b'-0> | \break
        
        r8 e' <gis' b'> e' <gis' b'> e' | r8 fis' <a' cis''> fis' <a' cis''> fis' | 
        r8 f' <a' cis''> f' <a' b'> e'' | <gis''\3>8 a'' <b''\harmonic e'''\harmonic>2 |
         
        \break
        
        \key c \major
        
        \bar ".|:"
        
        <e''-0>8 f''\3 <a'' c'''>4 <b''-4>8 <a''> | <b'-0>8 c''\4 g''2\harmonic | <b'-0>8 <f'> c''4 a'' | <e''-2 b''-4>8 <c''-1\3> <b'-0> <a'-3\4> <g'-0> <b'-0> | \break
        <g' b' d''\harmonic>8 a'\harmonic b' c'' <f' d''> e'' | <e' b' c''>4 g' b' | <g' b'>8 e'' <f''-3> <a''-2> \bbarre #"V" { <e'' b''>4 | <c'' e'' b''>2. } | \break
        
        \bar ":|."
        
        \key e \major
        
        r8 \fbarre #"IV" { gis' <ais'' e''> \glissando b'' gis''4 | r8 dis' <b' fis''>4 dis'' | e''8 dis'' gis'' ais'' } cis''' (b'') | gis''4 dis'' e'' | \break
        \fbarre #"IX" { e''8 fis'' gis'' a'' cis''' fis''' | <e'' gis'' e'''>2 dis'''8 cis''' | dis'''8 e''' dis''' cis''' b'' gis'' } | a''8 fis'' e'' d''\harmonic a'\harmonic <b'-0> | \break
        
        \key a \major
        
        r8 e' <gis' b'> e' <gis' b'> e' | r8 fis' <a' cis''> fis' <a' cis''> fis' | 
        r8 e' <gis' cis''> e' <gis' cis''> e' |r8 <f'-2> <a' cis''> <d''-2> e''4 |
        
        
        \break
        
        \key c \major
        
        <e''>8 <f''> <a'' cis'''>4 <b''>8 <d'''> | \bbarre #"IX" { <e'' b'' cis'''>4 a'' g'' } | 
        b''8\harmonic f'' d'''4 a'' | gis''8 f'' <e''> cis'' gis' <b'> |
        
        \break
        
        <g' b' d''\harmonic>8 a'\harmonic b' cis'' <fis' d''> e'' | <e' gis' cis''>4 gis'\glissando b' |
        <g' b'>8 <e''-0> <fis''-1\2> <a''-4\2> <cis'' b''-4>4 | <b''\harmonic e'''\harmonic>2. |
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        \set stringNumberOrientations = #'(down)
        
        d'2. | a2. |
        d'2. | a2. |
        
        s2. | e2. |
        <d' g'>2. | <a cis''>2. |
        
        cis'2. | <gis-2>2 r4 |
        cis'2. | <gis'-1>2 r4 |
        
        fis'2. | cis'2. |
        b'2. | d'2. |
        
        <cis'-4>2. | <d'-4>2. |
        <d'-4>2. |  a2. |
        
        d'2. | a2. | <d'-2\5>2. | a2. |
        s2. | <a>2. | <d' g'>2. | <a>2. |
        
        cis'2. | gis2. | cis'2. | gis'2. |
        fis'2. | cis'2. | b'2. | <a>2. |
        
        <cis'-4>2. | <d'-4>2. |
        a2. | <d'-4>2. | 
        
        d'2. | a2. |
        d'2. | a2. |
        
        s2. | e2. |
        <d' g'>2. | <a cis''>2. |
      }
    >>
    
    
   
    
  }
>>