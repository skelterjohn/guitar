ga={a'8 a'16 a' a'8}
gg={g'8 g'16 g' g'8}
gf={fis'8 fis'16 fis' fis'8}
gb={b'8 b'16 b' b'8}
gc={cis''8 cis''16 cis'' cis''8}

danza_two={
  \set strokeFingerOrientations = #'(down)
  \tempo 4.=80
  
  \time 6/8
  \key d \major
  a'8_\mp a'16 a' a'8 \ga |
  
  \bar ".|:"
  
  \repeat volta 2 {
    \ga \ga |
    \ga \gg |
    \ga \ga |
    \ga \gb |
    \gc d''8 a'16 a' a'8 |
    \ga \gg |
    \gf d'4. |
    e'4. fis'4 g'8
    \alternative {
      \volta 1 {
        \ga \ga |
      }
      \volta 2 {
        <d' a'>8 <d' a'>16 <d' a'> <d' a'>8 <d' a'>4. |
      }
    }
  }
  
  \gb \gc |
  \ga r4. |
  \gc \gb |
  \ga \ga |
  \ga \gg
  \gf d'8 r4 |
  e'4. fis'4 g'8
  <d' a'>8 <d' a'>16 <d' a'> <d' a'>8 <d' a'>4. |
  
  \gb \gc |
  \ga r4. |
  \gc \gb |
  \ga \ga |
  
  \bar ".|:"
  
  \ga \gg |
  \gf d'4. |
  e'4._\< fis'4 g'8_\! |
  <d\RH1 a d' a'>8\strumUp_\f <d\RH4 a d' a'>16\strumDown <d\RH3 a d' a'>\strumDown <d\RH2 a d' a'>8\strumDown <d\RH1 a d' a'>4.\strumUp |
  
  \allbreak
  
  <d\RH1 a d'>8\strumUp_\mf <d\RH1 a d'>\strumUp <d\RH1 a d'>\strumUp <d\RH1 a d'>4.\strumUp |
  <d a d'>8 <d a d'> <d a d'> <d a d'>4. |
  <d a d'>8 <d a d'> <d a d'> <d' g'>4. |
  <d\RH1 a d'>8\strumUp_\mp <d\RH4 a d'>16\strumDown <d\RH3 a d'>\strumDown <d\RH2 a d'>8\strumDown <d a d'>8 <d a d'>16 <d a d'> <d a d'>8 |
  <d a d'>8 <d a d'>16 <d a d'> <d a d'>8 <d a d'>4. |
  
  \allbreak
  
  <d a d'>8_\mf <d a d'> <d a d'> <d a d'>4. |
  <d a d'>8 <d a d'> <d a d'> <d a d'>4. |
  <d a d'>8 <d a d'> <d a d'> <d' g'>4. |
  
  <d a d'>8_\mp <d a d'>16 <d a d'> <d a d'>8 <d a d'>8 <d a d'>16 <d a d'> <d a d'>8 |
  <d a d'>8 <d a d'>16 <d a d'> <d a d'>8 <d a d'>4. |
  
  \allbreak
    
  \bar ":|.|:"
  
  \repeat volta 2 {
    a'8_\mp a'16 a' a'8 \gg |
    \gf d'4. |
    e'4. fis'4 g'8 
    \alternative {
      \volta 1 {
        <d\RH1 a d' a'>8_\mf <d\RH4 a d' a'>16 <d\RH3 a d' a'> <d\RH2 a d' a'>8 <d\RH1 a d' a'>4. |
      }
      \volta 2 {
        <d\RH1 a d' a'>8_\<_\p <d\RH4 a d' a'>16 <d\RH3 a d' a'> <d\RH2 a d' a'>8 <d\RH1 a d' a'>8 <d\RH4 a d' a'>16 <d\RH3 a d' a'> <d\RH2 a d' a'>8 |
      }
    }
  }
  <d\RH1 a d' a'>8 <d\RH4 a d' a'>16 <d\RH3 a d' a'> <d\RH2 a d' a'>8 <d\RH1 a d' a'>8 <d\RH4 a d' a'>16 <d\RH3 a d' a'> <d\RH2 a d' a'>8_\! |
  
  <d a d' a' d'' a''>2.\arpeggio\fermata_\ff |
}

