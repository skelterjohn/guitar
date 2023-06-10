ga={a'8 a'16 a' a'8}
gg={g'8 g'16 g' g'8}
gf={fis'8 fis'16 fis' fis'8}
gb={b'8 b'16 b' b'8}
gc={cis''8 cis''16 cis'' cis''8}

danza_one={
  \time 6/8
  \key d \major
  \ga \ga |
  
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
  e'4. fis'4 g'8 |
  <d a d' a'>8 <d a d' a'>16 <d a d' a'> <d a d' a'>8 <d a d' a'>4. |
  
  \repeat unfold 2 {
    <d a d'>8 <d a d'> <d a d'> <d a d'>4. |
    <d a d'>8 <d a d'> <d a d'> <d a d'>4. |
    <d a d'>8 <d a d'> <d a d'> <d' g'>4. |
    <d a d'>8\staccato <d a d'>16 <d a d'> <d a d'>8\staccato <d a d'>8\staccato <d a d'>16 <d a d'> <d a d'>8\staccato |
    <d a d'>8\staccato <d a d'>16 <d a d'> <d a d'>8\staccato <d a d'>4. |
  }
  \bar ":|.|:"
  
  \repeat volta 2 {
    \ga \gg |
    \gf d'4. |
    e'4. fis'4 g'8 
    \alternative {
      \volta 1 {
        <d a d' a'>8 <d a d' a'>16 <d a d' a'> <d a d' a'>8 <d a d' a'>4. |
      }
      \volta 2 {
        <d a d' a'>8 <d a d' a'>16 <d a d' a'> <d a d' a'>8 <d a d' a'>8 <d a d' a'>16 <d a d' a'> <d a d' a'>8 |
      }
    }
  }
  <d a d' a'>8 <d a d' a'>16 <d a d' a'> <d a d' a'>8 <d a d' a'>8 <d a d' a'>16 <d a d' a'> <d a d' a'>8 |
  
  <d a d' a'>2. |
}

danza_two={
  \time 6/8
  \key d \major
  
  R2.  |
  
  \repeat volta 2 {
    r4. r8 fis'' g'' |
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
  a''8 fis''4 r4. |
  R2. |
  r4. r8 fis''8 g'' |
  
  \bar ".|:"
  
  a''8. g''16 fis''8 e'' fis'' g'' |
  fis'' d''4 r8 e''16 fis'' g'' a'' |
  g''8. fis''16 e''8 d'' cis'' e'' |
  d''4.~ d''8 fis''16 g'' a'' b'' |
  
  c'''8. b''16 a''8~ a'' fis''16 g'' a'' b'' |
  c'''8. b''16 a''8~ a'' fis''16 g'' a'' b'' |
  c'''8. b''16 a''8 cis''' d''' b'' |
  a''2. |
  
  r4. r8 fis''16 g'' a'' b'' |
  c'''8. b''16 a''8~ a'' fis''16 g'' a'' b'' |
  c'''8. b''16 a''8~ a'' fis''16 g'' a'' b'' |
  c'''8. b''16 a''8 cis''' d''' b'' |
  a''2. |
  
  r4. r8 fis'' g'' 
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
  
  R2. |
  <d a d' a' d'' a''>2.\arpeggio |
}

danza_three={
  \time 6/8
  \key d \major
  
  d'4. d'4. |
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
  a8 a a a4 a8 |
  <d a d' a'>8 <d a d' a'>16 <d a d' a'> <d a d' a'>8 <d a d' a'>4. |
  
  \repeat unfold 2 {
    <d a d'>8 <d a d'> <d a d'> <d a d'>4. |
    <d a d'>8 <d a d'> <d a d'> <d a d'>4. |
    <d a d'>8 <d a d'> <d a d'> <d' g'>4. |
    <d a d'>8\staccato <d a d'>16 <d a d'> <d a d'>8\staccato <d a d'>8\staccato <d a d'>16 <d a d'> <d a d'>8\staccato |
    <d a d'>8\staccato <d a d'>16 <d a d'> <d a d'>8\staccato <d a d'>4. |
  }
  \bar ":|.|:"
  
  \repeat volta 2 {
    d'4. c'4. |
    b4. g4. |
    a8 a a a4 a8 |
    \alternative {
      \volta 1 {
        <d a d' a'>8 <d a d' a'>16 <d a d' a'> <d a d' a'>8 <d a d' a'>4. |
      }
      \volta 2 {
        <d a d' a'>8 <d a d' a'>16 <d a d' a'> <d a d' a'>8 <d a d' a'>8 <d a d' a'>16 <d a d' a'> <d a d' a'>8 |
      }
    }
  }
  <d a d' a'>8 <d a d' a'>16 <d a d' a'> <d a d' a'>8 <d a d' a'>8 <d a d' a'>16 <d a d' a'> <d a d' a'>8 |
  
  <d a d' a'>2. |
    
}

danza_four={
  \time 6/8
  \key d \major
  
  R2.  |
  
  \repeat volta 2 {
    R2. |
    R2. |
    r4. r8 fis''8  g'' |
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
  fis'4.~ fis'8 a'16 b' d'' e'' |
  
  fis''8. e''16 d''8~ d'' a'16 b' d'' e'' |
  fis''8. e''16 d''8~ d'' a'16 b' d'' e'' |
  fis''8. e''16 d''8 g'' fis'' e'' |
  d''2. |
  
  r4. r8 a'16 b' d'' e'' |
  
  fis''8. e''16 d''8~ d'' a'16 b' d'' e'' |
  fis''8. e''16 d''8~ d'' a'16 b' d'' e'' |
  fis''8. e''16 d''8 g'' fis'' e'' |
  d''2. |
  
  r4. r8 a' b' 
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
  
  R2. |
  <d a d' a' d'' a''>2.\arpeggio |
}
