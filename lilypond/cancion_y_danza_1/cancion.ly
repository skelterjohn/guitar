cancion_one={
  \time 6/8
  \key d \minor
  \partial 4
  
  d''8 e'' |
  \bar ".|:"
  
  \repeat volta 2 {
    f''4 e''8~ e'' g'' f'' |
    d''4.~d''8 f'' g'' |
    a''8. bes''16 a''8~ a'' c''' b'' |
    a''4.~a''8 b'' c''' |
    d'''8. e'''16 d'''8~ d''' c''' a'' |
    bes''8 a'' bes''~ bes'' c''' bes'' |
    a''8. g''16 f''8 <e''> <g''> <f''> |
    \alternative {
      \volta 1 {
        d''4.~ d''8 d'' e'' |
      }
      \volta 2 {
        d''4.~ d''8 a'' d''' |
      }
    }
  }
    
  c'''8 a''4 bes''8 c''' e''' |
  d'''4. cis'''8 a'' d''' |
  c'''4 bes''8 a''16 bes'' c'''8 d'''16 e'''|
  d'''2 d''8 e'' |
  f''4 e''8 d''8. e''16 d'' c'' |
  c''4. c'''8 d''' a'' |
  c'''8 b''4~ b'' g''8 |
  <d' fis' d'' a''>2\arpeggio d''8 e'' |
  
  f''4 e''8~ e'' g'' f'' |
  d''4.~d''8 f'' g'' |
  a''8. bes''16 a''8~ a'' c''' b'' |
  a''4.~a''8 b'' c''' |
  d'''8. e'''16 d'''8~ d''' c''' a'' |
  bes''8 a'' bes''~ bes'' c''' bes'' |
  a''8. g''16 f''8 <e''> <g''> <f''> |
  d''2. |
}

cancion_two={
  \time 6/8
  \key d \minor
  \partial 4
 
  r4 |
  \bar ".|:"
  
  \repeat volta 2 {
    a'4 a'8 <b'>4 cis''8 |
    <a'>4 <d' a'>8\staccato <d' a'>4. |
    <c'' f''>4 <c''>8 <d''>4. |
    <c'' e''>4 <c'' e''>8\staccato <c'' e''>4. |
    <d a a' d'' e'' e''>4\arpeggio e''8 <g' b' fis''>4. |
    <e''>4 <e''>8 <f''>4. |
    <bes'>4. <a'>8 <b' > <cis'' > |
    \alternative {
      \volta 1 {
        <a'>4 <d' a'>8\staccato <d' a'>4. |
      }
      \volta 2 {
        <a'>4 <d' a'>8\staccato <d' a'>8 r4 |
      }
    }
  }
  e''4 e''8 f''4 g''8 |
  <e'' a''>4.~ <e'' a''>8 r4 |
  <f''>4. e''4. |
  <d a d' f'' a'' d'''>2.\arpeggio |
  <d''>4 c''16 a' g'8 <a'>4 |
  f'4. c''8 d'' a' |
  c''8 b'4~ <b'>4 r8 |
  <d' fis' d'' a''>2.\arpeggio |
  
  a'4 a'8 <b'>4 cis''8 |
  <a'>4 <d' a'>8\staccato <d' a'>4. |
  <c'' f''>4 <c''>8 <d''>4. |
  <c'' e''>4 <c'' e''>8\staccato <c'' e''>4. |
  <d a a' d'' e'' e''>4\arpeggio e''8 <g' b' fis''>4. |
  <e''>4 <e''>8 <f''>4. |
  <b'>4. <a'>8 <b' > <cis'' > |
  <a'>4 <d' a'>8\staccato <d' a'>4. |
}

cancion_three={
  \time 6/8
  \key d \minor
  \partial 4
  
  r4 |
  \bar ".|:"
  
  \repeat volta 2 {
    r4. <g'>4 a'8 |
    f'4 f'8\staccato f'4. |
    a'4 a'8 g'4. |
    a'2. |
    <d a a' d'' e'' e''>4\arpeggio <a' d''>2 |
    <g'>4 <g'>8 <d''>4. |
    <e'>4 f'8 g'4 e'8 |
    \alternative {
      \volta 1 {
        <f'>4 <f'>8\staccato <f'>4. |
      }
      \volta 2 {
        <f'>4 <f'>8\staccato <f'>8 r4 |
      }
    }
  }
  r2. |
  r2. |
  <f' c'' >4. c'4. |
  <d a d' f'' a'' d'''>2.\arpeggio |
  <g'>2 <e'>4 |
  <c'>4. r4. |
  r4. <g'~>4 g'16 g' |
  <d' fis' d'' a''>2.\arpeggio |
  
  r4. <g'>4 a'8 |
  f'4 f'8\staccato f'4. |
  a'4 a'8 g'4. |
  a'2. |
  <d a a' d'' e'' e''>4\arpeggio <a' d''>2 |
  <g'>4 <g'>8 <d''>4. |
  <e'>4 f'8 g'4 e'8 |
  <f'>4 <f'>8\staccato <f'>4. |
}

cancion_four={
  \time 6/8
  \key d \minor
  \partial 4
  
  r4 |
  \bar ".|:"
  
  \repeat volta 2 {
    d4. a |
    d2. |
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        a2. | a2. |
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        <f>4 <f>8 <e>4. |
        e2. |   
      }
    >>
    <d a a' d'' e'' e''>4\arpeggio <d a>2 |
    c'4 c'8 d'4. |
    g4. a4. |
    \alternative {
      \volta 1 {
        d2. |
      }
      \volta 2 {
        d2. |
      }
    }
  }
  a4. a |
  a2. |
  r4. <d'>4 c'16 bes |
  <d a d' f'' a'' d'''>2.\arpeggio |
  c'8 <a e'>4 bes4.|
  <f>4. r4. |
  r4. <e'>4 c'8 |
  <d' fis' d'' a''>2.\arpeggio |
  
  d4. a4. |
  d2. |
    <<
      \new Voice { \voiceOne
        \set fingeringOrientations = #'(left)
        a2. | a2. |
      }
      \new Voice { \voiceTwo
        \set fingeringOrientations = #'(left)
        <f>4 <f>8 <e>4. |
        e2. |   
      }
    >>
  <d a a' d'' e'' e''>4\arpeggio <f a>2 |
  c'4 c'8 d'4. |
  g4. a4. |
  d2. |
}