danza_one={
  \tempo 4.=80
  \time 6/8
  \key d \major
  
  R2.  |
  
  \repeat volta 2 {
    r4. r8 fis''_\mf g'' |
    a''8. g''16 fis''8 e'' fis'' g'' |
    fis''8 d''4 r4. |
    R2. |
    r4. r8 fis''8 g'' |
    a''8. g''16 fis''8 e'' fis'' g'' |
    fis''8 d''4 r8 e''16 fis'' g'' a'' |
    g''8. fis''16 e''8 d'' cis'' e'' |
    \alternative {
      \volta 1 {
        d''2.
      }
      \volta 2 {
        d''4.~ d''8 fis''16 g'' a'' b'' |
      }
    }
  }
  
  a''8. g''16 fis''8 g'' a'' b'' |
  a'' fis''4 r4. |
  R2. |
  r4. r8 fis'' g'' |
  a''8. g''16 fis''8 e'' fis'' g'' |
  fis''8 d''4 r8 e''16 fis'' g'' a'' |
  g''8. fis''16 e''8 d'' cis'' e'' |
  d''4.~ d''8 fis''16 g'' a'' b'' |
  
  a''8. g''16 fis''8 g'' a'' b'' |
  a''8 fis''8 a'8 r4. |
  R2. |
  r4. r8 fis''8 g'' |
  
  \bar ".|:"
  
  a''8. g''16 fis''8 e'' fis'' g'' |
  fis'' d''4 r8 e''16 fis'' g'' a'' |
  g''8. fis''16 e''8 d'' cis'' e'' |
  d''4.~ d''8 fis''16_\f g'' a'' b'' |
  
  c'''8. b''16 a''8~ a'' fis''16 g'' a'' b'' |
  c'''8. b''16 a''8~ a'' fis''16 g'' a'' b'' |
  c'''8. b''16 a''8 cis''' d''' b'' |
  a''2. |
  
  r4. r8 fis''16 g'' a'' b'' |
  c'''8. b''16 a''8~ a'' fis''16 g'' a'' b'' |
  c'''8. b''16 a''8~ a'' fis''16 g'' a'' b'' |
  c'''8. b''16 a''8 cis''' d''' b'' |
  a''2. |
  
  r4. r8 fis''_\mf g'' 
  \bar ":|.|:"
  
  \repeat volta 2 {
    a''8. g''16 fis''8 e'' fis'' g'' |
    fis''8 d''4 r8 e''16 fis'' g'' a'' |
    g''8. fis''16 e''8 d'' cis'' e'' |
    \alternative {
      \volta 1 {
        d''4.~ d''8 fis'' g'' | 
      }
      \volta 2 {
        d''2. |
      }
    }
  }
  
  <d\RH1 a d' a'>8_\< <d\RH4 a d' a'>16 <d\RH3 a d' a'> <d\RH2 a d' a'>8 <d\RH1 a d' a'>8 <d\RH4 a d' a'>16 <d\RH3 a d' a'> <d\RH2 a d' a'>8_\! |
  <d a d' a' d'' a''>2.\arpeggio\fermata_\ff |
}

danza_three={
  \set strokeFingerOrientations = #'(down)
  \tempo 4.=80
  \time 6/8
  \key d \major
  
  d'4._\mp d'4. |
  \repeat volta 2 {
    d'4. d'4. |
    d'4. c'4. |
    d'4. d'4. |
    d'4. d'4. |
    d'4. d'4. |
    d'4. c'4. |
    b4. g4. |
    a8 a a a4 a8 |
    \alternative {
      \volta 1 {
        <d d'>4. <d d'>4.
      }
      \volta 2 {
        <<
          \new Voice { \voiceOne
            \set fingeringOrientations = #'(left)
            <d' a'>8 <d' a'>16 <d' a'> <d' a'>8 <d' a'>4. |
          }
          \new Voice { \voiceTwo
            \set fingeringOrientations = #'(left)
            d4. d4. |
          }
        >>
      }
    }
  }
    
  d'4. d'4. |
  d'4. d4. |
  d'4. d'4. |
  d'4. d4. |
  d'4. c'4. |
  b4. g4. |
  a8 a a a4 a8 |
  <<
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      <d' a'>8 <d' a'>16 <d' a'> <d' a'>8 <d' a'>4. |
    }
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      d4. d4. |
    }
  >>
  
  d'4. d'4. |
  <<
    \new Voice { \voiceTwo
      \set fingeringOrientations = #'(left)
      d'4. d4. |
    }
    \new Voice { \voiceOne
      \set fingeringOrientations = #'(left)
      d''8 d'' d'' r4. |
    }
  >>
  d'4. d'4. |
  d'4. <d d'>4. |
  
  \bar ".|:"
  
  d'4. c'4. |
  b4. g4. |
  a8_\< a a a4 a8_\! |
  <d\RH1 a d' a'>8\strumUp_\f <d\RH4 a d' a'>16\strumDown <d\RH3 a d' a'>\strumDown <d\RH2 a d' a'>8\strumDown <d\RH1 a d' a'>4.\strumUp |
  
  <d\RH1 a d'>8\strumUp_\mf <d\RH1 a d'>\strumUp <d\RH1 a d'>\strumUp <d\RH1 a d'>4.\strumUp |
  <d a d'>8 <d a d'> <d a d'> <d a d'>4. |
  <d a d'>8 <d a d'> <d a d'> <d' g'>4. |
  <d\RH1 a d'>8\strumUp_\mp <d\RH4 a d'>16\strumDown <d\RH3 a d'>\strumDown <d\RH2 a d'>8\strumDown <d a d'>8 <d a d'>16 <d a d'> <d a d'>8 |
  <d a d'>8 <d a d'>16 <d a d'> <d a d'>8 <d a d'>4. |
  
  <d a d'>8_\mf <d a d'> <d a d'> <d a d'>4. |
  <d a d'>8 <d a d'> <d a d'> <d a d'>4. |
  <d a d'>8 <d a d'> <d a d'> <d' g'>4. |
  
  <d a d'>8_\mp <d a d'>16 <d a d'> <d a d'>8 <d a d'>8 <d a d'>16 <d a d'> <d a d'>8 |
  <d a d'>8 <d a d'>16 <d a d'> <d a d'>8 <d a d'>4. |
  
  \bar ":|.|:"
  
  \repeat volta 2 {
    d'4._\mp c'4. |
    b4. g4. |
    a8 a a a4 a8 |
    \alternative {
      \volta 1 {
        <d\RH1 a d' a'>8_\mf <d\RH4 a d' a'>16 <d\RH3 a d' a'> <d\RH2 a d' a'>8 <d\RH1 a d' a'>4. |
      }
      \volta 2 {
        <d\RH1 a d' a'>8_\<_\p <d\RH4 a d' a'>16 <d\RH3 a d' a'> <d\RH2 a d' a'>8 <d\RH1 a d' a'>8 <d\RH4 a d' a'>16 <d\RH3 a d' a'> <d\RH2 a d' a'>8 |
      }
    }
  }
  <d\RH1 a d' a'>8 <d\RH4 a d' a'>16 <d\RH3 a d' a'> <d\RH2 a d' a'>8 <d\RH1 a d' a'>8 <d\RH4 a d' a'>16 <d\RH3 a d' a'> <d\RH2 a d' a'>8_\! |
  
  <d a d' a' d'' a''>2.\arpeggio\fermata |
    
}

danza_four={
  \tempo 4.=80
  \time 6/8
  \key d \major
  
  R2.  |
  
  \repeat volta 2 {
    R2. |
    R2. |
    r4. r8 fis''8_\mf g'' |
    a''8. g''16 fis''8 g'' a'' b'' |
    a''4. r4. |
    R2. |
    r4. r8 g'16 a' b' d'' |
    b'8. a'16 g'8 fis' e' g' |
    \alternative {
      \volta 1 {
        fis'2.
      }
      \volta 2 {
        fis'4. r4. |
      }
    }
  }
  
  R2. |
  r4. r8 fis''16 g'' a'' b'' |
  a''8. g''16 fis''8 g'' a'' b'' |
  a''4. r4. |
  R2. |
  r4. r8 g'16 a' b' d'' |
  b'8. a'16 g'8 fis' e' g' |
  fis'4. r4. |
  
  R2. |
  r4. r8 fis''16 g'' a'' b'' |
  a''8. g''16 fis''8 g'' a'' b'' |
  a''4. r4.
  
  \bar ".|:"
  
  R2. |
  r4. r8 g'16 a' b' d'' |
  b'8. a'16 g'8 fis' e' g' |
  fis'4.~ fis'8 a'16_\f b' d'' e'' |
  
  fis''8. e''16 d''8~ d'' a'16 b' d'' e'' |
  fis''8. e''16 d''8~ d'' a'16 b' d'' e'' |
  fis''8. e''16 d''8 g'' fis'' e'' |
  d''2. |
  
  r4. r8 a'16 b' d'' e'' |
  
  fis''8. e''16 d''8~ d'' a'16 b' d'' e'' |
  fis''8. e''16 d''8~ d'' a'16 b' d'' e'' |
  fis''8. e''16 d''8 g'' fis'' e'' |
  d''2. |
  
  r4. r8 a'_\mf b' 
  \bar ":|.|:"
  
  \repeat volta 2 {
    d''8. b'16 a'8 g' a' c'' |
    b'8 g'4 r8 a'16 a' a' a' |
    a'8. a'16 a'8 g' g' g' |
    \alternative {
      \volta 1 {
        a'4.~ a'8 a' b'  | 
      }
      \volta 2 {
        a'2. |
      }
    }
  }
  
  <d\RH1 a d' a'>8_\< <d\RH4 a d' a'>16 <d\RH3 a d' a'> <d\RH2 a d' a'>8 <d\RH1 a d' a'>8 <d\RH4 a d' a'>16 <d\RH3 a d' a'> <d\RH2 a d' a'>8_\! |
  <d a d' a' d'' a''>2.\arpeggio\fermata_\ff |
}
